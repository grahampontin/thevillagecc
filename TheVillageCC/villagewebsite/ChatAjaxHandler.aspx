﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ChatAjaxHandler.aspx.cs" Inherits="ChatAjaxHandler" ValidateRequest="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <div style="display: none">
        <lastID><asp:Literal id=lastID runat=server></asp:Literal> </lastID>
        </div>
        <asp:ListView ID="commentsView" runat="server">
           <LayoutTemplate>
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <li class="fadeIn ChatItem" data-theme="c">
                <div>
                    <div class=ChatLeftPanel>
                        <div class="ChatPhoto">
                            <img class="CheckSize" src="<%#Eval("ImageUrl") %>" Width="150px"  alt="<%#Eval("Name") %>" />
                        </div>
                        <div class="ChatName">
                            <%#Eval("Name") %>
                        </div>
                        <div class="ChatName smallText">
                            at <%#Eval("Date") %>
                        </div>
                    </div>
                    <div class="ChatInputBox">
                        <%#Eval("Comment") %>
                    </div>
                
                </div>
                <div class="horizontalDivider"></div>
              
              </li>
           </ItemTemplate>
        </asp:ListView>  

        <asp:ListView ID="commentsMobileView" runat="server" Visible="false">
           <LayoutTemplate>
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <li class="fadeIn ChatItem" data-theme="c">
                <div>
                    <div class="ChatComment">
                        <%#Eval("Comment") %>
                    </div>
                    <div class="ChatNameDate">
                        <%#Eval("Name") %>
                        <span class="ChatDate">
                             <%#Eval("Date") %>
                        </span>
                    </div>
                
                </div>
                <div class="horizontalDivider"></div>
              
              </li>
           </ItemTemplate>
        </asp:ListView>  
