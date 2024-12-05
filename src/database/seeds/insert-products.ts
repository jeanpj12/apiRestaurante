import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("products").insert([
        { name: "Cheeseburger", price: 12.99 },
        { name: "Veggie Burger", price: 11.49 },
        { name: "Chicken Sandwich", price: 13.25 },
        { name: "Margherita Pizza", price: 19.99 },
        { name: "Pepperoni Pizza", price: 21.99 },
        { name: "Caesar Salad", price: 9.99 },
        { name: "Grilled Salmon", price: 25.99 },
        { name: "Beef Steak", price: 29.99 },
        { name: "Pasta Alfredo", price: 16.49 },
        { name: "Taco Plate", price: 14.99 },
        { name: "Sushi Roll", price: 12.49 },
        { name: "Fried Rice", price: 10.99 },
        { name: "Pad Thai", price: 14.99 },
        { name: "Ice Cream Sundae", price: 7.99 },
        { name: "Apple Pie", price: 6.49 }
    ]);
};
