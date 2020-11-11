import { readFileSync, writeFileSync } from "fs";
import { table } from "./table";
const read = () => JSON.parse(readFileSync("./db.json", "utf8"));
const write = (data: any): any =>
  writeFileSync("./db.json", JSON.stringify(data, null, 2));
const err: any = (e: any): any => TypeError(e);
import { EventEmitter } from "events";

try {
  read();
} catch {
  write({});
}

class db extends EventEmitter {
  static table = table;
  static fetch(userData: string): any {
    if (!userData) throw err("The value to fetch is not specified.");
    const data = read();
    return data[userData] ? data[userData] : null;
  }

  static get(userData: string): any {
    if (!userData) throw err("The value to get is not specified.");
    const data = read();
    return data[userData] ? data[userData] : null;
  }

  static set(userData: string, value: any): void {
    if (!userData) throw err("Undefined value.");
    if (isNaN(value)) if (!value) throw err("Undefined value.");
    const data = read();
    data[userData] = value;
    write(data);
  }

  static add(userData: string, value: number): void {
    const data = read();
    if (isNaN(value)) if (!value) throw err("You have to specify something for me to add.");
    if (typeof value != "number")
      throw err("The value must be a number.");
    if (data[userData] == undefined) return this.set(userData, value);
    data[userData] += value;
    write(data);
  }

  static delete(userData: any): void {
    if (isNaN(userData)) {
      if (!userData) throw err("I didn't understand what to delete.");
    }
    const data = read();
    if (!data[userData]) throw err("There is no such data that I can delete.");
    delete data[userData];
    write(data);
  }

  static fetchAll(): object {
    let data = read();
    return data;
  }

  static has(userData: string): true | false {
    const data = read();
    return data[userData] ? true : false;
  }


  static arrayHas(userData: string, value: any): boolean {
    if (!userData || !value) throw err("Enter the parameters.");
    const data = this.fetch(userData);
    if (Array.isArray(data) == false) throw err("The value must be an array.");
    return data.indexOf(value) > -1 ? true : false;
  }

  static clearDB(): void {
    write({});
  }

  static deleteDataEach(userData: string): void {
    if (!userData) throw err("Define the data you want me to delete.");
    const allData = read();
    let keys: any = Object.keys(allData);
    if (keys == "") throw err("There is no such data for me to delete.");
    keys = keys.filter((a: any) => a.includes(userData));
    keys.forEach((a: any) => {
      this.delete(a);
    });
  }

  static includes(userData: string): Array<any> {
    if (!userData) throw err("Specify the value for me to pull.");
    const allData = read();
    let keys: any = Object.keys(allData);
    keys = keys.filter((a: any) => a.includes(userData));
    if (keys == "") throw err("There is no such data in the database.");
    return keys;
  }

  static push(userData: string, value: any): void {
    const data = read();
    if (Array.isArray(data[userData]) == false)
      throw err("The value must be an array.");
    data[userData].push(value);
    write(data);
  }

  static startsWith(userData: string): Array<any> | null {
    if (!userData) throw err("The value for searching is not specified..!");
    const data = read();
    let arr: Array<any> = [];
    const res: Array<any> = [];
    let keys = Object.keys(data);
    keys
      .filter((a: any) => a.startsWith(userData))
      .forEach((a: any) => arr.push(a));

    arr.forEach((a: any) => {
      res.push(data[a]);
    });
    if (res.length == 0) return null;
    else return res;
  }
  static backup(file: string): void {
    if (!file) throw err("Please specify a file for me to backup.");
    if (!file.endsWith(".json"))
      throw err("The file must be a json file.");
    const data = read();
    writeFileSync("./" + file, JSON.stringify(data, null, 4));
  }

  static filter(func): any {
    const arr = [];
    const all: any = this.fetchAll();
    for (var i in all) {
      if (func(all[i])) arr.push(all[i]);
    }
    return arr;
  }
  static find(callback: any): any {
    return this.filter(callback)[0];
  }
  static backupLoad(file: string): void {
    if (!file) throw err("Please specify a file for me for loading the backup");
    if (!file.endsWith(".json"))
      throw err("The file must be a json file.");
    const data = read();
    try {
      read();
      writeFileSync("./db.json", JSON.stringify(data, null, 2));
    } catch {
      writeFileSync("./db.json", JSON.stringify(data, null, 2));
    }
  }
  static substr(userData: string, value: number) {
    if (!userData || !value) throw err("Enter the parameters properly.");
    if (typeof value != "number") throw err("2. parameter must be a number.");
    if (value < 1) throw err("The number cannot be lower than 1.");
    let data = this.fetch(userData);
    if (isNaN(data)) throw err("The main value is not a number.");
    if (data < value)
      throw err("The value I will subtract cannot be greater than the original value.");
    data = data - value;
    this.set(userData, data);
  }
}

export { db };
