using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using CricketClubDAL;
using CricketClubDomain;
using Moq;
using TheVillageCC.Web.Domain;
using TheVillageCC.Web.HttpHandlers;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class CommitteeHandlerTests
    {
        private readonly JavaScriptSerializer _serializer;
        private readonly Mock<Dao> _mockDao;
        private readonly CommitteeHandler _handler;

        public CommitteeHandlerTests()
        {
            _serializer = new JavaScriptSerializer();
            _mockDao = new Mock<Dao>();
            _handler = new CommitteeHandler(_mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_GetAll_CallsDaoGetAllCommitteeData()
        {
            // Arrange
            var committeeData = new CommitteeData { Id = 1, Year = 2023, Post = Post.Captain, PlayerId = 1 };
            _mockDao.Setup(d => d.GetAllCommitteeData()).Returns(new List<CommitteeData> { committeeData });

            var context = CreateHttpContext("GET", "http://test.com/committee");

            // Act
            _handler.ProcessRequest(context);

            // Assert
            _mockDao.Verify(d => d.GetAllCommitteeData(), Times.Once);
        }

        [Fact]
        public void ProcessRequest_GetSingle_CallsDaoGetCommitteeDataWithCorrectId()
        {
            // Arrange
            var committeeData = new CommitteeData { Id = 123, Year = 2023, Post = Post.Captain, PlayerId = 1 };
            _mockDao.Setup(d => d.GetCommitteeData(123)).Returns(committeeData);

            var context = CreateHttpContext("GET", "http://test.com/committee/123");

            // Act
            _handler.ProcessRequest(context);

            // Assert
            _mockDao.Verify(d => d.GetCommitteeData(123), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Post_CallsDaoCreateNewCommitteeWithCorrectEntity()
        {
            // Arrange
            var newCommittee = new CommitteePostV1 { Year = 2023, Post = "Chairman", PlayerId = 1 };
            var createdCommitteeData = new CommitteeData { Id = 1, Year = 2023, Post = Post.Captain, PlayerId = 1 };
            
            _mockDao.Setup(d => d.CreateNewCommittee(It.IsAny<CommitteeData>())).Returns(1);
            _mockDao.Setup(d => d.GetCommitteeData(1)).Returns(createdCommitteeData);

            var context = CreateHttpContext("POST", "http://test.com/committee", _serializer.Serialize(newCommittee));

            // Act
            _handler.ProcessRequest(context);

            // Assert
            _mockDao.Verify(d => d.CreateNewCommittee(It.Is<CommitteeData>(c => 
                c.Year == 2023 && 
                c.Post == Post.Captain && 
                c.PlayerId == 1)), Times.Once);
            _mockDao.Verify(d => d.GetCommitteeData(1), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Put_CallsDaoUpdateCommitteeWithCorrectEntity()
        {
            // Arrange
            var updateCommittee = new CommitteePostV1 { Id = 1, Year = 2023, Post = "Chairman", PlayerId = 1 };
            
            _mockDao.Setup(d => d.UpdateCommittee(It.IsAny<CommitteeData>()));

            var context = CreateHttpContext("PUT", "http://test.com/committee", _serializer.Serialize(updateCommittee));

            // Act
            _handler.ProcessRequest(context);

            // Assert
            _mockDao.Verify(d => d.UpdateCommittee(It.Is<CommitteeData>(c => 
                c.Id == 1 && 
                c.Year == 2023 && 
                c.Post == Post.Captain && 
                c.PlayerId == 1)), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Delete_CallsDaoDeleteCommitteeWithCorrectId()
        {
            // Arrange
            _mockDao.Setup(d => d.DeleteCommittee(123));

            var context = CreateHttpContext("DELETE", "http://test.com/committee/123");

            // Act
            _handler.ProcessRequest(context);

            // Assert
            _mockDao.Verify(d => d.DeleteCommittee(123), Times.Once);
        }

        private HttpContext CreateHttpContext(string httpMethod, string url, string requestBody = null)
        {
            var responseWriter = new StringWriter();
            var request = new HttpRequest("", url, "");
            var response = new HttpResponse(responseWriter);
            var context = new HttpContext(request, response);

            // Use reflection to set HttpMethod since it's read-only and there's no public API
            // This is a common pattern for testing ASP.NET HttpContext in .NET Framework
            typeof(HttpRequest).GetField("_httpMethod",
                System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic)
                ?.SetValue(request, httpMethod);

            // Set request body if provided
            if (requestBody != null)
            {
                var inputStream = new MemoryStream(Encoding.UTF8.GetBytes(requestBody));
                typeof(HttpRequest).GetField("_inputStream",
                    System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic)
                    ?.SetValue(request, inputStream);
            }

            return context;
        }
    }
}
