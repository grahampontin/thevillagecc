using System.Diagnostics.CodeAnalysis;
using System.Linq;
using CricketClubDomain;
using CricketClubMiddle;
using CricketClubMiddle.Stats;

namespace api.model
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    [SuppressMessage("ReSharper", "FieldCanBeMadeReadOnly.Global")]
    [SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
    public class MatchReportV1
    {
        public MatchReportV1()
        {
        }

        public string Conditions { get; set; }
        public string Report { get; set; }
        public string Base64EncodedImage { get; set; }

        public MatchReportV1(string conditions, string report, string base64EncodedImage)
        {
            Conditions = conditions;
            Report = report;
            Base64EncodedImage = base64EncodedImage;
        }
    }
}