<%@ WebHandler Language="C#" Class="ImageThumbnail" %>

using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Text.RegularExpressions;
using System.Web;

public class ImageThumbnail : IHttpHandler
{
    private Regex _nameValidationExpression = new Regex(@"[^\w/]");
    private int _thumbnailSize = 60;

    public void ProcessRequest(HttpContext context) {
        string photoName = context.Request.QueryString["p"];
        //if (_nameValidationExpression.IsMatch(photoName)) {
        //    throw new HttpException(404, "Invalid photo name.");
        //}
        string cachePath = Path.Combine(HttpRuntime.CodegenDir, photoName + ".square.png");
        if (File.Exists(cachePath)) {
            OutputCacheResponse(context, File.GetLastWriteTime(cachePath));
            context.Response.WriteFile(cachePath);
            return;
        }
        string photoPath = context.Server.MapPath(photoName);
        Bitmap photo;
        try {
            photo = new Bitmap(photoPath);
        }
        catch (ArgumentException) {
            throw new HttpException(404, "Photo not found.");
        }
        context.Response.ContentType = "image/png";
        int width, height;
        if (photo.Width > photo.Height) {
            width = _thumbnailSize * photo.Width / photo.Height;
            height = _thumbnailSize;
        }
        else {
            width = _thumbnailSize;
            height = _thumbnailSize * photo.Height / photo.Width;
        }
        Bitmap target = new Bitmap(_thumbnailSize, _thumbnailSize);
        using (Graphics graphics = Graphics.FromImage(target)) {
            graphics.CompositingQuality = CompositingQuality.HighSpeed;
            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphics.CompositingMode = CompositingMode.SourceCopy;
            graphics.DrawImage(photo, (_thumbnailSize - width) / 2, (_thumbnailSize - height) / 2, width, height);
            using (MemoryStream memoryStream = new MemoryStream()) {
                target.Save(memoryStream, ImageFormat.Png);
                //OutputCacheResponse(context, File.GetLastWriteTime(photoPath));
                //using (FileStream diskCacheStream = new FileStream("\\App_Data\\ImageCache" + cachePath, FileMode.CreateNew)) {
                //    memoryStream.WriteTo(diskCacheStream);
                //}
                memoryStream.WriteTo(context.Response.OutputStream);
            }
        }
    }

    private static void OutputCacheResponse(HttpContext context, DateTime lastModified) {
        HttpCachePolicy cachePolicy = context.Response.Cache;
        cachePolicy.SetCacheability(HttpCacheability.Public);
        cachePolicy.VaryByParams["p"] = true;
        cachePolicy.SetOmitVaryStar(true);
        cachePolicy.SetExpires(DateTime.Now + TimeSpan.FromDays(365));
        cachePolicy.SetValidUntilExpires(true);
        cachePolicy.SetLastModified(lastModified);
    }
 
    public bool IsReusable {
        get {
            return true;
        }
    }
}