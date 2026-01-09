using System.Collections.Generic;
using CricketClubDAL;
using CricketClubDomain;
using Moq;
using TheVillageCC.Web.Domain;
using TheVillageCC.Web.HttpHandlers;
using TheVillageCC.Web.Tests.Utils;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class AwardsHandlerTests
    {
        private readonly Mock<IDao> mockDao;
        private readonly AwardsHandler handler;

        public AwardsHandlerTests()
        {
            mockDao = new Mock<IDao>();
            handler = new AwardsHandler(mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_GetAll_CallsDaoGetAllAwardsData()
        {
            // Arrange
            var awardData = new AwardData { Id = 1, Year = 2023, Award = Award.BatsmanOfTheYear, PlayerId = 1, Data = "Test" };
            mockDao.Setup(d => d.GetAllAwardsData()).Returns(new List<AwardData> { awardData });

            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/awards");

            // Act
            handler.ProcessRequest(context);

            // Assert
            mockDao.Verify(d => d.GetAllAwardsData(), Times.Once);
        }

        [Fact]
        public void ProcessRequest_GetSingle_CallsDaoGetAwardDataWithCorrectId()
        {
            // Arrange
            var awardData = new AwardData { Id = 123, Year = 2023, Award = Award.BowlerOfTheYear, PlayerId = 1, Data = "Test" };
            mockDao.Setup(d => d.GetAwardData(123)).Returns(awardData);

            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/awards/123");

            // Act
            handler.ProcessRequest(context);

            // Assert
            mockDao.Verify(d => d.GetAwardData(123), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Post_CallsDaoCreateNewAwardWithCorrectParameters()
        {
            // Arrange
            var newAward = new AwardV1 { Year = 2023, Award = "BatsmanOfTheYear", PlayerId = 1, Data = "Test" };
            var createdAwardData = new AwardData { Id = 1, Year = 2023, Award = Award.BatsmanOfTheYear, PlayerId = 1, Data = "Test" };
            
            mockDao.Setup(d => d.CreateNewAward(Award.BatsmanOfTheYear, 2023, 1, "Test")).Returns(1);
            mockDao.Setup(d => d.GetAwardData(1)).Returns(createdAwardData);

            var body = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(newAward);
            var context = TestHandlerContextFactory.CreateHttpContext("POST", "http://test.com/awards", body);

            // Act
            handler.ProcessRequest(context);

            // Assert
            mockDao.Verify(d => d.CreateNewAward(Award.BatsmanOfTheYear, 2023, 1, "Test"), Times.Once);
            mockDao.Verify(d => d.GetAwardData(1), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Put_CallsDaoUpdateAwardWithCorrectEntity()
        {
            // Arrange
            var updateAward = new AwardV1 { Id = 1, Year = 2023, Award = "BatsmanOfTheYear", PlayerId = 1, Data = "Updated" };
            
            mockDao.Setup(d => d.UpdateAward(It.IsAny<AwardData>()));

            var body = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(updateAward);
            var context = TestHandlerContextFactory.CreateHttpContext("PUT", "http://test.com/awards", body);

            // Act
            handler.ProcessRequest(context);

            // Assert
            mockDao.Verify(d => d.UpdateAward(It.Is<AwardData>(a =>
                a.Id == 1 && 
                a.Year == 2023 && 
                a.Award == Award.BatsmanOfTheYear && 
                a.PlayerId == 1 && 
                a.Data == "Updated")), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Delete_CallsDaoDeleteAwardWithCorrectId()
        {
            // Arrange
            mockDao.Setup(d => d.DeleteAward(123));

            var context = TestHandlerContextFactory.CreateHttpContext("DELETE", "http://test.com/awards/123");

            // Act
            handler.ProcessRequest(context);

            // Assert
            mockDao.Verify(d => d.DeleteAward(123), Times.Once);
        }

        // Test-only subclass to expose protected processing entry point
    }
}
