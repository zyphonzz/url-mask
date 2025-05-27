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
    const url = new URL(request.url)
    const pathname = url.pathname === "/" ? "" : url.pathname
    const targetUrl = `${TARGET_URL}${pathname}${url.search}`

    console.log(`Proxying ${request.method} ${url.pathname} -> ${targetUrl}`)

    // Prepare headers, excluding problematic ones
    const headers = new Headers()
    request.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase()
      if (!["host", "connection", "x-forwarded-for", "x-forwarded-proto", "x-forwarded-host"].includes(lowerKey)) {
        headers.set(key, value)
      }
    })

    // Handle request body for non-GET requests
    let body: BodyInit | undefined = undefined
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = request.body
    }

    // Make the proxied request
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    })

    // Get response content
    const responseText = await response.text()

    // Create response with proper headers
    const proxyResponse = new NextResponse(responseText, {
      status: response.status,
      statusText: response.statusText,
    })

    // Copy safe response headers
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase()
      if (!["content-encoding", "transfer-encoding", "connection"].includes(lowerKey)) {
        proxyResponse.headers.set(key, value)
      }
    })

    return proxyResponse
  } catch (error) {
    console.error("Proxy error:", error)

    // Return a more detailed error response
    return new NextResponse(
      JSON.stringify({
        error: "Proxy failed",
        message: error instanceof Error ? error.message : "Unknown error",
        target: TARGET_URL,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
