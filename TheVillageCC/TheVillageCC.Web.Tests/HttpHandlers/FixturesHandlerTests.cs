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
    public class FixturesHandlerTests
    {
        private readonly Mock<IDao> mockDao;
        private readonly FixturesHandler handler;

        public FixturesHandlerTests()
        {
            mockDao = new Mock<IDao>();
            handler = new FixturesHandler(mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_GetFixtures_WithoutSeasonParameter_ReturnsStatusCode200()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/fixtures");
            
            // Setup mock to return empty list
            mockDao.Setup(d => d.GetAllMatches()).Returns(new List<MatchData>());

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
            
            // Setup mock to return empty list
            mockDao.Setup(d => d.GetAllMatches()).Returns(new List<MatchData>());

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
            
            var matchDataList = new List<MatchData>
            {
                new MatchData 
                { 
                    ID = 1, 
                    Date = new DateTime(2024, 6, 15), 
                    OppositionID = 1, 
                    VenueID = 1,
                    HomeOrAway = "H"
                },
                new MatchData 
                { 
                    ID = 2, 
                    Date = new DateTime(2024, 7, 20), 
                    OppositionID = 2, 
                    VenueID = 1,
                    HomeOrAway = "A"
                },
                new MatchData 
                { 
                    ID = 3, 
                    Date = new DateTime(2023, 6, 15), 
                    OppositionID = 1, 
                    VenueID = 1,
                    HomeOrAway = "H"
                }
            };

            mockDao.Setup(d => d.GetAllMatches()).Returns(matchDataList);
            mockDao.Setup(d => d.GetMatchData(It.IsAny<int>())).Returns<int>(id => matchDataList.Find(m => m.ID == id));
            mockDao.Setup(d => d.GetTeamData(It.IsAny<int>())).Returns(() => new TeamData { ID = 1, Name = "Test Team" });
            mockDao.Setup(d => d.GetVenueData(It.IsAny<int>())).Returns(() => new VenueData { ID = 1, Name = "Test Venue" });
            
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
