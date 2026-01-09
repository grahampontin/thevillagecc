using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using TheVillageCC.Web.Domain;
using TheVillageCC.Web.HttpHandlers;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class CommitteeHandlerTests
    {
        private readonly JavaScriptSerializer _serializer;

        public CommitteeHandlerTests()
        {
            _serializer = new JavaScriptSerializer();
        }

        [Fact]
        public void ProcessRequest_GetAll_InvokesGetAllEntities()
        {
            // Arrange
            var handler = new TestableCommitteeHandler();
            var expectedCommittee = new List<CommitteePostV1>
            {
                new CommitteePostV1 { Id = 1, Year = 2023, Post = "Chairman", PlayerId = 1 }
            };
            handler.SetGetAllEntitiesResult(expectedCommittee);

            var context = CreateHttpContext("GET", "http://test.com/committee");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.GetAllEntitiesCalled);
        }

        [Fact]
        public void ProcessRequest_GetSingle_InvokesGetEntity()
        {
            // Arrange
            var handler = new TestableCommitteeHandler();
            var expectedCommittee = new CommitteePostV1 { Id = 123, Year = 2023, Post = "Chairman", PlayerId = 1 };
            handler.SetGetEntityResult(expectedCommittee);

            var context = CreateHttpContext("GET", "http://test.com/committee/123");

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
            var handler = new TestableCommitteeHandler();
            var newCommittee = new CommitteePostV1 { Year = 2023, Post = "Chairman", PlayerId = 1 };
            handler.SetCreateEntityResult(new CommitteePostV1 { Id = 1, Year = 2023, Post = "Chairman", PlayerId = 1 });

            var context = CreateHttpContext("POST", "http://test.com/committee", _serializer.Serialize(newCommittee));

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.CreateEntityCalled);
        }

        [Fact]
        public void ProcessRequest_Put_InvokesUpdateEntity()
        {
            // Arrange
            var handler = new TestableCommitteeHandler();
            var updateCommittee = new CommitteePostV1 { Id = 1, Year = 2023, Post = "Chairman", PlayerId = 1 };
            handler.SetUpdateEntityResult(updateCommittee);

            var context = CreateHttpContext("PUT", "http://test.com/committee", _serializer.Serialize(updateCommittee));

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.UpdateEntityCalled);
        }

        [Fact]
        public void ProcessRequest_Delete_InvokesDeleteEntity()
        {
            // Arrange
            var handler = new TestableCommitteeHandler();
            var context = CreateHttpContext("DELETE", "http://test.com/committee/123");

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

        private class TestableCommitteeHandler : CommitteeHandler
        {
            public bool GetAllEntitiesCalled { get; private set; }
            public bool GetEntityCalled { get; private set; }
            public int GetEntityCalledWithId { get; private set; }
            public bool CreateEntityCalled { get; private set; }
            public bool UpdateEntityCalled { get; private set; }
            public bool DeleteEntityCalled { get; private set; }
            public int DeleteEntityCalledWithId { get; private set; }

            private List<CommitteePostV1> _getAllEntitiesResult;
            private CommitteePostV1 _getEntityResult;
            private CommitteePostV1 _createEntityResult;
            private CommitteePostV1 _updateEntityResult;

            public void SetGetAllEntitiesResult(List<CommitteePostV1> result) => _getAllEntitiesResult = result;
            public void SetGetEntityResult(CommitteePostV1 result) => _getEntityResult = result;
            public void SetCreateEntityResult(CommitteePostV1 result) => _createEntityResult = result;
            public void SetUpdateEntityResult(CommitteePostV1 result) => _updateEntityResult = result;

            protected override List<CommitteePostV1> GetAllEntities(NameValueCollection requestQueryString)
            {
                GetAllEntitiesCalled = true;
                return _getAllEntitiesResult ?? new List<CommitteePostV1>();
            }

            protected override CommitteePostV1 GetEntity(int id)
            {
                GetEntityCalled = true;
                GetEntityCalledWithId = id;
                return _getEntityResult;
            }

            protected override CommitteePostV1 CreateEntity(CommitteePostV1 deserializeRequestBody)
            {
                CreateEntityCalled = true;
                return _createEntityResult ?? deserializeRequestBody;
            }

            protected override CommitteePostV1 UpdateEntity(CommitteePostV1 entity)
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
