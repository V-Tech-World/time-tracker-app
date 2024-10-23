
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Home page showing the list of tasks */}
          <Route path="/" element={<TaskList />} />
          
          {/* Route for adding a new task */}
          <Route path="/add-task" element={<TaskAdd />} />
          
          {/* Route for editing an existing task */}
          <Route path="/edit-task/:id" element={<TaskEdit />} />
          
          {/* Route for viewing detailed information about a task */}
          <Route path="/task/:id" element={<TaskDetail />} />
          
          {/* Route for filtering tasks based on tags */}
          <Route path="/filter-tasks" element={<TaskFilter />} />
          
          {/* Route for displaying activity summaries */}
          <Route path="/activity-summary" element={<ActivitySummary />} />
          
          {/* Route for displaying a bar chart of task active times */}
          <Route path="/task-chart" element={<TaskBarChart />} />
          
          {/* Route for managing intervals for a specific task */}
          <Route path="/intervals/:Id" element={<IntervalList />} />
          
          {/* Settings page */}
          <Route path="/settings" element={<Settings />} />
          
          {/* Info/About page */}
          <Route path="/info" element={<Info />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
