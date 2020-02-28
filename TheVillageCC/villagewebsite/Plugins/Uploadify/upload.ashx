<%@ WebHandler Language="C#" Class="upload" Debug="true" %>

using System;
using System.Web;
using System.IO;
using System.Diagnostics;

public class upload : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";

        context.Response.Expires = -1;

        try
        {
            HttpPostedFile postedFile = context.Request.Files["Filedata"];



            string savepath = "";

            string tempPath = "";

            tempPath = context.Request["folder"];

            savepath = context.Server.MapPath(tempPath);

            string filename = postedFile.FileName;

            if (!Directory.Exists(savepath))

                Directory.CreateDirectory(savepath);



            postedFile.SaveAs(savepath + @"\" + filename);

            context.Response.Write(tempPath + "/" + filename);

            context.Response.StatusCode = 200;

        }

        catch (Exception ex)
        {

            context.Response.Write("Error: " + ex.Message);

        } 

    }


   public bool IsReusable
   {
      get { return false;   }
   }


}