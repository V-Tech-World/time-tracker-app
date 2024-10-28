import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import API_BASE_URL from "../config";
import "../css/taskList.css";

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState(""); 
  const [tags, setTags] = useState({});

  // Fetch tasks and tags from the API
  const fetchTasksAndTags = async () => {
    try {
      const tasksResponse = await fetch(`${API_BASE_URL}/tasks`);
      const tasksData = await tasksResponse.json();
      setTasks(tasksData);
      
      const tagsResponse = await fetch(`${API_BASE_URL}/tags`);
      const tagsData = await tagsResponse.json();
      
      // Create a map of tag IDs to tag names
      const tagsMap = {};
      tagsData.forEach(tag => {
        tagsMap[tag.id] = tag.name;
      });
      setTags(tagsMap);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks or tags:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndTags();
  }, []);

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Refresh tasks and tags after deletion
          await fetchTasksAndTags();
          alert("Task deleted successfully");
        } else {
          console.error("Failed to delete task:", response.statusText);
          alert("Failed to delete task. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("An error occurred while deleting the task.");
      }
    }
  };

  const handleEdit = (taskId) => {   
    navigate(`/edit-task/${taskId}`);
  };

  const handleViewDetails = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <strong>Loading tasks...</strong>
      </div>
    );
  }

  return (
    <div className="container vh-100">
      <Header />
      <div className="d-flex justify-content-between mb-4">
        <div className="w-100">
          <h1 className="text-primary">Task List</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/add-task")}
          >
            Add New Task
          </button>

          <button className="btn btn-primary ms-3"
            onClick={() => navigate("/manage-tags")}
            >
            Add or Manage Tags
          </button>

          <div className="card shadow mt-3">
            <div className="card-body">
              <table className="table table-striped text-center">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Tags</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <tr key={task.id} className="hover-shadow">
                        <td>{task.name}</td>
                        <td>
                          {task.tags.split(",").map((tagId) => (
                            // Only show tags that exist in the current tags map
                            tags[tagId.trim()] ? (
                              <span key={tagId} className="badge bg-secondary me-1">
                                {tags[tagId.trim()]}
                              </span>
                            ) : null // Skip if tag is not found
                          ))}
                        </td>
                        <td>
                          <span className="badge bg-success">Active</span>
                        </td>
                        <td>
                          <button
                            className="btn btn-info btn-sm me-1"
                            onClick={() => handleEdit(task.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-secondary btn-sm ms-1"
                            onClick={() => handleViewDetails(task.id)}
                          >
                            View Details
                          </button>
                          
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Right Sidebar for Notepad, Watch, and Calendar */}
      <div className="d-flex flex-row justify-content-start">
        <div className="w-50 ms-4 mb-4">
          <div className="card shadow mb-4 h-75">
              <div className="card-body">
                <h5 className="card-title">Notepad</h5>
                <textarea
                  className="form-control h-50"
                  rows="10"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write your notes here..."
                ></textarea>
              </div>
            </div>
          </div>
          <div className="w-50 ms-4 mb-4">
            <div>
            <div className="card shadow mb-4">
              <div className="card-body">
                <h5 className="card-title">Watch</h5>
                <div id="watch" className="text-center">
                  {/* Add your watch functionality here */}
                  <h4>{new Date().toLocaleTimeString()}</h4>
                </div>
              </div>
            </div>

            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">Calendar</h5>
                <div id="calendar" className="text-center">
                  {/* Add a simple calendar here */}
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default TaskList;
