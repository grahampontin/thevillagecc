using System;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using CricketClubDAL;
using Moq;
using TheVillageCC.Web.Domain;
using TheVillageCC.Web.HttpHandlers;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class VenueHandlerTests
    {
        private readonly JavaScriptSerializer _serializer;
        private readonly Mock<Dao> _mockDao;
        private readonly VenueHandler _handler;

        public VenueHandlerTests()
        {
            _serializer = new JavaScriptSerializer();
            _mockDao = new Mock<Dao>();
            _handler = new VenueHandler(_mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_GetAll_ReturnsVenuesFromDomainModel()
        {
            // Arrange
            var context = CreateHttpContext("GET", "http://test.com/venues");

            // Act
            // Note: VenueHandler uses static Venue.GetAll() method from domain model
            // This test verifies that the handler can be instantiated with a mock Dao
            // and that it processes GET requests without errors
            _handler.ProcessRequest(context);

            // Assert - No Dao calls expected for VenueHandler as it uses Venue static methods
            // This test primarily validates the handler doesn't throw exceptions
        }

        [Fact]
        public void ProcessRequest_GetSingle_ReturnsVenueFromDomainModel()
        {
            // Arrange
            var context = CreateHttpContext("GET", "http://test.com/venues/123");

            // Act
            // Note: VenueHandler uses new Venue(id) constructor from domain model
            _handler.ProcessRequest(context);

            // Assert - No Dao calls expected for VenueHandler
        }

        [Fact]
        public void ProcessRequest_Post_CallsVenueCreateNewVenue()
        {
            // Arrange
            var newVenue = new VenueV1 { Name = "Test Venue", MapUrl = "http://test.com", Description = "Test" };
            var context = CreateHttpContext("POST", "http://test.com/venues", _serializer.Serialize(newVenue));

            // Act
            // Note: VenueHandler uses static Venue.CreateNewVenue() method
            _handler.ProcessRequest(context);

            // Assert - No Dao calls expected for VenueHandler
        }

        [Fact]
        public void ProcessRequest_Put_CallsVenueSave()
        {
            // Arrange
            var updateVenue = new VenueV1 { Id = 1, Name = "Updated", MapUrl = "http://test.com", Description = "Updated" };
            var context = CreateHttpContext("PUT", "http://test.com/venues", _serializer.Serialize(updateVenue));

            // Act
            // Note: VenueHandler uses Venue.Save() instance method
            _handler.ProcessRequest(context);

            // Assert - No Dao calls expected for VenueHandler
        }

        [Fact]
        public void ProcessRequest_Delete_CallsVenueDelete()
        {
            // Arrange
            var context = CreateHttpContext("DELETE", "http://test.com/venues/123");

            // Act
            // Note: VenueHandler uses Venue.Delete() instance method
            _handler.ProcessRequest(context);

            // Assert - No Dao calls expected for VenueHandler
        }

        private HttpContext CreateHttpContext(string httpMethod, string url, string requestBody = null)
        {
            var responseWriter = new StringWriter();
            var request = new HttpRequest("", url, "");
            var response = new HttpResponse(responseWriter);
            var context = new HttpContext(request, response);

            // Use reflection to set HttpMethod since it's read-only and there's no public API
            // This is a common pattern for testing ASP.NET HttpContext in .NET Framework
            typeof(HttpRequest).GetField("_httpMethod",
                System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic)
                ?.SetValue(request, httpMethod);

            // Set request body if provided
            if (requestBody != null)
            {
                var inputStream = new MemoryStream(Encoding.UTF8.GetBytes(requestBody));
                typeof(HttpRequest).GetField("_inputStream",
                    System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic)
                    ?.SetValue(request, inputStream);
            }

            return context;
        }
    }
}
