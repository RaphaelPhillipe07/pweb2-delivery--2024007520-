export class Database {
  constructor() {
    this.entregas = [];
    this.currentId = 1;
  }
}

export const database = new Database();
