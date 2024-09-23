import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import About from './components/About';
import ProjectList from './components/ProjectList';
import Contact from './components/Contact';
import BackendHealthIndicator from './components/BackendHealthIndicator';
import BackendStatus from './components/BackendStatus';

function App() {
  const environment = process.env.REACT_APP_ENVIRONMENT || 'development';
  const baseName = environment === 'development' ? '' : '/personal_website';

  console.log('Current environment:', environment);
  console.log('Current basename:', baseName);
  console.log('API URL:', process.env.REACT_APP_API_URL);

  return (
    <Router basename={baseName}>
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
    </Router>
  );
}

export default App;