import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useTasks } from "../context/TaskContext";
import "./Column.css";

function Column({ title, tasks, status, isDraggingOver }) {
  const { setTasks, setActivityLog } = useTasks();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const today = new Date().setHours(0, 0, 0, 0);

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate).setHours(0, 0, 0, 0) < today;
  };

  const handleDelete = (task) => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      setTasks((prev) => ({
        ...prev,
        [status]: prev[status].filter((t) => t.id !== task.id),
      }));

      setActivityLog((prev) => [
        { action: "Task deleted", title: task.title, time: new Date().toISOString() },
        ...prev,
      ]);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (task) => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    setTasks((prev) => ({
      ...prev,
      [status]: prev[status].map((t) =>
        t.id === task.id ? { ...t, title: editTitle } : t
      ),
    }));

    setActivityLog((prev) => [
      { action: "Task edited", title: editTitle, time: new Date().toISOString() },
      ...prev,
    ]);

    setEditingId(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "#ff6b6b";
      case "Medium": return "#ffa500";
      case "Low": return "#4facfe";
      default: return "#888";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "todo":
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case "doing":
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "done":
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return (
    <div className={`column ${isDraggingOver ? 'dragging-over' : ''}`}>
      <div className="column-header">
        <div className="column-icon">
          {getStatusIcon()}
        </div>
        <div className="column-info">
          <h3 className="column-title">{title}</h3>
          <span className="column-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
        </div>
      </div>

      <div className="column-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>No tasks yet</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`task-card ${snapshot.isDragging ? 'dragging' : ''} ${isOverdue(task.dueDate) ? 'overdue' : ''}`}
                  style={{
                    ...provided.draggableProps.style,
                  }}
                >
                  {editingId === task.id ? (
                    <div className="task-edit-mode">
                      <input
                        className="task-edit-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(task);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <div className="task-edit-actions">
                        <button className="btn-save" onClick={() => saveEdit(task)}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Save
                        </button>
                        <button className="btn-cancel" onClick={() => setEditingId(null)}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="task-header">
                        <h4 className="task-title">{task.title}</h4>
                        <div 
                          className="priority-badge"
                          style={{ 
                            background: `${getPriorityColor(task.priority)}15`,
                            color: getPriorityColor(task.priority),
                            borderColor: `${getPriorityColor(task.priority)}30`
                          }}
                        >
                          {task.priority}
                        </div>
                      </div>

                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}

                      <div className="task-meta">
                        <div className="meta-item">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span className="meta-label">Created:</span>
                          <span>
                            {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <div className="meta-item">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <span className="meta-label">Due:</span>
                          <span>
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              : "Not set"}
                          </span>
                        </div>
                        
                        {isOverdue(task.dueDate) && (
                          <div className="overdue-indicator">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.64151 19.6871 1.81445 19.9905C1.98738 20.2939 2.23675 20.5467 2.53773 20.7239C2.83871 20.9011 3.18082 20.9962 3.53 21H20.47C20.8192 20.9962 21.1613 20.9011 21.4623 20.7239C21.7633 20.5467 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 9V13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Overdue
                          </div>
                        )}
                      </div>

                      {task.tags && task.tags.length > 0 && (
                        <div className="task-tags">
                          {task.tags.map((tag, i) => (
                            <span key={i} className="tag">{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="task-actions">
                        <button className="task-action-btn edit" onClick={() => startEdit(task)}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Edit
                        </button>
                        <button className="task-action-btn delete" onClick={() => handleDelete(task)}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Draggable>
          ))
        )}
      </div>
    </div>
  );
}

export default Column;