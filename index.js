process.env.NTBA_FIX_319 = 1;
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const fs = require('fs');
const { response, text } = require('express');
const express = require('express')
const url = process.env.url;
const database1 = require('./vsurasp.json')
const database = require('./vsudatabase.json')
const moment = require('moment')
console.log('Бот запущен!')
const bot = new TelegramBot(process.env.TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})

//бд расписания
mongoose.connect('mongodb://localhost/vsudatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => console.log('Mongo запущен!'))
    .catch((err) => console.log(err))

require('./models/kafed.model')
require('./models/prepod.model')
require('./models/obshchez.model')
require('./models/korp.model')
require('./models/buh.model')
require('./models/zdrav.model')
require('./models/ras.model')
const Rasp = mongoose.model('raspisanie12')
const Kaf = mongoose.model('kafeds')
const Pre = mongoose.model('prepods')
const Ob = mongoose.model('obshchezs')
const Korp = mongoose.model('korpus')
const Buh = mongoose.model('buhgal')
const Zdrav = mongoose.model('zdrav')
//database1.raspisanie12.forEach(r => new Rasp(r).save().catch(e => console.log(e)))
//database.kafeds.forEach(k => new Kaf(k).save().catch(e => console.log(e)))
//database.prepods.forEach(p => new Pre(p).save().catch(e => console.log(e)))
//database.obshchezs.forEach(o => new Ob(o).save().catch(e => console.log(e)))
//database.korpus.forEach(kp => new Korp(kp).save().catch(e => console.log(e)))
//database.buhgal.forEach(b => new Buh(b).save().catch(e => console.log(e)))
//database.zdravpoint.forEach(z => new Zdrav(z).save().catch(e => console.log(e)))

//Heroku
var app = express();


//For avoidong Heroku $PORT error
app.get('/', function (request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});

/* инлайн херня */
bot.on('inline_query', query => {

    const results = []
    for (let i = 0; i < 3; i++) {
        results.push({
            type: 'article',
            id: i.toString(),
            title: 'Title' + i,
            input_message_content: {
                message_text: `Article №${i + 1}`

            }
        })
    }

    bot.answerInlineQuery(query.id, results, {
        cache_time: 0
    })
})
/* Главная клавиатура */
bot.onText(/\/start/, msg => {
    console.log(`Бот стартанул`)
    //парс недели
    Date.prototype.getWeek = function () {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }
    var weekNumber = (new Date()).getWeek();
    var now = new Date();
    if (weekNumber % 2 === 0) {
        Week = 'нечётная'
    }
    else {
        Week = 'чётная'
    }
    //парс даты и времени
    var locale = require('./node_modules/moment/locale/ru')
    var now = moment();
    moment.locale('ru');
    const chatId = msg.chat.id
    bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name}! Выбирайте необходимый раздел😇
${now.format(`Дата: dddd, DD MMMM, H:mm:ss`)} Неделя: ${Week}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📓 Расписание занятий', callback_data: '1', }],
                [{ text: '📞 Контакты', callback_data: 'contact' }],
                [{ text: '🏠 Общежития', callback_data: 'ob' }],
                [{ text: '🏫 Корпуса', callback_data: 'korp' }],
                [{ text: '💻 Одно окно', url: 'https://vogu35.ru/kontakty/odno-okno' }],
                [{ text: '📝 Отзывы', callback_data: 'otz', }],
                [{ text: '🍩 Донаты', callback_data: 'donat', }],
            ]
        }
    })
})

/* Клавиатура с институтами (Расписание) */
function raspisanie1(chatId, first_name) {
    console.log(`${first_name} вошел в раздел с расписанием`)
    //bot.deleteMessage(chatId,)
    bot.sendMessage(chatId, `Выберите институт`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: 'Институт машиностроения, энергетики и транспорта', callback_data: '4' }],
                [{ text: 'Инженерно-строительный институт', callback_data: '5' }],
                [{ text: 'Институт управления, экономики и юриспруденции', callback_data: '6' }],
                [{ text: 'Институт математики, естественных и компьютерных наук', callback_data: '7' }],
                [{ text: 'Институт педагогики, психологии и физического воспитания', callback_data: '8' }],
                [{ text: 'Институт социальных и гуманитарных наук', callback_data: '9' }],
                [{ text: 'Институт культуры и туризма', callback_data: '10' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1') {
        raspisanie1(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура с курсами 1 институт(Расписание) */
function kursi11(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали институт машиностроения, энергетики и транспорта.
Выберите курс`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '1 курс', callback_data: '31' }],
                [{ text: '2 курс', callback_data: '32' }],
                [{ text: '3 курс', callback_data: '33' }],
                [{ text: '4 курс', callback_data: '34' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4') {
        kursi11(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура с курсами 2 институт(Расписание) */
function kursi12(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали инженерно-строительный институт.
Выберите курс`, {


        reply_markup: {
            inline_keyboard: [
                [{ text: '1 курс', callback_data: '41' }],
                [{ text: '2 курс', callback_data: '42' }],
                [{ text: '3 курс', callback_data: '43' }],
                [{ text: '4 курс', callback_data: '44' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '5') {
        kursi12(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура с курсами 3 институт(Расписание) */
function kursi13(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали институт управления, экономики и юриспруденции.
Выберите курс`, {


        reply_markup: {
            inline_keyboard: [
                [{ text: '1 курс', callback_data: '51' }],
                [{ text: '2 курс', callback_data: '52' }],
                [{ text: '3 курс', callback_data: '53' }],
                [{ text: '4 курс', callback_data: '54' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '6') {
        kursi13(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура с курсами 4 институт(Расписание) */
function kursi14(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали институт математики, естественных и компьютерных наук.
Выберите курс`, {


        reply_markup: {
            inline_keyboard: [
                [{ text: '1 курс', callback_data: '61' }],
                [{ text: '2 курс', callback_data: '62' }],
                [{ text: '3 курс', callback_data: '63' }],
                [{ text: '4 курс', callback_data: '64' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '7') {
        kursi14(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура с курсами 5 институт(Расписание) */
function kursi15(chatId, first_name) {
    console.log(`${first_name} вошел в институт педагогики и психологии`)
    bot.sendMessage(chatId, `Вы выбрали институт педагогики, психологии и физического воспитания.
Выберите курс`, {


        reply_markup: {
            inline_keyboard: [
                [{ text: '1 курс', callback_data: '71' }],
                [{ text: '2 курс', callback_data: '72' }],
                [{ text: '3 курс', callback_data: '73' }],
                [{ text: '4 курс', callback_data: '74' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '8') {
        kursi15(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура с курсами 6 институт(Расписание) */
function kursi16(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали институт социальных и гуманитарных наук.
Выберите курс`, {


        reply_markup: {
            inline_keyboard: [
                [{ text: '1 курс', callback_data: '81' }],
                [{ text: '2 курс', callback_data: '82' }],
                [{ text: '3 курс', callback_data: '83' }],
                [{ text: '4 курс', callback_data: '84' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '9') {
        kursi16(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура с курсами 7 институт(Расписание) */
function kursi17(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали институт культуры и туризма
Выберите курс`, {


        reply_markup: {
            inline_keyboard: [
                [{ text: '1 курс', callback_data: '91' }],
                [{ text: '2 курс', callback_data: '92' }],
                [{ text: '3 курс', callback_data: '93' }],
                [{ text: '4 курс', callback_data: '94' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '10') {
        kursi17(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (1 курс, 1 институт) (Расписание) */

function spec11(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '09.03.01 - Информатика и вычислительная техника', callback_data: '121' }],
                [{ text: '12.03.04 - Биотехнические системы и технологии', callback_data: '122' }],
                [{ text: '13.03.02 - Электроэнергетика и электротехника', callback_data: '123' }],
                [{ text: '15.03.01 - Машиностроение', callback_data: '124' }],
                [{ text: '15.03.06 - Механика и робототехника', callback_data: '125' }],
                [{ text: '23.03.03 - Эксплуатация транспортно-технологических машин и комплексов', callback_data: '126' }],
                [{ text: '27.03.04 - Управление в технических системах', callback_data: '127' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '31') {
        spec11(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (2 курс, 1 институт) (Расписание) */
function spec21(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '09.03.01 - Информатика и вычислительная техника', callback_data: '221' }],
                [{ text: '12.03.04 - Биотехнические системы и технологии', callback_data: '222' }],
                [{ text: '13.03.02 - Электроэнергетика и электротехника', callback_data: '223' }],
                [{ text: '15.03.01 - Машиностроение', callback_data: '224' }],
                [{ text: '15.03.06 - Механика и робототехника', callback_data: '225' }],
                [{ text: '23.03.03 - Эксплуатация транспортно-технологических машин и комплексов', callback_data: '226' }],
                [{ text: '27.03.04 - Управление в технических системах', callback_data: '227' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '32') {
        spec21(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (3 курс, 1 институт) (Расписание) */
function spec31(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '09.03.01 - Информатика и вычислительная техника', callback_data: '321' }],
                [{ text: '12.03.04 - Биотехнические системы и технологии', callback_data: '322' }],
                [{ text: '13.03.02 - Электроэнергетика и электротехника', callback_data: '323' }],
                [{ text: '15.03.01 - Машиностроение', callback_data: '324' }],
                [{ text: '15.03.06 - Механика и робототехника', callback_data: '325' }],
                [{ text: '23.03.03 - Эксплуатация транспортно-технологических машин и комплексов', callback_data: '326' }],
                [{ text: '27.03.04 - Управление в технических системах', callback_data: '327' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '33') {
        spec31(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (4 курс, 1 институт) (Расписание) */
function spec41(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '09.03.01 - Информатика и вычислительная техника', callback_data: '421' }],
                [{ text: '12.03.04 - Биотехнические системы и технологии', callback_data: '422' }],
                [{ text: '13.03.02 - Электроэнергетика и электротехника', callback_data: '423' }],
                [{ text: '15.03.01 - Машиностроение', callback_data: '424' }],
                [{ text: '15.03.06 - Механика и робототехника', callback_data: '425' }],
                [{ text: '23.03.03 - Эксплуатация транспортно-технологических машин и комплексов', callback_data: '426' }],
                [{ text: '27.03.04 - Управление в технических системах', callback_data: '427' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '34') {
        spec41(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (1 курс, 2 институт) (Расписание) */
function spec12(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '07.03.01 - Архитектура - Городской кадастр', callback_data: '45' }],
                [{ text: '07.03.01 - Архитектура', callback_data: '131' }],
                [{ text: '08.03.01 - Строительство', callback_data: '132' }],
                [{ text: '13.03.01 - Теплоэнергетика и теплотехника', callback_data: '133' }],
                [{ text: '20.03.01 - Техносферная безопасность', callback_data: '134' }],
                [{ text: '21.03.02 - Землеустройство и кадастры', callback_data: '135' }],
                [{ text: '54.03.04 - Реставрация', callback_data: '136' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '41') {
        spec12(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (2 курс, 2 институт) (Расписание) */
function spec22(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '07.03.01 - Архитектура - Городской кадастр', callback_data: '45' }],
                [{ text: '07.03.01 - Архитектура', callback_data: '231' }],
                [{ text: '08.03.01 - Строительство', callback_data: '232' }],
                [{ text: '13.03.01 - Теплоэнергетика и теплотехника', callback_data: '233' }],
                [{ text: '20.03.01 - Техносферная безопасность', callback_data: '234' }],
                [{ text: '21.03.02 - Землеустройство и кадастры', callback_data: '235' }],
                [{ text: '54.03.04 - Реставрация', callback_data: '236' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '42') {
        spec22(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (3 курс, 2 институт) (Расписание) */
function spec32(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '07.03.01 - Архитектура', callback_data: '331' }],
                [{ text: '08.03.01 - Строительство', callback_data: '332' }],
                [{ text: '13.03.01 - Теплоэнергетика и теплотехника', callback_data: '333' }],
                [{ text: '20.03.01 - Техносферная безопасность', callback_data: '334' }],
                [{ text: '21.03.02 - Землеустройство и кадастры', callback_data: '335' }],
                [{ text: '54.03.04 - Реставрация', callback_data: '336' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '43') {
        spec32(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (4 курс, 2 институт) (Расписание) */
function spec42(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '07.03.01 - Архитектура', callback_data: '431' }],
                [{ text: '08.03.01 - Строительство', callback_data: '432' }],
                [{ text: '13.03.01 - Теплоэнергетика и теплотехника', callback_data: '433' }],
                [{ text: '20.03.01 - Техносферная безопасность', callback_data: '434' }],
                [{ text: '21.03.02 - Землеустройство и кадастры', callback_data: '435' }],
                [{ text: '54.03.04 - Реставрация', callback_data: '436' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '44') {
        spec42(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (1 курс, 3 институт) (Расписание) */
function spec13(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '27.03.05 - Инноватика', callback_data: '141' }],
                [{ text: '38.03.01 - Экономика', callback_data: '142' }],
                [{ text: '38.03.04 - Государственное и муниципальное управление', callback_data: '143' }],
                [{ text: '40.03.01 - Юриспруденция', callback_data: '144' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '51') {
        spec13(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (2 курс, 3 институт) (Расписание) */
function spec23(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '27.03.05 - Инноватика', callback_data: '241' }],
                [{ text: '38.03.01 - Экономика', callback_data: '242' }],
                [{ text: '38.03.04 - Государственное и муниципальное управление', callback_data: '243' }],
                [{ text: '40.03.01 - Юриспруденция', callback_data: '244' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '52') {
        spec23(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (3 курс, 3 институт) (Расписание) */
function spec33(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '27.03.05 - Инноватика', callback_data: '341' }],
                [{ text: '38.03.01 - Экономика', callback_data: '342' }],
                [{ text: '38.03.04 - Государственное и муниципальное управление', callback_data: '343' }],
                [{ text: '40.03.01 - Юриспруденция', callback_data: '344' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '53') {
        spec33(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (4 курс, 3 институт) (Расписание) */
function spec43(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '27.03.05 - Инноватика', callback_data: '441' }],
                [{ text: '38.03.01 - Экономика', callback_data: '442' }],
                [{ text: '38.03.04 - Государственное и муниципальное управление', callback_data: '443' }],
                [{ text: '40.03.01 - Юриспруденция', callback_data: '444' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '54') {
        spec43(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (1 курс, 4 институт) (Расписание) */
function spec14(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '01.03.02 - Прикладная математика и информатика', callback_data: '151' }],
                [{ text: '02.03.01 - Математика и компьютерные науки', callback_data: '152' }],
                [{ text: '04.03.01 - Химия', callback_data: '153' }],
                [{ text: '05.03.02 - География', callback_data: '154' }],
                [{ text: '05.03.06 - Экология и природопользование', callback_data: '155' }],
                [{ text: '06.03.01 - Биология', callback_data: '156' }],
                [{ text: '09.03.01 - Информатика и вычислительная техника', callback_data: '157' }],
                [{ text: '09.03.02 - Информационные системы и технологии', callback_data: '158' }],
                [{ text: '09.03.03 - Прикладная информатика', callback_data: '159' }],
                [{ text: '09.03.04 - Программная инженерия', callback_data: '1510' }],
                [{ text: '12.03.04 - Биотехнические системы и технологии', callback_data: '1511' }],
                [{ text: '27.03.04 - Управление в технических системах', callback_data: '1512' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '1513' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '61') {
        spec14(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (2 курс, 4 институт) (Расписание) */
function spec24(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '01.03.02 - Прикладная математика и информатика', callback_data: '251' }],
                [{ text: '02.03.01 - Математика и компьютерные науки', callback_data: '252' }],
                [{ text: '04.03.01 - Химия', callback_data: '253' }],
                [{ text: '05.03.02 - География', callback_data: '254' }],
                [{ text: '05.03.06 - Экология и природопользование', callback_data: '255' }],
                [{ text: '06.03.01 - Биология', callback_data: '256' }],
                [{ text: '09.03.01 - Информатика и вычислительная техника', callback_data: '257' }],
                [{ text: '09.03.02 - Информационные системы и технологии', callback_data: '258' }],
                [{ text: '09.03.03 - Прикладная информатика', callback_data: '259' }],
                [{ text: '09.03.04 - Программная инженерия', callback_data: '2510' }],
                [{ text: '12.03.04 - Биотехнические системы и технологии', callback_data: '2511' }],
                [{ text: '27.03.04 - Управление в технических системах', callback_data: '2512' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '2513' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '62') {
        spec24(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (3 курс, 4 институт) (Расписание) */
function spec34(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '01.03.02 - Прикладная математика и информатика', callback_data: '351' }],
                [{ text: '02.03.01 - Математика и компьютерные науки', callback_data: '352' }],
                [{ text: '04.03.01 - Химия', callback_data: '353' }],
                [{ text: '05.03.02 - География', callback_data: '354' }],
                [{ text: '05.03.06 - Экология и природопользование', callback_data: '355' }],
                [{ text: '06.03.01 - Биология', callback_data: '356' }],
                [{ text: '09.03.01 - Информатика и вычислительная техника', callback_data: '357' }],
                [{ text: '09.03.02 - Информационные системы и технологии', callback_data: '358' }],
                [{ text: '09.03.03 - Прикладная информатика', callback_data: '359' }],
                [{ text: '09.03.04 - Программная инженерия', callback_data: '3510' }],
                [{ text: '12.03.04 - Биотехнические системы и технологии', callback_data: '3511' }],
                [{ text: '27.03.04 - Управление в технических системах', callback_data: '3512' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '3513' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '63') {
        spec34(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (4 курс, 4 институт) (Расписание) */
function spec44(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '01.03.02 - Прикладная математика и информатика', callback_data: '451' }],
                [{ text: '02.03.01 - Математика и компьютерные науки', callback_data: '452' }],
                [{ text: '04.03.01 - Химия', callback_data: '453' }],
                [{ text: '05.03.02 - География', callback_data: '454' }],
                [{ text: '05.03.06 - Экология и природопользование', callback_data: '455' }],
                [{ text: '06.03.01 - Биология', callback_data: '456' }],
                [{ text: '09.03.01 - Информатика и вычислительная техника', callback_data: '457' }],
                [{ text: '09.03.02 - Информационные системы и технологии', callback_data: '458' }],
                [{ text: '09.03.03 - Прикладная информатика', callback_data: '459' }],
                [{ text: '09.03.04 - Программная инженерия', callback_data: '4510' }],
                [{ text: '12.03.04 - Биотехнические системы и технологии', callback_data: '4511' }],
                [{ text: '27.03.04 - Управление в технических системах', callback_data: '4512' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '4513' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '64') {
        spec44(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (1 курс, 5 институт) (Расписание) */
function spec15(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.02 - Социальная работа', callback_data: '161' }],
                [{ text: '44.03.01 - Педагогическое образование', callback_data: '162' }],
                [{ text: '44.03.02 - Психолого-педагогическое образование', callback_data: '163' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '164' }],
                [{ text: '49.03.02 - Физическая культура для лиц с отклонениями в состоянии здоровья', callback_data: '165' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '71') {
        spec15(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (2 курс, 5 институт) (Расписание) */
function spec25(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.02 - Социальная работа', callback_data: '261' }],
                [{ text: '44.03.01 - Педагогическое образование', callback_data: '262' }],
                [{ text: '44.03.02 - Психолого-педагогическое образование', callback_data: '263' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '264' }],
                [{ text: '49.03.02 - Физическая культура для лиц с отклонениями в состоянии здоровья', callback_data: '265' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '72') {
        spec25(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (3 курс, 5 институт) (Расписание) */
function spec35(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.02 - Социальная работа', callback_data: '361' }],
                [{ text: '44.03.01 - Педагогическое образование', callback_data: '362' }],
                [{ text: '44.03.02 - Психолого-педагогическое образование', callback_data: '363' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '364' }],
                [{ text: '49.03.02 - Физическая культура для лиц с отклонениями в состоянии здоровья', callback_data: '365' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '73') {
        spec35(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (4 курс, 5 институт) (Расписание) */
function spec45(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.02 - Социальная работа', callback_data: '461' }],
                [{ text: '44.03.01 - Педагогическое образование', callback_data: '462' }],
                [{ text: '44.03.02 - Психолого-педагогическое образование', callback_data: '463' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '464' }],
                [{ text: '49.03.02 - Физическая культура для лиц с отклонениями в состоянии здоровья', callback_data: '465' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '74') {
        spec45(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (1 курс, 6 институт) (Расписание) */
function spec16(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.01 - Социология', callback_data: '171' }],
                [{ text: '41.03.06 - Публичная политика и социальные науки', callback_data: '172' }],
                [{ text: '42.03.02 - Журналистика', callback_data: '173' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '174' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '81') {
        spec16(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (2 курс, 6 институт) (Расписание) */
function spec26(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.01 - Социология', callback_data: '271' }],
                [{ text: '41.03.06 - Публичная политика и социальные науки', callback_data: '272' }],
                [{ text: '42.03.02 - Журналистика', callback_data: '273' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '274' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '82') {
        spec26(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (3 курс, 6 институт) (Расписание) */
function spec36(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.01 - Социология', callback_data: '371' }],
                [{ text: '41.03.06 - Публичная политика и социальные науки', callback_data: '372' }],
                [{ text: '42.03.02 - Журналистика', callback_data: '373' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '374' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '83') {
        spec36(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (4 курс, 6 институт) (Расписание) */
function spec46(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.01 - Социология', callback_data: '471' }],
                [{ text: '41.03.06 - Публичная политика и социальные науки', callback_data: '472' }],
                [{ text: '42.03.02 - Журналистика', callback_data: '473' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '474' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '84') {
        spec46(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (1 курс, 7 институт) (Расписание) */
function spec17(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.01 - Социология', callback_data: '181' }],
                [{ text: '43.03.02 - Туризм', callback_data: '182' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '183' }],
                [{ text: '45.03.02 - Лингвистика', callback_data: '184' }],
                [{ text: '51.03.01 - Культурология', callback_data: '185' }],
                [{ text: '53.03.06 - Музыкальное и музыкально-прикладное искусство', callback_data: '186' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '91') {
        spec17(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (2 курс, 7 институт) (Расписание) */
function spec27(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.01 - Социология', callback_data: '281' }],
                [{ text: '43.03.02 - Туризм', callback_data: '282' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '283' }],
                [{ text: '45.03.02 - Лингвистика', callback_data: '284' }],
                [{ text: '51.03.01 - Культурология', callback_data: '285' }],
                [{ text: '53.03.06 - Музыкальное и музыкально-прикладное искусство', callback_data: '286' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '92') {
        spec27(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (3 курс, 7 институт) (Расписание) */
function spec37(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.01 - Социология', callback_data: '381' }],
                [{ text: '43.03.02 - Туризм', callback_data: '382' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '383' }],
                [{ text: '45.03.02 - Лингвистика', callback_data: '384' }],
                [{ text: '51.03.01 - Культурология', callback_data: '385' }],
                [{ text: '53.03.06 - Музыкальное и музыкально-прикладное искусство', callback_data: '386' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '93') {
        spec37(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура со специальностями (4 курс, 7 институт) (Расписание) */
function spec47(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите специальность`, {

        reply_markup: {
            inline_keyboard: [
                [{ text: '39.03.01 - Социология', callback_data: '481' }],
                [{ text: '43.03.02 - Туризм', callback_data: '482' }],
                [{ text: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)', callback_data: '483' }],
                [{ text: '45.03.02 - Лингвистика', callback_data: '484' }],
                [{ text: '51.03.01 - Культурология', callback_data: '485' }],
                [{ text: '53.03.06 - Музыкальное и музыкально-прикладное искусство', callback_data: '486' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '94') {
        spec47(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 1 института 1 специальности */
function photo111(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет!`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '121') {
        photo111(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 1 института 1 специальности */
function photo211(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет!`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '221') {
        photo211(chatId, query.message.chat.first_name)
    }
})
//вывод фото 3 курса 1 института 1 специальности 
function photo311(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_09.03.01i_vmkss_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })

    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '321') {
        photo311(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 1 института 1 специальности */
function photo411(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_09.03.01i_vmkss_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })

    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '421') {
        photo411(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 1 института 2 специальности */
function photo112(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '122') {
        photo112(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 1 института 2 специальности */
function photo212(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_12.03.04_idmbp_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '222') {
        photo212(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 1 института 2 специальности */
function photo312(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '322') {
        photo312(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 4 курса 1 института 2 специальности */
function photo412(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '422') {
        photo412(chatId, query.message.chat.first_name)
    }
})
// вывод клавиатуры 1 курс 1 институт 3 специальность 
function klava113(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление электроэнергетики и электротехники`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Цифровые технологии в электроэнергетике', callback_data: '1131' }],
                [{ text: 'Электропривод и автоматика', callback_data: '1132' }],
                [{ text: 'Электроэнергетика и электротехника', callback_data: '1133' }],
                [{ text: 'Электроснабжение', callback_data: '1134' }],
                [{ text: 'Электрооборудование и электрохозяйство предприятий, организаций и учреждений', callback_data: '1135' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '123') {
        klava113(chatId, query.message.chat.first_name)
    }
})

// вывод клавиатуры 2 курс 1 институт 3 специальность 
function klava213(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление электроэнергетики и электротехники`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Цифровые технологии в электроэнергетике', callback_data: '2131' }],
                [{ text: 'Электропривод и автоматика', callback_data: '2132' }],
                [{ text: 'Электроэнергетика и электротехника', callback_data: '2133' }],
                [{ text: 'Электроснабжение', callback_data: '2134' }],
                [{ text: 'Электрооборудование и электрохозяйство предприятий, организаций и учреждений', callback_data: '2135' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '223') {
        klava213(chatId, query.message.chat.first_name)
    }
})

// вывод клавиатуры 3 курс 1 институт 3 специальность 
function klava313(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление электроэнергетики и электротехники`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Цифровые технологии в электроэнергетике', callback_data: '3131' }],
                [{ text: 'Электропривод и автоматика', callback_data: '3132' }],
                [{ text: 'Электроэнергетика и электротехника', callback_data: '3133' }],
                [{ text: 'Электроснабжение', callback_data: '3134' }],
                [{ text: 'Электрооборудование и электрохозяйство предприятий, организаций и учреждений', callback_data: '3135' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '323') {
        klava313(chatId, query.message.chat.first_name)
    }
})

// вывод клавиатуры 4 курс 1 институт 3 специальность 
function klava413(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление электроэнергетики и электротехники`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Цифровые технологии в электроэнергетике', callback_data: '4131' }],
                [{ text: 'Электропривод и автоматика', callback_data: '4132' }],
                [{ text: 'Электроэнергетика и электротехника', callback_data: '4133' }],
                [{ text: 'Электроснабжение', callback_data: '4134' }],
                [{ text: 'Электрооборудование и электрохозяйство предприятий, организаций и учреждений', callback_data: '4135' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '423') {
        klava413(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 1 института 3 специальности 1 направление*/
function photo1131(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_09.03.01i_vmkss_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1131') {
        photo1131(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 2 курса 1 института 3 специальности 1 направление*/
function photo2131(chatId, first_name) {
    Rasp.findOne({ link: "https://tt.vogu35.ru/files/imeit_bak_ofo_13.03.02_ctve_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2131') {
        photo2131(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 3 курса 1 института 3 специальности 1 направление*/
function photo3131(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3131') {
        photo3131(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 1 института 3 специальности 1 направление*/
function photo4131(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_09.03.01i_vmkss_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4131') {
        photo4131(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 1 института 3 специальности 2 направление*/
function photo1132(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_09.03.01i_vmkss_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1132') {
        photo1132(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 1 института 3 специальности 2 направление*/
function photo2132(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_13.03.02_dfgd21_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2132') {
        photo2132(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 1 института 3 специальности 2 направление*/
function photo3132(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_13.03.02_dfgd21_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3132') {
        photo3132(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 1 института 3 специальности 2 направление*/
function photo4132(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_13.03.02_dfgd21_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4132') {
        photo4132(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 1 института 3 специальности 3 направление */
function photo1133(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_13.03.02_dfgd21_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1133') {
        photo1133(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 1 института 3 специальности 3 направление*/
function photo2133(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_09.03.01i_vmkss_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2133') {
        photo2133(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 1 института 3 специальности 3 направление*/
function photo3133(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_09.03.01i_vmkss_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3133') {
        photo3133(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 1 института 3 специальности 3 направление*/
function photo4133(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_09.03.01i_vmkss_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4133') {
        photo4133(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 1 института 3 специальности 4 направление*/
function photo1134(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_09.03.01i_vmkss_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1134') {
        photo1134(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 1 института 3 специальности 4 направление*/
function photo2134(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_13.03.02_elek21_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2134') {
        photo2134(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 1 института 3 специальности 4 направление*/
function photo3134(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_13.03.02_elek21_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3134') {
        photo3134(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 1 института 3 специальности 4 направление*/
function photo4134(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_13.03.02_elek21_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4134') {
        photo4134(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 1 института 3 специальности 5 направление*/
function photo1135(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_09.03.01i_vmkss_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1135') {
        photo1135(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 1 института 3 специальности 5 направление*/
function photo2135(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_13.03.02_ptyu_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2135') {
        photo2135(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 1 института 3 специальности 5 направление*/
function photo3135(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_13.03.02_ptyu_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3135') {
        photo3135(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 1 института 3 специальности 5 направление*/
function photo4135(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_13.03.02_ptyu_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4135') {
        photo4135(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 1 института 4 специальности */
function photo114(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_15.03.01_weyy_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '124') {
        photo114(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 1 института 4 специальности */
function photo214(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_15.03.01_weyy_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '224') {
        photo214(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 1 института 4 специальности */
function photo314(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_15.03.01_weyy_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '324') {
        photo314(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 1 института 4 специальности */
function photo414(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeit_bak_ofo_15.03.01_weyy_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '424') {
        photo414(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 1 института 5 специальности */
function photo115(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '125') {
        photo115(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 1 института 5 специальности */
function photo215(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '225') {
        photo215(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 1 института 5 специальности */
function photo315(chatId, first_name) {
    Rasp.findOne({ link: "https://tt.vogu35.ru/files/imeit_bak_ofo_15.03.06_mrts_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '325') {
        photo315(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 1 института 5 специальности */
function photo415(chatId, first_name) {
    Rasp.findOne({ link: "https://tt.vogu35.ru/files/imeit_bak_ofo_15.03.06_mrts_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '425') {
        photo415(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 1 института 6 специальности */
function photo116(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '126') {
        photo116(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 1 института 6 специальности */
function photo216(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '226') {
        photo216(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 1 института 6 специальности */
function photo316(chatId, first_name) {
    Rasp.findOne({ link: "https://tt.vogu35.ru/files/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '326') {
        photo316(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 4 курса 1 института 6 специальности */
function photo416(chatId, first_name) {
    Rasp.findOne({ link: "https://tt.vogu35.ru/files/imeit_bak_ofo_23.03.03_avtmob_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '426') {
        photo416(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 1 курса 1 института 7 специальности */
function photo117(chatId, first_name) {
    Rasp.findOne({ link: "https://tt.vogu35.ru/files/imeit_bak_ofo_27.03.04_lru_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '127') {
        photo117(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 2 курса 1 института 7 специальности */
function photo217(chatId, first_name) {
    Rasp.findOne({ link: "https://tt.vogu35.ru/files/imeit_bak_ofo_27.03.04_lru_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '227') {
        photo217(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 3 курса 1 института 7 специальности */
function photo317(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '327') {
        photo317(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 1 института 7 специальности */
function photo417(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '427') {
        photo417(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 2 института 1 специальности */
function photo121(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_07.03.01_arhpro_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '131') {
        photo121(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 2 института 1 специальности */
function photo221(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_07.03.01_arhpro_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '231') {
        photo221(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 2 института 1 специальности */
function photo321(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_07.03.01_arhpro_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '331') {
        photo321(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 2 института 1 специальности */
function photo421(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_07.03.01_arhpro_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '431') {
        photo421(chatId, query.message.chat.first_name)
    }
})

/* кадастры */
function photo521(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_07.03.01_gorkad_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '45') {
        photo521(chatId, query.message.chat.first_name)
    }
})
// вывод клавиатуры 1 курс 2 институт 2 специальность 
function klava122(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление строительства`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Автомобильные дороги', callback_data: '1221' }],
                [{ text: 'Теплогазоснабжение и вентиляция', callback_data: '1222' }],
                [{ text: 'Промышленное и гражданское строительство', callback_data: '1223' }],
                [{ text: 'Городское строительство и хозяйство', callback_data: '1224' }],
                [{ text: 'Строительство', callback_data: '1225' }],
                [{ text: 'Водоснабжение и водоотведение', callback_data: '1226' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '132') {
        klava122(chatId, query.message.chat.first_name)
    }
})

// вывод клавиатуры 2 курс 2 институт 2 специальность 
function klava222(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление строительства`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Автомобильные дороги', callback_data: '2221' }],
                [{ text: 'Теплогазоснабжение и вентиляция', callback_data: '2222' }],
                [{ text: 'Промышленное и гражданское строительство', callback_data: '2223' }],
                [{ text: 'Городское строительство и хозяйство', callback_data: '2224' }],
                [{ text: 'Строительство', callback_data: '2225' }],
                [{ text: 'Водоснабжение и водоотведение', callback_data: '2226' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '232') {
        klava222(chatId, query.message.chat.first_name)
    }
})

// вывод клавиатуры 3 курс 2 институт 2 специальность 
function klava322(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление строительства`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Автомобильные дороги', callback_data: '3221' }],
                [{ text: 'Теплогазоснабжение и вентиляция', callback_data: '3222' }],
                [{ text: 'Промышленное и гражданское строительство', callback_data: '3223' }],
                [{ text: 'Городское строительство и хозяйство', callback_data: '3224' }],
                [{ text: 'Строительство', callback_data: '3225' }],
                [{ text: 'Водоснабжение и водоотведение', callback_data: '3226' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '332') {
        klava322(chatId, query.message.chat.first_name)
    }
})

// вывод клавиатуры 4 курс 2 институт 2 специальность 
function klava422(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление строительства`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Автомобильные дороги', callback_data: '4221' }],
                [{ text: 'Теплогазоснабжение и вентиляция', callback_data: '4222' }],
                [{ text: 'Промышленное и гражданское строительство', callback_data: '4223' }],
                [{ text: 'Городское строительство и хозяйство', callback_data: '4224' }],
                [{ text: 'Строительство', callback_data: '4225' }],
                [{ text: 'Водоснабжение и водоотведение', callback_data: '4226' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '432') {
        klava422(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 2 института 2 специальности 1 направления*/
function photo1221(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1221') {
        photo1221(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 2 института 2 специальности 1 направления*/
function photo2221(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_avtdor_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2221') {
        photo2221(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 2 института 2 специальности 1 направления*/
function photo3221(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3221') {
        photo3221(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 2 института 2 специальности 1 направления*/
function photo4221(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_avtdor_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4221') {
        photo4221(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 2 института 2 специальности 2 направления*/
function photo1222(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1222') {
        photo1222(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 2 института 2 специальности 2 направления*/
function photo2222(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_jghj_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2222') {
        photo2222(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 2 института 2 специальности 2 направления*/
function photo3222(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_jghj_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3222') {
        photo3222(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 2 института 2 специальности 2 направления*/
function photo4222(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_jghj_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4222') {
        photo4222(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 2 института 2 специальности 3 направления*/
function photo1223(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1223') {
        photo1223(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 2 института 2 специальности 3 направления*/
function photo2223(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_progra17_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2223') {
        photo2223(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 2 института 2 специальности 3 направления*/
function photo3223(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_progra17_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3223') {
        photo3223(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 2 института 2 специальности 3 направления*/
function photo4223(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_progra17_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4223') {
        photo4223(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 2 института 2 специальности 4 направления*/
function photo1224(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1224') {
        photo1224(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 2 института 2 специальности 4 направления*/
function photo2224(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2224') {
        photo2224(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 2 института 2 специальности 4 направления*/
function photo3224(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_strhoz_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3224') {
        photo3224(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 2 института 2 специальности 4 направления*/
function photo4224(chatId, first_name) {
    Rasp.findOne({ link: "https://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_strhoz_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4224') {
        photo4224(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 2 института 2 специальности 5 направления*/
function photo1225(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_stv_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1225') {
        photo1225(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 2 института 2 специальности 5 направления*/
function photo2225(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2225') {
        photo2225(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 2 института 2 специальности 5 направления*/
function photo3225(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3225') {
        photo3225(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 2 института 2 специальности 5 направления*/
function photo4225(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4225') {
        photo4225(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 2 института 2 специальности 6 направления*/
function photo1226(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1226') {
        photo1226(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 2 института 2 специальности 6 направления*/
function photo2226(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_vv_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2226') {
        photo2226(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 2 института 2 специальности 6 направления*/
function photo3226(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3226') {
        photo3226(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 2 института 2 специальности 6 направления*/
function photo4226(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_08.03.01_vv_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4226') {
        photo4226(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 2 института 3 специальности */
function photo123(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_13.03.01_protep45_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '133') {
        photo123(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 2 института 3 специальности */
function photo223(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_13.03.01_protep45_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '233') {
        photo223(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 2 института 3 специальности */
function photo323(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_13.03.01_protep45_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '333') {
        photo323(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 2 института 3 специальности */
function photo423(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '433') {
        photo423(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 2 института 4 специальности */
function photo124(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '134') {
        photo124(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 2 института 4 специальности */
function photo224(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '234') {
        photo224(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 2 института 4 специальности */
function photo324(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '334') {
        photo324(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 2 института 4 специальности */
function photo424(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_20.03.01_zchsi_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '434') {
        photo424(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 2 института 5 специальности */
function photo125(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_21.03.02_gorkad_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '135') {
        photo125(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 2 института 5 специальности */
function photo225(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_21.03.02_gorkad_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '235') {
        photo225(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 2 института 5 специальности */
function photo325(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_21.03.02_gorkad_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '335') {
        photo325(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 2 института 5 специальности */
function photo425(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_21.03.02_gorkad_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '435') {
        photo425(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 2 института 6 специальности */
function photo126(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '136') {
        photo126(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 2 института 6 специальности */
function photo226(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_54.03.04_rpaas_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '236') {
        photo226(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 2 института 6 специальности */
function photo326(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_54.03.04_rpaas_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '336') {
        photo326(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 2 института 6 специальности */
function photo426(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/isi_bak_ofo_54.03.04_rpaas_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '436') {
        photo426(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 3 института 1 специальности */
function photo131(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '141') {
        photo131(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 3 института 1 специальности */
function photo231(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '241') {
        photo231(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 3 института 1 специальности */
function photo331(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_27.03.05_iyis50_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '341') {
        photo331(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 3 института 1 специальности */
function photo431(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_27.03.05_iyis50_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '441') {
        photo431(chatId, query.message.chat.first_name)
    }
})
// клавиатура 1 курс 3 институт 2 специальность 
function klava132(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление экономики`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Бухгалтерский учет, анализ и аудит', callback_data: '1321' }],
                [{ text: 'Финансы и кредит', callback_data: '1322' }],
                [{ text: 'Экономика', callback_data: '1323' }],
                [{ text: 'Логистика', callback_data: '1324' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '142') {
        klava132(chatId, query.message.chat.first_name)
    }
})

// клавиатура 2 курс 3 институт 2 специальность 
function klava232(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление экономики`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Бухгалтерский учет, анализ и аудит', callback_data: '2321' }],
                [{ text: 'Финансы и кредит', callback_data: '2322' }],
                [{ text: 'Экономика', callback_data: '2323' }],
                [{ text: 'Логистика', callback_data: '2324' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '242') {
        klava232(chatId, query.message.chat.first_name)
    }
})

// клавиатура 3 курс 3 институт 2 специальность 
function klava332(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление экономики`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Бухгалтерский учет, анализ и аудит', callback_data: '3321' }],
                [{ text: 'Финансы и кредит', callback_data: '3322' }],
                [{ text: 'Экономика', callback_data: '3323' }],
                [{ text: 'Логистика', callback_data: '3324' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '342') {
        klava332(chatId, query.message.chat.first_name)
    }
})

// клавиатура 4 курс 3 институт 2 специальность 
function klava432(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление экономики`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Бухгалтерский учет, анализ и аудит', callback_data: '4321' }],
                [{ text: 'Финансы и кредит', callback_data: '4322' }],
                [{ text: 'Экономика', callback_data: '4323' }],
                [{ text: 'Логистика', callback_data: '4324' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '442') {
        klava432(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 3 института 2 специальности 1 направления*/
function photo1321(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1321') {
        photo1321(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 3 института 2 специальности 1 направления*/
function photo2321(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2321') {
        photo2321(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 3 института 2 специальности 1 направления*/
function photo3321(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3321') {
        photo3321(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 3 института 2 специальности 1 направления*/
function photo4321(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_38.03.01_byhanayd_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4321') {
        photo4321(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 3 института 2 специальности 2 направления*/
function photo1322(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1322') {
        photo1322(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 3 института 2 специальности 2 направления*/
function photo2322(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_38.03.01_dfggk_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2322') {
        photo2322(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 3 института 2 специальности 2 направления*/
function photo3322(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_38.03.01_dfggk_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3322') {
        photo3322(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 3 института 2 специальности 2 направления*/
function photo4322(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_38.03.01_dfggk_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4322') {
        photo4322(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 3 института 2 специальности 3 направления*/
function photo1323(chatId, first_name) {
    Rasp.findOne({ link: "https://tt.vogu35.ru/files/iueiu_bak_ofo_38.03.01_e_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1323') {
        photo1323(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 3 института 2 специальности 3 направления*/
function photo2323(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2323') {
        photo2323(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 3 института 2 специальности 3 направления*/
function photo3323(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3323') {
        photo3323(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 3 института 2 специальности 3 направления*/
function photo4323(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4323') {
        photo4323(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 3 института 2 специальности 4 направления*/
function photo1324(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1324') {
        photo1324(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 3 института 2 специальности 4 направления*/
function photo2324(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2324') {
        photo2324(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 3 института 2 специальности 4 направления*/
function photo3324(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3324') {
        photo3324(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 3 института 2 специальности 4 направления*/
function photo4324(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_38.03.01_makropp_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4324') {
        photo4324(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 3 института 3 специальности */
function photo133(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_38.03.04_gosmy_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '143') {
        photo133(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 3 института 3 специальности */
function photo233(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_38.03.04_gosmy_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '243') {
        photo233(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 3 института 3 специальности */
function photo333(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '343') {
        photo333(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 3 института 3 специальности */
function photo433(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '443') {
        photo433(chatId, query.message.chat.first_name)
    }
})

// клавиатура 1 курс 3 институт 4 специальность 
function klava134(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление юриспруденции`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Государственно-правовой', callback_data: '1341' }],
                [{ text: 'Гражданско-правовой', callback_data: '1342' }],
                [{ text: 'Юриспруденция', callback_data: '1343' }],
                [{ text: 'Уголовно-правовой', callback_data: '1344' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '144') {
        klava134(chatId, query.message.chat.first_name)
    }
})

// клавиатура 2 курс 3 институт 4 специальность 
function klava234(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление юриспруденции`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Государственно-правовой', callback_data: '2341' }],
                [{ text: 'Гражданско-правовой', callback_data: '2342' }],
                [{ text: 'Юриспруденция', callback_data: '2343' }],
                [{ text: 'Уголовно-правовой', callback_data: '2344' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '244') {
        klava234(chatId, query.message.chat.first_name)
    }
})

// клавиатура 3 курс 3 институт 4 специальность 
function klava334(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление юриспруденции`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Государственно-правовой', callback_data: '3341' }],
                [{ text: 'Гражданско-правовой', callback_data: '3342' }],
                [{ text: 'Юриспруденция', callback_data: '3342' }],
                [{ text: 'Уголовно-правовой', callback_data: '3343' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '344') {
        klava334(chatId, query.message.chat.first_name)
    }
})

// клавиатура 4 курс 3 институт 4 специальность 
function klava434(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление юриспруденции`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Государственно-правовой', callback_data: '4341' }],
                [{ text: 'Гражданско-правовой', callback_data: '4342' }],
                [{ text: 'Юриспруденция', callback_data: '4343' }],
                [{ text: 'Уголовно-правовой', callback_data: '4344' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '444') {
        klava434(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 3 института 4 специальности 1 направления*/
function photo1341(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1341') {
        photo1341(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 3 института 4 специальности 1 направления*/
function photo2341(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2341') {
        photo2341(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 3 института 4 специальности 1 направления*/
function photo3341(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3341') {
        photo3341(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 3 института 4 специальности 1 направления*/
function photo4341(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_40.03.01_gospravso_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4341') {
        photo4341(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 3 института 4 специальности 2 направления*/
function photo1342(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1342') {
        photo1342(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 3 института 4 специальности 2 направления*/
function photo2342(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_40.03.01_grpravso_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2342') {
        photo2342(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 3 института 4 специальности 2 направления*/
function photo3342(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3342') {
        photo3342(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 3 института 4 специальности 2 направления*/
function photo4342(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_40.03.01_grpravso_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4342') {
        photo4342(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 3 института 4 специальности 3 направления*/
function photo1343(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_40.03.01_u_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1343') {
        photo1343(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 3 института 4 специальности 3 направления*/
function photo2343(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2343') {
        photo2343(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 3 института 4 специальности 3 направления*/
function photo3343(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3343') {
        photo3343(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 3 института 4 специальности 3 направления*/
function photo4343(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4343') {
        photo4343(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 3 института 4 специальности 4 направления*/
function photo1344(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeit_bak_ofo_23.03.03_avtmob_sem_k3.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1344') {
        photo1344(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 3 института 4 специальности 4 направления*/
function photo2344(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_40.03.01_ugpravso_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2344') {
        photo2344(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 3 института 4 специальности 4 направления*/
function photo2344(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_40.03.01_ugpravso_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3344') {
        photo3344(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 3 института 4 специальности 4 направления*/
function photo4344(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iueiu_bak_ofo_40.03.01_ugpravso_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4344') {
        photo4344(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 1 специальности */
function photo141(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_01.03.02_pmi_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '151') {
        photo141(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 1 специальности */
function photo241(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_01.03.02_pmi_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '251') {
        photo241(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 1 специальности */
function photo341(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_01.03.02_pmi_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '351') {
        photo341(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 1 специальности */
function photo441(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_01.03.02_pmi_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '451') {
        photo441(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 2 специальности */
function photo142(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_02.03.01_matkn_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '152') {
        photo142(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 2 специальности */
function photo242(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_02.03.01_matkn_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '252') {
        photo242(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 2 специальности */
function photo342(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_02.03.01_matkn_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '352') {
        photo342(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 2 специальности */
function photo442(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_02.03.01_matkn_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '452') {
        photo442(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 3 специальности */
function photo143(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_04.03.01_hosheeeb_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '153') {
        photo143(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 3 специальности */
function photo243(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_04.03.01_hosheeeb_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '253') {
        photo243(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 3 специальности */
function photo343(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '353') {
        photo343(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 3 специальности */
function photo443(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '453') {
        photo443(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 4 специальности */
function photo144(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_05.03.02_rgtt_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '154') {
        photo144(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 4 специальности */
function photo244(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_05.03.02_rgtt_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '254') {
        photo244(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 4 специальности */
function photo344(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_05.03.02_rgtt_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '354') {
        photo344(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 4 специальности */
function photo444(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_05.03.02_rgtt_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '454') {
        photo444(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 5 специальности */
function photo145(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '155') {
        photo145(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 5 специальности */
function photo245(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_05.03.06_prirpol_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '255') {
        photo245(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 5 специальности */
function photo345(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_05.03.06_prirpol_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '355') {
        photo345(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 5 специальности */
function photo445(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_05.03.06_prirpol_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '455') {
        photo445(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 6 специальности */
function photo146(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_06.03.01_bioeko_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '156') {
        photo146(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 6 специальности */
function photo246(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_06.03.01_bioeko_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '256') {
        photo246(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 6 специальности */
function photo346(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_06.03.01_bioeko_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '356') {
        photo346(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 6 специальности */
function photo446(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_06.03.01_bioeko_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '456') {
        photo446(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 7 специальности */
function photo147(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.01_posvtas_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '157') {
        photo147(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 7 специальности */
function photo247(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.01_posvtas_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '257') {
        photo247(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 7 специальности */
function photo347(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.01_posvtas_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '357') {
        photo347(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 7 специальности */
function photo447(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.01_posvtas_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '457') {
        photo447(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 8 специальности */
function photo148(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.02_infst_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '158') {
        photo148(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 8 специальности */
function photo248(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.02_infst_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '258') {
        photo248(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 8 специальности */
function photo348(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.02_infst_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '358') {
        photo348(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 8 специальности */
function photo448(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.02_infst_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '458') {
        photo448(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 9 специальности */
function photo149(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.03_piib_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '159') {
        photo149(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 9 специальности */
function photo249(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '259') {
        photo249(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 9 специальности */
function photo349(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '359') {
        photo349(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 9 специальности */
function photo449(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '459') {
        photo449(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 10 специальности */
function photo1410(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.04_rpis_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1510') {
        photo1410(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 10 специальности */
function photo2410(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_09.03.04_rpis_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2510') {
        photo2410(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 10 специальности */
function photo3410(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3510') {
        photo3410(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 10 специальности */
function photo4410(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4510') {
        photo4410(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 11 специальности */
function photo1411(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_12.03.04_idmbp_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1511') {
        photo1411(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 11 специальности */
function photo2411(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_12.03.04_idmbp_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2511') {
        photo2411(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 11 специальности */
function photo3411(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_12.03.04_idmbp_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3511') {
        photo3411(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 11 специальности */
function photo4411(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_12.03.04_idmbp_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4511') {
        photo4411(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 12 специальности */
function photo1412(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1512') {
        photo1412(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 12 специальности */
function photo2412(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2512') {
        photo2412(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 12 специальности */
function photo3412(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_27.03.04.1_uivts_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3512') {
        photo3412(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 12 специальности */
function photo4412(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_27.03.04.1_uivts_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4512') {
        photo4412(chatId, query.message.chat.first_name)
    }
})
//клавиатура 1 курса 4 института 13 специальности
function klava1413(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление электроэнергетики и электротехники`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Биологическое и географическое образование', callback_data: '14131' }],
                [{ text: 'Биологическое и химическое образование', callback_data: '14132' }],
                [{ text: 'География и безопасность жизнедеятельности', callback_data: '14133' }],
                [{ text: 'Математическое и физическое образование', callback_data: '14134' }],
                [{ text: 'Математическое образование и информатика', callback_data: '14135' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1513') {
        klava1413(chatId, query.message.chat.first_name)
    }
})

//клавиатура 2 курса 4 института 13 специальности
function klava2413(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление электроэнергетики и электротехники`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Биологическое и географическое образование', callback_data: '24131' }],
                [{ text: 'Биологическое и химическое образование', callback_data: '24132' }],
                [{ text: 'География и безопасность жизнедеятельности', callback_data: '24133' }],
                [{ text: 'Математическое и физическое образование', callback_data: '24134' }],
                [{ text: 'Математическое образование и информатика', callback_data: '24135' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2513') {
        klava2413(chatId, query.message.chat.first_name)
    }
})

//клавиатура 3 курса 4 института 13 специальности
function klava3413(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление электроэнергетики и электротехники`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Биологическое и географическое образование', callback_data: '34131' }],
                [{ text: 'Биологическое и химическое образование', callback_data: '34132' }],
                [{ text: 'География и безопасность жизнедеятельности', callback_data: '34133' }],
                [{ text: 'Математическое и физическое образование', callback_data: '34134' }],
                [{ text: 'Математическое образование и информатика', callback_data: '34135' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3513') {
        klava3413(chatId, query.message.chat.first_name)
    }
})

//клавиатура 4 курса 4 института 13 специальности
function klava4413(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление электроэнергетики и электротехники`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Биологическое и географическое образование', callback_data: '44131' }],
                [{ text: 'Биологическое и химическое образование', callback_data: '44132' }],
                [{ text: 'География и безопасность жизнедеятельности', callback_data: '44133' }],
                [{ text: 'Математическое и физическое образование', callback_data: '44134' }],
                [{ text: 'Математическое образование и информатика', callback_data: '44135' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4513') {
        klava4413(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 13 специальности 1 направления*/
function photo14131(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '14131') {
        photo14131(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 13 специальности 1 направления*/
function photo24131(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '24131') {
        photo24131(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 3 курса 4 института 13 специальности 1 направления*/
function photo34131(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_44.03.05.6_bigo_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '34131') {
        photo34131(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 4 курса 4 института 13 специальности 1 направления*/
function photo44131(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_44.03.05.6_bigo_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '44131') {
        photo44131(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 1 курса 4 института 13 специальности 2 направления*/
function photo14132(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_44.03.05.6_biho_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '14132') {
        photo14132(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 2 курса 4 института 13 специальности 2 направления*/
function photo24132(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_44.03.05.6_biho_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '24132') {
        photo24132(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 13 специальности 2 направления*/
function photo34132(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '34132') {
        photo34132(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 13 специальности 2 направления*/
function photo44132(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '44132') {
        photo44132(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 13 специальности 3 направления*/
function photo14133(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '14133') {
        photo14133(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 13 специальности 3 направления*/
function photo24133(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_44.03.05.6_gibj_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '24133') {
        photo24133(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 13 специальности 3 направления*/
function photo34133(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '34133') {
        photo34133(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 13 специальности 3 направления*/
function photo44133(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '44133') {
        photo44133(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 13 специальности 4 направления*/
function photo14134(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_44.03.05.6_matfo_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '14134') {
        photo14134(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 13 специальности 4 направления*/
function photo24134(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_44.03.05.6_matfo_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '24134') {
        photo24134(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 13 специальности 4 направления*/
function photo34134(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '34134') {
        photo34134(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 13 специальности 4 направления*/
function photo44134(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '44134') {
        photo44134(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 4 института 13 специальности 5 направления*/
function photo14135(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '14135') {
        photo14135(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 4 института 13 специальности 5 направления*/
function photo24135(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/imeikn_bak_ofo_44.03.05.6_matoi_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '24135') {
        photo24135(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 4 института 13 специальности 5 направления*/
function photo34135(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '34135') {
        photo34135(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 4 института 13 специальности 5 направления*/
function photo44135(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '44135') {
        photo44135(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 5 института 1 специальности */
function photo151(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_39.03.02_sora_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '161') {
        photo151(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 5 института 1 специальности */
function photo251(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_39.03.02_sora_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '261') {
        photo251(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 5 института 1 специальности */
function photo351(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_39.03.02_sora_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '361') {
        photo351(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 5 института 1 специальности */
function photo451(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_39.03.02_sora_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '461') {
        photo451(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 5 института 2 специальности */
function photo152(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_44.03.01.8_ptghj_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '162') {
        photo152(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 5 института 2 специальности */
function photo252(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_44.03.01.8_ptghj_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '262') {
        photo252(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 5 института 2 специальности */
function photo352(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_44.03.01.8_ptghj_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '362') {
        photo352(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 5 института 2 специальности */
function photo452(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_44.03.01.8_ptghj_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '462') {
        photo452(chatId, query.message.chat.first_name)
    }
})

//клавиатура 1 курса 5 института 3 специальности
function klava153(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление психолого-педогагического образования`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Педагогика и психология общего образования', callback_data: '1531' }],
                [{ text: 'Психология и социальная педагогика', callback_data: '1532' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '163') {
        klava153(chatId, query.message.chat.first_name)
    }
})
//клавиатура 2 курса 5 института 3 специальности
function klava253(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление психолого-педагогического образования`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Педагогика и психология общего образования', callback_data: '2531' }],
                [{ text: 'Психология и социальная педагогика', callback_data: '2532' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '263') {
        klava253(chatId, query.message.chat.first_name)
    }
})

//клавиатура 3 курса 5 института 3 специальности
function klava353(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление психолого-педагогического образования`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Педагогика и психология общего образования', callback_data: '3531' }],
                [{ text: 'Психология и социальная педагогика', callback_data: '3532' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '363') {
        klava353(chatId, query.message.chat.first_name)
    }
})

//клавиатура 4 курса 5 института 3 специальности
function klava453(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление психолого-педагогического образования`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Педагогика и психология общего образования', callback_data: '4531' }],
                [{ text: 'Психология и социальная педагогика', callback_data: '4532' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '463') {
        klava453(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 5 института 3 специальности 1 направления*/
function photo1531(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_44.03.02_pipoo_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1531') {
        photo1531(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 5 института 3 специальности 1 направления*/
function photo2531(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_44.03.02_pipoo_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2531') {
        photo2531(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 5 института 3 специальности 1 направления*/
function photo3531(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3531') {
        photo3531(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 5 института 3 специальности 1 направления*/
function photo4531(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4531') {
        photo4531(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 5 института 3 специальности 2 направления*/
function photo1532(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1532') {
        photo1532(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 2 курса 5 института 3 специальности 2 направления*/
function photo2532(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2532') {
        photo2532(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 5 института 3 специальности 2 направления*/
function photo3532(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_44.03.02_psp_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3532') {
        photo3532(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 5 института 3 специальности 2 направления*/
function photo4532(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_44.03.02_psp_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4532') {
        photo4532(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 5 института 4 специальности */
function photo154(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_44.03.05.8_nain_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '164') {
        photo154(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 5 института 4 специальности */
function photo254(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_44.03.05.8_nain_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '264') {
        photo254(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 5 института 4 специальности */
function photo354(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '364') {
        photo354(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 5 института 4 специальности */
function photo454(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/imeikn_bak_ofo_09.03.03_pive_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '464') {
        photo454(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 5 института 5 специальности */
function photo155(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '165') {
        photo155(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 5 института 5 специальности */
function photo255(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_49.03.02_adapfiz_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '265') {
        photo255(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 5 института 5 специальности */
function photo355(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_49.03.02_adapfiz_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '365') {
        photo355(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 5 института 5 специальности */
function photo455(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ippifv_bak_ofo_49.03.02_adapfiz_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '465') {
        photo455(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 6 института 1 специальности */
function photo161(chatId, first_name) {
    bot.sendMessage(chatId, `Нет расписания`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '171') {
        photo161(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 5 института 1 специальности */
function photo251(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '271') {
        photo251(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 6 института 1 специальности */
function photo361(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '371') {
        photo361(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 6 института 1 специальности */
function photo461(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iiif_bak_ofo_39.03.01_soyp_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '471') {
        photo461(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 6 института 2 специальности */
function photo162(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '172') {
        photo162(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 6 института 2 специальности */
function photo262(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '272') {
        photo262(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 6 института 2 специальности */
function photo362(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '372') {
        photo362(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 6 института 2 специальности */
function photo462(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iiif_bak_ofo_41.03.06_ppsn_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '472') {
        photo462(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 6 института 3 специальности */
function photo163(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '173') {
        photo163(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 6 института 3 специальности */
function photo263(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '273') {
        photo263(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 6 института 3 специальности */
function photo363(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '373') {
        photo363(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 6 института 3 специальности */
function photo463(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '473') {
        photo463(chatId, query.message.chat.first_name)
    }
})
//клавиатура 1 курса 6 института 4 специальности 
function klava164(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление педагогического образования`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Иностранные языки (английский и французский)', callback_data: '1641' }],
                [{ text: 'Иностранные языки (английский и немецкий)', callback_data: '1642' }],
                [{ text: 'Историческое и обществоведческое образование', callback_data: '1643' }],
                [{ text: 'Русский язык и литература', callback_data: '1644' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '174') {
        klava164(chatId, query.message.chat.first_name)
    }
})

//клавиатура 2 курса 6 института 4 специальности 
function klava264(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление педагогического образования`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Иностранные языки (английский и французский)', callback_data: '2641' }],
                [{ text: 'Иностранные языки (английский и немецкий)', callback_data: '2642' }],
                [{ text: 'Историческое и обществоведческое образование', callback_data: '2643' }],
                [{ text: 'Русский язык и литература', callback_data: '2644' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '274') {
        klava264(chatId, query.message.chat.first_name)
    }
})
//клавиатура 3 курса 6 института 4 специальности
function klava364(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление педагогического образования`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Иностранные языки (английский и французский)', callback_data: '3641' }],
                [{ text: 'Иностранные языки (английский и немецкий)', callback_data: '3642' }],
                [{ text: 'Историческое и обществоведческое образование', callback_data: '3643' }],
                [{ text: 'Русский язык и литература', callback_data: '3644' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '374') {
        klava364(chatId, query.message.chat.first_name)
    }
})
//клавиатура 4 курса 6 института 4 специальности
function klava464(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление педагогического образования`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Иностранные языки (английский и французский)', callback_data: '4641' }],
                [{ text: 'Иностранные языки (английский и немецкий)', callback_data: '4642' }],
                [{ text: 'Историческое и обществоведческое образование', callback_data: '4643' }],
                [{ text: 'Русский язык и литература', callback_data: '4644' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '474') {
        klava464(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 6 института 4 специальности 1 направление*/
function photo1641(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iiif_bak_ofo_44.03.05.5_angfr_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1641') {
        photo1641(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 6 института 4 специальности 1 направление*/
function photo2641(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iiif_bak_ofo_44.03.05.5_angfr_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2641') {
        photo2641(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 6 института 4 специальности 1 направления*/
function photo3641(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_41.03.06_ppsn_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3641') {
        photo3641(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 6 института 4 специальности 1 направления*/
function photo4641(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_41.03.06_ppsn_sem_k4.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4641') {
        photo4641(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 1 курса 6 института 4 специальности 2 направления*/
function photo1642(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iiif_bak_ofo_44.03.05.5_angnem_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1642') {
        photo1642(chatId, query.message.chat.first_name)
    }
})
/* вывод фото 2 курса 6 института 4 специальности 2 направления*/
function photo2642(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iiif_bak_ofo_44.03.05.5_angnem_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2642') {
        photo2642(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 6 института 4 специальности 2 направление*/
function photo3642(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3642') {
        photo3642(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 6 института 4 специальности 2 направление*/
function photo4642(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4642') {
        photo4642(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 6 института 4 специальности 3 направление*/
function photo1643(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iiif_bak_ofo_44.03.05.5_iioo_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1643') {
        photo1643(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 6 института 4 специальности 3 направление*/
function photo2643(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iiif_bak_ofo_44.03.05.5_iioo_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2643') {
        photo2643(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 6 института 4 специальности 3 направление*/
function photo3643(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3643') {
        photo3643(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 6 института 4 специальности 3 направление*/
function photo4643(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4643') {
        photo4643(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 6 института 4 специальности 4 направление*/
function photo1644(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iiif_bak_ofo_44.03.05.5_ryailit_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1644') {
        photo1644(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 6 института 4 специальности 4 направление*/
function photo2644(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/iiif_bak_ofo_44.03.05.5_ryailit_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2644') {
        photo2644(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 6 института 4 специальности 4 направление*/
function photo3644(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3644') {
        photo3644(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 6 института 4 специальности 4 направление*/
function photo4644(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4644') {
        photo4644(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 7 института 1 специальности */
function photo171(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '181') {
        photo171(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 7 института 1 специальности */
function photo271(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '281') {
        photo271(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 7 института 1 специальности */
function photo371(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '381') {
        photo371(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 7 института 1 специальности */
function photo471(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_39.03.01_soyp_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '481') {
        photo471(chatId, query.message.chat.first_name)
    }
})
//клавиатура 1 курса 7 института 2 специальности
function klava172(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление туризма`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Технология и организация туроператорских и турагентских услуг', callback_data: '1721' }],
                [{ text: 'Туристское обслуживание и разработка туристского продукта', callback_data: '1722' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '182') {
        klava172(chatId, query.message.chat.first_name)
    }
})

//клавиатура 2 курса 7 института 2 специальности
function klava272(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление туризма`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Технология и организация туроператорских и турагентских услуг', callback_data: '2721' }],
                [{ text: 'Туристское обслуживание и разработка туристского продукта', callback_data: '2722' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '282') {
        klava272(chatId, query.message.chat.first_name)
    }
})

//клавиатура 3 курса 7 института 2 специальности
function klava372(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление туризма`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Технология и организация туроператорских и турагентских услуг', callback_data: '3721' }],
                [{ text: 'Туристское обслуживание и разработка туристского продукта', callback_data: '3722' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '382') {
        klava372(chatId, query.message.chat.first_name)
    }
})

//клавиатура 4 курса 7 института 2 специальности
function klava472(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление туризма`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Технология и организация туроператорских и турагентских услуг', callback_data: '4721' }],
                [{ text: 'Туристское обслуживание и разработка туристского продукта', callback_data: '4722' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '482') {
        klava472(chatId, query.message.chat.first_name)
    }
})
// расписание 1 курс 7 институт 2 специальность 1 направление
function photo1721(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1721') {
        photo1721(chatId, query.message.chat.first_name)
    }
})

// расписание 2 курс 7 институт 2 специальность 1 направление
function photo2721(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2721') {
        photo2721(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 7 института 2 специальности 1 направление */
function photo3721(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_43.03.02_rty_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3721') {
        photo3721(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 7 института 2 специальности 1 направление */
function photo4721(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_43.03.02_rty_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4721') {
        photo4721(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 7 института 2 специальности 2 направление */
function photo1722(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_43.03.02_toirtp_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1722') {
        photo1722(chatId, query.message.chat.first_name)
    }
})

// расписание 2 курс 7 институт 2 специальность 2 направление
function photo2722(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2722') {
        photo2722(chatId, query.message.chat.first_name)
    }
})

// расписание 3 курс 7 институт 2 специальность 1 направление
function photo3722(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3722') {
        photo3722(chatId, query.message.chat.first_name)
    }
})

// расписание 4 курс 7 институт 2 специальность 2 направление
function photo4722(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4722') {
        photo4722(chatId, query.message.chat.first_name)
    }
})

//клавиатура 1 курса 7 института 3 специальности
function klava173(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление педагогического образования (с двумя профилями подготовки)`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Культурологическое образование и иностранный язык', callback_data: '1731' }],
                [{ text: 'Музыкальное и дополнительное образование', callback_data: '1732' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '183') {
        klava173(chatId, query.message.chat.first_name)
    }
})

//клавиатура 2 курса 7 института 3 специальности
function klava273(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление педагогического образования (с двумя профилями подготовки)`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Культурологическое образование и иностранный язык', callback_data: '2731' }],
                [{ text: 'Музыкальное и дополнительное образование', callback_data: '2732' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '283') {
        klava273(chatId, query.message.chat.first_name)
    }
})

//клавиатура 3 курса 7 института 3 специальности
function klava373(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление педагогического образования (с двумя профилями подготовки)`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Культурологическое образование и иностранный язык', callback_data: '3731' }],
                [{ text: 'Музыкальное и дополнительное образование', callback_data: '3732' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '383') {
        klava373(chatId, query.message.chat.first_name)
    }
})

//клавиатура 4 курса 7 института 3 специальности
function klava473(chatId, first_name) {
    bot.sendMessage(chatId, `Вы выбрали направление педагогического образования (с двумя профилями подготовки)`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Культурологическое образование и иностранный язык', callback_data: '4731' }],
                [{ text: 'Туристское обслуживание и разработка туристского продукта', callback_data: '4732' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '483') {
        klava473(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 7 института 3 специальности 1 направление */
function photo1731(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_44.03.05.4_koiiya_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1731') {
        photo1731(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 7 института 3 специальности 1 направление */
function photo2731(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_44.03.05.4_koiiya_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2731') {
        photo2731(chatId, query.message.chat.first_name)
    }
})

// расписание 3 курс 7 институт 3 специальность 1 направление
function photo3731(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3731') {
        photo3731(chatId, query.message.chat.first_name)
    }
})

// расписание 4 курс 7 институт 3 специальность 1 направление
function photo4731(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4731') {
        photo4731(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 7 института 3 специальности 2 направление */
function photo1732(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_44.03.05.4_mido_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '1732') {
        photo1732(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 7 института 3 специальности 2 направление */
function photo2732(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_44.03.05.4_mido_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '2732') {
        photo2732(chatId, query.message.chat.first_name)
    }
})

// расписание 3 курс 7 институт 3 специальность 2 направление
function photo3732(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '3732') {
        photo3732(chatId, query.message.chat.first_name)
    }
})

// расписание 4 курс 7 институт 3 специальность 2 направление
function photo4732(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        //bot.sendDocument(chatId, './images/iiif_bak_ofo_42.03.02_jyr_sem_k1.pdf')
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '4732') {
        photo4732(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 7 института 4 специальности */
function photo174(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_45.03.02_perper_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '184') {
        photo174(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 7 института 4 специальности */
function photo274(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_45.03.02_perper_sem_k2.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '284') {
        photo274(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 7 института 4 специальности */
function photo374(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_45.03.02_perper_sem_k3.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '384') {
        photo374(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 7 института 4 специальности */
function photo474(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_45.03.02_perper_sem_k4.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '484') {
        photo474(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 7 института 5 специальности */
function photo175(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_51.03.01_uvss_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '185') {
        photo175(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 7 института 5 специальности */
function photo275(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_51.03.01_uvss_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '285') {
        photo275(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 7 института 5 специальности */
function photo375(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_51.03.01_uvss_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '385') {
        photo375(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 7 института 5 специальности */
function photo475(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_51.03.01_uvss_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '485') {
        photo475(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 1 курса 7 института 6 специальности */
function photo176(chatId, first_name) {
    Rasp.findOne({ link: "http://tt.vogu35.ru/files/ikit_bak_ofo_53.03.06_eml_sem_k1.pdf" }).then(raspisanie12 => {
        bot.sendMessage(chatId, `Вот ваше расписание:
${raspisanie12.link}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
            }
        })
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '186') {
        photo176(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 2 курса 7 института 6 специальности */
function photo276(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '286') {
        photo276(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 3 курса 7 института 6 специальности */
function photo376(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '386') {
        photo376(chatId, query.message.chat.first_name)
    }
})

/* вывод фото 4 курса 7 института 6 специальности */
function photo476(chatId, first_name) {
    bot.sendMessage(chatId, `Расписания нет`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '486') {
        photo476(chatId, query.message.chat.first_name)
    }
})

/* Клавиатура с институтами (Контакты) */
function contacti(chatId, first_name) {
    console.log(`${first_name} вошел в раздел с контактами`)
    bot.sendMessage(chatId, `Выберите институт`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Институт машиностроения, энергетики и транспорта', callback_data: 'imet' }],
                [{ text: 'Инженерно-строительный институт', callback_data: 'isi' }],
                [{ text: 'Институт управления, экономики и юриспруденции', callback_data: 'iyeiu' }],
                [{ text: 'Институт математики, естественных и компьютерных наук', callback_data: 'imekn' }],
                [{ text: 'Институт педагогики, психологии и физического воспитания', callback_data: 'ippfv' }],
                [{ text: 'Институт социальных и гуманитарных наук', callback_data: 'isgn' }],
                [{ text: 'Институт культуры и туризма', callback_data: 'ikt' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'contact') {
        contacti(chatId, query.message.chat.first_name)
    }
})

function kafIsi(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите кафедру`, {

        reply_markup: {
            inline_keyboard:
                [
                    [{ text: 'Директорат', callback_data: 'dirIsi' }],
                    [{ text: 'Кафедра автомобильных дорог', callback_data: 'ad' }],
                    [{ text: 'Кафедра архитектуры и градостроительства', callback_data: 'aig' }],
                    [{ text: 'Кафедра промышленного и гражданского строительства', callback_data: 'pgs' }],
                    [{ text: 'Кафедра теплогазоснабжения', callback_data: 'tgv' }],
                    [{ text: 'Кафедра городского кадастра и геодезии', callback_data: 'gkig' }],
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'isi') {
        kafIsi(chatId, query.message.chat.first_name)
    }
})


function contactDirIsi(chatId, first_name) {
    Kaf.findOne({ uuid: "dirIsi" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'dirIsi') {
        contactDirIsi(chatId, query.message.chat.first_name)
    }
})


function contactAd(chatId, first_name) {
    Kaf.findOne({ uuid: "ad" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preAd' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ad') {
        contactAd(chatId, query.message.chat.first_name)
    }
})
function contactPre(chatId, first_name) {
    Pre.find({ uuid: "preAd" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preAd') {
        contactPre(chatId, query.message.chat.first_name)
    }
})

function contactAd(chatId, first_name) {
    Kaf.findOne({ uuid: "aig" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preAig' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'aig') {
        contactAd(chatId, query.message.chat.first_name)
    }
})
function contactPreAig(chatId, first_name) {
    Pre.find({ uuid: "preAig" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preAig') {
        contactPreAig(chatId, query.message.chat.first_name)
    }
})

function contactPgs(chatId, first_name) {
    Kaf.findOne({ uuid: "pgs" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'prePgs' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'pgs') {
        contactPgs(chatId, query.message.chat.first_name)
    }
})
function contactPrePgs(chatId, first_name) {
    Pre.find({ uuid: "prePgs" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'prePgs') {
        contactPrePgs(chatId, query.message.chat.first_name)
    }
})

function contactTgv(chatId, first_name) {
    Kaf.findOne({ uuid: "tgv" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preTgv' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'tgv') {
        contactTgv(chatId, query.message.chat.first_name)
    }
})
function contactPreTgv(chatId, first_name) {
    Pre.find({ uuid: "preTgv" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preTgv') {
        contactPreTgv(chatId, query.message.chat.first_name)
    }
})

function contactGkig(chatId, first_name) {
    Kaf.findOne({ uuid: "gkig" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preGkig' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'gkig') {
        contactGkig(chatId, query.message.chat.first_name)
    }
})
function contactPreGkig(chatId, first_name) {
    Pre.find({ uuid: "preGkig" }).then(prepods => {

        const html = prepods.map((p) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preGkig') {
        contactPreGkig(chatId, query.message.chat.first_name)
    }
})


function kafIsgn(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите кафедру`, {

        reply_markup: {
            inline_keyboard:
                [
                    [{ text: 'Директорат', callback_data: 'dirIsign' }],
                    [{ text: 'Кафедра английского языка', callback_data: 'eng' }],
                    [{ text: 'Кафедра немецкого и французского языков', callback_data: 'nf' }],
                    [{ text: 'Кафедра отечественной истории', callback_data: 'ohist' }],
                    [{ text: 'Кафедра всеобщей истории и мировой политики', callback_data: 'vsehist' }],
                    [{ text: 'Кафедра русского языка, журналистики и теории коммуникации', callback_data: 'rus' }],
                    [{ text: 'Кафедра литературы', callback_data: 'lit' }],
                    [{ text: 'Кафедра философии', callback_data: 'fip' }],
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'isgn') {
        kafIsgn(chatId, query.message.chat.first_name)
    }
})

function contactDirIsign(chatId, first_name) {
    Kaf.findOne({ uuid: "dirIsign" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'dirIsign') {
        contactDirIsign(chatId, query.message.chat.first_name)
    }
})

function contactEng(chatId, first_name) {
    Kaf.findOne({ uuid: "eng" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preEng' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'eng') {
        contactEng(chatId, query.message.chat.first_name)
    }
})
function contactPreEng(chatId, first_name) {
    Pre.find({ uuid: "preEng" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preEng') {
        contactPreEng(chatId, query.message.chat.first_name)
    }
})

function contactNf(chatId, first_name) {
    Kaf.findOne({ uuid: "nf" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preNf' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'nf') {
        contactNf(chatId, query.message.chat.first_name)
    }
})
function contactPreNf(chatId, first_name) {
    Pre.find({ uuid: "preNf" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preNf') {
        contactPreNf(chatId, query.message.chat.first_name)
    }
})

function contactOhist(chatId, first_name) {
    Kaf.findOne({ uuid: "ohist" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preOhist' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ohist') {
        contactOhist(chatId, query.message.chat.first_name)
    }
})
function contactPreOhist(chatId, first_name) {
    Pre.find({ uuid: "preOhist" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preOhist') {
        contactPreOhist(chatId, query.message.chat.first_name)
    }
})

function contactVsehist(chatId, first_name) {
    Kaf.findOne({ uuid: "vsehist" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preVsehist' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'vsehist') {
        contactVsehist(chatId, query.message.chat.first_name)
    }
})
function contactPreVsehist(chatId, first_name) {
    Pre.find({ uuid: "preVsehist" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preVsehist') {
        contactPreVsehist(chatId, query.message.chat.first_name)
    }
})

function contactRus(chatId, first_name) {
    Kaf.findOne({ uuid: "rus" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preRus' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'rus') {
        contactRus(chatId, query.message.chat.first_name)
    }
})
function contactPreRus(chatId, first_name) {
    Pre.find({ uuid: "preRus" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preRus') {
        contactPreRus(chatId, query.message.chat.first_name)
    }
})

function contactLit(chatId, first_name) {
    Kaf.findOne({ uuid: "lit" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preLit' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'lit') {
        contactLit(chatId, query.message.chat.first_name)
    }
})
function contactPreLit(chatId, first_name) {
    Pre.find({ uuid: "preLit" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preLit') {
        contactPreLit(chatId, query.message.chat.first_name)
    }
})

function contactFip(chatId, first_name) {
    Kaf.findOne({ uuid: "fip" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preFip' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'fip') {
        contactFip(chatId, query.message.chat.first_name)
    }
})
function contactPreFip(chatId, first_name) {
    Pre.find({ uuid: "preFip" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preFip') {
        contactPreFip(chatId, query.message.chat.first_name)
    }
})



function kafImekn(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите кафедру`, {
        reply_markup: {
            inline_keyboard:
                [
                    [{ text: 'Директорат', callback_data: 'dirImekn' }],
                    [{ text: 'Кафедра математики и информатики', callback_data: 'mat' }],
                    [{ text: 'Кафедра физики', callback_data: 'fiz' }],
                    [{ text: 'Кафедра прикладной математики', callback_data: 'pm' }],
                    [{ text: 'Кафедра биологии и химии', callback_data: 'bio' }],
                    [{ text: 'Кафедра географии и рационального природопользования', callback_data: 'geo' }],
                    [{ text: 'Кафедра автоматики и вычислительной техники', callback_data: 'avt' }],
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'imekn') {
        kafImekn(chatId, query.message.chat.first_name)
    }
})

function contactDirImekn(chatId, first_name) {
    Kaf.findOne({ uuid: "dirImekn" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'dirImekn') {
        contactDirImekn(chatId, query.message.chat.first_name)
    }
})

function contactMat(chatId, first_name) {
    Kaf.findOne({ uuid: "mat" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preMat' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'mat') {
        contactMat(chatId, query.message.chat.first_name)
    }
})
function contactPreMat(chatId, first_name) {
    Pre.find({ uuid: "preMat" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preMat') {
        contactPreMat(chatId, query.message.chat.first_name)
    }
})

function contactFiz(chatId, first_name) {
    Kaf.findOne({ uuid: "fiz" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preFiz' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'fiz') {
        contactFiz(chatId, query.message.chat.first_name)
    }
})
function contactPreFiz(chatId, first_name) {
    Pre.find({ uuid: "preFiz" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preFiz') {
        contactPreFiz(chatId, query.message.chat.first_name)
    }
})

function contactPm(chatId, first_name) {
    Kaf.findOne({ uuid: "pm" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'prePm' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'pm') {
        contactPm(chatId, query.message.chat.first_name)
    }
})
function contactPrePm(chatId, first_name) {
    Pre.find({ uuid: "prePm" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'prePm') {
        contactPrePm(chatId, query.message.chat.first_name)
    }
})

function contactBio(chatId, first_name) {
    Kaf.findOne({ uuid: "bio" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preBio' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'bio') {
        contactBio(chatId, query.message.chat.first_name)
    }
})
function contactPreBio(chatId, first_name) {
    Pre.find({ uuid: "preBio" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preBio') {
        contactPreBio(chatId, query.message.chat.first_name)
    }
})

function contactGeo(chatId, first_name) {
    Kaf.findOne({ uuid: "geo" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preGeo' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'geo') {
        contactGeo(chatId, query.message.chat.first_name)
    }
})
function contactPreGeo(chatId, first_name) {
    Pre.find({ uuid: "preGeo" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preGeo') {
        contactPreGeo(chatId, query.message.chat.first_name)
    }
})

function contactAvt(chatId, first_name) {
    Kaf.findOne({ uuid: "avt" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preAvt' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'avt') {
        contactAvt(chatId, query.message.chat.first_name)
    }
})
function contactPreAvt(chatId, first_name) {
    Pre.find({ uuid: "preAvt" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preAvt') {
        contactPreAvt(chatId, query.message.chat.first_name)
    }
})


function kafIkt(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите кафедру`, {

        reply_markup: {
            inline_keyboard:
                [
                    [{ text: 'Директорат', callback_data: 'dirIkt' }],
                    [{ text: 'Кафедра музыкального искусства и образования', callback_data: 'tim' }],
                    [{ text: 'Кафедра теории, истории культуры и этнологии', callback_data: 'ticie' }],
                    [{ text: 'Кафедра лингвистики и межкультурной коммуникации', callback_data: 'limk' }],
                    [{ text: 'Кафедра туризма и гостеприимства', callback_data: 'tig' }],
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ikt') {
        kafIkt(chatId, query.message.chat.first_name)
    }
})

function contactDirIkt(chatId, first_name) {
    Kaf.findOne({ uuid: "dirIkt" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'dirIkt') {
        contactDirIkt(chatId, query.message.chat.first_name)
    }
})

function contactTim(chatId, first_name) {
    Kaf.findOne({ uuid: "tim" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preTim' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'tim') {
        contactTim(chatId, query.message.chat.first_name)
    }
})
function contactPreTim(chatId, first_name) {
    Pre.find({ uuid: "preTim" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preTim') {
        contactPreTim(chatId, query.message.chat.first_name)
    }
})

function contactTicie(chatId, first_name) {
    Kaf.findOne({ uuid: "ticie" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preTicie' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ticie') {
        contactTicie(chatId, query.message.chat.first_name)
    }
})
function contactPreTicie(chatId, first_name) {
    Pre.find({ uuid: "preTicie" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preTicie') {
        contactPreTicie(chatId, query.message.chat.first_name)
    }
})

function contactLimk(chatId, first_name) {
    Kaf.findOne({ uuid: "limk" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preLimk' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'limk') {
        contactLimk(chatId, query.message.chat.first_name)
    }
})
function contactPreLimk(chatId, first_name) {
    Pre.find({ uuid: "preLimk" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preLimk') {
        contactPreLimk(chatId, query.message.chat.first_name)
    }
})

function contactTig(chatId, first_name) {
    Kaf.findOne({ uuid: "tig" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preTig' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'tig') {
        contactTig(chatId, query.message.chat.first_name)
    }
})
function contactPreTig(chatId, first_name) {
    Pre.find({ uuid: "preTig" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preTig') {
        contactPreTig(chatId, query.message.chat.first_name)
    }
})


function kafImet(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите кафедру`, {

        reply_markup: {
            inline_keyboard:
                [
                    [{ text: 'Директорат', callback_data: 'dirImet' }],
                    [{ text: 'Кафедра автомобилей и автомобильного хозяйства', callback_data: 'aiah' }],
                    [{ text: 'Кафедра электрооборудования', callback_data: 'eo' }],
                    [{ text: 'Кафедра управляющих и вычислительных систем', callback_data: 'uvs' }],
                    [{ text: 'Кафедра технологии машиностроения', callback_data: 'tms' }],
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'imet') {
        kafImet(chatId, query.message.chat.first_name)
    }
})

function contactDirImet(chatId, first_name) {
    Kaf.findOne({ uuid: "dirImet" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'dirImet') {
        contactDirImet(chatId, query.message.chat.first_name)
    }
})

function contactAiah(chatId, first_name) {
    Kaf.findOne({ uuid: "aiah" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preAiah' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'aiah') {
        contactAiah(chatId, query.message.chat.first_name)
    }
})
function contactPreAiah(chatId, first_name) {
    Pre.find({ uuid: "preAiah" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preAiah') {
        contactPreAiah(chatId, query.message.chat.first_name)
    }
})

function contactEo(chatId, first_name) {
    Kaf.findOne({ uuid: "eo" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preEo' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'eo') {
        contactEo(chatId, query.message.chat.first_name)
    }
})
function contactPreEo(chatId, first_name) {
    Pre.find({ uuid: "preEo" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preEo') {
        contactPreEo(chatId, query.message.chat.first_name)
    }
})

function contactUvs(chatId, first_name) {
    Kaf.findOne({ uuid: "uvs" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preUvs' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'uvs') {
        contactUvs(chatId, query.message.chat.first_name)
    }
})
function contactPreUvs(chatId, first_name) {
    Pre.find({ uuid: "preUvs" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preUvs') {
        contactPreUvs(chatId, query.message.chat.first_name)
    }
})

function contactTms(chatId, first_name) {
    Kaf.findOne({ uuid: "tms" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preTms' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'tms') {
        contactTms(chatId, query.message.chat.first_name)
    }
})
function contactPreTms(chatId, first_name) {
    Pre.find({ uuid: "preTms" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preTms') {
        contactPreTms(chatId, query.message.chat.first_name)
    }
})


function kafIppfv(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите кафедру`, {

        reply_markup: {
            inline_keyboard:
                [
                    [{ text: 'Директорат', callback_data: 'dirIppfv' }],
                    [{ text: 'Кафедра физической культуры, спорта и адаптивного физического воспитания', callback_data: 'fizvos' }],
                    [{ text: 'Кафедра социальных технологий', callback_data: 'sr' }],
                    [{ text: 'Кафедра психологии и педагогики', callback_data: 'psy' }],
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ippfv') {
        kafIppfv(chatId, query.message.chat.first_name)
    }
})

function contactDirIppfv(chatId, first_name) {
    Kaf.findOne({ uuid: "dirIppfv" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'dirIppfv') {
        contactDirIppfv(chatId, query.message.chat.first_name)
    }
})

function contactFizvos(chatId, first_name) {
    Kaf.findOne({ uuid: "fizvos" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preFizvos' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'fizvos') {
        contactFizvos(chatId, query.message.chat.first_name)
    }
})
function contactPreFizvos(chatId, first_name) {
    Pre.find({ uuid: "preFizvos" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preFizvos') {
        contactPreFizvos(chatId, query.message.chat.first_name)
    }
})

function contactSr(chatId, first_name) {
    Kaf.findOne({ uuid: "sr" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preSr' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'sr') {
        contactSr(chatId, query.message.chat.first_name)
    }
})
function contactPreSr(chatId, first_name) {
    Pre.find({ uuid: "preSr" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preSr') {
        contactPreSr(chatId, query.message.chat.first_name)
    }
})

function contactPsy(chatId, first_name) {
    Kaf.findOne({ uuid: "psy" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'prePsy' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'psy') {
        contactPsy(chatId, query.message.chat.first_name)
    }
})
function contactPrePsy(chatId, first_name) {
    Pre.find({ uuid: "prePsy" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'prePsy') {
        contactPrePsy(chatId, query.message.chat.first_name)
    }
})



function kafIyeiu(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите кафедру`, {

        reply_markup: {
            inline_keyboard:
                [
                    [{ text: 'Директорат', callback_data: 'dirIyeiu' }],
                    [{ text: 'Кафедра юриспруденции', callback_data: 'ku' }],
                    [{ text: 'Кафедра финансов и кредита', callback_data: 'fic' }],
                    [{ text: 'Кафедра инновационного менеджемента и управления проектами', callback_data: 'kimup' }],
                    [{ text: 'Кафедра региональной экономики', callback_data: 're' }],
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'iyeiu') {
        kafIyeiu(chatId, query.message.chat.first_name)
    }
})

function contactDirIyeiu(chatId, first_name) {
    Kaf.findOne({ uuid: "dirIyeiu" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'dirIyeiu') {
        contactDirIyeiu(chatId, query.message.chat.first_name)
    }
})

function contactKu(chatId, first_name) {
    Kaf.findOne({ uuid: "ku" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preKu' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ku') {
        contactKu(chatId, query.message.chat.first_name)
    }
})
function contactPreKu(chatId, first_name) {
    Pre.find({ uuid: "preKu" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preKu') {
        contactPreKu(chatId, query.message.chat.first_name)
    }
})

function contactFic(chatId, first_name) {
    Kaf.findOne({ uuid: "fic" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preFic' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'fic') {
        contactFic(chatId, query.message.chat.first_name)
    }
})
function contactPreFic(chatId, first_name) {
    Pre.find({ uuid: "preFic" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preFic') {
        contactPreFic(chatId, query.message.chat.first_name)
    }
})

function contactKimup(chatId, first_name) {
    Kaf.findOne({ uuid: "kimup" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preKimup' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kimup') {
        contactKimup(chatId, query.message.chat.first_name)
    }
})
function contactPreKimup(chatId, first_name) {
    Pre.find({ uuid: "preKimup" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preKimup') {
        contactPreKimup(chatId, query.message.chat.first_name)
    }
})

function contactRe(chatId, first_name) {
    Kaf.findOne({ uuid: "re" }).then(kafed => {
        bot.sendMessage(chatId, `${kafed.name}\nАдрес: ${kafed.adres}\nТелефон: ${kafed.phone}\nE-mail: ${kafed.email}`)
        bot.sendLocation(chatId, kafed.locationA, kafed.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '👩‍🏫Преподаватели кафедры', callback_data: 'preRe' }],
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 're') {
        contactRe(chatId, query.message.chat.first_name)
    }
})

function contactPreRe(chatId, first_name) {
    Pre.find({ uuid: "preRe" }).then(prepods => {

        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}`
        }).join('\n\n')

        bot.sendMessage(chatId, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'preRe') {
        contactPreRe(chatId, query.message.chat.first_name)
    }
})
// клавиатура общежития
function obshchezitie(chatId, first_name) {
    console.log(`${first_name} решил посмотреть информацию об общежитиях`)
    bot.sendMessage(chatId, `Выберите общежитие`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Квитанция для оплаты общежития', callback_data: 'kvit' }],
                [{ text: 'Общежитие №1', callback_data: 'ob1' }],
                [{ text: 'Общежитие №2', callback_data: 'ob2' }],
                [{ text: 'Общежитие №3', callback_data: 'ob3' }],
                [{ text: 'Общежитие №4', callback_data: 'ob4' }],
                [{ text: 'Общежитие №5', callback_data: 'ob5' }],
                [{ text: 'Общежитие №6', callback_data: 'ob6' }],
                [{ text: 'Общежитие №7', callback_data: 'ob7' }],
                [{ text: 'Общежитие №8', callback_data: 'ob8' }],
                [{ text: 'Общежитие №11', callback_data: 'ob11' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ob') {
        obshchezitie(chatId, query.message.chat.first_name)
    }
})
//квитанция для оплаты за общежитие
function kvitanc(chatId, first_name) {
    bot.sendDocument(chatId, './kvitantsiya.pdf', {
        reply_markup: {
            inline_keyboard:
                [
                    [{ text: '⬅️На главную', callback_data: '12' }]
                ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kvit') {
        kvitanc(chatId, query.message.chat.first_name)
    }
})
//общежитие 1
function obFirst(chatId, first_name) {
    Ob.findOne({ uuid: "ob1" }).then(obshchez => {
        bot.sendMessage(chatId, `${obshchez.name}\nКомендант: ${obshchez.comendant}\nАдрес: ${obshchez.adres}\nТелефон: ${obshchez.phone}\nE-mail: ${obshchez.email}`)
        bot.sendLocation(chatId, obshchez.locationA, obshchez.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ob1') {
        obFirst(chatId, query.message.chat.first_name)
    }
})
//общежитие 2
function obTwo(chatId, first_name) {
    Ob.findOne({ uuid: "ob2" }).then(obshchez => {
        bot.sendMessage(chatId, `${obshchez.name}\nКомендант: ${obshchez.comendant}\nАдрес: ${obshchez.adres}\nТелефон: ${obshchez.phone}\nE-mail: ${obshchez.email}`)
        bot.sendLocation(chatId, obshchez.locationA, obshchez.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ob2') {
        obTwo(chatId, query.message.chat.first_name)
    }
})
//общежитие 3
function obThree(chatId, first_name) {
    Ob.findOne({ uuid: "ob3" }).then(obshchez => {
        bot.sendMessage(chatId, `${obshchez.name}\nКомендант: ${obshchez.comendant}\nАдрес: ${obshchez.adres}\nТелефон: ${obshchez.phone}\nE-mail: ${obshchez.email}`)
        bot.sendLocation(chatId, obshchez.locationA, obshchez.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ob3') {
        obThree(chatId, query.message.chat.first_name)
    }
})
//общежитие 4
function obFour(chatId, first_name) {
    Ob.findOne({ uuid: "ob4" }).then(obshchez => {
        bot.sendMessage(chatId, `${obshchez.name}\nКомендант: ${obshchez.comendant}\nАдрес: ${obshchez.adres}\nТелефон: ${obshchez.phone}\nE-mail: ${obshchez.email}`)
        bot.sendLocation(chatId, obshchez.locationA, obshchez.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ob4') {
        obFour(chatId, query.message.chat.first_name)
    }
})
//общежитие 5
function obFive(chatId, first_name) {
    Ob.findOne({ uuid: "ob5" }).then(obshchez => {
        bot.sendMessage(chatId, `${obshchez.name}\nКомендант: ${obshchez.comendant}\nАдрес: ${obshchez.adres}\nТелефон: ${obshchez.phone}\nE-mail: ${obshchez.email}`)
        bot.sendLocation(chatId, obshchez.locationA, obshchez.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ob5') {
        obFive(chatId, query.message.chat.first_name)
    }
})
//общежитие 6
function obSix(chatId, first_name) {
    Ob.findOne({ uuid: "ob6" }).then(obshchez => {
        bot.sendMessage(chatId, `${obshchez.name}\nКомендант: ${obshchez.comendant}\nАдрес: ${obshchez.adres}\nТелефон: ${obshchez.phone}\nE-mail: ${obshchez.email}`)
        bot.sendLocation(chatId, obshchez.locationA, obshchez.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ob6') {
        obSix(chatId, query.message.chat.first_name)
    }
})
//общежитие 7
function obSeven(chatId, first_name) {
    Ob.findOne({ uuid: "ob7" }).then(obshchez => {
        bot.sendMessage(chatId, `${obshchez.name}\nКомендант: ${obshchez.comendant}\nАдрес: ${obshchez.adres}\nТелефон: ${obshchez.phone}\nE-mail: ${obshchez.email}`)
        bot.sendLocation(chatId, obshchez.locationA, obshchez.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ob7') {
        obSeven(chatId, query.message.chat.first_name)
    }
})
//общежитие 8
function obEighth(chatId, first_name) {
    Ob.findOne({ uuid: "ob8" }).then(obshchez => {
        bot.sendMessage(chatId, `${obshchez.name}\nКомендант: ${obshchez.comendant}\nАдрес: ${obshchez.adres}\nТелефон: ${obshchez.phone}\nE-mail: ${obshchez.email}`)
        bot.sendLocation(chatId, obshchez.locationA, obshchez.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ob8') {
        obEighth(chatId, query.message.chat.first_name)
    }
})
//общежитие 11
function obEleven(chatId, first_name) {
    Ob.findOne({ uuid: "ob11" }).then(obshchez => {
        bot.sendMessage(chatId, `${obshchez.name}\nКомендант: ${obshchez.comendant}\nАдрес: ${obshchez.adres}\nТелефон: ${obshchez.phone}\nE-mail: ${obshchez.email}`)
        bot.sendLocation(chatId, obshchez.locationA, obshchez.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'ob11') {
        obEleven(chatId, query.message.chat.first_name)
    }
})

//клавиатура корпусов и здравпунктов с бухгалтерией первая страница
function contBlocks1(chatId, first_name) {
    console.log(`${first_name} решил узнать информацию о корпусах`)
    bot.sendMessage(chatId, `Выберите необходимое`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📈Бухгалтерия', callback_data: 'buhg' }],
                [{ text: '🏥Здравпункты', callback_data: 'zd' }],
                [{ text: 'Учебный корпус №1', callback_data: 'kor1' }],
                [{ text: '   Учебный корпус №2   ', callback_data: 'kor2' }],
                [{ text: 'Учебный корпус №3', callback_data: 'kor3' }],
                [{ text: 'Далее ⏩', callback_data: 'next' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'korp') {
        contBlocks1(chatId, query.message.chat.first_name)
    }
})
//клавиатура корпусов 2
function contBlocks2(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите необходимое`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Учебный корпус №4', callback_data: 'kor4' }],
                [{ text: 'Учебный корпус №5', callback_data: 'kor5' }],
                [{ text: '   Учебный корпус №6   ', callback_data: 'kor6' }],
                [{ text: 'Учебный корпус №7', callback_data: 'kor7' }],
                [{ text: 'Учебный корпус №8', callback_data: 'kor8' }],
                [{ text: 'Учебный корпус №9', callback_data: 'kor9' }],
                [{ text: '⏪ Назад', callback_data: 'back' }, { text: 'Далее ⏩', callback_data: 'next2' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'next') {
        contBlocks2(chatId, query.message.chat.first_name)
    }
})

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'back') {
        contBlocks1(chatId, query.message.chat.first_name)
    }
})

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'back1') {
        contBlocks2(chatId, query.message.chat.first_name)
    }
})
//клавиатура корпусов 3
function contBlocks3(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите необходимое`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Учебный корпус №10', callback_data: 'kor10' }],
                [{ text: 'Учебный корпус №11', callback_data: 'kor11' }],
                [{ text: '   Учебный корпус №12,13   ', callback_data: 'kor12' }],
                [{ text: 'Срортивный корпус №1', callback_data: 'sport1' }],
                [{ text: 'Срортивный корпус №2', callback_data: 'sport2' }],
                [{ text: '⏪ Назад', callback_data: 'back1' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'next2') {
        contBlocks3(chatId, query.message.chat.first_name)
    }
})
//клавиатура здравпунктов
function zdravkeyboard(chatId, first_name) {
    bot.sendMessage(chatId, `Выберите необходимое`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Здравпункт 1', callback_data: 'zd1' }],
                [{ text: 'Здравпункт 2', callback_data: 'zd2' }],
                [{ text: 'Здравпункт МТ', callback_data: 'zd3' }],
                [{ text: '⬅️На главную', callback_data: '12' }]
            ]
        }
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'zd') {
        zdravkeyboard(chatId, query.message.chat.first_name)
    }
})
//здравпункт 1
function zdravpunkt1(chatId, first_name) {
    Zdrav.findOne({ uuid: "zdrav1" }).then(zdrav => {
        bot.sendMessage(chatId, `${zdrav.name}\nАдрес: ${zdrav.adres}\nТелефон: ${zdrav.phone}\nE-mail: ${zdrav.email}`)
        bot.sendLocation(chatId, zdrav.locationA, zdrav.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'zd1') {
        zdravpunkt1(chatId, query.message.chat.first_name)
    }
})
//здравпункт 2
function zdravpunkt2(chatId, first_name) {
    Zdrav.findOne({ uuid: "zdrav2" }).then(zdrav => {
        bot.sendMessage(chatId, `${zdrav.name}\nАдрес: ${zdrav.adres}\nТелефон: ${zdrav.phone}\nE-mail: ${zdrav.email}`)
        bot.sendLocation(chatId, zdrav.locationA, zdrav.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'zd2') {
        zdravpunkt2(chatId, query.message.chat.first_name)
    }
})
//здравпункт 3
function zdravpunkt3(chatId, first_name) {
    Zdrav.findOne({ uuid: "zdrav3" }).then(zdrav => {
        bot.sendMessage(chatId, `${zdrav.name}\nАдрес: ${zdrav.adres}\nТелефон: ${zdrav.phone}`)
        bot.sendLocation(chatId, zdrav.locationA, zdrav.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'zd3') {
        zdravpunkt3(chatId, query.message.chat.first_name)
    }
})
//бухгалтерия
function buh(chatId, first_name) {
    Buh.findOne({ uuid: "buhgalteria" }).then(buh => {
        bot.sendMessage(chatId, `${buh.name}\nАдрес: ${buh.adres}\nТелефон: ${buh.phone}\nE-mail: ${buh.email}`)
        bot.sendLocation(chatId, buh.locationA, buh.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'buhg') {
        buh(chatId, query.message.chat.first_name)
    }
})
//корпус 1
function ucK1(chatId, first_name) {
    Korp.findOne({ uuid: "kor1" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor1') {
        ucK1(chatId, query.message.chat.first_name)
    }
})
//корпус 2
function ucK2(chatId, first_name) {
    Korp.findOne({ uuid: "kor2" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor2') {
        ucK2(chatId, query.message.chat.first_name)
    }
})
//корпус 3
function ucK3(chatId, first_name) {
    Korp.findOne({ uuid: "kor3" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor3') {
        ucK3(chatId, query.message.chat.first_name)
    }
})
//корпус 4
function ucK4(chatId, first_name) {
    Korp.findOne({ uuid: "kor4" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor4') {
        ucK4(chatId, query.message.chat.first_name)
    }
})
//корпус 5
function ucK5(chatId, first_name) {
    Korp.findOne({ uuid: "kor5" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor5') {
        ucK5(chatId, query.message.chat.first_name)
    }
})
//корпус 6
function ucK6(chatId, first_name) {
    Korp.findOne({ uuid: "kor6" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor6') {
        ucK6(chatId, query.message.chat.first_name)
    }
})
//корпус 7
function ucK7(chatId, first_name) {
    Korp.findOne({ uuid: "kor7" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor7') {
        ucK7(chatId, query.message.chat.first_name)
    }
})
//корпус 8
function ucK8(chatId, first_name) {
    Korp.findOne({ uuid: "kor8" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor8') {
        ucK8(chatId, query.message.chat.first_name)
    }
})
//корпус 9
function ucK9(chatId, first_name) {
    Korp.findOne({ uuid: "kor9" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor9') {
        ucK9(chatId, query.message.chat.first_name)
    }
})
//корпус 10
function ucK10(chatId, first_name) {
    Korp.findOne({ uuid: "kor10" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor10') {
        ucK10(chatId, query.message.chat.first_name)
    }
})
//корпус 11
function ucK11(chatId, first_name) {
    Korp.findOne({ uuid: "kor11" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor11') {
        ucK11(chatId, query.message.chat.first_name)
    }
})
//корпус 12
function ucK12(chatId, first_name) {
    Korp.findOne({ uuid: "kor12" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'kor12') {
        ucK12(chatId, query.message.chat.first_name)
    }
})
//спорт корпус 1
function ucSportK1(chatId, first_name) {
    Korp.findOne({ uuid: "sport1" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'sport1') {
        ucSportK1(chatId, query.message.chat.first_name)
    }
})
//спортивный корпус 2 
function ucSportK2(chatId, first_name) {
    Korp.findOne({ uuid: "sport2" }).then(korp => {
        bot.sendMessage(chatId, `${korp.name}\nАдрес: ${korp.adres}\nТелефон: ${korp.phone}\nE-mail: ${korp.email}`)
        bot.sendLocation(chatId, korp.locationA, korp.locationB, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: '⬅️На главную', callback_data: '12' }]
                    ]
            }
        })
    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'sport2') {
        ucSportK2(chatId, query.message.chat.first_name)
    }
})
//отзывы
function otziv(chatId, first_name) {
    console.log(`${first_name} решил оставить отзыв`)
    bot.sendMessage(chatId, `Вы можете оставить свои отзывы, комментарии и предложения по дальнейшему развитию бота, а также узнавать о новых обновлениях`, {
        reply_markup: {
            inline_keyboard:
                [
                    [{ text: '📣 Перейти на канал', url: 'https://t.me/joinchat/TR3KtxtVCZgp4ndo' }],
                    [{ text: '⬅️ На главную', callback_data: '12' }]
                ]
        }

    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'otz') {
        otziv(chatId, query.message.chat.first_name)
    }
})
//донаты
function donats(chatId, first_name) {
    console.log(`${first_name} решил задонатить`)
    bot.sendMessage(chatId, `Если ты хочешь внести свой вклад в развитие нашего бота, то нажми кнопку ниже ⬇️\nСпасибо😉`, {
        reply_markup: {
            inline_keyboard:
                [
                    [{ text: '💰Пожертвовать', url: 'https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=PoolBot&InvId=0&Culture=ru&Encoding=utf-8&OutSum=0,00&SignatureValue=737e61dd4f48dd3b093a66041446a2f8' }],
                    [{ text: '⬅️ На главную', callback_data: '12' }]
                ]
        }

    })
}
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === 'donat') {
        donats(chatId, query.message.chat.first_name)
    }
})


/* Клавиатура после нажатия кнопки "на главную" */
function naglavnuy(chatId, first_name) {
    console.log(`${first_name} перешел на главную`)
    bot.sendMessage(chatId, `Вы перешли на главную страницу!`, {


        reply_markup: {
            inline_keyboard: [
                [{ text: '📓 Расписание занятий', callback_data: '1', }],
                [{ text: '📞 Контакты', callback_data: 'contact' }],
                [{ text: '🏠 Общежития', callback_data: 'ob' }],
                [{ text: '🏫 Корпуса', callback_data: 'korp' }],
                [{ text: '💻 Одно окно', url: 'https://vogu35.ru/kontakty/odno-okno' }],
                [{ text: '📝 Отзывы', callback_data: 'otz', }],
                [{ text: '🍩 Донаты', callback_data: 'donat', }],
            ]
        }
    })
}

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id
    if (query.data === '12') {
        naglavnuy(chatId, query.message.chat.first_name)
    }
})


bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id, `Команды для работы с ботом:
/start - начало работы с ботом
/info - информация о боте
/web - официальный сайт ВоГУ`)
})

bot.onText(/\/info/, msg => {

    const markdown = `
           *Для чего я нужен? А для того, чтобы:*
1)Пользователь ${msg.from.first_name} получал доступ к удобному формату расписания;
2)Смог найти необходимую информацию в пару кликов
    `
    bot.sendMessage(msg.chat.id, markdown, {
        parse_mode: 'Markdown'
    })
})
bot.onText(/\/web/, msg => {
    bot.sendMessage(msg.chat.id, `Официальный сайт ВоГУ: https://vogu35.ru`)
})

//Поиск преподавателей
bot.on('message', (msg) => {
    const prepodNameWrite = msg.text
    var prepodName = prepodNameWrite.toUpperCase()
    prepodName = prepodName.split(' ')[0]
    Pre.find({ name_id: prepodName }).then(prepods => {
        const html = prepods.map((p, i) => {
            return `${p.name}\nE-mail: ${p.email}\n${p.kafed_id}`
        }).join('\n\n')
        bot.sendMessage(msg.chat.id, html, {
            reply_markup: {
                inline_keyboard:
                    [
                        [{ text: 'На главную', callback_data: '12' }]
                    ]
            }
        })
            .catch((err) => console.log(`Сообщение: "${msg.text}"`))
        //if ((msg.text == '/start') || (msg.text == '/info') || (msg.text == '/web') || (msg.text == '/help') || (msg.text == prepodName)) { console.log('Пользователь ввел команду') }
        //else { bot.sendMessage(msg.chat.id, 'Таких преподов нет') }


    })

})

