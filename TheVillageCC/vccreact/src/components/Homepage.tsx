import React from 'react';
import { Container, Carousel, Button } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';

// Define interfaces for match report data
interface MatchReport {
  heading: string;
  subText: string;
  text: string;
  matchId: string;
  imageSrc: string;
}

const Homepage: React.FC = () => {
  // Mock match reports data - in a real app, this would come from an API
  const matchReports: MatchReport[] = [
    {
      heading: "Latest Match Report",
      subText: "Recent Results",
      text: "Check out our latest match reports and see how the team performed...",
      matchId: "1",
      imageSrc: "/match_reports/images/no_match_report_image.jpg"
    },
    {
      heading: "Another Great Match",
      subText: "Match Details",
      text: "Another exciting match with great performances from all players...",
      matchId: "2",
      imageSrc: "/match_reports/images/no_match_report_image.jpg"
    },
    {
      heading: "Weekend Victory",
      subText: "Match Summary",
      text: "A fantastic weekend victory with excellent batting and bowling displays...",
      matchId: "3",
      imageSrc: "/match_reports/images/no_match_report_image.jpg"
    }
  ];

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
                <Button variant="default" href="Awards.aspx">
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
                <Button variant="default" href="Join.aspx">
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
                Let's be honest, it's the only reason most of us play the game. The chance to slice, dice and disect
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
          {matchReports.map((report, index) => (
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

          <Footer />
        </Container>
      </main>
    </>
  );
};

export default Homepage;
