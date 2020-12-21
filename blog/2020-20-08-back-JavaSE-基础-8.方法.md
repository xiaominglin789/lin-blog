---
slug: back-template
title: JavaSE基础-方法
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [back, JavaSE]
---

## 类-方法
> ?java是值传递?
> 一个方法只做一个功能
> 修饰符:
	+ 1.public 对外公开的
	+ 2.protected 对子类公开
	+ 3.private 私有的,只能在本类内使用
	+ 4.static 静态的,类的静态方法
```java
修饰符 返回类型 方法名(参数列表) {
	return 返回值
}
```

<!--truncate-->


> 返回值：
- void: 没有返回值
- 类型类型: 返回某个类型
```java
/**
 * 加法
 * @param a 整数a
 * @param b 整数b
 * @return 返回a+b
 */
public static int add(int a, int b) {
    return  a + b;
}

/**
 * 方法-说话, 无返回值
 * @param some 要说的话
 */
public static void say(String some) {
    System.out.println(some);
}
```



##### 方法-抛出异常
- AOP-ExceptionHelper: 应用程序出口处异常统一拦截处理
- try...catch(e) 异常捕获
```
# 方法外抛出异常的形式 
public void readFile(String file) throws IOException {
	# 方法内抛出异常的形式
	throw new 异常类型("异常信息")
}
```



##### 方法的调用
- 两种方法形式:
	+ 静态方法-static
		- static 和类一起加载的
	+ 非静态方法
		- 类实例化才存在的
- 实参传入时,与形参类型一一对应。
- this
- 值传递 与 引用传递
![对象引用](https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1746342172,1128640562&fm=11&gp=0.jpg)
```java
public class Demo01 {
    /**
     * 值传递 与 引用传递
     * @param args
     */
    public static void main(String[] args) {
        // 值传递
        int a = 0;
        System.out.println(a); // 0, 值参数
        change(a);
        System.out.println(a); // 0
        System.out.println("===========================");

        // 引用传递
        Student student = new Student();
        System.out.println(student.name); // null
        change2(student); // 引用传递
        System.out.println(student.name); // "apem"
    }

    public static int change(int a) {
        a = 19;
        return a;
    }

    public static void change2(Student student) {
        student.name = "apem";
    }

}

/** 学生类 */
class Student {
    public String name;
}
```



> 方法重载：
- 重载: 在一个类中,有相同的函数名称,但形参不同的函数
- 方法的重载规则:
	+ 方法名称`必须相同`
	+ 参数列表`必须不同`(个数不同、类型不同、参数排列顺序不同)
	+ 方法的返回类型可以相同也可以不同
	+ 仅仅返回类型不同不足以成为方法的重载！

- 遇到重载方法,`JVM`会根据方法调用的参数去找对应的方法
- 方法的可变参数: 方法名(类型 ...形参名)
	- 可变参数, 放在必传参数之后。
	- 可变参数, 可传、可不传
```java
/**
 * 加法
 * @param a 整数a
 * @param b 整数b
 * @return 返回a+b
 */
public static int add(int a, int b) {
    return  a + b;
}

public static int add(int a, int b, int c) {
    return a + b + c;
}

public static int add(int a, int ...args) {
    int sum = 0;
    for (int i=0; i < args.length; i++) {
        sum +=args[i];
    }
    return a + sum;
}
```

##### 递归
- 方法自己调用自己, 算法思想,复杂问题化简成单一问题
```java
	/**
	 * 斐波那契-递归
	 * @param index 要输出的是第n项
	 * @return
	 */
	public static int fibonacci(int index) {
	    if (index < 1) {
	        throw new Error("index 参数必须为正整数");
	    }
	    if(index == 0) {
	        return 0;
	    }
	    if(index == 1 || index == 2) {
	        return 1;
	    }
	    return fibonacci(index - 1) + fibonacci(index - 2);
	}
```
- 重点-递归结构：
	- 递归头: 什么时候`不调用`自身方法, 如果没有头,将陷入死循环。
	- 递归体: 什么时候`需要调用`自身方法
```java
	/**
     * 阶乘-递归
     * @param number 传入阶乘基数
     * @return 返回阶乘结果
     */
    public static int factorial(int number) {
    	// 递归头-递归中止自身调用的条件
        if(number <= 1) {
            return 1;
        }
        // 递归体-递归调用自身
        return number * factorial(number - 1);
    }
```

