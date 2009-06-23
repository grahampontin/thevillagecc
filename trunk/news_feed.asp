<?xml version="1.0"?>
<rss version="2.0">
<channel>

<title>Village News</title>
<description>News from your favourite Cricket Club</description>
<link>http://thevillagecc.org.uk</link>

<%
'Point at the database
		
		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection string

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb

		'### Create the ADO Connection object 

		Set Connection = Server.CreateObject("ADODB.Connection")
		Connection.Mode = 3
		Connection.Open ConnectionString
	
		'### Create a SQL query string

		strQuery = "select * from News order by item_date desc" 	
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS2 = Connection.Execute(strQuery)

counter = 0
While counter < 6
	counter = counter +1
	response.write "<item>"&vbcrlf
	response.write "<title><![CDATA["&RS2("short_headline")&"]]></title>"&vbcrlf
	response.write "<description><![CDATA["&RS2("teaser")&"]]></description>"&vbcrlf
	response.write "<link>http://thevillagecc.org.uk/news.asp</link>"&vbcrlf
	response.write "</item>"&vbcrlf
	RS2.movenext
Wend
'### Clean-up time
		RS2.Close 
		Connection.Close
		set RS2 = Nothing 
		set Connection = Nothing
%>



</channel>
</rss>




			
			
