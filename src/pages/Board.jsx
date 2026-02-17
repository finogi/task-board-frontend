import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import Column from "../components/Column";
import TaskForm from "../components/TaskForm";
import ActivityLog from "../components/ActivityLog";
import { useTasks } from "../context/TaskContext";
import "./Board.css";

function Board() {
  const navigate = useNavigate();
  const { tasks, setTasks, setActivityLog } = useTasks();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    sessionStorage.removeItem("isAuth");
    navigate("/");
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceTasks = [...tasks[source.droppableId]];
    const destTasks = [...tasks[destination.droppableId]];
    const [moved] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, moved);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destTasks,
    });

    setActivityLog((prev) => [
      { action: "Task moved", title: moved.title, time: new Date().toISOString() },
      ...prev,
    ]);
  };

  const sortByDueDate = (list) => {
    return [...list].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  };

  const filterTasks = (list) =>
    sortByDueDate(
      list
        .filter((t) =>
          t.title.toLowerCase().includes(search.toLowerCase())
        )
        .filter((t) => (filter ? t.priority === filter : true))
    );

  const resetBoard = () => {
    if (window.confirm("Reset entire board? This action cannot be undone.")) {
      setTasks({ todo: [], doing: [], done: [] });
      setActivityLog([]);
    }
  };

  const totalTasks = tasks.todo.length + tasks.doing.length + tasks.done.length;
  const completedTasks = tasks.done.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="board-container">
      <div className="board-background">
        <div className="grid-pattern"></div>
      </div>

      <header className="board-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-badge">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="header-titles">
              <h1 className="board-title">Task Board</h1>
              <p className="board-subtitle">{totalTasks} tasks · {completedTasks} completed</p>
            </div>
          </div>

          <div className="header-actions">
            <button className="btn-secondary" onClick={resetBoard}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Reset
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className="board-main">
        <aside className="sidebar">
          <div className="sidebar-section">
            <button 
              className="btn-create-task"
              onClick={() => setShowTaskForm(!showTaskForm)}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New Task
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="section-title">Search & Filter</h3>
            
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Priority</label>
              <select 
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <ActivityLog />
        </aside>

        <main className="board-content">
          {showTaskForm && (
            <div className="task-form-overlay">
              <TaskForm onClose={() => setShowTaskForm(false)} />
            </div>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="columns-container">
              <Droppable droppableId="todo">
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className="column-wrapper"
                  >
                    <Column 
                      title="To Do" 
                      status="todo" 
                      tasks={filterTasks(tasks.todo)}
                      isDraggingOver={snapshot.isDraggingOver}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="doing">
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className="column-wrapper"
                  >
                    <Column 
                      title="Doing" 
                      status="doing" 
                      tasks={filterTasks(tasks.doing)}
                      isDraggingOver={snapshot.isDraggingOver}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="done">
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className="column-wrapper"
                  >
                    <Column 
                      title="Done" 
                      status="done" 
                      tasks={filterTasks(tasks.done)}
                      isDraggingOver={snapshot.isDraggingOver}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </main>
      </div>
    </div>
  );
}

export default Board;