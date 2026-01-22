using System;
using System.Collections.Generic;
using CricketClubDAL;
using CricketClubDomain;
using Moq;
using TheVillageCC.Web.HttpHandlers;
using TheVillageCC.Web.Tests.Utils;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class ScorecardHandlerTests
    {
        private readonly Mock<IDao> mockDao;
        private readonly ScorecardHandler handler;

        public ScorecardHandlerTests()
        {
            mockDao = new Mock<IDao>();
            handler = new ScorecardHandler(mockDao.Object);
        }

        [Fact(Skip = "needs fowData to accept mock dao")]
        public void ProcessRequest_GetScorecard_WithValidMatchId_ReturnsStatusCode200()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/scorecards/123");
            
            // Setup minimal mock data to prevent NullReferenceException
            mockDao.Setup(d => d.GetMatchData(It.IsAny<int>())).Returns(new MatchData
            {
                ID = 123,
                Date = DateTime.Now,
                OppositionID = 1,
                VenueID = 1
            });
            mockDao.Setup(d => d.GetBowlingStats(It.IsAny<int>(), It.IsAny<ThemOrUs>()))
                .Returns(() => new List<BowlingStatsEntryData>());
            mockDao.Setup(d => d.GetBattingCard(It.IsAny<int>(), It.IsAny<ThemOrUs>()))
                .Returns(() => new List<BattingCardLineData>());


            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }

        [Fact]
        public void ProcessRequest_GetScorecard_WithoutMatchId_Returns400()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/scorecards/");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(400, context.Response.StatusCode);
        }

        [Fact(Skip = "needs fowData to accept mock dao")]
        public void ProcessRequest_PostScorecard_WithValidMatchId_ReturnsStatusCode200()
        {
            // Arrange
            var scorecardJson = "{\"ourInnings\":{\"batting\":{\"entries\":[]},\"bowling\":{\"entries\":[]},\"fow\":{\"entries\":[]}},\"theirInnings\":{\"batting\":{\"entries\":[]},\"bowling\":{\"entries\":[]},\"fow\":{\"entries\":[]}},\"matchConditions\":{\"captainId\":1,\"wicketKeeperId\":1,\"weWonTheToss\":false,\"tossWinnerBatted\":false,\"abandoned\":false,\"declaration\":false,\"overs\":0}}";
            var context = TestHandlerContextFactory.CreateHttpContext("POST", "http://test.com/api/scorecards/123", scorecardJson);
            
            // Setup minimal mock data
            mockDao.Setup(d => d.GetMatchData(It.IsAny<int>())).Returns(new MatchData
            {
                ID = 123,
                Date = DateTime.Now,
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
            var context = TestHandlerContextFactory.CreateHttpContext("DELETE", "http://test.com/api/scorecards/123");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(405, context.Response.StatusCode);
        }
    }
}
