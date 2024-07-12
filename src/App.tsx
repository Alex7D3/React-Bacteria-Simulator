import { useState, useCallback, useMemo } from "react";
import Grid from "./components/Grid";
import Popup from "./components/Popup";
import useKeyPress from "./hooks/useKeyPress";
import useInterval from "./hooks/useInterval";

const directions = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

function create2DArray(numRows: number, numCols: number): Grid {
  const grid = [];
  for (let i = 0; i < numRows; i++) grid.push(Array(numCols).fill(0));
  return grid;
}

export default function App() {
  const [grid, setGrid] = useState<Grid>(create2DArray(20, 20));
  const [generation, setGeneration] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeInterval, setTimeInterval] = useState<number>(1);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [legendVisible, setLegendVisible] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const bacteriaCount = useMemo((): number => {
    let count = 0;
    const rows = grid.length, cols = grid[0].length;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j]) count++;
      }
    }
    return count;
  }, [grid]);

  const resizeRows = useCallback((newRows: number): void => {
    if (newRows > 50 || newRows < 1 || isRunning) return;
    setGrid(prevGrid => {
      const rows = prevGrid.length, cols = prevGrid[0].length;
      return newRows < rows
        ? prevGrid.slice(0, newRows)
        : [...prevGrid, ...create2DArray(newRows - rows, cols)];
    });
  }, [isRunning]);

  const resizeCols = useCallback((newCols: number): void => {
    if (newCols > 50 || newCols < 1 || isRunning) return;
    setGrid(prevGrid => {
      const cols = prevGrid[0].length;
      return newCols < cols
        ? prevGrid.map(row => row.slice(0, newCols))
        : prevGrid.map(row => [...row, ...Array(newCols - cols).fill(0)]);
    });
  }, [isRunning]);

  useKeyPress(startStop, "Space");
  useKeyPress(reset, "KeyR");
  useKeyPress(() => resizeCols(grid[0].length - 1), "ArrowLeft");
  useKeyPress(() => resizeCols(grid[0].length + 1), "ArrowRight");
  useKeyPress(() => resizeRows(grid.length - 1), "ArrowUp", !isInputFocused);
  useKeyPress(() => resizeRows(grid.length + 1), "ArrowDown", !isInputFocused);
  useKeyPress(() => { setErrorVisible(false); setLegendVisible(false); }, "Escape");

  const toggleCell = useCallback((i: number, j: number): void => {
    setGrid((grid) => {
      const newGrid = grid.map((row, rowIndex) =>
        rowIndex === i ? [...row] : row
      );
      newGrid[i][j] = +!grid[i][j];
      return newGrid;
    });
  }, []);

  const duplicateBacteria = useCallback((): void => {
    setGrid((prevGrid) => {
      const nextGrid = JSON.parse(JSON.stringify(prevGrid));
      const rows = prevGrid.length, cols = prevGrid[0].length;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (0 < prevGrid[i][j] && prevGrid[i][j] < 5) {
            const freeAdjacents = [];

            for (const [rowOffset, colOffset] of directions) {
              const adjRow = i + rowOffset;
              const adjCol = j + colOffset;
              if (
                adjRow >= 0 && adjRow < rows &&
                adjCol >= 0 && adjCol < cols &&
                !nextGrid[adjRow][adjCol]
              ) {
                freeAdjacents.push([adjRow, adjCol]);
              }
            }
            if (freeAdjacents.length > 0) {
              const [randRow, randCol] = freeAdjacents[Math.floor(Math.random() * freeAdjacents.length)];
              nextGrid[randRow][randCol] = 1;
            }
            nextGrid[i][j]++;
          }
        }
      }
      return nextGrid;
    });
    setGeneration(prevGen => prevGen + 1);
  }, []);

  const gridFull: boolean = useMemo(() => bacteriaCount === grid.length * grid[0].length, [bacteriaCount, grid]);
  useInterval(duplicateBacteria, isRunning && !gridFull ? timeInterval * 1000 : null);

  function startStop(): void {
    if (!isRunning && bacteriaCount === 0) {
      setErrorVisible(true);
      return;
    }
    setIsRunning(!isRunning);
  }

  function reset(): void {
    setGeneration(1);
    setIsRunning(false);
    setGrid(create2DArray(grid.length, grid[0].length));
  }

  return (<div className="App">
    <header className="App-header">
      <h1>Bacteria Simulator</h1>
      <ul className="controls">
        <li><button className={isRunning ? "stop" : "start"} onClick={startStop} aria-describedby="stop-start-desc">
          {isRunning ? "Stop" : "Start"}</button>
          <p hidden id="stop-start-desc">Start or stop the simulation</p>
        </li>
        <li><button className="reset" onClick={reset} aria-describedby="reset-desc">Reset</button>
          <p hidden id="reset-desc">Clears the grid and resets the simulation</p>
        </li>
        <li>
          <label id="size-label" htmlFor="row-input"><b>Grid Size: </b></label>
          <input
            id="row-input"
            aria-labelledby="size-label"
            max="50"
            min="1"
            type="number"
            aria-describedby="row-desc"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            disabled={isRunning}
            aria-disabled={isRunning}
            value={grid.length}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value > 1) resizeRows(parseInt(e.target.value));
            }}
          />
          <p hidden id="row-desc">Change the number of rows in the grid</p>
          <b>&times;</b>
          <input
            id="col-input"
            aria-label="column-input"
            max="50"
            min="1"
            type="number"
            aria-describedby="col-desc"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            disabled={isRunning}
            aria-disabled={isRunning}
            value={grid[0].length}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value > 1) resizeCols(parseInt(e.target.value));
            }}
          />
          <p hidden id="col-desc">Change the number of columns in the grid</p>
        </li>
        <li>
          <label htmlFor="interval-input"><b>Interval: </b></label>
          <input
            id="interval-input"
            type="number"
            aria-describedby="interval-desc"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            value={timeInterval}
            disabled={isRunning}
            aria-disabled={isRunning}
            onChange={(e) => {
              if (timeInterval >= 1 && timeInterval <= 60)
                setTimeInterval(parseInt(e.target.value));
            }}
          /> seconds
          <p hidden id="interval-desc">Change the time interval between bacteria duplications</p>
        </li>
        <li>
          <button
            id="keyboard-btn"
            className="keyboard-controls"
            onClick={() => setLegendVisible(!legendVisible)}
            aria-describedby="legend"
          >
            Keyboard Controls
          </button>
          <p hidden id="legend">View a legend of the keyboard controls</p></li>
        <li>{legendVisible && <Popup onClose={() => setLegendVisible(!legendVisible)}>
          <h3>Keyboard Controls</h3>
          <ul className="control-list">
            <li><b>Start/Stop: </b><code>Space</code></li>
            <li><b>Reset: </b><code>R Key</code></li>
            <li><b>Adjust grid size: </b><code>{"\u2191 \u2193 \u2190 \u2192"}</code></li>
          </ul>
        </Popup>}
        </li>
      </ul>
      <ul className="display">
        <li><b>Generation: </b><span aria-describedby="generation-desc" className="output">{generation}</span>
          <p hidden id="generation-desc">The current generation of the bacteria colony</p>
        </li>
        <li><b>Bacteria Count: </b><span aria-describedby="count-desc" className="output">{bacteriaCount}</span>
          <p hidden id="count-desc">The total amount of bacteria in the colony</p>
        </li>
        <li>{errorVisible && <Popup onClose={() => setErrorVisible(!errorVisible)} type="error">
          <p>The simulation requires at least one bacterium.</p>
        </Popup>}</li>
      </ul>
    </header>
    <Grid handleClick={toggleCell} grid={grid} />
  </div>);
}