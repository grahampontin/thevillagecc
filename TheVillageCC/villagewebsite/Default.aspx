<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Carousel" Src="~/UserControls/PictureCarousel.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <title>The Village CC</title>
    <CC:Styles runat=server ID=styles />
</head>
<body>
<div class="container">
    <!-- Head -->
    <CC:Header runat=server />
    <!-- End Head -->
    <main class="container">
        <form id="form1" runat="server">
            <div id="myCarousel" class="carousel slide d-none d-md-block" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" class="active" aria-current="true"
                            aria-label="Slide 1">
                    </button>
                    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="Images/newCarousel/slide2.jpg" class="img-fluid"/>

                        <div class="carousel-caption d-none d-md-block">
                            <h1>Friendly Cricket in and around London</h1>
                            <p>We play all over London and outside, check out our latest matches</p>
                            <p>
                                <a class="btn btn-lg btn-success" href="\Results.aspx">Results</a>
                            </p>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img src="Images/newCarousel/slide3.jpg" class="img-fluid"/>

                        <div class="carousel-caption d-none d-md-block">
                            <h1>Tours!</h1>
                            <p>The Village CC loves a spot of touring, check out some our recent trips.</p>
                            <p>
                                <a class="btn btn-lg btn-success" href="\Tours.html">Touring</a>
                            </p>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img src="Images/newCarousel/slide1.jpg" class="img-fluid"/>

                        <div class="carousel-caption d-none d-md-block">
                            <h1>We're Recruiting!</h1>
                            <p>Players of all abilities welcome.</p>
                            <p>
                                <a class="btn btn-lg btn-success" href="mailto:thevillagecc@gmail.com">Join Us!</a>
                            </p>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>

            <!-- Three columns of text below the carousel -->
            <div class="container marketing" style="padding-top: 20px">

                <!-- Three columns of text below the carousel -->
                <div class="row d-none d-lg-flex">
                    <div class="col-lg-4">
                        <img src="img/vcc_cricle_small.png" alt="About Us" width="140" height="140">
                        <h2>About us</h2>
                        <p>
                            The Village Cricket Club is a small club based loosely around its roots in North East London. We were
                            formed in 2004 by a bunch of singularly talentless but enthusiastic cricketers...
                        </p>
                        <p>
                            <a class="btn btn-default" href="Awards.aspx" role="button">View details &raquo;</a>
                        </p>
                    </div><!-- /.col-lg-4 -->
                    <div class="col-lg-4">
                        <span class="material-icons-round" style="font-size: 125px">
                            sports_cricket
                        </span>
                        <h2>Get involved</h2>
                        <p>
                            We're always on the lookout for new recruits of all abilities. Batsman, bowler, enthusiast, novice;
                            The Village welcomes all. If you're looking to get involved you can shoot us an email, fill in this
                            nice little form or even track us down on twitter.
                        </p>
                        <p>
                            <a class="btn btn-default" href="Join.aspx" role="button">View details &raquo;</a>
                        </p>
                    </div><!-- /.col-lg-4 -->
                    <div class="col-lg-4">
                        <span class="material-icons-round" style="font-size: 125px">
                            query_stats
                        </span>

                        <h2>Stats</h2>
                        <p>
                            Let's be honest, it's the only reason most of us play the game. The chance to slice, dice and disect
                            every inch of your game then talk about it at the pub. That's real cricket.
                        </p>
                        <p>
                            <a class="btn btn-default" href="/stats.aspx" role="button">View details &raquo;</a>
                        </p>
                    </div><!-- /.col-lg-4 -->
                </div><!-- /.row -->
                <!-- START THE FEATURETTES -->

                <hr class="featurette-divider d-none d-lg-block" style="margin-top: 1rem !important;">

                <div class="row featurette" style="margin-top: 2rem !important;">
                    <div class="col-md-7">
                        <h2 class="featurette-heading">
                            <asp:Literal runat="server" ID="matchReportOne_Heading"></asp:Literal>
                            <span class="text-muted">
                                <asp:Literal runat="server" ID="matchReportOne_SubText"></asp:Literal>
                            </span>
                        </h2>
                        <p class="lead">
                            <asp:Literal runat="server" ID="matchReportOne_Text"></asp:Literal>
                        </p>
                        <p>
                            <a class="btn btn-default" href='/MatchReport.aspx?MatchID=<asp:Literal runat="server" ID="matchReportOne_Id"></asp:Literal>' role="button">Read more &raquo;</a>
                        </p>

                    </div>
                    <div class="col-md-5">
                        <img class="featurette-image img-fluid mx-auto center-block" src="match_reports/images/no_match_report_image.jpg" alt="Generic placeholder image" runat="server" id="mathcReportOne_Image" width="500" height="500">
                    </div>
                </div>

                <hr class="featurette-divider">

                <div class="row featurette">
                    <div class="col-md-7 order-md-2">
                        <h2 class="featurette-heading">
                            <asp:Literal runat="server" ID="matchReportTwo_Heading"></asp:Literal>
                            <span class="text-muted">
                                <asp:Literal runat="server" ID="matchReportTwo_Subtext"></asp:Literal>
                            </span>
                        </h2>
                        <p class="lead">
                            <asp:Literal runat="server" ID="matchReportTwo_Text"></asp:Literal>
                        </p>
                        <p>
                            <a class="btn btn-default" href='/MatchReport.aspx?MatchID=<asp:Literal runat="server" ID="matchReportTwo_Id"></asp:Literal>' role="button">Read more &raquo;</a>
                        </p>
                    </div>
                    <div class="col-md-5 order-md-1">
                        <img class="featurette-image img-fluid mx-auto center-block" src="match_reports/images/no_match_report_image.jpg" alt="Generic placeholder image" runat="server" id="mathcReportTwo_Image" width="500" height="500">
                    </div>
                </div>

                <hr class="featurette-divider">

                <div class="row featurette">
                    <div class="col-md-7">
                        <h2 class="featurette-heading">
                            <asp:Literal runat="server" ID="matchReportThree_Heading"></asp:Literal>
                            <span class="text-muted">
                                <asp:Literal runat="server" ID="matchReportThree_Subtext"></asp:Literal>
                            </span>
                        </h2>
                        <p class="lead">
                            <asp:Literal runat="server" ID="matchReportThree_Text"></asp:Literal>
                        </p>
                        <p>
                            <a class="btn btn-default" href='/MatchReport.aspx?MatchID=<asp:Literal runat="server" ID="matchReportThree_Id"></asp:Literal>' role="button">Read more &raquo;</a>
                        </p>
                    </div>
                    <div class="col-md-5">
                        <img class="featurette-image img-fluid mx-auto center-block" src="match_reports/images/no_match_report_image.jpg" alt="Generic placeholder image" runat="server" id="mathcReportThree_Image" width="500" height="500">
                    </div>
                </div>

                <hr class="featurette-divider">

                <!-- /END THE FEATURETTES -->


                <!-- FOOTER -->
                <CC:Footer runat="server"/>
            </div>
        </form>
    </main>
</div>
</body>
</html>