import { type NextRequest, NextResponse } from "next/server"

const TARGET_URL = "https://edd085ed-5c4d-4bb3-a673-f778f2d0cee8-00-2mn47nh9k7f1x.worf.replit.dev"

export async function GET(request: NextRequest) {
  return proxyRequest(request)
}

export async function POST(request: NextRequest) {
  return proxyRequest(request)
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request)
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request)
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request)
}

async function proxyRequest(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname === "/" ? "" : url.pathname;
    const targetUrl = `${TARGET_URL}${pathname}${url.search}`;

    const headers = new Headers();
    request.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!["host", "connection", "x-forwarded-for", "x-forwarded-proto", "x-forwarded-host"].includes(lowerKey)) {
        headers.set(key, value);
      }
    });

    // Forward the raw request body stream directly (for all methods except GET/HEAD)
    const body = (request.method === "GET" || request.method === "HEAD") ? undefined : request.body;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body, // <-- pass the raw stream here, NOT text
    });

    // Use response.body stream directly to pipe it back (don't do response.text())
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: filterResponseHeaders(response.headers),
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Proxy failed",
        message: error instanceof Error ? error.message : "Unknown error",
        target: TARGET_URL,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

function filterResponseHeaders(headers) {
  const newHeaders = new Headers();
  headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!["content-encoding", "transfer-encoding", "connection"].includes(lowerKey)) {
      newHeaders.set(key, value);
    }
  });
  return newHeaders;
}
