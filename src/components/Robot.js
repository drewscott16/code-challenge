/* eslint-disable no-loop-func */
import { useState, useEffect } from "react";

export default function Robot(props) {
    const [x, setX] = useState(parseInt(props.coordinates[0], 10));
    const [y, setY] = useState(parseInt(props.coordinates[1], 10));
    const [displayLost, setDisplayLost] = useState(false);
    const [deg, setDeg] = useState(directionToDegrees(props.coordinates[2], 10));
    const rotateLeft = -90;
    const rotateRight = 90;
    const moveX = 50;
    const moveY = -50;
    let lost = false;
    let updateX = x;
    let updateY = y;
    let lostX = 0;
    let lostY = 0;
    let updateDegree = deg;

    function directionToDegrees(direction) {
        switch (direction) {
            case "N":
                return 0;
            case "E":
                return 90;
            case "S":
                return 180;
            case "W":
                return 270;
            default:
                break;
        }
    }

    function degreesToDirection(degree) {
        switch (degree) {
            case 0:
                return "N";
            case 90:
                return "E";
            case -90:
                return "W";
            case 180:
                return "S";
            case -180:
                return "S";
            case 270:
                return "W";
            case -270:
                return "E";
            case 360:
                return "N";
            case -360:
                return "N";
            default:
                break;
        }
    }

    const coord = {
        transform: `translate(${x * moveX}px, ${y * moveY}px) rotate(${deg}deg)`,
    };

    const move = async (instructions) => {
        let letRobotContinue = true;

        //test F command against known lost points
        const testCoord = (testX, testY) => {
            props.lostCoordinates.forEach((coord) => {
                if (!coord.length) return; //add error handling
                const lostX = coord[0];
                const lostY = coord[1];
                //go no further
                if (lostX === testX && lostY === testY) {
                    letRobotContinue = false;
                }
            });

            return letRobotContinue ? true : false;
        };

        for (let i = 0; i < instructions.length; i++) {
            letRobotContinue = true;
            if (!lost) {
                await new Promise(async (resolve) => {
                    setTimeout(() => {
                        switch (instructions[i]) {
                            case "L":
                                updateDegree += rotateLeft;
                                break;
                            case "R":
                                updateDegree += rotateRight;
                                break;
                            case "F":
                                switch (updateDegree) {
                                    case 0: //facing N
                                        if (!testCoord(updateX, updateY + 1)) {
                                            break;
                                        }
                                        updateY += 1;
                                        break;
                                    case 90: //facing E
                                        if (!testCoord(updateX + 1, updateY)) {
                                            break;
                                        }
                                        updateX += 1;
                                        break;
                                    case -90: //facing W
                                        if (!testCoord(updateX - 1, updateY)) {
                                            break;
                                        }
                                        updateX -= 1;
                                        break;
                                    case 180: //facing S
                                        if (!testCoord(updateX, updateY - 1)) {
                                            break;
                                        }
                                        updateY -= 1;
                                        break;
                                    case -180: //facing S
                                        if (!testCoord(updateX, updateY - 1)) {
                                            break;
                                        }
                                        updateY -= 1;
                                        break;
                                    case 270: //facing W
                                        if (!testCoord(updateX - 1, updateY)) {
                                            break;
                                        }
                                        updateX -= 1;
                                        break;
                                    case -270: //facing E
                                        if (!testCoord(updateX + 1, updateY)) {
                                            break;
                                        }
                                        updateX += 1;
                                        break;
                                    case 360: //facing N
                                        if (!testCoord(updateX, updateY + 1)) {
                                            break;
                                        }
                                        updateY += 1;
                                        break;
                                    case -360: //facing N
                                        if (!testCoord(updateX, updateY + 1)) {
                                            break;
                                        }
                                        updateY += 1;
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }

                        //if spins 360 degrees reset to 0
                        if (updateDegree === 360 || updateDegree === -360) {
                            updateDegree = 0;
                        }

                        //check if updated x,y are out of known bounds
                        if (!letRobotContinue) {
                            resolve();
                        } else {
                            if (updateY < 0 || updateX < 0 || props.gridSize.height - 1 < updateY || props.gridSize.width - 1 < updateX) {
                                //since robot has fallen off map we need to get last known coordinates
                                if(props.gridSize.height - 1 < updateY) {
                                    lostX = updateX;
                                    lostY = updateY - 1;
                                }
                                if(updateY < 0){
                                    lostX = updateX;
                                    lostY = updateY + 1;
                                }
                                if(updateX < 0) {
                                    lostX = updateX + 1;
                                    lostY = updateY;
                                }
                                if(props.gridSize.width - 1 < updateX){
                                    lostX = updateX - 1;
                                    lostY = updateY;
                                }
                                //set to lost and update lost coordinates so next robot doesnt do the same
                                lost = true;
                                setDisplayLost(true);
                                props.setLostCoordinates([...props.lostCoordinates, ...[[updateX, updateY]]]);
                                resolve();
                            }

                            setX(updateX);
                            setY(updateY);
                            setDeg(updateDegree);
                            
                            resolve();
                        }
                    }, 200);
                });
            }
        }
    };

    useEffect(() => {
        (async () => {
            //dont run until the index of robots array in Board.js equals the number of robots rendered
            //this will prevent code from running asynchronous
            if (props.robotsRendered === props.index) {
                await move(props.instructions);
                //if lost update robot output
                if (!lost) {
                    props.setOutput([...props.output, ...[[updateX, updateY, degreesToDirection(updateDegree)]]]);
                } else {
                    props.setOutput([...props.output, ...[[lostX, lostY, degreesToDirection(deg), "LOST"]]]);
                }
                //increment robots rendered counter
                props.setRobotsRendered(props.robotsRendered + 1);
            }
        })();
    }, [props.robotsRendered]);

    return (
        <>
            {
                /* dont render robot until previous robot has finished */
                props.robotsRendered >= props.index ? (
                    <div className="robot" style={coord}>
                        {!displayLost ? <img className="robot-img" src="/robot.png" alt="robot" /> : "LOST"}
                    </div>
                ) : (
                    ""
                )
            }
        </>
    );
}
