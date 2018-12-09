import { NoteType, Note, Notebook } from '@/utils/orm.models';
import { NotesTree } from '../../../tests/mockup/monaco.mockup';

const notebookStorage = 'Notebooks';

interface AppEventTargetIDB extends EventTarget {
  result: any;
}

function isAvailableIndexedDb(): boolean {
  return window.indexedDB !== undefined;
}

export function getMainDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (isAvailableIndexedDb) {
      const request = indexedDB.open(notebookStorage, 1) as IDBOpenDBRequest;
      if (request) {
        request.onerror = (ev: Event) => {
          reject(new Error(`IDBOpenDBRequest error ${ev.target}`));
        };
        request.onsuccess = (ev: Event) => {
          resolve((ev.target as AppEventTargetIDB).result as IDBDatabase);
        };
        request.onupgradeneeded = (ev: Event) => {
          createObjectStores((ev.target as AppEventTargetIDB).result as IDBDatabase);
        };
      }
    } else {
      reject(new Error(`Your browser does not support IndexedDB`));
    }
  });
}

function createObjectStores(db: IDBDatabase) {
  const notebooksStore = db.createObjectStore('notebooks', {
    keyPath: 'id',
    autoIncrement: true,
  });
  notebooksStore.createIndex('name', 'name', { unique: false });
  const notesStore = db.createObjectStore('notes', {
    keyPath: 'id',
    autoIncrement: true,
  });
  notesStore.createIndex('name', 'name', { unique: false });
  const recycle = db.createObjectStore('recycle', {
    keyPath: 'recycleId',
    autoIncrement: true,
  });
  recycle.createIndex('name', 'name', { unique: false });
  recycle.createIndex('id', 'id', { unique: false });
}

export async function saveNotebookToStore(notebook: Notebook) {
  const db = await getMainDb();
  if (db.objectStoreNames.contains(notebook.name)) {
    return;
  }
  const request = db
    .transaction('notebooks', 'readwrite')
    .objectStore('notebooks')
    .add(notebook);
  request.onerror = (ev: Event) => {
    throw new Error(`IDBRequest error ${ev.target}`);
  };
}

export async function getAllNotebooks(): Promise<Notebook[]> {
  const db = await getMainDb();
  const data = await getAllDataFromIDB(db, 'notebooks') as Notebook[];
  return data;
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await getMainDb();
  const data = await getAllDataFromIDB(db, 'notes') as Note[];
  return data;
}

export async function getAllRecycleNotes(): Promise<Note[]> {
  const db = await getMainDb();
  const data = await getAllDataFromIDB(db, 'recycle') as Note[];
  return data;
}

export async function getAllNotebookKeys(): Promise<number[]> {
  const db = await getMainDb();
  const data = (await getAllKeysFromIDB(db, 'notebooks')) as number[];
  return data;
}

export async function getAllNoteKeys(): Promise<Note[]> {
  const db = await getMainDb();
  const data = (await getAllKeysFromIDB(db, 'notes')) as Note[];
  return data;
}

export function getAllDataFromIDB(db: IDBDatabase, objStore: string) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(objStore, 'readonly')
    .objectStore(objStore).getAll();
    request.onsuccess = (ev: Event) => {
      resolve((ev.target as AppEventTargetIDB).result as any);
    };
    request.onerror = (ev: Event) => {
      reject(new Error(`Get all data request error ${ev.target}`));
    };
  });
}

export function getAllKeysFromIDB(db: IDBDatabase, objStore: string) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(objStore, 'readonly')
    .objectStore(objStore).getAllKeys();
    request.onsuccess = (ev: Event) => {
      resolve((ev.target as AppEventTargetIDB).result as any);
    };
    request.onerror = (ev: Event) => {
      reject(new Error(`Get all data request error ${ev.target}`));
    };
  });
}

export async function getItemFromStore(id: number | string, store: string) {
  const db = await getMainDb();
  const data = await new Promise((resolve, reject) => {
    const request = db.transaction(store, 'readonly')
    .objectStore(store).get(id);
    request.onsuccess = (ev: Event) => {
      resolve((ev.target as AppEventTargetIDB).result as any);
    };
    request.onerror = (ev: Event) => {
      reject(new Error(`Get item by id ${name} from store ${store} cause error ${ev.target}`));
    };
  });
  return data;
}

export async function saveItemToStore(item: Note | Notebook, store: string) {
    const db = await getMainDb();
    const data = await new Promise((resolve, reject) => {
      const request = db
        .transaction(store, 'readwrite')
        .objectStore(store)
        .add(item);
      request.onsuccess = (ev: Event) => {
        const result = (ev.target as AppEventTargetIDB).result as any;
        resolve(result);
      };
      request.onerror = (ev: Event) => {
        throw new Error(`Add item by id ${item.id} to store ${store} cause error ${ev.target}`);
      };
    });
}

export async function notebookIsUnique(name: string) {
  const item = await getItemFromStore(name, 'notebooks');
  return item === undefined;
}

export function functionSaveTestMockupToStore() {
    NotesTree.forEach(async (notebook) => {
        const notebookExists = await getItemFromStore(notebook.id, 'notebooks');
        if (!notebookExists) {
            saveItemToStore(
                {
                  id: notebook.id,
                  name: notebook.name,
                  owner: notebook.owner,
                  updated: notebook.updated,
                  sharedWith: notebook.sharedWith,
                  order: notebook.order,
                },
                'notebooks',
            );
            notebook.children.forEach((note) => {
                saveItemToStore(
                    {
                      id: note.id,
                      name: note.name,
                      notebookId: notebook.id,
                      data: note.data,
                      type: note.type,
                      language: note.language,
                      order: notebook.order,
                    },
                    'notes',
                );
            });
        }
    });
}

export async function createNewNotebookFromString(name: string): Promise<Notebook> {
  const notes = await getAllNotebookKeys() as number[];
  return {
    id: notes[notes.length - 1] + 1,
    name,
    order: 0,
    owner: 'Me',
    updated: new Date(Date.now()),
  };
}

export async function deleteNotebookFromStore(item: Notebook) {
  const db = await getMainDb();
  const deleted = await new Promise((resolve, reject) => {
    const transaction = db.transaction('notebooks', 'readwrite')
    .objectStore('notebooks').delete(item.id);
    transaction.onsuccess = () => resolve(true);
    transaction.onerror = transaction.onerror = (ev: Event) => {
      reject(new Error(`Delete notebook id = ${item.id} transaction failed ${ev.target}`));
    };
  });
  return deleted;
}

export async function saveNoteToStore(note: Note) {
  const existingNote = getItemFromStore(note.id, 'notes');
  if (existingNote) {
    updateExistingNote(note);
  } else {
    saveItemToStore(note, 'notes');
  }
}

export async function updateExistingNote(note: Note) {
  const db = await getMainDb();
  const updated = await new Promise((resolve, reject) => {
    const objectStore = db.transaction(['notes'], 'readwrite').objectStore('notes');
    const request = objectStore.get('444-44-4444');
    const onerror = (ev: Event) => {
      reject(new Error(`Update note id = ${note.id} request failed ${ev.target}`));
    };
    request.onerror = onerror;
    request.onsuccess = (ev: Event) => {
      const storedNote = (ev.target as AppEventTargetIDB).result as Note;
      const updatedNote = Object.assign({}, storedNote, note);
      const requestUpdate = objectStore.put(updatedNote);
      requestUpdate.onerror = onerror;
      requestUpdate.onsuccess = (evUpdate: Event) => {
        resolve(true);
      };
    };
  });
  return updated;
}

export async function deleteExistingNote(id: number) {
  const db = await getMainDb();
  const deleted = await new Promise((resolve, reject) => {
    const transaction = db.transaction('notes', 'readwrite')
    .objectStore('notes').delete(id);
    transaction.onsuccess = () => resolve(true);
    transaction.onerror = transaction.onerror = (ev: Event) => {
      reject(new Error(`Delete note id = ${id} transaction failed ${ev.target}`));
    };
  });
  return deleted;
}

export async function moveNoteToRecycleBin(note: Note) {
  const db = await getMainDb();
  const data = await new Promise((resolve, reject) => {
    const request = db
      .transaction('recycle', 'readwrite')
      .objectStore('recycle')
      .add(note);
    request.onsuccess = (ev: Event) => {
      const result = (ev.target as AppEventTargetIDB).result as any;
      resolve(true);
    };
    request.onerror = (ev: Event) => {
     reject(new Error(`Add item by id ${note.id} to store recycle cause error ${ev.target}`));
    };
  });
}
