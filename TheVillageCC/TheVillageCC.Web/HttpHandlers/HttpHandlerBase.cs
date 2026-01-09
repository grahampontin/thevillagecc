using System;
using System.Collections.Specialized;
using System.IO;
using System.Web;

namespace TheVillageCC.Web.HttpHandlers
{
    // Minimal request abstraction used by handlers to avoid direct HttpContext dependency in tests
    public interface IRequestContext
    {
        string HttpMethod { get; }
        Stream InputStream { get; }
        Uri Url { get; }
        NameValueCollection QueryString { get; }
    }

    // Minimal response abstraction used by handlers
    public interface IResponseContext
    {
        string ContentType { get; set; }
        void Write(string text);
        int StatusCode { get; set; }
        void End();
    }

    // Combined handler context used by handlers
    public interface IHandlerContext
    {
        IRequestContext Request { get; }
        IResponseContext Response { get; }
    }

    // Concrete wrapper over System.Web.HttpContext implementing IHandlerContext
    public class HttpContextWrapperForHandlers : IHandlerContext
    {
        public HttpContextWrapperForHandlers(HttpContext context)
        {
            Request = new HttpRequestWrapperForHandlers(context.Request);
            Response = new HttpResponseWrapperForHandlers(context.Response);
        }

        public IRequestContext Request { get; }
        public IResponseContext Response { get; }

        private class HttpRequestWrapperForHandlers : IRequestContext
        {
            private readonly HttpRequest _request;
            public HttpRequestWrapperForHandlers(HttpRequest request)
            {
                _request = request;
            }
            public string HttpMethod => _request.HttpMethod;
            public Stream InputStream => _request.InputStream;
            public Uri Url => _request.Url;
            public NameValueCollection QueryString => _request.QueryString;
        }

        private class HttpResponseWrapperForHandlers : IResponseContext
        {
            private readonly HttpResponse _response;
            public HttpResponseWrapperForHandlers(HttpResponse response)
            {
                _response = response;
            }

            public string ContentType
            {
                get => _response.ContentType;
                set => _response.ContentType = value;
            }

            public void Write(string text) => _response.Write(text);
            public int StatusCode
            {
                get => _response.StatusCode;
                set => _response.StatusCode = value;
            }

            public void End() => _response.End();
        }
    }

    // Base class that implements IHttpHandler and converts HttpContext into IHandlerContext for derived handlers
    public abstract class HttpHandlerBase : IHttpHandler
    {
        public bool IsReusable => true;

        // Entry point called by ASP.NET runtime - wraps HttpContext
        public void ProcessRequest(HttpContext context)
        {
            var wrapped = new HttpContextWrapperForHandlers(context);
            ProcessRequest(wrapped);
        }

        // Testable entry point for derived handlers
        public abstract void ProcessRequest(IHandlerContext context);
    }
}

