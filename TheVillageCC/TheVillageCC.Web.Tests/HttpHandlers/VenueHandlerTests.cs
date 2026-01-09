using System;
using CricketClubDAL;
using CricketClubDomain;
using Moq;
using TheVillageCC.Web.Domain;
using TheVillageCC.Web.HttpHandlers;
using TheVillageCC.Web.Tests.Utils;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class VenueHandlerTests
    {
        private readonly Mock<IDao> mockDao;
        private readonly VenueHandler handler;

        public VenueHandlerTests()
        {
            mockDao = new Mock<IDao>();
            handler = new VenueHandler(mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_GetAll_ReturnsVenuesFromDomainModel()
        {
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/venues");
            handler.ProcessRequest(context);
        }

        [Fact]
        public void ProcessRequest_GetSingle_ReturnsVenueFromDomainModel()
        {
            mockDao.Setup(d=>d.GetVenueData(123)).Returns(new CricketClubDomain.VenueData() { ID = 123, Name = "Test Venue", MapUrl = "http://test.com", Description = "Test", Coordinates = new Tuple<decimal?, decimal?>(51.5074m, -0.1278m) });
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/venues/123");
            handler.ProcessRequest(context);
            mockDao.Verify(d => d.GetVenueData(123), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Post_CallsVenueCreateNewVenue()
        {
            mockDao.Setup(d => d.GetVenueData(It.IsAny<int>())).Returns(new CricketClubDomain.VenueData()
            {
                ID = 1, Name = "Test Venue", MapUrl = "http://test.com", Description = "Test",
                Coordinates = new Tuple<decimal?, decimal?>(51.5074m, -0.1278m)
            });
            var v = new VenueV1 { Name = "Test Venue", MapUrl = "http://test.com", Description = "Test" };
            var body = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(v);
            var context = TestHandlerContextFactory.CreateHttpContext("POST", "http://test.com/venues", body);
            handler.ProcessRequest(context);
            
            mockDao.Verify(d => d.CreateNewVenue(It.IsAny<string>(),It.IsAny<string>(), It.IsAny<string>(), It.IsAny<decimal?>(), It.IsAny<decimal?>()), Times.Once);
            
        }

        [Fact]
        public void ProcessRequest_Put_CallsVenueSave()
        {
            mockDao.Setup(d => d.GetVenueData(1)).Returns(new CricketClubDomain.VenueData()
            {
                ID = 1, Name = "Test Venue", MapUrl = "http://test.com", Description = "Test",
                Coordinates = new Tuple<decimal?, decimal?>(51.5074m, -0.1278m)
            });
            var v = new VenueV1 { Id = 1, Name = "Updated", MapUrl = "http://test.com", Description = "Updated" };
            var body = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(v);
            var context = TestHandlerContextFactory.CreateHttpContext("PUT", "http://test.com/venues", body);
            handler.ProcessRequest(context);
            mockDao.Verify(d => d.UpdateVenue(It.IsAny<VenueData>()), Times.Once);

        }

        [Fact]
        public void ProcessRequest_Delete_CallsVenueDelete()
        {
            mockDao.Setup(d=>d.GetVenueData(123)).Returns(new CricketClubDomain.VenueData() { ID = 123, Name = "Test Venue", MapUrl = "http://test.com", Description = "Test", Coordinates = new Tuple<decimal?, decimal?>(51.5074m, -0.1278m) });
            var context = TestHandlerContextFactory.CreateHttpContext("DELETE", "http://test.com/venues/123");
            handler.ProcessRequest(context);
            mockDao.Verify(d => d.DeleteVenue(123), Times.Once);
        }
    }
}
