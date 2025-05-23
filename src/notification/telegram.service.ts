import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = '8058907320:AAG6zeLM7Kos_Rjx2c7I8Syf8ohWJT-6cOw';
const CHAT_ID = '-4641106214';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

export class TelegramService {
  static async sendOrderDetails(orderData) {
    try {
      const orderDetails = `
🔔 Новый заказ!

🙍‍♀️ Пользователь: ${orderData.nameUser} ${orderData.lastUser ? orderData.lastUser : ''} 
(${orderData.phoneUser})

💐 Информация о заказе
Тип доставки: ${orderData.deliveryType === 'courier' ? 'Курьерская доставка' : 'Самовывоз'}
Дата получения: ${orderData.deliveryDate}
Время получения: ${orderData.deliveryInterval}
Адрес: ${orderData.deliveryAddress || 'Не указан'}

Способ оплаты: ${orderData.paymentMethod === 'CASH' ? 'Наличными' : 'Онлайн'}
Общая сумма заказа: ${orderData.totalAmount} ₽

Зайдите на сайт, примите заказ 😊!
`;

      await bot.sendMessage(CHAT_ID, orderDetails);
      console.log('Сообщение успешно отправлено в Telegram');
    } catch (error) {
      console.error('Ошибка при отправке сообщения в Telegram:', error.message);
    }
  }
}
