import React, { useState, useEffect } from 'react';
import { Container, Carousel, Button } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';

// Define interfaces for match report data from API
interface MatchReportListItem {
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

// Interface for display format
interface MatchReport {
  heading: string;
  subText: string;
  text: string;
  matchId: string;
  imageSrc: string;
}

const MAX_REPORT_PREVIEW_LENGTH = 200;

const Homepage: React.FC = () => {
  const [matchReports, setMatchReports] = useState<MatchReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/matchreports?limit=3&order=desc');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch match reports: ${response.status}`);
        }
        
        const data: MatchReportListItem[] = await response.json();
        
        // Transform API data to display format
        const transformedReports: MatchReport[] = data.map((item) => {
          // Create heading from home vs away teams
          const heading = `${item.HomeTeamName} vs ${item.AwayTeamName}`;
          
          // Use result text and margin as subtext
          const subText = item.ResultMargin 
            ? `${item.ResultText} - ${item.ResultMargin}`
            : item.ResultText;
          
          // Use first MAX_REPORT_PREVIEW_LENGTH characters of report as preview text
          const text = item.Report.length > MAX_REPORT_PREVIEW_LENGTH 
            ? item.Report.substring(0, MAX_REPORT_PREVIEW_LENGTH) + '...'
            : item.Report;
          
          // Use report image if available, otherwise use default
          const imageSrc = item.ReportImage || '/match_reports/images/no_match_report_image.jpg';
          
          return {
            heading,
            subText,
            text,
            matchId: item.MatchId.toString(),
            imageSrc
          };
        });
        
        setMatchReports(transformedReports);
        setError(null);
      } catch (err) {
        console.error('Error fetching match reports:', err);
        setError(err instanceof Error ? err.message : 'Failed to load match reports');
        // Set empty array on error so the page still renders
        setMatchReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchReports();
  }, []);

  return (
    <>
      <Header />
      <main className="container">
        {/* Carousel */}
        <Carousel className="d-none d-md-block" data-bs-ride="carousel" id="myCarousel">
          <Carousel.Item>
            <img 
              src="/images/newCarousel/slide2.jpg" 
              className="d-block w-100 img-fluid" 
              alt="Friendly Cricket in and around London"
            />
            <Carousel.Caption className="d-none d-md-block">
              <h1>Friendly Cricket in and around London</h1>
              <p>We play all over London and outside, check out our latest matches</p>
              <p>
                <Button variant="success" size="lg" href="/Results.aspx">
                  Results
                </Button>
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img 
              src="/images/newCarousel/slide3.jpg" 
              className="d-block w-100 img-fluid" 
              alt="Tours"
            />
            <Carousel.Caption className="d-none d-md-block">
              <h1>Tours!</h1>
              <p>The Village CC loves a spot of touring, check out some our recent trips.</p>
              <p>
                <Button variant="success" size="lg" href="/Tours.html">
                  Touring
                </Button>
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img 
              src="/images/newCarousel/slide1.jpg" 
              className="d-block w-100 img-fluid" 
              alt="We're Recruiting"
            />
            <Carousel.Caption className="d-none d-md-block">
              <h1>We're Recruiting!</h1>
              <p>Players of all abilities welcome.</p>
              <p>
                <Button variant="success" size="lg" href="mailto:thevillagecc@gmail.com">
                  Join Us!
                </Button>
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        {/* Marketing Section */}
        <Container className="marketing" style={{ paddingTop: '20px' }}>
          <div className="row d-none d-lg-flex">
            <div className="col-lg-4">
              <img 
                src="/images/vcc_cricle_small.png" 
                alt="About Us" 
                width="140" 
                height="140"
              />
              <h2>About us</h2>
              <p>
                The Village Cricket Club is a small club based loosely around its roots in North East London. We were
                formed in 2004 by a bunch of singularly talentless but enthusiastic cricketers...
              </p>
              <p>
                <Button variant="default" href="/Awards.aspx">
                  View details &raquo;
                </Button>
              </p>
            </div>
            <div className="col-lg-4">
              <span className="material-icons-round" style={{ fontSize: '125px' }}>
                sports_cricket
              </span>
              <h2>Get involved</h2>
              <p>
                We're always on the lookout for new recruits of all abilities. Batsman, bowler, enthusiast, novice;
                The Village welcomes all. If you're looking to get involved you can shoot us an email, fill in this
                nice little form or even track us down on twitter.
              </p>
              <p>
                <Button variant="default" href="/Join.aspx">
                  View details &raquo;
                </Button>
              </p>
            </div>
            <div className="col-lg-4">
              <span className="material-icons-round" style={{ fontSize: '125px' }}>
                query_stats
              </span>
              <h2>Stats</h2>
              <p>
                Let's be honest, it's the only reason most of us play the game. The chance to slice, dice and dissect
                every inch of your game then talk about it at the pub. That's real cricket.
              </p>
              <p>
                <Button variant="default" href="/stats.aspx">
                  View details &raquo;
                </Button>
              </p>
            </div>
          </div>

          <hr className="featurette-divider d-none d-lg-block" style={{ marginTop: '1rem' }} />

          {/* Match Reports */}
          {isLoading && (
            <div className="text-center" style={{ marginTop: '2rem' }}>
              <p>Loading match reports...</p>
            </div>
          )}
          
          {error && (
            <div className="alert alert-warning" style={{ marginTop: '2rem' }} role="alert">
              {error}
            </div>
          )}
          
          {!isLoading && matchReports.length === 0 && !error && (
            <div className="text-center" style={{ marginTop: '2rem' }}>
              <p>No match reports available at this time.</p>
            </div>
          )}
          
          {!isLoading && matchReports.map((report, index) => (
            <React.Fragment key={index}>
              <div className="row featurette" style={{ marginTop: '2rem' }}>
                {index % 2 === 0 ? (
                  <>
                    <div className="col-md-7">
                      <h2 className="featurette-heading">
                        {report.heading}
                        <span className="text-muted"> {report.subText}</span>
                      </h2>
                      <p className="lead">{report.text}</p>
                      <p>
                        <Button 
                          variant="default" 
                          href={`/LiveScorecard.aspx?matchId=${report.matchId}`}
                        >
                          Read more &raquo;
                        </Button>
                      </p>
                    </div>
                    <div className="col-md-5">
                      <img 
                        className="featurette-image img-fluid mx-auto center-block" 
                        src={report.imageSrc}
                        alt="Match Report" 
                        width="500" 
                        height="500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-7 order-md-2">
                      <h2 className="featurette-heading">
                        {report.heading}
                        <span className="text-muted"> {report.subText}</span>
                      </h2>
                      <p className="lead">{report.text}</p>
                      <p>
                        <Button 
                          variant="default" 
                          href={`/LiveScorecard.aspx?matchId=${report.matchId}`}
                        >
                          Read more &raquo;
                        </Button>
                      </p>
                    </div>
                    <div className="col-md-5 order-md-1">
                      <img 
                        className="featurette-image img-fluid mx-auto center-block" 
                        src={report.imageSrc}
                        alt="Match Report" 
                        width="500" 
                        height="500"
                      />
                    </div>
                  </>
                )}
              </div>
              <hr className="featurette-divider" />
            </React.Fragment>
          ))}
        </Container>
        <Footer />
      </main>
    </>
  );
};

export default Homepage;
