e.preventDefault();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000; 


app.use('/api/places',
    createProxyMiddleware({
        target: 'https://maps.googleapis.com',
        changeOrigin: true, // CORS 문제 해결
        pathRewrite: { '^/api/places': '/maps/api/place/nearbysearch/json' },
        onProxyReq: (proxyReq, req) => {
            
            const params = new URLSearchParams({
                location: req.query.location,
                radius: req.query.radius,
                type: req.query.type,
                opennow: req.query.opennow,
                keyword: req.query.keyword,
                key: 'AIzaSyAgM5OqN72VeDmuTb9hMGGf2HxdZDGkREs' // Google places API 키
            });
            proxyReq.path += `?${params.toString()}`;
        },
    })
);

// 서버 실행
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
