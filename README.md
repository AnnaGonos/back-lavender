# Сайт для цветочного магазина

Работу выполнила: Гонос Анна M3307

https://m3307-gonos.onrender.com/

![ER-диаграмма](lavanda_db%20-%20public.png)


## Доменная область: Платформа для магазина цветов "Лаванда"

Представляет собой систему управления магазином, специализирующимся на продаже цветов и букетов. Она
включает функционал для работы с пользователями, заказами, отзывами, избранными товарами и корзиной. В центре системы
находится пользователь, который может выполнять различные действия в зависимости от своей роли (например, покупатель, 
администратор или флорист). Сайт разработан с целью увеличения количества покупателей и оборота цветов в целом. 


## Основные сущности:

### 1) User (пользователь):

- Основная сущность системы, представляющая клиента, администратора или флориста. Хранит персональные данные, информацию о бонусной программе, статусе и роли пользователя.
1. id - уникальный идентификатор пользователя.
3. firstName - имя пользователя, необязательно уникальное.
4. lastName - фамилия пользователя, необязательно уникальная.
5. middleName - отчество пользователя (опционально).
6. phone - номер телефона пользователя.
7. email - электронная почта пользователя.
8. password - хэшированный пароль пользователя.
9. bonusPoints - количество бонусных баллов пользователя.
10. bonusCardLevel - уровень бонусной карты пользователя.
11. totalOrders - общее количество заказов пользователя (используется для бонусной программы).
12. status - статус пользователя: ACTIVE, INACTIVE, BLOCKED.
13. type - роль пользователя: USER, ADMIN, FLORIST (Пользователь (покупатель), флорист, админ).
14. orders - список заказов пользователя.
15. reviews - список отзывов пользователя.
16. favorites - список избранных товаров пользователя.
17. cart - список товаров в корзине пользователя.


### 2) Product (Товар):

- Сущность, представляющая товар (букет, коробка для композиции и т.п.)
1. id - уникальный идентификатор товара.
2. name - название товара, необязательно уникальное.
3. category - категория, к которой принадлежит товар (ссылка на сущность Category).
4. composition - состав товара (опционально).
5. description - описание товара (опционально).
6. imageUrl - URL изображения товара (опционально).
7. imageDescription - описание изображения товара (опционально).
8. price - цена товара.
9. discount - новая скидочная цена товара (опционально).
10. quantityInStock - количество товара в магазине.
11. cartItems - список товаров, добавленных в корзину пользователя.
12. favorites - список товаров, добавленных в избранное пользователя.
13. createdAt - дата создания товара.

### 3) Category (Категория):

- Сущность, представляет собой категорию товара (например, "Монобукеты", "Свадебные букеты").
1. id - уникальный идентификатор категории.
2. name - название категории, необязательно уникальное.
3. description - описание категории (опционально).
4. products - список товаров, принадлежащих данной категории.

### 4) Review (Отзыв):
- Сущность, позволяющая пользователям оставлять отзывы о магазине
1. id - уникальный идентификатор отзыва.
2. user - пользователь, который оставил отзыв (ссылка на сущность User).
3. rating - оценка товара (число от 1 до 5).
4. description - текст отзыва (опционально).
5. createdAt - дата создания отзыва.
6. response - ответ на отзыв от администратора (опционально).
7. image - URL изображения, прикрепленного к отзыву (опционально).

### 5) Payment (Платежи):

- Сущность, отвечающая за обработку платежей
1. id - уникальный идентификатор платежа.
2. order - заказ, связанный с платежом (ссылка на сущность Order).
3. amount - сумма платежа.
4. method - метод оплаты: CASH, ONLINE.
5. status - статус платежа: PENDING, COMPLETED, FAILED, REFUNDED.
6. createdAt - дата создания платежа.
7. updatedAt - дата обновления платежа (опционально).

### 6) Order (Заказ):

- Сущность, представляющая собой заказ пользователя, включающий в себя информацию о товарах, доставке и платеже
1. id - уникальный идентификатор заказа.
2. user - пользователь, создавший заказ (ссылка на сущность User).
3. items - список товаров в заказе (ссылка на сущность OrderItem).
4. recipientName - имя получателя (опционально).
5. recipientPhone - телефон получателя (опционально).
6. totalAmount - общая сумма заказа.
7. bonusPointsUsed - количество использованных бонусных баллов.
8. deliveryInterval - интервал доставки (опционально).
9. deliveryAddress - адрес доставки (обязательно при выборе типа доставки COURIER).
10. status - статус заказа: CREATED, CONFIRMED, ASSEMBLED, DELIVERED, CANCELLED.
11. payments - список платежей по заказу (ссылка на сущность Payment).
12. paymentMethod - метод оплаты: CASH, CARD, ONLINE.
13. deliveryType - тип доставки: PICKUP, COURIER.
14. deliveryDate - дата доставки (опционально).
   
После оформления заказа, в группу работников магазина в телеграмме приходит уведомление с краткой информацией о выполненном заказе.


### 7) Order Item (Позиция заказа):

- Сущность, представляющая отдельный товар в заказе. Связана с сущностью "Заказ"
1. id - уникальный идентификатор товара в заказе.
2. order - заказ, к которому принадлежит товар (ссылка на сущность Order).
3. product - товар, добавленный в заказ (ссылка на сущность Product).
4. quantity - количество товара в заказе.
5. totalPrice - общая стоимость товара (вычисляется как price * quantity).

### 8) Корзина:

- Сущность, позволяющая добавлять товары в корзину:
1. id - уникальный идентификатор записи в корзине.
2. user - пользователь, который добавил товар в корзину (ссылка на сущность User).
3. product - товар, добавленный в корзину (ссылка на сущность Product).
4. quantity - количество товара в корзине (по умолчанию 1).
5. addedAt - дата добавления товара в корзину.

### 9) Favorite:

- Сущность, позволяющая пользователям добавлять товары в список избранного
1. id - уникальный идентификатор записи в избранном.
2. user - пользователь, который добавил товар в избранное (ссылка на сущность User).
3. product - товар, добавленный в избранное (ссылка на сущность Product).
4. addedAt - дата добавления товара в избранное.


## Основные требования системы:

В ходе анализа прикладного процесса был получен следующий список **функциональных требований**:
### 1. Модуль работы с товарами
- Возможность добавления новой карточки товара с указанием следующих полей:
   - Название;
   - Описание (опционально);
   - Цена;
   - Цена с учетом скидки (опционально, по дефолту 0);
   - Количество;
   - Изображение;
   - Описание к изображению (опционально);
- Редактирование карточек товара с возможностью изменить:
   - Название;
   - Описание (опционально);
   - Цена;
   - Цена со скидкой (опционально);
   - Количество;
   - Изображение;
   - Описание к изображению (опционально);
- Удаление карточек товаров;
- Загрузка и управление изображениями товаров;
- Отображение всех товаров по категориям;
- Фильтрация и поиск товаров по названию, цене, категории.
### 2. Модуль работы с категориями товаров
- Создание новых категорий
   - Название категории 
   - Описание (опционально)
- Редактирование существующих категорий
- Возможность изменения названия и описания
- Удаление категорий
- Просмотр списка категорий
- Вывод информации о категории по ID
- Фильтрация товаров по категории
- Используется при отображении товаров клиентам (покупателям)
### 3. Модуль заказов
**Для покупателя:**
- Оформление заказа на основе содержимого корзины с указанием следующих полей:
   - Имя получателя;
   - Телефон получателя;
   - Способ доставки (курьер / самовывоз)
   - Адрес доставки (если выбран способ «Курьер»);
   - Время доставки;
   - Способ оплаты (наличными при самовывозе или онлайн, если выбран способ «Курьер»);
   - Выбор использования бонусов: списать или копить;
- Получение подтверждения о создании заказа;
- Просмотр истории своих заказов;

**Для админа/флориста:**
- Просмотр всех заказов;
- Изменение статуса заказа (создан → собран → доставлен / отменён);
- Детальный просмотр состава заказа;
- Отслеживание метода оплаты и статуса платежей;
### 4. Модуль пользователей
- Регистрация пользователя с указанием:
   - Имя;
   - Фамилия;
   - Телефон;
   - Электронная почта;
   - Разделение ролей: admin, florist, user;
- Личный кабинет:
   - Просмотр персональных данных: имя, фамилия, телефон, email
   - Редактирование имени, фамилии, телефона, email
   - Просмотр истории заказов
   - Накопленные бонусные баллы
   - Уровень бонусной карты
### 5. Модуль отзывов
- Оставить отзыв о магазине с указанием следующих полей:
   - Оценка (от 1 до 5 включительно)
   - Текстовый комментарий
   - Изображение (опционально)
- Редактировать свои отзывы с корректировкой всех полей
- Просмотреть свои и чужие отзывы
### 6. Модуль корзины 
- Добавление товара в корзину;
- Удаление одного товара из корзины;
- Увеличение количества какого-то товара на 1;
- Уменьшение количества какого-то товара на 1;
- Очищение корзины полностью;
- Подсчёт количества товаров в корзине.
### 7. Модуль избранного
- Добавление товара в «избранное»;
- Удаление товара из «избранного»;
- Сохранение товара в избранном с пометкой и невозможностью добавить данный товар в корзину, после того как флорист или админ добавили данный товар в архив.

## Нефункциональные требования
### 1. Безопасность
- Обязательная аутентификация и авторизация для всех пользователей.
- Использование JWT-токенов для безопасной передачи данных между клиентом и сервером.
- Хранение токена в защищённых куках.
- Разграничение прав доступа по ролям: user, florist, admin.
### 2. Документация API
- Все программные интерфейсы должны быть задокументированы по спецификации OpenAPI v3.0 и выше с использованием библиотеки Swagger .
- Каждый эндпоинт должен содержать:
   - Описание метода
   - Примеры запросов и ответов
   - Перечень возможных ошибок
- Система должна обрабатывать запросы пользователя с минимальным временем ожидания.
### 3. Производительность
- Реализация кэширования часто запрашиваемых данных (список товаров для каталога).
### 4. Интеграция с внешними системами
- Интеграция с облачным хранилищем изображений через Yandex Object Storage.
- Отправка уведомлений флористам и администраторам через Telegram Bot API (@BotFather).
### 5.	Удобство использования
- Интерфейс должен быть удобным и понятным как для покупателей, так и для флористов.
- Поддержка мобильных устройств (адаптивный дизайн).



