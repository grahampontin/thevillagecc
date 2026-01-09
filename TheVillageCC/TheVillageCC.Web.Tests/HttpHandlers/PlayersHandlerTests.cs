using System;
using System.Collections.Specialized;
using System.IO;
using System.Web;
using CricketClubDAL;
using Moq;
using TheVillageCC.Web.HttpHandlers;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class PlayersHandlerTests
    {
        private readonly Mock<Dao> _mockDao;
        private readonly PlayersHandler _handler;

        public PlayersHandlerTests()
        {
            _mockDao = new Mock<Dao>();
            _handler = new PlayersHandler(_mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_GetAll_ReturnsPlayersFromDomainModel()
        {
            // Arrange
            var context = CreateHttpContext("GET", "http://test.com/players");

            // Act
            // Note: PlayersHandler uses static Player.GetAll() method from domain model
            // This test verifies that the handler can be instantiated with a mock Dao
            // and that it processes GET requests without errors
            _handler.ProcessRequest(context);

            // Assert - No Dao calls expected for PlayersHandler as it uses Player.GetAll() static method
            // This test primarily validates the handler doesn't throw exceptions
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
