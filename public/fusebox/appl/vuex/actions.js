export default {
    addSelection ({ commit }, text) {
      commit("addSelection", {
        text,
        count: 1
      });
    },
  
    editSelection ({ commit }, index ) {
      commit("editSelection", index );
    },
  
    clearAll ({ state, commit }) {
      if(state.selections) {
        commit("clearSelections", state);
      }
    }
  };
  