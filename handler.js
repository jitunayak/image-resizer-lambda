'use strict';

const { downloadImage, resizeImage, saveToS3, getObjectFromS3 } = require("./utils");
const bucket = 'zen-store'
exports.hello = async (event) => {
  const imageUrlFromS3 = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  console.log(imageUrlFromS3)

  //const image = await downloadImage(url)
  const image = await getObjectFromS3(imageUrlFromS3)
  console.log(`Received ${imageUrlFromS3} from S3 event`)
  const resizedImage = await resizeImage(image.Body, 100, 100)
  const key = await saveToS3(bucket, 'lambda-' + new Date().toISOString(), resizedImage)
  console.log(key)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: key,
      },

    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
