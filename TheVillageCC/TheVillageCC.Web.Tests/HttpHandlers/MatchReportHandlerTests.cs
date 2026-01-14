using System;
using CricketClubDAL;
using CricketClubDomain;
using Moq;
using TheVillageCC.Web.HttpHandlers;
using TheVillageCC.Web.Tests.Utils;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class MatchReportHandlerTests
    {
        private readonly Mock<IDao> mockDao;
        private readonly MatchReportHandler handler;

        public MatchReportHandlerTests()
        {
            mockDao = new Mock<IDao>();
            handler = new MatchReportHandler(mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_GetMatchReport_WithValidMatchId_ReturnsStatusCode200()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/matchreports/123");
            
            // Setup minimal mock data to prevent NullReferenceException
            mockDao.Setup(d => d.GetMatch(It.IsAny<int>())).Returns(new MatchData
            {
                ID = 123,
                MatchDate = DateTime.Now,
                OppositionID = 1,
                VenueID = 1
            });

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }

        [Fact]
        public void ProcessRequest_GetMatchReport_WithoutMatchId_Returns400()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/matchreports/");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(400, context.Response.StatusCode);
        }

        [Fact]
        public void ProcessRequest_PostMatchReport_WithValidMatchId_ReturnsStatusCode200()
        {
            // Arrange
            var matchReportJson = "{\"Conditions\":\"Test conditions\",\"Report\":\"Test report\",\"Base64EncodedImage\":null}";
            var context = TestHandlerContextFactory.CreateHttpContext("POST", "http://test.com/api/matchreports/123", matchReportJson);
            
            // Setup minimal mock data
            mockDao.Setup(d => d.GetMatch(It.IsAny<int>())).Returns(new MatchData
            {
                ID = 123,
                MatchDate = DateTime.Now,
                OppositionID = 1,
                VenueID = 1
            });

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }

        [Fact]
        public void ProcessRequest_UnsupportedMethod_Returns405()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("DELETE", "http://test.com/api/matchreports/123");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(405, context.Response.StatusCode);
        }
    }
}
