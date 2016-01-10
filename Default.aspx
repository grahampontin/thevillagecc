<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Default.aspx.cs" Inherits="_Default" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Carousel" Src="~/UserControls/PictureCarousel.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>The Village Cricket Club Online | Home</title>
    <CC:Styles runat=server ID=styles /> 
    <script>
        $(function() {
            $(".item").each(function(object, index) {
                $("#carousel-indicators").append("<li data-target=\"#myCarousel\" data-slide-to=\""+object+"\"></li>");
            });
            $(".item").first().addClass("active");
        });
    </script>
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
            <div class="container marketing">

      <!-- Three columns of text below the carousel -->
      <div class="row">
        <div class="col-lg-4">
          <img src="img/vcc_cricle_small.png" alt="About Us" width="140" height="140">
          <h2>About us</h2>
          <p>The Village Cricket Club is a small club based loosely around its roots in North East London. We were formed in 2004 by a bunch of singularly talentless but enthusiastic cricketers...</p>
          <p><a class="btn btn-default" href="Awards.aspx" role="button">View details &raquo;</a></p>
        </div><!-- /.col-lg-4 -->
        <div class="col-lg-4">
          <img src="img/cricketer.png" alt="Join" width="140" height="140">
          <h2>Get involved</h2>
          <p>We're always on the lookout for new recruits of all abilities. Batsman, bowler, enthusiast, novice; The Village welcomes all. If you're looking to get involved you can shoot us an email, fill in this nice little form or even track us down on twitter.</p>
          <p><a class="btn btn-default" href="Join.aspx" role="button">View details &raquo;</a></p>
        </div><!-- /.col-lg-4 -->
        <div class="col-lg-4">
          <img src="img/graph.png" alt="Stats" width="140" height="140">
          <h2>Stats</h2>
          <p>Let's be honest, it's the only reason most of us play the game. The chance to slice, dice and disect every inch of your game then talk about it at the pub. That's real cricket.</p>
          <p><a class="btn btn-default" href="/stats.aspx" role="button">View details &raquo;</a></p>
        </div><!-- /.col-lg-4 -->
      </div><!-- /.row -->


      <!-- START THE FEATURETTES -->

      <hr class="featurette-divider">

      <div class="row featurette">
        <div class="col-md-7">
          <h2 class="featurette-heading"><asp:Literal runat="server" ID="matchReportOne_Heading"></asp:Literal><span class="text-muted"><asp:Literal runat="server" ID="matchReportOne_SubText"></asp:Literal></span></h2>
          <p class="lead"><asp:Literal runat="server" ID="matchReportOne_Text"></asp:Literal></p>
          <p><a class="btn btn-default" href='/MatchReport.aspx?MatchID=<asp:Literal runat="server" ID="matchReportOne_Id"></asp:Literal>' role="button">Read more &raquo;</a></p>
        
        </div>
        <div class="col-md-5">
          <img class="featurette-image img-responsive center-block" src="match_reports/images/no_match_report_image.jpg" alt="Generic placeholder image">
        </div>
      </div>

      <hr class="featurette-divider">

      <div class="row featurette">
        <div class="col-md-7 col-md-push-5">
            <h2 class="featurette-heading"><asp:Literal runat="server" ID="matchReportTwo_Heading"></asp:Literal><span class="text-muted"><asp:Literal runat="server" ID="matchReportTwo_Subtext"></asp:Literal></span></h2>
            <p class="lead"><asp:Literal runat="server" ID="matchReportTwo_Text"></asp:Literal></p>
            <p><a class="btn btn-default" href='/MatchReport.aspx?MatchID=<asp:Literal runat="server" ID="matchReportTwo_Id"></asp:Literal>' role="button">Read more &raquo;</a></p>
        </div>
        <div class="col-md-5 col-md-pull-7">
          <img class="featurette-image img-responsive center-block" src="match_reports/images/no_match_report_image.jpg" alt="Generic placeholder image">
        </div>
      </div>

      <hr class="featurette-divider">

      <div class="row featurette">
        <div class="col-md-7">
            <h2 class="featurette-heading"><asp:Literal runat="server" ID="matchReportThree_Heading"></asp:Literal><span class="text-muted"><asp:Literal runat="server" ID="matchReportThree_Subtext"></asp:Literal></span></h2>
            <p class="lead"><asp:Literal runat="server" ID="matchReportThree_Text"></asp:Literal></p>
            <p><a class="btn btn-default" href='/MatchReport.aspx?MatchID=<asp:Literal runat="server" ID="matchReportThree_Id"></asp:Literal>' role="button">Read more &raquo;</a></p>
        </div>
        <div class="col-md-5">
          <img class="featurette-image img-responsive center-block" src="match_reports/images/no_match_report_image.jpg" alt="Generic placeholder image">
        </div>
      </div>

      <hr class="featurette-divider">

      <!-- /END THE FEATURETTES -->


      <!-- FOOTER -->
    <CC:Footer runat="server" />
    </div>
        </form>
        </div>
    </div>
</body>
</html>
