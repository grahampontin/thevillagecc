<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Awards.aspx.cs" Inherits="Stats" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html>

<html lang="en">
<head id="Head1" runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>The Village Cricket Club Online | About</title>

    <CC:Styles runat=server ID=styles></CC:Styles>

</head>
<body>
<div class="">
<!-- Head -->
<CC:Header ID="Header1" runat=server></CC:Header>
<!-- End Head -->
<main class="container">
<h5 class="pt-2">Club Stats</h5>
<div class="card">
    <div class="card-body">
        <div class="d-flex flex-wrap">
            <div class="mx-auto" style="white-space: nowrap">
                Formed: <strong>Feb 2004</strong>
            </div>
            <div class="mx-auto" style="white-space: nowrap">
                Home Ground: <strong>Parliament Hill</strong>
            </div>
            <div class="mx-auto" style="white-space: nowrap">
                Capacity: <strong>250,000 (standing); 5 (seated)</strong>
            </div>
        </div>

    </div>

</div>
<div class="card mt-3">
    
    <div class="card-body">
        <div class="card-title">
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
<hr/>

<div class="d-flex flex-wrap align-items-stretch mt-3 w-100">
    <div class="flex-grow-1 me-2 mb-2">
        <h5 class="text-center">Captains</h5>
        <table class="table">
            <% foreach (var captain in CaptainsData) { %>
            <tr>
                <td><%= captain.Year %></td><td><%= captain.PlayerName %></td>
            </tr>
            <% } %>
        </table>
    </div>
    <div class="flex-grow-1 mb-2">
        <h5 class="text-center">Vice-Captains</h5>
        <table class="table">
            <% foreach (var viceCaptain in ViceCaptainsData) { %>
            <tr>
                <td><%= viceCaptain.Year %></td><td><%= viceCaptain.PlayerName %></td>
            </tr>
            <% } %>
        </table>
    </div>
    <div class="flex-grow-1 ms-2 mb-2">
        <h5 class="text-center">Player of the Year</h5>
        <table class="table">
            <% foreach (var player in PlayerOfYearData) { %>
            <tr>
                <td><%= player.Year %></td><td><%= player.PlayerName %></td>
            </tr>
            <% } %>
        </table>
    </div>

</div>
<hr/>
<h5>Leading Players</h5>
<div class="d-flex flex-wrap">
    <div class="mx-auto" style="white-space: nowrap">
        Leading Run Scorer:
        <strong><asp:Literal runat=server ID=LeadingRSName></asp:Literal>&nbsp;(<asp:Literal runat=server ID=LeadingRSRuns></asp:Literal>)</strong>
    </div>
    <div class="mx-auto" style="white-space: nowrap">
        Leading Wicket Taker:
        <strong><asp:Literal runat=server ID=LeadingWTName></asp:Literal>&nbsp;(<asp:Literal runat=server ID=LeadingWTWickets></asp:Literal>)</strong>
    </div>
    <div class="mx-auto" style="white-space: nowrap">
        Most Catches:
        <strong><asp:Literal runat=server ID=MostCatchesName></asp:Literal>&nbsp;(<asp:Literal runat=server ID=MostCatchesNumber></asp:Literal>)</strong>
    </div>

</div>
<hr/>
<h5>Awards</h5>
<table class="table">
    <tr>
        <th class="text-center"></th>
        <th class="text-center">Players' Player of The Season</th>
        <th class="text-center">Captain's Player of The Season</th>
        <th class="text-center">Best Batsman</th>
        <th class="text-center">Best Bowler</th>
        <th class="text-center">Best Fielder</th>
        <th class="text-center">Most Improved</th>
    </tr>
    <% foreach (var award in AwardsData) { %>
    <tr>
        <th class="text-center"><%= award.Year %></th>
        <td><%= award.PlayersPlayer %></td>
        <td><%= award.CaptainsPlayer %></td>
        <td><%= award.BestBatsman %></td>
        <td><%= award.BestBowler %></td>
        <td><%= award.BestFielder %></td>
        <td><%= award.MostImproved %></td>
    </tr>
    <% } %>
</table>


<h5 class="mb-1">The Hall of Fame <small>(Corridor of Uncertainty)</small></h5>
<div class="d-flex flex-wrap">
    <div class="mx-1">
        <div class="mb-1">2008 - Andrew Richardson</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/TfbYZxot8ek" frameborder="0" allowfullscreen></iframe>

        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2009 - AA Page</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/JF9WgDY2bw8" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2010 - Alan White</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/_to1fIcc-cY" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2011 - Graham Pontin</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/cm4u1irM9U4" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2012 - Paul Bowman</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/w7_Gp1xPfuc" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2013 - John Lucarotti</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/ffju3JkcbHQ" frameborder="0" allowfullscreen></iframe>

        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2014 - Matt Boa</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/F0Vqb7EJjng" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2014 - Oli Morgans</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/HWeb-6s-whQ" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2014 - Louse</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/T54xZvzu1xo" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2014 - Parp!</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/khbf4tOiNkM" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2015 - Klav</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/bybkcHYajJI" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2016 - Pitch</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/Eko_ih__G8g" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2017 - Troja</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/TODO" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2018 - Thommo</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/g1l6HAyCBMM" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2019 - JdM</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/sLHp4yUpFO4" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2021 - Eddie</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/gHN-UmjcWCM" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
    <div class="mx-1">
        <div class="mb-1">2022 - Cress</div>
        <div class="panel-body">
            <iframe src="//www.youtube.com/embed/BcVdx84BtJ4" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
</div>

<hr/>

</main>
<!-- Footer -->
<CC:Footer ID="Footer1" runat="server"></CC:Footer>
<!-- ENd Footer -->
</div>
</body>
</html>