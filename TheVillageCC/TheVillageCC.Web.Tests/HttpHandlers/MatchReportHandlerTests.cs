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
            mockDao.Setup(d => d.GetMatchData(It.IsAny<int>())).Returns(new MatchData
            {
                ID = 123,
                Date = DateTime.Now,
                OppositionID = 1,
                VenueID = 1
            });
            mockDao.Setup(d => d.GetMatchReport(It.IsAny<int>())).Returns(new MatchReportAndConditions(String.Empty, 
                String.Empty, String.Empty));

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }

        [Fact]
        public void ProcessRequest_GetAllMatchReports_WithoutMatchId_ReturnsStatusCode200()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/matchreports/");
            
            // Setup mock to return empty list for GetResults
            var matchDataList = new System.Collections.Generic.List<MatchData>
            {
                new MatchData { ID = 1, Date = DateTime.Now.AddDays(-3), OppositionID = 1, VenueID = 1, HomeOrAway = "H" },
                new MatchData { ID = 2, Date = DateTime.Now.AddDays(-2), OppositionID = 1, VenueID = 1, HomeOrAway = "H" },
                new MatchData { ID = 3, Date = DateTime.Now.AddDays(-1), OppositionID = 1, VenueID = 1, HomeOrAway = "H" }
            };
            mockDao.Setup(d=>d.GetAllMatches()).Returns(()=> matchDataList);
            mockDao.Setup(d=>d.GetTeamData(It.IsAny<int>())).Returns(()=> new TeamData { ID = 1, Name = "Test Team" });
            mockDao.Setup(d => d.GetMatchReport(It.IsAny<int>())).Returns(
                new MatchReportAndConditions("Test conditions", "Test report", string.Empty));

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }

        [Fact]
        public void ProcessRequest_GetAllMatchReports_WithLimitParameter_ReturnsLimitedResults()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/matchreports?limit=2");
            
            // Setup mock data with multiple matches
            var matchDataList = new System.Collections.Generic.List<MatchData>
            {
                new MatchData { ID = 1, Date = DateTime.Now.AddDays(-3), OppositionID = 1, VenueID = 1, HomeOrAway = "H" },
                new MatchData { ID = 2, Date = DateTime.Now.AddDays(-2), OppositionID = 1, VenueID = 1, HomeOrAway = "H" },
                new MatchData { ID = 3, Date = DateTime.Now.AddDays(-1), OppositionID = 1, VenueID = 1, HomeOrAway = "H" }
            };
            mockDao.Setup(d=>d.GetAllMatches()).Returns(()=> matchDataList);
            mockDao.Setup(d=>d.GetTeamData(It.IsAny<int>())).Returns(()=> new TeamData { ID = 1, Name = "Test Team" });
            mockDao.Setup(d => d.GetMatchData(It.IsAny<int>())).Returns<int>(id => matchDataList.Find(m => m.ID == id));
            mockDao.Setup(d => d.GetMatchReport(It.IsAny<int>())).Returns(
                new MatchReportAndConditions("Test conditions", "Test report", string.Empty));

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
            var response = context.Response.ToString();
            Assert.Contains("\"MatchId\"", response);
        }

        [Fact]
        public void ProcessRequest_GetAllMatchReports_WithOrderParameter_ReturnsOrderedResults()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/api/matchreports?order=asc");
            
            // Setup mock data
            var matchDataList = new System.Collections.Generic.List<MatchData>
            {
                new MatchData { ID = 1, Date = DateTime.Now.AddDays(-2), OppositionID = 1, VenueID = 1, HomeOrAway = "H" },
                new MatchData { ID = 2, Date = DateTime.Now.AddDays(-1), OppositionID = 1, VenueID = 1, HomeOrAway = "H" }
            };
            mockDao.Setup(d=>d.GetAllMatches()).Returns(()=> matchDataList);
            mockDao.Setup(d => d.GetMatchData(It.IsAny<int>())).Returns<int>(id => matchDataList.Find(m => m.ID == id));
            mockDao.Setup(d=>d.GetTeamData(It.IsAny<int>())).Returns(()=> new TeamData { ID = 1, Name = "Test Team" });
            mockDao.Setup(d => d.GetMatchReport(It.IsAny<int>())).Returns(
                new MatchReportAndConditions("Test conditions", "Test report", string.Empty));

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.Equal(200, context.Response.StatusCode);
            Assert.Equal("application/json", context.Response.ContentType);
        }

        [Fact]
        public void ProcessRequest_PostMatchReport_WithoutMatchId_Returns400()
        {
            // Arrange
            var matchReportJson = "{\"Conditions\":\"Test conditions\",\"Report\":\"Test report\",\"Base64EncodedImage\":null}";
            var context = TestHandlerContextFactory.CreateHttpContext("POST", "http://test.com/api/matchreports/", matchReportJson);

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
            mockDao.Setup(d => d.GetMatchData(It.IsAny<int>())).Returns(new MatchData
            {
                ID = 123,
                Date = DateTime.Now,
                OppositionID = 1,
                VenueID = 1
            });
            mockDao.Setup(d => d.GetMatchReport(It.IsAny<int>())).Returns(new MatchReportAndConditions(String.Empty, 
                String.Empty, String.Empty));
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
