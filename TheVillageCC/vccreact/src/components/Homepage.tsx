import React, { useState, useEffect } from 'react';
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

const CAROUSEL_SLIDES = [
  {
    image: '/images/newCarousel/slide2.jpg',
    title: 'Friendly Cricket in and around London',
    subtitle: 'We play all over London and outside, check out our latest matches',
    buttonText: 'Results',
    buttonLink: '/results'
  },
  {
    image: '/images/newCarousel/slide3.jpg',
    title: 'Tours!',
    subtitle: 'The Village CC loves a spot of touring, check out some our recent trips.',
    buttonText: 'Touring',
    buttonLink: '/Tours.html'
  },
  {
    image: '/images/newCarousel/slide1.jpg',
    title: "We're Recruiting!",
    subtitle: 'Players of all abilities welcome.',
    buttonText: 'Join Us!',
    buttonLink: 'mailto:thevillagecc@gmail.com'
  }
];

const Homepage: React.FC = () => {
  const [matchReports, setMatchReports] = useState<MatchReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
        <div className="hidden md:block relative" id="myCarousel">
          <div className="relative h-[500px] overflow-hidden">
            {CAROUSEL_SLIDES.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.image}
                  className="w-full h-full object-cover"
                  alt={slide.title}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="hidden md:block text-center text-white">
                    <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-xl mb-6">{slide.subtitle}</p>
                    <p>
                      <a
                        href={slide.buttonLink}
                        className="inline-block px-6 py-3 text-lg font-semibold text-white bg-green-600 hover:bg-green-700 rounded"
                      >
                        {slide.buttonText}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {CAROUSEL_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Carousel Controls */}
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)}
          >
            <span className="sr-only">Previous</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length)}
          >
            <span className="sr-only">Next</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Marketing Section */}
        <div className="px-4 pt-5">
          <div className="hidden lg:flex flex-wrap -mx-3">
            <div className="w-full lg:w-1/3 px-3 mb-6 text-center">
              <img
                src="/images/vcc_cricle_small.png"
                alt="About Us"
                width="140"
                height="140"
                className="mx-auto"
              />
              <h2 className="text-2xl font-normal my-4">About us</h2>
              <p className="mx-3">
                The Village Cricket Club is a small club based loosely around its roots in North East London. We were
                formed in 2004 by a bunch of singularly talentless but enthusiastic cricketers...
              </p>
              <p>
                <a href="/awards" className="inline-block px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">
                  View details &raquo;
                </a>
              </p>
            </div>
            <div className="w-full lg:w-1/3 px-3 mb-6 text-center">
              <span className="material-icons-round text-[125px]">
                sports_cricket
              </span>
              <h2 className="text-2xl font-normal my-4">Get involved</h2>
              <p className="mx-3">
                We're always on the lookout for new recruits of all abilities. Batsman, bowler, enthusiast, novice;
                The Village welcomes all. If you're looking to get involved you can shoot us an email, fill in this
                nice little form or even track us down on twitter.
              </p>
              <p>
                <a href="/Join.aspx" className="inline-block px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">
                  View details &raquo;
                </a>
              </p>
            </div>
            <div className="w-full lg:w-1/3 px-3 mb-6 text-center">
              <span className="material-icons-round text-[125px]">
                query_stats
              </span>
              <h2 className="text-2xl font-normal my-4">Stats</h2>
              <p className="mx-3">
                Let's be honest, it's the only reason most of us play the game. The chance to slice, dice and dissect
                every inch of your game then talk about it at the pub. That's real cricket.
              </p>
              <p>
                <a href="/stats.aspx" className="inline-block px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">
                  View details &raquo;
                </a>
              </p>
            </div>
          </div>

          <hr className="hidden lg:block my-4 border-gray-300" />

          {/* Match Reports */}
          {isLoading && (
            <div className="text-center mt-8">
              <p>Loading match reports...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-8" role="alert">
              {error}
            </div>
          )}
          
          {!isLoading && matchReports.length === 0 && !error && (
            <div className="text-center mt-8">
              <p>No match reports available at this time.</p>
            </div>
          )}
          
          {!isLoading && matchReports.map((report, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-wrap mt-8">
                {index % 2 === 0 ? (
                  <>
                    <div className="w-full md:w-7/12 px-3">
                      <h2 className="text-3xl font-light leading-tight tracking-tight">
                        {report.heading}
                        <span className="text-gray-500"> {report.subText}</span>
                      </h2>
                      <p className="text-lg mt-4">{report.text}</p>
                      <p className="mt-4">
                        <a
                          href={`/LiveScorecard.aspx?matchId=${report.matchId}`}
                          className="inline-block px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                        >
                          Read more &raquo;
                        </a>
                      </p>
                    </div>
                    <div className="w-full md:w-5/12 px-3">
                      <img
                        className="w-full max-w-[500px] mx-auto"
                        src={report.imageSrc}
                        alt="Match Report"
                        width="500"
                        height="500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full md:w-7/12 md:order-2 px-3">
                      <h2 className="text-3xl font-light leading-tight tracking-tight">
                        {report.heading}
                        <span className="text-gray-500"> {report.subText}</span>
                      </h2>
                      <p className="text-lg mt-4">{report.text}</p>
                      <p className="mt-4">
                        <a
                          href={`/LiveScorecard.aspx?matchId=${report.matchId}`}
                          className="inline-block px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                        >
                          Read more &raquo;
                        </a>
                      </p>
                    </div>
                    <div className="w-full md:w-5/12 md:order-1 px-3">
                      <img
                        className="w-full max-w-[500px] mx-auto"
                        src={report.imageSrc}
                        alt="Match Report"
                        width="500"
                        height="500"
                      />
                    </div>
                  </>
                )}
              </div>
              <hr className="my-20 border-gray-300" />
            </React.Fragment>
          ))}
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Homepage;
