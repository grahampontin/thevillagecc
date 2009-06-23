<%@ LANGUAGE="VBSCRIPT" %>
<HTML>
<HEAD>
<META NAME="GENERATOR" Content="SAPIEN Technologies PrimalSCRIPT(TM)">
<META HTTP-EQUIV="Content-Type" content="text/html; charset=iso-8859-1">
<TITLE>Village Constitution</TITLE>
</HEAD>
<BODY>
<table width=100% height=100%><tr><TD colspan=2>
<IMG src=./documents/const00<%=request("page")%>.jpg>

</td></tr>
<tr><TD align=left>
<%If Request("page") <> 1 Then%>
<a href=./constitution.asp?page=<%=Request("page")-1%>>Previous Page</a>
<%End If%>
<TD align=right>
<%If Request("page") <> 4 Then%>
<a href=./constitution.asp?page=<%=Request("page")+1%>>Previous Page</a>
<%End If%>
</td></tr></table>
<!-- Insert HTML here -->



</BODY>
</HTML>
