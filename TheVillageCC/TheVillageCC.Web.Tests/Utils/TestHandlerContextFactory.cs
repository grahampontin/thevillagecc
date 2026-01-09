using System;
using System.Collections.Specialized;
using System.IO;
using System.Text;
using TheVillageCC.Web.HttpHandlers;

namespace TheVillageCC.Web.Tests.Utils
{
    /// <summary>
    /// Provides a lightweight IHandlerContext implementation for unit tests.
    /// </summary>
    public static class TestHandlerContextFactory
    {
        public static IHandlerContext CreateHttpContext(string httpMethod, string url, string requestBody = null)
        {
            return new TestHandlerContext(httpMethod, url, requestBody);
        }

        private class TestHandlerContext : IHandlerContext
        {
            public TestHandlerContext(string httpMethod, string url, string requestBody)
            {
                Request = new TestRequestContext(httpMethod, url, requestBody);
                Response = new TestResponseContext();
            }

            public IRequestContext Request { get; }
            public IResponseContext Response { get; }

            private class TestRequestContext : IRequestContext
            {
                private readonly MemoryStream bodyStream;
                private readonly Uri url;
                private readonly NameValueCollection qs;

                public TestRequestContext(string httpMethod, string url, string requestBody)
                {
                    HttpMethod = httpMethod;
                    this.url = new Uri(url);
                    qs = System.Web.HttpUtility.ParseQueryString(this.url.Query);
                    if (!string.IsNullOrEmpty(requestBody))
                    {
                        var bytes = Encoding.UTF8.GetBytes(requestBody);
                        bodyStream = new MemoryStream(bytes);
                    }
                    else
                    {
                        bodyStream = new MemoryStream();
                    }
                }

                public string HttpMethod { get; }
                public Stream InputStream => bodyStream;
                public Uri Url => url;
                public NameValueCollection QueryString => qs;
            }

            private class TestResponseContext : IResponseContext
            {
                private readonly StringWriter writer = new StringWriter();
                public string ContentType { get; set; }
                public void Write(string text) => writer.Write(text);
                public int StatusCode { get; set; }
                public void End() { /* no-op for tests */ }
                public override string ToString() => writer.ToString();
            }
        }
    }
}

