<%@ Control Language="C#" AutoEventWireup="true" CodeFile="PictureCarousel.ascx.cs" Inherits="UserControls_PictureCarousel" %>
<%@ Import Namespace="System.ComponentModel" %>
<div id="myCarousel" class="carousel slide" data-ride="carousel">
  <!-- Indicators -->
  <ol  id="carousel-indicators" class="carousel-indicators">
  </ol>

  <!-- Wrapper for slides -->
  <div class="carousel-inner" role="listbox">
    <asp:ListView ID="Pictures" runat="server">
           <LayoutTemplate>
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
            <div class="item">
               <img src="\Images\Carousel\<%# Eval("Name")%>" />
            </div>
           </ItemTemplate>
        </asp:ListView> 
   </div>

  <!-- Left and right controls -->
  <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
