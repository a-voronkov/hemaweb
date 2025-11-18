# 🚀 Docker Build Optimization Guide

## Проблема
Docker сборка занимает слишком много времени из-за:
- Переустановки node_modules при каждой сборке
- Отсутствия кэширования слоев
- SSH таймаутов при длительных операциях

## Решение

### 1. Multi-stage Build с Кэшированием Зависимостей

**Добавлен отдельный stage для зависимостей:**
```dockerfile
# Dependencies stage - cached separately
FROM node:20-alpine AS deps
# ... install dependencies ...
# This layer is cached if package.json doesn't change

# Build stage
FROM node:20-alpine AS builder
# Copy node_modules from deps (cached!)
COPY --from=deps /app/node_modules ./node_modules
```

**Преимущества:**
- ✅ node_modules кэшируются отдельно
- ✅ Переустановка только при изменении package.json
- ✅ Значительно быстрее повторные сборки

### 2. Docker Compose с Cache From

**Добавлено в docker-compose.yml:**
```yaml
services:
  web:
    build:
      cache_from:
        - hemaweb-web:latest
    image: hemaweb-web:latest
```

**Преимущества:**
- ✅ Использует предыдущие образы как кэш
- ✅ Ускоряет сборку на 50-80%

### 3. BuildKit

**Включен в скрипте сборки:**
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

**Преимущества:**
- ✅ Параллельная сборка слоев
- ✅ Улучшенное кэширование
- ✅ Быстрее на 30-50%

## Использование

### Локальная сборка:
```bash
# С кэшированием
./docker-build.sh

# Или вручную
export DOCKER_BUILDKIT=1
docker-compose build --parallel
```

### На сервере (через SSH):

**Вариант 1: Screen/Tmux (рекомендуется)**
```bash
ssh root@hemaweb.world
screen -S deploy
cd /srv/hemaweb
./docker-build.sh
# Ctrl+A, D для detach
```

**Вариант 2: Nohup**
```bash
ssh root@hemaweb.world "cd /srv/hemaweb && nohup ./docker-build.sh > build.log 2>&1 &"
```

**Вариант 3: Увеличить SSH timeout**
```bash
# В ~/.ssh/config
Host hemaweb.world
  ServerAliveInterval 60
  ServerAliveCountMax 10
  TCPKeepAlive yes
```

## Ожидаемые Результаты

### Первая сборка:
- API: ~2-3 минуты
- Web: ~3-4 минуты
- **Итого: ~5-7 минут**

### Повторная сборка (без изменений в зависимостях):
- API: ~30-60 секунд
- Web: ~1-2 минуты
- **Итого: ~2-3 минуты**

### Повторная сборка (с изменениями только в коде):
- API: ~1-2 минуты
- Web: ~2-3 минуты
- **Итого: ~3-5 минут**

## Что Кэшируется

### ✅ Кэшируется:
- node_modules (если package.json не изменился)
- Prisma Client (если schema.prisma не изменился)
- Промежуточные слои сборки
- Базовые образы

### ❌ Пересобирается:
- Исходный код приложения
- Конфигурационные файлы
- Зависимости (если изменился package.json)

## Очистка Кэша

Если нужно пересобрать с нуля:
```bash
# Удалить все образы
docker-compose down --rmi all

# Удалить build cache
docker builder prune -a

# Пересобрать
./docker-build.sh
```

## Мониторинг Сборки

Просмотр логов в реальном времени:
```bash
# Если используете screen
screen -r deploy

# Если используете nohup
tail -f build.log
```

## Troubleshooting

### Сборка все еще медленная?
1. Проверьте, что BuildKit включен: `docker buildx version`
2. Проверьте размер кэша: `docker system df`
3. Очистите старый кэш: `docker builder prune`

### SSH таймаут?
1. Используйте screen/tmux
2. Или увеличьте SSH timeout в config
3. Или запускайте через nohup

### Ошибки кэширования?
1. Пересоберите с нуля: `docker-compose build --no-cache`
2. Проверьте .dockerignore
3. Убедитесь, что package.json не изменился

## Дополнительные Оптимизации

### 1. Использовать Docker Registry
```bash
# Push образы в registry
docker tag hemaweb-web:latest registry.hemaweb.world/web:latest
docker push registry.hemaweb.world/web:latest

# Pull на сервере
docker pull registry.hemaweb.world/web:latest
```

### 2. Использовать GitHub Actions Cache
```yaml
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### 3. Prebuild Dependencies
```bash
# Собрать только dependencies stage
docker build --target deps -t hemaweb-deps .
```

