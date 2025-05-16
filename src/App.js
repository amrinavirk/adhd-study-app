import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import BrainDumpPage from './pages/BrainDumpPage';
import DashboardPage from './pages/DashboardPage';
import FocusTimerPage from './pages/FocusTimerPage';
import ProgressTrackerPage from './pages/ProgressTrackerPage';
import SettingsPage from './pages/SettingsPage';
import StudyVisualsPage from './pages/StudyVisualsPage';
import ToDoListPage from './pages/ToDoListPage';
import WelcomePage from './pages/WelcomePage';
import NavigationBar from './components/NavigationBar';
import Header from './components/Header';


function App() {
  return (
    <Router>
      <Header/>
      <NavigationBar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header title="BUBBLE BUDDY" />
              <WelcomePage />
            </>
          }
        />
        <Route
          path="/brain-dump"
          element={
            <>
              <Header title="BRAIN DUMP" />
              <BrainDumpPage />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <Header title="DASHBOARD" />
              <DashboardPage />
            </>
          }
        />

        <Route
          path="/focus-timer"
          element={
            <>
              <Header title="FOCUS TIMER" />
              <FocusTimerPage />
            </>
          }
        />

        <Route
          path="/progress-tracker"
          element={
            <>
              <Header title="PROGRESS TRACKER" />
              <ProgressTrackerPage />
            </>
          }
        />

        <Route
          path="/settings"
          element={
            <>
              <Header title="SETTINGS" />
              <SettingsPage />
            </>
          }
        />

        <Route
          path="/study-visuals"
          element={
            <>
              <Header title="STUDY VISUALS" />
              <StudyVisualsPage />
            </>
          }
        />

        <Route
          path="/to-do-list"
          element={
            <>
              <Header title="TO DO LIST" />
              <ToDoListPage />
            </>
          }
        />
        <Route path="/dashboard" element={<DashboardPage />} />
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
