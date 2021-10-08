---
slug: java-core-base
title: javase-基础-1.开篇
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [back, java, javase, 基础]
---

##  java 优势
- 面向对象
- 高性能、分布式、多线程
- 安全性、健壮性
- 半解释半编译语言





## java中 JDK、JRE、JVM 关系
`JDK 包含了： JRE 和 JVM`
- JDK: Java Development Kit (javajava开发工具包)
- JRE: Java Runtime Environment (java运行时环境)
- JVM: Java Virtual Machine (虚拟机)





## jvm编译
```bash
.java    ->   .class  ->   jvm环境
   [ 编译 javac ]  [  运行 java ]
```





## oricle-jdk离线安装(linux/ubuntu)
[下载:jdk1.8.0_301](https://download.oracle.com/otn/java/jdk/8u301-b09/d3c52aa6bfa54d3ca74e617f18309292/jdk-8u301-linux-x64.tar.gz?AuthParam=1631092387_9acfffee42cde2205f4fe9e1f6262205)

+ 1.提取下载的压缩包,将文件夹移动到`/usr/share/jvm/`目录下
+ 2.配置系统用户环境变量,即可
```bash
> vim ~/.bashrc
# 添加 jdk 环境变量
export JAVA_HOME=/usr/share/jdk/jdk1.8.0_301
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH

# 查看java环境版本
> java -version
```
