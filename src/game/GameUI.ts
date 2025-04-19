import { Game } from "../scenes/Game";

export class GameUI {
  debugText: Phaser.GameObjects.Text;
  watterButton: Phaser.GameObjects.Image;
  endTurnButton: Phaser.GameObjects.Text;

  constructor(private game: Game) {}

  create() {
    const width = this.game.cameras.main.width;
    const height = this.game.cameras.main.height;

    const container = this.game.add.container(0, 0).setDepth(10);

    this.debugText = this.game.add
      .text(16, height - 16, "", {
        font: "14px",
      })
      .setOrigin(0, 1);

    container.add(this.debugText);

    const giveWaterText = this.game.add
      .text(width - 16, height - 16 - 16 - 32 - 16, "Give Water", {
        font: "14px",
        padding: { x: 8, y: 4 },
      })
      .setVisible(false)
      .setOrigin(1, 0.5);
    container.add(giveWaterText);

    // water button
    this.watterButton = this.game.add
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
        this.game.giveWater();
      });

    container.add(this.watterButton);

    // do nothing button
    this.endTurnButton = this.game.add
      .text(width - 16, height - 16 - 16, "Do Nothing", {
        font: "14px",
        backgroundColor: "#333",
        padding: { x: 10, y: 10 },
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        // do nothing
        this.game.endTurn();
      });

    container.add(this.endTurnButton);
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
