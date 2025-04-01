using Microsoft.EntityFrameworkCore;
using DataEntities;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Products.Models
{
    public class Context : DbContext
    {
        // DbSet representing the Products table in the database
        public DbSet<Product> Products { get; set; }

        // Constructor accepting DbContextOptions to configure the context
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        // Configuring the DbContext to use SQLite database
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=products.db");
        }

        // Seeding the database with initial data
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Solar Powered Flashlight", Description = "An innovative flashlight that harnesses solar energy, providing reliable illumination for outdoor enthusiasts in any environment.", Price = 19.99m, ImageUrl = "product1.png" },
                new Product { Id = 2, Name = "Hiking Poles", Description = "High-quality hiking poles designed to offer stability and support on challenging terrains, making them ideal for camping and hiking trips.", Price = 24.99m, ImageUrl = "product2.png" },
                new Product { Id = 3, Name = "Outdoor Rain Jacket", Description = "A premium rain jacket engineered to keep you warm and dry in all weather conditions, ensuring maximum comfort during outdoor activities.", Price = 49.99m, ImageUrl = "product3.png" },
                new Product { Id = 4, Name = "Survival Kit", Description = "A comprehensive survival kit equipped with essential tools and supplies, making it a must-have for any outdoor adventurer.", Price = 99.99m, ImageUrl = "product4.png" },
                new Product { Id = 5, Name = "Outdoor Backpack", Description = "A durable and spacious backpack designed to carry all your outdoor essentials, perfect for hiking, camping, and other adventures.", Price = 39.99m, ImageUrl = "product5.png" },
                new Product { Id = 6, Name = "Camping Cookware", Description = "A versatile cookware set specifically designed for outdoor cooking, providing convenience and efficiency for campers.", Price = 29.99m, ImageUrl = "product6.png" },
                new Product { Id = 7, Name = "Camping Stove", Description = "A portable camping stove that offers reliable performance, making it an essential item for cooking outdoors.", Price = 49.99m, ImageUrl = "product7.png" },
                new Product { Id = 8, Name = "Camping Lantern", Description = "A high-performance lantern that provides bright and consistent lighting, perfect for illuminating your campsite.", Price = 19.99m, ImageUrl = "product8.png" },
                new Product { Id = 9, Name = "Camping Tent", Description = "A robust and spacious tent designed to provide comfort and protection during camping trips, ensuring a pleasant outdoor experience.", Price = 99.99m, ImageUrl = "product9.png" }
            );
        }

        // Retrieve a product by its ID
        public Product? Get(int id)
        {
            return Products.Find(id);
        }

        // Retrieve all products
        public List<Product> GetAll()
        {
            return Products.ToList();
        }

        // Create a new product
        public void Create(Product product)
        {
            Products.Add(product);
            SaveChanges();
        }

        // Update an existing product
        public bool Update(Product product)
        {
            var existingProduct = Products.Find(product.Id);
            if (existingProduct != null) {
                Entry(existingProduct).CurrentValues.SetValues(product);
                SaveChanges();
                return true;
            }
            return false;
        }

        // Delete a product by its ID
        public bool Delete(int id)
        {
            var product = Products.Find(id);
            if (product != null) {
                Products.Remove(product);
                SaveChanges();
                return true;
            }
            return false;
        }
    }
}

