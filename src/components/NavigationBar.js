import { Link } from 'react-router-dom';

function NavigationBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/to-do-list">To Do List</Link></li>
        <li><Link to="/brain-dump">Brain Dump</Link></li>
        <li><Link to="/focus-timer">Focus Timer</Link></li>
        <li><Link to="/study-visuals">Study Visuals</Link></li>
        <li><Link to="/progress-tracker">Progress Tracker</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
}

export default NavigationBar;