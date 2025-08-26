const worker = {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/hello") {
      return new Response("Hello from API!", {
        headers: { "content-type": "text/plain" },
      });
    }
    return fetch(request);
  },
};

export default worker;
