---
slug: front-HTTP网络
title: 前端-HTTP网络基础
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [front, http]
---


## 经典面试题: 浏览器请求一个网页的流程
- 1.在浏览器输入域名 -> 通过DNS解析,获取相应的ip地址
	+ 浏览器DNS查找顺序:
	+ 浏览器DNS缓存→系统DNS缓存→路由器DNS缓存→ISP DNS 缓存→递归搜索
- 2. 浏览器向`ip服务器`发起连接, 建立`tcp`三次握手
-> 浏览器向服务器发送请求，请求数据包
-> 服务器收到请求，返回数据
-> 浏览器收到HTML响应，解析html源码, 生成DOM，解析css、js
-> 浏览器页面呈现
