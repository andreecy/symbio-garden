export type LevelConfig = {
  level: number;
  title: string;
  description: string;
  turns: number;
  minHp: number;
  maxInsect: number;
  hp: number;
  water: number;
  insect: number;
  /**
   * Insect rate in turns
   * example: 3 means 1 insect every 3 turns
   */
  insectRate: number;
  /**
   * How many Bio-Control available
   */
  bioControl: number;
};

export const levels: LevelConfig[] = [
  {
    level: 1,
    title: "The Seedling",
    description: "Survive for 5 turns",
    turns: 5,
    minHp: 0,
    maxInsect: -1,
    hp: 70,
    water: 30,
    insect: 1,
    insectRate: 3,
    bioControl: 0,
  },
  {
    level: 2,
    title: "Thirsty Start",
    description: "Keep plant health above 50 for 8 turns",
    turns: 8,
    minHp: 50,
    maxInsect: -1,
    hp: 40,
    water: 40,
    insect: 2,
    insectRate: 3,
    bioControl: 0,
  },
  {
    level: 3,
    title: "Infestation",
    description: "Survive for 10 turns with Insect count 3 or less",
    turns: 10,
    minHp: 0,
    maxInsect: 3,
    hp: 40,
    water: 10,
    insect: 1,
    insectRate: 2,
    bioControl: 4,
  },
  {
    level: 4,
    title: "Drought",
    description: "Keep plant health above 60 for 12 turns",
    turns: 12,
    minHp: 60,
    maxInsect: -1,
    hp: 80,
    water: 10,
    insect: 2,
    insectRate: 3,
    bioControl: 4,
  },
  {
    level: 5,
    title: "Unstable Ecosystem",
    description:
      "Survive for 15 turns with Health above 35 and Insect count 3 or less",
    turns: 15,
    minHp: 50,
    maxInsect: 3,
    hp: 65,
    water: 30,
    insect: 2,
    insectRate: 3,
    bioControl: 3,
  },
];
