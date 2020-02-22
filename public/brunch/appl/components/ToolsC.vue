<template>
  <span id="data">
    <h4>
      Tools - Count {{ text }} selected {{ count }} times (from Vuex store)
    </h4>
    <section class="float-left">
            
      <div id="dropdown1" class="dropdown">
        <button id="dropdown0" class="dropdown-toggle smallerfont" type="button"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Select Job Type 
        </button>
        <div class="dropdown-menu pointer" aria-labelledby="dropdown0">
          <a class="dropdown-item smallerfont" @click="addSelection">Combined</a>
          <a class="dropdown-item smallerfont" @click="addSelection">Category1</a>
          <a class="dropdown-item smallerfont" @click="addSelection">Category2</a>
        </div>
      </div>
            
    </section>
    <span v-html="tools" />
  </span>
</template>

<script>
import Table from "../js/controller/table";
import Setup from "../js/utils/setup";
import App from "../js/app";
import Helpers from "../js/utils/helpers";

let that;
let inPromise = false;
let table = {
  tools: null,
      text: null,
      count: 0
};

export default {
  name: "ToolsC",
  data() {
    that = this;
    this.loadTools();
    this.getData();
    return table;
  },
  computed: {
    selections () {
      return this.$store.state.selections;
    }
  },
  mounted: function() {
    table.text = "Combined";
    table.count = 1;
    this.$store.dispatch("clearAll");
    this.$store.dispatch("addSelection", table.text);
    this.$nextTick(function() {
      Setup.init();
    });
  },
  methods: {
    addSelection (e) {
      const text = e.target.innerText;
      if (text.trim()) {
        table.text = text;
        let index = findSelectionIndex (this.$store.state.selections, text);
        if(index < 0) {
          this.$store.dispatch("addSelection", text);
          table.count = this.$store.state.selections[this.$store.state.selections.length - 1].count;
        }
        else {
          this.$store.dispatch("editSelection", index);
          table.count = this.$store.state.selections[index].count;
        }
      }
    },
    loadTools() {
      const controllerName = "Table";
      const actionName = "tools";
      const failMsg = `Load problem with: '${controllerName}/${actionName}'.`;
      App.loadController(
        controllerName,
        Table,
        controller => {
          if (controller && controller[actionName]) {
            controller[actionName]({});
          } else {
            console.error(failMsg);
          }
        },
        err => {
          console.error(`${failMsg} - ${err}`);
        }
      );
    },
    getData() {
      if (inPromise) {
        return table.tools;
      }
      inPromise = true;
      new Promise(function(resolve, reject) {
        let count = 0;
        Helpers.isLoaded(resolve, reject, table.tools, Table, count, 10);
      })
        .catch(function(rejected) {
          console.warn("Failed", rejected);
        })
        .then(function(resolved) {
          table.tools = resolved;
          inPromise = false;
          that.$nextTick(function() {
            Table.decorateTable("tools");
            Helpers.scrollTop();
            $("#dropdown1").on("click", Table.dropdownEvent);
            if (App.controllers["Start"]) {
              App.controllers["Start"].initMenu();
            }
          });
          return table.tools;
        });
    }
  }
};

function findSelectionIndex (selections, text) {
  let selection = selections.find(s => s.text === text);
  return selections.indexOf(selection);
}
</script>
