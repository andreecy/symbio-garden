export type LevelConfig = {
  level: number;
  description: string;
  goal: string;
  value: number;
};

export const levels: LevelConfig[] = [
  {
    level: 1,
    description: "Survive until 5 turns",
    goal: "TURN",
    value: 5,
  },
  {
    level: 2,
    description: "Survive until 10 turns",
    goal: "TURN",
    value: 10,
  },
];
