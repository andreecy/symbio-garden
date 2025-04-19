import { Scene } from "phaser";
import { Plant } from "../Plant";
import { Insect } from "../Insect";
import { GameState } from "../game/GameState";
import { PlayerTurnState } from "../game/PlayerTurnState";
import { EndOfTurnState } from "../game/EndOfTurnState";
import { FinishGameState } from "../game/FinishGameState";
import { GameUI } from "../game/GameUI";
import { WateringState } from "../game/WateringState";

export class Game extends Scene {
  state: GameState;
  turn: number;
  plant: Plant;
  waterCount: number;
  insects: Insect[];
  watterButton: Phaser.GameObjects.Image;
  endTurnButton: Phaser.GameObjects.Text;
  waterParticle: Phaser.GameObjects.Particles.ParticleEmitter;
  wateringImage: Phaser.GameObjects.Image;
  wateringTween: Phaser.Tweens.TweenChain;
  // states
  playerTurnState: PlayerTurnState;
  endofTurnState: EndOfTurnState;
  finishState: FinishGameState;
  gameUi: GameUI;
  wateringState: WateringState;

  constructor() {
    super("Game");
    this.turn = 1;
    this.insects = [];
    this.waterCount = 50;

    this.gameUi = new GameUI(this);

    // states
    this.playerTurnState = new PlayerTurnState(this);
    this.wateringState = new WateringState(this);
    this.endofTurnState = new EndOfTurnState(this);
    this.finishState = new FinishGameState(this);
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

  createWateringAnimation() {
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

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // background
    this.add.image(width / 2, height / 2, "land");

    // plant
    this.plant = new Plant(this, width / 2, height / 2, 50);

    this.gameUi.create();
    this.gameUi.setHp(this.plant.hp);
    this.createWateringAnimation();

    // the game starts with player turn
    this.changeState(this.playerTurnState);
  }

  changeState(state: GameState) {
    if (this.state) {
      this.state.exit();
    }
    this.state = state;
    this.state.enter();
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

      this.changeState(this.wateringState);

      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.plant.increaseHp(20);
          this.gameUi.setHp(this.plant.hp);
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

  endTurn() {
    this.changeState(this.endofTurnState);
  }

  nextTurn() {
    this.turn++;
    this.changeState(this.playerTurnState);
  }

  update(time: number, delta: number): void {
    this.gameUi.update({
      turn: this.turn,
      plant: this.plant,
      insects: this.insects,
      waterCount: this.waterCount,
    });

    this.insects.forEach((insect) => insect.update(time, delta));
  }
}
