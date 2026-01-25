import React from 'react';
import Header from './Header';
import Footer from './Footer';

const About: React.FC = () => {
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
      </main>
      <Footer />
    </>
  );
};

export default About;
