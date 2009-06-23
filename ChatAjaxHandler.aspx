<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ChatAjaxHandler.aspx.cs" Inherits="ChatAjaxHandler" ValidateRequest="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


        <asp:ListView ID="commentsView" runat="server">
           <LayoutTemplate>
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <li class="fadeIn ChatItem">
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
