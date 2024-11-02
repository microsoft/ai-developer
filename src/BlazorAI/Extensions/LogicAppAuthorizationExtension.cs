using BlazorAI.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Identity.Abstractions;
using Microsoft.Identity.Client;
using System.Net.Http.Headers;

namespace BlazorAI.Extensions
{
	public class LogicAppAuthorizationExtension(IOptions<LogicAppOptions> options) : DelegatingHandler
	{
		private readonly LogicAppOptions _options = options.Value;

		protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
		{
			request.Headers.Authorization = await GetAccessToken();
			return await base.SendAsync(request, cancellationToken);
		}

		private async Task<AuthenticationHeaderValue> GetAccessToken()
		{
			var clientId = _options.ClientId;
			var tenantId = _options.TenantId;
			var authority = $"https://login.microsoftonline.com/{tenantId}";
			var clientSecret = _options.ClientSecret;
			var apiScope = _options.ApiScope;

			var app = ConfidentialClientApplicationBuilder.Create(clientId)
				.WithClientSecret(clientSecret)
				.WithAuthority(new Uri(authority))
				.Build();

			var scopes = new string[] { $"{apiScope}/.default"};
			var result = await app.AcquireTokenForClient(scopes).ExecuteAsync();

			return new AuthenticationHeaderValue("Bearer", result.AccessToken);
		}
	}
}
