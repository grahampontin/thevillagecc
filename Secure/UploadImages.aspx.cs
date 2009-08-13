using System;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.IO;
using Brettle.Web.NeatUpload;
using CricketClubMiddle;
using CricketClubMiddle.Interactive;

public class Secure_UploadImages : System.Web.UI.Page
{
    protected HtmlForm uploadForm;
		protected DropDownList progressBarLocationDropDown;
		protected DropDownList buttonTypeDropDown;
		protected MultiFile multiFile;
		protected MultiFile multiFile2;
		protected InputFile inputFile;
		protected InputFile inputFile2;
		protected HtmlGenericControl submitButtonSpan;
		protected Button submitButton;
		protected Button cancelButton;
		protected HtmlGenericControl commandButtonSpan;
		protected Button commandButton;
		protected Button cancelCommandButton;
		protected HtmlGenericControl linkButtonSpan;
		protected LinkButton linkButton;
		protected LinkButton cancelLinkButton;
		protected HtmlGenericControl htmlInputButtonButtonSpan;
		protected HtmlInputButton htmlInputButtonButton;
		protected HtmlInputButton cancelhtmlInputButtonButton;
		protected HtmlGenericControl htmlInputButtonSubmitSpan;
		protected HtmlInputButton htmlInputButtonSubmit;
		protected HtmlInputButton cancelhtmlInputButtonSubmit;
		protected HtmlGenericControl bodyPre;
		protected HtmlGenericControl inlineProgressBarDiv;
		protected HtmlGenericControl popupProgressBarDiv;
		protected ProgressBar progressBar;
		protected ProgressBar inlineProgressBar;
        protected Literal MatchText;
        protected Literal MatchIDLiteral;
        

        User LoggedOnUser;
        int MatchID = 0;

		protected override void OnInit(EventArgs e)
		{
			InitializeComponent();
			base.OnInit(e);
		}
		
		private void InitializeComponent()
		{
			this.Load += new System.EventHandler(this.Page_Load);
		}
		
		private void Page_Load(object sender, EventArgs e)
		{
            //This is bad, but we can't refer to the security control so it'll do.
            LoggedOnUser = CricketClubMiddle.Interactive.User.GetByName(Request.Cookies["vccUsername"].Value);
            string strMatchID = Request["MatchID"];
            int.TryParse(strMatchID, out MatchID);
            
            if (MatchID > 0)
            {
                Match thisMatch = new Match(MatchID);
                MatchText.Text = " vs " + thisMatch.Opposition.Name;
                MatchIDLiteral.Text = MatchID.ToString();
                submitButton.Click += new System.EventHandler(this.Button_Clicked);
            }
            else
            {
                uploadForm.InnerHtml = "No Match ID Presented";
            }
			
			
/*
			// Instead of setting the Triggers property of the 
			// ProgressBar element in the aspx file, you can put lines like
			// the following in your code-behind:
			progressBar.AddTrigger(submitButton);
			progressBar.AddTrigger(linkButton);
			progressBar.AddTrigger(commandButton);
			progressBar.AddTrigger(htmlInputButtonButton);
			progressBar.AddTrigger(htmlInputButtonSubmit);
			inlineProgressBar.AddTrigger(submitButton);
			inlineProgressBar.AddTrigger(linkButton);
			inlineProgressBar.AddTrigger(commandButton);
			inlineProgressBar.AddTrigger(htmlInputButtonButton);
			inlineProgressBar.AddTrigger(htmlInputButtonSubmit);

            // The temp directory used by the default FilesystemUploadStorageProvider can be configured on a
            // per-control basis like this (see documentation for details).  Note that if the temp directory
            // is within the application's directory hierarchy (except under App_Data) ASP.NET may restart
            // the application when NeatUpload writes the temp files to the directory.
            if (!IsPostBack)
            {
                inputFile.StorageConfig["tempDirectory"] = Path.Combine("App_Data", "file1temp");
                inputFile2.StorageConfig["tempDirectory"] = Path.Combine("App_Data", "file2temp");
                multiFile.StorageConfig["tempDirectory"] = Path.Combine("App_Data", "file1temp");
  				multiFile2.StorageConfig["tempDirectory"] = Path.Combine("App_Data", "file2temp");
            }
*/
        }

		private void Button_Clicked(object sender, EventArgs e)
		{
			if (!this.IsValid)
			{
				bodyPre.InnerText = "Page is not valid!";
				return;
			}

            string MatchReportImageBase = Server.MapPath("\\match_reports\\images\\");
            string TargetDirectory = MatchReportImageBase + MatchID + "\\";
            DirectoryInfo dir = new DirectoryInfo(TargetDirectory);
            if (!dir.Exists)
            {
                dir.Create();
            }
            string TempDirectory = TargetDirectory + LoggedOnUser.Name + "_upload\\";
            dir = new DirectoryInfo(TempDirectory);
            if (!dir.Exists)
            {
                dir.Create();
            }
            
			bodyPre.InnerText = "";
			if (multiFile.Files.Length > 0)
			{
				bodyPre.InnerText += "Processed " + multiFile.Files.Length + " images:\n"; 
				foreach (UploadedFile file in multiFile.Files)
				{
					if (file.ContentLength < 200000)
                    {
                        bodyPre.InnerText += file.FileName + " uploaded \n";
                        file.MoveTo(TempDirectory + file.FileName, MoveToOptions.Overwrite);
                    }
                    else
                    {
                        bodyPre.InnerText += file.FileName + " is too large (" + file.ContentLength / 1024 + "kb) - cannot upload (max = 200kb) \n";
                    }
				}
			}

			
		}

	}
