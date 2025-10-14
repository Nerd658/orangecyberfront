import { STORAGE_EXPIRATION_HOURS } from '../config';

const expirationInMs = STORAGE_EXPIRATION_HOURS * 60 * 60 * 1000;

// This is the wrapper object that will be stored in localStorage.
interface StorageValue {
  value: string; // This will be the stringified state from Zustand.
  expiry: number;
}

/**
 * A custom storage object for Zustand's persist middleware.
 * It wraps the default localStorage to add an expiration date to the stored state.
 */
export const storageWithExpiry = {
  /**
   * Stores the state.
   * @param name The key to store the state under.
   * @param value The stringified state from Zustand.
   */
  setItem: (name: string, value: string): void => {
    const wrapper: StorageValue = {
      value: value,
      expiry: new Date().getTime() + expirationInMs,
    };
    localStorage.setItem(name, JSON.stringify(wrapper));
  },

  /**
   * Retrieves the state.
   * @param name The key of the state to retrieve.
   * @returns The stringified state if it exists and is not expired, otherwise null.
   */
  getItem: (name: string): string | null => {
    const storedValue = localStorage.getItem(name);
    if (!storedValue) {
      return null;
    }

    try {
      const wrapper = JSON.parse(storedValue) as StorageValue;
      const now = new Date().getTime();

      if (now > wrapper.expiry) {
        localStorage.removeItem(name); // Clean up expired item.
        return null;
      }
      return wrapper.value; // Return the raw string state for Zustand to parse.
    } catch (error) {
      console.error("Failed to parse stored state.", error);
      return null;
    }
  },

  /**
   * Removes an item from storage.
   * @param name The key of the item to remove.
   */
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};