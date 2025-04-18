export class Plant extends Phaser.GameObjects.Image {
  private _hp: number;
  private _maxHp: number;

  constructor(scene: Phaser.Scene, x: number, y: number, initialHp: number) {
    super(scene, x, y, "plant");
    scene.add.existing(this);
    this._maxHp = 100;
    this._hp = initialHp;
  }

  get hp() {
    return this._hp;
  }

  increaseHp(amount: number) {
    this._hp = Math.min(this._maxHp, this._hp + amount);
  }

  decreaseHp(amount: number) {
    this._hp = Math.max(0, this._hp - amount);
  }
}
