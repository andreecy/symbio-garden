import { Game } from "../scenes/Game";
import { GameState } from "./GameState";

export class PlayerTurnState implements GameState {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  enter(): void {
    // console.log("Entering Player Turn State");
    // Additional logic for entering the player turn state
    // This could include setting up the UI, enabling player actions, etc.

    this.game.gameUi.showActionButtons(true);
  }

  update(time: number, delta: number): void {
    // console.log("Updating Player Turn State");
    // Additional logic for updating the player turn state
    // This could include checking for player input, updating the game state, etc.
    // For example, you might check if the player has made a move
  }

  exit(): void {
    // console.log("Exiting Player Turn State");
    // Additional logic for exiting the player turn state
    // This could include resetting variables, disabling player actions, etc.

    this.game.gameUi.showActionButtons(false);
  }
}
