using System.Diagnostics.CodeAnalysis;

namespace TheVillageCC.Web.Domain
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "NotAccessedField.Global")]
    public class FoWPlayerV1
    {
        public int id;
        public string name;
        public int battingAt;
        public int score;
    }
}