using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Products.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table => {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Description", "ImageUrl", "Name", "Price" },
                values: new object[,]
                {
                    { 1, "An innovative flashlight that harnesses solar energy, providing reliable illumination for outdoor enthusiasts in any environment.", "product1.png", "Solar Powered Flashlight", 19.99m },
                    { 2, "High-quality hiking poles designed to offer stability and support on challenging terrains, making them ideal for camping and hiking trips.", "product2.png", "Hiking Poles", 24.99m },
                    { 3, "A premium rain jacket engineered to keep you warm and dry in all weather conditions, ensuring maximum comfort during outdoor activities.", "product3.png", "Outdoor Rain Jacket", 49.99m },
                    { 4, "A comprehensive survival kit equipped with essential tools and supplies, making it a must-have for any outdoor adventurer.", "product4.png", "Survival Kit", 99.99m },
                    { 5, "A durable and spacious backpack designed to carry all your outdoor essentials, perfect for hiking, camping, and other adventures.", "product5.png", "Outdoor Backpack", 39.99m },
                    { 6, "A versatile cookware set specifically designed for outdoor cooking, providing convenience and efficiency for campers.", "product6.png", "Camping Cookware", 29.99m },
                    { 7, "A portable camping stove that offers reliable performance, making it an essential item for cooking outdoors.", "product7.png", "Camping Stove", 49.99m },
                    { 8, "A high-performance lantern that provides bright and consistent lighting, perfect for illuminating your campsite.", "product8.png", "Camping Lantern", 19.99m },
                    { 9, "A robust and spacious tent designed to provide comfort and protection during camping trips, ensuring a pleasant outdoor experience.", "product9.png", "Camping Tent", 99.99m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
