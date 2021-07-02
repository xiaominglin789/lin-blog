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
- 数据库建表的操作
- 数据表的常用操作
- 数据记录的增删改查

- 计算机内存单位换算: 
`1MB = 1024KB = 1024 * 1024 B = (1024 * 1024) * 8 bit`
`1mb = 1024kb = 1048576 B = 1048576 * 8 bit`
	+ B: 字节
	+ bit: 位






<!--truncate-->






## 修改mysql的默认系统 支持中文和表情的显示:
注意: 在使用docker-mysql的时候,可以在进入容器命令时添加: `env LANG=C.UTF-8` 设置
容器内的系统字符编码显示格式。如果这样设置了,那么 mysql 的 `character_set_client`、`character_set_connection`、`character_set_results` 都会自动换成 `utf8mb4`。直接支持显示中文、支持输入中文。否则, 需要在 mysql命令行 手动临时设置 `character_set_results=utf8 或 utf8mb4` 来支持中文显示.
```
mysql> show variables like 'char%';
+--------------------------+--------------------------------+
| Variable_name            | Value                          |
+--------------------------+--------------------------------+
| character_set_client     | latin1                         |
| character_set_connection | latin1                         |
| character_set_database   | utf8mb4                        |
| character_set_filesystem | binary                         |
| character_set_results    | latin1                         |
| character_set_server     | utf8mb4                        |
| character_set_system     | utf8mb3                        |
| character_sets_dir       | /usr/share/mysql-8.0/charsets/ |
+--------------------------+--------------------------------+
8 rows in set (0.00 sec)


# mysql> set character_set_client=utf8mb3;
# mysql> set character_set_connection=utf8mb3;
mysql> set character_set_results=utf8mb4;

mysql> show variables like 'char%';
+--------------------------+--------------------------------+
| Variable_name            | Value                          |
+--------------------------+--------------------------------+
| character_set_client     | latin1                        |
| character_set_connection | latin1                        |
| character_set_database   | utf8mb4                        |
| character_set_filesystem | binary                         |
| character_set_results    | utf8mb4                        |
| character_set_server     | utf8mb4                        |
| character_set_system     | utf8mb3                        |
| character_sets_dir       | /usr/share/mysql-8.0/charsets/ |
+--------------------------+--------------------------------+
8 rows in set (0.00 sec)

```







## sql-4种语句分类的认识:
- DDL: 数据定义语句(create)
- DML: 数据操作语句(intert、update、delete)
- DQL: 数据查询语句(select)
- DCL: 数据控制语句(权限: grant、revoke)







## mysql 基本操作
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
		- tinyint(m), m只是是宽度, tinyint类型占1个字节, 范围: -128~127 , 无符号追加标识: `unsigned` 范围: 0~255。
		- smallint(m), 2个字节
		- mediumint(m), 3个字节
		- int, 4个字节
		- bigint, 8个字节
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
	+ varchar(size), size是限制的储存字符的个数, 存储可变长度的字符串, 字节范围:0~65535.
		- 65535个字节,其中要拿出`1-3个字节`用于记录大小, 字符范围:0-21844 (65535-3 / 3)。
		- 存放字符的长度:小于255为1个字节，大于255则要2个字节。
	+ text, 字节范围: 0~2^16
	+ `mediumtext, 字节范围: 0~2^24`
	+ longtext, 字节范围: 0~2^32

> 细节:
	+ `char`的列长度是 `固定的`
  	- char的长度可选范围在0-255之间.也就是char最大能存储 `255个字符`.
  	- 如果是`utf8mb4编码`,则 该列所占用的字节数 = 字符数*4.
  	- 如果是`utf8编码`,则 该列所占用的字节数 = 字符数*3.
  	- 如果是`gbk编码`, 则 该列所占用的字节数 = 字符数*2.
  + `varchar`的列长度是 `可变的`
  	- 在mysql5.0.3之前 `varchar` 的长度范围为: `0-255个字节`.
  	- mysql5.0.3之后 `varchar` 的长度范围为: `0-65535个字节`。但是 varchar(size) size 的单位是 `字符`, 所以 `size` 最大字符范围: 65535-1-2 / 字符集编码的最大字节(2|3|4) = 32766 | 21845 | 16383;
  		+ utf8 -> varchar(21844) 如果存入 `21844` 个纯英文,那么 该记录将占用 `21844` 个字节。
  		+ utf8 -> varchar(21844) 如果存入 `21844` 个中文,那么 该记录将占用 `65532` 个字节。
  	- 采用`varchar`类型存储数据需要 `1-2个字节` (长度超过255时需要2个字节)
  	来存储字符串的实际长度.
  		+ `-1` 原因是实际行存储从第二个字节开始’;

			+ `-2` 原因是varchar头部的2个字节表示长度;

  	- 如果该列的编码为`gbk`, 每个字符 `最多占用2个字节`, 最大字符长度为 32766.
  	- 如果该列的编码为`utf8`, 每个字符 `最多占3个字节`, 最大字符长度为 21844.
  	- 如果该列的编码为`utf8mb4`, 每个字符 `最多占4个字节`, 最大字符长度为 16383.

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
 		- 设置时间填充: `not null default current_timestamp`
 		- 设置时间填充,更新记录时也自动填充: `not null default current_timestamp on update current_timestamp`
```bash
create table if not exists t04(
	birthday date,
	job_time datetime,
	login_time timestamp not null default current_timestamp on update current_timestamp
) engine innodb character set utf8mb4 collate utf8mb4_general_ci;

mysql> insert into t04(birthday, job_time) values('2002-11-1', '2020-11-1 10:32:27');
Query OK, 1 row affected (0.01 sec)

mysql> select * from t04;
+------------+---------------------+---------------------+
| birthday   | job_time            | login_time          |
+------------+---------------------+---------------------+
| 2002-11-01 | 2020-11-01 10:32:27 | 2021-07-01 06:04:21 |
+------------+---------------------+---------------------+
1 row in set (0.01 sec)

```


#### 建表练习题： 
```bash
# 创建一个员工表: emp
# id, name, sex, birthday, entry_date, job, salary, resume
# 身份证、姓名、性别、生日、入职日期、工作、薪水、简历/简介/介绍
create table if not exists `emp`(
`id` int,
`state` tinyint(1) not null default 1 comment '-1 delete, 0 frozen, 1 normal',
`name` varchar(24),
`sex` char(1),
`birthday` date,
`entry_time` datetime,
`job` varchar(32),
`salary` double,
`resume` text,
`create_time` timestamp not null default current_timestamp,
`update_time` timestamp not null default current_timestamp on update current_timestamp
) engine innodb character set utf8mb4 collate utf8mb4_general_ci;

# 写入数据
insert into `emp`(`id`,`state`,`name`,`sex`,`birthday`,`entry_time`,`job`,`salary`,`resume`) values(1, 1, 'goblin', 'M', '1990-5-20', '2021-7-1 8:21:9', 'mountain patrol', 3600, 'mountain patrol run around...');

mysql> select `id`,`state`,`name`,`sex`,`job`,`salary`,`resume` from `emp`;
+------+-------+--------+------+-----------------+--------+-------------------------------+
| id   | state | name   | sex  | job             | salary | resume                        |
+------+-------+--------+------+-----------------+--------+-------------------------------+
|    1 |     1 | goblin | M    | mountain patrol |   3600 | mountain patrol run around... |
+------+-------+--------+------+-----------------+--------+-------------------------------+
1 row in set (0.00 sec)

```


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




### 数据表的修改/删除
- 修改表的列：alter table [表名] [操作命令] (...)
	+ 操作命令: add     => 添加列
		- alter table [表名] add 新列1 类型 xxx after `在已有某列的后面`
		- 多列添加: alter table [表名] add (新列1 xxx, 新列2 xxx, ...);
	+ 操作命令: modify  => 修改列
		- `alter table [表名] modify 列表 [修改信息];`
	+ 操作命令: drop    => 删除列
		- `alter table [表名] drop 列1, drop 列2, drop ...;`

- 修改表名: `rename table [表名] to [新表名]`

- 修改表的字符集: `alter table charater set [字符集]`

- 删表: `drop table [表名]`

> 操作练习:
```bash
mysql> create  table if not exists `person`(`id` int, `name` varchar(255), `password` varchar(127), `birthday` date);
Query OK, 0 rows affected (0.02 sec)

mysql> desc person;
+----------+--------------+------+-----+---------+-------+
| Field    | Type         | Null | Key | Default | Extra |
+----------+--------------+------+-----+---------+-------+
| id       | int          | YES  |     | NULL    |       |
| name     | varchar(255) | YES  |     | NULL    |       |
| password | varchar(127) | YES  |     | NULL    |       |
| birthday | date         | YES  |     | NULL    |       |
+----------+--------------+------+-----+---------+-------+
4 rows in set (0.01 sec)

mysql> alter table person add `state` tinyint(1) not null default 1 after `id`, add `age` smallint not null default 1 after `name`, add `create_time` timestamp not null default current_timestamp;
Query OK, 0 rows affected, 1 warning (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 1

mysql> desc person;
+-------------+--------------+------+-----+-------------------+-------------------+
| Field       | Type         | Null | Key | Default           | Extra             |
+-------------+--------------+------+-----+-------------------+-------------------+
| id          | int          | YES  |     | NULL              |                   |
| state       | tinyint(1)   | NO   |     | 1                 |                   |
| name        | varchar(255) | YES  |     | NULL              |                   |
| age         | smallint     | NO   |     | 1                 |                   |
| password    | varchar(127) | YES  |     | NULL              |                   |
| birthday    | date         | YES  |     | NULL              |                   |
| create_time | timestamp    | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+-------------+--------------+------+-----+-------------------+-------------------+
7 rows in set (0.00 sec)


mysql> alter table person modify `state` int not null default 1, modify `age` int not null default 1;
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> alter table `person` drop `state`, drop `age`;
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> rename table person to hunman;
Query OK, 0 rows affected (0.01 sec)

mysql> show tables;
+---------------+
| Tables_in_xyz |
+---------------+
| emp           |
| hunman        |
| student       |
| t01           |
| t02           |
| t03           |
| t04           |
+---------------+
7 rows in set (0.01 sec)

mysql> alter table hunman character set utf8mb4;
Query OK, 0 rows affected (0.01 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> drop table hunman;
Query OK, 0 rows affected (0.01 sec)

```




### `数据表记录`的基本增删改查
- 1.增: insert 
- 2.删: delete
- 3.改: update
- 4.查: select


#### 增: insert into
> intert into [表名](字段1,字段2...) values (字段1的值,字段2的值...);
细节:
- 1.插入的`数据` 应该与 字段的`类型`相同
- 2.数据的`长度` 应在列的`规定范围内`
- 3.values中列出的`数据位置` 必须与 `被加入的列的排列顺序相对应`
- 4.字符和日期类型数据 应包含在 `单引号中`
- 5.列 可以插入空值(前提: 该字段允许为空), `insert into table_name(xxx) values(value);`
- 6.insert into table_name(字段1,字符2,...) values(值1,值2,...),(值1,值2,...),...;     用这种形式添加多条记录
- 7.如果是给表中的所有字段添加数据,可以省略不写全面的字段名称
- 8.默认值的使用,当不给某个字段值时,如果有默认值就会添加默认值,否则报错。

```bash
mysql> create table if not exists `good`(`id` int, `good_name` varchar(10), `price` double);
Query OK, 0 rows affected (0.02 sec)

insert into `goods`(`id`, `good_name`, `price`) values(1,'phone', 2999.99),(2, 'pad', 1999.00);
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

select * from goods;
+------+-----------+---------+
| id   | good_name | price   |
+------+-----------+---------+
|    1 | phone     | 2999.99 |
|    2 | pad       |    1999 |
+------+-----------+---------+
2 rows in set (0.00 sec)
```


#### 改: update [表名] set 字段1=新值, 字段2=新值 where [条件限定]
>注意点:
- 1.如果没有带 `where` 条件, 将会修改所有的记录,因此要小心使用。
```sql
mysql> select * from goods;
+------+-----------+---------+
| id   | good_name | price   |
+------+-----------+---------+
|    1 | phone     | 2999.99 |
|    2 | pad       |    1999 |
+------+-----------+---------+
2 rows in set (0.00 sec)

mysql> update `goods` set price=2699.99 where id=1;
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from goods;
+------+-----------+---------+
| id   | good_name | price   |
+------+-----------+---------+
|    1 | phone     | 2699.99 |
|    2 | pad       |    1999 |
+------+-----------+---------+
2 rows in set (0.00 sec)

# 原来的基础上 加 133.99
mysql> select * from goods;
+------+-----------+---------+
| id   | good_name | price   |
+------+-----------+---------+
|    1 | phone     | 2699.99 |
|    2 | pad       | 2132.99 |
+------+-----------+---------+
2 rows in set (0.00 sec)

mysql> update `goods` set price = price + 133.99, good_name = 'ipd pro' where id=2;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from goods;
+------+-----------+--------------------+
| id   | good_name | price              |
+------+-----------+--------------------+
|    1 | phone     |            2699.99 |
|    2 | ipd pro   | 2266.9799999999996 |
+------+-----------+--------------------+
2 rows in set (0.00 sec)
```


#### 删记录: delete from [表名] where [限定条件]
注意: 
- 1.一定要带 `where` 条件, 否则会删除所有记录的
- 2.delete 无法改变表结构,可以使用update将某个字段置空或''
- 3.
```sql
delete from `user` where `name`='小明';

delete from `user`;
```


#### 查询: `select [distinct] ([想查的字段1,想查的字段2...]) from [表名] where [查询条件]`
##### 单表查询:
- 1.查询时去除重复的记录: distinct
- 2.记录的字段统计和别名: `字段1+字段2+字段3+...` as `total`
- 3.`where` 子句常用的运算符:
	+ > 、<  <= 、>=  = 、<> 、!= : 大于、小于、小于等于、大于等于、赋值、不等
	+ between...and...: 显示某一个区间的值
	+ in(set): 显示在in列表中的值, 如: in(100,200)
	+ like 或 not like : 模糊查询, ... where [字段] like ['%xxx%' | 'xxx%' | '%xxx']
		- like '%a%' : 包含`a`的
		- like 'a%'  : 以 `a` 开头的
		- like '%a'  : 以 `a` 结尾的
	+ is null: 判断是否为空
	+ and: 多个条件同时成立
	+ or:  多个条件任意成立一个
	+ not: 不成立, where not(salary > 100)
- 4.排序字句,`order by [列名|别名] asc|desc`
	+ 默认, 升序, asc
	+ 降序: desc
```sql
mysql> create table if not exists `student`(`id` int primary key auto_increment, `name` varchar(20) not null
default '', `chinese` float not null default 0.0, `english` float not null default 0.0, `math` float not null default 0.0) engine innodb character set utf8 collate utf8_general_ci;
Query OK, 0 rows affected, 2 warnings (0.03 sec)

mysql> desc student;
+---------+-------------+------+-----+---------+----------------+
| Field   | Type        | Null | Key | Default | Extra          |
+---------+-------------+------+-----+---------+----------------+
| id      | int         | NO   | PRI | NULL    | auto_increment |
| name    | varchar(20) | NO   |     |         |                |
| chinese | float       | NO   |     | 0       |                |
| english | float       | NO   |     | 0       |                |
| math    | float       | NO   |     | 0       |                |
+---------+-------------+------+-----+---------+----------------+
5 rows in set (0.00 sec)

mysql> insert into student(`name`,`chinese`,`english`,`math`) values ('giao',71,63,51),('xian',87,31,76),('lang',39,73,69),('yang',87,88,85);
Query OK, 4 rows affected (0.01 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> select * from student;
+----+------+---------+---------+------+
| id | name | chinese | english | math |
+----+------+---------+---------+------+
|  1 | giao |      71 |      63 |   51 |
|  2 | xian |      87 |      31 |   76 |
|  3 | lang |      39 |      73 |   69 |
|  4 | yang |      87 |      88 |   85 |
+----+------+---------+---------+------+
4 rows in set (0.00 sec)

mysql> select distinct `name`,`chinese`,`math` from `student`;
+------+---------+------+
| name | chinese | math |
+------+---------+------+
| giao |      71 |   51 |
| xian |      87 |   76 |
| lang |      39 |   69 |
| yang |      87 |   85 |
+------+---------+------+
4 rows in set (0.01 sec)

# 统计每个学生的总分
mysql> select `name`,(chinese+english+math) as `total` from `student`;
+------+-------+
| name | total |
+------+-------+
| giao |   185 |
| xian |   194 |
| lang |   181 |
| yang |   260 |
+------+-------+
4 rows in set (0.00 sec)

# 别名:总分 降序排列
mysql> select `name`,(chinese+english+math) as `total` from `student` order by `total` desc;
+------+-------+
| name | total |
+------+-------+
| yang |   260 |
| xian |   194 |
| giao |   185 |
| lang |   181 |
+------+-------+
4 rows in set (0.00 sec)

# 语文分数排序升序
mysql> select `name`, `chinese` from `student` order by `chinese` asc;
+------+---------+
| name | chinese |
+------+---------+
| lang |      39 |
| giao |      71 |
| xian |      87 |
| yang |      87 |
+------+---------+
4 rows in set (0.00 sec)

mysql> select `name`,(chinese+english+math) as `total` from `student` where `name` like '%an%';
+------+-------+
| name | total |
+------+-------+
| xian |   194 |
| lang |   181 |
| yang |   260 |
+------+-------+
3 rows in set (0.00 sec)

mysql> select `name`,(chinese+english+math) as `total` from `student` where `name` like '%an%';
+------+-------+
| name | total |
+------+-------+
| xian |   194 |
| lang |   181 |
| yang |   260 |
+------+-------+
3 rows in set (0.00 sec)

mysql> select `name`,(chinese+english+math) as `total` from `student` where `name` like '%an';
+------+-------+
| name | total |
+------+-------+
| xian |   194 |
+------+-------+
1 row in set (0.00 sec)

mysql> select `name`,(chinese+english+math) as `total` from `student` where `name` like 'y%'; 
+------+-------+
| name | total |
+------+-------+
| yang |   260 |
+------+-------+
1 row in set (0.00 sec)

# 统计学生/记录的总数
mysql> select count(*) as `total_student` from student;
+---------------+
| total_student |
+---------------+
|             4 |
+---------------+
1 row in set (0.00 sec)

# 返回成绩大于80的行数总数
select count(*) as scope_chinese_80 from student where chinese >= 80;
+------------------+
| scope_chinese_80 |
+------------------+
|                2 |
+------------------+
1 row in set (0.00 sec)
```




### 函数-查询函数字句/组合句
#### 统计函数:
##### 合计函数: count
>`select count(*)|count(列名) from [表名] [where...]`
		+ count(*): 返回满足条件的记录的行数
		+ count(列名): 统计满足调节的某列有多少个,但是会`排除` 值为 `NULL`的情况

##### 统计函数: sum
> 统计列的值的和。只对数字起作用，否则会报错
- 平均值函数: avg, 只对数字起作用,否则也会报错
- 列的最大值,列的最小值: max(列), min(列)

##### 平均值函数: avg, 只对数字起作用,否则也会报错

##### 列的最大值,列的最小值: max(列), min(列)

```bash
# 有null的记录情况
mysql> select * from student;
+----+------+---------+---------+------+------+
| id | name | chinese | english | math | tiyu |
+----+------+---------+---------+------+------+
|  1 | giao |      71 |      63 |   51 |   60 |
|  2 | xian |      87 |      31 |   76 |   60 |
|  3 | lang |      39 |      73 |   69 | NULL |
|  4 | yang |      87 |      88 |   85 |   60 |
+----+------+---------+---------+------+------+
4 rows in set (0.00 sec)
# count(*) 与 count(列名)的区别, count(列名): 会过滤掉 列=NULL的行
mysql> select count(*) as records from `student`;
+---------+
| records |
+---------+
|       4 |
+---------+
1 row in set (0.00 sec)

mysql> select count(tiyu) as records from `student`;
+---------+
| records |
+---------+
|       3 |
+---------+
1 row in set (0.00 sec)

# 统计列的值的总和
mysql> select sum(tiyu) from  `student`;
+-----------+
| sum(tiyu) |
+-----------+
|       180 |
+-----------+
1 row in set (0.00 sec)

# 统计各科成绩总分
mysql> select sum(tiyu), sum(english), sum(chinese), sum(math) from  `student`;
+-----------+--------------+--------------+-----------+
| sum(tiyu) | sum(english) | sum(chinese) | sum(math) |
+-----------+--------------+--------------+-----------+
|       180 |          255 |          284 |       281 |
+-----------+--------------+--------------+-----------+
1 row in set (0.00 sec)

# 统计语文和数学的总分
mysql> select sum(chinese + math) as base_scope from  `student`;
+------------+
| base_scope |
+------------+
|        565 |
+------------+
1 row in set (0.00 sec)

# 语文成绩的平均分方式一
mysql> select sum(`chinese`)/count(*) as `chinese_avg` from `student`;
+-------------+
| chinese_avg |
+-------------+
|          71 |
+-------------+
1 row in set (0.00 sec)

# 平均分统计的正确方式
mysql> select avg(`chinese`) as `chinese_svg` from `student`;
+-------------+
| chinese_svg |
+-------------+
|          71 |
+-------------+
1 row in set (0.00 sec)

# 总分平均分
mysql> select avg(`chinese` + `math` + `english`) from `student`;
+-------------------------------------+
| avg(`chinese` + `math` + `english`) |
+-------------------------------------+
|                                 205 |
+-------------------------------------+
1 row in set (0.00 sec)

# 最大值、最小值
mysql> select max(`chinese`), max(`chinese` + `math` + `english`), min(`math`) from `student`;
+----------------+-------------------------------------+-------------+
| max(`chinese`) | max(`chinese` + `math` + `english`) | min(`math`) |
+----------------+-------------------------------------+-------------+
|             87 |                                 260 |          51 |
+----------------+-------------------------------------+-------------+
1 row in set (0.00 sec)
```

##### group by + having
- 1.分组统计: group by, 对列进行分组统计
- 2.使用`having`对分组后的结果进行过滤
```bash
# 部门表、员工表、工资级别表
create table if not exists `dept`(
`id` int auto_increment,
`deptno` mediumint unsigned not null default 0,
`dname` varchar(20) not null default '',
`loc` varchar(13) not null default '',
primary key(`id`, `deptno`)
) engine innodb character set utf8mb4 collate utf8mb4_general_ci;

insert into `dept`(`deptno`, `dname`, `loc`) values(10, 'manager', 'beijing'),
	(20, 'research', 'shanghei'),
	(30, 'sales', 'guangzhou'),
	(40, 'operations', 'shenzhen');

create table if not exists `emp`(
`id` int auto_increment,
`empno` mediumint unsigned not null default 0,
`empname` varchar(20) not null default '',
`job` varchar(9) not null default '',
`mgr` mediumint unsigned,
`hiredate` timestamp not null default current_timestamp,
`salary` decimal(7,2) not null,
`comm` decimal(7,2),
`deptno` mediumint unsigned not null default 0,
primary key (`id`,`empno`)
) engine innodb character set utf8mb4 collate utf8mb4_general_ci;

insert into `emp`(`empno`, `empname`, `job`, `mgr`, `hiredate`, `salary`, `comm`, `deptno`) values(7639, 'smite', 'clerk', 7902, '1990-12-17', 800.00, NULL, 30),
	(7499, 'allen', 'salesman', 7698, '1991-2-20', 1800.00, 300.00, 30),
	(7521, 'ward', 'salesman', 7698, '1991-2-22', 1250.00, 500.00, 30),
	(7566, 'jones', 'manager', 7639, '1991-4-2', 2975.00, NULL, 20),
	(7654, 'martin', 'salesman', 7898, '1991-9-28', 1250.00, 1400.00, 30),
	(7698, 'blake', 'manager', 7839, '1991-5-1', 2850.00, NULL, 30),
	(7782, 'clake', 'manager', 7839, '1991-6-9', 2450.00, NULL, 10),
	(7788, 'scott', 'analyst', 7566, '1991-4-19', 3000.00, NULL, 20),
	(7839, 'king', 'president', NULL, '1990-4-19', 5000.00, NULL, 10),
	(7844, 'turner', 'salesman', 7698, '1991-9-8', 1500.00, NULL, 30),
	(7900, 'james', 'clerk', 7698, '1991-12-3', 950.00, NULL, 30),
	(7902, 'ford', 'analyst', 7566, '1991-12-3', 3000.00, NULL, 20),
	(7934, 'miller', 'clerk', 7782, '1992-1-23', 3000.00, NULL, 10);

create table if not exists `salgrade`(
`id` int auto_increment,
`grade` mediumint unsigned not null default 0,
`losal` decimal(17,2) not null,
`hisal` decimal(17,2) not null,
primary key (`id`, `grade`)
) engine innodb character set utf8mb4 collate utf8mb4_general_ci;

insert into `salgrade`(`grade`, `losal`, `hisal`) values(1,700,1200),
	(2,1201,1400),
	(3,1401,2000),
	(4,2001,3000),
	(5,3001,9999);

# groud by + having 分组查询
# 1.显示每个部门的平均工资和最高工资
#   avg(salary)、max(salary) group by
mysql> select `deptno`, avg(salary) as `salary_avg`, max(salary) as `salary_max` from `emp` group by `deptno`;
+--------+-------------+------------+
| deptno | salary_avg  | salary_max |
+--------+-------------+------------+
|     30 | 1485.714286 |    2850.00 |
|     20 | 2991.666667 |    3000.00 |
|     10 | 3483.333333 |    5000.00 |
+--------+-------------+------------+
3 rows in set (0.00 sec)

# 2.显示每个部门的每种岗位的平均工资和最低工资
mysql> select `deptno`,`job`,avg(`salary`) as `salara_svg`, min(`salary`) as `salary_min` from `emp` group by `deptno`,`job`;
+--------+-----------+-------------+------------+
| deptno | job       | salara_svg  | salary_min |
+--------+-----------+-------------+------------+
|     30 | clerk     |  875.000000 |     800.00 |
|     30 | salesman  | 1450.000000 |    1250.00 |
|     20 | manager   | 2975.000000 |    2975.00 |
|     30 | manager   | 2850.000000 |    2850.00 |
|     10 | manager   | 2450.000000 |    2450.00 |
|     20 | analyst   | 3000.000000 |    3000.00 |
|     10 | president | 5000.000000 |    5000.00 |
|     10 | clerk     | 3000.000000 |    3000.00 |
+--------+-----------+-------------+------------+
8 rows in set (0.00 sec)
9 rows in set (0.01 sec)

# 3.显示平均工资低于2000的部门号和它的平均工资
#   在分组后进行过滤、筛选: 使用 group by + having [条件]
mysql> select avg(`salary`) as `salary_avg`, `deptno` from `emp` group by `deptno` having `salary_avg` < 2000;
+-------------+--------+
| salary_avg  | deptno |
+-------------+--------+
| 1485.714286 |     30 |
+-------------+--------+
1 row in set (0.00 sec)
```


#### 函数-字符串函数
- 1. charset(str)                           返回字符串的字符集
- 2. concat (str1,str2,...)									字符串拼接, 将 多列拼接成一列
- 3. instr (str, substring)									返回 substring 在 str 中出现的位置,没有则返回 0 
- 4. ucase (str)													  转大写
- 5. lcase (str) 														转小写
- 6. left (str, length)											从 str 的左边起去取 length 个字符
- 7. length (str) 													获取str的长度, 单位: 字节, utf8编码：一个汉字算三个字节，一个数字或字母算一个字节。
- 7-1. char_length(str)                     获取str的长度, 单位: 字符,不管一个汉字、数字、字母、符号 都算是一个字符
- 8. replace (str, search_str, replace_str) 在 str 中取 repalce_str 替换 search_str
- 9. strcmp (str1, str2) 										逐字符比较2个字符串的大小
- 10. substring (str, position [,length]) 	从 str 的position位置开始[从1开始计算], 取 length 个字符
- 11. ltrim (str)  rtrim (str1) trim				去除前端空格或后端空格
```bash
# 返回字符串的字符集: select charset(列名) from [表名] where [条件]
mysql> select charset(empname) from emp;
+------------------+
| charset(empname) |
+------------------+
| utf8mb4          |
| utf8mb4          |
| utf8mb4          |
| utf8mb4          |
| utf8mb4          |
| utf8mb4          |
| utf8mb4          |
| utf8mb4          |
| utf8mb4          |
| utf8mb4          |
| utf8mb4          |
| utf8mb4          |
| utf8mb4          |
+------------------+
13 rows in set (0.00 sec)

# concat(字段1, 字段2， ...) 拼接成一列
mysql> select concat(`empname`, ' job is ', `job`, ' salary is ', `salary`) as `emp_info` from `emp`;
+-----------------------------------------+
| emp_info                                |
+-----------------------------------------+
| smite job is clerk salary is 800.00     |
| allen job is salesman salary is 1800.00 |
| ward job is salesman salary is 1250.00  |
| jones job is manager salary is 2975.00  |
| martin job is sales salary is 1250.00   |
| blake job is manager salary is 2850.00  |
| clake job is manager salary is 2450.00  |
| scott job is analyst salary is 3000.00  |
| king job is president salary is 5000.00 |
| turner job is sales salary is 1500.00   |
| james job is clerk salary is 950.00     |
| ford job is analyst salary is 3000.00   |
| miller job is clerk salary is 3000.00   |
+-----------------------------------------+
13 rows in set (0.00 sec)

# instr(`列名`, '要查的字符串') 返回 要查的字符串 出现在 列的值字符串的 位置,没有则返回 0
mysql> select instr(`job`, 'an') from emp;
+--------------------+
| instr(`job`, 'an') |
+--------------------+
|                  0 |
|                  7 |
|                  7 |
|                  2 |
|                  0 |
|                  2 |
|                  2 |
|                  1 |
|                  0 |
|                  0 |
|                  0 |
|                  1 |
|                  0 |
+--------------------+
13 rows in set (0.00 sec)

# 列的查询结果: 转大写, 转小写
mysql> select ucase(`empname`), lcase(`job`) from `emp`;
+------------------+--------------+
| ucase(`empname`) | lcase(`job`) |
+------------------+--------------+
| SMITE            | clerk        |
| ALLEN            | salesman     |
| WARD             | salesman     |
| JONES            | manager      |
| MARTIN           | sales        |
| BLAKE            | manager      |
| CLAKE            | manager      |
| SCOTT            | analyst      |
| KING             | president    |
| TURNER           | sales        |
| JAMES            | clerk        |
| FORD             | analyst      |
| MILLER           | clerk        |
+------------------+--------------+
13 rows in set (0.00 sec)

# 列的查询结果 从左边 / 右边 取 length 个字符：left(列名, length) / right(列名, length)
mysql> select left(`job`, 4) from `emp`;
+----------------+
| left(`job`, 4) |
+----------------+
| cler           |
| sale           |
| sale           |
| mana           |
| sale           |
| mana           |
| mana           |
| anal           |
| pres           |
| sale           |
| cler           |
| anal           |
| cler           |
+----------------+
13 rows in set (0.00 sec)

mysql> select right(`job`, 3) from `emp` where `empname` = 'james';
+-----------------+
| right(`job`, 3) |
+-----------------+
| erk             |
+-----------------+
1 row in set (0.00 sec)

# 计算结果字符串的字节大小 str的长度[按照字节]: length(列名)
# 遇到中文时, length(中文) = 中文内容长度 * 字符编码中文字节大小
# 非中文, length(非中文) = 非中文的长度 * 1
mysql> select length(`job`) from `emp`;
+---------------+
| length(`job`) |
+---------------+
|             5 |
|             8 |
|             8 |
|             7 |
|             5 |
|             7 |
|             7 |
|             7 |
|             9 |
|             5 |
|             5 |
|             7 |
|             5 |
+---------------+
13 rows in set (0.00 sec)

mysql> select * from t05;
+----+--------+
| id | name   |
+----+--------+
|  1 | ap     |
|  2 | 中     |
|  3 | 中x    |
|  4 | 中国   |
+----+--------+
4 rows in set (0.01 sec)

mysql> select length(`name`) from `t05`;]
+----------------+
| length(`name`) |
+----------------+
|              2 |
|              3 |
|              4 |
|              6 |
+----------------+
4 rows in set (0.00 sec)

# 替换: replace(`列名`, '找到的结果', '想要替换成的字符串')
mysql> select `name`,replace(`name`, '中国', 'cn') from t05;
+--------+---------------------------------+
| name   | replace(`name`, '中国', 'cn')   |
+--------+---------------------------------+
| ap     | ap                              |
| 中     | 中                              |
| 中x    | 中x                             |
| 中国   | cn                              |
+--------+---------------------------------+
4 rows in set (0.00 sec)

# (逐字符)比较大小是否相等, 注意 collate 是否设置了区分大小写的情况。
# 如果 collate 不区分大小写的规则, 那么 select strcmp('Z', 'z') from DUAL => 0, 不区分大小写则一样的，'0'. `-1` =》不同
mysql> select strcmp('Z', 'z') from DUAL;
+------------------+
| strcmp('Z', 'z') |
+------------------+
|                0 |
+------------------+
1 row in set (0.00 sec)

# substring(`列`, position, length): 从position位置开始截取length长度的字符
# 	position: 起始位置 从 1 开始的
mysql> select substring(`empname`, 1, 4) from `emp`;
+----------------------------+
| substring(`empname`, 1, 4) |
+----------------------------+
| smit                       |
| alle                       |
| ward                       |
| jone                       |
| mart                       |
| blak                       |
| clak                       |
| scot                       |
| king                       |
| turn                       |
| jame                       |
| ford                       |
| mill                       |
+----------------------------+
13 rows in set (0.00 sec)


# 去除前端空格或后端空格: ltrim(str)  rtrim(str1) trim(str1)左右两边都去掉空格
mysql> select ltrim('  ok') from DUAL;
+---------------+
| ltrim('  ok') |
+---------------+
| ok            |
+---------------+
1 row in set (0.00 sec)

mysql> select rtrim('  ok ') from DUAL;
+----------------+
| rtrim('  ok ') |
+----------------+
|   ok           |
+----------------+
1 row in set (0.00 sec)

mysql> select trim('  ok ') from DUAL;
+---------------+
| trim('  ok ') |
+---------------+
| ok            |
+---------------+
1 row in set (0.00 sec)


# 练习题: 一首字母大写的方式显示所有员工的姓名(emp表-empname)
mysql> select concat(ucase(substring(`empname`, 1,1)), substring(`empname`,2)) as `name` from `emp`;
+--------+
| name   |
+--------+
| Smite  |
| Allen  |
| Ward   |
| Jones  |
| Martin |
| Blake  |
| Clake  |
| Scott  |
| King   |
| Turner |
| James  |
| Ford   |
| Miller |
+--------+
13 rows in set (0.00 sec)

mysql> select replace(`empname`, left(`empname`, 1), ucase(left(`empname`,1)))  as `name`
from `emp`;
+--------+
| name   |
+--------+
| Smite  |
| Allen  |
| Ward   |
| Jones  |
| Martin |
| Blake  |
| Clake  |
| Scott  |
| King   |
| Turner |
| James  |
| Ford   |
| Miller |
+--------+
13 rows in set (0.00 sec)
```

#### 数学相关函数
- 1.绝对值: abs(num)
- 2.十进制转二进制: bin(num)
- 3.向上取整: ceiling(num)
- 4.进制转换: conv(num, 变换前的进制, 想要转成的进制)
- 5.向下取整: floor(num)
- 6.保留小数位: format(num, x), x是想要保留的小数位数,如x=2,要保留2位小数
- 7.求出最小值: least(num1,num2,num3...)
- 8.求余: mod(num, 被除数)
```sql
# 绝对值： abs()
mysql> select abs(-3.14) from DUAL;
+------------+
| abs(-3.14) |
+------------+
|       3.14 |
+------------+
1 row in set (0.00 sec)

# 十进制转二进制
mysql> select bin(14) from DUAL;
+---------+
| bin(14) |
+---------+
| 1110    |
+---------+
1 row in set (0.00 sec)

# 向上取整：ceiling
mysql> select ceiling(-1.3) from DUAL;
+---------------+
| ceiling(-1.3) |
+---------------+
|            -1 |
+---------------+
1 row in set (0.00 sec)

# 向下取整: floor
mysql> select floor(-1.3) from DUAL;
+-------------+
| floor(-1.3) |
+-------------+
|          -2 |
+-------------+
1 row in set (0.00 sec)

# 转换进制: conv(num, 旧进制, 目标进制)
mysql> select conv(10, 8, 2) from DUAL;
+----------------+
| conv(10, 8, 2) |
+----------------+
| 1000           |
+----------------+
1 row in set (0.00 sec)

mysql> select conv(10, 10, 2) from DUAL;
+-----------------+
| conv(10, 10, 2) |
+-----------------+
| 1010            |
+-----------------+
1 row in set (0.00 sec)

mysql> select conv(10, 16, 8) from DUAL;
+-----------------+
| conv(10, 16, 8) |
+-----------------+
| 20              |
+-----------------+
1 row in set (0.00 sec)

# 保留x位小数
mysql> select format('3.1415926',3) from DUAL;
+-----------------------+
| format('3.1415926',3) |
+-----------------------+
| 3.142                 |
+-----------------------+
1 row in set (0.00 sec)

# 一组数中的最小值
mysql> select least(11,25,34,13) from DUAL;
+--------------------+
| least(11,25,34,13) |
+--------------------+
|                 11 |
+--------------------+
1 row in set (0.00 sec)

# 求余: mod(a, b)
mysql> select mod(375, 17) from DUAL;
+--------------+
| mod(375, 17) |
+--------------+
|            1 |
+--------------+
1 row in set (0.00 sec)

mysql> select mod(375, 16) from DUAL;
+--------------+
| mod(375, 16) |
+--------------+
|            7 |
+--------------+
1 row in set (0.00 sec)

mysql> select mod(375, 18) from DUAL;
+--------------+
| mod(375, 18) |
+--------------+
|           15 |
+--------------+
1 row in set (0.00 sec)

# 返回随机数: rand() 范围: 0 <= x <= 1
# order by rand() 随机查询取前几条记录
# rand(seed) 给定seed种子,产生固定不变的随机数
mysql> select rand() from DUAL;
+--------------------+
| rand()             |
+--------------------+
| 0.7163282415981668 |
+--------------------+
1 row in set (0.01 sec)


```


#### 时间日期的函数
- 1.当前日期
- 2.当前时间
- 3.当前时间戳
- 4.










## mysql 高级操作
- left join
- 组合
- 约束
- 索引
- 事物






## mysql 优化








## mysql 集群方案
