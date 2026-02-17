import { useState, useRef, useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import "./TaskForm.css";

// ── Custom Calendar Component ──────────────────────────────
function CustomCalendar({ value, onChange, onClose }) {
  const today = new Date();
  const selected = value ? new Date(value + "T00:00:00") : null;

  const [viewYear, setViewYear] = useState(selected ? selected.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth() : today.getMonth());

  const MONTHS = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    onClose();
  };

  const isToday = (day) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (day) =>
    selected &&
    day === selected.getDate() &&
    viewMonth === selected.getMonth() &&
    viewYear === selected.getFullYear();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="cal-popup" onClick={e => e.stopPropagation()}>
      <div className="cal-header">
        <button type="button" className="cal-nav" onClick={prevMonth}>
          <svg viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <span className="cal-month-label">{MONTHS[viewMonth]} {viewYear}</span>
        <button type="button" className="cal-nav" onClick={nextMonth}>
          <svg viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div className="cal-grid">
        {DAYS.map(d => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}
        {cells.map((day, i) => (
          <div key={i} className="cal-cell">
            {day && (
              <button
                type="button"
                className={`cal-day ${isSelected(day) ? "selected" : ""} ${isToday(day) && !isSelected(day) ? "today" : ""}`}
                onClick={() => selectDay(day)}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="cal-footer">
        <button type="button" className="cal-today-btn" onClick={() => {
          const mm = String(today.getMonth() + 1).padStart(2, "0");
          const dd = String(today.getDate()).padStart(2, "0");
          onChange(`${today.getFullYear()}-${mm}-${dd}`);
          onClose();
        }}>
          Today
        </button>
        <button type="button" className="cal-clear-btn" onClick={() => { onChange(""); onClose(); }}>
          Clear
        </button>
      </div>
    </div>
  );
}

// ── Main TaskForm ──────────────────────────────────────────
function TaskForm({ onClose }) {
  const { setTasks, setActivityLog } = useTasks();

  const [title, setTitle]               = useState("");
  const [description, setDescription]   = useState("");
  const [priority, setPriority]         = useState("Medium");
  const [dueDate, setDueDate]           = useState("");
  const [tags, setTags]                 = useState("");
  const [error, setError]               = useState("");
  const [showCal, setShowCal]           = useState(false);
  const calRef                          = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (calRef.current && !calRef.current.contains(e.target)) {
        setShowCal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatDisplay = (val) => {
    if (!val) return "Pick a date";
    const [y, m, d] = val.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => ({ ...prev, todo: [...prev.todo, newTask] }));
    setActivityLog(prev => [{ action: "Task created", title: newTask.title, time: new Date().toISOString() }, ...prev]);

    setTitle(""); setDescription(""); setPriority("Medium");
    setDueDate(""); setTags(""); setError("");
    if (onClose) onClose();
  };

  return (
    <div className="task-form-modal" onClick={onClose}>
      <div className="task-form-content" onClick={e => e.stopPropagation()}>

        <div className="task-form-header">
          <div className="form-icon">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div>
            <h2 className="form-title">Create New Task</h2>
            <p className="form-subtitle">Add a task to your board</p>
          </div>
          <button className="close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          {error && (
            <div className="form-error">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              {error}
            </div>
          )}

          <div className="form-field">
            <label className="field-label">Task Title <span className="required">*</span></label>
            <input
              type="text"
              className="field-input"
              placeholder="Enter task title..."
              value={title}
              onChange={e => { setTitle(e.target.value); setError(""); }}
              autoFocus
            />
          </div>

          <div className="form-field">
            <label className="field-label">Description</label>
            <textarea
              className="field-textarea"
              placeholder="Add more details about the task..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="field-label">Priority</label>
              <div className="priority-selector">
                {["Low","Medium","High"].map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`priority-option ${p.toLowerCase()} ${priority === p ? "active" : ""}`}
                    onClick={() => setPriority(p)}
                  >
                    <span className="priority-dot"></span>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Due Date</label>
              <div className="cal-wrapper" ref={calRef}>
                <button
                  type="button"
                  className={`cal-trigger ${dueDate ? "has-date" : ""}`}
                  onClick={() => setShowCal(v => !v)}
                >
                  <svg className="cal-trigger-icon" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className={`cal-trigger-text ${!dueDate ? "placeholder" : ""}`}>
                    {formatDisplay(dueDate)}
                  </span>
                  <svg className={`cal-chevron ${showCal ? "open" : ""}`} viewBox="0 0 24 24" fill="none">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                {showCal && (
                  <CustomCalendar
                    value={dueDate}
                    onChange={setDueDate}
                    onClose={() => setShowCal(false)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Tags</label>
            <input
              type="text"
              className="field-input"
              placeholder="Add tags separated by commas (e.g., design, urgent)"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
            {tags && (
              <div className="tag-preview">
                {tags.split(",").map((tag, i) => (
                  tag.trim() && <span key={i} className="preview-tag">{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel-form" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit-form">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;