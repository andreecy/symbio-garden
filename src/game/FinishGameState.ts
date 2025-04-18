import { GameState } from "./GameState";

export class FinishGameState implements GameState {
  constructor() {}

  enter() {
    console.log("Entering Finish Game State");
    // Additional logic for entering the finish game state
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
