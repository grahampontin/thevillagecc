import React, { useState, useEffect } from 'react';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
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
  MatchDate: string; // Original ISO date string
  HomeTeamName: string;
  AwayTeamName: string;
  VenueName: string;
  Type: string;
  IsHome: boolean;
}

const Fixtures: React.FC = () => {
  const [fixtures, setFixtures] = useState<FixtureDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to format date for calendar
  const formatDateForCalendar = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Handler for "Add All to Calendar" button
  const handleAddAllToCalendar = () => {
    if (fixtures.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to add all ${fixtures.length} fixtures to your calendar?`
    );
    
    if (confirmed) {
      // Trigger all calendar buttons programmatically
      fixtures.forEach((fixture, index) => {
        setTimeout(() => {
          const button = document.querySelector(`[data-fixture-id="${fixture.Id}"] button`) as HTMLElement;
          if (button) {
            button.click();
          }
        }, index * 100); // Small delay between each to avoid overwhelming the browser
      });
    }
  };

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setIsLoading(true);

        const response = await fetch('/api/fixtures');
        if (!response.ok) {
          throw new Error('Failed to fetch fixtures');
        }

        const matches: Match[] = await response.json();

        // Transform to display format
        const displayFixtures = matches.map(match => ({
          Id: match.Id,
          MatchDateString: new Date(match.Date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          MatchDate: match.Date,
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
          <>
            <div className="mb-3">
              <button 
                className="btn btn-primary"
                onClick={handleAddAllToCalendar}
              >
                Add All to Calendar
              </button>
            </div>
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
                      <div data-fixture-id={fixture.Id}>
                        <AddToCalendarButton
                          name={`${fixture.HomeTeamName} vs ${fixture.AwayTeamName}`}
                          startDate={formatDateForCalendar(fixture.MatchDate)}
                          startTime="12:00"
                          endTime="23:00"
                          timeZone="Europe/London"
                          location={fixture.VenueName}
                          description={`${fixture.HomeTeamName} vs ${fixture.AwayTeamName} at ${fixture.VenueName}`}
                          options={['Apple','Google','Outlook.com','Microsoft365','Yahoo']}
                          buttonStyle="flat"
                          lightMode="bodyScheme"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Fixtures;
