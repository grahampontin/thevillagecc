using System;
using System.Web;

namespace TheVillageCC.Web
{
    public class Utils
    {
        public static Q ParseEnumOrThrow<T, Q>(String enumAsString, Func<T, Q> parsedAction ) where T : struct
        {
            if (Enum.TryParse<T>(enumAsString, true, out var award))
            {
                return parsedAction.Invoke(award);
            }
            else
            {
                var badRequestException = new HttpRequestValidationException("Enum value " + enumAsString + " is not recognised");
                throw badRequestException;
            }
        }
    }
}