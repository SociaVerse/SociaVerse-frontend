import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file to a smaller size.
 * default options: max 1MB, max 1920px width/height
 */
export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type as string,
    };

    try {
        const compressedFile = await imageCompression(file, options);

        // Ensure the compressed file has the original name and type
        const finalFile = new File([compressedFile], file.name, {
            type: compressedFile.type,
            lastModified: Date.now()
        });

        // If compression somehow results in a larger file (rare but possible with low quality originals), return original
        if (finalFile.size > file.size) {
            return file;
        }
        return finalFile;
    } catch (error) {
        console.error("Image compression failed:", error);
        return file; // Return original on error to not block upload
    }
}
