import Vue from 'vue';
import Vuex from 'vuex';
import { ViewEventModule } from './modules/viewEvents.module';
import { getAllNotebooks, getAllNotes } from '@/utils/indexedDB/notesStorage';
import { Notebook, Note } from '@/utils/orm.models';

Vue.use(Vuex);

interface NotesTree {
  id: number;
  name: string;
  children: Note[];
}

interface MainState {
  notebooks: Notebook[] | [];
  notes: Note[] | [];
  notesTree: NotesTree[] | [];
}

function createNoteTree(notebooks: Notebook[], notes: Note[]) {
  notebooks.sort((v1, v2) => {
    return v1.id - v2.id;
  });
  return notebooks.map((notebook: Notebook) => {
    const currentNotes = notes.filter((note) => {
      return note.notebook === notebook.name;
    });
    return {
      id: notebook.id,
      name: notebook.name,
      children: currentNotes,
    };
  });
}

export default new Vuex.Store<MainState>({
  state: {
    notebooks: [],
    notes: [],
    notesTree: [],
  },
  mutations: {
    async setNotesTree(state: MainState, payload: NotesTree[]) {
      state.notesTree = payload;
    },
  },
  actions: {
    async getNodeTree({state, commit}) {
      state.notebooks = await getAllNotebooks();
      state.notes = await getAllNotes();
      const notesTree = createNoteTree(state.notebooks, state.notes);
      commit('setNotesTree', notesTree);
    },
  },
  getters: {
  },
  modules: {
    ViewEventModule,
  },
});
