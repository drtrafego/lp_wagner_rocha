import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || process.env.FB_PIXEL_ID || null
  const gtagId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_GA4_ID ||
    null
  return NextResponse.json(
    { pixelId, gtagId },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    },
  )
}
