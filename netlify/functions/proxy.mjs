// netlify/functions/proxy.js
// const UPSTREAM = process.env.UPSTREAM_URL; // your backend URL (must be public HTTPS)
const UPSTREAM = import.meta.env.VITE_BACKEND_API;
exports.handler = async function(event) {
  try {
    if (!UPSTREAM) {
      return { statusCode: 500, body: 'Missing UPSTREAM_URL env var' };
    }

    const pathAfter = event.path.replace('/.netlify/functions/proxy', '');
    const qs = event.rawQuery ? `?${event.rawQuery}` : '';
    const targetUrl = `${UPSTREAM}${pathAfter}${qs}`;

    const headers = { ...event.headers };
    delete headers.host;

    const resp = await fetch(targetUrl, {
      method: event.httpMethod,
      headers,
      body: ['GET', 'HEAD'].includes(event.httpMethod) ? undefined : event.body,
    });

    const outHeaders = {};
    resp.headers.forEach((v, k) => (outHeaders[k] = v));

    const body = await resp.arrayBuffer();
    return {
      statusCode: resp.status,
      headers: outHeaders,
      body: Buffer.from(body).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    return { statusCode: 502, body: `Proxy error: ${err.message}` };
  }
};