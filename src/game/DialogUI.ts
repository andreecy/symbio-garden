import { Game } from "../scenes/Game";

export class DialogUI {
  box: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.BitmapText;
  dialogs: string[] = [];

  currChar = 0;
  currText = "";
  isTyping: boolean;

  constructor(private game: Game) {}

  create() {
    // create dialogbox
    this.box = this.game.add
      .rectangle(
        this.game.scale.width / 2,
        this.game.scale.height - 8,
        200,
        64,
        0x000000,
        0.7
      )
      .setOrigin(0.5, 1)
      .setDepth(50)
      .setVisible(false);
    // dialog text
    this.text = this.game.add
      .bitmapText(
        this.box.getBounds().left + 8,
        this.box.getBounds().top + 8,
        "pixelfont",
        "-"
      )
      .setMaxWidth(this.box.width - 16)
      .setOrigin(0, 0)
      .setDepth(50)
      .setVisible(false);

    this.game.input.on("pointerdown", () => {
      if (this.isTyping) {
        return;
      }

      if (this.dialogs.length > 0) {
        this.pop();
      } else {
        this.setVisible(false);
      }
    });

    this.game.time.addEvent({
      delay: 50,
      repeat: this.currText.length - 1,
      callback: () => {
        if (this.currChar < this.currText.length) {
          this.isTyping = true;
          this.text.text += this.currText[this.currChar];
          this.currChar++;
        } else {
          this.isTyping = false;
        }
      },
    });
  }

  setVisible(isShow: boolean) {
    this.box.setVisible(isShow);
    this.text.setVisible(isShow);
  }

  /**
   * Add text to the stacks
   *  */
  push(text: string) {
    this.dialogs.push(text);
  }

  /**
   * Pop the last text from the stacks
   */

  pop() {
    if (this.dialogs.length === 0) {
      return;
    }
    const text = this.dialogs.pop();
    if (text) {
      this.text.setText("");
      this.currText = text;
      this.currChar = 0;
    }
  }

  /**
   * Pop the last text from the stacks and show it
   */
  show() {
    this.pop();
    this.setVisible(true);
  }
}
