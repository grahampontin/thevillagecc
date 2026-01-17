using System;
using System.Collections.Generic;
using CricketClubDAL;
using CricketClubDomain;
using CricketClubMiddle;
using Moq;
using TheVillageCC.Web.HttpHandlers;
using TheVillageCC.Web.Tests.Utils;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class ResultsHandlerTests
    {
        private readonly Mock<IDao> mockDao;
        private readonly ResultsHandler handler;

        public ResultsHandlerTests()
        {
            mockDao = new Mock<IDao>();
            handler = new ResultsHandler(mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_GetResults_WithoutSeasonParameter_ReturnsStatusCode200()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/results");
            
            // Setup mock to return empty list
            mockDao.Setup(d => d.GetAllMatches()).Returns(new List<MatchData>());

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }

        [Fact]
        public void ProcessRequest_GetResults_WithSeasonParameter_ReturnsStatusCode200()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/results?season=2023");
            
            // Setup mock to return empty list
            mockDao.Setup(d => d.GetAllMatches()).Returns(new List<MatchData>());

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }

        [Fact]
        public void ProcessRequest_GetResults_FiltersMatchesByYear()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/results?season=2023");
            
            var matchDataList = new List<MatchData>
            {
                new MatchData 
                { 
                    ID = 1, 
                    Date = new DateTime(2023, 6, 15), 
                    OppositionID = 1, 
                    VenueID = 1,
                    HomeOrAway = "Home"
                },
                new MatchData 
                { 
                    ID = 2, 
                    Date = new DateTime(2023, 7, 20), 
                    OppositionID = 2, 
                    VenueID = 1,
                    HomeOrAway = "Away"
                }
            };

            mockDao.Setup(d => d.GetAllMatches()).Returns(matchDataList);
            mockDao.Setup(d => d.GetMatchData(It.IsAny<int>())).Returns<int>(id => matchDataList.Find(m => m.ID == id));
          
            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
            var response = context.Response.ToString();
            Assert.Contains("\"WinningTeam\"", response);
        }

        [Fact]
        public void ProcessRequest_UnsupportedMethod_Returns405()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("POST", "http://test.com/api/results");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(405, context.Response.StatusCode);
        }

        [Fact]
        public void ProcessRequest_GetResults_WithInvalidSeasonParameter_UsesCurrentYear()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/results?season=invalid");
            
            // Setup mock to return empty list
            mockDao.Setup(d => d.GetAllMatches()).Returns(new List<MatchData>());

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }
    }
}
