using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using CricketClubDAL;
using CricketClubMiddle;
using TheVillageCC.Web.Domain;

namespace TheVillageCC.Web.HttpHandlers
{
    // ReSharper disable once UnusedType.Global
    public class TeamsHandler : EntityHttpHandlerBase<TeamV1>
    {
        public TeamsHandler() : base()
        {
        }

        public TeamsHandler(IDao database) : base(database)
        {
        }

        protected override TeamV1 UpdateEntity(TeamV1 entity)
        {
            var team = new Team(entity.Id, Database) { Name = entity.Name };
            team.Save();
            return entity;
        }

        protected override void DeleteEntity(int id)
        {
            throw new System.NotImplementedException();
        }

        protected override TeamV1 CreateEntity(TeamV1 deserializeRequestBody)
        {
            var teamId = Team.CreateNewTeam(deserializeRequestBody.Name, Database);
            return TeamV1.FromInternal(new Team(teamId, Database));
        }

        protected override List<TeamV1> GetAllEntities(NameValueCollection requestQueryString)
        {
            return Team.GetAll(Database).Where(t => !t.IsUs)
                .Select(TeamV1.FromInternal).OrderBy(t => t.Name).ToList();
        }

        protected override TeamV1 GetEntity(int id)
        {
            var team = new Team(id, Database);
            return TeamV1.FromInternal(team);
        }

        public override string GetTypeName()
        {
            return "teams";
        }
    }
}
