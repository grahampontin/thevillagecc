using System;
using System.Collections.Generic;
using System.Linq;
using CricketClubMiddle;
using CricketClubDAL;
using CricketClubDomain;

public partial class Committee : System.Web.UI.Page
{
    protected List<CommitteePostData> CommitteePosts { get; set; }
    protected void Page_Load(object sender, EventArgs e)
    {
        Header1.PageID = "Committee";

        LoadCommitteePosts();
    }

    private void LoadCommitteePosts()
    {
        var dao = new Dao();
        List<CommitteeData> committeeData;
        if (dao.GetAllCommitteeData() != null)
            committeeData = dao.GetAllCommitteeData().ToList();
        else
            committeeData = null;

        if (committeeData == null)
        {
            committeeData = new List<CommitteeData>();
        }

        // If there is no committee data, return an empty list to avoid null checks in the markup
        if (!committeeData.Any())
        {
            CommitteePosts = new List<CommitteePostData>();
            return;
        }

        // Determine the most recent year available and only show posts for that year
        var mostRecentYear = committeeData.Max(c => c.Year);
        var postsForMostRecentYear = committeeData.Where(c => c.Year == mostRecentYear);

        var allPlayers = Player.GetAll().Where(a => a.Id > 0).ToDictionary(p => p.Id, p => p);

        // Define the display ordering to match the existing page layout
        var postOrder = new Dictionary<Post, int>
        {
            { Post.Captain, 0 },
            { Post.ViceCaptain, 1 },
            { Post.Treasurer, 2 },
            { Post.FixturesSecretary, 3 },
            { Post.SocialSecretary, 4 },
            { Post.DirectorOfCricket, 5 },
            { Post.TourSecretary, 6 },
            { Post.Webmaster, 7 }
        };

        CommitteePosts = postsForMostRecentYear
            .OrderBy(c => postOrder.ContainsKey(c.Post) ? postOrder[c.Post] : int.MaxValue)
            .Select(c => new CommitteePostData
            {
                Post = c.Post.ToString(),
                Year = c.Year,
                PlayerName = allPlayers.ContainsKey(c.PlayerId) ? allPlayers[c.PlayerId].Name : "Unknown",
                PlayerImageId = c.PlayerId
            })
            .ToList();
    }

    public class CommitteePostData
    {
        public string Post { get; set; }
        public int Year { get; set; }
        public string PlayerName { get; set; }
        public int PlayerImageId { get; set; }
    }
}
