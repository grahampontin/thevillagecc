using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using TheVillageCC.Web.Domain;

namespace TheVillageCC.Web.AGGrid
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]


    public class AGGridOptions
    {
        public List<StatsColumnDefinitionV1> columnDefs { get; set; }
        public List<object> rowData { get; set; }
        
        public object footerRow { get; set; }
    }
}