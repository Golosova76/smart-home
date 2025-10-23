//запросы от фронтенда на бэкенд (Render), скрывая реальный адрес API
//асинхронный хэндлер (обработчик HTTP-запросов)
//Netlify вызывает её каждый раз, когда приходит запрос по адресу .netlify/functions/proxy/
exports.handler = async (event) => {
  try {
    const rid = Math.random().toString(36).slice(2, 8); // короткий id запроса для логов!
    console.log(`[proxy][${rid}] ${event.httpMethod} ${event.path}`);

    //Читает из переменных окружения Netlify адрес основного API
    const base = process.env.API_BASE_URL;
    //Если переменная не задана, функция возвращает ошибку 500 и завершает работу
    if (!base) {
      return { statusCode: 500, body: "API_BASE_URL is not configured." };
    }

    // Убирает префикс /.netlify/functions/proxy из пути
    const afterFn = event.path.replace(/^\/.netlify\/functions\/proxy/, "");
    const upstreamPath = afterFn;

    //Собирает конечный URL, на который пойдёт реальный запрос.
    const url =
      base + upstreamPath + (event.rawQuery ? `?${event.rawQuery}` : "");
    console.log(`[proxy→][${rid}] ${url}`);

    //Фильтрует заголовки запроса, чтобы передать только безопасные и нужные
    // Заголовки к Render: добавляем accept-encoding: identity
    const upstreamHeaders = filterHeaders(event.headers, [
      "accept",
      "accept-language",
      "content-type",
      "authorization",
      "x-requested-with",
    ]);
    upstreamHeaders["accept-encoding"] = "identity";

    //Формирует объект для fetch()
    const init = {
      method: event.httpMethod,
      headers: upstreamHeaders,
      body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : event.body,
    };

    //Отправляет запрос к внешнему API (Render)
    const resp = await fetch(url, init);
    console.log(`[proxy←][${rid}] ${resp.status} ${url}`);

    // Берём текст (JSON)
    const text = await resp.text();

    // Копирует все заголовки из ответа бэкенда в объект headers
    const headers = {};
    resp.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));

    //Удаляет заголовки, которые нельзя напрямую пробрасывать — иначе Netlify может некорректно отправить ответ
    delete headers["content-encoding"];
    delete headers["content-length"];
    delete headers["transfer-encoding"];
    delete headers["connection"];

    // контент-тайп обязательно
    if (!headers["content-type"]) {
      headers["content-type"] = "application/json; charset=utf-8";
    }

    // Добавляет CORS-заголовки, чтобы фронтенд мог обращаться к API из браузера
    if (!headers["access-control-allow-origin"])
      headers["access-control-allow-origin"] = "*";
    if (!headers["access-control-allow-headers"])
      headers["access-control-allow-headers"] = "Content-Type, Authorization";

    //Возвращает тот же статус, тело и нужные заголовки.
    //Netlify просто “переупаковывает” ответ Render-сервера.
    return {
      statusCode: resp.status,
      headers,
      body: text,
    };
  } catch (e) {
    console.error(`[proxy!!] ${e?.message || e}`);
    //При любой ошибке возвращает 500 Proxy failed и пишет ошибку в логи
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Proxy failed",
        error: String(e?.message || e),
      }),
      headers: { "content-type": "application/json" },
    };
  }
};

//Утилита для фильтрации заголовков:
// перебирает все пары ключ–значение,
// оставляет только те, которые входят в список allow,
// игнорирует пустые (undefined, null).
function filterHeaders(src = {}, allow = []) {
  const out = {};
  for (const [k, v] of Object.entries(src)) {
    if (v && allow.includes(k.toLowerCase())) out[k] = v;
  }
  return out;
}
