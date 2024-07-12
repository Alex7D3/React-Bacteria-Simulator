type Grid = number[][];

type CellProps = {
  i: number;
  j: number;
  generation: number;
  handleCellClick: (row: number, col: number) => void;
};

type GridProps = {
  grid: Grid;
  handleClick: (row: number, col: number) => void;
};