<%
If Session("authenticated") = FALSE Then
	Response.Redirect "login.asp"
Else
	Response.Write "<!-- Validated at " & Now() & " -->"
End If
%>