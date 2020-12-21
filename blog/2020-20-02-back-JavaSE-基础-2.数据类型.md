---
slug: back-template
title: JavaSE基础-2.数据类型
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [back, java, JavaSE, 基础]
---

## Java 数据类型
+ 基本类型
+ 引用类型



##### 基本类型
4小类：整数、浮点数、字符、布尔
<!--truncate-->
```
8大`基本数据类型`：
分2大类: 数值类型、 布尔类型
 细分4小类：整数、浮点数、字符、布尔
  整数类型:
	byte: 占1个字节(1byte=8bit), 取值范围: -2^7 ~ (2^7)-1
	short: 占2个字节(16位), 取值范围: -2^15 ~ (2^15)-1
	int: 占4个字节(32位), 取值范围: -2^31 ~ (2^31)-1
	long: 占8个字节(64位), 取值范围: -2^63 ~ (2^63)-1, 要在数字后加"L"标识
	
浮点类型:
 	float: 占4个字节(32位), 要在数字后加"F"标识
 	doble: 占8个字节(64位)

字符类型:
 	char: 占2个字节

布尔类型:
	boolean: 占1bit(1位), 只有： true、 false
```

exp:
```java
// 整数
int num1 = 9;     // 最常用
byte num2 = 11;
short num3 = 50;
long num4 = 3214L; // Long类型要在数字后面加 "L"

// 小数
float num5 = 1.2F;
double num6 = 3.1415926;

// 布尔
char chr = 'A';
char ch = '中';

// 字符
boolean flag = false;
```
基础拓展：
```java
// 基本数据类型-整型-拓展
// 二进制      八进制     十六进制
// 0b001      0101      0x0115
int num1 = 0b001;
int num2 = 0101;
int num3 = 0x0F110A;
System.out.println(num1);
System.out.println(num2);
System.out.println(num3);

//===================================
// 浮点数-拓展     银行、金融机构-金钱的处理
// 浮点数-舍入误差的计算问题解决类：请使用 BigDecimal 工具类来做浮点数的计算
//===================================
float f = 0.1f;
double d = 1.0/10;
System.out.println(f == d); // false

float f1 = 213213213213213213f;
float f2 = f1 + 1;
System.out.println(f1 == f2); // true

//===================================
// 字符拓展
// 字符的本质: 还是数字
// 编码: Unicode表: (a = 97, 65 = A) 2个字节, 取值范围: 0~2^16, 字符范围: U0000-UFFFF
//===================================
char c1 = 'a';
char c2 = '中';
System.out.println(c1);
System.out.println((int)c1);
System.out.println(c2);
System.out.println((int)c2);
char c3 = '\u0061';
System.out.println(c3);

// 转义字符:
// \t、  制表符(tab)
// \t、  换行(回车)
System.out.println("Hello\tworld");
System.out.println("Hello\nworld");

// String
// new的实例对象 内存地址不同
String s1 = new String("我是字符串");
String s2 = new String("我是字符串");

String s3 = "我是字符串";
String s4 = "我是字符串";
System.out.println(s1 == s2); // false
System.out.println(s3 == s4); // true
```



##### 引用类型
有3种: 类、接口、数组
