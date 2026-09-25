export class Database {
  constructor() {
    this.entregas = [];
    this.motoristas = [];
    this.currentId = 1;
    this.currentMotoristaId = 1;
  }
}

export const database = new Database();
