import { SQL, sql } from 'drizzle-orm';
import { AnyPgColumn } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import { sellerProfiles } from '../db/schema';
import db from '../db/db';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { CLOUDINARY } from '../config/config';
import { randomBytes } from 'crypto';


cloudinary.config({ 
  cloud_name: CLOUDINARY.CLOUD_NAME, 
  api_key: CLOUDINARY.API_KEY, 
  api_secret: CLOUDINARY.API_SECRET
});

const cloudinaryResponses = [
    "ok",
    "not found"
]

export function firstElem<T>(array: T[]): T | undefined {
    return array[0];
}

export function shortId(len = 8) {
  return randomBytes(len).toString('hex'); // 8 bytes = 16 char
}

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export async function isSeller(sellerId:string) {
    if (!sellerId) return null;

    const sellerProfile = await db.query.sellerProfiles.findFirst({
        where: eq(sellerProfiles.userId, sellerId)
    })

    return sellerProfile ?? null;
}

export function uploadImagesFiles(fileBuffer: Buffer, folder?: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject)=>{
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: folder },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('No result from Cloudinary'));
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer)
    })
}


export async function deleteRemoteImages (publicIds: string | string[] ): Promise<string[]> {

    const publicIdsArr = Array.isArray(publicIds) ? publicIds : [publicIds];

    if (publicIdsArr.length === 0) return [];

    const results = await Promise.all(
        publicIdsArr.map( async (publicId) => {
            const cloudRes = await cloudinary.uploader.destroy(publicId!);
            return { publicId, cloudRes }; // for each, retrieve both the img and cloudRes
        })
    );

    return results
        .filter(({ cloudRes })=> !cloudinaryResponses.includes(cloudRes.result)) // "ok" or "not found"
        .map(({publicId})=>publicId!) 
}

// not happy with the following method at the moment
export function deleteFolderFromCloudinary (folder: string): Promise<UploadApiResponse> {
    return new Promise ((resolve, reject)=>{
            cloudinary.api.delete_resources_by_prefix(`${folder}/`, (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('No result from Cloudinary'));
                resolve(result);
            });
    })
}


export function imagesToString (uploads:UploadApiResponse[],imagesBaseName: string, startIdx = 0 ) {  
    return uploads.map((u, idx) => (JSON.stringify({
                publicId: u.public_id,
                url: u.secure_url,
                width: u.width,
                height: u.height,
                bytes: u.bytes,
                format: u.format,
                name: `${imagesBaseName}_image_${startIdx+ idx + 1}`
            })));
}

export function imagesJsonToPublicIds (imagesJson: string [] | null): string[] {
    if (!imagesJson || imagesJson.length === 0) return [];

    const publicIds: string[] = imagesJson
        .filter(Boolean)
        .map((imageStr)=>{
            try {
                const imageObj = JSON.parse(imageStr)
                return imageObj.publicId as string || undefined;
            } catch (error) {
                return undefined;
            }
        })
        .filter((publicId)=> publicId !== undefined) as string[];

    return publicIds;
}