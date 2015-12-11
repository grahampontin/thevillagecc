<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PlayerProfileAJAX.aspx.cs" Inherits="PlayerProfileAJAX" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<script language=javascript>
    
</script>
<body>
    <form id="form1" runat="server">
    <div>
        <div class="col-sm-5">
            <div class=playerProfileImageLarge>
                <asp:Image ID=PlayerImage Width=220 Height=124 runat=server />
            </div>
            <div class="playerProfileStats">
                <div class=playerProfileStat>
                    <span>Full Name: </span><%=p.FullName %>
                </div>
                <div class=playerProfileStat>
                    <span>Born: </span><%=p.DOB %>
                </div>
                <div class=playerProfileStat>
                    <span>Current Age: </span>
                </div>
                <div class=playerProfileStat>
                    <span>Education: </span><%=p.Education %>
                </div>
                <div class=playerProfileStat>
                    <span>Nickname: </span><%=p.Nickname %>
                </div>
                <div class=playerProfileStat>
                    <span>Playing Role: </span><%=p.PlayingRole %>
                </div>
                <div class=playerProfileStat>
                    <span>Batting Style: </span><%=p.BattingStyle %>
                </div>
                <div class=playerProfileStat>
                    <span>Bowling Style: </span><%=p.BowlingStyle %>
                </div>
                <div class=playerProfileStat>
                    <span>Debut: </span><%=p.Debut.ToString("dd MMM yyyy") %>
                </div>
                <div class=playerProfileStat>
                    <span>Caps: </span><%=p.Caps %>
                </div>
            </div>
        </div>
        <div class="col-sm-7">
            <div class=bioTitle>
                Biography
            </div>
            <div  class=bioBody>
                <%=p.Bio %>
            </div>
        </div>
    </div>
    </form>
</body>
</html>
