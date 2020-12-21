---
slug: back-template
title: JavaSE基础-变量、常量
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [back, JavaSE]
---

## 变量、常量
- 变量: 可变化的量。
java中最基础的存储单元,包括: 变量名, 变量类型 和 作用域
```java
int count = 0;
char chr = '爪';
```
> + 类变量：写在 类里面的
> + 实例变量：类中, 从属于对象
> + 局部变量：在方法内
<!--truncate-->
```java

public class MyClass {
	// 类变量
	int count = 0;
	// 实例变量

	public say() {
		// 局部变量
		int page = 10;
	}
}
```

- 常量: 
> - 使用 final 修饰符
> - 初始化后 不能再改变值, 不会变的值。
> - 常量名一般使用大写
```java
final 常量名= 值;
final double PI = 3.14;
```

+ 命名规范: 
> - 所有变量、方法、类名-需: 见名知意
> - 类变量: 首字母小写, 组合变量名: 驼峰法
> - 局部变量：首字母大写, 组合变量名: 驼峰法
> - 类名：首字母大写, 组合类名：驼峰法
> - 常量：大写字母, 驼峰法
> - 方法名：首字母大写, 组合方法名: 驼峰法

