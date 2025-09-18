import { Router } from 'express';
import {
    createProductHandler,
    getProductsHandler,
    getProductByIdHandler,
    updateProductHandler,
    deleteProductHandler
} from '../controllers/productsController';

const router = Router();

router.post('/', createProductHandler);
router.get('/', getProductsHandler);
router.get('/:id', getProductByIdHandler);
router.put('/:id', updateProductHandler);
router.delete('/:id', deleteProductHandler)

export { router as productsRouter };