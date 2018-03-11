const TelegramBot = require('node-telegram-bot-api');
const token = '455206798:AAFMKPddg1SR1M_4r7E138JrsSRxVrrbKck';
const bot = new TelegramBot(token, {polling: true});
const helpers = require('./helpers');
const keyboards = require('./keyboard');
const kb = require('./keyboard-buttons');
const frases = require('./frases');
const firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: "./funnels-639c05f9da96.json",
    databaseURL: "https://funnels-61746.firebaseio.com/"
})

bot.onText(/\/start/, msg => {
    firebase.database().ref('users/'+msg.chat.id).set(msg.chat);
    bot.sendMessage(msg.chat.id, frases.start(msg.from.first_name), keyboards.home);
});

bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id, frases.help(msg.from.first_name));
    helpers.warmingUp(bot,msg.chat.id,1000,'hello')
})

bot.onText(/\/about/, msg => {
    bot.sendMessage(msg.chat.id, frases.about)
})

bot.on('callback_query', query => {
    const {chat, message_id, text} = query.message;
    // console.log(query.data);

    switch (query.data){

        case('video1'):
            firebase.database().ref('users/'+chat.id).update({state:'video1'});
            firebase.database().ref('warming/video1').once("value", function (snapshot) {
                var warming = snapshot.val();
                helpers.warmingUp(bot,firebase,chat.id,warming.delay,chat.first_name+warming.message,'video1','video2');
            }, function (errorObject) {
                console.log("The read failed: " + errorObject);
            });
            var data = keyboards.getFreeVideoTemplate('video2','video1');
            bot.sendMessage(chat.id,data.message,data.keyboard);
            break;

        case('video2'):
            firebase.database().ref('users/'+chat.id).update({state:'video2'});
            firebase.database().ref('warming/video2').once("value", function (snapshot) {
                var warming = snapshot.val();
                helpers.warmingUp(bot,firebase,chat.id,warming.delay,chat.first_name+warming.message,'video2','video3');
            }, function (errorObject) {
                console.log("The read failed: " + errorObject);
            });
            var data = keyboards.getFreeVideoTemplate('video3','video2');
            bot.sendMessage(chat.id,data.message,data.keyboard);
            break;

        case('video3'):
            firebase.database().ref('users/'+chat.id).update({state:'video3'});
            firebase.database().ref('warming/video3').once("value", function (snapshot) {
                var warming = snapshot.val();
                helpers.warmingUp(bot,firebase,chat.id,warming.delay,chat.first_name+warming.message,'video3','video4');
            }, function (errorObject) {
                console.log("The read failed: " + errorObject);
            });
            var data = keyboards.getFreeVideoTemplate('video4','video3');
            bot.sendMessage(chat.id,data.message,data.keyboard);
            break;

        case('video4'):
            firebase.database().ref('users/'+chat.id).update({state:'video4'});
            firebase.database().ref('warming/video4').once("value", function (snapshot) {
                var warming = snapshot.val();
                helpers.warmingUp(bot,firebase,chat.id,warming.delay,chat.first_name+warming.message,'video4','video5');
            }, function (errorObject) {
                console.log("The read failed: " + errorObject);
            });
            bot.sendMessage(chat.id,frases.video4,keyboards.video4);
            break;
        case('video5'):
            firebase.database().ref('users/'+chat.id).update({state:'video5'});
            firebase.database().ref('warming/video5').once("value", function (snapshot) {
                var warming = snapshot.val();
                helpers.warmingUp(bot,firebase,chat.id,warming.delay,chat.first_name+warming.message,'video5','video6');
            }, function (errorObject) {
                console.log("The read failed: " + errorObject);
            });
            bot.sendMessage(chat.id,frases.video5,keyboards.video5)
            break;
        case('video6'):
            firebase.database().ref('users/'+chat.id).update({state:'video6'});
            firebase.database().ref('warming/video6').once("value", function (snapshot) {
                var warming = snapshot.val();
                helpers.warmingUp(bot,firebase,chat.id,warming.delay,chat.first_name+warming.message,'video6','finish');
            }, function (errorObject) {
                console.log("The read failed: " + errorObject);
            });
            bot.sendMessage(chat.id,frases.video6,keyboards.video5)
            break;
        case('finish'):
            firebase.database().ref('users/'+chat.id).update({state:'finish'});
            bot.sendMessage(chat.id,frases.finish,{parse_mode:'HTML'})
            break;
    };

    if(query.data.slice(0,-1) == 'more_by_video'){
        bot.sendMessage(chat.id,'Это ответы на часто задаваемые вопросы. Выберите интересующий вас вопрос',
            keyboards.getMoreKeyboard(query.data.split('_')[2]));
    }//2
    else if(query.data.split('_')[0] === 'HaveYouWatched'){
        firebase.database().ref('users/'+chat.id).update({state:query.data});
        bot.sendMessage(chat.id,frases.HaveYouWatched,keyboards.HaveYouWatchedKey(query.data.split('_')[1]))
    }
    try{
        // console.log(JSON.parse(query.data).timeout)
        switch (JSON.parse(query.data).type){
            case kb.more.plan.callback_data:
                bot.sendMessage(chat.id,frases.plan,keyboards.getMoreKeyboard(JSON.parse(query.data).back));
                break;

            case kb.more.aboutTime.callback_data:
                bot.sendMessage(chat.id,frases.aboutTime,keyboards.getMoreKeyboard(JSON.parse(query.data).back));
                break;

            case kb.more.aboutHelp.callback_data:
                bot.sendMessage(chat.id,frases.aboutHelp,keyboards.getMoreKeyboard(JSON.parse(query.data).back));
                break;

            case kb.more.difference.callback_data:
                bot.sendMessage(chat.id,frases.difference,keyboards.getMoreKeyboard(JSON.parse(query.data).back));
                break;

        };
    }catch(e){}


    bot.deleteMessage(chat.id,message_id).catch(function () {  console.log('delete error')});
});

console.log('bot has been started');
