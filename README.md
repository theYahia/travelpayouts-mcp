# travelpayouts-mcp

MCP-сервер для API Travelpayouts (Aviasales) — поиск авиабилетов, популярные маршруты, календарь цен.

## Возможности (3 инструмента)

| Инструмент | Описание |
|---|---|
| `search_flights` | Поиск цен на авиабилеты по датам |
| `get_popular_routes` | Популярные маршруты и спецпредложения |
| `get_prices_calendar` | Календарь цен по месяцам |

## Быстрый старт

```json
{
  "mcpServers": {
    "travelpayouts": {
      "command": "npx",
      "args": ["-y", "@theyahia/travelpayouts-mcp"],
      "env": {
        "TRAVELPAYOUTS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## Переменные окружения

| Переменная | Обязательная | Описание |
|---|---|---|
| `TRAVELPAYOUTS_TOKEN` | Да | API-токен Travelpayouts: https://www.travelpayouts.com/developers/api |

## Лицензия

MIT
