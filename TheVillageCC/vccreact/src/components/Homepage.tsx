import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { getResultBadge } from '../utils/matchResultUtils';
import { getRecentResults } from '../api/resultsApi';

// Interface for display format
interface MatchReport {
  heading: string;
  subText: string;
  text: string;
  matchId: string;
  imageSrc: string;
  matchDate: string;
  resultText: string;
  isWinner: boolean | null;
  isTied: boolean;
  isDrawn: boolean;
  isAbandoned: boolean;
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

        // Use the centralized API to fetch recent results
        const desiredCount = 3;
        const data = await getRecentResults(desiredCount);

        // Transform API data to display format
        const transformedReports: MatchReport[] = data.map((item) => {
          const heading = `${item.homeTeamName ?? ''} vs ${item.awayTeamName ?? ''}`.trim();

          const subText = item.resultMargin
            ? `${item.resultText ?? ''} - ${item.resultMargin}`.trim()
            : (item.resultText ?? '').trim();

          // Prefer match report text if present (falls back to empty string)
          const reportText = item.matchReportText || '';
          const text = reportText.length > MAX_REPORT_PREVIEW_LENGTH
            ? reportText.substring(0, MAX_REPORT_PREVIEW_LENGTH) + '...'
            : reportText;

          const imageSrc = item.matchReportImage || '/match_reports/images/no_match_report_image.jpg';

          return {
            heading,
            subText,
            text,
            matchId: item.matchId.toString(),
            imageSrc,
            matchDate: item.matchDate ?? '',
            resultText: item.resultText ?? '',
            isWinner: item.isWinner ?? null,
            isTied: item.isTied ?? false,
            isDrawn: item.isDrawn ?? false,
            isAbandoned: item.isAbandoned ?? false,
          };
        });

        setMatchReports(transformedReports);
        setError(null);
      } catch (err) {
        console.error('Error fetching match reports:', err);
        setError(err instanceof Error ? err.message : 'Failed to load match reports');
        setMatchReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchReports();
  }, []);

  return (
    <div className="font-sans text-villageText bg-gray-50">
      <Header />

      <main>
        {/* HERO - Rotating Carousel */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
            {/* Copy */}
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-villageGreen mb-3">
                A very friendly cricket club · Est. 2002
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-villageText leading-tight">
                {CAROUSEL_SLIDES[currentSlide].title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl">
                {CAROUSEL_SLIDES[currentSlide].subtitle}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={CAROUSEL_SLIDES[currentSlide].buttonLink}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-villageGreen text-white text-sm font-medium shadow-sm hover:bg-emerald-700 transition"
                >
                  {CAROUSEL_SLIDES[currentSlide].buttonText}
                </a>
                <a
                  href="/awards"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:border-villageGreen hover:text-villageGreen transition"
                >
                  Learn more about us
                </a>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                New players welcome. No ability or familiarity with cricket required (or expected).
              </p>
            </div>

            {/* Image / Placeholder */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                <img
                  src={CAROUSEL_SLIDES[currentSlide].image}
                  alt={CAROUSEL_SLIDES[currentSlide].title}
                  className="w-full h-full object-cover"
                />
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
            </div>
          </div>
        </section>

        {/* INTRO + FEATURE CARDS */}
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-semibold text-villageText">
                Village by name...
              </h2>
              <p className="mt-3 text-gray-600">
                An amicable, social, and largely non‑competitive wandering cricket club, playing the sport
                in some of the most pleasant bits of London and beyond. More pub chat than proper net
                practice. More tours than trophies.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {/* About card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-md bg-villageGreenLight flex items-center justify-center">
                  <span className="text-xs text-villageGreen font-semibold">i</span>
                </div>
                <h3 className="text-sm font-semibold text-villageText">About us</h3>
                <p className="text-sm text-gray-600">
                  Your one‑stop shop for club history, myths, legends and well‑worn clichés.
                </p>
                <a href="/awards" className="mt-2 text-sm font-medium text-villageGreen hover:underline">
                  Read the origin story →
                </a>
              </div>

              {/* Get involved card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-md bg-villageGreenLight flex items-center justify-center">
                  <span className="text-xs text-villageGreen font-semibold">+</span>
                </div>
                <h3 className="text-sm font-semibold text-villageText">Get involved</h3>
                <p className="text-sm text-gray-600">
                  We want new players. No trials, no egos, no problem. Turn up, have a go, find the pub.
                </p>
                <a href="mailto:thevillagecc@gmail.com" className="mt-2 text-sm font-medium text-villageGreen hover:underline">
                  Get in touch →
                </a>
              </div>

              {/* Stats card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-md bg-villageGreenLight flex items-center justify-center">
                  <span className="text-xs text-villageGreen font-semibold">%</span>
                </div>
                <h3 className="text-sm font-semibold text-villageText">Stats</h3>
                <p className="text-sm text-gray-600">
                  Current players enjoy squinting at their lifetime failures. Others are welcome to
                  rubber‑neck.
                </p>
                <a href="/stats" className="mt-2 text-sm font-medium text-villageGreen hover:underline">
                  Browse the numbers →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS SNAPSHOT */}
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-villageText">Recent results</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Highlights from the latest masterpieces, both heroic and humiliating.
                </p>
              </div>
              <a href="/results" className="text-sm font-medium text-villageGreen hover:underline">
                View all results →
              </a>
            </div>

            {isLoading && (
              <div className="mt-8">
                <p>Loading match reports...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-8" role="alert">
                {error}
              </div>
            )}
            
            {!isLoading && matchReports.length === 0 && !error && (
              <div className="mt-8">
                <p>No match reports available at this time.</p>
              </div>
            )}

            {!isLoading && matchReports.length > 0 && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {matchReports.slice(0, 2).map((report, index) => {
                  // Use shared utility to get badge
                  const { color: statusColor, text: statusText } = getResultBadge(report);
                  
                  // Safely parse the date
                  const matchDate = new Date(report.matchDate);
                  const dateDisplay = !isNaN(matchDate.getTime()) 
                    ? matchDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                    : report.matchDate;
                  
                  // Safely extract opponent name
                  const headingParts = report.heading.split(' vs ');
                  const opponentName = headingParts.length > 1 ? headingParts[1] : report.heading;

                  return (
                    <article key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{dateDisplay} · {opponentName}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${statusColor}`}>
                          {statusText}
                        </span>
                      </div>
                      <div className="text-base font-semibold text-gray-800">
                        {report.heading}
                      </div>
                      <div className="text-sm text-gray-600">
                        {report.subText}
                      </div>
                      <p className="text-sm text-gray-600">
                        {report.text}
                      </p>
                      <a
                        href={`/LiveScorecard.aspx?matchId=${report.matchId}`}
                        className="text-sm font-medium text-villageGreen hover:underline mt-2"
                      >
                        Read full report →
                      </a>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;
