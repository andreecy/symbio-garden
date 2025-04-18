import { GameState } from "./GameState";

export class EndOfTurnState implements GameState {
  constructor() {}

  enter() {
    console.log("Entering End of Turn State");
    // Additional logic for entering the end of turn state
  }

  update(time: number, delta: number): void {
    console.log("Updating End of Turn State");
    // Additional logic for updating the end of turn state
    // This could include animations, transitions, or displaying final scores
  }

  exit() {
    console.log("Exiting End of Turn State");
    // Additional logic for exiting the end of turn state
    // This could include resetting variables, stopping animations, etc.
  }
}
