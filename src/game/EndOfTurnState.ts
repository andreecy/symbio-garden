import { Game } from "../scenes/Game";
import { GameState } from "./GameState";

export class EndOfTurnState implements GameState {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  enter() {
    // console.log("Entering End of Turn State");
    // Additional logic for entering the end of turn state
    // This could include displaying a summary of the turn, updating UI elements, etc.

    let isInsectArrived = false;
    // insects count increases by 1 if turn is even (divisible by 2)
    if (this.game.turn % 2 === 0) {
      isInsectArrived = true;
      this.game.addInsect();
    }

    const insectDamage = this.game.insects.length * 2;
    // decrease plant health by insects count * 2
    this.game.plant.decreaseHp(insectDamage);
    this.game.gameUi.setHp(this.game.plant.hp);

    let lackOfWaterDamage = 0;
    // decrease plant health by -5 if plant health <= 50
    if (this.game.plant.hp <= 50) {
      lackOfWaterDamage = 5;
      this.game.plant.decreaseHp(lackOfWaterDamage);
      this.game.gameUi.setHp(this.game.plant.hp);
    }

    if (isInsectArrived || insectDamage > 0 || lackOfWaterDamage > 0) {
      this.game.dialogUi.push(
        `${isInsectArrived ? "An insect has arrived.\n" : ""}${
          insectDamage > 0 ? `Plant hp -${insectDamage} due to insects.\n` : ""
        }${
          lackOfWaterDamage > 0
            ? `Plant hp -${lackOfWaterDamage} due to lack of water.\n`
            : ""
        }`
      );
      this.game.dialogUi.show();
    }

    if (insectDamage > 0 || lackOfWaterDamage > 0) {
      this.game.sound.play("hit");
    }

    if (this.game.plant.hp <= 0) {
      this.game.dialogUi.push(
        `Game Over\nPlant has died.\nYou failed to restore balance.`
      );
      this.game.dialogUi.show();
      this.game.finishGame();
    } else {
      // check if level is complete
      if (this.game.levelConfig.goal === "TURN") {
        if (this.game.turn >= this.game.levelConfig.value) {
          this.game.dialogUi.push(
            `Level ${this.game.level} Complete\nYou have reached the goal of ${this.game.levelConfig.value} turns.\nYou have survived until now.`
          );
          this.game.dialogUi.show();
          this.game.finishGame(true);
          this.game.sound.play("levelup");
          return;
        }
      }
      this.game.nextTurn();
    }
  }

  update(time: number, delta: number): void {
    // console.log("Updating End of Turn State");
    // Additional logic for updating the end of turn state
    // This could include animations, transitions, or displaying final scores
  }

  exit() {
    // console.log("Exiting End of Turn State");
    // Additional logic for exiting the end of turn state
    // This could include resetting variables, stopping animations, etc.
  }
}
