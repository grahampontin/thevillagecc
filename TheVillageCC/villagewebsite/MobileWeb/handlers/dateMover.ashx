<%@ WebHandler Language="C#" Class="dateMover" %>

using System;
using System.Web;

public class dateMover : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "application/json";
        string submittedDate = context.Request["currentDate"];
        DateTime currentDate = DateTime.Parse(submittedDate);
        context.Response.Write("{");
        context.Response.Write("previousDate : '" + currentDate.AddDays(-1).ToString("dd/MM/yyyy") + "',");
        string nextDate = currentDate.AddDays(1).ToString("dd/MM/yyyy");
        if (currentDate == DateTime.Today)
        {
            nextDate = "0";
        }
        
        context.Response.Write("nextDate : '" + nextDate + "'");
        context.Response.Write("}");
        context.Response.End();
        
        
    }
 
    public bool IsReusable {
        get {
            return true;
        }
    }

}