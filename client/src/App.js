import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';


function App() {
  return (
    <div>
      <h1 className='text-blue-500 font-bold'>Hello</h1>
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<LandingPage/>}/>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/signup' element={<SignupPage/>}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
