'use strict';

const { downloadImage, resizeImage, saveToS3, getObjectFromS3 } = require("./utils");
const bucket = process.env.BUCKET_NAME

exports.hello = async (event) => {

  const imageUrlFromS3 = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  //const imageUrlFromS3 = "image0.jpg"
  console.log(imageUrlFromS3)

  //const image = await downloadImage(url)
  const image = await getObjectFromS3(imageUrlFromS3)
  console.log(`Received ${imageUrlFromS3} from S3 event`)
  const resizedImage = await resizeImage(image, 100, 100)
  const key = await saveToS3(bucket, resizedImage)
  console.log(`Image has been resized successfully ${key}`)

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
