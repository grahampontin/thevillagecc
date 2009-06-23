<%@ Language=VBScript %>
 
<html>
<head>
 
<title>Village CC | Admin | Query Screen</title>
</head>
<body>
<% 
'set a high timeout for long queries
 server.scripttimeout=100000000
    dim sql
     sql=Request.form("query") 
      
     Call showForm()        
     'store the query in a cookie (useful if using the same query on multiple occasions)
     If sql<>"" then
        Response.Cookies ("query")("query_screen") = sql
        Response.Cookies ("query").Expires = DATE + 365
        Call ShowStructure()
     End If  %>
<p> </p>

</body>
</html>
<%    
    Sub ShowStructure()
          dim objConn,objRs
        dim fld,totrec
        set objConn=server.CreateObject("ADODB.Connection")
        set objRs=server.CreateObject("ADODB.Recordset")
        
        'edit this line with your odbc connection details (can be access or SQL server)
   		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection String

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb

		'### Create the ADO Connection object 

		objConn.Mode = 3
        objConn.Open ConnectionString
     
     If Request("password") = "jsx833njsx833n" Then
        
        If lcase(left(trim(sql),6))<>"select" then
          objConn.Execute sql,totrec
          'show the number of records altered by any update or insert
          Response.Write totrec & " records are affected!"
          exit sub
        End If
        set objRs=objConn.Execute(sql)
        If err.number=0 then  
             
            Response.Write "<table width=90% align=center><tr bgcolor=#000000 cellspacing=2>"
            for each fld in objRs.Fields
                 Response.Write "<td><font color=#ffffff><b>" & trim(fld.name) & "</b></font></td>"
            next 
            Response.Write "</tr>"
                 
                    While not objRs.EOF 
                        Response.Write "<tr>"
                        for each fld in objRs.Fields
                             Response.Write "<td>" & fld.value & "</td>"
                        next 
                        Response.Write "</tr>"
                        objRs.Movenext       
                    Wend
                 
                Response.Write "<tr bgcolor=#000000><td height=5 colspan=" & objRs.Fields.Count & " </td></tr>"
                Response.Write "</table>"    
        Else
           
             Exit sub
        End If 
        
        End if
        
     End Sub 


Sub ShowForm() %>
       <form METHOD="POST" action="sql_admin.asp" id="form1" name="form1">
       <b> </b> 
       <textarea name="query" rows="6" cols="80"><%

if request.form("query")="" then
    Response.Write Request.Cookies("query")("query_screen")
else
    response.write request.form("query")
end if
%></textarea>

	   Password: <input type="password" name="password">   
       <input type="submit" value="GetData" id="submit1" name="submit1">
      </form>    
<%      
End Sub %>


