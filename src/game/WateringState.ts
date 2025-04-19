import { Game } from "../scenes/Game";
import { GameState } from "./GameState";

export class WateringState implements GameState {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  enter() {
    console.log("Entering Watering State");
    // Additional logic for entering the watering state
    // For example, you might start a watering animation or update the UI
  }

  update(time: number, delta: number): void {
    console.log("Updating Watering State");
    // Additional logic for updating the watering state
    // This could include checking for player input, updating the game state, etc.
  }

  exit() {
    console.log("Exiting Watering State");
    // Additional logic for exiting the watering state
    // For example, you might stop the watering animation or reset variables
  }
}
