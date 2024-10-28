import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import About from './components/About';
import ProjectList from './components/ProjectList';
import Contact from './components/Contact';
import BackendHealthIndicator from './components/BackendHealthIndicator';
import BackendStatus from './components/BackendStatus';
import GPTInterface from './components/GPTInterface';
import debugEnvironment from './utils/envDebug';

const envVars = debugEnvironment();

function MainLayout() {
  return (
    <div className="App bg-white">
      <h1>Welcome to My Personal Website</h1>
      <Header />
      <BackendHealthIndicator />
      <BackendStatus />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/gpt" element={<GPTInterface />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

export default App;