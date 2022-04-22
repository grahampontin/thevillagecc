<%@ Control Language="C#" AutoEventWireup="true" CodeFile="Head.ascx.cs" Inherits="UserControls_Head" %>

    

<header>
        <nav class="navbar navbar-expand-lg navbar-dark fixed-top container" style="background-color: #2e8b57">
            <div class="container-fluid">
                <a class="navbar-brand" href="#" style="padding: 0">
                    <div style="    
                        padding: 0px;
                        border-radius: 25%;
                        display: inline-flex; ">
                        <img src="Images/logo_dark_transparent.png" height="50" ;/>
                    </div>
                    <div style="    display: inline-flex;
    color: darkslategray;
    vertical-align: top;
    padding-top: 8px;
font-family: 'Source Sans Pro', sans-serif;
font-weight: bolder; font-size: 25px">
                    </div>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                        aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a href="\Awards.aspx" class="nav-link text-white">
                                    <span class="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                                          style="text-align: center; font-size: 24px">
                                        info
                                    </span>
                                <div class="d-inline">
                                    About
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="\Fixtures.aspx" class="nav-link  text-white">
                                    <span class="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                                          style="text-align: center; font-size: 24px">
                                        calendar_month
                                    </span>
                                <div class="d-inline">
                                    Fixtures
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="\Results.aspx" class="nav-link  text-white">
                                    <span class="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                                          style="text-align: center; font-size: 24px">
                                        scoreboard
                                    </span>
                                <div class="d-inline">
                                    Results
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="\Stats.aspx" class="nav-link  text-white">
                                    <span class="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                                          style="text-align: center; font-size: 24px">
                                        bar_chart
                                    </span>
                                <div class="d-inline">
                                    Stats
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="\Players.aspx" class="nav-link  text-white">
                                    <span class="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                                          style="text-align: center; font-size: 24px">
                                        groups
                                    </span>
                                <div class="d-inline">
                                    Players
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="\Tours.html" class="nav-link  text-white">
                                    <span class="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                                          style="text-align: center; font-size: 24px">
                                        flight_takeoff
                                    </span>
                                <div class="d-inline">
                                    Tours
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="\f7/index.html" class="nav-link  text-white">
                                    <span class="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                                          style="text-align: center; font-size: 24px">
                                        settings
                                    </span>
                                <div class="d-inline">
                                    Admin
                                </div>
                            </a>
                        </li>
                    </ul>
                    <ul class="navbar-nav ms-lg-auto">
                        <li class="nav-item col-6 col-md-auto">
                                <a class="nav-link text-white" href="https://teamwear.nxt-sports.com/shop/the-village-cc" target="_blank"
                                   rel="noopener">
                                   <span class="fa-solid fa-basket-shopping bi d-inline d-lg-block mx-auto mb-1"
                                         style="text-align: center; font-size: 24px; vertical-align: text-bottom">
                                        </span>
                                    <div class="d-inline d-lg-none" style="margin-left: 18px">
                                        Club Shop
                                    </div>
                                </a>
                        </li>
                        <li class="nav-item col-6 col-md-auto">
                            <a class="nav-link text-white" href="https://twitter.com/villagecc" target="_blank"
                               rel="noopener">
                               <span class="fa-brands fa-twitter bi d-inline d-lg-block mx-auto mb-1"
                                     style="text-align: center; font-size: 24px; vertical-align: text-bottom">
                                    </span>
                                <div class="d-inline d-lg-none" style="margin-left: 18px">
                                    Twitter
                                </div>
                            </a>
                        </li>
                        <li class="nav-item col-6 col-md-auto">
                            <a class="nav-link text-white" href="https://www.instagram.com/thevillagecc_london/"
                               target="_blank" rel="noopener">
                               <span class="fa-brands fa-instagram bi d-inline d-lg-block mx-auto mb-1"
                                     style="text-align: center; font-size: 24px; vertical-align: text-bottom">
                                </span>
                                <div class="d-inline d-lg-none" style="margin-left: 20px">
                                    Instagram
                                </div>
                            </a>
                        </li>
                        <li class="nav-item col-6 col-md-auto">
                            <a class="nav-link text-white" href="mailto:thevillagecc@gmail.com" target="_blank"
                               rel="noopener">
                               <span class="material-icons-outlined bi d-inline d-lg-block mx-auto mb-1"
                                     style="text-align: center; font-size: 24px; vertical-align: text-bottom">
                                   email
                                    </span>
                                <div class="d-inline d-lg-none">
                                    Contact Us
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>