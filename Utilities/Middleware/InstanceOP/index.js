module.exports = [
  (session, next) => {
    if(session.privateConversationData.instanceId){
	console.log("sessionID",session.privateConversationData.instanceId)
    let { instanceId } = session.privateConversationData
      session.sendTyping()
	console.log("global.instanceList",global.instanceList)
      if(global.instanceList && global.instanceList.includes(instanceId)){
        session.clearDialogStack()
        session.replaceDialog('Ask_Greet')
global.instanceList.splice( global.instanceList.indexOf(instanceId), 1 );
      }

}
next();
}]
