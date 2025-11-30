import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import { authStore } from "./store/store";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

import "./App.css";
import CardPage from "./pages/CardPage";
import GetPostPage from "./pages/GetPostPage";

function App() {
  const { authUser } = authStore();
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={!authUser ? <Navigate to="/login" /> : <CardPage />}
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
        <Route
          path="/profile"
          element={!authUser ? <Navigate to="/login" /> : <ProfilePage />}
        />
        <Route path="/post/:id" element={<GetPostPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
