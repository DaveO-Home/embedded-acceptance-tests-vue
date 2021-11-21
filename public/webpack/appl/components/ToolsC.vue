<template>
  <span id="data">
    <h4>
      Tools - Count {{ text }} selected {{ count }} times (from Vuex store)
    </h4>
    <section class="float-left">
      <div id="dropdown1" class="dropdown">
        <button
          id="dropdown0"
          class="dropdown-toggle smallerfont"
          type="button"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Select Job Type
        </button>
        <div class="dropdown-menu pointer" aria-labelledby="dropdown0">
          <a class="dropdown-item smallerfont pointer" @click="addSelection"
            >Combined</a
          >
          <a class="dropdown-item smallerfont pointer" @click="addSelection"
            >Category1</a
          >
          <a class="dropdown-item smallerfont pointer" @click="addSelection"
            >Category2</a
          >
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
import Table from "table";
import Setup from "setup";
import App from "app";
import Helpers from "helpers";
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
    },
  },
  mounted() {
    const store = useStore();
    store.dispatch("clearAll");
    store.dispatch("addSelection", "Combined");
    Setup.init();
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
      App.loadController(
        controllerName,
        Table,
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
  },
};

function getData(asyncResolve) {
  new Promise((resolve, reject) => {
    let count = 0;
    Helpers.isLoaded(resolve, reject, "", Table, count, 10);
  })
    .catch(function (rejected) {
      console.warn("Failed", rejected);
    })
    .then(function (resolved) {
      return asyncResolve({
        template: resolved,
        mounted() {
          Table.decorateTable("tools");
          Helpers.scrollTop();
          $("#dropdown1").on("click", Table.dropdownEvent);
          if (App.controllers["Start"]) {
            App.controllers["Start"].initMenu();
          }
        },
      });
    });
}

function findSelectionIndex(selections, text) {
  let selection = selections.find((s) => s.text === text);
  return selections.indexOf(selection);
}
</script>

<style scoped>
#app span,
table,
div tbody {
  font-size: 13px;
  line-height: 1.2;
  padding: 5px;
}
#app table tr td {
  margin: 5px;
  padding: 5px;
}
h4,
h3 {
  text-align: center;
}
.smallerfont {
  font-size: 14px;
}
.pointer {
  cursor: pointer;
}
</style>