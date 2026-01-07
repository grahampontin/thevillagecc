using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using TheVillageCC.Web.Domain;

namespace TheVillageCC.Web.HttpHandlers
{
    // ReSharper disable once UnusedType.Global
    public class CommitteeHandler : EntityHttpHandlerBase<CommitteePostV1>
    {
        protected override CommitteePostV1 UpdateEntity(CommitteePostV1 entity)
        {
            Database.UpdateCommittee(CommitteePostV1.ToInternal(entity));
            return entity;
        }

        protected override void DeleteEntity(int id)
        {
            Database.DeleteCommittee(id);
        }

        protected override CommitteePostV1 CreateEntity(CommitteePostV1 deserializeRequestBody)
        {
            var createdId = Database.CreateNewCommittee(CommitteePostV1.ToInternal(deserializeRequestBody));
            return CommitteePostV1.ToExternal(Database.GetCommitteeData(createdId));
        }

        protected override List<CommitteePostV1> GetAllEntities(NameValueCollection requestQueryString)
        {
            return Database.GetAllCommitteeData().Select(CommitteePostV1.ToExternal).ToList();
        }

        protected override CommitteePostV1 GetEntity(int id)
        {
            var committeeData = Database.GetCommitteeData(id);
            return committeeData == null ? null : CommitteePostV1.ToExternal(committeeData);
        }

        public override string GetTypeName()
        {
            return "committee";
        }
    }
}