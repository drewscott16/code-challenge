import { useState } from "react";
import Robot from "./Robot";
import "./board.css";
import "./robot.css";

export default function Board(props) {
    const { gridSize, robots } = props;
    const [output, setOutput] = useState([]);
    const [robotsRendered, setRobotsRendered] = useState(0);
    const [lostCoordinates, setLostCoordinates] = useState([]);
    const rows = [];

    const renderBoard = (gridSize) => {
        let columns = [];

        for (let i = 0; i < gridSize.height; i++) {
            //build columns
            for (let i = 0; i < gridSize.width; i++) {
                columns.push(<div className="grid-column" key={i}></div>);
            }
            //add row
            rows.push(
                <div className="grid-row" key={i}>
                    {columns.map((col) => col)}
                </div>
            );
            //clear columns
            columns = [];
        }
    };

    renderBoard(gridSize);

    return (
        <>
            <div id="board">
                {rows.map((row) => row)}

                {robots.map((robotArr, index) => {
                    if (!robotArr.length) return ""; //add error handling

                    return (
                        <Robot
                            key={index}
                            index={index}
                            output={output}
                            gridSize={gridSize}
                            setOutput={setOutput}
                            lostCoordinates={lostCoordinates}
                            setLostCoordinates={setLostCoordinates}
                            coordinates={robotArr[0].split(" ")}
                            instructions={robotArr[1].split("")}
                            robotsRendered={robotsRendered}
                            setRobotsRendered={setRobotsRendered}
                        />
                    );
                })}
            </div>

            <div id="output">
                <h3>Output</h3>
                <div>
                    {output.map((line, index) => {
                        return (
                            <div key={index}>
                                {line.map((char, index) => {
                                    return <span key={index}>{char}</span>;
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
