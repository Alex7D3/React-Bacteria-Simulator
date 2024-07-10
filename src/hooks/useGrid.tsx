import { useState, useCallback, useRef, useEffect } from "react";

function create2DArray(row: number, col: number): boolean[][] {
    return Array.from({ length: row }, () => Array(col).fill(false));
}

export default function useGrid(initialRows: number, initialCols: number): Grid {
    const [grid, setGrid] = useState(create2DArray(20, 20));
    const [generation, setGeneration] = useState<number[][]>(Array(grid.length));
    const rows: number = grid.length;
    const cols: number = grid[0].length;

    const duplicateBacteria = useCallback(() => {
        const directions = [[0, -1], [-1, 0], [1, 0], [0, 1]];
        const nextGeneration: number[][] = [];
        const updatedGrid: Grid = JSON.parse(JSON.stringify(grid));

        for (const [row, col] of generation) {
            let freeAdjacents = []

            for (const [rowOffset, colOffset] of directions) {
                const newRow = row + rowOffset;
                const newCol = col + colOffset;
                
                if (newRow >= 0 && newRow < grid.length &&
                    newCol >= 0 && newCol < grid[0].length &&
                    !grid[newRow][newCol])
                {
                    freeAdjacents.push([newRow, newCol]);
                }
            }
            if (freeAdjacents.length) {
                const [adjRow, adjCol] = freeAdjacents[Math.floor(Math.random() * freeAdjacents.length)];
                updatedGrid[adjRow][adjCol] = true;
                nextGeneration.push([adjRow, adjCol]);

                if (freeAdjacents.length > 1) {
                    nextGeneration.push([row, col]);
                }
            }
        }
        setGrid(updatedGrid);
        setGeneration(nextGeneration);
    }, [grid, generation]);

    const resizeGrid = useCallback((newRows: number, newCols: number): void => {
        const updatedGrid = create2DArray(newRows, newCols);
        for (let i = 0; i < Math.min(rows, newRows); i++) {
            for (let j = 0; j < Math.min(cols, newCols); j++) {
                updatedGrid[i][j] = grid[i][j];
            }
        }
        setGrid(updatedGrid);
    }, [grid, rows, cols]);

    const toggleCell = useCallback((i: number, j: number) => {
        setGrid(prevGrid => prevGrid.map((row, rowIdx) => {
            if (rowIdx === i) {
                return [...row.slice(0, j), !prevGrid[i][j], ...row.slice(j, cols)];
            } else {
                return row;
            }
        }));
    }, [cols]);

    return { grid, rows, cols, duplicateBacteria, resizeGrid, toggleCell };
};
