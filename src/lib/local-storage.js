import { AsyncStorage } from 'react-native';

const KEYS = {
  USER_AUTHENTICATED: 'USER_AUTHENTICATED',
  USER: 'USER',
};

const Storage = {
  KEYS,
  observers: [],
  subscribe(key, callback) {
    const id = this.observers.length;
    this.observers.push({ id, key, callback });
    this.get(key).then((value) => callback(value));
    return { unsubscribe: () => this.unsubscribe(id) };
  },
  unsubscribe(id) {
    this.observers = this.observers.filter((observer) => observer.id !== id);
  },
  set(key, value) {
    return AsyncStorage.setItem(key, value)
      .then(() => {
        for (const observer of this.observers) {
          if (observer.key === key) {
            observer.callback(value);
          }
        }
      });
  },
  get: async (key) => {
    try {
      if (Array.isArray(key)) {
        return await AsyncStorage.multiGet(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  delete(key) {
    if (!Array.isArray(key)) {
      key = [key];
    }

    return AsyncStorage.multiRemove(key)
      .then(() => {
        for (const observer of this.observers) {
          if (key.includes(observer.key)) {
            observer.callback(false);
          }
        }
      });
  },
};

export default Storage;
