import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import About from './components/About';
import ProjectList from './components/ProjectList';
import Contact from './components/Contact';
import BackendHealthIndicator from './components/BackendHealthIndicator';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <BackendHealthIndicator />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;