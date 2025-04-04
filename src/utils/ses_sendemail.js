// snippet-start:[ses.JavaScript.email.sendEmailV3]
const { SendEmailCommand } =  require("@aws-sdk/client-ses");
const sesClient  =  require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "<h1> this is the email boday </h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "this is the text email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "hello DevConnect",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "vaibhavapurva17@gmail.com",
    "vaibhavapurvadewas@gmail.com",
  );

  try {
    // console.log(sesClient)
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    console.log("caught",caught)
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports =  {run} ;