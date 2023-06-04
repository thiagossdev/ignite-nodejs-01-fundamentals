import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #schemas = {};

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then((data) => {
        this.#schemas = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#schemas));
  }

  select(table) {
    return this.#schemas[table] ?? [];
  }

  insert(table, data) {
    if (Array.isArray(this.#schemas[table])) {
      this.#schemas[table].push(data);
    } else {
      this.#schemas[table] = [data];
    }

    this.#persist();
    return data;
  }

  delete(table, id) {
    const data = this.select(table);
    const index = data.findIndex((row) => row.id === id);
    if (index > -1) {
      data.splice(index, 1);
      this.#persist();
      return data;
    }

    return null;
  }
}
