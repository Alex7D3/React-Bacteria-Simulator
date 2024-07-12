import { memo } from "react";

export default function Grid({ grid, handleClick }: GridProps) {
  const gridJSX = [], header = [];

  for (let j = 0; j < grid[0].length; j++) {
    header.push(<th scope="col" key={j}>{j + 1}</th>);
  }
  gridJSX.push(<tr key={-1}><th scope="col"></th>{header}</tr>);

  for (let i = 0; i < grid.length; i++) {
    const row = [];
    for (let j = 0; j < grid[0].length; j++) {
      row.push(<td key={j}><Cell generation={grid[i][j]} handleCellClick={handleClick} i={i} j={j} /></td>);
    }
    gridJSX.push(<tr key={i} className="row"><th scope="row" className="row-header">{i + 1}</th>{row}</tr>);
  }

  return (
    <div className="grid">
      <table>
        <tbody>{gridJSX}</tbody>
      </table>
    </div>
  );
}

const Cell = memo(({ i, j, generation, handleCellClick }: CellProps) => {
  const desc = `bacterium at (${i+1}, ${j+1})`;
  return (
    <button className="cell" onClick={() => handleCellClick(i, j)}>
      {generation > 0 && <img src={process.env.PUBLIC_URL + "/bacteria-icon.svg"} alt={desc} title={desc}></img>}
    </button>
  );
});
