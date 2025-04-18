import { Scene } from "phaser";
import { Plant } from "../Plant";
import { Insect } from "../Insect";

export class Game extends Scene {
  turn: number;
  plant: Plant;
  waterCount: number;
  debugText: Phaser.GameObjects.Text;
  insects: Insect[];
  watterButton: Phaser.GameObjects.Image;
  endTurnButton: Phaser.GameObjects.Text;
  waterParticle: Phaser.GameObjects.Particles.ParticleEmitter;
  wateringImage: Phaser.GameObjects.Image;
  wateringTween: Phaser.Tweens.TweenChain;

  constructor() {
    super("Game");

    this.turn = 1;
    this.insects = [];
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
    this.load.image("water", "water.png");
    this.load.image("watering", "watering.png");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // background
    this.add.image(width / 2, height / 2, "land");

    // plant
    this.plant = new Plant(this, width / 2, height / 2, 50);

    const container = this.add.container(0, 0).setDepth(10);

    this.debugText = this.add
      .text(16, height - 16, "", {
        font: "14px",
      })
      .setOrigin(0, 1);

    container.add(this.debugText);

    const giveWaterText = this.add
      .text(width - 16, height - 16 - 16 - 32 - 16, "Give Water", {
        font: "14px",
        padding: { x: 8, y: 4 },
      })
      .setVisible(false)
      .setOrigin(1, 0.5);
    container.add(giveWaterText);

    // water button
    this.watterButton = this.add
      .image(width - 64 - 12, height - 128, "watering")
      .setOrigin(0.5, 0.5)
      .setTint(0xeeeeee)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.watterButton.setTint(0xffffff);
        giveWaterText.setVisible(true);
      })
      .on("pointerout", () => {
        this.watterButton.setTint(0xeeeeee);
        giveWaterText.setVisible(false);
      })
      .on("pointerdown", () => {
        this.giveWater();
      });

    container.add(this.watterButton);

    // do nothing button
    this.endTurnButton = this.add
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

    container.add(this.endTurnButton);

    // add water rain particles emmiter
    this.waterParticle = this.add
      .particles(this.plant.x, this.plant.y - 128, "water", {
        lifespan: 900,
        duration: 700,
        scale: { start: 0.3, end: 0.3 },
        alpha: { start: 0.8, end: 0.3 },
        speed: { min: 20, max: 50 },
        moveToY: { min: this.plant.y - 128, max: this.plant.y },
        quantity: 1,
        accelerationY: 300,
        gravityY: 100,
        blendMode: "NORMAL",
      })
      .setDepth(20)
      .stop();

    this.wateringImage = this.add
      .image(this.plant.x + 32, this.plant.y - 128 - 4, "watering")
      .setDepth(10)
      .setAlpha(0);

    this.wateringTween = this.tweens
      .chain({
        targets: this.wateringImage,
        persist: true,
        tweens: [
          {
            alpha: 1,
            duration: 300,
          },
          {
            angle: -45,
            duration: 300,
            ease: "Power2",
            onComplete: () => {
              this.waterParticle.start();
            },
          },
          {
            y: this.plant.y - 128 - 24,
            duration: 800,
            ease: "Power2",
          },
          {
            alpha: 0,
            delay: 200,
            duration: 300,
            onComplete: () => {
              // reset position
              this.wateringImage.setAngle(0);
              this.wateringImage.setX(this.plant.x + 32);
              this.wateringImage.setY(this.plant.y - 128 - 4);
            },
          },
        ],
      })
      .pause();
  }

  // give water to plant
  // water count decreases by 10
  // plant gains health by 20
  giveWater() {
    if (this.waterCount <= 0) {
      return;
    }

    if (this.waterCount >= 10) {
      this.waterCount -= 10;
      this.wateringTween.restart();

      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.plant.increaseHp(20);
          this.endTurn();
        },
      });
    }
  }

  addInsect() {
    const x = this.plant.x;
    const y = this.plant.y;

    const insect = new Insect(this, x, y);
    insect.setTarget(this.plant);
    this.insects.push(insect);
  }

  // end of turn, observe consequences
  endTurn() {
    // insects count increases by 1 if turn is even (divisible by 2)
    if (this.turn % 2 === 0) {
      this.addInsect();
    }
    // decrease plant health by insects count * 2
    this.plant.decreaseHp(this.insects.length * 2);

    // decrease plant health by -5 if plant health <= 50
    if (this.plant.hp <= 50) {
      this.plant.decreaseHp(5);
    }

    this.turn++;
  }

  update(time: number, delta: number): void {
    this.debugText.setText(
      `Turn: ${this.turn}\nPlant hp: ${this.plant.hp}\nInsects: ${this.insects.length}\nWater: ${this.waterCount}`,
    );

    this.insects.forEach((insect) => insect.update(time, delta));
  }
}
