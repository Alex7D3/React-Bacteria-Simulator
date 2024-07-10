import { useState, useCallback, useEffect, memo } from "react";

type gridprops = { grid: number[][], handleCellClick: (row: number, col: number) => void };
export default function Grid({ grid, handleCellClick }: gridprops) {
    console.log('grid renderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
    
    const handleClick = useCallback((row: number, col: number) => {
        return () => {
            handleCellClick(row, col);
        };
    },[handleCellClick]);
    
    return (
        <div className="grid"><table><tbody>
            <tr><th scope="col"></th>{grid[0].map((_, col) => <th scope="col" key={col}>{col + 1}</th>)}</tr>{
                grid.map((row, i) => <tr key={i} className="row">
                    <th scope="row">{i+1}</th>
                    {row.map((value, j) => <td key={j}>
                        <Cell
                            generation={value} 
                            handleCellClick={handleClick(i, j)}
                            coords={`(${i + 1}, ${j + 1})`}
                        />
                        </td>)
                    }</tr>
                )
            }
        </tbody></table></div>
    );
}

type cellprops = { coords: string, generation: number, handleCellClick: () => void };
const Cell = memo(({coords, generation, handleCellClick }: cellprops) => {
    console.log('I rendered');
    return (
        <button className="cell" onClick={handleCellClick}>
            {Boolean(generation) && <img src="/bacteria-icon.svg" alt={`bacterium at row ${coords}`}></img>}
        </button>
    );
});