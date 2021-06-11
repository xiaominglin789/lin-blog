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






### 4.docker基本操作
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
- 新建镜像、创建容器并后台: docker-compose -f [yml配置文件] up -d 
- 移除所有容器以及网络相关: docker-compose down
- 运行容器: docker-compose start 容器名
- 暂停容器: docker-compose stop 容器名







### 6.安装redis、mysql、postgresql
- redis.yml 配置 本地redis
版本: 6 端口：6379
  + 1.`vim /opt/redis/conf/redis.conf` -> 配置密码 -> apem@159.com
  + 2.启动命令`command`添加登录密码: `--requirepass apem@159.com --appendonly yes`
```bash
version: "3"

services:
  redis:
    image: redis:latest
    container_name: redis
    restart: always
    ports:
      - 6379:6379
    volumes:
      - /opt/redis/data:/data
      - /opt/redis/conf/redis.conf:/etc/redis/redis.conf
    privileged: true
    environment:
      - TZ=Asia/Shanghai
      - LANG=en_US.UTF-8
    #覆盖容器启动的redis.conf
    command: redis-server --requirepass apem@159.com --appendonly yes
```

- mysql8.yml 配置
版本:8 端口: 3306
```bash
version: "3"
 
services:
  mysql8:
    # 镜像名
    image: mysql:8.0.25
    # 容器名(以后的控制都通过这个)
    container_name: mysql8
    # 重启策略
    restart: always
    environment:
      # 时区上海
      TZ: Asia/Shanghai
      # root 密码
      MYSQL_ROOT_PASSWORD: root
      # 初始化数据库(后续的初始化sql会在这个库执行)
      MYSQL_DATABASE: pay-demo
      # 初始化用户(不能是root 会报错, 后续需要给新用户赋予权限)
      MYSQL_USER: apem159
      # 用户密码
      MYSQL_PASSWORD: apem@159.com
      # 映射端口
    ports:
      - 3306:3306
    volumes:
      # 数据挂载
      - /opt/mysql8/data/:/var/lib/mysql/
      # 配置挂载
      - /opt/mysql8/conf/:/etc/mysql/conf.d/
      # 初始化目录挂载
      - /opt/mysql8/init/:/docker-entrypoint-initdb.d/
    command:
      # 将mysql8.0默认密码策略 修改为 原先 策略 (mysql8.0对其默认策略做了更改 会导致密码无法匹配)
      --default-authentication-plugin=mysql_native_password
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --explicit_defaults_for_timestamp=true
      --lower_case_table_names=1
```
生成新的账号密码并授权
```bash
# 查找mysql8容器id
sudo docker ps
sudo docker exec -it  [容器id]  /bin/bash
# 初始账号、密码: MYSQL_USER、MYSQL_PASSWORD
:/# mysql -u[账号-MYSQL_USER] -p
# 可生成新的账号密码，授权
```

- postgresql.yml 配置
postgre端口: 5432, admin: localhost:7070
```bash
version: "3"
services:
  postgres:
    image: "bitnami/postgresql:latest"
    container_name: "postgresql"
    restart: always
    ports:
      - 5432:5432
    volumes:
      - /opt/postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=apem@159
    networks:
      - app-tier
  pgadmin:
    image: "dpage/pgadmin4:latest"
    container_name: "pgadmin"
    restart: always
    ports:
      - 7070:80
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