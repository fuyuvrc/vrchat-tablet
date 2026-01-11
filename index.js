export default {
  async fetch(req, env) {
    const html = await fetch("https://example.com/tablet.html").then(r => r.text());
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }
}
