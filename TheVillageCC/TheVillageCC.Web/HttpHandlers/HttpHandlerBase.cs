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
            private readonly HttpRequest request;
            public HttpRequestWrapperForHandlers(HttpRequest request)
            {
                this.request = request;
            }
            public string HttpMethod => request.HttpMethod;
            public Stream InputStream => request.InputStream;
            public Uri Url => request.Url;
            public NameValueCollection QueryString => request.QueryString;
        }

        private class HttpResponseWrapperForHandlers : IResponseContext
        {
            private readonly HttpResponse response;
            public HttpResponseWrapperForHandlers(HttpResponse response)
            {
                this.response = response;
            }

            public string ContentType
            {
                get => response.ContentType;
                set => response.ContentType = value;
            }

            public void Write(string text) => response.Write(text);
            public int StatusCode
            {
                get => response.StatusCode;
                set => response.StatusCode = value;
            }

            public void End() => response.End();
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

