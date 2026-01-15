import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface Venue {
  Id: number;
  Name: string;
}

interface Team {
  Id: number;
  Name: string;
}

interface Match {
  Id: number;
  Date: string;
  Venue: Venue;
  Opposition: Team;
  Type: string;
  IsHome: boolean;
}

interface FixtureDisplay {
  Id: number;
  MatchDateString: string;
  HomeTeamName: string;
  AwayTeamName: string;
  VenueName: string;
  Type: string;
  IsHome: boolean;
}

const Fixtures: React.FC = () => {
  const [fixtures, setFixtures] = useState<FixtureDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setIsLoading(true);

        const response = await fetch('/api/refdata/matches');
        if (!response.ok) {
          throw new Error('Failed to fetch fixtures');
        }

        const allMatches: Match[] = await response.json();

        // Filter for future matches (fixtures)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureMatches = allMatches.filter(match => {
          const matchDate = new Date(match.Date);
          return matchDate >= today;
        });

        // Transform to display format
        const displayFixtures = futureMatches.map(match => ({
          Id: match.Id,
          MatchDateString: new Date(match.Date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          HomeTeamName: match.IsHome ? 'The Village CC' : match.Opposition.Name,
          AwayTeamName: match.IsHome ? match.Opposition.Name : 'The Village CC',
          VenueName: match.Venue.Name,
          Type: match.Type,
          IsHome: match.IsHome
        }));

        setFixtures(displayFixtures);
      } catch (error) {
        console.error('Error fetching fixtures:', error);
        setFixtures([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFixtures();
  }, []);

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
        <h1>Fixtures</h1>
        {fixtures.length === 0 ? (
          <div className="alert alert-info">
            No upcoming fixtures at this time.
          </div>
        ) : (
          <table id="fixtureTable" className="table table-striped">
            <thead className="d-none d-md-table-head">
              <tr>
                <th></th>
                <th className="d-none d-md-table-cell">Home</th>
                <th></th>
                <th className="d-none d-md-table-cell">Away</th>
                <th></th>
                <th>Venue</th>
                <th></th>
                <th className="d-none d-md-table-cell"></th>
              </tr>
            </thead>
            <tbody>
              {fixtures.map((fixture) => (
                <tr key={fixture.Id}>
                  <td className="d-md-none">
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <h6>{fixture.HomeTeamName} vs {fixture.AwayTeamName}</h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <i>{fixture.MatchDateString} at {fixture.VenueName}</i>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td className="d-none d-md-table-cell">{fixture.MatchDateString}</td>
                  <td 
                    className="d-none d-md-table-cell" 
                    style={fixture.IsHome ? { fontWeight: 'bold' } : {}}
                  >
                    {fixture.HomeTeamName}
                  </td>
                  <td className="d-none d-md-table-cell">vs</td>
                  <td 
                    className="d-none d-md-table-cell"
                    style={!fixture.IsHome ? { fontWeight: 'bold' } : {}}
                  >
                    {fixture.AwayTeamName}
                  </td>
                  <td className="d-none d-md-table-cell">at</td>
                  <td className="d-none d-md-table-cell">{fixture.VenueName}</td>
                  <td className="d-none d-md-table-cell">({fixture.Type})</td>
                  <td>
                    <div title="Add to Calendar" className="addeventatc">
                      Add
                      <span className="start">{fixture.MatchDateString} 12:00</span>
                      <span className="end">{fixture.MatchDateString} 23:00</span>
                      <span className="timezone">United Kingdom/London</span>
                      <span className="title">{fixture.HomeTeamName} vs {fixture.AwayTeamName}</span>
                      <span className="description">
                        {fixture.HomeTeamName} vs {fixture.AwayTeamName} at {fixture.VenueName}
                      </span>
                      <span className="location">{fixture.VenueName}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Fixtures;
