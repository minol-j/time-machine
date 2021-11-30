import React from "react";
import "./App.css";
import tickSnd from "./sounds/tick.mp3";
import TimerView from "./TimerView";
import { Observable, interval } from "rxjs";

const BUTTON_NAME_START = "Start";
const BUTTON_NAME_STOP = "Stop";
const BUTTON_ELEMENT_ID = "btn";
const TIMER_DELAY = 1000;
const DOUBLE_CLICK_DELAY = 300;

let observable = null;
let subscriber = null;

const App = () => {
  const [time, setTime] = React.useState(0);
  const [timerOn, setTimerOn] = React.useState(false);
  const [clicks, setClicks] = React.useState(0);
  const [btnName, setBtnName] = React.useState(BUTTON_NAME_START);
  const [timerId, setTimerId] = React.useState(0);

  React.useEffect(() => {
    let s = new Audio(tickSnd);
    if (time > 0 && time % TIMER_DELAY === 0 && timerOn) {
      s.play();
    }
  }, [time, timerOn]);

  React.useEffect(() => {
    if (timerOn) {
      observable = new Observable((event) => {
        interval(TIMER_DELAY).subscribe(() => {
          event.next();
        });
      });
      subscriber = observable.subscribe(() => {
        setTime((prevTime) => prevTime + TIMER_DELAY);
      });
    } else if (!timerOn) {
      if (subscriber != null) subscriber.unsubscribe();
      observable = null;
    }

    return () => {
      if (subscriber != null) subscriber.unsubscribe();
      observable = null;
    };
  }, [timerOn]);

  React.useEffect(() => {
    if (clicks === 0) return;

    if (timerId === 0) {
      setTimerId(
        setTimeout(() => {
          setClicks(0);
          setTimerId(0);
        }, DOUBLE_CLICK_DELAY)
      );
    }

    if (clicks === 2) {
      clearTimeout(timerId);
      setClicks(0);
      setTimerOn(false);
      setBtnName(BUTTON_NAME_START);
    }

    return () => clearTimeout(timerId);
  }, [clicks, timerId]);

  React.useEffect(() => {
    document.getElementById(BUTTON_ELEMENT_ID).innerHTML = btnName;
  }, [btnName]);

  function startStop() {
    const button = document.getElementById(BUTTON_ELEMENT_ID);
    if (button.innerText === BUTTON_NAME_START) {
      setBtnName(BUTTON_NAME_STOP);
      setTimerOn(true);
    } else {
      setBtnName(BUTTON_NAME_START);
      setTime(0);
      setTimerOn(false);
    }
  }

  function reset() {
    setTimerOn(true);
    setTime(0);
    setBtnName(BUTTON_NAME_STOP);
  }

  return (
    <div className="Timers">
      <h1>TimeMachine</h1>
      <TimerView time={time} />
      <div className="btn-group">
        <button
          id={BUTTON_ELEMENT_ID}
          onClick={(event) => startStop(event.currentTarget)}
        >
          Start
        </button>
        <button onClick={() => reset()}>Reset</button>
        <button onClick={() => setClicks((click) => click + 1)}>Wait</button>
      </div>
    </div>
  );
};

export default App;
