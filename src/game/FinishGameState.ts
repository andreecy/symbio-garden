import { Game } from "../scenes/Game";
import { GameState } from "./GameState";

export class FinishGameState implements GameState {
  constructor(
    private game: Game,
    private isLevelCompleted?: boolean,
  ) {}

  enter() {
    console.log("Entering Finish Game State");
    // Additional logic for entering the finish game state
    this.game.gameUi.showMenuUi(false);

    console.log(this.isLevelCompleted ? "Level Completed" : "Game Over");
  }

  update(time: number, delta: number): void {
    console.log("Updating Finish Game State");
    // Additional logic for updating the finish game state
    // This could include animations, transitions, or displaying final scores
  }

  exit() {
    console.log("Exiting Finish Game State");
    // Additional logic for exiting the finish game state
  }
}
