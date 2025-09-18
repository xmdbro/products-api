# Products API
This project was made as a requirement for the La Salle Computer Society (LSCS) AVP applications for the backend engineer role. Built with Express, MySQL, and Typescript.

# Prerequisites
 - Node.js (18.x or later recommended)
 - npm (or yarn)
 - MySQL
  
# Setup
1. Clone the Repository
   ```
   https://github.com/xmdbro/products-api
   cd products-api
   ``` 
2. Install dependencies using `npm install`
3. Set up the database
   - Make sure your MySQL server is running. Connect to your instance and execute the SQL script provided in [schema.sql](schema.sql) to create `products_db` and the `products` table
4. Configure ENV variables. A sample `.env` file is provided in the repository.
5. Run the application using `npm run dev`. You should also be able to build and run on production. (I think)

# API Endpoints
| Method | Endpoint | Description | Success Response |
|---|---|---|---|
| POST | `/products` | Creates a new product. Requires product data in the request body. | `201 Created` - Returns the newly created product object. |
| GET | `/products` | Retrieves a list of all products. Supports `limit` and `offset` for pagination. | `200 OK` - Returns an array of product objects. |
| GET | `/products/:id` | Retrieves a single product by its unique ID. | `200 OK` - Returns the specific product object. |
| PUT | `/products/:id` | Updates an existing product's details. | `200 OK` - Returns the fully updated product object. |
| DELETE | `/products/:id` | Deletes a product by its ID. | `200 OK` - Returns a confirmation message. |
# Testing
Run unit and integration tests using vitest with `npm run test`. Tests are located in [tests/products.test.ts](tests/products.test.ts).