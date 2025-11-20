import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import { authStore } from "./store/store";
import PostPage from "./pages/PostPage";
import "./App.css";

function App() {
  const { authUser } = authStore();
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={!authUser ? <Navigate to="/login" /> : <HomePage />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/post"
          element={!authUser ? <Navigate to="/login" /> : <PostPage />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
