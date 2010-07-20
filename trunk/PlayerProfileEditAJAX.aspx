<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PlayerProfileEditAJAX.aspx.cs" Inherits="PlayerProfileEditAJAX" ValidateRequest="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<script language=javascript>
    

</script>

<body>
    <form id="form1">
    <div>
         <div class=leftColumn>
            <div class=playerProfileImageLarge>
                <asp:Image ID=PlayerImage Width=220 Height=124 runat=server />
            </div>
            <div class=ImageOverlay>
                Click to Upload New Photo
            </div>
            <div class="playerProfileStats">
                <div class=playerProfileStat>
                    <span>Full Name: </span><input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" value="<%=p.FullName %>" />
                </div>
                <div class=playerProfileStat>
                    <span>Born: </span><input type="text" name="dob" id="dob" class="datepicker text ui-widget-content ui-corner-all" value="<%=p.DOB %>" />
                </div>
               
                <div class=playerProfileStat>
                    <span>Education: </span><input type="text" name="education" id="education" class="text ui-widget-content ui-corner-all" value="<%=p.Education %>" />
                </div>
                <div class=playerProfileStat>
                    <span>Nickname: </span><input type="text" name="nickname" id="nickname" class="text ui-widget-content ui-corner-all" value="<%=p.Nickname %>" />
                </div>
                <div class=playerProfileStat>
                    <span>Playing Role: </span>
                        <select name="role" id="role" class="text ui-widget-content ui-corner-all" value="<%=p.PlayingRole %>">
                            <option value=1>
                                Batsman
                            </option>
                            <option value=2>
                                Bowler
                            </option>
                            <option value=3>
                                Opening Batsman
                            </option>
                            <option value=4>
                                Wicket-Keeper Batsman
                            </option>
                            <option value=5>
                                All-Rounder
                            </option>
                        </select>
                </div>
                <div class=playerProfileStat>
                    <span>Batting Style: </span><input type="text" name="battingstyle" id="battingstyle" class="text ui-widget-content ui-corner-all" value="<%=p.BattingStyle %>" />
                </div>
                <div class=playerProfileStat>
                    <span>Bowling Style: </span><input type="text" name="bowlingstyle" id="bowlingstyle" class="text ui-widget-content ui-corner-all" value="<%=p.BowlingStyle %>" />
                </div>
                
            </div>
        </div>
        <div class=rightColumn>
            <div class=bioTitle>
                Biography
            </div>
            <div  class=bioBody>
               <textarea style="width: 402px; height: 300px" id="bioInput" >
                <%=p.Bio %>
               </textarea>

            </div>
            <div class=playerEditButtons>
                <button id=cancelButton name=Cancel value=Cancel>
                    <span class="ui-button-text">Cancel</span>
                </button>
                <button id=saveButton name=s value=s>
                    <span class="ui-button-text">Save</span>
                </button>
                

            </div>
        </div>
    </div>
    </form>
</body>
</html>
