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
    public class AwardsHandlerTests
    {
        private readonly JavaScriptSerializer _serializer;

        public AwardsHandlerTests()
        {
            _serializer = new JavaScriptSerializer();
        }

        [Fact]
        public void ProcessRequest_GetAll_InvokesGetAllEntities()
        {
            // Arrange
            var expectedAwards = new List<AwardV1>
            {
                new AwardV1 { Id = 1, Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Test" }
            };
            
            var mockHandler = new Mock<AwardsHandler> { CallBase = true };
            mockHandler.Setup(h => h.GetAllEntities(It.IsAny<NameValueCollection>()))
                .Returns(expectedAwards);

            var context = CreateHttpContext("GET", "http://test.com/awards");

            // Act
            mockHandler.Object.ProcessRequest(context);

            // Assert
            mockHandler.Verify(h => h.GetAllEntities(It.IsAny<NameValueCollection>()), Times.Once);
        }

        [Fact]
        public void ProcessRequest_GetSingle_InvokesGetEntity()
        {
            // Arrange
            var expectedAward = new AwardV1 { Id = 123, Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Test" };
            
            var mockHandler = new Mock<AwardsHandler> { CallBase = true };
            mockHandler.Setup(h => h.GetEntity(123))
                .Returns(expectedAward);

            var context = CreateHttpContext("GET", "http://test.com/awards/123");

            // Act
            mockHandler.Object.ProcessRequest(context);

            // Assert
            mockHandler.Verify(h => h.GetEntity(123), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Post_InvokesCreateEntity()
        {
            // Arrange
            var newAward = new AwardV1 { Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Test" };
            var createdAward = new AwardV1 { Id = 1, Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Test" };
            
            var mockHandler = new Mock<AwardsHandler> { CallBase = true };
            mockHandler.Setup(h => h.CreateEntity(It.IsAny<AwardV1>()))
                .Returns(createdAward);

            var context = CreateHttpContext("POST", "http://test.com/awards", _serializer.Serialize(newAward));

            // Act
            mockHandler.Object.ProcessRequest(context);

            // Assert
            mockHandler.Verify(h => h.CreateEntity(It.IsAny<AwardV1>()), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Put_InvokesUpdateEntity()
        {
            // Arrange
            var updateAward = new AwardV1 { Id = 1, Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Updated" };
            
            var mockHandler = new Mock<AwardsHandler> { CallBase = true };
            mockHandler.Setup(h => h.UpdateEntity(It.IsAny<AwardV1>()))
                .Returns(updateAward);

            var context = CreateHttpContext("PUT", "http://test.com/awards", _serializer.Serialize(updateAward));

            // Act
            mockHandler.Object.ProcessRequest(context);

            // Assert
            mockHandler.Verify(h => h.UpdateEntity(It.IsAny<AwardV1>()), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Delete_InvokesDeleteEntity()
        {
            // Arrange
            var mockHandler = new Mock<AwardsHandler> { CallBase = true };
            mockHandler.Setup(h => h.DeleteEntity(123));

            var context = CreateHttpContext("DELETE", "http://test.com/awards/123");

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
