<%@ language="VBSCRIPT" %>

<!--#include virtual="./includes/functions.asp"-->
<chart>

<%'Point at the database
		
		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")
		
		'### Build a dsn-less connection String
		
		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb
		
		'### Create the ADO Connection object 
		
		Set Connection = Server.CreateObject("ADODB.Connection")
		Connection.Mode = 3
		Connection.Open ConnectionString
		
'runs scored graph

If Request("graph_type")="runs_scored" Then
player_id = Request("pm_id")
%> 
 <chart_data>
  <row>
   <null/>
   <string>Runs</string>
   <string>Fours</string>
   <string>Sixes</string>
  </row>
  <row>
   <string></string>
   <number><%=getPlayerAttribute("runs", "1 January 2000","1 January 2100", player_id, "all")%></number>
   <number><%=getPlayerAttribute("4s", "1 January 2000","1 January 2100", player_id, "all")*4%></number>
   <number><%=getPlayerAttribute("6s", "1 January 2000","1 January 2100", player_id, "all")*6%></number>
  </row>
 </chart_data>
 <chart_grid_h thickness='0' />
 <chart_pref rotation_x='60' />
 <chart_rect x='40' y='50' width='300' height='150' positive_alpha='0' />
 <chart_transition type='drop' delay='.5' duration='0.75' order='category' />
 <chart_type>pie</chart_type>
 <chart_value color='000000' alpha='65' font='arial' bold='true' size='10' position='inside' prefix='' suffix='' decimals='0' separator='' as_percentage='true' />
 
 <draw>
  <text color='000000' alpha='' size='20' x='-10' y='0' width='300' height='50' h_align='center' v_align='middle'>Batting | Runs Scored</text>
 </draw>
 
 <legend_label layout='horizontal' bullet='circle' font='arial' bold='true' size='12' color='000000' alpha='85' />
 <legend_rect x='0' y='50' width='30' height='150' margin='10' fill_color='ffffff' fill_alpha='10' line_color='000000' line_alpha='0' line_thickness='0' />
 <legend_transition type='dissolve' delay='0' duration='1' />
 
 <series_color>
  <color>dddddd</color>
  <color>ffaa00</color>
  <color>cc4400</color>
  <color>66dd66</color>
 </series_color>
 <series_explode>
  <number>0</number>
  <number>0</number>
  <number>0</number>
  <number>0</number>
 </series_explode>
 
<%End If
If Request("graph_type")="how_out" Then
player_id = Request("pm_id")
strQuery = "SELECT dismissal, count(*) as outs  from batting_scorecards a, how_out b where player_id = "&player_id&" and a.dismissal_id=b.dismissal_id and a.dismissal_id <> 7 group by dismissal"	
		
'### Execute the SQL query
Set objRS = Connection.Execute(strQuery)
%> 
 <chart_data>
  <row>
   <null/>
<%While Not objRS.eof%>
   <string><%=objRS("dismissal")%></string>
<%objRS.movenext
  Wend%>
   </row>
  <row>
   <string></string>
<%Set objRS = Connection.Execute(strQuery)
  While Not objRS.eof%>
   <number><%=objRS("outs")%></number>
<%objRS.movenext
  Wend%>
  </row>
 </chart_data>
 <chart_grid_h thickness='0' />
 <chart_pref rotation_x='60' />
 <chart_rect x='40' y='50' width='300' height='150' positive_alpha='0' />
 <chart_transition type='drop' delay='.5' duration='0.75' order='category' />
 <chart_type>pie</chart_type>
 <chart_value color='000000' alpha='65' font='arial' bold='true' size='10' position='inside' prefix='' suffix='' decimals='0' separator='' as_percentage='true' />
 
 <draw>
  <text color='000000' alpha='' size='20' x='-10' y='0' width='300' height='50' h_align='center' v_align='middle'>Batting | Dismissals</text>
 </draw>
 
 <legend_label layout='horizontal' bullet='circle' font='arial' bold='true' size='12' color='000000' alpha='85' />
 <legend_rect x='0' y='50' width='30' height='150' margin='10' fill_color='ffffff' fill_alpha='10' line_color='000000' line_alpha='0' line_thickness='0' />
 <legend_transition type='dissolve' delay='0' duration='1' />
 
 <series_color>
  <color>dddddd</color>
  <color>ffaa00</color>
  <color>cc4400</color>
  <color>66dd66</color>
 </series_color>
 <series_explode>
  <number>0</number>
  <number>0</number>
  <number>0</number>
  <number>0</number>
 </series_explode>
 
<%End If
If Request("graph_type")="wickets_taken" Then
player_id = Request("pm_id")
strQuery = "SELECT dismissal, count(*) as wickets  from bowling_scorecards a, how_out b where bowler_id = "&player_id&" and a.dismissal_id=b.dismissal_id group by dismissal"
				
'### Execute the SQL query
Set objRS = Connection.Execute(strQuery)
%> 
 <chart_data>
  <row>
   <null/>
<%While Not objRS.eof%>
   <string><%=objRS("dismissal")%></string>
<%objRS.movenext
  Wend%>
   </row>
  <row>
   <string></string>
<%Set objRS = Connection.Execute(strQuery)
  While Not objRS.eof%>
   <number><%=objRS("wickets")%></number>
<%objRS.movenext
  Wend%>
  </row>
 </chart_data>
 <chart_grid_h thickness='0' />
 <chart_pref rotation_x='60' />
 <chart_rect x='40' y='50' width='300' height='150' positive_alpha='0' />
 <chart_transition type='drop' delay='.5' duration='0.75' order='category' />
 <chart_type>pie</chart_type>
 <chart_value color='000000' alpha='65' font='arial' bold='true' size='10' position='inside' prefix='' suffix='' decimals='0' separator='' as_percentage='true' />
 
 <draw>
  <text color='000000' alpha='' size='20' x='-10' y='0' width='300' height='50' h_align='center' v_align='middle'>Bowling | Wickets Taken</text>
 </draw>
 
 <legend_label layout='horizontal' bullet='circle' font='arial' bold='true' size='12' color='000000' alpha='85' />
 <legend_rect x='0' y='50' width='30' height='150' margin='10' fill_color='ffffff' fill_alpha='10' line_color='000000' line_alpha='0' line_thickness='0' />
 <legend_transition type='dissolve' delay='0' duration='1' />
 
 <series_color>
  <color>dddddd</color>
  <color>ffaa00</color>
  <color>cc4400</color>
  <color>66dd66</color>
 </series_color>
 <series_explode>
  <number>0</number>
  <number>0</number>
  <number>0</number>
  <number>0</number>
 </series_explode>
 
<%End If%>
</chart>
