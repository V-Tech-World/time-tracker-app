import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TaskList from './Components/TaskList';
import TaskDetail from './Components/TaskDetail';
import Settings from './Components/Settings';
import Info from './Components/Info';
import TaskAdd from './Components/TaskAdd';
import TaskEdit from './Components/TaskEdit';
import TaskFilter from './Components/TaskFilter';
import ActivitySummary from './Components/ActivitySummary';
import TaskBarChart from './Components/TaskBarChart';
import IntervalList from './Components/IntervalList';
import ManageTags from './Components/ManageTags';
import axios from 'axios';
import API_BASE_URL from './config';

function App() {
  const [theme, setTheme] = useState('light');
  const [mode, setMode] = useState('default');
  console.log(theme, mode);
  useEffect(() => {
    // Fetch current settings from the API when the app mounts
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/options/1`);
        const { theme, alternative } = response.data[0];
        setTheme(theme === 'dark' ? 'dark' : 'light');
        setMode(alternative === 1 ? 'single-task' : 'default');
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
  };

  // Set class based on theme
  const appClass = theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark';

  return (
    <Router>
      <div className={`app ${appClass}`}>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/add-task" element={<TaskAdd />} />
          <Route path="/edit-task/:id" element={<TaskEdit />} />
          <Route path="/task/:id" element={<TaskDetail />} />
          <Route path="/filter-tasks" element={<TaskFilter />} />
          <Route path="/activity-summary" element={<ActivitySummary />} />
          <Route path="/task-chart" element={<TaskBarChart />} />
          <Route path="/intervals/:Id" element={<IntervalList />} />
          <Route path="/manage-tags" element={<ManageTags />} />
          <Route 
            path="/settings" 
            element={<Settings toggleTheme={toggleTheme} toggleMode={toggleMode} />} 
          />
          <Route path="/info" element={<Info />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
