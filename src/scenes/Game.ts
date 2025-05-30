import { Scene } from "phaser";
import { Plant } from "../Plant";
import { Insect } from "../Insect";
import { GameState } from "../game/GameState";
import { PlayerTurnState } from "../game/PlayerTurnState";
import { EndOfTurnState } from "../game/EndOfTurnState";
import { FinishGameState } from "../game/FinishGameState";
import { GameUI } from "../game/GameUI";
import { WateringState } from "../game/WateringState";
import { ObserveState } from "../game/ObserveState";
import { LevelConfig, levels } from "../level";
import { MenuGameState } from "../game/MenuGameState";
import { DialogUI } from "../game/DialogUI";
import { GameCreditsState } from "../game/GameCreditsState";

export class Game extends Scene {
  level: number;
  state: GameState;
  turn: number;
  plant: Plant;
  _waterCount: number;
  _bioControlCount: number;
  insects: Insect[];

  watterButton: Phaser.GameObjects.Image;
  endTurnButton: Phaser.GameObjects.Text;
  waterParticle: Phaser.GameObjects.Particles.ParticleEmitter;
  wateringImage: Phaser.GameObjects.Image;
  wateringTween: Phaser.Tweens.TweenChain;
  // states
  playerTurnState: PlayerTurnState;
  endofTurnState: EndOfTurnState;
  gameUi: GameUI;
  wateringState: WateringState;
  observeState: ObserveState;
  levelConfig: LevelConfig;
  menuGameState: any;
  dialogUi: DialogUI;
  magnifyingGlass: Phaser.GameObjects.Image;
  observingTween: Phaser.Tweens.TweenChain;
  spray: Phaser.GameObjects.Image;
  sprayTween: Phaser.Tweens.TweenChain;

  get waterCount() {
    return this._waterCount;
  }

  set waterCount(value) {
    this._waterCount = value;
    this.gameUi?.waterButton?.setTint(value < 10 ? 0x555555 : 0xeeeeee);
  }

  get bioControlCount() {
    return this._bioControlCount;
  }

  set bioControlCount(value) {
    this._bioControlCount = value;
    this.gameUi?.sprayButton?.setTint(value < 5 ? 0x555555 : 0xeeeeee);
  }

  constructor() {
    super("Game");
    this.level = 1;
    this.turn = 1;
    this.insects = [];
    this.bioControlCount = 0;
    this.waterCount = 0;

    this.gameUi = new GameUI(this);
    this.dialogUi = new DialogUI(this);

    // states
    this.menuGameState = new MenuGameState(this);
    this.playerTurnState = new PlayerTurnState(this);
    this.wateringState = new WateringState(this);
    this.observeState = new ObserveState(this);
    this.endofTurnState = new EndOfTurnState(this);
  }

  preload() {
    this.load.setPath("assets");

    this.load.image("land", "land.png");
    this.load.spritesheet("plant", "plant.png", {
      frameWidth: 200,
      frameHeight: 144,
    });
    this.load.spritesheet("insect", "bug.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("water", "water.png");
    this.load.image("watering", "watering.png");
    this.load.image("bug", "bug-sm.png");
    this.load.image("observe", "observe.png");
    this.load.image("spray-icon", "spray-icon.png");
    this.load.image("spray", "spray.png");
    this.load.bitmapFont("pixelfont", "minogram_6x10.png", "minogram_6x10.xml");
    this.load.bitmapFont("pixelfontBold", "thick_8x8.png", "thick_8x8.xml");

    this.load.audio("click", "audio/click.wav");
    this.load.audio("heal", "audio/heal.wav");
    this.load.audio("watering", "audio/watering.mp3");
    this.load.audio("hit", "audio/hit.wav");
    this.load.audio("levelup", "audio/levelup.wav");
    this.load.audio("spray", "audio/spray.mp3");
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

  createObservingAnimation() {
    this.magnifyingGlass = this.add
      .image(this.plant.x, this.plant.y, "observe")
      .setDepth(10)
      .setAlpha(0);

    this.observingTween = this.tweens
      .chain({
        targets: this.magnifyingGlass,
        persist: true,
        tweens: [
          {
            alpha: 1,
            duration: 300,
          },
          {
            x: this.plant.x - 64,
            y: this.plant.y - 24,
            duration: 300,
            // ease: "Power2",
          },
          {
            x: this.plant.x - 64,
            y: this.plant.y + 24,
            duration: 300,
            // ease: "Power2",
          },
          {
            x: this.plant.x + 64,
            y: this.plant.y - 24,
            duration: 500,
            // ease: "Power2",
          },
          {
            x: this.plant.x + 64,
            y: this.plant.y + 24,
            duration: 300,
            // ease: "Power2",
          },
          {
            alpha: 0,
            delay: 200,
            duration: 300,
            onComplete: () => {
              // reset position
              this.magnifyingGlass.setX(this.plant.x);
              this.magnifyingGlass.setY(this.plant.y);
            },
          },
        ],
      })
      .pause();
  }

  createSprayAnimation() {
    this.spray = this.add
      .image(this.plant.x + 24, this.plant.y - 12, "spray")
      .setDepth(10)
      .setAlpha(0);

    this.sprayTween = this.tweens
      .chain({
        targets: this.spray,
        persist: true,
        tweens: [
          {
            alpha: 1,
            duration: 300,
          },
          {
            x: this.plant.x + 64,
            y: this.plant.y,
            duration: 800,
            ease: "Power2",
          },
          {
            alpha: 0,
            delay: 200,
            duration: 300,
            onComplete: () => {
              // reset position
              this.spray.setX(this.plant.x + 24);
              this.spray.setY(this.plant.y - 12);
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
    this.plant = new Plant(this, width / 2, height / 2, 100);

    this.gameUi.create();
    this.gameUi.showGameUi(false);
    this.createWateringAnimation();
    this.createObservingAnimation();
    this.createSprayAnimation();

    this.dialogUi.create();

    this.changeState(this.menuGameState);
    // this.startPlay();
    // this.finishGame(true);
    // this.changeState(new GameCreditsState(this));
  }

  startPlay() {
    this.setLevel(1);
  }

  nextLevel() {
    if (this.level + 1 > levels.length) {
      // show game credits
      this.changeState(new GameCreditsState(this));
      return;
    }

    this.setLevel(this.level + 1);
  }

  restartLevel() {
    this.setLevel(this.level);
  }

  setLevel(l: number) {
    // reset game state
    this.turn = 1;
    for (const insect of this.insects) {
      insect.destroy();
    }
    this.insects = [];

    // set level
    this.level = l;
    this.levelConfig = this.getLevelConfig(this.level);
    this.gameUi.setLevel(this.level);

    // plant
    this.plant.setHp(this.levelConfig.hp);
    this.gameUi.setHp(this.levelConfig.hp);
    // water
    this.waterCount = this.levelConfig.water;
    // insect
    for (let i = 0; i < this.levelConfig.insect; i++) {
      this.addInsect();
    }
    // bio control spray
    this.bioControlCount = this.levelConfig.bioControl;

    // the game starts with player turn
    this.changeState(this.playerTurnState);
  }

  getLevelConfig(l: number) {
    return levels[l - 1];
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
      this.sound.play("watering");

      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.plant.setSwayStrength(3.0);
        },
      });

      this.changeState(this.wateringState);

      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.plant.increaseHp(20);
          this.gameUi.setHp(this.plant.hp);
          this.sound.play("heal");

          this.time.addEvent({
            delay: 1000,
            callback: () => {
              this.plant.setSwayStrength(1.0);
              this.endTurn();
            },
          });
        },
      });
    }
  }

  giveBioControl() {
    if (this.bioControlCount <= 0) {
      return;
    }
    if (this.bioControlCount >= 5) {
      this.bioControlCount -= 5;
      this.sound.play("spray", {
        seek: 0.5,
      });
      this.sprayTween.restart();

      const removedCount = Math.min(3, this.insects.length);

      // reduce insect count by 3
      for (let i = 0; i < 3; i++) {
        if (this.insects.length > 0) {
          const insect = this.insects.pop();
          insect?.destroy();
        }
      }

      this.time.addEvent({
        delay: 500,
        callback: () => {
          this.dialogUi.push(`${removedCount} Insects ran away!`);
        },
      });

      this.changeState(this.observeState);

      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.endTurn();
        },
      });
    }
  }

  observe() {
    this.changeState(this.observeState);
    this.observingTween.restart();

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.endTurn();
      },
    });
  }

  addInsect() {
    const x = this.plant.x;
    const y = this.plant.y;

    const insect = new Insect(this, x, y);
    insect.setTarget(this.plant);
    this.insects.push(insect);
  }

  addBioControl() {
    this.bioControlCount += 1;
  }

  endTurn() {
    this.changeState(this.endofTurnState);
  }

  nextTurn() {
    this.turn++;
    this.changeState(this.playerTurnState);
  }

  finishGame(isLevelCompleted: boolean = false) {
    this.changeState(new FinishGameState(this, isLevelCompleted));
  }

  update(time: number, delta: number): void {
    this.gameUi.update({
      turn: this.turn,
      plant: this.plant,
      insects: this.insects,
      waterCount: this.waterCount,
      bioControlCount: this.bioControlCount,
    });

    this.insects.forEach((insect) => insect.update(time, delta));
  }
}
