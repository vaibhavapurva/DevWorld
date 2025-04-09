// snippet-start:[ses.JavaScript.createclientv3]
const { SESClient } =  require("@aws-sdk/client-ses");

// Set the AWS Region.
const REGION = "ap-south-1";
// Create SES service object.
console.log("--------------------------", process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_KEY)
const sesClient = new SESClient({ region: REGION, credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_KEY 
} });
module.exports =  sesClient ;
// snippet-end:[ses.JavaScript.createclientv3]