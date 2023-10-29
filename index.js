const TelegramApi = require('node-telegram-bot-api');

const token = '6446245547:AAFnDbN_IAk-xkusJDkmXlasvcWnsUr9Gkg'; // Замените на свой токен

const chats = {};
const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '1', callback_data: '1' }, { text: '2', callback_data: '2' }, { text: '3', callback_data: '3' }],
            [{ text: '4', callback_data: '4' }, { text: '5', callback_data: '5' }, { text: '6', callback_data: '6' }],
            [{ text: '7', callback_data: '7' }, { text: '8', callback_data: '8' }, { text: '9', callback_data: '9' }],
            [{ text: '0', callback_data: '0' }],
        ]
    })
};

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Играй ещё раз', callback_data: '/again' }],
        ]
    })
};

const bot = new TelegramApi(token, { polling: true });

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты её угадай!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай, СУКА!', gameOptions);
};

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'Получить информацию' },
        { command: '/game', description: 'Let`s play' },
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/again') {
            return startGame(chatId);
        }
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/29.webp');
            return bot.sendMessage(chatId, `Добро пожаловать. Играй и угадывай цифры, если знаешь что такое цифры. Для начала игры введи команду /game`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю. Пиши лучше, пожалуйста');
    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const randomNumber = chats[chatId]; // Получаем загаданное число
        if (data === randomNumber.toString()) {
            bot.sendMessage(chatId, `Поздравляю, умник хуев. Ты отгадал цифру ${randomNumber}`, againOptions);
        } else {
            bot.sendMessage(chatId, `К сожалению, ты не угадал, тупой хуй! Бот загадал ${randomNumber}`, againOptions);
            startGame(chatId); // Запуск игры заново
        }
    });

};

start();