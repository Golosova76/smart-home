exports.handler = async (event) => {
  try {
    const base = process.env.API_BASE_URL;
    if (!base) {
      return { statusCode: 500, body: 'API_BASE_URL is not configured.' };
    }

    // снимаем префикс функции
    const afterFn = event.path.replace(/^\/.netlify\/functions\/proxy/, '');
    // ЕСЛИ на Render нет /api — раскомментируй следующую строку:
    // const upstreamPath = afterFn.replace(/^\/api(\/|$)/, '/');
    // Иначе оставь как есть:
    const upstreamPath = afterFn;

    const url = base + upstreamPath + (event.rawQuery ? `?${event.rawQuery}` : '');

    // Заголовки к Render: добавляем accept-encoding: identity
    const upstreamHeaders = filterHeaders(event.headers, [
      'accept',
      'accept-language',
      'content-type',
      'authorization',
      'x-requested-with',
    ]);
    upstreamHeaders['accept-encoding'] = 'identity';

    const init = {
      method: event.httpMethod,
      headers: upstreamHeaders,
      body: ['GET', 'HEAD'].includes(event.httpMethod) ? undefined : event.body,
    };

    const resp = await fetch(url, init);

    // Берём текст (JSON) — без base64
    const text = await resp.text();

    // Копируем заголовки, но чистим «сжатие»
    const headers = {};
    resp.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));

    delete headers['content-encoding'];
    delete headers['content-length'];
    delete headers['transfer-encoding'];
    delete headers['connection'];

    // контент-тайп обязательно
    if (!headers['content-type']) {
      headers['content-type'] = 'application/json; charset=utf-8';
    }

    // CORS для фронта
    if (!headers['access-control-allow-origin']) headers['access-control-allow-origin'] = '*';
    if (!headers['access-control-allow-headers']) headers['access-control-allow-headers'] = 'Content-Type, Authorization';

    return {
      statusCode: resp.status,
      headers,
      body: text,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Proxy failed', error: String(e?.message || e) }),
      headers: { 'content-type': 'application/json' },
    };
  }
};

function filterHeaders(src = {}, allow = []) {
  const out = {};
  for (const [k, v] of Object.entries(src)) {
    if (v && allow.includes(k.toLowerCase())) out[k] = v;
  }
  return out;
}

