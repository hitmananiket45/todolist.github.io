import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Default');
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // Track the index of the task being edited

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const handleAddTask = async () => {
    if (inputValue && priority) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTasks([...tasks, { text: inputValue, completed: false, priority, dueDate }]);
      setInputValue('');
      setPriority('');
      setDueDate('');
      setLoading(false);
    }
  };

  const toggleTaskCompletion = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const deleteTask = async (index) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    setLoading(false);
  };

  const clearCompletedTasks = () => {
    const newTasks = tasks.filter(task => !task.completed);
    setTasks(newTasks);
  };

  const handleEditTask = (index) => {
    setInputValue(tasks[index].text);
    setPriority(tasks[index].priority);
    setDueDate(tasks[index].dueDate);
    setEditingIndex(index); // Set the index for the task being edited
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const newTasks = [...tasks];
      newTasks[editingIndex] = { ...newTasks[editingIndex], text: inputValue, priority, dueDate };
      setTasks(newTasks);
      setInputValue('');
      setPriority('');
      setDueDate('');
      setEditingIndex(null); // Reset editing index
    }
  };

  const sortTasks = (tasksList) => {
    const sortedTasks = [...tasksList];
    if (sortOption === 'Task Name') {
      sortedTasks.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortOption === 'Priority') {
      const priorityLevels = { High: 3, Medium: 2, Low: 1 };
      sortedTasks.sort((a, b) => priorityLevels[b.priority] - priorityLevels[a.priority]);
    } else if (sortOption === 'Due Date') {
      sortedTasks.sort((a, b) => new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity));
    }
    return sortedTasks;
  };

  const filteredAndSortedTasks = sortTasks(tasks.filter(task => {
    if (filter === 'Completed') return task.completed;
    if (filter === 'Active') return !task.completed;
    return true;
  }));

  const priorityColors = {
    Low: 'text-green-600',
    Medium: 'text-yellow-600',
    High: 'text-red-600',
  };

  const checkDueDateStatus = (taskDate) => {
    const today = new Date();
    const dueDate = new Date(taskDate);

    if (dueDate < today) return 'text-red-500';
    if (dueDate.toDateString() === today.toDateString()) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col items-center py-10`}>
      <button 
        onClick={toggleDarkMode} 
        aria-label="Toggle Dark Mode"
        className="absolute top-5 right-5 p-2 bg-blue-500 rounded-full hover:bg-blue-700 transition"
      >
        {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-800" />}
      </button>
      <div className="container mx-auto flex justify-center items-center h-full">
        <div className={`w-full max-w-lg rounded-lg shadow-lg p-5 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold">Kaam Karlo List</h1>
          </div>
          <div className="flex flex-col mb-4">
            <div className="mb-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a new task"
                aria-label="New task input"
                className="w-full px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-100 dark:bg-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex mb-2 justify-center">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                aria-label="Select Task Priority"
                className="mr-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 dark:text-white text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-label="Select Due Date"
                className="px-2 py-1 bg-gray-200 dark:bg-gray-600 dark:text-white text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <button 
              onClick={editingIndex !== null ? handleSaveEdit : handleAddTask} 
              aria-label={editingIndex !== null ? "Save Task" : "Add Task"}
              className="mt-2 w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editingIndex !== null ? 'Save Task' : 'Add Task'}
            </button>
          </div>
          <div className="flex justify-between mb-4">
            <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-lg ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'} transition`}>
              All
            </button>
            <button onClick={() => setFilter('Active')} className={`px-4 py-2 rounded-lg ${filter === 'Active' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'} transition`}>
              Active
            </button>
            <button onClick={() => setFilter('Completed')} className={`px-4 py-2 rounded-lg ${filter === 'Completed' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'} transition`}>
              Completed
            </button>
          </div>
          <div className="flex justify-between mb-4">
          <label className={`text-label ${darkMode ? 'text-gray-100' : 'text-gray-800 font-semibold'}`}> Task Names:
          </label>
          <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          aria-label="Task Sorting"
          className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 dark:text-white text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Default">Choose Sorting</option>
            <option value="Priority">Priority</option>
            <option value="Due Date">Due Date</option>
            </select>
            </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="list-disc pl-5">
              {filteredAndSortedTasks.map((task, index) => (
                <li key={index} className="flex justify-between items-center p-2 border-b">
                  <div className="flex flex-col">
                    <span className={`${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                    <span className={`${priorityColors[task.priority]} text-sm`}>{task.priority} Priority</span>
                    <span className={`${checkDueDateStatus(task.dueDate)} text-sm`}>{task.dueDate || 'No Due Date'}</span>
                  </div>
                  <div>
                    <button onClick={() => toggleTaskCompletion(index)} aria-label="Toggle Task Completion" className={`px-2 py-1 ${task.completed ? 'bg-gray-400' : 'bg-green-500'} text-white rounded-lg`}>✓</button>
                    <button onClick={() => deleteTask(index)} aria-label="Delete Task" className="ml-2 px-2 py-1 bg-red-500 text-white rounded-lg">✗</button>
                    <button onClick={() => handleEditTask(index)} aria-label="Edit Task" className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded-lg">✎</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {tasks.length > 0 && (
            <button onClick={clearCompletedTasks} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition">
              Clear Completed Tasks
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
