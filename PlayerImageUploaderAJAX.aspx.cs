using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using CricketClubMiddle;

public partial class PlayerImageUploaderAJAX : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        string imageName = Request["ImageName"];
        string path = "/Players/pictures/uploads/";
        int PlayerID = int.Parse(Request["PlayerID"]);

        if (Request["action"] == "uploadComplete")
        {
            

            Helpers.ResizeImage(Server.MapPath(path+imageName),Server.MapPath(path+imageName), 500, 400, false);

            tempImage.ImageUrl = path + imageName;

            step1.Visible = false;
            step2.Visible = true;

        }

        if (Request["action"] == "CropAndSave")
        {
            Player p = new Player(PlayerID);

            int x = (int)Convert.ToDecimal(Request["X"]);
            int y = (int)Convert.ToDecimal(Request["Y"]);
            int w = (int)Convert.ToDecimal(Request["W"]);
            int h = (int)Convert.ToDecimal(Request["H"]);

            //Load the Image from the location
            System.Drawing.Image image = Bitmap.FromFile(Server.MapPath(path+imageName));

            //Create a new image from the specified location to                
            //specified height and width                
            Bitmap bmp = new Bitmap(w, h, image.PixelFormat);
            Graphics g = Graphics.FromImage(bmp);
            g.DrawImage(image, new Rectangle(0, 0, w, h), new Rectangle(x, y, w, h), GraphicsUnit.Pixel);

            //Save the file and reload to the control
            bmp.Save(Server.MapPath("/Players/pictures/"+ p.Name.Replace(" ", "_").Replace(",","") + ".jpg"), image.RawFormat);
            Helpers.ResizeImage(Server.MapPath("/Players/pictures/" + p.Name.Replace(" ", "_").Replace(",", "") + ".jpg"), Server.MapPath("/Players/pictures/" + p.Name.Replace(" ", "_").Replace(",", "") + ".jpg"), 220, 126, true); 
        }
    }

    public static ImageCodecInfo GetImageCodec(string extension)
    {
        extension = extension.ToUpperInvariant();
        ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();
        foreach (ImageCodecInfo codec in codecs)
        {
            if (codec.FilenameExtension.Contains(extension))
            {
                return codec;
            }
        }
        return codecs[1];
    }
}