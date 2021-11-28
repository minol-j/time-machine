import React from "react";
import "./App.css";
import tickSnd from "./sounds/tick.mp3";

const App = () => {
  const [time, setTime] = React.useState(0);
  const [timerOn, setTimerOn] = React.useState(false);
  let [idTimer, setTimerId] = React.useState(0);
  let [clicks, setClicks] = React.useState(0);
  let [btnName, setBtnName] = React.useState("Start");

  React.useEffect(() => {
    let interval = null;
    let s = new Audio(tickSnd);
    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
        if (time % 1000 === 0) {
          s.play();
        }
      }, 1000);
    } else if (!timerOn) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn, time]);

  React.useEffect(() => {
    if (idTimer === 0) {
      setTimerId(
        setTimeout(() => {
          setClicks(0);
          setTimerId(0);
        }, 300)
      );
    }

    if (clicks === 2) {
      clearTimeout(idTimer);
      setClicks(0);
      setTimerOn(false);
      setBtnName("Start");
    }
  }, [clicks, idTimer]);

  React.useEffect(() => {
    document.getElementById("btn").innerHTML = btnName;
  }, [btnName]);

  function startStop() {
    const button = document.getElementById("btn");
    if (button.innerText === "Start") {
      setBtnName("Stop");
      setTimerOn(true);
    } else {
      setBtnName("Start");
      setTime(0);
      setTimerOn(false);
    }
  }

  return (
    <div className="Timers">
      <h1>TimeMachine</h1>
      <div id="display">
        <span>{("0" + Math.floor((time / 3600000) % 24)).slice(-2)}:</span>
        <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
        <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
      </div>

      <div className="btn-group">
        <button id="btn" onClick={(e) => startStop(e.currentTarget)}>
          Start
        </button>
        <button onClick={() => setTime(0)}>Reset</button>
        <button onClick={() => setClicks((cl) => cl + 1)}>Wait</button>
      </div>
    </div>
  );
};

export default App;
