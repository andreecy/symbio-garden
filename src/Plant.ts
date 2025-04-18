export class Plant {
  private _hp: number;

  constructor(initialHp: number) {
    this._hp = initialHp;
  }

  get hp() {
    return this._hp;
  }

  increaseHp(amount: number) {
    this._hp += amount;
  }

  decreaseHp(amount: number) {
    this._hp -= amount;
  }
}
