/**
 * Proxy /api/* → painel Veltrix (evita CORS em produção no Cloudflare Pages).
 * Variável opcional no runtime: VELTRIX_API_ORIGIN
 */
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Extrai path da URL diretamente (mais confiável que params.path no CF Pages)
  const apiPath = url.pathname.replace(/^\/api\/?/, '');

  const origin = env.VELTRIX_API_ORIGIN || 'https://painel.reselltproject.shop';
  const targetUrl = new URL(`/api/${apiPath}`, origin);
  targetUrl.search = url.search;

  const headers = new Headers();
  for (const name of ['x-public-api-token', 'accept', 'content-type', 'authorization']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  /** @type {RequestInit} */
  const init = { method: request.method, headers };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl.toString(), init);

  const responseHeaders = new Headers();
  const contentType = response.headers.get('Content-Type');
  if (contentType) responseHeaders.set('Content-Type', contentType);
  responseHeaders.set('Cache-Control', 'no-store');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}
