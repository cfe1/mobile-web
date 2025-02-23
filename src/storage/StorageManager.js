export default class StorageManager {
  static put = (storageKey, value) => {
    localStorage.setItem(storageKey, value);
  };

  static get = (storageKey) => {
    return localStorage.getItem(storageKey);
  };

  static removeItem = (storageKey) => {
    return localStorage.removeItem(storageKey);
  };

  static clearStore = () => {
    localStorage.clear();
  };
}
