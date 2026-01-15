import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

interface ResultDisplay {
  Id: number;
  MatchDateString: string;
  HomeTeamName: string;
  HomeTeamScore: string;
  AwayTeamName: string;
  AwayTeamScore: string;
  ResultText: string;
  ResultMargin: string;
  VenueName: string;
  IsHome: boolean;
}

const Results: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<ResultDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState<number>(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);

        // Get season from query params or use current year
        const seasonParam = searchParams.get('season');
        const year = seasonParam ? parseInt(seasonParam) : new Date().getFullYear();
        setCurrentYear(year);

        const response = await fetch(`/api/refdata/matches?season=${year}`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const allMatches: Match[] = await response.json();

        // Filter for past matches (results) within the season
        const seasonStart = new Date(year, 3, 1); // April 1st
        const seasonEnd = new Date(year + 1, 3, 1); // April 1st next year
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const pastMatches = allMatches.filter(match => {
          const matchDate = new Date(match.Date);
          return matchDate >= seasonStart && matchDate < seasonEnd && matchDate <= today;
        });

        // Transform to display format
        // Note: The API doesn't return scores/results, so we'll use placeholders
        const displayResults = pastMatches.map(match => ({
          Id: match.Id,
          MatchDateString: new Date(match.Date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          HomeTeamName: match.IsHome ? 'The Village CC' : match.Opposition.Name,
          HomeTeamScore: 'TBC', // Placeholder - would need scorecard API
          AwayTeamName: match.IsHome ? match.Opposition.Name : 'The Village CC',
          AwayTeamScore: 'TBC', // Placeholder - would need scorecard API
          ResultText: 'Result', // Placeholder
          ResultMargin: '', // Placeholder
          VenueName: match.Venue.Name,
          IsHome: match.IsHome
        }));

        setResults(displayResults);
      } catch (error) {
        console.error('Error fetching results:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const navigateToSeason = (year: number) => {
    setSearchParams({ season: year.toString() });
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
        <h1>
          <button 
            className="btn" 
            onClick={() => navigateToSeason(currentYear - 1)}
            aria-label="Previous season"
          >
            <span className="material-icons font-36px">
              arrow_back_ios
            </span>
          </button>
          Results {currentYear}
          <button 
            className="btn" 
            onClick={() => navigateToSeason(currentYear + 1)}
            aria-label="Next season"
          >
            <span className="material-icons font-36px">
              arrow_forward_ios
            </span>
          </button>
        </h1>

        {results.length === 0 ? (
          <div className="alert alert-info">
            No results available for the {currentYear} season.
          </div>
        ) : (
          <div id="resultsTable" className="list-group list-group-flush">
            {results.map((result) => (
              <a 
                key={result.Id}
                href={`/LiveScorecard.aspx?matchId=${result.Id}`}
                className="list-group-item list-group-item-action"
                aria-current="true"
              >
                <div className="d-flex w-100 justify-content-between">
                  <div className="d-block">
                    <div className="mb-1">
                      <small>{result.MatchDateString}</small>
                    </div>
                    <div className="w-75">
                      <h5 className="mb-1 d-flex flex-row flex-wrap flex-lg-nowrap">
                        <div 
                          className="text-nowrap pe-1"
                          style={result.IsHome ? { fontWeight: 'bold' } : {}}
                        >
                          {result.HomeTeamName}
                        </div>
                        <div className="text-nowrap pe-1">
                          ({result.HomeTeamScore})
                        </div>
                        <div className="text-nowrap pe-1">
                          {result.ResultText}
                        </div>
                        <div 
                          className="text-nowrap pe-1"
                          style={!result.IsHome ? { fontWeight: 'bold' } : {}}
                        >
                          {result.AwayTeamName}
                        </div>
                        <div className="text-nowrap pe-1">
                          ({result.AwayTeamScore})
                        </div>
                      </h5>
                    </div>
                    <p className="mb-1 fst-italic">
                      {result.ResultMargin && `${result.ResultMargin} `}at {result.VenueName}
                    </p>
                  </div>
                  <div className="my-auto">
                    <span className="material-icons">
                      arrow_forward_ios
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Results;
