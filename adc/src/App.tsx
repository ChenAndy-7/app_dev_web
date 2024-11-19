import './App.css'
import Navbar from './components/navbar';
import { Route, Routes } from "react-router-dom";
import Home from './pages/home';
import Attendance from './pages/attendance';
import HW from './pages/hw';
import Lecture from './pages/lecture';
import Mentor from './pages/mentor';
import Slack from './pages/slack';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/hw" element={<HW />} />
        <Route path="/lecture" element={<Lecture />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/slack" element={<Slack />} />
      </Routes>
    </>
  )
}

export default App
