import { NextRequest } from "next/server"

export function baseUrl(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") || "https"
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || ""
  return `${proto}://${host}`
}

export function allowedEmails(): string[] {
  return (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
}
