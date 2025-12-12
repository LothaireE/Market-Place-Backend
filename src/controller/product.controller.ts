import { Request, Response } from 'express';
import { MAIN_SERVER_LABEL } from '../config/config';
import {  isSeller } from '../utils/utils';
import { decodeAccessToken } from '../utils/tokens';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/messages';
import { ProductService } from '../product/services/product.services';




class ProductController {
    static async create(req: Request | any, res: Response) {
        const token = decodeAccessToken(req.headers.authorization);
        if (!token) return res.status(403).json({ error: ERROR_MESSAGES.AUTH.MISSING_HEADER });

        const sellerProfile = await isSeller(token?.subject);
        if (!sellerProfile) return res.status(403).json({ error: ERROR_MESSAGES.SELLER.NOT_FOUND });

        try {
            const newProduct = await ProductService.createProduct(sellerProfile.id, req.body, req.files)
            
            return res.status(200).json({
                message: SUCCESS_MESSAGES.PRODUCT.CREATED,
                timestamp: new Date().toISOString(),
                product: newProduct
            });

        } catch (error:any) {
            logging.error(error, MAIN_SERVER_LABEL);
            if (error.message === 'PRODUCT_ALREADY_EXIST') {
                return res
                    .status(409)
                    .json({ error: ERROR_MESSAGES.PRODUCT.ALREADY_EXIST});
            }
            return res
                .status(500)
                .json({ error: ERROR_MESSAGES.COMMON.INTERNAL_ERROR });
        }
    }
    
    static async delete(req: Request | any, res: Response) {
        const token = decodeAccessToken(req.headers.authorization);
        if (!token) return res.status(403).json({ error: ERROR_MESSAGES.AUTH.MISSING_HEADER });

        const sellerProfile = await isSeller(token?.subject);
        if (!sellerProfile) return res.status(403).json({ error: ERROR_MESSAGES.SELLER.NOT_FOUND });

        try {
            const result = await ProductService.deleteProduct(sellerProfile.id, req.body.productId)

            return res.status(200).json({
                message: SUCCESS_MESSAGES.PRODUCT.DELETED,
                timestamp: new Date().toISOString(),
                product: result 
            });

        } catch (error:any) {
            logging.error(error, MAIN_SERVER_LABEL);
            if (error.message === 'PRODUCT_NOT_FOUND') {
                return res
                    .status(409)
                    .json({ error: ERROR_MESSAGES.PRODUCT.NOT_FOUND});
            }
            return res
                .status(500)
                .json({ error: ERROR_MESSAGES.COMMON.INTERNAL_ERROR });
        }    
    }

    static async update(req: Request | any, res: Response) {
        const token = decodeAccessToken(req.headers.authorization);
        if (!token) return res.status(403).json({ error: ERROR_MESSAGES.AUTH.MISSING_HEADER });

        const sellerProfile = await isSeller(token.subject);
        if (!sellerProfile) return res.status(403).json({ error: ERROR_MESSAGES.SELLER.NOT_FOUND });

        try {
            const result = await ProductService.updateProduct(sellerProfile.id, req.body, req.files)

            return res.status(200).json({
                message: SUCCESS_MESSAGES.PRODUCT.UPDATED,
                timestamp: new Date().toISOString(),
                product: result 
            });

        } catch (error:any) {
            logging.error(error, MAIN_SERVER_LABEL);
            if (error.message === 'PRODUCT_NOT_FOUND') {
                return res
                    .status(409)
                    .json({ error: ERROR_MESSAGES.PRODUCT.NOT_FOUND});
            }
            return res
                .status(500)
                .json({ error: ERROR_MESSAGES.COMMON.INTERNAL_ERROR });
        }
    }
}

export default ProductController;
