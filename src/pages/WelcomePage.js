import '../styles/WelcomePage.css';
import mascot from '../assets/bubble.png';

function WelcomePage() {
    return (
        <div className="welcome-container">
            <div className="mascot-containerW">
                <img src={mascot} alt="mascot" />
            </div>
            <div className="mascot-speechW">
                <sub>Welcome to Bubble Buddy!</sub>
            </div>
        </div>
    );
}

export default WelcomePage;