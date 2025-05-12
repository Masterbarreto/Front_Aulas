// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPages } from "../src/components/screens/Login";
import {HomePage } from "../src/components/screens/Home";



import './App.css';

function App() {
  return (
    <Router> 
      <Routes> 
        <Route path="/" element={<LoginPages />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
      <main className="content"></main> 
    </Router>
  );
}

export default App;
