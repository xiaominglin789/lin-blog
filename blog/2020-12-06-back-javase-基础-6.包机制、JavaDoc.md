---
slug: JavaSE基础-6.包机制、JavaDoc
title: JavaSE基础-6.包机制、JavaDoc
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [back, java, javase, 基础]
---

## 包机制、JavaDoc
##### Java包机制：也就是文件夹
- 1.利用公司域名(倒置),加项目名
> - com.baidu.www
> - com.baidu.wenku
> - com.baidu.baike


<!--truncate-->


##### JavaDoc文档注释
- 类加注释
> - @author 作者
> - @version 版本 
> - @since 指明需要最早使用jdk版本
- 方法注释
> - @param 参数
> - @return 返回值
> - @throws 异常


##### 在项目根目录命令行可以对类注释、方法注释 命令行生成 文档
```bash
javadoc -encoding UTF-8 -charset UTF-8
```
