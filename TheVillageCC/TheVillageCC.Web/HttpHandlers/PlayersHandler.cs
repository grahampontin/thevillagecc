using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using CricketClubMiddle;
using TheVillageCC.Web.Domain;

namespace TheVillageCC.Web.HttpHandlers
{
    // ReSharper disable once UnusedType.Global
    public class PlayersHandler : EntityHttpHandlerBase<PlayerV1>
    {
        protected override PlayerV1 UpdateEntity(PlayerV1 entity)
        {
            throw new System.NotImplementedException();
        }

        protected override void DeleteEntity(int id)
        {
            throw new System.NotImplementedException();
        }

        protected override PlayerV1 CreateEntity(PlayerV1 deserializeRequestBody)
        {
            throw new System.NotImplementedException();
        }

        protected override List<PlayerV1> GetAllEntities(NameValueCollection requestQueryString)
        {
            var inactiveQueryParam = requestQueryString.GetValues("includeInactive");
            var includeInactive = inactiveQueryParam != null && inactiveQueryParam.Length > 0 &&
                                  inactiveQueryParam[0] == "true";

            return Player.GetAll(true).Where(p => (p.IsActive || includeInactive) && p.Id > 0)
                .OrderByDescending(p => p.NumberOfMatchesPlayedThisSeason)
                .ThenBy(p => !p.IsActive)
                .ThenBy(p => p.Surname)
                .Select(PlayerV1.FromInternal).ToList();
        }

        protected override PlayerV1 GetEntity(int id)
        {
            throw new System.NotImplementedException();
        }

        public override string GetTypeName()
        {
            return "players";
        }
    }
}