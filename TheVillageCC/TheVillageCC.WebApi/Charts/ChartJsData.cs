using System.Collections.Generic;

namespace TheVillageCC.WebApi.Charts
{
    public class ChartJsData
    {
        public List<ChartJsDataSet> datasets { get; set; }
        public List<string> labels { get; set; }
    }
}