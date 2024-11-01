import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import axios from 'axios';
import API_BASE_URL from '../config';

function Settings({ toggleTheme, toggleMode }) {
  const [theme, setTheme] = useState('light');
  const [mode, setMode] = useState('default');
  const [tasksCount, setTasksCount] = useState(0);

  useEffect(() => {
    // Fetch current settings from the API
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

    //get the  active task IDs ffrom local storage
    const activeTaskIds = JSON.parse(localStorage.getItem("activeTasks")) || [];
    setTasksCount(activeTaskIds.length);
    
  }, []);

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    toggleTheme(newTheme); // Update the theme in App
    await saveSettings(newTheme, mode);
  };

  const handleModeChange = async (newMode) => {
    // if trying to activate a task and in single-task mode while active tasks count is more than 1
    if (newMode === 'single-task' && tasksCount > 1) {
      alert("You cannot switch to Single-Task mode when more than one task is active.");
      return;
    }
    setMode(newMode);
    toggleMode(newMode); // Update the mode in App
    await saveSettings(theme, newMode);
  };

  const saveSettings = async (newTheme, newMode) => {
    try {
      await axios.put(`${API_BASE_URL}/options/1`, {
        theme: newTheme,
        alternative: newMode === 'single-task' ? 1 : 0,
      });
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <div className="container vh-100">
      <Header />
      <h2>Settings</h2>
      <div className="mb-3">
        <label className="form-label">Theme</label>
        <select
          className="form-control"
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Mode</label>
        <select
          className="form-control"
          value={mode}
          onChange={(e) => handleModeChange(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="single-task">Single Task</option>
        </select>
      </div>
    </div>
  );
}

Settings.propTypes = {
  toggleTheme: PropTypes.func.isRequired,
  toggleMode: PropTypes.func.isRequired,
};

export default Settings;
