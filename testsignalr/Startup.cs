using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(testsignalr.Startup))]

namespace testsignalr
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var hubConfig = new Microsoft.AspNet.SignalR.HubConfiguration();
            hubConfig.EnableDetailedErrors = true;
            hubConfig.EnableJavaScriptProxies = true;
            hubConfig.EnableJSONP = true;
            app.MapSignalR(hubConfig);
        }
    }
}
