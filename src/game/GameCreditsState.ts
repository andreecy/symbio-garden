import { Game } from "../scenes/Game";
import { GameState } from "./GameState";

export class GameCreditsState implements GameState {
  constructor(private game: Game) {}

  enter() {
    console.log("Entering Game Credits State");
    // Additional logic for entering the menu game state
    this.game.gameUi.showMenuUi(false);
    this.game.gameUi.showGameUi(false);
    this.game.gameUi.showCreditsUi(true);
  }

  update(time: number, delta: number): void {
    console.log("Updating Game Credits State");
    // Additional logic for updating the menu game state
    // This could include checking for player input, updating the game state, etc.
  }

  exit() {
    console.log("Exiting Credits State");
    // Additional logic for exiting the menu game state
    // This could include resetting variables, disabling player actions, etc.
    this.game.gameUi.showMenuUi(true);
  }
}
