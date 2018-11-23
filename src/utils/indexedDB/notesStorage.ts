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
    keyPath: ['id', 'name'],
  });
  notebooksStore.createIndex('name', 'name', { unique: true });
  notebooksStore.createIndex('id', 'id', { unique: true });
  const notesStore = db.createObjectStore('notes', {
    keyPath: ['id', 'name'],
  });
  notesStore.createIndex('name', 'name', { unique: true });
  notesStore.createIndex('id', 'id', { unique: true });
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
  const data = (await getAllDataFromIDB(db, 'notebooks')) as Notebook[];
  return data;
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await getMainDb();
  const data = (await getAllDataFromIDB(db, 'notes')) as Note[];
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

export async function getItemFromStore(id: number, name: string, store: string) {
  const db = await getMainDb();
  const data = await new Promise((resolve, reject) => {
    const request = db.transaction(store, 'readonly')
    .objectStore(store).get([id, name]);
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

export function functionSaveTestMockupToStore() {
    NotesTree.forEach(async (notebook) => {
        const notebookExists = await getItemFromStore(notebook.id, notebook.name, 'notebooks');
        if (!notebookExists) {
            saveItemToStore(
                {
                  id: notebook.id,
                  name: notebook.name,
                },
                'notebooks',
            );
            notebook.children.forEach((note) => {
                saveItemToStore(
                    {
                      id: note.id,
                      name: note.name,
                      notebook: notebook.name,
                      data: note.data,
                      type: note.type,
                      language: note.language,
                    },
                    'notes',
                );
            });
        }
    });
}
