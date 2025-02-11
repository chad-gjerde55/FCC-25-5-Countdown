import { useState, useEffect } from "react";
import "./App.css";
import { DisplayState } from "./helpers";
import ClockComponent from "./ClockComponent";
import Display from "./Display";
import AlarmSound from "./assets/AlarmSound.mp3";
import { FaClock } from "react-icons/fa6";

const defaultBreakTime = 5 * 60;
const defaultSessionTime = 25 * 60;
const min = 60;
const max = 60 * 60;
const interval = 60;

const SESSION = "session";
const BREAK = "break";

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [sessionTime, setSessionTime] = useState(defaultSessionTime);
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: SESSION,
    timerRunning: false,
  });

  useEffect(() => {
    let timerID: number;
    if(!displayState.timerRunning) return;

    if(displayState.timerRunning) {
      timerID = window.setInterval(decrementDisplay, 1000);
    }

    return () => {
      window.clearInterval(timerID);
    };
  }, [displayState.timerRunning]);

  useEffect(() => {
    if(displayState.time === 0) {
      const audio  = document.getElementById("beep") as HTMLAudioElement;
      audio.currentTime = 2;
      audio.play().catch((err) => console.log(err));
      setDisplayState((prev) => ({
        ...prev,
        timeType: prev.timeType === SESSION ? BREAK : SESSION,
        time: prev.timeType === SESSION ? breakTime: sessionTime,
      }));
    }
  }, [displayState, breakTime, sessionTime]);

  const reset = () => {
    setBreakTime(defaultBreakTime);
    setSessionTime(defaultSessionTime);
    setDisplayState({
      time: defaultSessionTime,
      timeType: SESSION,
      timerRunning: false,
    });
    const audio  = document.getElementById("beep") as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
  };

  const startStop = () => {
    setDisplayState((prev) => ({
      ...prev,
      timerRunning: !prev.timerRunning,
    }));
  };

  const changeBreakTime = (time: number) => {
    if(displayState.timerRunning) return;
    setBreakTime(time);
  }

  const changeSessionTime = (time: number) => {
    if(displayState.timerRunning) return;
    setSessionTime(time);
    setDisplayState({
      time: time,
      timeType: SESSION,
      timerRunning: false,
    })
  }

  const decrementDisplay = () => {
    setDisplayState((prev) => ({
      ...prev,
      time: prev.time - 1,
    }));
  }

  return (
    <div className="project">
      <header id="title">Chad's FCC 25+5 Clock</header>
      <p id="clock-icon"><FaClock /></p>
      <div className="clock">
        <div className="setters">
          <div className="break">
            <h4 id="break-label">Break Length</h4>
            <ClockComponent
              time={breakTime}
              setTime={changeBreakTime}
              min={min}
              max={max}
              interval={interval}
              type={BREAK}
            />
          </div>
          <div className="session">
            <h4 id="session-label">Session Length</h4>
            <ClockComponent
              time={sessionTime}
              setTime={changeSessionTime}
              min={min}
              max={max}
              interval={interval}
              type={SESSION}
            />
          </div>
        </div>
        <Display
          displayState={displayState}
          reset={reset}
          startStop={startStop}
        />
        <audio id="beep" src={AlarmSound} />
      </div>
    </div>
  );
}

export default App;
