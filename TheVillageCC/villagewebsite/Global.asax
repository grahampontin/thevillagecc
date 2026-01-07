<%@ Application Language="C#" %>
<%@ Import Namespace="log4net" %>
<%@ Import Namespace="log4net.Appender" %>
<%@ Import Namespace="log4net.Config" %>
<%@ Import Namespace="log4net.Layout" %>

<script runat="server">

    void Application_Start(object sender, EventArgs e) 
    {
        // Code that runs on application startup
        var layout = new PatternLayout("%date %-5level %logger - %message%newline");
        layout.ActivateOptions();

        var console = new RollingFileAppender()
        {
            Layout = layout,
            AppendToFile = true,
            File = Server.MapPath("~/Logs/") + "villagewebsite.log",
            RollingStyle = RollingFileAppender.RollingMode.Date,
            DatePattern = "yyyy-MM-dd'.log'",
            StaticLogFileName = false,
            MaxSizeRollBackups = 10,
            MaximumFileSize = "10MB",
            LockingModel = new FileAppender.MinimalLock()
        
        };
        console.ActivateOptions();

        BasicConfigurator.Configure(console);
        // optional: set root level
        var repo = LogManager.GetRepository();
        ((log4net.Repository.Hierarchy.Hierarchy)repo).Root.Level = log4net.Core.Level.Info;

    }
    
    void Application_End(object sender, EventArgs e) 
    {
        //  Code that runs on application shutdown

    }
        
    void Application_Error(object sender, EventArgs e) 
    { 
        // Code that runs when an unhandled error occurs

    }

    void Session_Start(object sender, EventArgs e) 
    {
        // Code that runs when a new session is started

    }

    void Session_End(object sender, EventArgs e) 
    {
        // Code that runs when a session ends. 
        // Note: The Session_End event is raised only when the sessionstate mode
        // is set to InProc in the Web.config file. If session mode is set to StateServer 
        // or SQLServer, the event is not raised.

    }
       
</script>