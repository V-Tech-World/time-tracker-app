import { useState } from 'react';
import Header from './Header';
function Settings() {
  const [theme, setTheme] = useState('light');
  const [mode, setMode] = useState('default');

  return (
    <div className="container">
      <Header />
      <h2>Settings</h2>
      <div className="mb-3">
        <label className="form-label">Theme</label>
        <select
          className="form-control"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
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
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="single-task">Single Task</option>
        </select>
      </div>
    </div>
  );
}

export default Settings;
