<%@ Control Language="C#" AutoEventWireup="true" CodeFile="PictureCarousel.ascx.cs" Inherits="UserControls_PictureCarousel" %>

    <ul id="rotateThis"> 
        <asp:ListView ID="Pictures" runat="server">
           <LayoutTemplate>
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <li><img src="\Images\Carousel\<%# Eval("Name")%>" width="460px"/></li>
           </ItemTemplate>
        </asp:ListView> 
        <li>
	        <a href="http://medienfreunde.com/deutsch/referenzen/kreation/good_guy__bad_guy.html">
		        <img src="./Images/Carousel/Cricket 118.jpg" alt="Good Guy bad Guy" width="460px"/>
	        </a>
        </li>
        <li>
	        <a href="http://medienfreunde.com/deutsch/referenzen/kreation/whizzkids.html">
		        <img src="./Images/Carousel/Cricket 096.jpg" alt="Cricket" width="460px"/>
	        </a>
        </li> 
        <li>
	        <a href="http://medienfreunde.com/deutsch/referenzen/kreation/whizzkids.html">
		        <img src="./Images/Carousel/Cricket 125.jpg" alt="Cricket" width="460px" />
	        </a>
        </li> 
    </ul>
