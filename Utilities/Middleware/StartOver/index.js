const chatHistory = require("../../../integrations/chatHistory");

module.exports = [
  (session, next) => {
    console.log("in startover------\n\n\n",session.message)
    let data = session.message;
    if (data.address.user.user_id) {
      let text = data.text.includes("{") ? JSON.parse(data.text) : data.text;
      if (!text.userName) {
        sender = {
          userId: data.address.user.user_id,
          data: [
            {
              sessionId : data.id,
              from: "user",
              text: text,
              payload: data.payload ? data.payload : "",
              date : new Date()
            }
          ]
        };
        console.log("chathistory level----------\n\n\n",sender)
        chatHistory(sender);
      }
    }
    // if (data.text === "start over") {
    //   session.message.text = "Hello"
    //   session.clearDialogStack();
    //   session.endDialogWithResult({ response: true });
    // }
    if (data.text === "ECROFHCETDAOLPU") {
      session.message.text = "ECROFHCETDAOLPU"
      session.clearDialogStack();
      session.endDialogWithResult({ response: true });
    }else if (data.text === "Categorize Information Systems") {
      session.message.text = "Categorize Information Systems"
      session.clearDialogStack();
      session.endDialogWithResult({ response: true });
    }else if (data.text === "Select Security Controls") {
      session.message.text = "Select Security Controls"
      session.clearDialogStack();
      session.endDialogWithResult({ response: true });
    }else if (data.text === "Implement Security Controls") {
      session.message.text = "Implement Security Controls"
      session.clearDialogStack();
      session.endDialogWithResult({ response: true });
    }else if (data.text === "Assess Security Controls") {
      session.message.text = "Assess Security Controls"
      session.clearDialogStack();
      session.endDialogWithResult({ response: true });
    }else if (data.text === "General Data Protection Regulation") {
      session.message.text = "gdpr flow"
      session.clearDialogStack();
      session.endDialogWithResult({ response: true });
    }
    else if(data.text=== "start over"){
      session.message.text = "hi"
      session.clearDialogStack();
      session.endDialogWithResult({ response: true });

    }
    next();
  }
];
