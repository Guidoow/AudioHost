import type { HttpResponse } from "src/types";

class requestService {
  private static instance: requestService;
  private backend: string;

  constructor(backend: string) {
    this.backend = backend;
  }

  // singleton
  static getInstance(backend: string): requestService {
    if (!requestService.instance) {
      requestService.instance = new requestService(backend);
    }
    return requestService.instance;
  }

  async get({
    url,
    headers = {},
    resMethod = "json",
  }: {
    url: string;
    headers?: Record<string, string>;
    resMethod?: "json" | "blob";
  }): Promise<HttpResponse> {
    const response = await fetch([this.backend, url].join("/"), {
      method: "GET",
      credentials: "include",
      headers,
    })
      .then(async (res) => {
        // include headers in response
        const headers = res.headers;
        const response = await res[resMethod]();
        response.headers = headers;

        return response;
      })
      .catch((error) => {
        console.log(
          "ERROR DETECTED FETCHING ",
          [this.backend, url].join("/"),
          error
        );
      });

    return response;
  }

  async custom({
    url,
    body,
    method = "POST",
    headers = {},
    credentials = "include",
    resMethod = "json",
    convertBody = true,
  }: {
    url: string;
    body: string | FormData;
    method?: "POST" | "DELETE";
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
    resMethod?: "json" | "blob";
    convertBody?: boolean;
  }): Promise<HttpResponse> {
    // normalize body

    if (typeof body === "object" && convertBody) body = JSON.stringify(body);

    const response = await fetch([this.backend, url].join("/"), {
      method,
      headers,
      credentials,
      body,
    })
      .then(async (res) => {
        const headers = res.headers; // include headers
        const response = await res[resMethod]();

        response.headers = headers;

        return response;
      })
      .catch((error) => {
        console.log(
          "ERROR DETECTED FETCHING ",
          [this.backend, url].join("/"),
          error
        );

        return null;
      });

    console.log(response);
    return response;
  }
}

export const RequestService = requestService.getInstance(
  `${window.location.origin}`
);
