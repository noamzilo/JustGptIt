import React from 'react';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import About from './components/About';
import ProjectList from './components/ProjectList';
import Contact from './components/Contact';
import BackendHealthIndicator from './components/BackendHealthIndicator';
import BackendStatus from './components/BackendStatus';
import GPTInterface from './components/gpt_page/GPTInterface.js';
import debugEnvironment from './utils/envDebug';

// Run environment debug on app start
const envVars = debugEnvironment();
console.debug(`envVars: ${envVars}`)

const AppContent = () => {
  const location = useLocation();
  const isGPTRoute = location.pathname === '/gpt';

  // Only show the main app content if we're not on the GPT route
  if (isGPTRoute) {
    return <GPTInterface />;
  }

  return (
    <div className="App">
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
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/gpt" element={<GPTInterface />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;