import { SQL, sql } from 'drizzle-orm';
import { AnyPgColumn } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import { JWTPayload } from '../types/user';
import { sellerProfiles } from '../db/schema';
import db from '../db/db';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { CLOUDINARY } from '../config/config';
import { randomBytes } from 'crypto';
import { ProductImage } from '../graphql/generated/types.generated';

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

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export async function isSeller(token:JWTPayload) {

    const { subject } = token

    if (!subject) return null;

    const sellerProfile = await db.query.sellerProfiles.findFirst({
        where: eq(sellerProfiles.userId, subject)
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

export async function removeImagesFiles (imagesObj: ProductImage[]): Promise<string[]> {

    const imagesToDestroy = imagesObj.filter(img => Boolean(img.publicId));

    if (imagesToDestroy.length === 0) return [];

    const results = await Promise.all(
        imagesToDestroy.map( async (img) => {
            const cloudRes = await cloudinary.uploader.destroy(img.publicId!);
            return { img, cloudRes }; // for each, retrieve both the img and cloudRes
        })
    );

    return results
        .filter(({ cloudRes })=> !cloudinaryResponses.includes(cloudRes.result)) // "ok" or "not found"
        .map(({img})=>img.publicId!) // <!> because publicId check was performed at first line(l.60)
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

export function shortId(len = 8) {
  return randomBytes(len).toString('hex'); // 8 bytes = 16 char
}