import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface Player {
  playerId: number;
  firstName: string;
  surname: string;
}

interface CommitteePost {
  Id: number;
  Year: number;
  Post: string;
  PlayerId: number;
}

interface CommitteeDisplay {
  Post: string;
  PlayerName: string;
  PlayerImageId: number;
}

const Committee: React.FC = () => {
  const [committeePosts, setCommitteePosts] = useState<CommitteeDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommitteeData = async () => {
      try {
        setIsLoading(true);

        const [playersRes, committeeRes] = await Promise.all([
          fetch('/api/players'),
          fetch('/api/committee')
        ]);

        if (!playersRes.ok || !committeeRes.ok) {
          throw new Error('Failed to fetch committee data');
        }

        const players: Player[] = await playersRes.json();
        const allCommittee: CommitteePost[] = await committeeRes.json();

        if (allCommittee.length === 0) {
          setCommitteePosts([]);
          return;
        }

        // Create player lookup
        const playerMap = new Map(players.map(p => [p.playerId, `${p.firstName} ${p.surname}`.trim()]));

        // Get most recent year
        const mostRecentYear = Math.max(...allCommittee.map(c => c.Year));
        const postsForMostRecentYear = allCommittee.filter(c => c.Year === mostRecentYear);

        // Define display order
        const postOrder: Record<string, number> = {
          Captain: 0,
          ViceCaptain: 1,
          Treasurer: 2,
          FixturesSecretary: 3,
          SocialSecretary: 4,
          DirectorOfCricket: 5,
          TourSecretary: 6,
          Webmaster: 7
        };

        const displayPosts = postsForMostRecentYear
          .sort((a, b) => (postOrder[a.Post] ?? 999) - (postOrder[b.Post] ?? 999))
          .map(c => ({
            Post: c.Post,
            PlayerName: playerMap.get(c.PlayerId) || 'Unknown',
            PlayerImageId: c.PlayerId
          }));

        setCommitteePosts(displayPosts);
      } catch (error) {
        console.error('Error fetching committee data:', error);
        setCommitteePosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommitteeData();
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
        <h5>Committee</h5>
        <div className="card">
          <div className="card-body">
            <div className="d-flex flex-wrap">
              {committeePosts.length > 0 ? (
                committeePosts.map((post, idx) => (
                  <div key={idx} className="flex-fill">
                    <div className="text-center">
                      <img 
                        src={`Images/player_profiles/${post.PlayerImageId}.png`} 
                        alt={post.PlayerName}
                        onError={(e) => {
                          // Fallback to a default image if player image doesn't exist
                          e.currentTarget.src = '/images/vcc_cricle_small.png';
                        }}
                      />
                    </div>
                    <div className="fw-bold mx-auto text-center">{post.Post}</div>
                    <div className="fst-italic mx-auto text-center">{post.PlayerName}</div>
                  </div>
                ))
              ) : (
                <p>No committee information available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="panel panel-default">
          <div className="panel-heading">Documents, minutes, meetings and such like</div>
          <div className="panel-body">
            <div className="text-center">
              <a href="./documents/constitutionSEPT2006.pdf">Constitution</a>

              <table border={0} width="100%" id="table2">
                <tbody>
                  <tr>
                    <td align="center" width="50%">
                      <u><b>AGMs</b></u>
                    </td>
                    <td align="center" width="50%">
                      <u><b>Minutes</b></u>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" width="50%">
                      <a href="./documents/IGM_5_2_2004.doc">IGM - 05/02/2004</a><br />
                      <a href="./documents/AGM_29_1_2005.doc">1st AGM - 29/01/2005</a><br />
                      <a href="./documents/AGM_12_10_2005.doc">2nd AGM - 12/10/2005</a><br />
                      <a href="./documents/AGM2006.pdf">3rd AGM - 30/9/2006</a><br />
                      <a href="./documents/AGM2007.pdf">4th AGM - 17/11/2007</a><br />
                      5th AGM - Lost to the mists of time<br />
                      6th AGM - 3/12/2009<br />
                      7th AGM - 2010 sometime<br />
                      8th AGM - 2011 sometime<br />
                      9th AGM - 2012 sometime<br />
                      10th AGM - 24/11/2013<br />
                      <a href="./documents/Review of the 2014 VCC season - FINAL.pptx">
                        11th AGM and 10 year gala dinner - 3/12/2014
                      </a><br />
                      <a href="./documents/Review%20of%20the%202015%20VCC%20season.pptx">
                        12th AGM - 14/11/2015
                      </a>
                    </td>
                    <td align="center">
                      <a href="./documents/Minutes_18_4_2004.rtf">08/04/2004</a><br />
                      <a href="./documents/Minutes_15_1_2006.doc">15/1/2006</a><br />
                      <a href="./documents/endofseason2007mins_B.pdf">
                        18/10/2007 (The infamous pre-AGM Meeting)
                      </a><br />
                      <a href="./documents/Minutes_22_2_2018.docx">22/2/2018</a><br />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Committee;
