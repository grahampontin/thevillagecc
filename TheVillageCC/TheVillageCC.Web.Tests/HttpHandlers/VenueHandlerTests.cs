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
    public class VenueHandlerTests
    {
        private readonly JavaScriptSerializer _serializer;

        public VenueHandlerTests()
        {
            _serializer = new JavaScriptSerializer();
        }

        [Fact]
        public void ProcessRequest_GetAll_InvokesGetAllEntities()
        {
            // Arrange
            var handler = new TestableVenueHandler();
            var expectedVenues = new List<VenueV1>
            {
                new VenueV1 { Id = 1, Name = "Test Venue", MapUrl = "http://test.com", Description = "Test Description" }
            };
            handler.SetGetAllEntitiesResult(expectedVenues);

            var context = CreateHttpContext("GET", "http://test.com/venues");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.GetAllEntitiesCalled);
        }

        [Fact]
        public void ProcessRequest_GetSingle_InvokesGetEntity()
        {
            // Arrange
            var handler = new TestableVenueHandler();
            var expectedVenue = new VenueV1 { Id = 123, Name = "Test Venue", MapUrl = "http://test.com", Description = "Test Description" };
            handler.SetGetEntityResult(expectedVenue);

            var context = CreateHttpContext("GET", "http://test.com/venues/123");

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
            var handler = new TestableVenueHandler();
            var newVenue = new VenueV1 { Name = "Test Venue", MapUrl = "http://test.com", Description = "Test Description" };
            handler.SetCreateEntityResult(new VenueV1 { Id = 1, Name = "Test Venue", MapUrl = "http://test.com", Description = "Test Description" });

            var context = CreateHttpContext("POST", "http://test.com/venues", _serializer.Serialize(newVenue));

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.CreateEntityCalled);
        }

        [Fact]
        public void ProcessRequest_Put_InvokesUpdateEntity()
        {
            // Arrange
            var handler = new TestableVenueHandler();
            var updateVenue = new VenueV1 { Id = 1, Name = "Updated Venue", MapUrl = "http://test.com", Description = "Updated Description" };
            handler.SetUpdateEntityResult(updateVenue);

            var context = CreateHttpContext("PUT", "http://test.com/venues", _serializer.Serialize(updateVenue));

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.UpdateEntityCalled);
        }

        [Fact]
        public void ProcessRequest_Delete_InvokesDeleteEntity()
        {
            // Arrange
            var handler = new TestableVenueHandler();
            var context = CreateHttpContext("DELETE", "http://test.com/venues/123");

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

        private class TestableVenueHandler : VenueHandler
        {
            public bool GetAllEntitiesCalled { get; private set; }
            public bool GetEntityCalled { get; private set; }
            public int GetEntityCalledWithId { get; private set; }
            public bool CreateEntityCalled { get; private set; }
            public bool UpdateEntityCalled { get; private set; }
            public bool DeleteEntityCalled { get; private set; }
            public int DeleteEntityCalledWithId { get; private set; }

            private List<VenueV1> _getAllEntitiesResult;
            private VenueV1 _getEntityResult;
            private VenueV1 _createEntityResult;
            private VenueV1 _updateEntityResult;

            public void SetGetAllEntitiesResult(List<VenueV1> result) => _getAllEntitiesResult = result;
            public void SetGetEntityResult(VenueV1 result) => _getEntityResult = result;
            public void SetCreateEntityResult(VenueV1 result) => _createEntityResult = result;
            public void SetUpdateEntityResult(VenueV1 result) => _updateEntityResult = result;

            protected override List<VenueV1> GetAllEntities(NameValueCollection requestQueryString)
            {
                GetAllEntitiesCalled = true;
                return _getAllEntitiesResult ?? new List<VenueV1>();
            }

            protected override VenueV1 GetEntity(int id)
            {
                GetEntityCalled = true;
                GetEntityCalledWithId = id;
                return _getEntityResult;
            }

            protected override VenueV1 CreateEntity(VenueV1 deserializeRequestBody)
            {
                CreateEntityCalled = true;
                return _createEntityResult ?? deserializeRequestBody;
            }

            protected override VenueV1 UpdateEntity(VenueV1 entity)
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
