import { Game } from "../scenes/Game";
import { GameState } from "./GameState";

export class EndOfTurnState implements GameState {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  enter() {
    console.log("Entering End of Turn State");
    // Additional logic for entering the end of turn state
    // This could include displaying a summary of the turn, updating UI elements, etc.

    // insects count increases by 1 if turn is even (divisible by 2)
    if (this.game.turn % 2 === 0) {
      this.game.addInsect();
    }
    // decrease plant health by insects count * 2
    this.game.plant.decreaseHp(this.game.insects.length * 2);
    this.game.gameUi.setHp(this.game.plant.hp);

    // decrease plant health by -5 if plant health <= 50
    if (this.game.plant.hp <= 50) {
      this.game.plant.decreaseHp(5);
      this.game.gameUi.setHp(this.game.plant.hp);
    }

    this.game.nextTurn();
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
