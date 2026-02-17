import { createContext, useContext, useEffect, useState } from "react";

const TaskContext = createContext();

const initialTasks = {
  todo: [],
  doing: [],
  done: [],
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("taskBoard");
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem("activityLog");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("taskBoard", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("activityLog", JSON.stringify(activityLog));
  }, [activityLog]);

  return (
    <TaskContext.Provider
      value={{ tasks, setTasks, activityLog, setActivityLog }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
