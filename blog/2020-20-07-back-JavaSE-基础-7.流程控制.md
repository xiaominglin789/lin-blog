---
slug: back-template
title: JavaSE基础-7.流程控制
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [back, java, JavaSE, 基础]
---

## 流程控制
+ 1.用户交互Scanner
	- 与程序交互,用户输入接收
	- `io`的操作, 用完必须 手动关闭!
+ 2.顺序结构
	- 代码执行顺序: 从上到下
+ 3.选择结构
	- if
	- if...else
	- if...else if...else
+ 4.循环结构
+ 5. break 和 continue


<!--truncate-->


##### 用户交互Scanner
```java
	Scanner scanner = new Scanner(System.in);
	if(scanner.hasNextLine()) { 
		// 用户有输入
		System.out.println(scaner.nextLine());
	}
	// 用完, 关闭
	scanner.close()
```



###### 选择结构(条件判断)
- if...else if...else
- switch...case
```java
	# if 条件判断
	# 条件: 某个范围区间、或某个具体值
	if(条件一) {
		// 满足条件一, 执行里面的代码
	} else if(条件二) {
		// 满足条件二, 执行里面的代码
	} else if(条件三) {
		// 满足条件三, 执行里面的代码
	} else {
		// 不满足上面的情况,则走这里的代码
	}

	# 当一个变量,有且只有 `有限个` 值时。请用: switch...case...break
	# 条件：某个具体值, 支持的类型: char, byte, short, int, String, enum
	# 一般 switch 结合 enum 枚举一起用！
	switch (条件) {
		case 条件一:
			// do some thing
			break;
		case 条件二:
			// do some thing
			break;
		default:
			// 不是上面的条件时,走这里。
			break;
	}

	# exp:
	enum Color {
	    RED,
	    GREEN,
	    BLUE,
	    ORANGE
	}
	Color myColor = Color.ORANGE; // 橙色
	switch (myColor) {
	    case BLUE:
	        System.out.println("蓝色");
	        break;
	    case ORANGE:
	        System.out.println("橙色");
	        break;
	    case RED:
	        System.out.println("红色");
	        break;
	    case GREEN:
	        System.out.println("绿色");
	        break;
	    default:
	        break;
	}
```



##### 循环结构(避免死循环)
	- while : 先判断,满足条件才执行。
	- do...while : 先执行一次, 再判断, 满足条件, 继续执行。
	- for : 循环指定次数
	```java
	# 实现计算 1-100 之和
	# while
	int index = 0;
	int sum = 0;
	while(index <=100) {
		sum += index;
		index++;
	}

	# do...while
	int index2 = 0;
	int sum2 = 0;
	do {
		sum2 += index2;
		index2++;	
	} while (index <=100)

	# for
	int sum3 = 0;
	for (int i=0; i<=100; i++) {
		sum3 += i;
	}

	# 99乘法表
	// for-99乘法表
	System.out.println("99乘法表");
	for (int i=1; i<= 9; i++) {
	    // 打印每行
	    // 打印每列
	    // j <= i 取出重复项
	    for (int j=1; j <= i; j++) {
	        System.out.print(i + " x " + j + " = " + (i*j) + "  ");
	    }
	    System.out.println();
	}
```



##### 增强 for循环
- 为了方便遍历数组、列表的
```
int[] nums = {1,30,14,5,22,43,9};
for(int x: nums) {
	System.out.println(x)
}
```



##### break 和 continue
- break 跳出循环,强制退出循环。
- continue 跳出本次循环,继续下一个循环。

