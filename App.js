import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";

// Visibility Toggle & Disable Button
const ToggleFeatures = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <div className="toggle-container">
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Hide" : "Show"} Element
      </button>

      {isVisible && <div className="visible-box">This is a visible element</div>}

      <button onClick={() => setIsDisabled(!isDisabled)}>
        {isDisabled ? "Enable" : "Disable"} Button
      </button>

      <button className={`action-btn ${isDisabled ? "disabled" : "enabled"}`} disabled={isDisabled}>
        Click Me
      </button>
    </div>
  );
};
const SumCalculator = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);

  return (
    <div className="calculator-container">
      <h2>Sum Calculator</h2>
      <input 
        type="number" 
        value={num1} 
        onChange={(e) => setNum1(Number(e.target.value))} 
        placeholder="Enter first number" 
      />
      <input 
        type="number" 
        value={num2} 
        onChange={(e) => setNum2(Number(e.target.value))} 
        placeholder="Enter second number" 
      />
      <h3>Sum: {num1 + num2}</h3>
    </div>
  );
};

// Dynamic Child Components
const Child = ({ id, removeChild }) => (
  <div className="child-container">
    <span>Child Component {id}</span>
    <button onClick={() => removeChild(id)}>Remove</button>
  </div>
);

const DynamicChildren = () => {
  const [children, setChildren] = useState([]);

  const addChild = () => setChildren([...children, { id: Date.now() }]);
  const removeChild = (id) => setChildren(children.filter((child) => child.id !== id));

  return (
    <div className="child-management">
      <button onClick={addChild}>Add Child</button>
      {children.map((child) => (
        <Child key={child.id} id={child.id} removeChild={removeChild} />
      ))}
    </div>
  );
};

// Counter App
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-container">
      <h2>Counter Value: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increase</button>
      <button onClick={() => setCount(count - 1)} disabled={count === 0}>Decrease</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
};

// Record List Table
const records = [
  { id: 1, name: "Sadu Rer", age: 28, email: "sadu@example.com" },
  { id: 2, name: "Prit Smith", age: 32, email: "prit@example.com" },
  { id: 3, name: "Lalu Johnson", age: 24, email: "lalu@example.com" },
];

const RecordList = () => (
  <div className="record-list">
    <h2>User Records</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th> <th>Name</th> <th>Age</th> <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td>{record.id}</td>
            <td>{record.name}</td>
            <td>{record.age}</td>
            <td>{record.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Search & Filter Component
const FilterApp = () => {
  const [items, setItems] = useState(["Apple", "Banana", "Orange", "Mango", "Grapes"]);
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) => item.toLowerCase().includes(search.toLowerCase()));

  const addItem = () => {
    if (search && !items.includes(search)) {
      setItems([...items, search]);
      setSearch("");
    }
  };

  return (
    <div className="filter-app">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={addItem}>Add Item</button>
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>
            {item} <button onClick={() => setItems(items.filter((i) => i !== item))}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Drag & Drop Task Manager
const taskBlocks = ["Today", "Tomorrow", "This Week", "Next Week", "Unplanned"];
const initialTasks = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, text: `Task ${i + 1}` }));

const Task = ({ task, editTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div ref={drag} className={`task-card ${isDragging ? "dragging" : ""}`}>
      <input type="text" value={task.text} onChange={(e) => editTask(task.id, e.target.value)} />
    </div>
  );
};

const TaskBlock = ({ title, tasks, moveTask, editTask }) => {
  const [, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => moveTask(item.id, title),
  }));

  return (
    <div ref={drop} className="task-block">
      <h2>{title}</h2>
      {tasks.map((task) => (
        <Task key={task.id} task={task} editTask={editTask} />
      ))}
    </div>
  );
};

const DragDropTaskList = () => {
  const [tasks, setTasks] = useState({
    Unplanned: initialTasks,
    Today: [],
    Tomorrow: [],
    "This Week": [],
    "Next Week": [],
  });

  const moveTask = (taskId, newBlock) => {
    const newTasks = { ...tasks };
    let movedTask = null;

    for (const block in newTasks) {
      const index = newTasks[block].findIndex((t) => t.id === taskId);
      if (index !== -1) {
        movedTask = newTasks[block].splice(index, 1)[0];
        break;
      }
    }
    if (movedTask) {
      newTasks[newBlock].push(movedTask);
      setTasks(newTasks);
    }
  };

  const editTask = (taskId, newText) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      for (const block in updatedTasks) {
        const taskIndex = updatedTasks[block].findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          updatedTasks[block][taskIndex].text = newText;
        }
      }
      return updatedTasks;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="task-container">
        {taskBlocks.map((block) => (
          <TaskBlock key={block} title={block} tasks={tasks[block]} moveTask={moveTask} editTask={editTask} />
        ))}
      </div>
    </DndProvider>
  );
};


// Main App Component
const App = () => {
  return (
    <div className="app-container">
      <ToggleFeatures />
      <DynamicChildren />
      <Counter />
      <RecordList />
      <FilterApp />
      <DragDropTaskList />
    </div>
  );
};

export default App;
