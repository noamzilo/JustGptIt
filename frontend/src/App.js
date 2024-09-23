import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import About from './components/About';
import ProjectList from './components/ProjectList';
import Contact from './components/Contact';
import BackendHealthIndicator from './components/BackendHealthIndicator';
import BackendStatus from './components/BackendStatus';

function App() {
  let environment;
  if (process.env.NODE_ENV === 'production') {
    environment = 'production';
  } else if (process.env.NODE_ENV === 'development') {
    environment = 'development';
  } else {
    environment = 'staging';
  }

  const baseName = `/personal_website/${environment}`;

  console.log('Current environment:', environment);
  console.log('Current basename:', baseName);

  return (
    <Router basename={baseName}>
      <div className="App">
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