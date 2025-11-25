# Настройка Mailjet для отправки email

## Шаг 1: Получение API ключей Mailjet

1. Зайдите на https://app.mailjet.com/account/apikeys
2. Скопируйте **API Key** и **Secret Key**

## Шаг 2: Настройка переменных окружения на сервере

Подключитесь к серверу и отредактируйте файл `.env`:

```bash
ssh root@hemaweb.world
cd /srv/hemaweb
nano .env
```

Добавьте следующие переменные:

```env
# Email - Mailjet API
MAILJET_API_KEY=ваш_api_key_здесь
MAILJET_SECRET_KEY=ваш_secret_key_здесь
EMAIL_FROM=noreply@hemaweb.world
EMAIL_FROM_NAME=HemaWeb
```

Сохраните файл (Ctrl+O, Enter, Ctrl+X).

## Шаг 3: Перезапуск контейнера API

```bash
docker compose restart api
```

## Шаг 4: Проверка логов

Проверьте, что Mailjet инициализирован:

```bash
docker compose logs api | grep -i mailjet
```

Вы должны увидеть:
```
LOG [EmailService] Using Mailjet for email delivery
```

## Шаг 5: Тестирование

Попробуйте восстановить пароль на сайте. В логах должно появиться:

```bash
docker compose logs -f api
```

Ожидаемый лог:
```
LOG [EmailService] Email sent via Mailjet to user@example.com
```

## Проверка статуса отправки

Вы можете проверить статус отправленных писем в панели Mailjet:
https://app.mailjet.com/stats

## Troubleshooting

### Если email не отправляется:

1. Проверьте, что API ключи правильные:
```bash
docker compose exec api printenv | grep MAILJET
```

2. Проверьте логи на ошибки:
```bash
docker compose logs api | grep -i error
```

3. Убедитесь, что домен `hemaweb.world` добавлен в Mailjet:
   - Зайдите в https://app.mailjet.com/account/sender
   - Добавьте и подтвердите домен

### Если используется SMTP вместо Mailjet:

Убедитесь, что переменные `MAILJET_API_KEY` и `MAILJET_SECRET_KEY` установлены.
Приоритет:
1. Mailjet API (если ключи установлены)
2. SMTP (если установлены EMAIL_HOST и другие SMTP переменные)
3. Ethereal Email (для разработки, если ничего не настроено)

