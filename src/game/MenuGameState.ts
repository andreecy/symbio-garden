import { Game } from "../scenes/Game";
import { GameState } from "./GameState";

export class MenuGameState implements GameState {
  constructor(private game: Game) {}

  enter() {
    console.log("Entering Menu Game State");
    // Additional logic for entering the menu game state
    this.game.gameUi.showMenuUi(true);
    this.game.gameUi.showGameUi(false);
  }

  update(time: number, delta: number): void {
    console.log("Updating Menu Game State");
    // Additional logic for updating the menu game state
    // This could include checking for player input, updating the game state, etc.
  }

  exit() {
    console.log("Exiting Menu Game State");
    // Additional logic for exiting the menu game state
    // This could include resetting variables, disabling player actions, etc.
    this.game.gameUi.showMenuUi(false);
  }
}
