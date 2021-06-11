---
slug: ubuntu-docker 
title: ubuntu-docker redis、mysql、postgresql 
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [other, template]
---

## docker
- 1.移除旧版依赖
- 2.安装docker的前置环境依赖
- 3.安装docker
- 6.docker基本操作
- 5.安装docker-compose
- 6.安装redis、mysql、postgresql





<!--truncate-->





### 1.移除旧版依赖
- 系统环境: `Linux lin 5.8.0-55-generic #62~20.04.1-Ubuntu SMP Wed Jun 2 08:55:04 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux`
```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```





### 2.安装docker的前置环境依赖
```bash
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```
- 增加docker的官方GPG密钥:
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```
- 设置 官方 仓库
```bash
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```





### 3.安装docker
```bash
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io
```
- 更换国内仓库源
```bash
# vim /etc/docker/daemon.json

{
  "registry-mirrors": [
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```






### 6.docker基本操作
- 查看镜像: sudo docker images
- 下载镜像: sudo docker pull 镜像名:版本
- 生成容器并运行: sudo docker run 镜像名
- 查看所有容器: sudo docker ps -a
- 查看运行的容器: sudo docker ps
- 停止运行的容器: sudo docker stop 容器id
- 进入容器后台内部: sudo docker exec -it bash 容器id
- 删除容器: sudo docker rm 容器id
- 删除镜像: sudo docker rmi 镜像名
- 容器绑到数据卷、端口映射、后台保护
	+ -v 本地数据目录:容器内部目录
	+ -p 本地端口:容器端口
	+ -d 后台保护






### 5.安装docker-compose
```bash
#下载运行文件
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

#配置权限
sudo chmod +x /usr/local/bin/docker-compose
```
- 新建镜像、创建容器并后台: docker-compose up -d docker-compose.yml
- 删除容器: docker-compose down 容器名
- docker-compose start 容器名
- docker-compose stop 容器名







### 6.安装redis、mysql、postgresql
- redis.yml
- mysql8.yml
版本:8 端口: 3306
```bash
version: "3"
services:
  postgres:
    image: mysql:8
    restart: always
    ports:
      - 3306:3306
    environment:
      - POSTGRES_PASSWORD=apem@159
```

- postgresql.yml
postgre端口: 5432, admin: localhost:7070
```bash
version: "3"
services:
  postgres:
    image: "bitnami/postgresql:latest"
    restart: always
    ports:
      - 5432:5432
    environment:
      - POSTGRES_PASSWORD=apem@159
    networks:
      - app-tier
  admin:
    image: "dpage/pgadmin4:latest"
    restart: always
    ports:
      - 7070:7070
    depends_on:
      - postgres
    environment:
      - PGADMIN_DEFAULT_EMAIL=159@qq.com
      - PGADMIN_DEFAULT_PASSWORD=apem159
    networks:
      - app-tier

networks:
  app-tier:
    driver: bridge
```