using System.Collections.Generic;
using System.Linq;
using CricketClubDAL;
using CricketClubDomain;
using Moq;
using TheVillageCC.Web.HttpHandlers;
using TheVillageCC.Web.Tests.Utils;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class PlayersHandlerTests
    {
        private readonly Mock<IDao> mockDao;
        private readonly PlayersHandler handler;

        public PlayersHandlerTests()
        {
            mockDao = new Mock<IDao>();
            handler = new PlayersHandler(mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_GetAll_ReturnsPlayersFromDomainModel()
        {
            // Arrange
            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/players");
            mockDao.Setup(d => d.GetAllPlayers()).Returns(()=> new List<PlayerData>()
            {
                new PlayerData() { ID = 1, FirstName = "John", Surname = "Doe" },
                new PlayerData() { ID = 2, FirstName = "Jane", Surname = "Smith" }
            });
            mockDao.Setup(d => d.GetAllBattingStatsData()).Returns(() => new List<BattingCardLineData>().ToLookup(d=>d.PlayerID));
            mockDao.Setup(d => d.GetAllBowlingStatsData()).Returns(() => new List<BowlingStatsEntryData>().ToLookup(d=>d.PlayerID));
            mockDao.Setup(d=>d.GetAllFieldingStatsData()).Returns(() => new Dictionary<int, List<BattingCardLineData>>());

            // Act - ensure handler processes without throwing
            handler.ProcessRequest(context);

            mockDao.Verify(d => d.GetAllPlayers(), Times.Once);                        
            mockDao.Verify(d => d.GetAllBattingStatsData(), Times.Once);                        
            mockDao.Verify(d => d.GetAllBowlingStatsData(), Times.Once);                        
            mockDao.Verify(d => d.GetAllFieldingStatsData(), Times.Once);                        

            // Assert - no exceptions
        }
    }
}
