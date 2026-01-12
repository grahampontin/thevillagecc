using System.Diagnostics.CodeAnalysis;
using TheVillageCC.Web.AGGrid;

namespace TheVillageCC.Web.Domain
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    public class StatsDataV1
    {
        public string statsType { get; set; }
        public AGGridOptions gridOptions { get; set; }
    }
}