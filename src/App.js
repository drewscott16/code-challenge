import { useState, useRef } from "react";
import Board from "./components/Board";

export default function App() {
    const [gridSize, setGridSize] = useState({});
    const [robots, setRobots] = useState([]);
    const [showBoard, setShowBoard] = useState(false);
    const textArea = useRef(null);

    const userClickBtn = () => {
        let userInput = textArea.current.value;

        if (showBoard) {
            //remove the board and wait to re-run
            setShowBoard(false);
            setTimeout(() => {
                runUserInput();
            }, 300);
        } else {
            setShowBoard(true);
            runUserInput();
        }

        function runUserInput() {
            if (!userInput) return; //add error handling
            const lines = userInput.split("\n");
            const gridSize = lines[0].split(" ");
            const gridWidth = parseInt(gridSize[0], 10);
            const gridHeight = parseInt(gridSize[1], 10);
            const robots = [];
            let tmp = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                if (line) {
                    tmp.push(line);
                }
                if (line === "") {
                    //blank line creates a new robot
                    robots.push(tmp);
                    tmp = [];
                }
            }

            setGridSize({ width: gridWidth, height: gridHeight });
            setRobots(robots);
            setShowBoard(true);
        }
    };

    return (
        <div className="App">
            <div className="container">
                <div className="row">
                    <div className="col-12 mt-30 mb-30">
                        <h2>Martian Robots - Code Challenge</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <textarea
                            id="text-area"
                            ref={textArea}
                            defaultValue={`6 4
1 1 E
RFRFRFRF

3 2 N
FRRFLLFFRRFLL

0 3 W
LLFFFLFLFL
`}
                        ></textarea>
                    </div>

                    <div className="col-12">
                        <button className="btn btn-primary" id="run" onClick={() => userClickBtn()}>
                            Run
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">{showBoard && gridSize ? <Board id="board" gridSize={gridSize} robots={robots} /> : ""}</div>
                </div>
            </div>
        </div>
    );
}
