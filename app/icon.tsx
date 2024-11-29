import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#121212',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 512 512" fill="none">
          <g clipPath="url(#clip0_1_2)">
            <rect width="512" height="512" fill="#121212"/>
            <path d="M271 256H391M271 346H391M271 166H391M196 256H211M196 346H211M196 166H211" stroke="white" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M121 256H136M121 346H136M121 166H136" stroke="#FFD84A" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_1_2">
              <rect width="512" height="512" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
    { ...size }
  )
} 