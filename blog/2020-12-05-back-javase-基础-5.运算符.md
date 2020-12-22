---
slug: JavaSE基础-5.运算符
title: JavaSE基础-5.运算符
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [back, java, javase, 基础]
---

## 运算符
- 算术运算符：+ , - , * , / , % , ++ , --
- 赋值运算符：=
- 关系运算符：> , < , >= , <= , == , != , instanceof
- 逻辑运算符：&& , || , !
- 位运算符：& , | , ^ , ~ , >> , << , >>>
- 条件运算符：? : 
- 拓展运算符：+= , -= , *= , /= 


<!--truncate-->


##### 算术运算符
```java
	// 算术运算符
    int a = 10;
    int b = 20;
    int c = 29;
    int d = 111;
    // 二元运算
    System.out.println(a + b);          // 加
    System.out.println(b - c);          // 减
    System.out.println(c * d);          // 乘
    System.out.println((double)d / a);  // 除（之一小数）
    System.out.println(d % c);          // 加
    System.out.println("=======================================");
    // 一元运算
    // ++: 自增;  --: 自减
    // a++: 先赋值,后自增.
    // b--: 先赋值,后自减.
    // ++a: 先自增,后赋值.
    // --b: 先自减,后赋值.
    int w1 = 1;
    int w2 = 9;
    int w11 = w1++;
    int w21 = w2--;
    System.out.println(w11); // 1
    System.out.println(w1);  // 2
    System.out.println(w21); // 9
    System.out.println(w2);  // 8
    int w12 = ++w1 + w2;
    System.out.println(w12); // 11
    System.out.println(w1);  // 3
    System.out.println("=======================================");

    // 拓展一:
    // 数值运算结果:跟最高容量的类型一致, 最低是 Int 类型
    // Math.pow(2, 3) = 2*2*2 = 8; // 幂运算
    long a1 = 12343242541878L;
    int b1 = 123;
    short c1 = 10;
    byte d1 = 8;
    float f1 = 0.124F;

    System.out.println(a1 + b1 + c1 + d1 + f1);  // Long
    System.out.println(b1 + c1 + d1);           // Int
    System.out.println(c1 + d1);                // Int
    System.out.println(d1 + d1);                // Int
    System.out.println(c1 + d1 + f1);           // Float
```



##### 关系运算符: 结果 布尔值
```java
	//  关系运算符: 结果 布尔值
    int g1 = 10;
    int g2 = 20;

    System.out.println(g1 > g2);  // false
    System.out.println(g1 >= g2); // false
    System.out.println(g1 < g2);  // true
    System.out.println(g1 <= g2); // true
    System.out.println(g1 != g2); // true
    System.out.println(g1 == g2); // false
```



##### 逻辑运算符：&&(与) 、 ||(或) 、 !(非)
- 优先逻辑排在前面
```java
	// 逻辑运算符：&& 、 || 、 !
	boolean fg1 = true;
	boolean fg2= false;
	System.out.println(fg1 && fg2); // false
	System.out.println(fg1 || fg2); // true
	System.out.println(!fg1);       // false
	System.out.println(!fg2);       // true
	// 短路,后面条件不去判断了
    int cc = 5;
    boolean ccy = (c<4) && (c++ < 4);
    System.out.println(ccy);  // false
    System.out.println(cc);   // 5
```

##### 位运算符：
- & ：按位与, (二进制补码)同位同时为`1`,才为`1`.否则为`0`.
- | ：按位或, (二进制补码)同位只要有一个为`1`,就为`1`,没有则为`0`.
- ^ ：按位异或, (二进制补码)同位相同,则为`0`,否则为'1'.
- ~ ：按位取反, (二进制补码) `0`变成`1`, `1`变成`0`.
- << ：左移, 放大`2^n`倍。(二进制补码) 左移`n`位,符号位不变,
- \>> ：右移, 缩小`2^n`倍。(二进制补码) 右移`n`,位符号位不变。`高位`用补满`符号位`。
- \>>> ：无符号右移, 缩小`2^n`倍。不论正数还是负数，移位过程中高位均补零。
```java
	// 位运算
	// 2 原：  0b00000000000000000000000000000010
	// 2 补：  0b00000000000000000000000000000010
	// ~2=-3: 0b11111111111111111111111111111101
	// -2 原: 0b10000000000000000000000000000010
	// -2 反: 0b11111111111111111111111111111101
	// -2 补: 0b11111111111111111111111111111110
	// ~-2:  0b00000000000000000000000000000001
	int op = 2; // 2
	int sp = ~op; // 2 按位取反
	System.out.println(sp);
	System.out.println(0b11111111111111111111111111111101); // -3
	System.out.println("=====================================");

	int cp = -2;
	System.out.println(0b11111111111111111111111111111110); // -2
	int dp = ~cp; // -2 按位取反
	System.out.println(dp);
	System.out.println(0b00000000000000000000000000000001); //
	System.out.println("=====================================");

	// <<: 左移, 放大`2^n`倍。(二进制补码) 左移`n`位
	int e1 = 1;
	int e2 = e1 << 2;  // 1 * 2 * 2 = 4
	System.out.println(e2);
	// 1      补: 0b00000000000000000000000000000001
	// 1<<2 = 4 : 0b00000000000000000000000000000100
	int ee1 = -2;
	int ee2 = ee1 << 2;  // -2 * 2 * 2 = -8
	System.out.println(ee2);
	System.out.println(0b11111111111111111111111111111000);
	System.out.println("=====================================");
	// -2       补: 0b11111111111111111111111111111110
	// -2<<2 = -8 : 0b11111111111111111111111111111000

	// >>: 右移 缩小`2^n`倍。(二进制补码) 右移`n`位
	int pp = -11;
	int ppt = pp >> 2; // -11 / (2*2) = -3
	System.out.println(ppt);
	// -11    补： 0b11111111111111111111111111110101
	// -11>>2 右移补,高位`1` 补： 0b11111111111111111111111111111101
	System.out.println(0b11111111111111111111111111111101);
	System.out.println("=====================================");

	// >>>：无符号右移, 数据缩小。不论正数还是负数，移位过程中高位均补`零
    `。
	int u1 = -11;
	int u2 = u1 >>> 30; // 3
	System.out.println(u2);
	// -11    补： 0b11111111111111111111111111110101
	// -11>>>30 右移30,高位补'0'：
	//        补: 0b00000000000000000000000000000011
```



##### 异或运算符的巧用:交换2个变量的值
```java
int a = 11;
int b = 99;

a = a ^ b;
b = a ^ b;
a = a ^ b;

System.out.println(a); // 99
System.out.println(b); // 11
```



##### 偷懒运算符：+= 、-= 、 ? :
```java
    // += ：加等
    int bo = 9;
    bo += 1;
    System.out.println(bo); // 10
    // += ：加等
    int co = 102;
    co -= 2;
    System.out.println(co); // 100
    // ?：三目运算符
    boolean flt = true;
    int num = flt ? 0 : 1;
    System.out.println(num); // 0
```

