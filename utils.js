const { default: axios } = require("axios")
const GM = require('gm')
const gm = GM.subClass({ imageMagick: true })
const FileType = require("file-type")
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

exports.downloadImage = async (url) => {
    const res = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(res.data, 'binary')
}

exports.getObjectFromS3 = async (key) => {
    const image = await s3.getObject({ Bucket: 'swiggy-images', Key: key }).promise();
    return image;
}

exports.resizeImage = async (buff, width, height) => {
    return new Promise((resolve, reject) => {
        gm(buff).resize(width, height).noProfile()
            .toBuffer((err, buff) => err ? reject(err) : resolve(buff))
    })
}

exports.saveToS3 = async (bucket, key, image) => {
    const contentType = await FileType.fromBuffer(image);
    key = key + '.' + contentType.ext;
    const params = {
        Bucket: bucket,
        Key: key,
        Body: image,
        ContentEncoding: 'base64',
        ContentType: contentType.mime
    }
    await s3.putObject(params).promise();
    return key
}

