public class ChartJsOptions
{
    public bool responsive { get; set; }

    public ChartJsPlugins plugins { get; set; }
    
    public ChartJsScales scales { get; set; }
}

public class ChartJsScales
{
    public ChartJsScale r { get; set; }
}

public class ChartJsScale
{
    public int min { get; set; }
}