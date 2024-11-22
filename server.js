const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = 3000;

// 프록시 설정
app.use(
  '/api/places',
  createProxyMiddleware({
    target: 'https://maps.googleapis.com', // Google API의 기본 URL
    changeOrigin: true, // CORS 해결
    pathRewrite: {
      '^/api/places': '/maps/api/place/nearbysearch/json', // 프록시 경로 재설정
    },
    onProxyReq: (proxyReq, req) => {
      // API 키와 요청 파라미터를 쿼리에 추가
      const params = new URLSearchParams({
        location: '37.5495647,126.839655',
        radius: '5000',
        keyword: '한식',
        type: 'restaurant',
        opennow: 'true',
        key: 'AIzaSyAgM5OqN72VeDmuTb9hMGGf2HxdZDGkREs', // Google Places API 키
      });

      proxyReq.path += `?${params.toString()}`;
    },
  })
);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
