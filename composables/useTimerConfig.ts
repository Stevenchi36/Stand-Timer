import { ref, onMounted } from 'vue';
import defaultConfig from '@/constants/defaultConfig';

interface Setting {
  key: string;
  value: any;
}

interface TimerConfig {
  sitTimer: number;
  standTimer: number;
  sitBgColor: string;
  standBgColor: string;
  notificationsEnabled: boolean;
}

const useTimerConfig = () => {
  const sitTimer = ref<number>(defaultConfig.sitTimer);
  const standTimer = ref<number>(defaultConfig.standTimer);
  const sitBgColor = ref<string>(defaultConfig.sitBgColor);
  const standBgColor = ref<string>(defaultConfig.standBgColor);
  const notificationsEnabled = ref<boolean>(defaultConfig.notificationsEnabled);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('sitStandTimer', 1);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore('config', { keyPath: 'key' });
      };

      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  };

  const getSetting = (db: IDBDatabase, key: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['config'], 'readonly');
      const store = transaction.objectStore('config');
      const request = store.get(key);

      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBRequest).result ? (event.target as IDBRequest).result.value : null);
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  };

  const setSetting = (db: IDBDatabase, key: string, value: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['config'], 'readwrite');
      const store = transaction.objectStore('config');
      const request = store.put({ key, value });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  };

  const loadSettings = async () => {
    const db = await openDB();
    sitTimer.value = (await getSetting(db, 'sitTimer')) || defaultConfig.sitTimer;
    standTimer.value = (await getSetting(db, 'standTimer')) || defaultConfig.standTimer;
    sitBgColor.value = (await getSetting(db, 'sitBgColor')) || defaultConfig.sitBgColor;
    standBgColor.value = (await getSetting(db, 'standBgColor')) || defaultConfig.standBgColor;
    notificationsEnabled.value = (await getSetting(db, 'notificationsEnabled')) || defaultConfig.notificationsEnabled;
  };

  const saveSettings = async (config: TimerConfig) => {
    const db = await openDB();
    sitTimer.value = config.sitTimer;
    standTimer.value = config.standTimer;
    sitBgColor.value = config.sitBgColor;
    standBgColor.value = config.standBgColor;
    notificationsEnabled.value = config.notificationsEnabled;
    await setSetting(db, 'sitTimer', sitTimer.value);
    await setSetting(db, 'standTimer', standTimer.value);
    await setSetting(db, 'sitBgColor', sitBgColor.value);
    await setSetting(db, 'standBgColor', standBgColor.value);
    await setSetting(db, 'notificationsEnabled', notificationsEnabled.value);
  };

  onMounted(async () => {
    await loadSettings();
  });

  return {
    sitTimer,
    standTimer,
    sitBgColor,
    standBgColor,
    notificationsEnabled,
    saveSettings,
  };
};

export default useTimerConfig;