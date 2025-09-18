import { Request, Response } from 'express';
import Joi from 'joi';
import {
  createProduct,
  getAllProducts,
  getProductByID,
  updateProduct,
  deleteProduct,
} from '../models/productsModel';

// Validation schema for creating a product
const productSchema = Joi.object({
    name: Joi.string().min(1).required().messages({
        'string.empty': 'Name cannot be empty',
        'any.required': 'Name is required',
    }),
    description: Joi.string().optional(),
    category: Joi.string().optional(),
    price: Joi.number().positive().required().messages({
        'number.base': 'Price must be a valid number',
        'number.positive': 'Price must be greater than 0',
        'any.required': 'Price is required',
    }),
    quantity: Joi.number().integer().min(0).required().messages({
        'number.base': 'Quantity must be a valid number',
        'number.min': 'Quantity cannot be negative',
        'any.required': 'Quantity is required',
    }),
    tags: Joi.string().optional(),
    sku: Joi.string().optional(),
});

// Validation schema for updating a product
const updateProductSchema = Joi.object({
    name: Joi.string().min(1),
    description: Joi.string(),
    category: Joi.string(),
    price: Joi.number().positive(),
    quantity: Joi.number().integer().min(0),
    tags: Joi.string(),
    sku: Joi.string(),
});

// Handler for creating a product
export const createProductHandler = async (req: Request, res: Response) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) {
        return res.status(400).json({ message: 'Validation error.', details: error.details[0].message });
        }

        const { name, description, category, price, quantity, tags, sku } = req.body;
        
        const newProduct = await createProduct(name, description, category, price, quantity, tags, sku);
        res.status(201).json(newProduct);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Handler for updating a product
export const updateProductHandler = async (req: Request, res: Response) => {
    try {
        const { error } = updateProductSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: 'Validation error.', details: error.details[0].message });
        }

        const result = await updateProduct(Number(req.params.id), req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await getProductByID(Number(req.params.id));
        res.status(200).json(updatedProduct);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Handler for fetching all products
export const getProductsHandler = async (req: Request, res: Response) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const products = await getAllProducts(Number(limit), Number(offset));
        res.status(200).json(products);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
};

// Handler for fetching a single product by ID
export const getProductByIdHandler = async (req: Request, res: Response) => {
    try {
        const product = await getProductByID(Number(req.params.id));

        if (!product) {
        return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching product', error: err.message });
    }
};

// Handler for deleting a product by ID
export const deleteProductHandler = async (req: Request, res: Response) => {
    try {
        const result = await deleteProduct(Number(req.params.id));

        if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
};