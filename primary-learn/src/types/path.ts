/** A level on the maths map. One per node in curriculum/maths.md. */
export type PathNode = {
  number: number;
  id: string;
  title: string;
};

export type PathCategory = {
  id: string;
  title: string;
  year: string;
  nodes: PathNode[];
};

/** Every level has three difficulties: 1 easy, 2 medium, 3 hard. */
export type Difficulty = 1 | 2 | 3;
