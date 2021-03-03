export const STORAGE_KEY = "table-selection";

// for testing
if (window.testit) {
  window.localStorage.clear();
}

export const mutations = {
  addSelection (state, selection) {
        state.selections.push(selection);
        state.count = selection.count;
        state.text = selection.text;
  },

  removeSelection (state, selection) {
    state.selections.splice(state.selections.indexOf(selection), 1);
  },

  clearSelections ( state ) {
    state.selections = [];
    state.count = 0;
    state.text = "Combined";
  },

  editSelection (state, index ) {
    const selection = state.selections[index];
    const count = selection.count + 1;
    const text = selection.text;
    state.count = count;
    state.text = text;

    state.selections.splice(index, 1, {
      selection,
      text,
      count
    });
  }
};