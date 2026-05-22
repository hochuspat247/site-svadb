const defaultGalleryImages = Array.from({ length: 18 }, (_, index) =>
  `photo-${String(index + 1).padStart(2, "0")}`,
);

export const defaultSiteSections = [
  {
    id: "hero",
    name: "Обложка",
    type: "hero",
    sortOrder: 1,
    isActive: true,
    settings: {
      badge: "Wedding weekend",
      title: "Иван и Анастасия",
      subtitle: "5-6 сентября 2026",
      description:
        "Мы будем счастливы провести этот день вместе с вами и собрать вокруг себя самых близких людей.",
      note: "Свадебное приглашение",
      primaryImage: "photo-10",
      secondaryImage: "photo-04",
      buttonLabel: "Посмотреть программу",
      buttonHref: "#schedule",
    },
  },
  {
    id: "welcome",
    name: "Приветствие",
    type: "text",
    sortOrder: 2,
    isActive: true,
    settings: {
      badge: "Дорогие друзья",
      title: "Приглашаем разделить с нами этот день",
      description:
        "С радостью и трепетом зовём вас на наш свадебный уикенд. Очень хотим, чтобы в этот день рядом были именно вы.",
      note: "Сохраняйте ссылку на сайт: тут будут все обновления по локации, программе и организационным вопросам.",
    },
  },
  {
    id: "location",
    name: "Локация",
    type: "location",
    sortOrder: 3,
    isActive: true,
    settings: {
      badge: "Где встречаемся",
      title: "Место проведения",
      description: "г. Краснодар. Точный адрес и логистика будут обновляться на сайте.",
      note: "Если едете из другого города, следите за этим блоком: здесь появятся координаты и рекомендации.",
      primaryImage: "photo-18",
      buttonLabel: "Открыть карту",
      buttonHref: "https://maps.google.com",
    },
  },
  {
    id: "schedule",
    name: "Программа дня",
    type: "schedule",
    sortOrder: 4,
    isActive: true,
    settings: {
      badge: "План дня",
      title: "Программа праздника",
      description: "Собрали ключевые точки дня, чтобы вам было легко ориентироваться.",
      items: [
        {
          title: "15:00",
          subtitle: "Сбор гостей",
          text: "Встречаемся, знакомимся, ловим первые кадры и настраиваемся на красивый вечер.",
        },
        {
          title: "16:00",
          subtitle: "Церемония",
          text: "Самый трогательный момент дня, когда мы скажем друг другу «да».",
        },
        {
          title: "17:30",
          subtitle: "Ужин и поздравления",
          text: "Тёплые слова, вкусная еда и много обнимашек.",
        },
        {
          title: "20:00",
          subtitle: "Танцы и вечеринка",
          text: "Любимые песни, сюрпризы и наш общий праздник до самого вечера.",
        },
      ],
    },
  },
  {
    id: "dress-code",
    name: "Дресс-код",
    type: "dress-code",
    sortOrder: 5,
    isActive: true,
    settings: {
      badge: "Стиль дня",
      title: "Дресс-код",
      description:
        "Будем рады видеть вас в мягкой, тёплой палитре. Если хочется ориентир, берите оттенки ниже.",
      primaryImage: "photo-01",
      secondaryImage: "photo-18",
      items: [
        { title: "Пудровый", extra: "#F4B6BE" },
        { title: "Коралл", extra: "#E85A4F" },
        { title: "Кремовый", extra: "#F4E1D2" },
        { title: "Бежевый", extra: "#D9A89A" },
        { title: "Шалфей", extra: "#8A8F7A" },
      ],
    },
  },
  {
    id: "story",
    name: "Наша история",
    type: "story",
    sortOrder: 6,
    isActive: true,
    settings: {
      badge: "Про нас",
      title: "Наша история",
      description: "Несколько важных точек на пути к нашему «да».",
      items: [
        {
          title: "Первая встреча",
          subtitle: "Начало",
          text: "С того самого разговора стало понятно, что это не случайная история.",
        },
        {
          title: "Путешествия",
          subtitle: "Много общих моментов",
          text: "Поездки, прогулки, планы и маленькие традиции, которые стали нашими.",
        },
        {
          title: "Предложение",
          subtitle: "Самое важное «да»",
          text: "Тот самый день, который мы захотели продолжить большим праздником вместе с близкими.",
        },
      ],
    },
  },
  {
    id: "host",
    name: "Тамада / ведущий",
    type: "person",
    sortOrder: 7,
    isActive: true,
    settings: {
      badge: "Новый блок",
      title: "Наш ведущий",
      subtitle: "Тамада, который держит настроение вечера",
      description:
        "Здесь можно рассказать о ведущем: пару строк о стиле работы, опыте, формате общения с гостями и почему именно он создаст нужную атмосферу.",
      primaryImage: "photo-11",
      buttonLabel: "Написать ведущему",
      buttonHref: "https://t.me/",
      items: [
        {
          title: "Имя Фамилия",
          subtitle: "Ведущий и церемониймейстер",
          text: "Лёгкий, живой, без кринжа и с чувством момента. Можно заменить на реальный текст в админке.",
        },
      ],
    },
  },
  {
    id: "gallery",
    name: "Галерея",
    type: "gallery",
    sortOrder: 8,
    isActive: true,
    settings: {
      badge: "Атмосфера",
      title: "Фотографии и настроение",
      description: "Можно менять фотографии местами, убирать лишние и собирать визуальную атмосферу прямо из админки.",
      galleryImages: defaultGalleryImages,
    },
  },
  {
    id: "gifts",
    name: "Подарки",
    type: "gifts",
    sortOrder: 9,
    isActive: true,
    settings: {
      badge: "Wishlist",
      title: "Подарки и идеи",
      description: "Если захотите порадовать нас чем-то практичным или запоминающимся, собрали идеи в удобный список.",
    },
  },
  {
    id: "rsvp",
    name: "Анкета гостя",
    type: "rsvp",
    sortOrder: 10,
    isActive: true,
    settings: {
      badge: "RSVP",
      title: "Подтвердите участие",
      description: "Пожалуйста, заполните форму, чтобы мы могли всё красиво организовать.",
      note: "Если хотите, можно добавить своё фото: оно появится в списке гостей на сайте.",
    },
  },
  {
    id: "guests",
    name: "Гости",
    type: "guests",
    sortOrder: 11,
    isActive: true,
    settings: {
      badge: "Наши люди",
      title: "Кто будет рядом",
      description: "Самые любимые и важные люди, с которыми мы разделим этот день.",
    },
  },
  {
    id: "music",
    name: "Музыкальные пожелания",
    type: "music",
    sortOrder: 12,
    isActive: true,
    settings: {
      badge: "Playlist",
      title: "Ваша песня",
      description: "Напишите трек, который точно должен прозвучать на нашей свадьбе.",
    },
  },
  {
    id: "faq",
    name: "Вопросы и ответы",
    type: "faq",
    sortOrder: 13,
    isActive: true,
    settings: {
      badge: "FAQ",
      title: "Вопросы и ответы",
      items: [
        {
          title: "Можно ли прийти с детьми?",
          text: "Да, конечно. Если для ребёнка нужна особая посадка или питание, просто напишите нам заранее.",
        },
        {
          title: "Можно ли привести +1?",
          text: "Да, но лучше заранее указать это в анкете, чтобы мы всё правильно рассчитали.",
        },
        {
          title: "Будет ли трансфер?",
          text: "Если он понадобится, добавим детали в блок с локацией и дополнительно предупредим гостей.",
        },
      ],
    },
  },
  {
    id: "closing",
    name: "Финальный экран",
    type: "closing",
    sortOrder: 14,
    isActive: true,
    settings: {
      badge: "Финал",
      title: "Будем ждать вас с нетерпением",
      description: "Спасибо, что открыли это приглашение и разделяете с нами ожидание этого дня.",
      primaryImage: "photo-17",
    },
  },
];
