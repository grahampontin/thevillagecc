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
import LiveScoring from './components/LiveScoring';
import AdminLanding from './components/AdminLanding';
import AdminPlayers from './components/AdminPlayers';
import AdminTeams from './components/AdminTeams';
import AdminMatches from './components/AdminMatches';
import AdminVenues from './components/AdminVenues';
import AdminAwards from './components/AdminAwards';
import AdminCommittee from './components/AdminCommittee';
import AdminScorecards from './components/AdminScorecards';
import AdminEditScorecard from './components/AdminEditScorecard';

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
        <Route path="/scoring" element={<LiveScoring />} />
        <Route path="/admin" element={<AdminLanding />} />
        <Route path="/admin/players" element={<AdminPlayers />} />
        <Route path="/admin/teams" element={<AdminTeams />} />
        <Route path="/admin/matches" element={<AdminMatches />} />
        <Route path="/admin/venues" element={<AdminVenues />} />
        <Route path="/admin/awards" element={<AdminAwards />} />
        <Route path="/admin/committee" element={<AdminCommittee />} />
        <Route path="/admin/scorecards" element={<AdminScorecards />} />
        <Route path="/admin/scorecards/:matchId" element={<AdminEditScorecard />} />
      </Routes>
    </Router>
  );
}

export default App;
