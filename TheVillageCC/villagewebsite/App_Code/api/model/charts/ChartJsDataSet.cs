using System.Collections.Generic;

public class ChartJsDataSet
{
    public ChartJsDataSet()
    {
        data = new List<decimal>();
    }

    public string label { get; set; }
    public string type { get; set; }
    public List<decimal> data { get; set; }
}