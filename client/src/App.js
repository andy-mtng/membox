import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";


function App() {
  return (
    <div>
      <BrowserRouter>
          <Navbar/>
          <Routes>
              <Route path="/" element={<LandingPage/>}/>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/signup" element={<SignupPage/>}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
