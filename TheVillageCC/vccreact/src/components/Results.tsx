import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface MatchReport {
  MatchId: number;
  HomeTeamName: string;
  HomeTeamScore: string;
  AwayTeamName: string;
  AwayTeamScore: string;
  ResultText: string;
  ResultMargin: string;
  MatchDate: string;
  Conditions: string;
  Report: string;
  ReportImage: string;
}

const Results: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<MatchReport[]>([]);
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

        // Fetch all match reports which includes result data
        const response = await fetch('/api/matchreports');
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const allMatchReports: MatchReport[] = await response.json();

        // Filter for matches in the specified season (April to April)
        const seasonStart = new Date(year, 3, 1); // April 1st
        const seasonEnd = new Date(year + 1, 3, 1); // April 1st next year

        const seasonResults = allMatchReports.filter(match => {
          const matchDate = new Date(match.MatchDate);
          return matchDate >= seasonStart && matchDate < seasonEnd;
        });

        // Sort by date descending (most recent first)
        seasonResults.sort((a, b) => new Date(b.MatchDate).getTime() - new Date(a.MatchDate).getTime());

        setResults(seasonResults);
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isHomeMatch = (result: MatchReport): boolean => {
    return result.HomeTeamName === 'The Village CC';
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
                key={result.MatchId}
                href={`/LiveScorecard.aspx?matchId=${result.MatchId}`}
                className="list-group-item list-group-item-action"
                aria-current="true"
              >
                <div className="d-flex w-100 justify-content-between">
                  <div className="d-block">
                    <div className="mb-1">
                      <small>{formatDate(result.MatchDate)}</small>
                    </div>
                    <div className="w-75">
                      <h5 className="mb-1 d-flex flex-row flex-wrap flex-lg-nowrap">
                        <div 
                          className="text-nowrap pe-1"
                          style={isHomeMatch(result) ? { fontWeight: 'bold' } : {}}
                        >
                          {result.HomeTeamName}
                        </div>
                        {result.HomeTeamScore && (
                          <div className="text-nowrap pe-1">
                            ({result.HomeTeamScore})
                          </div>
                        )}
                        <div className="text-nowrap pe-1">
                          {result.ResultText}
                        </div>
                        <div 
                          className="text-nowrap pe-1"
                          style={!isHomeMatch(result) ? { fontWeight: 'bold' } : {}}
                        >
                          {result.AwayTeamName}
                        </div>
                        {result.AwayTeamScore && (
                          <div className="text-nowrap pe-1">
                            ({result.AwayTeamScore})
                          </div>
                        )}
                      </h5>
                    </div>
                    {result.ResultMargin && (
                      <p className="mb-1 fst-italic">
                        {result.ResultMargin}
                      </p>
                    )}
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
