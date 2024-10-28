import React from "react";
import "./GPTInterface.css";

function GPTInterface() {
  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo">ChatGPT</div>
        <nav className="menu">
          <ul>
            <li>ChatGPT</li>
            <li>Explore GPTs</li>
          </ul>
        </nav>
        <div className="footer">Upgrade plan</div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>ChatGPT</h1>
          <div className="user-icon">N</div>
        </header>

        <section className="query-section">
          <h2>What can I help with?</h2>
          <div className="input-container">
            <input type="text" placeholder="Message ChatGPT" />
            <button className="send-button">↑</button>
          </div>

          <div className="action-buttons">
            <button>Create image</button>
            <button>Summarize text</button>
            <button>Make a plan</button>
            <button>Analyze data</button>
            <button>More</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default GPTInterface;
