import type { ImageOutputFormat } from "astro";
import type { LocalImageService } from "astro";
import sharp from "sharp";
import type { AvailableFormatInfo } from "sharp";

type ImageOptions = {
    src: string,
    width: number | undefined,
    height: number | undefined,
    format: AvailableFormatInfo | undefined,
};

const service: LocalImageService = {
    getURL(options, imageConfig) {
        const params = new URLSearchParams();
        params.append("href", typeof options.src == "string" ? options.src : options.src.src);
        options.width && params.append("w", options.width.toString());
        options.height && params.append("h", options.height.toString());
        options.format && params.append("fmt", options.format.toString());
        return `${imageConfig.endpoint.route}?${params}`;
    },
    parseURL(url, _imageConfig) {
        const params = url.searchParams;
        return {
            src: params.get("href")!,
            width: params.has("w") ? parseInt(params.get("w")!) : undefined,
            height: params.has("h") ? parseInt(params.get("h")!) : undefined,
            format: params.get("fmt"),
        };
    },
    async transform(inputBuffer, localTransform, _imageConfig) {
        const options = localTransform as ImageOptions;

        const buffer = await sharp(inputBuffer)
            .toFormat(options.format ? options.format : "png")
            .resize(options.width, options.height)
            .toBuffer({ resolveWithObject: true });
        return {
            data: buffer.data,
            format: buffer.info.format as ImageOutputFormat,
        };
    },
    propertiesToHash: ["width", "height", "fmt"],
};

export default service;
