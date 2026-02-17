import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";

test("Login page renders correctly", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  
  expect(
    screen.getByRole("heading", { name: /welcome back/i })
  ).toBeInTheDocument();

  
  expect(
    screen.getByPlaceholderText(/intern@demo.com/i)
  ).toBeInTheDocument();

  
  expect(
    screen.getByPlaceholderText(/enter your password/i)
  ).toBeInTheDocument();

  
  expect(
    screen.getByRole("button", { name: /sign in/i })
  ).toBeInTheDocument();
});
