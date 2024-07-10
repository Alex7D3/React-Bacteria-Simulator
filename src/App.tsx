import { useState, useEffect, useCallback, useRef, MouseEvent, ChangeEventHandler } from 'react';
import Grid from "./components/Grid";
import useInterval from './hooks/useInterval';

function create2DArray(numRows: number, numCols: number): number[][] {
    const grid = [];
    for (let i = 0; i < numRows; i++)
        grid.push(Array(numCols).fill(0));
    
    return grid;
}

const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];

export default function App() {
    const [grid, setGrid] = useState<number[][]>(create2DArray(20, 20));
    const [bacteriaCount, setBacteriaCount] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [elapsedTime, setElaspsedTime] = useState<number>(0);
    const [timeInterval, setTimeInterval] = useState<number>(1000);
    const [inputError, setInputError] = useState<boolean>(false);
    const intervalId = useRef<NodeJS.Timeout | string | number | undefined>();
    const startTime = useRef<number>(0);

    const duplicateBacteria = useCallback(() => setGrid(prevGrid => {
        const nextGrid = JSON.parse(JSON.stringify(prevGrid));
        const rows = prevGrid.length, cols = prevGrid[0].length;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (0 < prevGrid[i][j] && prevGrid[i][j] < 5) {
                    const adjacents = [];
                    for (const [rowOffset, colOffset] of directions) {
                        const adjRow = i + rowOffset;
                        const adjCol = j + colOffset;
                        if (adjRow >= 0 && adjRow < rows &&
                            adjCol >= 0 && adjCol < cols &&
                            !nextGrid[adjRow][adjCol]) 
                        {
                            adjacents.push([adjRow, adjCol]);
                        }
                    }
                    if (adjacents.length > 0) {
                        const [chosenRow, chosenCol] = adjacents[Math.floor(Math.random() * adjacents.length)];
                        nextGrid[chosenRow][chosenCol] = 1;
                    }
                    nextGrid[i][j]++;
                }
            }
        }
        return nextGrid;
    }), []);

    const resizeGrid = useCallback((newRows: number, newCols: number): void => {
        setGrid(grid => {
            const updatedGrid = create2DArray(newRows, newCols);
            for (let i = 0; i < Math.min(grid.length, newRows); i++) {
                for (let j = 0; j < Math.min(grid[0].length, newCols); j++) {
                    updatedGrid[i][j] = grid[i][j];
                }
            }
            return updatedGrid;
        });
    }, []);

    const toggleCell = useCallback((i: number, j: number) => {
        // if (isRunning) return;
        // if (grid[i][j]) {
        //     setBacteriaCount(bacteriaCount => bacteriaCount - 1);
        // } else {
        //     setBacteriaCount(bacteriaCount => bacteriaCount + 1);
        // }
        setGrid(grid => grid.map((row, r) => {
            if (r === i) {
                return [...row.slice(0, j), +!grid[i][j], ...row.slice(j + 1, grid[0].length)];
            } 
            return row;
        }));
    }, []);

    function startStop(): void {
        if (isRunning) {
            setElaspsedTime(0);
        } else {
            startTime.current = Date.now() - elapsedTime;
            if (bacteriaCount === 0) {
                //error message
            }
        }
        setIsRunning(!isRunning);
    }

    function reset(): void {
        setElaspsedTime(0);
        setIsRunning(false);
        setGrid(create2DArray(grid.length, grid[0].length));
    }

    useEffect(() => {
        if (isRunning) {
            intervalId.current = setInterval(() => {
                duplicateBacteria();
                setElaspsedTime(Date.now() - startTime.current);
                console.log('here');
            }, timeInterval);
        }

        return () => clearInterval(intervalId.current);
    }, [isRunning, duplicateBacteria, timeInterval]);

    return (
        <div className="App">
            <nav></nav>
            <ul className="controls">
                <li><button className={isRunning ? "stop" : "start"} onClick={startStop}>{isRunning ? "Stop" : "Start"}</button></li>
                <li><button className="reset" onClick={reset}>Reset</button></li><button onClick={duplicateBacteria}></button>
                <li>
                    <label htmlFor="size-input"><b>Grid Size: </b></label>
                    <input
                        aria-labelledby="size-input"
                        type="number"
                        min={1} max={999}
                        value={grid.length}
                        onChange={(e) => {
                            const { max, min, value } = e.target;
                            const newValue = parseInt(value);
                            if (newValue !== 0) resizeGrid(Math.min(Math.max(newValue, parseInt(min)), parseInt(max)), grid[0].length)
                        }
                        }
                    />
                    &times;
                    <input
                        aria-labelledby="size-input"
                        type="number"
                        min={1} max={999}
                        value={grid[0].length}
                        onBlur={() => {
                            if (grid[0].length < 1) resizeGrid(grid.length, 1);
                        }}
                        onChange={(e) => resizeGrid(grid.length, parseInt(e.target.value))}
                        
                    />
                </li>
                <li>
                <label htmlFor="interval-input"><b>Interval: </b></label>
                    <input
                        id="interval-input"
                        type="number"
                        value={timeInterval}
                        onChange={(e) => setTimeInterval(parseInt(e.target.value))}
                        
                    /> miliseconds
                </li>
            </ul>
            <header className="App-header">
                <Grid
                    handleCellClick={toggleCell}
                    grid={grid}
                />
            </header>
        </div>
    );
}