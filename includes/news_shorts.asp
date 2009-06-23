<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>This is the news include</title>
</head>

<body>
<font color="#000000" size="2" face="arial">
<p align="center">
<b>News in Brief</b>
</p>
<p align="left">
<font color="#000000" size="2">
<%      accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection string

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb


		'### Create the ADO Connection object 

		Set include_Connection = Server.CreateObject("ADODB.Connection")
		include_Connection.Open ConnectionString
	

		'### Create a SQL query string

		strQuery = "SELECT * from News order by item_date desc"
	
		'### Execute the SQL query
	
		Set RS_news_short = include_Connection.Execute(strQuery)
		temp =0
		While temp < 4 and not rs_news_short.eof
			temp=temp+1
			response.write("<font face=arial size=2><b>"&RS_news_short("short_headline")&"</b><BR>"&RS_news_short("teaser")&"<BR><br></font>")

			RS_news_short.MoveNext

		Wend
		
		'### Clean-up time

		RS_news_short.Close 
		include_Connection.Close
		set RS_news_short = Nothing 
		set include_Connection = Nothing

%>
<div align=center valign=center><A href=http://thevillagecc.org.uk/news_feed.asp><IMG border=0 src=./images/feed-icon16x16.png></a><font size=1 face=arial>&nbspRSS!</font></div>
<script type="text/javascript"><!--
google_ad_client = "pub-1465960560056736";
google_ad_width = 110;
google_ad_height = 32;
google_ad_format = "110x32_as_rimg";
google_cpa_choice = "CAAQ463zzwEaCH20f7pPcGBpKLPGvnU";
google_ad_channel = "";
//--></script>
<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
<BR><BR>
<script type="text/javascript"><!--
google_ad_client = "pub-1465960560056736";
google_alternate_color = "FFFFFF";
google_ad_width = 120;
google_ad_height = 240;
google_ad_format = "120x240_as";
google_ad_type = "text_image";
google_ad_channel = "";
google_color_border = "FFFFFF";
google_color_bg = "FFFFFF";
google_color_link = "CC3333";
google_color_text = "000000";
google_color_url = "FFCC33";
//--></script>
<script type="text/javascript"
  src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>

</body>

</html>
