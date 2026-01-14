using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using CricketClubDAL;
using CricketClubDomain;
using TheVillageCC.Web.Domain;

namespace TheVillageCC.Web.HttpHandlers
{
    // ReSharper disable once UnusedType.Global
    public class AwardsHandler : EntityHttpHandlerBase<AwardV1>
    {
        public AwardsHandler() : base()
        {
        }

        public AwardsHandler(IDao database) : base(database)
        {
        }

        protected override AwardV1 UpdateEntity(AwardV1 entity)
        {
            database.UpdateAward(AwardV1.ToInternal(entity));
            return entity;
        }

        protected override void DeleteEntity(int id)
        {
            database.DeleteAward(id);
        }

        protected override AwardV1 CreateEntity(AwardV1 deserializeRequestBody)
        {
            var createdId = Utils.ParseEnumOrThrow<Award, int>(deserializeRequestBody.Award,
                parsed => database.CreateNewAward(
                    parsed,
                    deserializeRequestBody.Year,
                    deserializeRequestBody.PlayerId,
                    deserializeRequestBody.Data
                ));
            
            return AwardV1.FromInternal(database.GetAwardData(createdId));
        }

        protected override List<AwardV1> GetAllEntities(NameValueCollection requestQueryString)
        {
            var season = requestQueryString["season"];
            var allEntities = database.GetAllAwardsData().Select(AwardV1.FromInternal).ToList();
            if (season != null && int.TryParse(season, out var seasonAsInt))
            {
                allEntities = allEntities.Where(a => a.Year == seasonAsInt).ToList();
            }

            return allEntities;
        }

        protected override AwardV1 GetEntity(int id)
        {
            var awardData = database.GetAwardData(id);
            return awardData == null ? null : AwardV1.FromInternal(awardData);
        }


        public override string GetTypeName()
        {
            return "awards";
        }
    }
}