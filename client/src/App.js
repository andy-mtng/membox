import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// Pages and components
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import MemoriesPage from "./pages/MemoriesPage";
import ProfilePage from "./pages/ProfilePage";


function App() {
  const { user } = useAuthContext();

  return (
    <div className="font-inter">
      <BrowserRouter>
          <Routes>
              <Route path="/" element={user ? <Navigate to="/memories"/> : <LandingPage/>}/>
              <Route path="/login" element={user ? <Navigate to="/memories"/> : <LoginPage/>}/>
              <Route path="/signup" element={user ? <Navigate to="/memories"/> : <SignupPage/>}/>
              <Route path="/memories" element={<MemoriesPage/>}/>
              <Route path="/profile" element={<ProfilePage/>}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
