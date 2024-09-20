import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import About from './components/About';
import ProjectList from './components/ProjectList';
import Contact from './components/Contact';

function App() {
  return (
    // <Router>
    //   <div className="App">
    //     <Header />
    //     <Routes>
    //       <Route path="/" element={<About />} />
    //       <Route path="/about" element={<About />} />
    //       <Route path="/projects" element={<ProjectList />} />
    //       <Route path="/contact" element={<Contact />} />
    //     </Routes>
    //   </div>
    // </Router>

    <Router>
      <div className="App">
        <h1>Hello World</h1>
      </div>
    </Router>
  );
}

export default App;