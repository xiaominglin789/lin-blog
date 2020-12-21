---
slug: back-template
title: JavaSE基础-9.数组
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [back, java, JavaSE, 基础]
---

## 数组
![数组的内存分配](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9jS2pGUEg1Nm5KcTZTU2JDTGppYmE5V3B6cmdJQmN6N2VMd08zSFRQTDRwOUU4OUNFaHd3ODZmUHZiMnluVG5WbG4wV2liVlllTHlPMDZTaWI3RzJrSGRmdy82NDA?x-oss-process=image/format,png)


<!--truncate-->


##### 数组的声明、初始化
- 一组类型相同的内存空间连续的数据
- 1.声明：声明变量。
	- int[] arr;
- 2.创建：指定空间地址.
	+ arr = new int[10]
	+ 创建时 int[]： 元素 默认值 0
	+ 创建时 String[]： 元素 默认值 null
- 3.元素赋值: 替换默认值
> 两种初始化
- 动态初始化 (包含默认初始化)
	- int[] arr = new int[10];
- 静态初始化 (创建+赋值)
    - int[] arr = {1,3,4,6,5};
```java
// 声明+创建
int[] nums = new int[3];
// 初始化赋值
nums[0] = 1;
nums[1] = 2;
nums[2] = 3;
```



##### 数组的四个基础特点
+ `长度`是确定的, 数组一旦被创建, 它的`大小`就是`不可以改变`的。
+ `元素`必须是`相同数据类型`,不允许出现混合类型。
+ 数组中的元素类型：包括`基本类型` 和 `引用类型`
+ 数组变量是`引用类型`, 数组也可以看成是对象, 数组种的每个元素相当于该对象的成员变量。
	- 数组本身就是对象, Java中对象存在堆中的。




##### 数组边界
+ 下标的合法区间: [0, Array.length - 1]
+ 下标越界异常: ArrayIndexOutofBounds




##### 数组的使用
+ for: 循环
+ 数组作为方法的参数
+ 数组作为方法的返回值
```java
	/**
     * 查看数组
     * @param array
     * @return
     */
    public static String arrayToString(int[] array) {
        String str = "";
        for (int child:array) {
            str += child + " ";
        }
        return str;
    }

    /**
     * 找出最大元素
     * @param array
     * @return
     */
    public static int arrayMax(int[] array) {
        int max = array[0];
        for (int child: array) {
            if(child > max) {
                max = child;
            }
        }
        return max;
    }

    /**
     * 找出最小值
     * @param array
     * @return
     */
    public static int arrayMin(int[] array) {
        int min = array[0];
        for (int child:array) {
            if(child < min) {
                min = child;
            }
        }
        return min;
    }

    /**
     * 翻转数组
     * @param array
     */
    public static void arrayReverse(int[] array) {
        for (int i = 0; i < array.length; i++) {
            if(i <= (int)array.length / 2) {
                array[i] = array[i] ^ array[array.length-1 - i];
                array[array.length-1 - i] = array[i] ^ array[array.length-1 - i];
                array[i] = array[i] ^ array[array.length-1 - i];
            }
        }
    }
```




##### 多维数组: 数组的嵌套(数组的数组)
- 二维数组
```java
int[][] arr = {{1,2},{3,4},{5,6}};

# 双重for循环可以遍历二位数组内的
元素
for (int i=0; i < arr.length; i++) {
	for (int j=0; j < arr[i].lenth; j++) {
		// 每个元素
		System.out.print(arr[i][j] + " ");
	}
}
```




##### Arrays 内置封装的常用API
- sout(): 排序
- fill(): fill, 类似js的replace()
- 手写冒泡排序
```java
	/**
     * 手写冒泡排序: O(n^2)
     * @param array
     */
    public static void bubbleSort(int[] array) {
        bubbleSort(array, false);
    }
    /**
     * 手写冒泡排序: O(n^2)
     * @param array
     * @param desc 默认:false 升序, true 倒序
     */
    public static void bubbleSort(int[] array, boolean desc) {
        if(array.length <= 1) {
            return;
        }
        for (int i=0; i < array.length - 1; i++) {
            for (int j=0; j < array.length - 1 - i; j++) {
                // !desc : 升序 : 降序
                boolean candition = !desc ? array[j] > array[j+1] : array[j] < array[j+1];
                if (candition) {
                    array[j] = array[j] ^ array[j + 1];
                    array[j + 1] = array[j] ^ array[j + 1];
                    array[j] = array[j] ^ array[j + 1];
                }
            }
        }
    }

    /**
     * 冒泡排序-优化一
     * @param array
     */
    public static void bubbleSortOptimize(int[] array) {
        bubbleSort(array, false);
    }
    /**
     * 冒泡排序-优化一
     * 没有交换
     * @param array
     * @param desc 默认: false 升序, true 降序。
     */
    public static void bubbleSortOptimize(int[] array, boolean desc) {
        for (int i=0; i < array.length - 1; i++) {
            boolean hasChange = false;
            for (int j=0; j < array.length-1 - i; j++) {
                boolean candition = !desc ? array[j] > array[j+1] : array[j] < array[j+1];
                if (candition) {
                    array[j] = array[j] ^ array [j+1];
                    array[j+1] = array[j] ^ array [j+1];
                    array[j] = array[j] ^ array [j+1];
                    hasChange = true;
                }
            }
            // 一趟下来没有交换位置了,直接跳出循环
            if (!hasChange) {
                break;
            }
        }
    }
```



##### 稀疏数组: 压缩二维数组
- 条件: 二维数组中很多值是默认值`0`
- 压缩: 让二维数组体积小
```java
int[][] dish = new int[11][11];
dish[1][2] = 1;
dish[2][3] = 2;

// 压缩-转换成稀疏数组
// 1.先遍历,获取有效值的个数
// 2.创建一个稀疏数组的数组
// 3.存放有效值: row->行-列-值
int sum = 0;
for (int i=0; i< dish.length; i++) {
	for (int j=0; j < dish[i].length; j++) {
		if (dish[i][j] != 0) {
			sum++;
		}
	}
}
int[][] sparse = new int[sum+1][3];
sparse[0][0] = 11;
sparse[0][1] = 11;
sparse[0][2] = sum;

int count = 0;
for (int i=0; i< dish.length; i++) {
	for (int j=0; j < dish[i].length; j++) {
		if (dish[i][j] != 0) {
			count++;
			dish[count][0] = i;
			dish[count][1] = j;
			dish[count][2] = dish[i][j];
		}
	}
}

// 得到 sparse:
11 11 2
1  2  1
2  3  2
```
- 稀疏数组还原
```java
// 根据上面d得到稀疏数组, 还原回原数组
// 1.直接可以知道原二位数组的初始化
int[][] original = new int[sparse[0][0]][sparse[0][1]];
// 2.读取稀疏数组的有效值,赋值给原数组对应位置、
for (int i=1; i < sparse.length; i++) {
	original[sparse[i][0]][sparse[i][1]] = sparse[i][2]
}
```

