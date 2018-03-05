// const request = require('request');
// const kb = require('./keyboard-buttons')
// const frases = require('./frases');
const keyboard = require('./keyboard.js');


module.exports = {

     warmingUp(bot,firebase,id,delay,message,data,next) {
         setTimeout( function () {
                 firebase.database().ref('users/' + id+'/state').once("value", function (snapshot) {
                     var state = snapshot.val();
                     // console.log('-'+state+'-'+data)
                     if(state === data){

                         if(data === 'video4'){
                             bot.sendMessage(id,message,{
                                 reply_markup: {
                                     inline_keyboard: [
                                         [{
                                             text: 'Да',
                                             callback_data:  ' '
                                         }],
                                         [{
                                             text: 'Нет',
                                             callback_data: data
                                         }]
                                     ]
                                 }
                             })
                         }else{
                             bot.sendMessage(id,message,keyboard.getWarmingTemplate(next,data))
                         }
                     }
                 }, function (errorObject) {
                     console.log("The read failed: " + errorObject);
                 });
             },
             delay,
             data,
             message,
             next
         );
     }
}

