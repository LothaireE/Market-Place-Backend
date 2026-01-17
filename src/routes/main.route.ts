import { Router } from 'express';
import ProductController from '../controller/product.controller';
import { upload } from '../middlewares/uploadHandler';

const mainRouter = Router();

// I need to add requireAccessToken before multer middleware 
mainRouter.post("/main/products/create", upload.array("files"), ProductController.create);
mainRouter.put("/main/products/update", upload.array("files"), ProductController.update);
mainRouter.post("/main/products/delete", ProductController.delete);

export default mainRouter;
