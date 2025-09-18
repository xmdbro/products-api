import pool from './db'; // Assumes db.ts exports a promise-based pool
import { OkPacket, RowDataPacket } from 'mysql2';

export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    tags: string;
    sku: string;
}

// Create a new product and return the complete product object
export const createProduct = async (
    name: string,
    description: string,
    category: string,
    price: number,
    quantity: number,
    tags: string,
    sku: string
): Promise<Product | undefined> => {
    const query = `
        INSERT INTO products (name, description, category, price, quantity, tags, sku)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;


    const [result] = await pool.query<OkPacket>(query, [name, description, category, price, quantity, tags, sku]);
    return getProductByID(result.insertId);
};

// Get all products with pagination
export const getAllProducts = async (limit: number, offset: number): Promise<Product[]> => {
    const query = 'SELECT * FROM products LIMIT ? OFFSET ?';
    const [rows] = await pool.query<RowDataPacket[]>(query, [limit, offset]);
    return rows as Product[];
};

// Get a single product by its ID
export const getProductByID = async (id: number): Promise<Product | undefined> => {
    const query = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
    // rows[0] will be the product object or undefined if not found
    return rows[0] as Product | undefined;
};

// Update a product by its ID
export const updateProduct = async (id: number, updatedFields: Partial<Product>): Promise<OkPacket> => {
    const query = 'UPDATE products SET ? WHERE id = ?';
    const [result] = await pool.query<OkPacket>(query, [updatedFields, id]);
    return result;
};

// Delete a product by its ID
export const deleteProduct = async (id: number): Promise<OkPacket> => {
    const query = 'DELETE FROM products WHERE id = ?';
    const [result] = await pool.query<OkPacket>(query, [id]);
    return result;
};