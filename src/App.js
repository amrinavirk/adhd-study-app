import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import BrainDumpPage from './pages/BrainDumpPage';
import CalendarPage from './pages/CalendarPage';
import FocusTimerPage from './pages/FocusTimerPage';
import ProgressTrackerPage from './pages/ProgressTrackerPage';
import SettingsPage from './pages/SettingsPage';
import StudyVisualsPage from './pages/StudyVisualsPage';
import ToDoListPage from './pages/ToDoListPage';
import WelcomePage from './pages/WelcomePage';
import NavigationBar from './components/NavigationBar';


function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/brain-dump" element={<BrainDumpPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/focus-timer" element={<FocusTimerPage />} />
        <Route path="/progress-tracker" element={<ProgressTrackerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/study-visuals" element={<StudyVisualsPage />} />
        <Route path="/to-do-list" element={<ToDoListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
