import { Controller, Get, Render, Req, UseFilters, UseInterceptors } from '@nestjs/common';
import {ProductService} from "./product/product.service";
import {ApiExcludeController} from "@nestjs/swagger";
import {AllExceptionsFilter} from "./all.exception.filter";

@Controller()
@UseFilters(AllExceptionsFilter)
@ApiExcludeController()
export class AppController {
  constructor(private readonly productService: ProductService) {}

  @Get(["/index", ""])
  @Render('index')
  async getBaseInfo(@Req() req) {
    return {
      user: req.user,
      // user: { name: 'Гонос Анна' },
      metaKeywords: 'цветы, букеты, онлайн витрина, купить цветы',
      metaDescription:
        'Онлайн витрина цветов и букетов. Заберите ваш заказ прямо из магазина.',
      pageTitle: 'Заказать букет цветов с доставкой на дом в Партизанске',
      slides: [
        {
          images: [
            'images/flowers/14.27.49_d377ab60.jpg',
            'images/flowers/14.33.29_142d646e.jpg',
          ],
          subtitle: 'К сердцу через цветы',
          title: 'Специальные предложения на 14 февраля',
          buttonText: 'Посмотреть',
          buttonLink: '#',
        },
        {
          images: [
            'images/flowers/17.36.41_ead8dd0e.jpg',
            'images/flowers/01.00.36_970d33b0.jpg',
          ],
          subtitle: 'Чудеса под ёлкой',
          title: 'Нарядные новогодние букеты',
          buttonText: 'Посмотреть',
          buttonLink: '#',
        },
        {
          images: [
            'images/flowers/bouquet-5.bmp',
            'images/flowers/bouquet-5.bmp',
            'images/flowers/bouquet-5.bmp',
          ],
          subtitle: 'Стильные букеты с простым дизайном',
          title: 'Монобукеты',
          buttonText: 'Посмотреть',
          buttonLink: '#',
        },
        {
          images: [
            'images/flowers/01.47.31_c1877ed5.jpg',
            'images/flowers/09.39.13_34334760.jpg',
          ],
          subtitle: 'Создайте неповторимый стиль вашего интерьера',
          title: 'Элегантные композиции на каждый день',
          buttonText: 'Посмотреть',
          buttonLink: '#',
        },
        {
          images: [
            'images/flowers/postcard-6.jpg',
            'images/flowers/postcard-8.jpg',
            'images/flowers/postcard-9.jpg',
          ],
          subtitle: 'Дополните ваш букет стильной открыткой',
          title: 'Открытки и карточки к букету',
          buttonText: 'Посмотреть',
          buttonLink: '#',
        },
      ],
      catalogItems: [
        {
          category: '',
          image: 'images/flowers/14.41.13_a908f0ff.jpg',
          alt: 'Раздел все букеты',
          name: 'Все букеты',
        },
        {
          category: 'Цветочные композиции',
          image: 'images/flowers/14.33.44_00edde28.jpg',
          alt: 'Раздел цветочные композиции',
          name: 'Цветочные композиции',
        },
        {
          category: 'Монобукеты',
          image: 'images/flowers/14.30.42_85b4cd55.jpg',
          alt: 'Раздел моно и дуобукеты',
          name: 'Моно и дуобукеты',
        },
        {
          category: 'Свадебные',
          image:
            'https://avatars.mds.yandex.net/get-altay/2390040/2a00000174635767858ab48bfd618357c63e/XXXL',
          alt: 'Раздел свадебные',
          name: 'Свадебные',
        },
        {
          category: 'Подарки и предметы для дома',
          image: 'images/flowers/aa76f11200fffd3e1cadd6b940a31f88.jpg',
          alt: 'Раздел подарки и предметы для дома',
          name: 'Подарки и предметы для дома',
        },
        {
          category: 'Комнатные цветы',
          image: 'images/flowers/bouquet-6.bmp',
          alt: 'Раздел комнатные цветы',
          name: 'Комнатные цветы',
        },
      ],
    };
  }

  @Get('florist')
  @Render('florist/florist')
  getFloristPage() {
    return {
      pageTitle: 'Аккаунт флориста'
    };
  }

  @Get('contacts')
  @Render('contacts')
  getContactPage() {
    return {
      metaKeywords:
          'цветы, букеты, онлайн витрина, купить цветы, отзывы заказчиков',
      metaDescription: 'Контакты и ссылки на социальные сети. Магазин цветов Лаванда.',
      pageTitle: 'Контакты',
    };
  }

  getHello() {
    return undefined;
  }
}
