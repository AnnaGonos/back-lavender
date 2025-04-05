import { Controller, Get, Render } from '@nestjs/common';
import {ProductService} from "./product/product.service";

@Controller()
export class AppController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Render('index')
  async getBaseInfo() {
    const products = await this.productService.findLatestOnlineProducts();
    console.log('Products:', products);

    return {
      user: null,
      // user: { name: 'Гонос Анна' },
      metaKeywords: 'цветы, букеты, онлайн витрина, купить цветы',
      metaDescription:
        'Онлайн витрина цветов и букетов. Заберите ваш заказ прямо из магазина.',
      pageTitle: 'Заказать букет цветов с доставкой на дом в Партизанске',
      products,
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
          category: 'Все букеты',
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
          category: 'Моно и дуобукеты',
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

  // @Get('login')
  // @Render('login')
  // login() {
  //   return { user: { name: 'Гонос Анна' } };
  // }
  //
  // @Get('register')
  // @Render('register')
  // register() {
  //   return {};
  // }

  // @Get('profile')
  // @Render('profile')
  // profile() {
  //   return { user: { name: 'Гонос Анна' } };
  // }

  @Get('online-display')
  @Render('online-display')
  getOnlineShowcase() {
    return {
      metaKeywords: 'цветы, букеты, онлайн витрина, купить цветы',
      metaDescription:
        'Онлайн витрина цветов и букетов. Заберите ваш заказ прямо из магазина.',
      pageTitle: 'Онлайн витрина | Магазин цветов',
      products: [
        {
          image: 'images/flowers/14.23.41_fce727b1.jpg',
          name: 'Букет №122',
          price: '3200',
        },
        {
          image: 'images/flowers/11.31.00_f360ef16.jpg',
          name: 'Композиция №2',
          price: '3500',
        },
        {
          image: 'images/flowers/11.31.00_f360ef16.jpg',
          name: 'Букет №239',
          price: '3500',
        },
      ],
    };
  }

  @Get('blog')
  @Render('blog')
  getPost() {
    return {
      metaKeywords:
        'цветы, букеты, посты, блог, блог магазина цветов, купить цветы',
      metaDescription: 'Цветочный блог магазина Лаванда',
      pageTitle: 'Цветочный блог магазина Лаванда | Магазин цветов',
      blogPosts: [
        {
          link: 'blog-new-year.html',
          image: 'images/flowers/17.36.41_ead8dd0e.jpg',
          alt: 'Заставка для статьи в разделе блог 1',
          date: '01.01.2025',
          title:
            'Зимняя сказка в ваших домах: новогодние композиции от магазина цветов "Лаванда"',
        },
        {
          link: '#',
          image: 'images/flowers/14.23.42_37825df9.jpg',
          alt: 'Заставка для статьи в разделе блог 2',
          date: '22.12.2024',
          title: 'Цветы как подарок: что выбрать?',
        },
        {
          link: '#',
          image: 'images/flowers/14.23.15_599df81f.jpg',
          alt: 'Заставка для статьи в разделе блог 3',
          date: '21.12.2024',
          title: 'Наши любимые цветочные композиции',
        },
        {
          link: '#',
          image: 'images/flowers/14.33.51_048e7fe8.jpg',
          alt: 'Заставка для статьи в разделе блог 4',
          date: '01.10.2024',
          title: 'Что подарить любимому учителю?',
        },
        {
          link: '#',
          image: 'images/flowers/03.19.46_f3b4b6b7.jpg',
          alt: 'Заставка для статьи в разделе блог 5',
          date: '01.03.2023',
          title: 'Как выбрать подарок на 8 марта?',
        },
      ],
    };
  }

  @Get('review')
  @Render('review')
  getReview() {
    return {
      metaKeywords:
        'цветы, букеты, онлайн витрина, купить цветы, отзывы заказчиков',
      metaDescription: 'Отзывы заказчиков. Магазин цветов Лаванда.',
      pageTitle: 'Отзывы заказчиков',
      reviews: [
        {
          name: 'Екатерина',
          date: '21.10.2023',
          comment: 'Спасибо за прекрасный букет!',
          image: 'images/flowers/00.50.42_bb95d805.jpg',
        },
        {
          name: 'Лидия',
          date: '12.11.2024',
          comment: 'Спасибо за прекрасный букет!',
          image: 'images/flowers/09.06.55_4bffe7ff.jpg',
        },
        {
          name: 'Мария',
          date: '02.03.2024',
          comment: 'Спасибо за прекрасный букет!',
          image: 'images/flowers/14.33.52_ae79da06.jpg',
        },
      ],
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
