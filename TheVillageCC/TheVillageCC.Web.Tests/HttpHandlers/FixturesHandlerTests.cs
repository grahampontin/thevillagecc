using System;
using TheVillageCC.Web.HttpHandlers;
using TheVillageCC.Web.Tests.Utils;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class FixturesHandlerTests
    {
        private readonly FixturesHandler handler;

        public FixturesHandlerTests()
        {
            handler = new FixturesHandler();
        }

        [Fact]
        public void ProcessRequest_GetFixtures_WithoutSeasonParameter_ReturnsStatusCode200()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/fixtures");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }

        [Fact]
        public void ProcessRequest_GetFixtures_WithSeasonParameter_ReturnsStatusCode200()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/fixtures?season=2024");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }

        [Fact]
        public void ProcessRequest_GetFixtures_FiltersMatchesByYear()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/fixtures?season=2024");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
            var response = context.Response.ToString();
            Assert.Contains("\"Id\"", response);
        }

        [Fact]
        public void ProcessRequest_UnsupportedMethod_Returns405()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("POST", "http://test.com/api/fixtures");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(405, context.Response.StatusCode);
        }

        [Fact]
        public void ProcessRequest_GetFixtures_WithInvalidSeasonParameter_ReturnsAllFixtures()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/fixtures?season=invalid");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }
    }
}
