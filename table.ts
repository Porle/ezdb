import { db } from "./main";

export class table {
  constructor() {}
  createTable(key: string) {
    db.set(key, []);
  }
  set(key, value) {
    db.push(key, value);
  }
  filter(key, callback) {
    const fetched = db.fetch(key);
    const arr = [];
    for (const x of fetched) {
      if (callback(x)) arr.push(x);
    }
    return arr;
  }
  find(key, callback) {
    return this.filter(key, callback)[0];
  }
}
