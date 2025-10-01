using System.ComponentModel;
using System.Net.Http.Json;
using System.Text.Json;
using Agents.Tools.Models;
using DataEntities;
using Microsoft.SemanticKernel;

namespace Agents.Tools
{
    public class DatabasePlugin
    {
        private readonly HttpClient _httpClient;

        public DatabasePlugin(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https+http://products");
        }

        [KernelFunction, Description("Adds a new product to the database. Returns the int Id of the product created.")]
        public async Task<int> CreateProductData(CreateProductDTO product)
        {
            if (product == null)
            {
                throw new ArgumentNullException(nameof(product), "Product data cannot be null.");
            }

            // Send POST request to the API
            var response = await _httpClient.PostAsJsonAsync("/api/Product", product);

            // Ensure the response is successful
            response.EnsureSuccessStatusCode();

            // Deserialize the response to get the created Product object
            var createdProduct = await response.Content.ReadFromJsonAsync<Product>(new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (createdProduct == null || createdProduct.Id <= 0)
            {
                throw new InvalidOperationException("Failed to create the product. The response did not contain a valid Product object.");
            }

            return createdProduct.Id;
        }
    }
}
