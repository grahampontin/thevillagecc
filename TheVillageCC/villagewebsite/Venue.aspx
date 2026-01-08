<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Venue.aspx.cs" Inherits="Venue" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html>

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>The Village Cricket Club Online | Venue | <%= VenueName %></title>
    <CC:Styles runat="server" ID="styles"></CC:Styles>
</head>
<body>
<div class="">
<!-- Head -->
<CC:Header ID="Header1" runat="server"></CC:Header>
<!-- End Head -->

<main class="container">
    <div class="card mt-3">
        <div class="card-body">
            <h5 class="card-title"><%= VenueName %></h5>
            
            <div class="row mt-3">
                <div class="col-md-6">
                    <h6>Venue Details</h6>
                    <% if (!string.IsNullOrEmpty(VenueDescription)) { %>
                    <div class="mb-3">
                        <strong>Description:</strong>
                        <p><%= VenueDescription %></p>
                    </div>
                    <% } %>
                    
                    <% if (VenueLatitude.HasValue && VenueLongitude.HasValue) { %>
                    <div class="mb-3">
                        <strong>Location:</strong>
                        <p>Latitude: <%= VenueLatitude.Value.ToString("F6") %>, Longitude: <%= VenueLongitude.Value.ToString("F6") %></p>
                    </div>
                    <% } %>
                </div>
                
                <% if (!string.IsNullOrEmpty(VenueMapUrl)) { %>
                <div class="col-md-6">
                    <h6>Map</h6>
                    <div class="ratio ratio-16x9">
                        <iframe src="<%= VenueMapUrl %>" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
                <% } %>
            </div>
        </div>
    </div>
</main>

<!-- Footer -->
<CC:Footer ID="Footer1" runat="server"/>
<!-- End Footer -->
</div>
</body>
</html>
