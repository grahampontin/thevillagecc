using System;
using System.Collections.Generic;
using CricketClubDAL;
using CricketClubDomain;
using Moq;
using TheVillageCC.Web.HttpHandlers;
using TheVillageCC.Web.Tests.Utils;
using Xunit;
using Xunit.Abstractions;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class FixturesHandlerTests
    {
        private readonly ITestOutputHelper testOutputHelper;
        private readonly FixturesHandler handler;
        private Mock<IDao> dao;

        public FixturesHandlerTests(ITestOutputHelper testOutputHelper)
        {
            this.testOutputHelper = testOutputHelper;
            dao = new Mock<IDao>();
            handler = new FixturesHandler(dao.Object);
        }
        
        

        [Fact]
        public void ProcessRequest_GetFixtures_WithoutSeasonParameter_ReturnsStatusCode200()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/fixtures");

            dao.Setup(d => d.GetAllMatches()).Returns(() => new List<MatchData>());
            
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

            dao.Setup(d => d.GetAllMatches()).Returns(() => new List<MatchData>());
            
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
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/fixtures?season=2099");

            dao.Setup(d => d.GetAllMatches()).Returns(() => new List<MatchData>()
            {
                new MatchData()
                {
                    ID = 1,
                    Date = new DateTime(2099, 5, 1),
                    OppositionID = 1,
                    VenueID = 1,
                    HomeOrAway = "H"
                },
                new MatchData()
                {
                    ID = 2,
                    Date = new DateTime(2098, 5, 1),
                    OppositionID = 1,
                    VenueID = 1,
                    HomeOrAway = "H"
                },
            });
            dao.Setup(d=>d.GetVenueData(It.IsAny<int>())).Returns(() => new VenueData()
            {
                ID = 1,
                Name = "Test Venue",
                Coordinates = new Tuple<decimal?, decimal?>(null, null)
            });
            dao.Setup(d=>d.GetTeamData(It.IsAny<int>())).Returns(() => new TeamData()
            {
                ID = 1,
                Name = "Test Team"
            });
            
            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
            var response = context.Response.ToString();
            Assert.Contains("\"Id\"", response);
            Assert.Contains("2099", response);
            Assert.DoesNotContain("2098", response);
        }

        [Fact]
        public void ProcessRequest_UnsupportedMethod_Returns405()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("POST", "http://test.com/api/fixtures");

            dao.Setup(d => d.GetAllMatches()).Returns(() => new List<MatchData>());
            
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

            dao.Setup(d => d.GetAllMatches()).Returns(() => new List<MatchData>());
            
            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }
    }
}
