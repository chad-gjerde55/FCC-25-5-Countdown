import { FaPause, FaPlay } from "react-icons/fa6";
import { DisplayState, formatTime } from "./helpers";
import { FaUndo } from "react-icons/fa";


interface DisplayProps {
    displayState: DisplayState;
    reset: () => void;
    startStop: (displayState: DisplayState) => void;
}

const Display: React.FC<DisplayProps> = ({
    displayState,
    reset,
    startStop,
}) => {
    return (
        <div className="display">
            <h4 id="timer-label">{displayState.timeType}</h4>
            <span id="time-left">
                {formatTime(displayState.time)}
            </span>
            <div>
                <button id="start_stop" onClick={() => startStop(displayState)}>
                    {displayState.timerRunning ? <FaPause /> : <FaPlay />}
                </button>
                <button id="reset" onClick={reset}>
                    <FaUndo />
                </button>
            </div>
        </div>
    )
}

export default Display