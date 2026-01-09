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
    public class AwardsHandlerTests
    {
        private readonly JavaScriptSerializer _serializer;
        private readonly Mock<Dao> _mockDao;
        private readonly AwardsHandler _handler;

        public AwardsHandlerTests()
        {
            _serializer = new JavaScriptSerializer();
            _mockDao = new Mock<Dao>();
            _handler = new AwardsHandler(_mockDao.Object);
        }

        [Fact]
        public void ProcessRequest_GetAll_CallsDaoGetAllAwardsData()
        {
            // Arrange
            var awardData = new AwardData { Id = 1, Year = 2023, Award = Award.BestBowler, PlayerId = 1, Data = "Test" };
            _mockDao.Setup(d => d.GetAllAwardsData()).Returns(new List<AwardData> { awardData });

            var context = CreateHttpContext("GET", "http://test.com/awards");

            // Act
            _handler.ProcessRequest(context);

            // Assert
            _mockDao.Verify(d => d.GetAllAwardsData(), Times.Once);
        }

        [Fact]
        public void ProcessRequest_GetSingle_CallsDaoGetAwardDataWithCorrectId()
        {
            // Arrange
            var awardData = new AwardData { Id = 123, Year = 2023, Award = Award.BestBowler, PlayerId = 1, Data = "Test" };
            _mockDao.Setup(d => d.GetAwardData(123)).Returns(awardData);

            var context = CreateHttpContext("GET", "http://test.com/awards/123");

            // Act
            _handler.ProcessRequest(context);

            // Assert
            _mockDao.Verify(d => d.GetAwardData(123), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Post_CallsDaoCreateNewAwardWithCorrectParameters()
        {
            // Arrange
            var newAward = new AwardV1 { Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Test" };
            var createdAwardData = new AwardData { Id = 1, Year = 2023, Award = Award.BestBowler, PlayerId = 1, Data = "Test" };
            
            _mockDao.Setup(d => d.CreateNewAward(Award.BestBowler, 2023, 1, "Test")).Returns(1);
            _mockDao.Setup(d => d.GetAwardData(1)).Returns(createdAwardData);

            var context = CreateHttpContext("POST", "http://test.com/awards", _serializer.Serialize(newAward));

            // Act
            _handler.ProcessRequest(context);

            // Assert
            _mockDao.Verify(d => d.CreateNewAward(Award.BestBowler, 2023, 1, "Test"), Times.Once);
            _mockDao.Verify(d => d.GetAwardData(1), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Put_CallsDaoUpdateAwardWithCorrectEntity()
        {
            // Arrange
            var updateAward = new AwardV1 { Id = 1, Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Updated" };
            
            _mockDao.Setup(d => d.UpdateAward(It.IsAny<AwardData>()));

            var context = CreateHttpContext("PUT", "http://test.com/awards", _serializer.Serialize(updateAward));

            // Act
            _handler.ProcessRequest(context);

            // Assert
            _mockDao.Verify(d => d.UpdateAward(It.Is<AwardData>(a => 
                a.Id == 1 && 
                a.Year == 2023 && 
                a.Award == Award.BestBowler && 
                a.PlayerId == 1 && 
                a.Data == "Updated")), Times.Once);
        }

        [Fact]
        public void ProcessRequest_Delete_CallsDaoDeleteAwardWithCorrectId()
        {
            // Arrange
            _mockDao.Setup(d => d.DeleteAward(123));

            var context = CreateHttpContext("DELETE", "http://test.com/awards/123");

            // Act
            _handler.ProcessRequest(context);

            // Assert
            _mockDao.Verify(d => d.DeleteAward(123), Times.Once);
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
