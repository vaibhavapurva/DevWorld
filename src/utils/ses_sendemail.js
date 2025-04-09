// snippet-start:[ses.JavaScript.email.sendEmailV3]
const { SendEmailCommand } =  require("@aws-sdk/client-ses");
const sesClient  =  require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, subject, message) => {
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
          Data: `<h1> ${message} </h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "this is the text email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (subject, message) => {
  const sendEmailCommand = createSendEmailCommand(
    "vaibhavapurva17@gmail.com",
    "vaibhavapurvadewas@gmail.com",
    subject,
    message
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