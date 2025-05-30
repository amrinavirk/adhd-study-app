import { useState, useEffect, useRef } from 'react';
import '../styles/StudyVisuals.css';
import mascot from '../assets/bubble.png';

const StudyVisualsPage = () => {
    const canvasRef = useRef(null);
    const [colours, setColours] = useState(['#F7DDF0', '#FFD7B7', '#FFFAB9', '#CEFFD2', '#AFCAFF', '#D5D5FF']);
    const [intensity, setIntensity] = useState(3);
    const [speed, setSpeed] = useState(1);
    const colourOptions = {
        pink: '#F7DDF0',
        orange: '#FFD7B7',
        yellow: '#FFFAB9',
        green: '#CEFFD2',
        blue: '#AFCAFF',
        purple: '#D5D5FF'
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const width = canvas.width = rect.width;
        const height = canvas.height = rect.height;
        let circles = [];
        let circleCount = window.innerWidth / 200;


        // create circles
        for (let i = 0; i < circleCount * 5; i++) {
            circles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 200,
                // speed
                dx: (Math.random() - 0.5) * speed * 4,
                dy: (Math.random() - 0.5) * speed * 4,
                colour: colours[i % colours.length]
            });
        }

        // placing the circles and adding the blur filter
        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            circles.forEach(circle => {
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                // colour
                ctx.fillStyle = circle.colour;
                // intensity
                ctx.globalAlpha = intensity / 4;
                ctx.fill();
                ctx.filter = 'blur(50px)'
            });
        };

        // bounce when hitting edge
        const update = () => {
            circles.forEach(circle => {
                circle.x += circle.dx;
                circle.y += circle.dy;
                if (circle.x < 0 || circle.x > width) circle.dx *= -1;
                if (circle.y < 0 || circle.y > height) circle.dy *= -1;
            });
        };


        const animate = () => {
            draw();
            update();
            requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animate);

    }, [colours, intensity, speed]);

    return (
        <div className='studyvisuals-wrapper'>
            {/* selection option section */}
            <div className='left-controls'>
                {/* colour selection*/}
                <fieldset className='colours'>
                    <h2>COLOURS</h2>
                    {Object.entries(colourOptions).map(([name, hex]) => (
                        <label key={name} style={{ marginRight: '10px' }}>
                            <input
                                type="checkbox"
                                checked={colours.includes(hex)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setColours([...colours, hex]);
                                    } else {
                                        setColours(colours.filter(c => c !== hex));
                                    }
                                }}
                            />
                            {name}
                        </label>
                    ))}
                </fieldset>
                {/* intensity selection */}
                <div className='speed-intensity'>
                    <div className='control-block'>
                        <h2>INTENSITY</h2>
                        <select value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))}>
                            {[1, 2, 3].map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* speed selection */}
                    <div className='control-block'>
                        <h2>SPEED</h2>
                        <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
                            {[0.5, 1, 1.5, 2].map((s) => (
                                <option key={s} value={s}>
                                    {s}x
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* study visual canvas */}
            <div className='canvas-container'>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>

            {/* mascot and speech bubble section */}
            <div className='mascot-wrapperSV'>
                <div className="mascot-containerSV">
                    <img src={mascot} alt="mascot" />
                </div>
                <div className="mascot-speechSV">
                    <sub> Customise your study visual!</sub>
                </div>

            </div>
        </div>
    );
}

export default StudyVisualsPage;