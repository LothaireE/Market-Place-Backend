import { ERROR_MESSAGES } from "../../constants/messages";
import { CreateProductInput } from "../../graphql/generated/types.generated";
import { deleteRemoteImages, shortId, uploadImagesFiles, imagesToString, imagesJsonToPublicIds } from "../../utils/utils";
import { ProductModel } from "../models/product.model";


type UpdateValues = Partial<CreateProductInput> & {
      id: string;
      sellerId: string;
    } 


export class ProductService {
    
    static async createProduct(
        sellerProfileId: string,
        productData: CreateProductInput,
        files : Express.Multer.File[] | [],
    ) {

        const folderName = productData.name.trim().split(' ').join('_') + "_" + shortId() // I should store the folder name in db (fender_stratocaster_ab12cd34)

        const uploads = await Promise.all(files.map((file) => 
            uploadImagesFiles(file.buffer, folderName)));

        
        const imagesBaseName = productData.name.trim().split(' ').join('_');
        
        productData.imagesJson = imagesToString(uploads, imagesBaseName)

        const newProductValues = {
            name: productData.name,
            description: productData.description ?? null,
            price: productData.price,
            size: productData.size ?? null,
            imagesJson: productData.imagesJson,
            condition: productData.condition ?? "GOOD",
            sellerId: sellerProfileId, 
        };

        const result = await ProductModel.create(newProductValues);

        return result
    }

    static async updateProduct(
        sellerId: string,
        productUpdate: Partial<CreateProductInput> & { id: string, name: string, imagesToRemove?: string[] },
        files? : Express.Multer.File[] | [],
    ) {
        const product = await ProductModel.findWithSellerId(productUpdate.id, sellerId);
        if (!product) throw new Error(ERROR_MESSAGES.PRODUCT.NOT_FOUND);
        const updateValues : UpdateValues = { ...productUpdate, sellerId };

        const imagesToRemoveFromDb : string[] =[];  // array of images publicIds

        if (productUpdate.imagesToRemove && productUpdate.imagesToRemove.length > 0) {  // removing images from cloudinary 
            const deletions = await deleteRemoteImages(productUpdate.imagesToRemove);

            if (deletions.length > 0) {
                logging.error(`could not destroy following images: ${deletions}`)
                throw new Error(ERROR_MESSAGES.PRODUCT.IMAGES_DESTROY_FAILED );
            }

            imagesToRemoveFromDb.push(...productUpdate.imagesToRemove); // collect publicIds to remove from updateValues.imagesJson
        }

        if (imagesToRemoveFromDb.length > 0) {  // updateValues.imagesJson without removals
            updateValues.imagesJson = product.imagesJson?.filter(imgStr => { 
                const imgObj = JSON.parse(imgStr);
                return !imagesToRemoveFromDb.includes(imgObj.publicId);
            });
        }
        
        if (files && files.length > 0) { // handling new uploads
            const existingName = productUpdate.name ?? (await ProductModel.getProductName(productUpdate.id));
            updateValues.name = existingName as string;

            const baseName = existingName.trim().split(" ").join("_");
            const folderName = `${baseName}_${shortId()}`;

            const uploads = await Promise.all(files.map((file) => 
                uploadImagesFiles(file.buffer, folderName)));

            const currentImagesJson = updateValues.imagesJson || product.imagesJson || [];

            const currentPublicIds = imagesJsonToPublicIds(updateValues.imagesJson ?? product.imagesJson);

            const startIdx = currentPublicIds.length;
            
            const newImagesJson = imagesToString(uploads, baseName, startIdx);

            updateValues.imagesJson = [ ...currentImagesJson, ...newImagesJson ];
        }

        const result = await ProductModel.update(updateValues)

        return result;
    }
    

    static async deleteProduct(
        sellerId: string, 
        productId: string
    ) {
        const product = await ProductModel.findWithSellerId(productId, sellerId)
       if (!product) throw new Error(ERROR_MESSAGES.PRODUCT.NOT_FOUND);
         
        const publicIds = imagesJsonToPublicIds(product.imagesJson)

        const deletions = await deleteRemoteImages(publicIds) // removing images from cloudinary
        if (deletions.length > 0) {
            logging.error(`could not destroy following images: ${deletions}`)
            throw new Error(ERROR_MESSAGES.PRODUCT.IMAGES_DESTROY_FAILED );
        }
        
        const result = await ProductModel.delete(sellerId, productId) // deleting product from db

        return result
    }
}
