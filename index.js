const axios = require('axios');
 
// 获取访问者IP地址的函数（此处假设访问者通过HTTP请求到达服务器）
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}
 
// 获取访问者位置的函数
async function getClientLocation(ip) {
  try {
    const response = await axios.get(`http://ipinfo.io/${ip}/json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching location for IP ${ip}:`, error);
    return null;
  }
}
 
// 示例：使用这些函数
const express = require('express');
const app = express();
 
app.get('/', (req, res) => {
  const clientIP = getClientIP(req);
  getClientLocation(clientIP).then(location => {
    console.log(location)
    res.send("测试一下");
  }).catch(error => {
    res.status(500).send(error);
  });
});
 
app.listen(80, () => {
  console.log('Server running on port 80');
});