import Vue from 'vue';
import Vuex from 'vuex';
import { ViewEventModule } from './modules/viewEvents.module';
import { getAllNotebooks, getAllNotes, getAllRecycleNotes } from '@/utils/indexedDB/notesStorage';
import { createNewNotebookFromString, saveNotebookToStore, saveNoteToStore } from '@/utils/indexedDB/notesStorage';
import { moveNoteToRecycleBin, deleteNotebookFromStore } from '@/utils/indexedDB/notesStorage';
import { deleteExistingNote } from '@/utils/indexedDB/notesStorage';
import { Notebook, Note } from '@/utils/orm.models';
import { defaultMonacoLanguage, defaultMonacoData } from '@/utils/orm.models';

Vue.use(Vuex);

interface NotesTree {
  id: number;
  order: number;
  name: string;
  children: Note[];
}

export interface MainState {
  notebooks: Notebook[] | [];
  notes: Note[] | [];
  recycle: Note[] | [];
  openedNotebook: Notebook | undefined;
  activeNote: Note | undefined;
}

function createNoteTree(notebooks: Notebook[], notes: Note[]) {
  notebooks.sort((v1, v2) => {
    return v1.id - v2.id;
  });
  let currentOrder = 0;
  return notebooks.map((notebook: Notebook) => {
    notebook.order = currentOrder;
    currentOrder++;

    const currentNotes = notes.filter((note) => {
      return note.notebookId === notebook.id;
    }).map((v: Note) => {
      v.order = currentOrder;
      currentOrder++;
      return v;
    });

    return Object.assign({}, notebook, {
      children: currentNotes,
    });
  });
}

function getCurrentNoteBookId(state: MainState) {
  return state.openedNotebook ? state.openedNotebook.id : state.notebooks[0].id;
}

function getNewId(state: MainState) {
  let newId = 0;
  if (state.notes && state.notes.length > 0) {
    const sortedId = (state.notes as Note[]).sort((v1: Note, v2: Note) => {
      return v1.id - v2.id;
    });
    newId = sortedId[sortedId.length - 1].id + 1;
  }
  return newId;
}

function createNewNote(state: MainState) {
  return {
    id: getNewId(state),
    notebookId: getCurrentNoteBookId(state),
    name: 'New code note',
    type: 0,
    order: 0,
    data: defaultMonacoData,
    language: defaultMonacoLanguage,
    isNewNote: true,
  };
}

export default new Vuex.Store<MainState>({
  strict: true,
  state: {
    notebooks: [],
    notes: [],
    recycle: [],
    openedNotebook: undefined,
    activeNote: undefined,
  },
  mutations: {
    setAllNotebooks(state: MainState, payload: Notebook[]) {
      state.notebooks = payload;
    },
    setAllNotes(state: MainState, payload: Note[]) {
      state.notes = payload;
    },
    setAllRecycleNotes(state: MainState, payload: Note[]) {
      state.recycle = payload;
    },
    deleteNotebook(state: MainState, payload: Notebook) {
      if (state.notebooks.length > 0) {
        state.notebooks = (state.notebooks as Notebook[])
        .filter((v) => v.id !== payload.id);
      }
    },
    addNewNoteToStore(state: MainState) {
      if (state.notebooks && state.notebooks.length > 0) {
        state.activeNote = createNewNote(state);
        (state.notes as Note[]).push(state.activeNote);
        const notebooks = (state.notebooks as Notebook[]).map((v) => v);
        const notes = (state.notebooks as Note[]).map((v) => v);
      }
    },
    deleteActiveNoteFromStore(state: MainState) {
      if (state.activeNote && !state.activeNote.isNewNote && state.activeNote.id) {
        moveNoteToRecycleBin(state.activeNote);
        deleteExistingNote(state.activeNote.id);
        state.notes = (state.notebooks as Note[])
        .filter((v) => v.id !== (state.activeNote as Note).id);
      } else if (state.activeNote && state.activeNote.isNewNote) {
        state.notes = (state.notebooks as Note[])
        .filter((v) => v.id !== (state.activeNote as Note).id);
        state.activeNote = createNewNote(state);
      }
    },
    setOpenedNotebook(state: MainState, payload: number) {
      if (state.openedNotebook && state.openedNotebook.id === payload) {
        return;
      }
      state.openedNotebook = (state.notebooks as Notebook[])
      .find((v) => v.id === payload) as Notebook;
      if (state.openedNotebook) {
        const notebookId = state.openedNotebook.id;
        state.activeNote = (state.notes as Note[])
        .find((v) => v.notebookId === notebookId);
      }
    },
    setActiveNote(state: MainState, payload: number) {
      state.activeNote = (state.notes as Note[])
      .find((v) => v.id === payload);
      if (state.activeNote) {
        const notebookId =  state.activeNote.notebookId;
        state.openedNotebook = (state.notebooks as Notebook[])
        .find((v) => v.id === notebookId);
      }
    },
    showDeletedNote(state: MainState, payload: Note) {
      payload.isDeletedNote = true;
      state.activeNote = payload;
      if (state.activeNote) {
        const notebookId =  state.activeNote.notebookId;
        state.openedNotebook = {
          id: 0,
          name: 'Recycle bin',
          order: 0,
        };
      }
    },
    changeActiveNoteName(state: MainState, payload: string) {
      if (state.activeNote) {
        state.activeNote.name = payload;
        state.activeNote = Object.assign({}, state.activeNote);
      }
    },
    changeActiveNoteLanguage(state: MainState, payload: string) {
      if (state.activeNote) {
        state.activeNote.language = payload;
        state.activeNote = Object.assign({}, state.activeNote);
      }
    },
    changeActiveNoteData(state: MainState, payload: string) {
      if (state.activeNote) {
        state.activeNote.data = payload;
        state.activeNote = Object.assign({}, state.activeNote);
      }
    },
    changeNotebookForActiveNote(state: MainState, payload: number) {
      if (state.activeNote) {
        state.activeNote.notebookId = payload;
        state.activeNote = Object.assign({}, state.activeNote);
      }
    },
  },
  actions: {
    async getAllDataFromIndexedDb({state, commit}) {
      const notebooks = await getAllNotebooks();
      const notes = await getAllNotes();
      const recycle = await getAllRecycleNotes();
      commit('setAllNotebooks', notebooks);
      commit('setAllNotes', notes);
      commit('setAllRecycleNotes', recycle);
    },
    async saveNewNotebook({dispatch}, payload: string) {
      const notebook = await createNewNotebookFromString(payload);
      await saveNotebookToStore(notebook);
      dispatch('getAllDataFromIndexedDb');
    },
    async deleteNotebook({commit , dispatch}, payload: Notebook) {
      const deleted = await deleteNotebookFromStore(payload);
      if (deleted) {
        dispatch('getAllDataFromIndexedDb');
      }
    },
    saveNoteActiveToStore({state}) {
      if (state.activeNote) {
        saveNoteToStore(state.activeNote);
      }
    },
  },
  getters: {
    getRelatedNotes: (state: MainState) => (notebook: Notebook) => {
      const relatedNotes = (state.notes as Note[])
      .filter((v: Note) => v.notebookId === notebook.id);
      return relatedNotes || [];
    },
  },
  modules: {
    ViewEventModule,
  },
});
