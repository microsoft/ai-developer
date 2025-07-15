using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Models;
using DataEntities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Embeddings;
using Products.Memory;
using Products.Models;
using SearchEntities;
using System.Diagnostics;

#pragma warning disable SKEXP0001 

namespace Products.Endpoints;

public static class ProductEndpoints
{
    /// <summary>
    /// Maps all product-related endpoints to the specified route builder.
    /// </summary>
    /// <param name="routes">The route builder to map the endpoints to.</param>
    public static void MapProductEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/Product");

        /// <summary>
        /// Retrieves all products from the database.
        /// </summary>
        group.MapGet("/", async (Context db) => {
            return await db.GetAllAsync();
        })
        .WithName("GetAllProducts")
        .Produces<List<Product>>(StatusCodes.Status200OK);

        /// <summary>
        /// Retrieves a product by its ID.
        /// </summary>
        /// <param name="id">The ID of the product to retrieve.</param>
        /// <param name="db">The database context.</param>
        group.MapGet("/{id}", async (int id, Context db) => {
            return await db.GetAsync(id)
                is Product model
                    ? Results.Ok(model)
                    : Results.NotFound();
        })
        .WithName("GetProductById")
        .Produces<Product>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        /// <summary>
        /// Updates an existing product by its ID.
        /// </summary>
        /// <param name="id">The ID of the product to update.</param>
        /// <param name="product">The updated product data.</param>
        /// <param name="db">The database context.</param>
        group.MapPut("/{id}", async (int id, Product product, Context db) => {
            var item = await db.GetAsync(id);
            if (item == null) {
                return Results.NotFound();
            }
            item.Name = product.Name;
            item.Description = product.Description;
            item.Price = product.Price;
            item.ImageUrl = product.ImageUrl;
            return Results.NoContent();
        })
        .WithName("UpdateProduct")
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status204NoContent);

        /// <summary>
        /// Creates a new product.
        /// </summary>
        /// <param name="product">The product to create.</param>
        /// <param name="db">The database context.</param>
        group.MapPost("/", async (Product product, Context db) => {
            await db.CreateAsync(product);
            return Results.Created($"/api/Product/{product.Id}", product);
        })
        .WithName("CreateProduct")
        .Produces<Product>(StatusCodes.Status201Created);

        /// <summary>
        /// Deletes a product by its ID.
        /// </summary>
        /// <param name="id">The ID of the product to delete.</param>
        /// <param name="db">The database context.</param>
        group.MapDelete("/{id}", async (int id, Context db) => {
            var affected = await db.DeleteAsync(id);

            return affected ? Results.Ok() : Results.NotFound();
        })
        .WithName("DeleteProduct")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        /// <summary>
        /// Searches for products by a keyword in their name.
        /// </summary>
        /// <param name="search">The search keyword.</param>
        /// <param name="db">The database context.</param>
        group.MapGet("/search/{search}", async (string search, Context db) => {
            var stopwatch = new Stopwatch();
            stopwatch.Start();

            // Simple case-insensitive keyword search on name field
            List<Product> products = db.Products.Where(p => EF.Functions.Like(p.Name, $"%{search}%")).ToList();

            stopwatch.Stop();

            var response = new SearchResponse();
            response.Products = products;
            response.Response = products.Count > 0 ?
                $"{products.Count} Products found for [{search}]" :
                $"No products found for [{search}]";
            response.ElapsedTime = stopwatch.Elapsed;
            return response;
        })
        .WithName("SearchAllProducts")
        .Produces<List<Product>>(StatusCodes.Status200OK);

        /// <summary>
        /// Initializes AI search for products.
        /// </summary>
        /// <param name="db">The database context.</param>
        /// <param name="mc">The AI search initializer.</param>
        group.MapGet("/initaisearch", async (Context db, AiSearchInitializer mc) => {
            bool success = await mc.InitAiSearchAsync(db);
            return success ? Results.Ok("Successfully Initialized AI Search") : Results.InternalServerError("Failed to Initialized AI Search");
        })
        .WithName("Initialize AI Search")
        .Produces<List<Product>>(StatusCodes.Status200OK);
    }
}
