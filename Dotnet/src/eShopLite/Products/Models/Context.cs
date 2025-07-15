using Microsoft.EntityFrameworkCore;
using DataEntities;
using System.Collections.Generic;

namespace Products.Models
{
    public class Context : DbContext
    {
        // DbSet representing the Products table in the database
        public DbSet<Product> Products { get; set; } = null!;

        // Constructor accepting DbContextOptions to configure the context
        public Context(DbContextOptions<Context> options) : base(options)
        {
            // Constructor intentionally empty
        }


        // This prevents potential configuration conflicts
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Only use this configuration if no options have been configured yet
            if (!optionsBuilder.IsConfigured) {
                optionsBuilder.UseSqlite("Data Source=products.db");
            }
        }

        // Retrieve a product by its ID asynchronously
        public async Task<Product?> GetAsync(int id)
        {
            return await Products.FindAsync(id);
        }

        // Retrieve all products asynchronously
        public async Task<List<Product>> GetAllAsync()
        {
            return await Products.ToListAsync();
        }

        // Create a new product asynchronously
        public async Task CreateAsync(Product product)
        {
            await Products.AddAsync(product);
            await SaveChangesAsync();
        }

        // Update an existing product asynchronously
        public async Task<bool> UpdateAsync(Product product)
        {
            var existingProduct = await Products.FindAsync(product.Id);
            if (existingProduct != null) {
                Entry(existingProduct).CurrentValues.SetValues(product);
                await SaveChangesAsync();
                return true;
            }
            return false;
        }

        // Delete a product by its ID asynchronously
        public async Task<bool> DeleteAsync(int id)
        {
            var product = await Products.FindAsync(id);
            if (product != null) {
                Products.Remove(product);
                await SaveChangesAsync();
                return true;
            }
            return false;
        }

    }
}
