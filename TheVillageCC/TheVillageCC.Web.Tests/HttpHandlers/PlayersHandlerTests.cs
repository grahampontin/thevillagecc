using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Web;
using Moq;
using TheVillageCC.Web.Domain;
using TheVillageCC.Web.HttpHandlers;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class PlayersHandlerTests
    {
        [Fact]
        public void ProcessRequest_GetAll_InvokesGetAllEntities()
        {
            // Arrange
            var expectedPlayers = new List<PlayerV1>
            {
                new PlayerV1 { Id = 1, FirstName = "John", Surname = "Doe" }
            };
            
            var mockHandler = new Mock<PlayersHandler> { CallBase = true };
            mockHandler.Setup(h => h.GetAllEntities(It.IsAny<NameValueCollection>()))
                .Returns(expectedPlayers);

            var context = CreateHttpContext("GET", "http://test.com/players");

            // Act
            mockHandler.Object.ProcessRequest(context);

            // Assert
            mockHandler.Verify(h => h.GetAllEntities(It.IsAny<NameValueCollection>()), Times.Once);
        }

        private HttpContext CreateHttpContext(string httpMethod, string url)
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

            return context;
        }
    }
}
