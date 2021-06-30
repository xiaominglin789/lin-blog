---
slug: back-mysql
title: Mysql 一篇搞定
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [back, mysql]
---

## mysql 关系型数据库
- 数据库-表的本质是文件: xxx.frm、xxx.ibd
- 生产环境: 3306端口一般都会修改成其他端口
- 数据库三层结构
```bash
mysql:				          		|-- 表1
							  		|-- 表2
				    	|-- 数据库1----- 表3
		            	|-- 数据库2  |-- 表...
客户端 -> 3306 -> DBMS ----- 数据库3
				   | 	|-- 数据库4
		        mysqld 	|-- 数据库...

```






<!--truncate-->







## sql-4种语句分类的认识:
- DDL: 数据定义语句(create)
- DML: 数据操作语句(intert、update、delete)
- DQL: 数据查询语句(select)
- DCL: 数据控制语句(权限: grant、revoke)






## mysql 增删改查
### `数据库`的增删改查
1.新建数据库: 当创建数据库时设置 `character set` 和 `collate` 时, 在数据库内建数据表将默认采用`数据库创建时`设置的 `character set` 、`collate`的字符集和规则。`数据表`同样可以手动设置。
- `character set`: 设置字符集编码, 常用 `utf8`、`utf8mb4`
  + mysql - utf8: 支持最长三个字节
  + mysql - utf8mb4: 支持最长四个字节, 能存储表情字符,兼容型更高, mysql5.5.3+才支持`utf8mb4`。

- `collate`: 字符集的规则,主要用 `xxx_bin`、或 `xxx_ci`
  + `xxx_bin` => 以二进制值比较, 字符区分大小写
  + `xxx_ci` => 不区分大小写
  + xxx_unicode_ci 比较准确
  + xxx_general_ci 速度比较快
  + 注意: 应用有德语、法语或者俄语，请一定使用 `xxx_unicode_ci`
exp:
```sql
create database [数据库名] character set [字符集] collate [字符集的校对规则];
```

2.删除数据库: `drop database [数据库名];`

3.修改数据库编码集: `alter database [数据库名] charset='[新的编码]';`

4.选择使用某个数据库: `use [数据库名];`

5.备份数据
  + 备份数据库: `mysqldump -u [账号] -p -B [数据库1] [数据库2] [数据库...] > [路径/xxx.sql];`
  + 备份数据表: `mysqldump -u [账号] -p [数据库名] [表1] [表2] [表...] > [路径/xxx.sql];`
  + 注意1: 在mysql命令外, 执行 `mysqldump`
  + 注意2: 备份的路径要确保都有文件夹

6.备份恢复(数据库、表)
  + 在mysql命令内: `source [路径/xxx.sql];`

7.查看数据表的结构
	+ `desc [表名];`
	+ `show create table [表名];`


### 数据表的创建
1.创建数据表: `create table if not exists [表名](字段1 类型 约束, 字段1 类型 约束, ...);`
  + 可选参数: character set -> 设置字符集编码
  + 可选参数: collate -> 设置字符集排序校验规则
  + 可选参数: engine -> 设置存储引擎(innodb、myisam、blackhole)
```bash
engine=innodb
	提供外键约束的数据存储引擎
	提供事务处理
	支持commit、rollback等
	支持行锁
	增加并发读的用户数量
	CPU利用率高，处理大容量数据性能好
	缓冲池，能缓冲数据和索引
	把数据和索引放在表空间

engine=myisam
	表单独存放在文件中
	读取操作快
	不支持事务操作，不容错

engine=blackhole 黑洞引擎
	黑洞引擎，写入的任何数据都会消失，用于记录binlog做复制的中继存储！.
```
> 例子:
```sql
create table if not exists `person`(
	`id` int,
	`name` varchar(255),
	`password` varchar(127),
	`birthday` date
) engine innodb character set utf8mb4 collate utf8mb4_general_ci;
```


### mysql的常用数据类型
#### 数值类型
	+ 整形：
		- tinyint(1个字节), 范围: -128~127 , 无符号追加标识: `unsigned` 范围: 0~255。
		- smallint(2个字节)
		- mediumint(3个字节)
		- int(4个字节)
		- bigint(8个字节)
	+ 小数类型:
	  - float(4个字节,单精度)
	  - double(8个字节,双精度)
	  - decimal[M,D](大小不确定,取决与传入的`M`、`D`)
```bash
# decimal(M,D) 可自定义精度
#   M->小数位数(精度)的总数,最大:65位, 
#   D->小数点后面的位数,最大:30位。 
# exp: 
#   decimal(5,2) -> 最大为5位,其中有2位是小数; 
#   decimal(11)  -> 没有小数点, 整数
# M 默认 10, D 默认 0.

mysql> create table if not exists `t02`(n1 float, n2 double, n3 decimal(64,30));

Query OK, 0 rows affected (0.02 sec)

mysql> desc t02;
+-------+----------------+------+-----+---------+-------+
| Field | Type           | Null | Key | Default | Extra |
+-------+----------------+------+-----+---------+-------+
| n1    | float          | YES  |     | NULL    |       |
| n2    | double         | YES  |     | NULL    |       |
| n3    | decimal(64,30) | YES  |     | NULL    |       |
+-------+----------------+------+-----+---------+-------+
3 rows in set (0.01 sec)

mysql> insert into t02 values(314159263.1415926926926926926, 314159263.1415926926926926926, 314159263.1415926926926926926);
Query OK, 1 row affected (0.00 sec)

mysql> select * from t02;
+-----------+-------------------+------------------------------------------+
| n1        | n2                | n3                                       |
+-----------+-------------------+------------------------------------------+
| 314159000 | 314159263.1415927 | 314159263.141592692692692692600000000000 |
+-----------+-------------------+------------------------------------------+
1 row in set (0.00 sec)

# 可以明显分别出这3个类型的精度情况、小数一般使用`double`, 大额金钱,金融数据-高精度 使用 `decimal`
```


#### 字符串类型
	+ char(size), 固定size长度, 字符范围: 0~255
	+ varchar(size), 可变长度的字符串, 字节范围:0~65535, utf8编码下(一个字符最大占3个字节)有1-3个字节用于记录大小, 字符范围:0-21844 (65535-3 / 3)
	+ text, 字节范围: 0~2^16
	+ `mediumtext, 字节范围: 0~2^24`
	+ longtext, 字节范围: 0~2^32
> 细节(utf8编码下):
	+ 1.char(size) 定了size后, 无论存不存够,都将占用 `size*3` 个字节.
	+ 2.varchar(size) 范围: 0<=L<=size 个字符, 写入 L 个字节, 只会占用 `L*3` 个字符.
```bash
create table if not exists `t03`(`title` char(256));
ERROR 1074 (42000): Column length too big for column 'title' (max = 255); use BLOB or TEXT instead
# char 字符范围: 0-255

mysql> create table if not exists `t04`(`name` varchar(21845)) engine innodb character set utf8 collate utf8_general_ci;
ERROR 1118 (42000): Row size too large. The maximum row size for the used table type, not counting BLOBs, is 65535. This includes storage overhead, check the manual. You have to change some columns to TEXT or BLOBs
mysql> create table if not exists `t04`(`name` varchar(21844)) engine innodb character set utf8 collate utf8_general_ci;
Query OK, 0 rows affected, 2 warnings (0.02 sec)
# utf8 编码下 varchar 的字符范围: 0-21844, 65535-3 / 3 = 21844

create table if not exists `t05`(`name` varchar(21844)) engine innodb character set utf8mb4 collate utf8mb4_general_ci;
ERROR 1074 (42000): Column length too big for column 'name' (max = 16383); use BLOB or TEXT instead
# utf8mb4 编码下,一个字符最大占4个字节。所以 max = 16383 = 65535-3 / 4

# 特别说明(utf8编码下 1个字符 = 3个字节)
1.char(4)、varchar(4)  => 其他里面的 4 都表示 字符, 不是字节。不区分`字母`、`汉字`、混组合的。
2.char 表示 无论里面存多少内容都需要占 4 * 3 = 12个字节空间,会造成内存空间的浪费。
3.varchar 则会根据实际内容的大小: 0< L <= 4 ,占 L * 3 = 3L 个字节空间(L = 1-3个字节 + 内容数据大小), varchar本身还需要占用`1-3个字节`来记录内容长度的。
4.如果数据是定长的字符串, 推荐使用`char` 如:md5的密码、手机号、身份证号, 请用`char(size)`可以提高查询效率
5.

insert into t03 values('adc+1');
ERROR 1406 (22001): Data too long for column 'name' at row 1
```


#### 日期类型
 	+ date, 年月日, 3个字节
 	+ time, 时分秒, 3个字节
 	+ datetime, 年月日时分秒(YYYY-MM-DD HH:mm:ss), 8个字节
 	+ timestamp, 时间戳, 4个字节

























#### 二进制类型
	+ blod, 范围: 0~2^(16-1)
	+ longblod, 范围: 0~2^(32-1)


#### 位类型
	+ bit(m), 位类型, m:指定位数, 默认 1, 范围(1-64)
	+ 8位=1个字节
```bash
create table t01(num bit(8));

desc t01;
+-------+--------+------+-----+---------+-------+
| Field | Type   | Null | Key | Default | Extra |
+-------+--------+------+-----+---------+-------+
| num   | bit(8) | YES  |     | NULL    |       |
+-------+--------+------+-----+---------+-------+

insert into t01 values(1),(3);

select * from t01;
+------------+
| num        |
+------------+
| 0x01       |
| 0x03       |
+------------+
# 现象:
# 十六进制字面值进行bit操作。mysql默认是将十六进制当做二进制字符串，但是在数字上下文中是将其当做数字.
# 十六进制 => 二进制
# bit(8) -> 8bit = 1字节, 范围: 0~255

# 使用时, 遵循数字
select * from t01 where num=3;
+------------+
| num        |
+------------+
| 0x03       |
+------------+

mysql> insert into t01 values(255);
Query OK, 1 row affected (0.01 sec)
mysql> insert into t01 values(256);
ERROR 1406 (22001): Data too long for column 'num' at row 1
mysql> insert into t01 values(-1);
ERROR 1406 (22001): Data too long for column 'num' at row 1
mysql> select * from t01;
+------------+
| num        |
+------------+
| 0x01       |
| 0x03       |
| 0xFF       |
+------------+
3 rows in set (0.00 sec)
```
























### `数据表`的增删改查
> 表的常用操作
- 1.增: insert
- 2.删: delete
- 3.改: update
- 4.查: select


#### 增: insert into
```sql
intert into [表名] (字段1,字段2...) values (字段1的值,字段2的值...);
exp:
intert into `user` (`name`, `age`, `course`, `score`)
			values ('小明', 18, '语文', 98);
```


#### 查: select ([想查的字段1,想查的字段2...]) from [表名] where [查询条件]
```sql
select (`name`, `course`, `score`) from `user` where `name`='小明';
```


#### 改: update [表名] set 字段1=新值, 字段2=新值 where [条件限定]
```sql
update `user` set `age`=19,`score`=99 where `name`='小明' and `course`='语文';
```


#### 删记录: delete from [表名] where [限定条件]
```sql
delete from `user` where `name`='小明';
```


### 删表: `drop table [表名];`












## mysql 高级操作(多表)
- left join
- 组合
- 约束
- 索引
- 事物






## mysql 优化








## mysql 集群方案
