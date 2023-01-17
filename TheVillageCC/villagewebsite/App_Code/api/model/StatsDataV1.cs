using System.Diagnostics.CodeAnalysis;

namespace api.model
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