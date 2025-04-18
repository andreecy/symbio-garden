import { Scene } from "phaser";
import { Plant } from "../Plant";
import { Insect } from "../Insect";

export class Game extends Scene {
  turn: number;
  plant: Plant;
  insectsCount: number;
  waterCount: number;
  debugText: Phaser.GameObjects.Text;
  insect: Insect;

  constructor() {
    super("Game");

    this.turn = 0;
    this.plant = new Plant(60);
    this.insectsCount = 0;
    this.waterCount = 50;
  }

  preload() {
    this.load.setPath("assets");

    this.load.image("land", "land.png");
    this.load.image("plant", "plant.png");
    this.load.spritesheet("insect", "bug.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    // this.textures.get("land").setFilter(Phaser.Textures.NEAREST);
    // this.textures.get("plant").setFilter(Phaser.Textures.NEAREST);
    // this.textures.get("insect").setFilter(Phaser.Textures.NEAREST);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.image(width / 2, height / 2, "land");

    const plant = this.add.image(width / 2, height / 2, "plant");

    this.insect = new Insect(this, width / 2, height / 2);
    this.insect.setTarget(plant);

    this.debugText = this.add
      .text(16, height - 16, "", {
        font: "14px",
      })
      .setOrigin(0, 1);

    // water button
    this.add
      .text(width - 16, height - 16 - 16 - 32 - 16, "Give Water", {
        font: "14px",
        backgroundColor: "#333",
        padding: { x: 10, y: 10 },
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.giveWater();
      });

    // do nothing button
    this.add
      .text(width - 16, height - 16 - 16, "Do Nothing", {
        font: "14px",
        backgroundColor: "#333",
        padding: { x: 10, y: 10 },
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        // do nothing
        this.endTurn();
      });
  }

  // give water to plant
  // water count decreases by 10
  // plant gains health by 20
  giveWater() {
    if (this.waterCount <= 0) {
      return;
    }

    if (this.waterCount > 10) {
      this.waterCount -= 10;
      this.plant.increaseHp(20);
      this.endTurn();
    }
  }

  // end of turn, observe consequences
  endTurn() {
    // insects count increases by 1 if turn is even (divisible by 2)
    if (this.turn % 2 === 0) {
      this.insectsCount++;
    }

    // decrease plant health by insects count * 2
    this.plant.decreaseHp(this.insectsCount * 2);

    this.turn++;
  }

  update(time: number, delta: number): void {
    this.debugText.setText(
      `Turn: ${this.turn}\nPlant hp: ${this.plant.hp}\nInsects: ${this.insectsCount}\nWater: ${this.waterCount}`,
    );

    this.insect.update(time, delta);
  }
}
