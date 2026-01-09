using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using CricketClubDAL;
using CricketClubDomain;
using TheVillageCC.Web.Domain;
using TheVillageCC.Web.HttpHandlers;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class AwardsHandlerTests
    {
        private readonly JavaScriptSerializer _serializer;

        public AwardsHandlerTests()
        {
            _serializer = new JavaScriptSerializer();
        }

        [Fact]
        public void ProcessRequest_GetAll_InvokesGetAllEntities()
        {
            // Arrange
            var handler = new TestableAwardsHandler();
            var expectedAwards = new List<AwardV1>
            {
                new AwardV1 { Id = 1, Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Test" }
            };
            handler.SetGetAllEntitiesResult(expectedAwards);

            var context = CreateHttpContext("GET", "http://test.com/awards");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.GetAllEntitiesCalled);
        }

        [Fact]
        public void ProcessRequest_GetSingle_InvokesGetEntity()
        {
            // Arrange
            var handler = new TestableAwardsHandler();
            var expectedAward = new AwardV1 { Id = 123, Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Test" };
            handler.SetGetEntityResult(expectedAward);

            var context = CreateHttpContext("GET", "http://test.com/awards/123");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.GetEntityCalled);
            Assert.Equal(123, handler.GetEntityCalledWithId);
        }

        [Fact]
        public void ProcessRequest_Post_InvokesCreateEntity()
        {
            // Arrange
            var handler = new TestableAwardsHandler();
            var newAward = new AwardV1 { Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Test" };
            handler.SetCreateEntityResult(new AwardV1 { Id = 1, Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Test" });

            var context = CreateHttpContext("POST", "http://test.com/awards", _serializer.Serialize(newAward));

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.CreateEntityCalled);
        }

        [Fact]
        public void ProcessRequest_Put_InvokesUpdateEntity()
        {
            // Arrange
            var handler = new TestableAwardsHandler();
            var updateAward = new AwardV1 { Id = 1, Year = 2023, Award = "BestBowler", PlayerId = 1, Data = "Updated" };
            handler.SetUpdateEntityResult(updateAward);

            var context = CreateHttpContext("PUT", "http://test.com/awards", _serializer.Serialize(updateAward));

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.UpdateEntityCalled);
        }

        [Fact]
        public void ProcessRequest_Delete_InvokesDeleteEntity()
        {
            // Arrange
            var handler = new TestableAwardsHandler();
            var context = CreateHttpContext("DELETE", "http://test.com/awards/123");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.DeleteEntityCalled);
            Assert.Equal(123, handler.DeleteEntityCalledWithId);
        }

        private HttpContext CreateHttpContext(string httpMethod, string url, string requestBody = null)
        {
            var responseWriter = new StringWriter();
            var request = new HttpRequest("", url, "");
            var response = new HttpResponse(responseWriter);
            var context = new HttpContext(request, response);

            // Use reflection to set HttpMethod since it's read-only
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

        private class TestableAwardsHandler : AwardsHandler
        {
            public bool GetAllEntitiesCalled { get; private set; }
            public bool GetEntityCalled { get; private set; }
            public int GetEntityCalledWithId { get; private set; }
            public bool CreateEntityCalled { get; private set; }
            public bool UpdateEntityCalled { get; private set; }
            public bool DeleteEntityCalled { get; private set; }
            public int DeleteEntityCalledWithId { get; private set; }

            private List<AwardV1> _getAllEntitiesResult;
            private AwardV1 _getEntityResult;
            private AwardV1 _createEntityResult;
            private AwardV1 _updateEntityResult;

            public void SetGetAllEntitiesResult(List<AwardV1> result) => _getAllEntitiesResult = result;
            public void SetGetEntityResult(AwardV1 result) => _getEntityResult = result;
            public void SetCreateEntityResult(AwardV1 result) => _createEntityResult = result;
            public void SetUpdateEntityResult(AwardV1 result) => _updateEntityResult = result;

            protected override List<AwardV1> GetAllEntities(NameValueCollection requestQueryString)
            {
                GetAllEntitiesCalled = true;
                return _getAllEntitiesResult ?? new List<AwardV1>();
            }

            protected override AwardV1 GetEntity(int id)
            {
                GetEntityCalled = true;
                GetEntityCalledWithId = id;
                return _getEntityResult;
            }

            protected override AwardV1 CreateEntity(AwardV1 deserializeRequestBody)
            {
                CreateEntityCalled = true;
                return _createEntityResult ?? deserializeRequestBody;
            }

            protected override AwardV1 UpdateEntity(AwardV1 entity)
            {
                UpdateEntityCalled = true;
                return _updateEntityResult ?? entity;
            }

            protected override void DeleteEntity(int id)
            {
                DeleteEntityCalled = true;
                DeleteEntityCalledWithId = id;
            }
        }
    }
}
