exports.handler = async (event) => {
  try {
    const base = process.env.API_BASE_URL;
    if (!base) {
      return { statusCode: 500, body: 'API_BASE_URL is not configured.' };
    }

    const path = event.path.replace(/^\/.netlify\/functions\/proxy/, '');
    const url = base + path + (event.rawQuery ? `?${event.rawQuery}` : '');

    const init = {
      method: event.httpMethod,
      headers: filterHeaders(event.headers, [
        'accept',
        'accept-language',
        'content-type',
        'authorization',
        'x-requested-with',
      ]),
      body: ['GET', 'HEAD'].includes(event.httpMethod) ? undefined : event.body,
    };

    const resp = await fetch(url, init);
    const buf = await resp.arrayBuffer();

    const headers = {};
    resp.headers.forEach((v, k) => (headers[k] = v));
    if (!headers['access-control-allow-origin']) headers['access-control-allow-origin'] = '*';
    if (!headers['access-control-allow-headers']) headers['access-control-allow-headers'] = 'Content-Type, Authorization';

    return {
      statusCode: resp.status,
      headers,
      body: Buffer.from(buf).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Proxy failed', error: String(e?.message || e) }),
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
