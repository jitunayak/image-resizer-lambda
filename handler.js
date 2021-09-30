'use strict';

const { downloadImage, resizeImage, saveToS3 } = require("./utils");
const url = "https://miro.medium.com/max/3200/1*-P0w5Fgk5Ixj_3IEmjAL7g@2x.png"
const bucket = 'swiggy-images'
exports.hello = async (event) => {

  const image = await downloadImage(url)
  const resizedImage = await resizeImage(image, 100, 100)
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
