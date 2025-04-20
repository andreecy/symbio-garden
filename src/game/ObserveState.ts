import { Game } from "../scenes/Game";
import { GameState } from "./GameState";

export class ObserveState implements GameState {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  enter() {
    // console.log("Entering Observe State");
    // Additional logic for entering the observe state
  }

  update(time: number, delta: number): void {
    // console.log("Updating Observe State");
    // Additional logic for updating the observe state
  }

  exit() {
    // console.log("Exiting Observe State");
    // Additional logic for exiting the observe state
  }
}
