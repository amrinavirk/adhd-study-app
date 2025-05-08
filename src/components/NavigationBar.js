import { Link } from 'react-router-dom';
import '../styles/NavigationBar.css'

function NavigationBar() {
  return (
    <nav className="navbar">
      <div class='rectanglenavbar'>
        <div className="ellipse-container">

          <div className="ellipse">
            <Link to="/calendar">Calendar</Link>
          </div>
          <div className="ellipse">
            <Link to="/to-do-list">To Do List</Link>
          </div>
          <div className="ellipse">
            <Link to="/brain-dump">Brain Dump</Link>
          </div>
          <div className="ellipse">
            <Link to="/focus-timer">Focus Timer</Link>
          </div>
          <div className="ellipse">
            <Link to="/study-visuals">Study Visuals</Link>
          </div>
          <div className="ellipse">
            <Link to="/progress-tracker">Progress Tracker</Link>
          </div>
          <div className="ellipse">
            <Link to="/settings">Settings</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;