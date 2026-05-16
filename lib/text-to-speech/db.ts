const DB_NAME = "speech-cache-db";
const STORE_NAME = "speech-cache-store";

type SpeechCache = {
  key: string;
  blob: Blob;
  createdAt: number;
};

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: "key" });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getSpeechBlob(key: string): Promise<Blob | null> {
    const db = await openIndexedDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);

        req.onsuccess = () => resolve(req.result?.blob ?? null);
        req.onerror = () => reject(req.error);
    });
}

export async function setSpeechBlob(key: string, blob: Blob) {
    const db = await openIndexedDB();

    const cache: SpeechCache = {
        key,
        blob,
        createdAt: Date.now()
    };

    return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put(cache);

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}