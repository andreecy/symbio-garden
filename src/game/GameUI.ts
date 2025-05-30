import { levels } from "../level";
import { Game } from "../scenes/Game";

export class GameUI {
  waterButton: Phaser.GameObjects.Image;
  actionButtons: Phaser.GameObjects.Container;
  hpBar: Phaser.GameObjects.Rectangle;
  hp: number;
  uiContainer: Phaser.GameObjects.Container;
  turnText: Phaser.GameObjects.BitmapText;
  hpText: Phaser.GameObjects.BitmapText;
  waterText: Phaser.GameObjects.BitmapText;
  insectText: Phaser.GameObjects.BitmapText;
  observeButton: Phaser.GameObjects.Image;
  tooltip: Phaser.GameObjects.Rectangle;
  tooltipText: Phaser.GameObjects.BitmapText;
  levelText: Phaser.GameObjects.BitmapText;
  levelConfig: import("/home/anzz/dev/symbio-garden/src/level").LevelConfig;
  menuContainer: Phaser.GameObjects.Container;
  levelTitle: Phaser.GameObjects.BitmapText;
  nextLevelButton: Phaser.GameObjects.BitmapText;
  restartLevelButton: Phaser.GameObjects.BitmapText;
  sprayText: Phaser.GameObjects.BitmapText;
  sprayButton: Phaser.GameObjects.Image;
  creditsContainer: Phaser.GameObjects.Container;
  creditsTween: Phaser.Tweens.TweenChain;

  constructor(private game: Game) {
    this.hp = 0;
  }

  create() {
    const width = this.game.cameras.main.width;
    const height = this.game.cameras.main.height;

    // game UI
    this.uiContainer = this.game.add.container(0, 0).setDepth(20);

    this.turnText = this.game.add
      .bitmapText(width / 2, 8, "pixelfontBold", `Turn ${this.game.turn}`)
      .setOrigin(0.5, 0);
    this.uiContainer.add(this.turnText);

    // hp bar
    const hpBarBorder = this.game.add
      .rectangle(8, 8, 100, 10, 0x333333, 1)
      .setOrigin(0, 0)
      .setStrokeStyle(4, 0x333333);
    this.hpBar = this.game.add
      .rectangle(8, 8, 100, 10, 0x38c759, 1)
      .setOrigin(0, 0);

    this.uiContainer.add(hpBarBorder);
    this.uiContainer.add(this.hpBar);

    this.hpText = this.game.add
      .bitmapText(8 + 100 / 2, 14, "pixelfont", "100/100")
      .setOrigin(0.5, 0.5);
    this.uiContainer.add(this.hpText);

    const waterIcon = this.game.add
      .image(width - 32, 8, "water")
      .setOrigin(1, 0)
      .setScale(0.5);

    this.waterText = this.game.add
      .bitmapText(waterIcon.x, 12, "pixelfontBold", "50")
      .setOrigin(0, 0);

    const bugIcon = this.game.add.image(width - 110, 7, "bug").setOrigin(1, 0);

    this.insectText = this.game.add
      .bitmapText(bugIcon.x + 2, bugIcon.y + 5, "pixelfontBold", "0")
      .setOrigin(0, 0);

    const sprayIcon = this.game.add
      .image(width - 70, 8, "spray-icon")
      .setOrigin(1, 0);

    this.sprayText = this.game.add
      .bitmapText(sprayIcon.x + 2, 12, "pixelfontBold", "0")
      .setOrigin(0, 0);

    this.uiContainer.add([
      waterIcon,
      this.waterText,
      bugIcon,
      this.insectText,
      sprayIcon,
      this.sprayText,
    ]);

    this.actionButtons = this.game.add.container(0, 0).setDepth(10);

    // spray button
    this.sprayButton = this.game.add
      .image(width - 56, height - 200, "spray")
      .setOrigin(0.5, 0.5)
      .setTint(0xeeeeee)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        if (this.game.bioControlCount >= 5) {
          this.sprayButton.setTint(0xffffff);
          this.game.tweens.add({
            targets: this.sprayButton,
            scale: 1.1,
            duration: 100,
          });
        }

        const x = this.sprayButton.getBounds().left - 4;
        const y = this.sprayButton.getBounds().top + 12;
        const w = 120;
        const h = 48;
        const text = "Bio Control Spray\nReduce -3 Insects\nCost: -5 Spray";
        this.setTooltip(x, y, w, h, text);
        this.showTooltip(true);
      })
      .on("pointerout", () => {
        if (this.game.bioControlCount >= 5) {
          this.sprayButton.setTint(0xeeeeee);
          this.game.tweens.add({
            targets: this.sprayButton,
            scale: 1,
            duration: 100,
          });
        }

        this.showTooltip(false);
      })
      .on("pointerdown", () => {
        if (this.game.bioControlCount >= 5) {
          this.game.sound.play("click");
          this.game.giveBioControl();
        }
      });

    // water button
    this.waterButton = this.game.add
      .image(width - 56, height - 128, "watering")
      .setOrigin(0.5, 0.5)
      .setTint(0xeeeeee)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        if (this.game.waterCount >= 10) {
          this.waterButton.setTint(0xffffff);
          // giveWaterText.setVisible(true);
          this.game.tweens.add({
            targets: this.waterButton,
            scale: 1.1,
            duration: 100,
          });
        }

        const x = this.waterButton.getBounds().left - 4;
        const y = this.waterButton.getBounds().top + 12;
        const w = 110;
        const h = 48;
        const text = "Give Water\nHeal: +20 HP\nCost: -10 Water";
        this.setTooltip(x, y, w, h, text);
        this.showTooltip(true);
      })
      .on("pointerout", () => {
        if (this.game.waterCount >= 10) {
          this.waterButton.setTint(0xeeeeee);
          // giveWaterText.setVisible(false);
          this.game.tweens.add({
            targets: this.waterButton,
            scale: 1,
            duration: 100,
          });
        }

        this.showTooltip(false);
      })
      .on("pointerdown", () => {
        if (this.game.waterCount >= 10) {
          this.game.sound.play("click");
          this.game.giveWater();
        }
      });

    // observe button
    this.observeButton = this.game.add
      .image(width - 56, height - 48, "observe")
      // .bitmapText(width - 16 - 52, height - 16 - 16, "pixelfont", "Observe", 8)
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        // this.observeButton.setBackgroundColor("#444");
        this.game.tweens.add({
          targets: this.observeButton,
          scale: 1.1,
          duration: 100,
        });

        const x = this.observeButton.getBounds().left - 4;
        const y = this.observeButton.getBounds().top + 12;
        const w = 110;
        const h = 48;
        const text = "Observe\nWait and see for the next turn";
        this.setTooltip(x, y, w, h, text);
        this.showTooltip(true);
      })
      .on("pointerout", () => {
        // this.observeButton.setBackgroundColor("#333");
        this.game.tweens.add({
          targets: this.observeButton,
          scale: 1,
          duration: 100,
        });
        this.showTooltip(false);
      })
      .on("pointerdown", () => {
        this.game.sound.play("click");
        this.game.observe();
      });

    this.actionButtons.add([
      this.sprayButton,
      this.waterButton,
      this.observeButton,
    ]);
    // hide action buttons
    this.actionButtons.setVisible(false);

    // create tooltip
    this.tooltip = this.game.add
      .rectangle(0, 0, 100, 50, 0x000000, 0.7)
      .setOrigin(1, 0)
      .setDepth(50)
      .setVisible(false);
    this.tooltipText = this.game.add
      .bitmapText(
        this.tooltip.getBounds().left + 8,
        this.tooltip.getBounds().top + 8,
        "pixelfont",
        "-",
      )
      .setMaxWidth(this.tooltip.width - 16)
      .setOrigin(0, 0)
      .setDepth(50)
      .setVisible(false);

    this.levelText = this.game.add
      .bitmapText(8, height - 8, "pixelfont", "Level 1\n")
      .setMaxWidth(150)
      .setOrigin(0, 1);

    this.levelTitle = this.game.add
      .bitmapText(
        width / 2,
        height / 2 - 120,
        "pixelfontBold",
        "Level 1\nSurvive for 5 turns",
        12,
      )
      .setCenterAlign()
      .setOrigin(0.5, 0.5)
      .setAlpha(0);

    this.uiContainer.add([this.levelText, this.levelTitle]);

    // Menu
    this.menuContainer = this.game.add.container(0, 0).setDepth(20);
    const menuTitleText = this.game.add
      .bitmapText(
        width / 2,
        height / 2 - 120,
        "pixelfontBold",
        "Symbio Garden",
        24,
      )
      .setOrigin(0.5, 0.5)
      .setAlpha(0);

    this.game.tweens.add({
      targets: menuTitleText,
      duration: 500,
      delay: 800,
      alpha: 1,
      onComplete: () => {
        this.game.tweens.add({
          targets: playButton,
          duration: 500,
          alpha: 1,
        });
      },
    });

    const playButton = this.game.add
      .bitmapText(width - 8 - 64, height - 8 - 64, "pixelfontBold", "Play", 14)
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.game.tweens.add({
          targets: playButton,
          duration: 200,
          scale: 1.1,
        });
      })
      .on("pointerout", () => {
        this.game.tweens.add({
          targets: playButton,
          duration: 200,
          scale: 1,
        });
      })
      .on("pointerdown", () => {
        this.game.sound.play("click");
        this.game.startPlay();
      })
      .setAlpha(0);

    this.menuContainer.add([menuTitleText, playButton]);

    this.nextLevelButton = this.game.add
      .bitmapText(
        width - 8 - 64,
        height - 8 - 64,
        "pixelfontBold",
        "Next Level >",
        14,
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.game.tweens.add({
          targets: this.nextLevelButton,
          duration: 200,
          scale: 1.1,
        });
      })
      .on("pointerout", () => {
        this.game.tweens.add({
          targets: this.nextLevelButton,
          duration: 200,
          scale: 1,
        });
      })
      .on("pointerdown", () => {
        this.game.sound.play("click");
        this.game.nextLevel();
      })
      .setVisible(false);

    this.restartLevelButton = this.game.add
      .bitmapText(
        width - 8 - 64,
        height - 8 - 64,
        "pixelfontBold",
        "Restart Level",
        14,
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.game.tweens.add({
          targets: this.restartLevelButton,
          duration: 200,
          scale: 1.1,
        });
      })
      .on("pointerout", () => {
        this.game.tweens.add({
          targets: this.restartLevelButton,
          duration: 200,
          scale: 1,
        });
      })
      .on("pointerdown", () => {
        this.game.sound.play("click");
        this.game.restartLevel();
      })
      .setVisible(false);

    // Credits
    this.creditsContainer = this.game.add.container(0, 0).setDepth(20);
    const thanksText = this.game.add
      .bitmapText(
        width / 2,
        height / 2 - 120,
        "pixelfont",
        "Thanks for playing!",
        18,
      )
      .setOrigin(0.5, 0.5);

    const creditsTitleText = this.game.add
      .bitmapText(
        width / 2,
        height / 2 - 80,
        "pixelfontBold",
        "Symbio Garden",
        24,
      )
      .setOrigin(0.5, 0.5);

    const creatorText = this.game.add
      .bitmapText(
        width / 2,
        height - 80,
        "pixelfont",
        "Created by\nandreecy",
        16,
      )
      .setOrigin(0.5, 0.5);

    this.creditsContainer.add([thanksText, creditsTitleText, creatorText]);
    this.creditsContainer.setY(height);

    this.creditsTween = this.game.tweens
      .chain({
        targets: this.creditsContainer,
        tweens: [
          {
            y: 0,
            duration: 3000,
          },
          {
            y: 0,
            duration: 3000,
            onComplete: () => {
              this.creditsContainer.setY(height);
              this.creditsContainer.setVisible(false);
              this.game.changeState(this.game.menuGameState);
            },
          },
        ],
      })
      .pause();
  }

  showMenuUi(isShow: boolean) {
    this.menuContainer.setVisible(isShow);
  }

  showGameUi(isShow: boolean) {
    this.uiContainer.setVisible(isShow);
  }

  showActionButtons(show: boolean) {
    this.actionButtons.setVisible(show);
  }

  showNextLevelButton(show: boolean) {
    this.nextLevelButton.setVisible(show);
  }

  showRestartLevelButton(show: boolean) {
    this.restartLevelButton.setVisible(show);
  }

  showCreditsUi(show: boolean) {
    this.creditsContainer.setVisible(show);
    this.creditsTween.restart();
  }

  setTooltip(
    x: number,
    y: number,
    w: number,
    h: number,
    text: string,
    origin?: { x: number; y: number },
  ) {
    if (origin) {
      this.tooltip.setOrigin(origin.x, origin.y);
    } else {
      this.tooltip.setOrigin(1, 0.5);
    }
    this.tooltip.setPosition(x, y).setSize(w, h);
    this.tooltipText
      .setPosition(
        this.tooltip.getBounds().left + 8,
        this.tooltip.getBounds().top + 8,
      )
      .setMaxWidth(this.tooltip.width - 16)
      .setText(text);
  }

  showTooltip(show: boolean) {
    this.tooltip.setVisible(show);
    this.tooltipText.setVisible(show);
  }

  setHp(hp: number) {
    if (this.hp != 0) {
      this.game.add.tween({
        targets: this.hpBar,
        duration: 300,
        ease: "Power2",
        width: 100 * (hp / 100),
        onStart: () => {
          this.hpBar.setAlpha(1);
        },
        onComplete: () => {
          this.game.tweens.add({
            targets: this.hpBar,
            duration: 300,
            alpha: 0,
            onComplete: () => {
              this.hpBar.setAlpha(1);
              this.hpBar.setFillStyle(
                hp > 50 ? 0x38c759 : hp <= 30 ? 0xff0000 : 0xffca42,
              );
              this.hpText.setText(`${hp}/100`);
            },
          });
        },
      });
    } else {
      this.hpBar.setSize(100 * (hp / 100), 10);
      this.hpBar.setFillStyle(
        hp > 50 ? 0x38c759 : hp <= 30 ? 0xff0000 : 0xffca42,
      );
      this.hpText.setText(`${hp}/100`);
    }

    this.hp = hp;
  }

  setLevel(level: number) {
    const config = levels[level - 1];
    this.levelConfig = config;
    this.levelTitle.setText(
      `Level ${level}\n${config.title}\n${config.description}`,
    );
    this.levelText.setText(
      `Level ${level}\n${config.title}\n${config.description}`,
    );

    this.game.tweens.add({
      targets: this.levelTitle,
      duration: 500,
      alpha: 1,
      onComplete: () => {
        this.game.tweens.add({
          targets: this.levelTitle,
          delay: 2000,
          duration: 500,
          alpha: 0,
        });
      },
    });
  }

  update(data: {
    turn: number;
    plant: { hp: number };
    insects: any[];
    bioControlCount: number;
    waterCount: number;
  }) {
    const { turn, insects, waterCount, bioControlCount } = data;
    this.turnText.text = `Turn ${turn}`;
    this.sprayText.text = `${bioControlCount}`;
    this.insectText.text = `${insects.length}`;
    this.waterText.text = `${waterCount}`;
  }
}
