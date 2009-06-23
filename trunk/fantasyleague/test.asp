<%@ LANGUAGE="VBSCRIPT" %>
<HTML>
<HEAD>
<!-- #INCLUDE FILE="./includes/ff_functions.asp" -->
<META NAME="GENERATOR" Content="SAPIEN Technologies PrimalSCRIPT(TM)">
<META HTTP-EQUIV="Content-Type" content="text/html; charset=iso-8859-1">
<TITLE>Document Title</TITLE>
</HEAD>
<BODY>

<% 
'Response.Write(strSQL)
	accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")
	'### Build a dsn-less connection String
	
	ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
	ConnectionString=ConnectionString & "DBQ=" & accessdb
	
	'### Create the ADO Connection object 
	Set Connection = Server.CreateObject("ADODB.Connection")
	Connection.Mode = 3
	Connection.Open ConnectionString
	response.Write("starting..")
	call valuePlayers()
    Call updateFFScores(cint(request("match_id")))

	Connection.close
	set Connection = Nothing
%>
</BODY>
</HTML>
