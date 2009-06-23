<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Default.aspx.cs" Inherits="_Default" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Carousel" Src="~/UserControls/PictureCarousel.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>The Village Cricket Club Online | Home</title>
    
    
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
        <form id="form1" runat="server">
            <div id=pictureCar>
                <CC:Carousel runat=server />
            </div>
            <div id=introText>
                <div id="introTextInner">
                    <b>The Village CC (132 for 9)  beat  Further Friars  (57)</b> 
                    <br /><br />
                    <p>
                    The words "Wiltshire Tour" are associated with many things: Cider, Skittles but not oft of late Sunshine. This year the weather gods decided it was high time to cut us a break and bestow upon the West Country what will probably be the best weekend of the summer.
                    As has become traditional, our tale begins on Friday afternoon, The Village's members making their variously (un)believable excuses to knock off work early, beat the traffic out of the big smoke and onwards to the welcoming bosom of 250, The Common, Holt. For once your author doesn't have to fill too many pixels recounting stories of mud slides onto the M4, breakdowns and near bladder-rupturings, and can merely recount that the touring party arrived on time and in good order, assembling at the Tuckers Grave for an evening of Skittles and Cider-induced madness, after a short interlude to pick up this year's special bus.
                    And so the first great sporting endeavour of the weekend got under way, 16 Villagers and WAGAHOs splitting themselves into Giants and Dwarfs and making ready to compete for Sausage Cup 2008.
                    </p>
                    <p>              
                    Last year’s defending champion, Page, started poorly, opening the door for one-time-winner Rahilly, all-round-sporting-hero-and-generally-great-guy Marrow and WAG-representative Rainford to enter into the contest.
                    </p>
                    <p> 
                    And what a contest it was. Six ends of skittles later Rainford had a slender lead, Rahilly and Marrow were sniffing at her heels and Plimmer had passed out on the lawn, the cider having taken its toll on Saturday’s designated driver.
                    </p>
                    <p>
                    Rainford failed to close the deal – a disappointing five from her final throw giving hope to the chasing pack. And so to Rahilly, needing just seven skittles to regain his crown of 2006, he struck big and early – five down with his first ball. The scent of victory was in the air and Rahilly was looking hungry. His second though was poor, a dot ball, leaving him just one delivery and two pins for a near certain victory. A second dot ball on the bounce was not what the doctor ordered, Rahilly collapsing onto the track in anguish, spread-eagled and pounding his fists in dismay. Marrow’s fire by this stage seemed to have been doused by a healthy measure of cider and his final throw didn’t threaten a now triumphant Rainford: Sausage Cup Champion 2008.
                    </p>
                    </div>
                <a href=# >read more...</a>    
            </div>
            
            <div class="horizontalDivider"></div>
            <br /><b>About Us</b><br /><br />
            <p>
            The Village Cricket Club is a small club based loosely around its roots in North East London.
            We were formed in 2004 by a bunch of singularly talentless but enthusiastic cricketers who decided
            that they wanted to continue their summer passtime beyond the end of their university days.
            </p>
            <p>
            One bizarre meeting in Stamford Hill's Birdcage later and the Village CC was formed, and enrolled
            in the North East London Cricket League which sustained it for it's first few seasons.
            </p>
            <p>
            Since then, much has changed, the club has grown and left the league behind, perferring to follow
            it's instincts in the world of friendly London cricket.
            </p>
            <p>
            We tend to play our home games at the Albert Road Recreation ground near Bounds Green tube and are
            always on the lookout for new members of any ability - enthusiasm for the game is our only selection
            criteria. You can contact us via the "Join" link up above, or a few of us hang out in the "chat" section
            when work isn't keeping us too busy.
            </p>
        </form>
        </div>
        <!-- Footer -->
        <CC:Footer runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>
