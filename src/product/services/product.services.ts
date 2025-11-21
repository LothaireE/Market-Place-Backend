import { ERROR_MESSAGES } from "../../constants/messages";
import { CreateProductInput } from "../../graphql/generated/types.generated";
import { removeImagesFiles, shortId, uploadImagesFiles } from "../../utils/utils";
import { ProductModel } from "../models/product.model";


export class ProductService {
    
    static async createProduct(
        sellerProfileId: string,
        productData: CreateProductInput,
        files : Express.Multer.File[] | [],
    ) {

        const folderName = productData.name.trim().split(' ').join('_') + "_" + shortId()

        const uploads = await Promise.all(files.map((file) => 
            uploadImagesFiles(file.buffer, folderName)));

        
        const imagesBaseName = productData.name.trim().split(' ').join('_');
        
        const imagesToString = uploads.map((u, idx) => (JSON.stringify({
            publicId: u.public_id,
            url: u.secure_url,
            width: u.width,
            height: u.height,
            bytes: u.bytes,
            format: u.format,
            name: `${imagesBaseName}_image_${idx + 1}`
        })));


        const newProductValues = {
            name: productData.name,
            description: productData.description ?? null,
            price: productData.price,
            size: productData.size ?? null,
            imagesJson: imagesToString,
            condition: productData.condition ?? "GOOD",
            sellerId: sellerProfileId, 
        };

        const result = await ProductModel.create(newProductValues);

        return result
    }

    static async deleteProduct(sellerId: string, productId: string) {
        const toDestroy = await ProductModel.findWithSellerId(productId, sellerId)

        if (!toDestroy) throw new Error(ERROR_MESSAGES.PRODUCT.NOT_FOUND);
        
        const imagesObj = toDestroy.imagesJson.map((image)=> image && JSON.parse(image))

        const remainingImg = await removeImagesFiles(imagesObj)

        if (remainingImg.length > 0) {
            logging.error(`could not destroy following images: ${remainingImg}`)
            throw new Error(ERROR_MESSAGES.PRODUCT.IMAGES_DESTROY_FAILED );
        }
        
        const result = await ProductModel.delete(sellerId, productId)

        return result
    }
}

