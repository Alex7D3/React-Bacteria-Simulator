import { useState, useCallback, useEffect, memo } from "react";

type gridprops = { grid: number[][], handleCellClick: (row: number, col: number) => void };
export default function Grid({ grid, handleCellClick }: gridprops) {
    console.log('grid renderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
    
    return (
        <div className="grid"><table><tbody>
            <tr><th scope="col"></th>{grid[0].map((_, col) => <th scope="col" key={col}>{col + 1}</th>)}</tr>{
                grid.map((row, i) => <tr key={i} className="row">
                    <th scope="row">{i+1}</th>
                    {row.map((value, j) => <td key={j}>
                        <Cell
                            generation={value} 
                            handleCellClick={handleCellClick}
                            i={i}
                            j={j}
                        />
                        </td>)
                    }</tr>
                )
            }
        </tbody></table></div>
    );
}

type cellprops = { i: number, j: number, generation: number, handleCellClick: (row: number, col: number) => void };
const Cell = memo(({i, j, generation, handleCellClick }: cellprops) => {
    console.log('I rendered');
    return (
        <button className="cell" onClick={() => handleCellClick(i, j)}>
            {generation > 0 && <img src="/bacteria-icon.svg" alt={`bacterium at row ${i} ${j}`}></img>}
        </button>
    );
});