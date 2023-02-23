public class ChartJsOptions
{
    public bool responsive { get; set; }

    public ChartJsPlugins plugins { get; set; }
}

public class ChartJsTitleOptions
{
    public bool display { get; set; }
    public string text { get; set; }
    
}

public class ChartJsPlugins
{
    public ChartJsTitleOptions title { get; set; }
    public ChartJsLegendOptions title { get; set; }
}

public class ChartJsLegendOptions
{
    
}