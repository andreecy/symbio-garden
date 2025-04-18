export interface GameState {
  enter(): void;

  update(time: number, delta: number): void;

  exit(): void;
}
