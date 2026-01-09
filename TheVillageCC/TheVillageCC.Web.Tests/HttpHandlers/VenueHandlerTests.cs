using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using Moq;
using TheVillageCC.Web.Domain;
using TheVillageCC.Web.HttpHandlers;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class VenueHandlerTests
    {
        private readonly JavaScriptSerializer _serializer;

        public VenueHandlerTests()
        {
            _serializer = new JavaScriptSerializer();
        }

        [Fact]
        public void ProcessRequest_GetAll_InvokesGetAllEntities()
        {
            // Arrange
            var expectedVenues = new List<VenueV1>
            {
                new VenueV1 { Id = 1, Name = "Test Venue", MapUrl = "http://test.com", Description = "Test Description" }
            };
            
            var mockHandler = new Mock<VenueHandler> { CallBase = true };
            mockHandler.Setup(h => h.GetAllEntities(It.IsAny<NameValueCollection>()))
                .Returns(expectedVenues);

            var context = CreateHttpContext("GET", "http://test.com/venues");

            // Act
            mockHandler.Object.ProcessRequest(context);

            // Assert
            mockHandler.Verify(h => h.GetAllEntities(It.IsAny<NameValueCollection>()), Times.Once);
        }

        [Fact]
        public void ProcessRequest_GetSingle_InvokesGetEntity()
        {
            // Arrange
            var expectedVenue = new VenueV1 { Id = 123, Name = "Test Venue", MapUrl = "http://test.com", Description = "Test Description" };
            
            var mockHandler = new Mock<VenueHandler> { CallBase = true };
            mockHandler.Setup(h => h.GetEntity(123))
                .Returns(expectedVenue);

            var context = CreateHttpContext("GET", "http://test.com/venues/123");

            // Act
            mockHandler.Object.ProcessRequest(context);

            // Assert
            mockHandler.Verify(h => h.GetEntity(123), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Post_InvokesCreateEntity()
        {
            // Arrange
            var newVenue = new VenueV1 { Name = "Test Venue", MapUrl = "http://test.com", Description = "Test Description" };
            var createdVenue = new VenueV1 { Id = 1, Name = "Test Venue", MapUrl = "http://test.com", Description = "Test Description" };
            
            var mockHandler = new Mock<VenueHandler> { CallBase = true };
            mockHandler.Setup(h => h.CreateEntity(It.IsAny<VenueV1>()))
                .Returns(createdVenue);

            var context = CreateHttpContext("POST", "http://test.com/venues", _serializer.Serialize(newVenue));

            // Act
            mockHandler.Object.ProcessRequest(context);

            // Assert
            mockHandler.Verify(h => h.CreateEntity(It.IsAny<VenueV1>()), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Put_InvokesUpdateEntity()
        {
            // Arrange
            var updateVenue = new VenueV1 { Id = 1, Name = "Updated Venue", MapUrl = "http://test.com", Description = "Updated Description" };
            
            var mockHandler = new Mock<VenueHandler> { CallBase = true };
            mockHandler.Setup(h => h.UpdateEntity(It.IsAny<VenueV1>()))
                .Returns(updateVenue);

            var context = CreateHttpContext("PUT", "http://test.com/venues", _serializer.Serialize(updateVenue));

            // Act
            mockHandler.Object.ProcessRequest(context);

            // Assert
            mockHandler.Verify(h => h.UpdateEntity(It.IsAny<VenueV1>()), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Delete_InvokesDeleteEntity()
        {
            // Arrange
            var mockHandler = new Mock<VenueHandler> { CallBase = true };
            mockHandler.Setup(h => h.DeleteEntity(123));

            var context = CreateHttpContext("DELETE", "http://test.com/venues/123");

            // Act
            mockHandler.Object.ProcessRequest(context);

            // Assert
            mockHandler.Verify(h => h.DeleteEntity(123), Times.Once);
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
