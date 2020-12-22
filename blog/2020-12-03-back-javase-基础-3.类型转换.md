---
slug: JavaSE基础-3.类型转换
title: JavaSE基础-3.类型转换
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [back, java, javase, 基础]
---

## 类型转换
```java
# 字节
# 小数的优先级大于整数
# char的本质是数字,占2个字节
低 ----------------------------------> 高
byte,short,char->int->long->float->double
```
<!--truncate-->
1.运算,不同类型的数据先转成同一类型,然后再进行运算
2.类型转换:
+ 1.强制类型转换(高容量 转 低容量)
	- int num1 = 127;
	- byte num2 = (int) num1;  // 127
+ 2.自动类型转换(低容量 转 高容量), 不需要加`强转类型`
	- int i = 128;
	- double d = i;  // 128.0
+ 3.不能对布尔值进行转换(布尔值：占1位)
+ 4.内存溢出问题(强转时[高->转低], 要注意低单位的取值大小能否装得下)
	- int i = 128;
	- byte b = (int) num1;  // -128 ???
+ 5.浮点数精度问题
	- System.out.println((int) 27.9);    // 27 ???
    - System.out.println((int) -31.75f); // -31 ???
+ 6.包装类String
    - stri\.replace("待替换的字符串", "新字符串")
```java
// 强制类型转换
    // 内存溢出问题
    int i = 127;
    byte b = (byte) i;
    System.out.println(i);  // 128
    System.out.println(b);  // -128? 内存溢出了, byte的取值范围: -128 ~ 127

    // 自动类型转换
    double d = i;
    System.out.println(d);  // 128.0

    // 精度问题
    System.out.println((int) 27.9);    // 27
    System.out.println((int) -31.75f); // -31

    // char转换
    char c1 = 'a';
    int c2 = c1 + 1;
    System.out.println(c2);        // 98
    System.out.println((char) c2); // b

    // 操作比较大的数, 注意 内存溢出 问题
    int money = 10_0000_0000;     // 一年10亿
    int years = 20;               // 20年
    int total1 = money * years;    // 20年后 200亿
    System.out.println(total1);    // -1474836480 ???

    // 原因: int的容量最大: 2_14748_3647 20亿多
    // 解决上面的问题：在计算前先将变量转更大的类型
    long total2 = (long) money * years;
    System.out.println(total2);
```
