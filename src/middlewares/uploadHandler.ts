import multer from 'multer';


const TEN_MB = 10 * 1024 * 1024;

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: TEN_MB, files: 5 }, // 10 MB, max 5 files
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed!'));
        cb(null, true);

    }
});
