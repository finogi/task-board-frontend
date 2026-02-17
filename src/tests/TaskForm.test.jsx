import { render, screen } from "@testing-library/react";
import { TaskProvider } from "../context/TaskContext";
import TaskForm from "../components/TaskForm";

test("TaskForm renders correctly", () => {
  render(
    <TaskProvider>
      <TaskForm />
    </TaskProvider>
  );

  expect(screen.getByText(/create task/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
});
