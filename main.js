const TelegramBot = require("node-telegram-bot-api")

const token = "7697018618:AAEIm-uEvl-ZcBJVbnAos2B6gI_2C_rTU9E"
const options = {
    polling: true
}

const dipanbot = new TelegramBot(token, options)

const prefix = "/"

const sayHi = new RegExp(`^${prefix}halo$`)
const gempa = new RegExp(`^${prefix}gempa$`)

dipanbot.onText(sayHi, (callback) => {
    const username = callback.from.username
    const Txt = `Halo Juga @${username}! Senang Banget Bisa Ngobrol Sama Kamu.`
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Info Gempa',
                        callback_data: 'gempa'
                    },
                    {
                        text: 'Button 2',
                        callback_data: 'button2'
                    }
                ]
            ]
        }
    };
    dipanbot.sendMessage(callback.from.id, Txt, options)
})

dipanbot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message;

    if (callbackQuery.data === 'gempa') {
        const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/";

        try {
            const apiCall = await fetch(BMKG_ENDPOINT + "autogempa.json");
            const {
                Infogempa: {
                    gempa: {
                        Jam, Magnitude, Tanggal, Wilayah, Potensi, Kedalaman, Dirasakan, Shakemap
                    }
                }
            } = await apiCall.json();
            const BmkgImage = BMKG_ENDPOINT + Shakemap;
            const resultText = `
Waktu: ${Tanggal} | ${Jam}
Wilayah: ${Wilayah}
Magnitude: ${Magnitude}
Potensi: ${Potensi}
Kedalaman: ${Kedalaman}
Dirasakan: ${Dirasakan}
            `;

            await dipanbot.sendPhoto(message.chat.id, BmkgImage, {
                caption: resultText
            });
        } catch (error) {
            console.error('Error fetching BMKG data:', error);
            dipanbot.sendMessage(message.chat.id, 'Terjadi kesalahan saat mengambil data gempa.');
        }
    } else if (callbackQuery.data === 'button2') {
        dipanbot.sendMessage(message.chat.id, 'Anda menekan Button 2');
    }
});

dipanbot.onText(gempa, async (callback) => {
    const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/"


    const apiCall = await fetch(BMKG_ENDPOINT + "autogempa.json")
    const {
        Infogempa: {
            gempa: {
                Jam, Magnitude, Tanggal, Wilayah, Potensi, Kedalaman, Dirasakan, Shakemap
            }
        }
    } = await apiCall.json()
    const BmkgImage = BMKG_ENDPOINT + Shakemap
    const resultText = `
Waktu: ${Tanggal} | ${Jam}
Wilayah: ${Wilayah}
Magnitude: ${Magnitude}
Potensi: ${Potensi}
Kedalaman: ${Kedalaman}
Dirasakan: ${Dirasakan}
    `

    dipanbot.sendPhoto(callback.from.id, BmkgImage, {
        caption: resultText
    })
})