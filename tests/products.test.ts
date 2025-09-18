import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import connection from '../src/models/db'

beforeAll(async () => {
    await connection.query('TRUNCATE TABLE products');

    await connection.query(`
        INSERT INTO products (name, description, category, price, quantity, tags, sku)
        VALUES ('Test Product 2',
        'Yet another test product description',
        'Electronics',
        110.0,
        100,
        'test, electronics, clearance, headphones, gaming',
        'sku420')
    `);
});

afterAll(async () => {
    await connection.query('TRUNCATE TABLE products');

    await connection.end();
});

describe('Products API', () => {
    let newProductId: number;

    // Test for creating a new product
    it('should create a new product', async () => {
        const newProduct = {
            name: 'Test Product',
            description: 'This is the test product description',
            category: 'Electronics',
            price: 100.0,
            quantity: 10,
            tags: 'electronics, sale, test, laptops, gadgets',
            sku: '69420'
        };

        const response = await request(app).post('/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        newProductId = response.body.id;
    });

    // Test for getting all products
    it('should get all products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    })

    // Test for getting a single product by ID
    it('should retrieve a product by ID', async () => {
        const response = await request(app).get(`/products/${newProductId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', newProductId);
    });

    // Test for updating a product by its ID
    it('should update a product by ID', async () => {
        const productIdToBeUpdated = 1;
        const updatedProduct = {
            name: 'This is an updated name',
            price: 120.0,
            quantity: 15,
            description: 'This is an updated product'
        };

        const response = await request(app).put(`/products/${productIdToBeUpdated}`).send(updatedProduct);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', productIdToBeUpdated);
        expect(response.body).toHaveProperty('price', '120.00');
        expect(response.body).toHaveProperty('name', 'This is an updated name')
    });

    // Test for deleting a product with its ID
    it('should delete a product by ID', async () => {
        const productId = 1;
        const response = await request(app).delete(`/products/${productId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Product deleted successfully');
    });

    it('should return 400 Bad Request if validation fails', async () => {
        const invalidProduct = {
            description: 'Invalid product without a name',  
        };

        const response = await request(app).post('/products').send(invalidProduct);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation error.');
        expect(response.body.details).toBe('Name is required');
    });
});