---
slug: front-javascript-core
title: 前端-javascript-基础
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [front, javascript]
---

## Javascript 基础篇 - 一切基于对象
> + 1.JavaScript（通常缩写为JS）是一种`高级`的、`解释型`的编程语言。
> + 2.JavaScript 是一门`基于原型`、`函数先行`的语言，是一门多范式的语言，它支持`面向对象`程序设计，`命令式编程`，以及`函数式编程`。
> + 3.它提供语法来操控 `文本`、`数组`、`日期`、`正则表达式`等，
> + 4.`不支持I/O`，比如`网络`、`存储`和`图形`等，这些都可以由它的`宿主环境`提供支持。
> + 5.它已经由ECMA（欧洲电脑制造商协会）通过ECMAScript实现语言的标准化。它被世界上的绝大多数网站所使用，也被世界主流浏览器`（Chrome、IE、Firefox、Safari、Opera）`支持。
> + 6.ECMAScript是JavaScript的规范，JavaScript是ECMAScript的实现



<!--truncate-->



## JS重要历史
> + 1. 1994-2021+ 5大主流浏览器
浏览器   	          内核
1.IE		          trident
2.chrome		      webkit blink
3.safari		      webkit
4.firefox		      gecko
5.opera		          presto
> + 2. 2009 Node.js
> + 3. 2013 ES6



## 变量的声明方式
> + 1. var - 用于声明`某作用域内`的`全局变量`(现在避免使用这种声明方式,除非原生兼容es5)
> + 2. let - 用于声明 `后续值会改变`的变量
> + 3. const - 用于`声明常量`, 必须在声明时完成初始化。
>>> const 声明初始化后的变量,保证 其在`栈中的值或、引用地址`不能再被修改。



## 基础数据类型(值类型)
值类型(值存在栈中)：Number、String、Boolean、Undefined、Null、Symbol
引用类型(栈中存变量的引用地址,堆中存变量的值)：Object、Array、Function
![值类型与引用类型的内存空间图](https://segmentfault.com/img/bVbuAiF?w=1000&h=379)



##### 1. Number 数值(包含整型、浮点型、NaN)
> 整型(Int)、浮点型(Float)
> NaN：not a number 它也是数字类型的,表示: 非有效的数值

###### Number-常用API：
+ 数值转字符串
	- num.toString()  		以字符串返回数值。 
		+ num.toString(2/8/16)  用做数值的十进制转2/8/16进制的字符串处理
	- num.toFixed(n)  		返回字符串值,根据四舍五入来保留小数,它包含n位数小数的数字,n默认:0。 
	- num.toPrecision(n)  	以字符串返回字符串值，长度为n的数字,n默认:整个数值字符。 
+ 把变量转换为数值：
	- Number(param)       可以用于任何数据类型转换成数值, 结果是: 数字 或 NaN
		+ param：为 值类型 时：参数会先自行调用`valueOf()`方法，再用`Number()`方法进行判断。
		+ param：为 引用类型 时：参数会先自行调用`valueOf()`方法，再对参数调用`toString()`方法，最后用`Number()`方法进行判断。
	- parseInt(str)     专门用于把字符串转换成整形数值.
		+ parseInt(str, 2/8/16)  专门用于 将2/8/16进制的 整形字符串 转回 十进制的整形
	- parseFloat(str)   专门用于把字符串转换成浮点数值. 
+ `NaN`: 非有效数值(not a number)
	- isNaN(param)  判断是否为：非有效数值
		+ 判断的原理：先尝试将参数转换为数值型，调用的是`Number(param)`方法，再进行判断。
	- isNaN(param)  的返回值
		+ 返回true: 
			- NaN
			- 对象（除包含单个数值的数组）
			- undefined
			- 不能用Number()方法转为数值型的字符串
		+ 返回false: 
			- 数值
			- null
			- 布尔值
			- 能用`Number()`方法转为数值型的字符串
			- 包含单个数值的数组,如：isNaN([7])、isNaN(['17'])、isNaN([])、isNaN([''])
```javascript
# Number()  Boolean -> Number
Number(true)           // => 1
Number(false)          // => 0
# Number()  Null -> Number
Number(null)           // => 0
# Number()  String -> Number
Number('12')		   // => 12
Number('string')       // => NaN
# Number()  Object -> Number
Number({})    		   // => NaN
Number(new Date())     // => 1607862282248
# Number()  Array -> Number
Number([])			   // => 0, 空数组 => 数字
Number(['221'])		   // => 211, 长度为1的数字、数字字符 => 数字
# Number()  Undefined -> Number
Number(undefined)      // => NaN, 无法转换数字的 则返回NaN

Number([5,'21'])       // => NaN
Number([{}, {}])       // => NaN

Number(new RegExp())   // => NaN
Number(NaN)            // => NaN

# 变量转换为数值 - parseInt()
parseInt('113')        // =》113
parseInt('1231aaaaa')  // =》1231,数字开头的字符,取出开头的数字
parseInt('')		   // => NaN
parseInt('os')		   // => NaN
parseInt(false)		   // => NaN

# 变量转换为数值 - parseFloat()
parseFloat('3.14') 		// => 3.14

# 特殊：NaN  =》 not a number 代表 非数字
# isNaN(): 存储的值->检测当前值是否为：非有效的数字。非有效的数字：true、 不是`非有效的数字`：false
## isNaN() 本质是: 先尝试将参数转换为数值型,调用的是Number()方法，再进行判断。
isNaN(99) 		 	// => false, 不是`非有效的数字`
isNaN(0000017)   	// => false, 8进制
isNaN(010101)    	// => false, 2进制
isNaN(0xF)       	// => false, 16进制
isNaN('11')      	// => false, 数字字符
isNaN(false)     	// => false, 布尔值 -> 0 或 1
isNaN(null)      	// = false, 相当于 0
isNaN([2])      	// => false, 数组中的特殊情况数组,一个元素,是数字
isNaN([''])     	// => false, 数组中的特殊情况数组,一个元素,是空字符串
isNaN(['2'])     	// => false, 数组中的特殊情况数组,一个元素,是字符数字
isNaN([2, '3'])     // => true, 数组
isNaN(undefined) 	// => true, 未定义 非数字
isNaN('number')  	// => true, 纯字符 非数字
```
+ 关于 Number 浮点数运算的`精度丢失`问题:
![位图](https://img-blog.csdnimg.cn/20190410151924220.jpg)
	- JavaScript 中的数字按照 IEEE 754 的标准，使用 64 位双精度浮点型来表示。其中符号位 S，指数位 E，尾数位M分别占了 1，11，52 位，并且在 ES5 规范 中指出了指数位E的取值范围是 [-1074, 971]。因为有些小数以二进制表示位数是`无穷的`。JavaScript会把`超出53位之后`的`二进制舍弃`。那就产生了`精度丢失`的问题。
	- 精度丢失-现象:
		+ 浮点数精度问题，比如 0.1 + 0.2 !== 0.3
		+ 大数精度问题，比如 9999 9999 9999 9999 == 1000 0000 0000 0000 1
		+ toFixed 四舍五入结果不准确，比如 1.335.toFixed(2) == 1.33
```javascript
# 显现: 0.1 + 0.2 !== 0.3
# 浮点数的计算步骤：十进制 转 二进制,浮点数用二进制表示是无穷的
0.1——>0.0001 1001 1001 1001 ...(1001循环)
0.2——>0.0011 0011 0011 0011 ...(0011循环)
# IEEE754标准的64位双精度浮点数的小数部分最多支持53位二进制，多余的二进制数字被截断.
0.0100110011001100110011001100110011001100110011001101
# 将截断之后的二进制数字再转换为十进制,得到
0.30000000000000004
```



##### 浮点数运算的`精度丢失`-解决的方案(兼容es5)
- 1.`指定精度`的`四舍五入`(依然可能有误差的), exp: parseFloat(result.toFixed(12))
- 2.转成String, 模拟实际运算的过程.
```javascript
# 除法精度-最好的解决的方案(String模拟运算)
function accDiv(arg1,arg2) {
      var t1 = 0,
      	t2 = 0,
      	r1,
      	r2;
      try{
      	t1 = arg1.toString().split(".")[1].length
      }catch(e){}
      try{
      	t2 = arg2.toString().split(".")[1].length
      }catch(e){}

      with(Math){
          r1 = Number(arg1.toString().replace(".",""))
          r2 = Number(arg2.toString().replace(".",""))
          return (r1/r2) * Math.pow(10,t2-t1);
      }
 }
# 乘法精度解决的方案
function accMul(arg1,arg2) {
      var m = 0,
      	s1 = arg1.toString(),
      	s2 = arg2.toString();
      try{
      	m += s1.split(".")[1].length
      }catch(e){}
      try{
      	m += s2.split(".")[1].length
      }catch(e){}
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
 }
# 加法精度解决的方案
function accAdd(arg1,arg2){
      var r1,r2,m;
      try{
      	r1 = arg1.toString().split(".")[1].length
      }catch(e){r1=0}
      try{
      	r2 = arg2.toString().split(".")[1].length
      }catch(e){
        r2=0
      }
      
      m = Math.pow(10,Math.max(r1, r2))
      
      return (arg1*m+arg2*m) / m
 }
# 减法精度解决的方案
 function accSub(arg1,arg2){      
     return accAdd(arg1, -arg2);  
 }
```



##### 2. String 字符串
`字符串`：一组 `char` 组成的拼接
常用API:
- 字符长度: String.length
- 字符串-根据字符返回所在的位置: String.indexOf(char, [startIndex])
	- char: 要查询的字符
	- startIndex: 可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 [0, String.length - 1]
	- 返回值为 `-1` 时
- 字符串-根据位置返回对应的字符：String.charAt(index) 、 String.charCodeAt(index) / String[index]
	+ - (1) String.charAt([index]) 当 index <=-1 或 index >= String.length 时,返回 "".
	+ - (2) String.charCodeAt([index]) 返回对应字符的ASCII值。当 index <=-1 或 index >= String.length 时,返回 NaN.
	- (3) String[index] H5新的api,兼容性：ie9+。当 index <=-1 或 index >= String.length 时,返回 undefined.
- 字符串拼接：String1 + String2 、 String1.concat(String2)
- 字符串截取-返回字符串位置a到位置b之间的字符：String.slice(start, [end])
	- 参数:
	- start：必需, 从何处开始选取. 默认 0。
		- start = 负数时, 那么它规定从数组尾部开始算起的位置
	- end: 可选, 规定从何处结束选取. `正数`: 从头开始算, `负数`: 从尾开始算.
	- epx: var str = 'abcdef';  str.slice(1,3) = 'bc'
- 字符串提取-类似字符串截取,返回字符串位置a到位置b之间的字符：String.substring(start, [stop])
	- start: 必需,非负的整数(默认 0),从何处开始选取
	- stop: 可选, 默认 String.length - 1, 规定从何处结束选取
	- epx: var str = 'abcdef';  str.substring(1,3) = 'bc'
- 字符串抽取从 start 下标开始的指定数目的字符: String.substr(start, length)
	- start: 必需,非负的整数(默认 0),从何处开始选取
	- length: 控制返回字符串的提取`长度`, 默认： String.length - 1
	- epx: var str = 'abcdef';  str.substr(1,3) = 'bcd'
- 字符串-替换字符：String.replace(regexp/substr, replacement)
	- regexp/substr：必需。字符串 或 正则对象。
	- replacement：必需。要换成的字符串。
- 分割字符串, 字符串 转 字符串转数组的方法：String.split('分隔符', [可选,限定长度])
	- exp1: var str = 'abc';  str.split('') = ['a', 'b', 'c']
	- exp2: var str = 'abc';  str.split('', 2) = ['a', 'b']
	- exp3: var str = 'a-b-c-d';  str.split('-') = ['a', 'b', 'c', 'd']
- 字符串全大写-返回全大写的：String.toUpperCase()
	
	- exp: var str = 'aBcdEF'; str.toUpperCase() = 'ABCDEF'
- 字符串全小写-返回全大写的：String.toLowerCase()
	
	- exp: var str = 'aBcdEF'; str.toLowerCase() = 'abcdef'
```javascript
# 字符串是值类型, 为何可以使用这么多API？
# 这里涉及到 `基本包类型的转化`：Boolean、Number 和 String
# 基本包装类型: 把简单数据类型 包装成复杂数据类型
var str = 'abcdef'
str.length // -> 6

# 包装过程:
# (1) string => String()对象
var temp = new String(str)
# (2) 把临时变量 给 str
str = temp
# (3) 销毁临时变量
temp = null
# (4) 此时 str 就是一个String对象,就可以使用String的API
```



##### 3. Boolean 布尔
布尔类型：true(-> 1)、false(-> 0)
```javascript
# 布尔的逻辑运算
----------------------------------------
逻辑\布尔|     true    |     false     |
----------------------------------------
   &&    | t && t = t  |  t && f = f   |
----------------------------------------
   ||    | f || t = t  |  f || f = f   |
----------------------------------------
   !     |   !f = t    |    !t = f	   |
----------------------------------------
```



##### 4. Undefined 未定义
undefined 属性用于存放 JavaScript 的 undefined 值。

> undefined的几种情况
>
> + 1、变量声明且没有赋值；
>
> + 2、获取对象中不存在的属性时；
>
> + 3、函数需要实参，但是调用时没有传值，形参是undefined；
>
> + 4、函数调用没有返回值或者return后没有数据，接收函数返回的变量是undefined。



##### 5. Null 空
+ 空. 作用: 用于未赋值的变量
+ typeof null = 'object', 更适合用于 `未赋值`的对象
```javascript
var obj = null;
// 赋值
obj = { name: 'jecke' }
```
+ 如何 同时判断 null、undefined、数字零、false？
```javascript
var exp = undefined;
var exp = null;
var exp = 0;
var exp = false;

if(exp === null){
	console.log('exp为以上的任意一种情况！')
}
```
+ 在 `DOM应用` 中, 一般使用 `!变量` 来判断是否为 `null`



##### 6. Symbol 唯一型
ES6 才引入的 `Symbol`
+ `Symbol`：本质上是一种`唯一标识符`，可用作对象的唯一属性名，这样其他人就`不能改写`或`覆盖`你设置的属性值。
+  `Symbol`：数据类型的特点是唯一性，即使是用同一个变量生成的值也不相等。
+  `Object.getOwnPropertySymbols` 方法会返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
```javascrpt
let id = Symbol('id');
let id2 = Symbol('id');
console.log(id == id2);  //false

let obj = {
	[id]: '123123123123',
	name: 'hello',
}
Object.getOwnPropertySymbols(obj) // 可以查看 对象下的Symbol属性数组. => [Symbol(id)]
```



## 复杂数据类型(引用类型)
> 复杂数据类型(引用类型,通过 new 关键字创建的对象、内置对象)
> 引用类型: 栈中存放地址引用,堆中存放数据
> + 自定义的普通对象
> + 内置对象
```javascript
let a1 = 0; // a1变量名、 a1 -> 值存在：栈内存
let a2 = 'this is string'; // a2 ->  值存在：栈内存
let a3 = null; // a3 -> 值存在：栈内存
let b = { x: 10 }; // b -> 其对象访问内存地址在：栈内存, [1, 2, 3] 作为对象 -> 存在于堆中
let c = [1, 2, 3]; // c -> 其对象访问内存地址在：栈内存, [1, 2, 3] 作为对象 -> 存在于堆中
```
![空间分配情况](https://segmentfault.com/img/bVbuAiF?w=1000&h=379)



## 普通对象 + 9种常用内置对象
+ Object(普通对象)、
+ Array(数组)、
+ Math(数学对象)、
+ Date(日期对象)、
+ Function(函数)、
+ Number(数字对象)、
+ String(字符串对象)、
+ Boolean(布尔值对象)、
+ RegExp(正则对象)、
+ Error(异常对象)



#####  Object(普通对象)
对象: hash结构, 键值对存储数据。
- 使用 for in 对象的每一项
- Object.keys() 对象的键的数组
- Object.values() 对象的值的数组
```javascript
# 定义一
const obj = {
	name: 'apem',
	age: 27
}

# 定义二
const obj5 = Object.assign({}, { name:'1236' })

# 定义三(不建议如此定义)
let obj = new Object() // 或 Object.create({}s)
obj.name = 'apem'
obj.age = 27

# 遍历对象
for(let key in obj) {
	const value = obj[key]
}
```



#####  Math(数学对象)
> + 1.Math.max() 函数返回一组数中的最大值。
> + 2.Math.min() 返回零个或更多个数值的最小值
> + 3.Math.abs(x) 函数返回指定数字 “x“ 的绝对值。
> + 4.Math.floor() 函数返回小于或等于一个给定数字的最大整数。
> + 5.Math.ceil() 函数返回大于或等于一个给定数字的最小整数。
> + 6.Math.round() 函数返回一个数字四舍五入后最接近的整数。
> 	- 特别注意: 负数 使用`Math.round()`, 涉及到 js 对 二进制进制转换精度丢失的问题
> 	- Math.round(-1.5000000000000001) = -1
> 	- Math.round(-1.500000000000001) = -2
> + 7.Math.random() 函数返回一个浮点, 伪随机数在范围从0到小于1，也就是说，从0（包括0）往上，但是不包括1（排除1），然后您可以缩放到所需的范围。实现将初始种子选择到随机数生成算法;它不能被用户选择或重置。



#####  Date(日期对象)
> 1.日期对象（是构造函数）创建时: var date = new Date()
> 2.new Date(可传参)
	>> 不传参数->获取当前时间: new Date()
	>> 参数 字符串时间: new Date('2020-01-31 23:01:59')
	>> 参数 数字：new Date(年,月,日,时,分,秒)

- 特别注意：数字参数 - 日期参数: 是从 `1` 开始算的
- 日期对象常用的API：
> - 时间->展示可理解的字符串：date.toString()
> - 时间->展示更加容易理解的字符串：date.toLocaleString()
> - 获取时间实例的 年：date.getFullYear()
> - 获取时间实例的 月(0-11)：date.getMonth()
> - 获取时间实例的 日(1-n)：date.getDate()
> - 获取时间实例的 时：date.getHours()
> - 获取时间实例的 分：date.getMinutes()
> - 获取时间实例的 秒：date.getSeconds()




#####  Array(函数对象)
数组: 线性数据结构,一组连续的内存空间的合集。
> + 1.创建数组：new Array() 或 数组字面量->创建数组 [element...]
> + 2.常用-判断是否为数组：Array.isArray(变量) 或 变量 instanceOf Array
> + 3.数组元素的增删改查: push(),unshift(),pop(),shift(),Array[index]
> + 4.数组排序: Array.reverse() / Array.sort()
> + 5.返回数组元素的索引号: Array.indexOf(元素)
> + 6.删除某个位置的元素(改变原数组)：Array.splice(index, 1) -- splice:裁剪
> + 7.数组转字符串：Array.toString() / Array.join('分隔符号')
> + 8.字符串转数组: String.split('连接符', 限定长度(默认全部字符)) -- split:拆分
> + 9.连接2个数组,返回新数组: Array1.concat(Array2)
> + 10.数组截取部分元素,返回新数组: Array.slice(begin,end)
```javascript
    // 1.数组字面量创建数组
	var arr = [1,2,3]

	// new Array() 创建空数组
	var arr1 = new Array()
	arr1.push(1)
	arr1.push(2)
	arr1.push(3)

	var arr2 = new Array(2) // -> 代表创建了长度为2的空数组

	var arr3 = new Array(1,2,3) // -> 等价于 var3 = [1,2,3],关键点：new的参数个数需要大于 1


	// 2.判断变量是否为数组
	// 		1.变量 instanceof Array
	var arr1 = '123asdsad'
    var arr2 = ['a', 'b', 'c']
    Array.isArray(arr1) // => falsae
    Array.isArray(arr2) // => true
    arr1 instanceof Array // => falsae
    arr2 instanceof Array // => falsae

	//		2.Array.isArray(变量) -- 注意浏览器兼容性：ie9+
	//  	返回 true -> 变量是数组类型, 返回 false -> 变量不是数组类型
	//      3.Object.prototype.toString.call(变量) === "[object Array]" 通过原型来判断是否为数组, 最原始的方式(判断变量类型的最有效方式)


	// 3.数组元素的增删改查
	//    - (1) push 在数组 尾部 添加 元素,返回改变后数组长度
	//    - (2) unshift 在数组 头部 添加元素,返回改变后数组长度
	//    - (3) pop 在数组 尾部 删除 一个元素,返回删除的元素
	//    - (4) shift 在数组 头部 删除 一个元素,返回删除的元素
	//    - (5) 访问/修改元素：Array[index]


	// 4.数组排序
	//    - (1) 翻转数组: Array.reverse()
	//    - (2) 数组排序：Array.sort(排序规则函数)
	//    - v8引擎下sort() 内部实现:
	//        - length <= 10, 用 InsertionSort(插入排序算法)
	//        - length > 10, 用 QuickSort(快速排序算法)
	//        - 源码: https://github.com/v8/v8/blob/ad82a40509c5b5b4680d4299c8f08d6c6d31af3c/src/js/array.js 710行开始
	//    - Mozilla/Firefox: 使用: 归并排序（jsarray.c 源码）
	//    - Webkit ：底层实现用了 C++ 库中的 qsort() 方法（JSArray.cpp 源码）


	// 5.返回数组元素的索引号: Array.indexOf(元素)
	//    - (1) 从 头部 开始查找,返回元素所在(第一个)的索引号: Array.indexOf(元素)
	//    - (2) 诉诸没有该元素,返回 -1
	//    - (3) 从 尾部 开始查找,返回元素所在(第一个)的索引号: Array.lastIndexOf(元素)
```

**关于更详细更底层的东西, 参考 进阶篇。**
