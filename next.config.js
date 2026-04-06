/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // GitHub Pages용 정적 빌드
  trailingSlash: true,     // /prayer → /prayer/ (GitHub Pages 호환)
  images: {
    unoptimized: true,     // 정적 export에서는 next/image 최적화 비활성화
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com', // Notion 이미지
      },
      {
        protocol: 'https',
        hostname: '**.notion.so',
      },
    ],
  },
}

module.exports = nextConfig
