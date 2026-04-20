/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/ads.txt',
        destination: 'https://srv.adstxtmanager.com/19390/thegamerscene.news',
        permanent: true,
      },
    ]
  },
}
export default nextConfig
