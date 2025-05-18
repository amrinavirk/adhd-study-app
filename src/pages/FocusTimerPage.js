import { useState, useRef, useEffect } from 'react';

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
        <div>
            {/* selection option section */}
            <div>
                <label> FOCUS
                    <select disabled={setStarted} value={focusTimer} onChange={(e) => setFocusTimer(Number(e.target.value))}>
                        {[15, 20, 25, 30, 45, 60].map((min) => (
                            <option key={min} value={min}>{min} min</option>
                        ))}
                    </select></label>
                <label> BREAK
                    <select disabled={setStarted} value={breakTimer} onChange={(e) => setBreakTimer(Number(e.target.value))}>
                        {[5, 10, 15, 20].map((min) => (
                            <option key={min} value={min}>{min} min</option>
                        ))}
                    </select></label>
            </div>

            {/* actual timer section */}
            <div>
                <h2>{isFocus ? 'Focus Time' : 'Break Time'}</h2>
                <div style={{ fontSize: '3em' }}>{formatTimer(timeLeft)}</div>
                {/* placeholder for progress bar */}
                <div style={{
                    height: '10px',
                    width: '100%',
                    background: '#ddd',
                    margin: '10px 0'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${(timeLeft / (isFocus ? focusTimer * 60 : breakTimer * 60)) * 100}%`,
                        background: '#4caf50'
                    }}></div>
                </div>
                <div>
                    <button onClick={handleStart} disabled={timerGoing}>START</button>
                    <button onClick={handleStop} disabled={!timerGoing}>STOP</button>
                    <button onClick={handleReset} disabled={!setStarted}>RESET</button>
                </div>
            </div>

            {/* mascot and speech bubble section */}
            <div>
                {/* insert mascot/animation */}
                <sub>25/5 is usually recommended but for longer sessions I use 45/15!!</sub>
            </div>
        </div>
    );
}

export default FocusTimerPage;