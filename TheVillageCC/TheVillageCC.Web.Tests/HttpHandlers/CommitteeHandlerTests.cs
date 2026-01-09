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
    public class CommitteeHandlerTests
    {
        private readonly Mock<IDao> mockDao;
        private readonly CommitteeHandler handler;

        public CommitteeHandlerTests()
        {
            mockDao = new Mock<IDao>();
            handler = new CommitteeHandler(mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_GetAll_CallsDaoGetAllCommitteeData()
        {
            // Arrange
            var committeeData = new CommitteeData { Id = 1, Year = 2023, Post = Post.Captain, PlayerId = 1 };
            mockDao.Setup(d => d.GetAllCommitteeData()).Returns(new List<CommitteeData> { committeeData });

            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/committee");

            // Act
            handler.ProcessRequest(context);

            // Assert
            mockDao.Verify(d => d.GetAllCommitteeData(), Times.Once);
        }

        [Fact]
        public void ProcessRequest_GetSingle_CallsDaoGetCommitteeDataWithCorrectId()
        {
            // Arrange
            var committeeData = new CommitteeData { Id = 123, Year = 2023, Post = Post.Captain, PlayerId = 1 };
            mockDao.Setup(d => d.GetCommitteeData(123)).Returns(committeeData);

            var context = TestHandlerContextFactory.CreateHttpContext("GET", "http://test.com/committee/123");

            // Act
            handler.ProcessRequest(context);

            // Assert
            mockDao.Verify(d => d.GetCommitteeData(123), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Post_CallsDaoCreateNewCommitteeWithCorrectEntity()
        {
            // Arrange
            var newCommittee = new CommitteePostV1 { Year = 2023, Post = "Captain", PlayerId = 1 };
            var createdCommitteeData = new CommitteeData { Id = 1, Year = 2023, Post = Post.Captain, PlayerId = 1 };

            mockDao.Setup(d => d.CreateNewCommittee(It.IsAny<CommitteeData>())).Returns(1);
            mockDao.Setup(d => d.GetCommitteeData(1)).Returns(createdCommitteeData);

            var body = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(newCommittee);
            var context = TestHandlerContextFactory.CreateHttpContext("POST", "http://test.com/committee", body);

            // Act
            handler.ProcessRequest(context);

            // Assert
            mockDao.Verify(d => d.CreateNewCommittee(It.Is<CommitteeData>(c =>
                c.Year == 2023 &&
                c.Post == Post.Captain &&
                c.PlayerId == 1)), Times.Once);
            mockDao.Verify(d => d.GetCommitteeData(1), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Put_CallsDaoUpdateCommitteeWithCorrectEntity()
        {
            // Arrange
            var updateCommittee = new CommitteePostV1 { Id = 1, Year = 2023, Post = "Captain", PlayerId = 1 };
            mockDao.Setup(d => d.UpdateCommittee(It.IsAny<CommitteeData>()));

            var body = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(updateCommittee);
            var context = TestHandlerContextFactory.CreateHttpContext("PUT", "http://test.com/committee", body);

            // Act
            handler.ProcessRequest(context);

            // Assert
            mockDao.Verify(d => d.UpdateCommittee(It.Is<CommitteeData>(c =>
                c.Id == 1 &&
                c.Year == 2023 &&
                c.Post == Post.Captain &&
                c.PlayerId == 1)), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Delete_CallsDaoDeleteCommitteeWithCorrectId()
        {
            // Arrange
            mockDao.Setup(d => d.DeleteCommittee(123));

            var context = TestHandlerContextFactory.CreateHttpContext("DELETE", "http://test.com/committee/123");

            // Act
            handler.ProcessRequest(context);

            // Assert
            mockDao.Verify(d => d.DeleteCommittee(123), Times.Once);
        }
    }
}
