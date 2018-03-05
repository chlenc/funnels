const kb = require('./keyboard-buttons');
const frases = require('./frases');
module.exports = {
    home: {
        reply_markup: {
            inline_keyboard: [
                [kb.home.getVideo],
                [kb.home.more]
            ]
        }
    },
    more: {
        reply_markup: {
            inline_keyboard: [
                [kb.more.plan],
                [kb.more.aboutTime],
                [kb.more.aboutHelp],
                [kb.more.difference],
            ]
        }
    },
    video4: {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: kb.pay,
                    url: 'helpexcel.pro'
                }],
            [ {
                text: 'Хочу узнать больше!',
                callback_data: kb.video4.more
            }]
            ]
        }
    },
    getMoreKeyboard(data) {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: kb.more.plan.text,
                        callback_data: JSON.stringify({
                            type: kb.more.plan.callback_data,
                            back: data
                        })
                    }],
                    [{
                        text: kb.more.aboutTime.text,
                        callback_data: JSON.stringify({
                            type: kb.more.aboutTime.callback_data,
                            back: data
                        })
                    }],
                    [{
                        text: kb.more.aboutHelp.text,
                        callback_data: JSON.stringify({
                            type: kb.more.aboutHelp.callback_data,
                            back: data
                        })
                    }],
                    [{
                        text: kb.more.difference.text,
                        callback_data: JSON.stringify({
                            type: kb.more.difference.callback_data,
                            back: data
                        })
                    }],
                    [{
                        text: kb.getVideo,
                        callback_data: data
                    }]
                ]
            }
        }
    },
    getFreeVideoTemplate(next,here){
        var message = frases[here];
        var keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: kb.next,
                        callback_data:  next
                    },
                    {
                        text: 'Хочу узнать больше!',
                        callback_data: kb[here].more
                    }]
                ]
            }
        }
        return {
            message: message,
            keyboard: keyboard
        }
    },
    getWarmingTemplate(next,here){
        var keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Да, здорово! Хочу продолжение!',
                        callback_data:  next
                    }],
                    [{
                        text: 'Нет, не успел!',
                        callback_data: here
                    }],
                    [{
                        text: 'Хочу узнать больше!',
                        callback_data: kb[here].more
                    }]
                ]
            }
        }
        return keyboard
    }

}