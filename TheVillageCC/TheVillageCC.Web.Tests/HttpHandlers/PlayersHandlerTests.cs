using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Web;
using TheVillageCC.Web.Domain;
using TheVillageCC.Web.HttpHandlers;
using Xunit;

namespace TheVillageCC.Web.Tests.HttpHandlers
{
    public class PlayersHandlerTests
    {
        [Fact]
        public void ProcessRequest_GetAll_InvokesGetAllEntities()
        {
            // Arrange
            var handler = new TestablePlayersHandler();
            var expectedPlayers = new List<PlayerV1>
            {
                new PlayerV1 { Id = 1, FirstName = "John", Surname = "Doe" }
            };
            handler.SetGetAllEntitiesResult(expectedPlayers);

            var context = CreateHttpContext("GET", "http://test.com/players");

            // Act
            handler.ProcessRequest(context);

            // Assert
            Assert.True(handler.GetAllEntitiesCalled);
        }

        private HttpContext CreateHttpContext(string httpMethod, string url)
        {
            var responseWriter = new StringWriter();
            var request = new HttpRequest("", url, "");
            var response = new HttpResponse(responseWriter);
            var context = new HttpContext(request, response);

            // Use reflection to set HttpMethod since it's read-only
            typeof(HttpRequest).GetField("_httpMethod",
                System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic)
                ?.SetValue(request, httpMethod);

            return context;
        }

        private class TestablePlayersHandler : PlayersHandler
        {
            public bool GetAllEntitiesCalled { get; private set; }

            private List<PlayerV1> _getAllEntitiesResult;

            public void SetGetAllEntitiesResult(List<PlayerV1> result) => _getAllEntitiesResult = result;

            protected override List<PlayerV1> GetAllEntities(NameValueCollection requestQueryString)
            {
                GetAllEntitiesCalled = true;
                return _getAllEntitiesResult ?? new List<PlayerV1>();
            }
        }
    }
}
