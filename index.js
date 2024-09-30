const axios = require("axios");
const fs = require("fs");
const express = require("express");
const app = express();
const logFile = "app.log";
// 获取访问者IP地址的函数（此处假设访问者通过HTTP请求到达服务器）
function getClientIP(req) {
  return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
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

function log(message) {
  const logEntry = `${new Date().toISOString()}: ${JSON.stringify(message)}\n`;
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) throw err;
    // 处理写入文件后的逻辑
  });
}

app.get("/", (req, res) => {
  const clientIP = getClientIP(req);
  getClientLocation(clientIP)
    .then((location) => {
      log(location);
      res.send("测试一下");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(80, () => {
  console.log("Server running on port 80");
});
