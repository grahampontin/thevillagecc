import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

// Define interfaces for API data
interface Player {
  playerId: number;
  firstName: string;
  surname: string;
}

interface Award {
  Id: number;
  Year: number;
  Award: string;
  PlayerId: number;
  Data: string;
}

interface CommitteePost {
  Id: number;
  Year: number;
  Post: string;
  PlayerId: number;
}

// Display data structures
interface YearPlayerData {
  Year: number;
  PlayerName: string;
}

interface AwardYearData {
  Year: number;
  PlayersPlayer: string;
  CaptainsPlayer: string;
  BestBatsman: string;
  BestBowler: string;
  BestFielder: string;
  MostImproved: string;
}

interface HallOfFameEntry {
  Year: number;
  PlayerName: string;
  EmbedUrl: string;
}

const Awards: React.FC = () => {
  const [captains, setCaptains] = useState<YearPlayerData[]>([]);
  const [viceCaptains, setViceCaptains] = useState<YearPlayerData[]>([]);
  const [playerOfYear, setPlayerOfYear] = useState<YearPlayerData[]>([]);
  const [awards, setAwards] = useState<AwardYearData[]>([]);
  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all required data in parallel
        const [playersRes, awardsRes, committeeRes] = await Promise.all([
          fetch('/api/players'),
          fetch('/api/awards'),
          fetch('/api/committee')
        ]);

        if (!playersRes.ok || !awardsRes.ok || !committeeRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const players: Player[] = await playersRes.json();
        const allAwards: Award[] = await awardsRes.json();
        const allCommittee: CommitteePost[] = await committeeRes.json();

        // Create player lookup
        const playerMap = new Map(players.map(p => [p.playerId, `${p.firstName} ${p.surname}`.trim()]));

        // Process committee data
        const captainsData = allCommittee
          .filter(c => c.Post === 'Captain')
          .sort((a, b) => a.Year - b.Year)
          .map(c => ({
            Year: c.Year,
            PlayerName: playerMap.get(c.PlayerId) || 'Unknown'
          }));

        const viceCaptainsData = allCommittee
          .filter(c => c.Post === 'ViceCaptain')
          .sort((a, b) => a.Year - b.Year)
          .map(c => ({
            Year: c.Year,
            PlayerName: playerMap.get(c.PlayerId) || 'Unknown'
          }));

        // Process awards data
        const playerOfYearData = allAwards
          .filter(a => a.Award === 'PlayerOfTheYear')
          .sort((a, b) => a.Year - b.Year)
          .map(a => ({
            Year: a.Year,
            PlayerName: playerMap.get(a.PlayerId) || 'Unknown'
          }));

        // Add COVID entry for 2020 if not present
        if (!playerOfYearData.some(p => p.Year === 2020)) {
          playerOfYearData.push({ Year: 2020, PlayerName: 'COVID' });
          playerOfYearData.sort((a, b) => a.Year - b.Year);
        }

        // Group awards by year for the table
        const awardsByYear = new Map<number, Map<string, Award>>();
        allAwards.forEach(award => {
          if (!awardsByYear.has(award.Year)) {
            awardsByYear.set(award.Year, new Map());
          }
          awardsByYear.get(award.Year)!.set(award.Award, award);
        });

        const awardsData: AwardYearData[] = Array.from(awardsByYear.entries())
          .map(([year, yearAwards]) => ({
            Year: year,
            PlayersPlayer: formatAwardWinner(yearAwards.get('PlayerOfTheYear'), playerMap),
            CaptainsPlayer: formatAwardWinner(yearAwards.get('CaptainsPlayerOfTheYear'), playerMap),
            BestBatsman: formatAwardWinner(yearAwards.get('BatsmanOfTheYear'), playerMap),
            BestBowler: formatAwardWinner(yearAwards.get('BowlerOfTheYear'), playerMap),
            BestFielder: formatAwardWinner(yearAwards.get('FielderOfTheYear'), playerMap),
            MostImproved: formatAwardWinner(yearAwards.get('MostImprovedPlayer'), playerMap)
          }))
          .sort((a, b) => a.Year - b.Year);

        // Add COVID entry for 2020 if not present
        if (!awardsData.some(a => a.Year === 2020)) {
          awardsData.push({
            Year: 2020,
            PlayersPlayer: 'COVID',
            CaptainsPlayer: '',
            BestBatsman: '',
            BestBowler: '',
            BestFielder: '',
            MostImproved: ''
          });
          awardsData.sort((a, b) => a.Year - b.Year);
        }

        // Process Hall of Fame
        const hallOfFameData = allAwards
          .filter(a => a.Award === 'CorridorOfUncertainty')
          .sort((a, b) => a.Year - b.Year)
          .map(a => ({
            Year: a.Year,
            PlayerName: playerMap.get(a.PlayerId) || 'Unknown',
            EmbedUrl: a.Data || ''
          }));

        // Calculate leading players stats
        // Note: The API doesn't provide aggregated stats, so we'll skip this for now
        // In a full implementation, we'd need a stats API endpoint

        setCaptains(captainsData);
        setViceCaptains(viceCaptainsData);
        setPlayerOfYear(playerOfYearData);
        setAwards(awardsData);
        setHallOfFame(hallOfFameData);
      } catch (error) {
        console.error('Error fetching awards data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatAwardWinner = (award: Award | undefined, playerMap: Map<number, string>): string => {
    if (!award) return '';
    const playerName = playerMap.get(award.PlayerId) || 'Unknown';
    if (award.Data) {
      return playerName + '<br/>' + award.Data;
    }
    return playerName;
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container">
          <div className="text-center mt-5">
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container">
        <h5 className="pt-2">Club Stats</h5>
        <div className="card">
          <div className="card-body">
            <div className="d-flex flex-wrap">
              <div className="mx-auto" style={{ whiteSpace: 'nowrap' }}>
                Formed: <strong>Feb 2004</strong>
              </div>
              <div className="mx-auto" style={{ whiteSpace: 'nowrap' }}>
                Home Ground: <strong>Parliament Hill</strong>
              </div>
              <div className="mx-auto" style={{ whiteSpace: 'nowrap' }}>
                Capacity: <strong>250,000 (standing); 5 (seated)</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <div className="card-title">
              <h5>History</h5>
            </div>
            <div>
              <p>
                The Village Cricket Club is a small nomadic club with its roots in North East London and players spread across London and surrounding areas. After one bizarre meeting in Stamford Hill's Birdcage, we were formed in 2004 by a bunch of singularly talentless but over enthusiastic cricketers who decided that they wanted to continue to entertain non-existent crowds beyond the end of their university days.
              </p>
              <p>
                Its first competitive foray was initial enrollment in NELC League exalting it's status for the first few seasons and then instinctive transition into the world of friendly Cricket across London and invitational relationships outside of it, playing games either Saturday or Sunday every weekend for most of the summer from April to September.
              </p>
              <p>
                Since its inception, much has changed. The social and cultural fabric of the club has grown, diversified and integrated with members from Australia, New Zealand, India, Pakistan, Nepal, Canada, Oman, Netherlands, Greece and ofcourse, from all over the UK. Our second generation is starting to come through with contributions both in and out of the field of play. Some of the most memorable moments are made and treasured while socializing after the games with a few beers or Cranberry juice and a curry or Fish and Chips.
              </p>
              <p>
                We play most of our matches in central London but we also make yearly trips to Oxford, Maidenhead and the West Country through some of the relationships we have built over the last 20 years. Every two years, we strive to take an International tour. We've visited Corfu, Malta, Amsterdam, Montenegro, Croatia, Porto and the 2026 tour is already under planning stages.
              </p>
              <p>
                We are always on the lookout for new members of any ability from anywhere. Enthusiasm for the game and an inclination to bond with our club and members is our only selection criteria.
              </p>
              <p>
                Email us and find out more on how our mutual cricketing journey can start and build
              </p>
            </div>
          </div>
        </div>

        <hr />

        <div className="d-flex flex-wrap align-items-stretch mt-3 w-100">
          <div className="flex-grow-1 me-2 mb-2">
            <h5 className="text-center">Captains</h5>
            <table className="table">
              <tbody>
                {captains.map((captain, idx) => (
                  <tr key={idx}>
                    <td>{captain.Year}</td>
                    <td>{captain.PlayerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex-grow-1 mb-2">
            <h5 className="text-center">Vice-Captains</h5>
            <table className="table">
              <tbody>
                {viceCaptains.map((viceCaptain, idx) => (
                  <tr key={idx}>
                    <td>{viceCaptain.Year}</td>
                    <td>{viceCaptain.PlayerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex-grow-1 ms-2 mb-2">
            <h5 className="text-center">Player of the Year</h5>
            <table className="table">
              <tbody>
                {playerOfYear.map((player, idx) => (
                  <tr key={idx}>
                    <td>{player.Year}</td>
                    <td>{player.PlayerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <hr />

        <h5>Leading Players</h5>
        <div className="d-flex flex-wrap">
          <div className="mx-auto" style={{ whiteSpace: 'nowrap' }}>
            <em>Leading player statistics will be available soon</em>
          </div>
        </div>

        <hr />

        <h5>Awards</h5>
        <table className="table">
          <thead>
            <tr>
              <th className="text-center"></th>
              <th className="text-center">Players' Player of The Season</th>
              <th className="text-center">Captain's Player of The Season</th>
              <th className="text-center">Best Batsman</th>
              <th className="text-center">Best Bowler</th>
              <th className="text-center">Best Fielder</th>
              <th className="text-center">Most Improved</th>
            </tr>
          </thead>
          <tbody>
            {awards.map((award, idx) => (
              <tr key={idx}>
                <th className="text-center">{award.Year}</th>
                <td dangerouslySetInnerHTML={{ __html: award.PlayersPlayer }}></td>
                <td dangerouslySetInnerHTML={{ __html: award.CaptainsPlayer }}></td>
                <td dangerouslySetInnerHTML={{ __html: award.BestBatsman }}></td>
                <td dangerouslySetInnerHTML={{ __html: award.BestBowler }}></td>
                <td dangerouslySetInnerHTML={{ __html: award.BestFielder }}></td>
                <td dangerouslySetInnerHTML={{ __html: award.MostImproved }}></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h5 className="mb-1">The Hall of Fame <small>(Corridor of Uncertainty)</small></h5>
        <div className="d-flex flex-wrap">
          {hallOfFame.length > 0 ? (
            hallOfFame.map((entry, idx) => (
              <div key={idx} className="mx-1">
                <div className="mb-1">{entry.Year} - {entry.PlayerName}</div>
                <div className="panel-body">
                  {entry.EmbedUrl && (
                    <iframe 
                      src={entry.EmbedUrl} 
                      frameBorder="0" 
                      allowFullScreen
                      title={`Hall of Fame ${entry.Year}`}
                    ></iframe>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No Hall of Fame entries yet.</p>
          )}
        </div>

        <hr />
      </main>
      <Footer />
    </>
  );
};

export default Awards;
