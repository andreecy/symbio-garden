import { Game } from "../scenes/Game";

export class GameUI {
  debugText: Phaser.GameObjects.Text;
  waterButton: Phaser.GameObjects.Image;
  observeButton: Phaser.GameObjects.Text;
  actionButtons: Phaser.GameObjects.Container;
  turnText: Phaser.GameObjects.Text;
  hpBar: Phaser.GameObjects.Rectangle;
  hpText: Phaser.GameObjects.Text;

  hp: number;
  waterText: Phaser.GameObjects.Text;
  uiContainer: Phaser.GameObjects.Container;
  insectText: Phaser.GameObjects.Text;

  constructor(private game: Game) {
    this.hp = 0;
  }

  create() {
    const width = this.game.cameras.main.width;
    const height = this.game.cameras.main.height;

    this.uiContainer = this.game.add.container(0, 0).setDepth(20);

    this.debugText = this.game.add
      .text(16, height - 16, "", {
        font: "12px",
      })
      .setOrigin(0, 1);
    this.uiContainer.add(this.debugText);

    this.turnText = this.game.add
      .text(width / 2, 8, `Turn ${this.game.turn}`, {
        font: "11px",
        backgroundColor: "#333",
        padding: { x: 6, y: 3 },
      })
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
      .text(8 + 100 / 2, 8 + 10 / 2, "100/100", {
        font: "10px",
      })
      .setOrigin(0.5, 0.5);
    this.uiContainer.add(this.hpText);

    const waterIcon = this.game.add
      .image(width - 64, 8, "water")
      .setOrigin(1, 0)
      .setScale(0.5);

    this.waterText = this.game.add
      .text(waterIcon.x, 8, "50", {
        font: "14px",
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0, 0);

    const bugIcon = this.game.add
      .image(width - 60, 32, "insect")
      .setScale(0.7)
      .setOrigin(1, 0);

    this.insectText = this.game.add
      .text(bugIcon.x, 36, "0", {
        font: "14px",
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0, 0);

    this.uiContainer.add([waterIcon, this.waterText, bugIcon, this.insectText]);

    this.actionButtons = this.game.add.container(0, 0).setDepth(10);

    const giveWaterText = this.game.add
      .text(width - 16, height - 16 - 16 - 32 - 16, "Give Water", {
        font: "12px",
        padding: { x: 8, y: 4 },
      })
      .setVisible(false)
      .setOrigin(1, 0.5);
    this.actionButtons.add(giveWaterText);

    // water button
    this.waterButton = this.game.add
      .image(width - 64 - 12, height - 128, "watering")
      .setOrigin(0.5, 0.5)
      .setTint(0xeeeeee)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.waterButton.setTint(0xffffff);
        giveWaterText.setVisible(true);
        this.game.tweens.add({
          targets: this.waterButton,
          scale: 1.1,
          duration: 100,
        });
      })
      .on("pointerout", () => {
        this.waterButton.setTint(0xeeeeee);
        giveWaterText.setVisible(false);
        this.game.tweens.add({
          targets: this.waterButton,
          scale: 1,
          duration: 100,
        });
      })
      .on("pointerdown", () => {
        this.game.giveWater();
      });

    this.actionButtons.add(this.waterButton);

    // do nothing button
    this.observeButton = this.game.add
      .text(width - 16 - 52, height - 16 - 16, "Observe", {
        font: "14px",
        backgroundColor: "#333",
        padding: { x: 10, y: 10 },
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.observeButton.setBackgroundColor("#444");
        this.game.tweens.add({
          targets: this.observeButton,
          scale: 1.1,
          duration: 100,
        });
      })
      .on("pointerout", () => {
        this.observeButton.setBackgroundColor("#333");
        this.game.tweens.add({
          targets: this.observeButton,
          scale: 1,
          duration: 100,
        });
      })
      .on("pointerdown", () => {
        // do nothing
        this.game.endTurn();
      });

    this.actionButtons.add(this.observeButton);
    // hide action buttons
    this.actionButtons.setVisible(false);
  }

  showActionButtons(show: boolean) {
    this.actionButtons.setVisible(show);
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
              this.hpText.setText(`${hp}/100`);
            },
          });
        },
      });
    } else {
      this.hpBar.setSize(100 * (hp / 100), 10);
      this.hpText.setText(`${hp}/100`);
    }

    this.hp = hp;
  }

  update(data: {
    turn: number;
    plant: { hp: number };
    insects: any[];
    waterCount: number;
  }) {
    const { turn, insects, waterCount } = data;
    this.turnText.text = `Turn ${turn}`;
    this.waterText.text = `${waterCount}`;
    this.insectText.text = `${insects.length}`;
  }
}
