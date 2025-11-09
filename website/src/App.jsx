import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Characters from './pages/Characters/Characters';
import About from './pages/About/About';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/characters" element={<Characters />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}

export default App;
