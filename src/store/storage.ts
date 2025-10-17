import { STORAGE_EXPIRATION_HOURS } from '../config';

const expirationInMs = STORAGE_EXPIRATION_HOURS * 60 * 60 * 1000;

// This is the wrapper object that will be stored in localStorage.
interface StoredData {
  state: any; // The actual state object
  expiry: number;
}

export const storageWithExpiry = {
  setItem: (name: string, value: any): void => {
    const storedData: StoredData = {
      state: value,
      expiry: new Date().getTime() + expirationInMs,
    };
    localStorage.setItem(name, JSON.stringify(storedData));
  },

  getItem: (name: string): any | null => {
    const storedValue = localStorage.getItem(name);
    if (!storedValue) {
      return null;
    }

    try {
      const storedData = JSON.parse(storedValue) as StoredData;
      const now = new Date().getTime();

      if (now > storedData.expiry) {
        localStorage.removeItem(name);
        return null;
      }
      return storedData.state; // Return the parsed state object
    } catch (error) {
      console.error("Failed to parse stored state.", error);
      return null;
    }
  },

  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};