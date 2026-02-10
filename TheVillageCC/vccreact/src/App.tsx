import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './custom.css';

import Homepage from './components/Homepage';
import About from './components/About';
import Awards from './components/Awards';
import Committee from './components/Committee';
import Fixtures from './components/Fixtures';
import Results from './components/Results';
import Stats from './components/Stats';
import PlayerDetail from './components/PlayerDetail';
import LiveScorecard from './components/LiveScorecard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/committee" element={<Committee />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/results" element={<Results />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/player/:playerId" element={<PlayerDetail />} />
        <Route path="/scorecard/:matchId" element={<LiveScorecard />} />
      </Routes>
    </Router>
  );
}

export default App;
