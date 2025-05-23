import { useState, useRef, useEffect } from 'react';
import '../styles/FocusTimer.css';
import mascot from '../assets/bubble.png';

const FocusTimerPage = () => {
    const [focusTimer, setFocusTimer] = useState(25);
    const [breakTimer, setBreakTimer] = useState(5);
    const [isFocus, setIsFocus] = useState(true);
    // whether a set of focus+break has started
    const [setStarted, setSetStarted] = useState(false);
    // whether either focus timer or break timer is going
    const [timerGoing, setTimerGoing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(focusTimer * 60);
    const delayRef = useRef(null);
    const formatTimer = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    // starts the timer
    const handleStart = () => {
        if (!timerGoing) {
            setTimerGoing(true);
            setSetStarted(true);
            delayRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
    };

    // stops timer
    const handleStop = () => {
        clearInterval(delayRef.current);
        setTimerGoing(false);
    };

    // resets  timer
    const handleReset = () => {
        handleStop();
        setTimeLeft(isFocus ? focusTimer * 60 : breakTimer * 60);
        setIsFocus(true);
        setSetStarted(false);
    };

    // switch from focus to break
    useEffect(() => {
        if (timeLeft <= 0) {
            clearInterval(delayRef.current);
            setIsFocus(prev => !prev);
            const newTime = isFocus ? breakTimer * 60 : focusTimer * 60;
            setTimeLeft(newTime);
            setTimerGoing(false);
        }
    },
        [timeLeft, isFocus, focusTimer, breakTimer]);

    // timer updates
    useEffect(() => {
        if (!setStarted) {
            setTimeLeft(isFocus ? focusTimer * 60 : breakTimer * 60);
        }
    },
        [focusTimer, breakTimer, isFocus, setStarted]);

    return (
        <div className='focustimer-wrapper'>
            <div className='left-column'>
                <div className='time-selection'>
                    <div className='selection-block'>
                        {/* selection option section */}
                        <h2>FOCUS</h2>
                        <select disabled={setStarted} value={focusTimer} onChange={(e) => setFocusTimer(Number(e.target.value))}>
                            {[15, 20, 25, 30, 45, 60].map((min) => (
                                <option key={min} value={min}>{min} min</option>
                            ))}
                        </select>
                    </div>
                    <div className='selection-block'>
                        <h2>BREAK</h2>
                        <select disabled={setStarted} value={breakTimer} onChange={(e) => setBreakTimer(Number(e.target.value))}>
                            {[5, 10, 15, 20].map((min) => (
                                <option key={min} value={min}>{min} min</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* actual timer section */}
                <div className='timer-container'>
                    <h5>{isFocus ? 'Focus Time' : 'Break Time'}</h5>
                    <h2>{formatTimer(timeLeft)}</h2>
                    <div className='progress-bar'>
                        <div className='progress' style={{
                            width: `${(timeLeft / (isFocus ? focusTimer * 60 : breakTimer * 60)) * 100}%`,
                        }}></div>
                    </div>
                        <button className='action-btn' onClick={handleStart} disabled={timerGoing}>START</button>
                        <button className='action-btn' onClick={handleStop} disabled={!timerGoing}>STOP</button>
                        <button className='action-btn' onClick={handleReset} disabled={!setStarted}>RESET</button>
                </div>
            </div>

            {/* mascot and speech bubble section */}
            <div className='mascot-wrapperFT'>
                <div className="mascot-speechFT">
                    <sub> 25/5 is usually recommended but for longer sessions I use 45/15!!!</sub>
                </div>
                <div className="mascot-containerFT">
                    <img src={mascot} alt="mascot" />
                </div>
            </div>
        </div>
    );
}

export default FocusTimerPage;