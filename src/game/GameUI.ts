import { Game } from "../scenes/Game";

export class GameUI {
  debugText: Phaser.GameObjects.Text;
  waterButton: Phaser.GameObjects.Image;
  endTurnButton: Phaser.GameObjects.Text;
  actionButtons: Phaser.GameObjects.Container;

  constructor(private game: Game) {}

  create() {
    const width = this.game.cameras.main.width;
    const height = this.game.cameras.main.height;

    this.actionButtons = this.game.add.container(0, 0).setDepth(10);

    this.debugText = this.game.add
      .text(16, height - 16, "", {
        font: "14px",
      })
      .setOrigin(0, 1);

    const giveWaterText = this.game.add
      .text(width - 16, height - 16 - 16 - 32 - 16, "Give Water", {
        font: "14px",
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
    this.endTurnButton = this.game.add
      .text(width - 16 - 52, height - 16 - 16, "Do Nothing", {
        font: "14px",
        backgroundColor: "#333",
        padding: { x: 10, y: 10 },
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.endTurnButton.setBackgroundColor("#444");
        this.game.tweens.add({
          targets: this.endTurnButton,
          scale: 1.1,
          duration: 100,
        });
      })
      .on("pointerout", () => {
        this.endTurnButton.setBackgroundColor("#333");
        this.game.tweens.add({
          targets: this.endTurnButton,
          scale: 1,
          duration: 100,
        });
      })
      .on("pointerdown", () => {
        // do nothing
        this.game.endTurn();
      });

    this.actionButtons.add(this.endTurnButton);
    // hide action buttons
    this.actionButtons.setVisible(false);
  }

  showActionButtons(show: boolean) {
    this.actionButtons.setVisible(show);
  }

  update(data: {
    turn: number;
    plant: { hp: number };
    insects: any[];
    waterCount: number;
  }) {
    const { turn, plant, insects, waterCount } = data;
    this.debugText.setText(
      `Turn: ${turn}\nPlant hp: ${plant.hp}\nInsects: ${insects.length}\nWater: ${waterCount}`
    );
  }
}
