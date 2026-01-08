using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using CricketClubMiddle;

namespace TheVillageCC.Web.HttpHandlers
{
    // ReSharper disable once UnusedType.Global
    public class VenueHandler : EntityHttpHandlerBase<VenueV1>
    {
        protected override VenueV1 UpdateEntity(VenueV1 entity)
        {
            var venue = new Venue(entity.Id)
            {
                Name = entity.Name,
                GoogleMapsLocationURL = entity.MapUrl,
                Description = entity.Description,
                Coordinates = new System.Tuple<decimal?, decimal?>(entity.Latitude, entity.Longitude)
            };
            venue.Save();
            return entity;
        }

        protected override void DeleteEntity(int id)
        {
            // Venue deletion is not implemented in the domain model
            throw new System.NotImplementedException("Venue deletion is not supported");
        }

        protected override VenueV1 CreateEntity(VenueV1 entity)
        {
            Venue.CreateNewVenue(entity.Name, entity.MapUrl, entity.Description, entity.Latitude, entity.Longitude);
            // Return the created entity by finding it in the list (CreateNewVenue doesn't return the ID)
            var venues = Venue.GetAll();
            var createdVenue = venues.OrderByDescending(v => v.ID).FirstOrDefault(v => v.Name == entity.Name);
            return createdVenue == null ? entity : VenueV1.FromInternal(createdVenue);
        }

        protected override List<VenueV1> GetAllEntities(NameValueCollection requestQueryString)
        {
            return Venue.GetAll().Select(VenueV1.FromInternal).OrderBy(v => v.Name).ToList();
        }

        protected override VenueV1 GetEntity(int id)
        {
            var venue = new Venue(id);
            // Check if the venue exists by verifying it has a name
            return string.IsNullOrEmpty(venue.Name) ? null : VenueV1.FromInternal(venue);
        }

        public override string GetTypeName()
        {
            return "venues";
        }
    }
}
