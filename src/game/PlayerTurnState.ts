import { Game } from "../scenes/Game";
import { GameState } from "./GameState";

export class PlayerTurnState implements GameState {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  enter(): void {
    console.log("Entering Player Turn State");
    // Additional logic for entering the player turn state
    // This could include setting up the UI, enabling player actions, etc.

    if (this.game.levelConfig.goal === "TURN") {
      if (this.game.turn > this.game.levelConfig.value) {
        this.game.gameUi.setTooltip(
          this.game.scale.width / 2,
          this.game.scale.height - 8,
          256,
          64,
          `Level ${this.game.level} Complete\nYou have reached the goal of ${this.game.levelConfig.value} turns.\nYou have survived until now.`,
          { x: 0.5, y: 1 },
        );
        this.game.gameUi.showTooltip(true);
        // this.game.gameOver();
        this.game.setLevel(this.game.level + 1);
        return;
      }
    }

    this.game.gameUi.showActionButtons(true);
  }

  update(time: number, delta: number): void {
    console.log("Updating Player Turn State");
    // Additional logic for updating the player turn state
    // This could include checking for player input, updating the game state, etc.
    // For example, you might check if the player has made a move
  }

  exit(): void {
    console.log("Exiting Player Turn State");
    // Additional logic for exiting the player turn state
    // This could include resetting variables, disabling player actions, etc.

    this.game.gameUi.showActionButtons(false);
  }
}
