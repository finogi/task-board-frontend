import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { TaskProvider } from "../context/TaskContext";
import Board from "../pages/Board";

test("Board page renders correctly", () => {
  render(
    <BrowserRouter>
      <TaskProvider>
        <Board />
      </TaskProvider>
    </BrowserRouter>
  );

  expect(screen.getByText(/task board/i)).toBeInTheDocument();
});
