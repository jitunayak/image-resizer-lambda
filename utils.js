const { default: axios } = require("axios")
const GM = require('gm')
const gm = GM.subClass({ imageMagick: true })
const FileType = require("file-type")
const { buffer } = require("stream/consumers")
const AWS = require('aws-sdk')
const s3 = AWS.S3()

exports.downloadImage = async (url) => {
    const res = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(res.data, 'binary')
}

exports.resizeImage = async (buffer, width, height) => {
    return new Promise((resolve, reject) => {
        gm(buffer).resize(width, height).noProfile()
            .toBuffer((err, buffer) => err ? reject(err) : resolve(buffer))
    })
}

exports.saveToS3 = async (bucket, key, image) => {
    const contentType = await FileType.fromBuffer(image);

    const params = {
        Bucket: bucket,
        Key: key + contentType.ext,
        Body: image,
        ConetentEncoding: 'base64',
        ContentType: contentType.mime
    }
    await s3.putObject({ params }).promise();
}

