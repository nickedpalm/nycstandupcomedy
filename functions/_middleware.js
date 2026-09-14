// Markdown for agents: a request for an HTML page that prefers text/markdown gets the
// Markdown edition generated at build time. Everything else passes through.
const PAGES = { '/': 'index.md', '/index.html': 'index.md', '/best': 'this-week.md', '/best.html': 'this-week.md', '/open-mics': 'open-mics.md', '/open-mics.html': 'open-mics.md', '/clubs': 'clubs.md', '/clubs.html': 'clubs.md', '/neighborhoods': 'neighborhoods.md', '/neighborhoods.html': 'neighborhoods.md' };
export async function onRequest({ request, next, env }) {
  const accept = request.headers.get('accept') || '';
  const url = new URL(request.url);
  const md = PAGES[url.pathname];
  if (md && request.method === 'GET' && /text\/markdown/i.test(accept) && !/text\/html.*text\/markdown|text\/markdown;q=0/i.test(accept)) {
    const asset = await env.ASSETS.fetch(new Request(new URL('/' + md, url.origin), { headers: { accept: 'text/markdown' } }));
    if (asset.ok) {
      const headers = new Headers(asset.headers);
      headers.set('content-type', 'text/markdown; charset=utf-8');
      headers.set('vary', 'Accept');
      headers.set('link', `<${url.origin}/${md}>; rel="alternate"; type="text/markdown", <${url.origin}/llms.txt>; rel="llms-txt"`);
      return new Response(asset.body, { status: 200, headers });
    }
  }
  const res = await next();
  if (md) { const h = new Headers(res.headers); h.set('vary', 'Accept'); h.set('link', `<${url.origin}/${md}>; rel="alternate"; type="text/markdown", <${url.origin}/llms.txt>; rel="llms-txt"`); return new Response(res.body, { status: res.status, headers: h }); }
  return res;
}
