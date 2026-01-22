#nullable disable
using System.Text.Json;
using CricketClubDAL;
using Moq;
using TheVillageCC.WebApi.Controllers;
using TheVillageCC.WebApi.Tests.Utils;
using Xunit;

namespace TheVillageCC.WebApi.Tests.Controllers
{
    public class ResultsControllerTests
    {
        private readonly Mock<IDao> mockDao;
        private readonly ResultsController controller;

        public ResultsControllerTests()
        {
            mockDao = new Mock<IDao>();
            controller = new ResultsController(mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_Get_ReturnsResults()
        {
            // Arrange
            var context = TestControllerContextFactory.CreateHttpContext("GET", "http://test.com/api/results");

            // Act
            controller.ProcessRequest(context);

            // Assert
            Assert.Equal("application/json", context.Response.ContentType);
            Assert.Equal(200, context.Response.StatusCode);
        }

        [Fact]
        public void ProcessRequest_GetWithSeasonFilter_ReturnsFilteredResults()
        {
            // Arrange
            var context = TestControllerContextFactory.CreateHttpContext("GET", "http://test.com/api/results?season=2023");

            // Act
            controller.ProcessRequest(context);

            // Assert
            Assert.Equal("application/json", context.Response.ContentType);
            Assert.Equal(200, context.Response.StatusCode);
        }

        [Fact]
        public void ProcessRequest_Post_ReturnsMethodNotAllowed()
        {
            // Arrange
            var context = TestControllerContextFactory.CreateHttpContext("POST", "http://test.com/api/results");

            // Act
            controller.ProcessRequest(context);

            // Assert
            Assert.Equal(405, context.Response.StatusCode);
        }
    }
}
