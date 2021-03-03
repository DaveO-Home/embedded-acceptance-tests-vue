<template>
  <span id="data">
    <h4>
      Tools - Count {{ text }} selected {{ count }} times (from Vuex store)
    </h4>
    <section class="float-left">
      <div
        id="dropdown1"
        class="dropdown"
      >
        <button
          id="dropdown0"
          class="dropdown-toggle smallerfont"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Select Job Type
        </button>
        <div
          class="dropdown-menu pointer"
          aria-labelledby="dropdown0"
        >
          <a
            class="dropdown-item smallerfont"
            @click="addSelection"
          >Combined</a>
          <a
            class="dropdown-item smallerfont"
            @click="addSelection"
          >Category1</a>
          <a
            class="dropdown-item smallerfont"
            @click="addSelection"
          >Category2</a>
        </div>
      </div>
    </section>
    <Suspense>
      <template #default>
        <AsyncToolsLoad />
      </template>
      <template #fallback>
        <pre>
          <div><strong>             Loading...</strong></div>
        </pre>
      </template>
    </Suspense>
  </span>
</template>

<script>
import table from "../js/controller/table";
import setup from "../js/utils/setup";
import app from "../js/app";
import helpers from "../js/utils/helpers";
import { defineAsyncComponent } from "vue";
import { useStore } from "vuex";

const AsyncToolsLoad = defineAsyncComponent(() => {
  const tools = new Promise((resolve) => {
    getData(resolve);
  });
  return tools;
});

export default {
  name: "ToolsC",
  components: { AsyncToolsLoad },
   data() {
    this.loadTools();
    return {};
  },
  computed: {
    count() {
      return this.$store.state.count;
    },
    text() {
      return this.$store.state.text;
    }
  },
  mounted() {
    const store = useStore();
    store.dispatch("clearAll");
    store.dispatch("addSelection", "Combined");
    setup.init(); 
  },
  methods: {
    addSelection(e) {
      const text = e.target.innerText;
      if (text.trim()) {
        const index = findSelectionIndex(this.$store.state.selections, text);
        if (index < 0) {
          this.$store.dispatch("addSelection", text);
        } else {
          this.$store.dispatch("editSelection", index);
        }
      }
    },
    loadTools() {
      const controllerName = "Table";
      const actionName = "tools";
      const failMsg = `Load problem with: '${controllerName}/${actionName}'.`;
      app.loadController(
        controllerName,
        table,
        (controller) => {
          if (controller && controller[actionName]) {
            controller[actionName]({});
          } else {
            console.error(failMsg);
          }
        },
        (err) => {
          console.error(`${failMsg} - ${err}`);
        }
      );
    },
  }
};

function getData(asyncResolve) {
  new Promise(function (resolve, reject) {
    let count = 0;
    helpers.isLoaded(resolve, reject, "", table, count, 10);
  })
    .catch(function (rejected) {
      console.warn("Failed", rejected);
    })
    .then(function (resolved) {
      return asyncResolve({
        template: resolved,
        mounted() {
          table.decorateTable("tools");
          helpers.scrollTop();
          $("#dropdown1").on("click", table.dropdownEvent);
          if (app.controllers["Start"]) {
            app.controllers["Start"].initMenu();
          }
        }
      });
    });
}

function findSelectionIndex (selections, text) {
  let selection = selections.find(s => s.text === text);
  return selections.indexOf(selection);
}
</script>

<style scoped>
    span,table,div tbody {
        font-size: 13px;  
        line-height: 1.2; 
        padding: 5px;
    }
    table tr td { 
        margin:5px; padding:5px;
    }
    h4,h3 {
        text-align: center;
    }
    #table_info {
        font-size: 14px;
        color: #99bfe6;
        cursor: pointer;
    }
    .smallerfont {
        font-size: 14px;
    }
    .pointer {
        cursor: pointer;
    }
</style>
