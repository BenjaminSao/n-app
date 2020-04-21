"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nivinjoseph/n-ext");
const Sharp = require("sharp");
const loaderUtils = require("loader-utils");
const Path = require("path");
const n_util_1 = require("@nivinjoseph/n-util");
const imagemin = require("imagemin");
function resize(filePath, width, height, format, jpegQuality) {
    const promise = new Promise((resolve, reject) => {
        let s = Sharp(filePath);
        if (width || height)
            s = s.resize(width, height);
        if (format === "jpeg")
            s = s.jpeg({ quality: jpegQuality });
        s.toBuffer((err, buf, info) => {
            err ? reject(err) : resolve({
                ext: info.format.toLowerCase(),
                width: info.width,
                height: info.height,
                size: info.size,
                data: buf
            });
        });
    });
    return promise;
}
function default_1(content) {
    const MIMES = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif"
    };
    const ext = Path.extname(this.resourcePath).replace(/\./, "").toLowerCase();
    if (!MIMES[ext])
        throw new Error(`Unsupported format for file '${this.resourcePath}'`);
    const parsedResourceQuery = this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : {};
    Object.keys(parsedResourceQuery)
        .filter(t => ["width", "height"].contains(t))
        .forEach(t => parsedResourceQuery[t] = n_util_1.TypeHelper.parseNumber(parsedResourceQuery[t]));
    const { width, height, format } = parsedResourceQuery;
    const options = loaderUtils.getOptions(this) || {};
    const context = options.context || this.rootContext;
    const limit = options.urlEncodeLimit;
    const jpegQuality = options.jpegQuality || 80;
    const pngQuality = Number.parseFloat(((options.pngQuality || 80) / 100).toFixed(1));
    const callback = this.async();
    const plugins = [
        require("imagemin-gifsicle")({}),
        require("imagemin-mozjpeg")({ quality: jpegQuality }),
        require("imagemin-pngquant")({ quality: [pngQuality, pngQuality] }),
    ];
    resize(this.resourcePath, width, height, format, jpegQuality)
        .then(resized => {
        imagemin.buffer(resized.data, { plugins })
            .then((data) => {
            const size = data.byteLength;
            if (limit && size <= limit) {
                const base64 = JSON.stringify("data:" + MIMES[resized.ext] + ";" + "base64," + data.toString("base64"));
                callback(null, `module.exports = ${base64}`);
            }
            else {
                const url = loaderUtils.interpolateName(this, `[contenthash].${resized.ext}`, {
                    context,
                    content: data
                });
                const outputPath = url;
                const publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;
                this.emitFile(outputPath, data);
                callback(null, `module.exports = ${publicPath}`);
            }
        })
            .catch((e) => callback(e));
    })
        .catch(e => callback(e));
}
exports.default = default_1;
exports.raw = true;
//# sourceMappingURL=raster-image-loader.js.map