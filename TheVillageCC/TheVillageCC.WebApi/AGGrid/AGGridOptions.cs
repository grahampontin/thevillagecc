using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using TheVillageCC.WebApi.Domain;

namespace TheVillageCC.WebApi.AGGrid
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