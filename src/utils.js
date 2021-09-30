const { default: axios } = require("axios")
const FileType = require("file-type")
const AWS = require('aws-sdk')
const sharp = require("sharp")
const s3 = new AWS.S3()
const bucketName = process.env.BUCKET_NAME
exports.downloadImage = async (url) => {
    const res = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(res.data, 'binary')
}

exports.getObjectFromS3 = async (key) => {
    const image = await s3.getObject({ Bucket: bucketName, Key: key }).promise();
    return image;
}

exports.resizeImage = async (buff, width, height) => {
    const key = 'lambda-' + new Date().toISOString() + ".jpg"
    const resizedImage = await sharp(buff.Body).resize(300, 300).toBuffer().catch(err => console.error(err));
    return resizedImage

}

exports.saveToS3 = async (bucket, image) => {
    const contentType = await FileType.fromBuffer(image);
    const key = 'lambda-generated-' + new Date().toISOString() + '.' + contentType.ext;
    const params = {
        Bucket: bucket,
        Key: 'processed/' + key,
        Body: image,
        ContentEncoding: 'base64',
        ContentType: contentType.mime
    }
    await s3.putObject(params).promise();
    return key
}

