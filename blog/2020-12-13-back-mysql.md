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
- 1.当前日期: current_date()
- 2.当前时间: current_time()
- 3.当前时间戳: current_timestamp()
- 4.返回datetime的日期部分: date(时间戳)
- 5.在 date2 基础上加上 日期或时间: date_add(date2, 日期/时间)
- 6.在 date2 基础上减去 日期或时间: date_sub(date2, 日期/时间)
- 7.两个日期差(结果是天): datediff(date1, date2)
- 8.两个时间差(x时y分z秒): timediff(time1, time2)
- 9.当前时间: now()
- 10.年 月 日: year(date), moNth(date), day(date)
- 11.返回:1970-1-1 00:00:00 到现在的秒数: uni_timestamp()
- 12.将 秒数 转成指定格式的日期: from_unixtime(unix_timestamp() | 秒数)
```bash
# 1.当前日期: current_date()
mysql> select current_date() from DUAL;
+--------------+
| current_date |
+--------------+
| 2021-07-03   |
+--------------+
1 row in set (0.01 sec)

# 2.当前时间: current_time()
mysql> select current_time from DUAL;
+--------------+
| current_time |
+--------------+
| 06:27:49     |
+--------------+
1 row in set (0.00 sec)

# 3.当前时间戳: current_timestamp()
mysql> select current_timestamp from DUAL;
+---------------------+
| current_timestamp   |
+---------------------+
| 2021-07-03 06:28:18 |
+---------------------+
1 row in set (0.00 sec)

# 时间记录表
mysql> create table if not exists `msg`(
    -> `id` int auto_increment,
    -> `content` varchar(30), 
    -> `send_time` datetime,
    -> primary key (`id`)
    -> ) engine innodb character set utf8mb4 collate utf8mb4_general_ci;
Query OK, 0 rows affected (0.02 sec)

mysql> desc `msg`;
+-----------+-------------+------+-----+---------+----------------+
| Field     | Type        | Null | Key | Default | Extra          |
+-----------+-------------+------+-----+---------+----------------+
| id        | int         | NO   | PRI | NULL    | auto_increment |
| content   | varchar(30) | YES  |     | NULL    |                |
| send_time | datetime    | YES  |     | NULL    |                |
+-----------+-------------+------+-----+---------+----------------+
3 rows in set (0.01 sec)

mysql> insert into `msg`(`content`, `send_time`) values ('北京新闻', current_timestamp()),('深圳新闻', current_timestamp());
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from `msg`;
+----+--------------+---------------------+
| id | content      | send_time           |
+----+--------------+---------------------+
|  1 | 北京新闻     | 2021-07-03 06:46:46 |
|  2 | 深圳新闻     | 2021-07-03 06:46:46 |
+----+--------------+---------------------+
2 rows in set (0.01 sec)

# 4.返回datetime的日期部分: date(date)
mysql> select date(`send_time`) from `msg`;
+-------------------+
| date(`send_time`) |
+-------------------+
| 2021-07-03        |
| 2021-07-03        |
+-------------------+
2 rows in set (0.00 sec)

mysql> select date('2021-3-7') from DUAL;
+------------------+
| date('2021-3-7') |
+------------------+
| 2021-03-07       |
+------------------+
1 row in set (0.00 sec)

mysql> insert into `msg`(`content`, `send_time`) values ('广州新闻', now());
Query OK, 1 row affected (0.00 sec)

mysql> insert into `msg`(`content`, `send_time`) values ('上海新闻', now());
Query OK, 1 row affected (0.00 sec)

mysql> select * from `msg`;
+----+--------------+---------------------+
| id | content      | send_time           |
+----+--------------+---------------------+
|  1 | 北京新闻     | 2021-07-03 06:46:46 |
|  2 | 深圳新闻     | 2021-07-03 06:46:46 |
|  3 | 广州新闻     | 2021-07-03 06:57:04 |
|  4 | 上海新闻     | 2021-07-03 06:58:03 |
+----+--------------+---------------------+

# 5.在 data2 基础上加上 日期或时间: date_add(date2, interval x d_type)
# 6.在 data2 基础上减去 日期或时间: date_sub(date2, interval x d_type)
# 7.两个日期差(结果是天): datediff(date1, date2)
# 8.两个时间差(x时y分z秒): timediff(time1, time2)
# 9.当前时间戳: now()
# 10.年、月、日: year(date), moNth(date), day(date)
# 11.返回:1970-1-1 00:00:00 到现在的秒数: uni_timestamp()
# 12.将 unix_time 秒数转成指定格式的日期: from_unixtime(unix_timestamp() | 秒数)

# 显示所有新闻信息,发布日期只显示日期
mysql> select `id`, `content`, date(`send_time`) from `msg`;
+----+--------------+-------------------+
| id | content      | date(`send_time`) |
+----+--------------+-------------------+
|  1 | 北京新闻     | 2021-07-03        |
|  2 | 深圳新闻     | 2021-07-03        |
|  3 | 广州新闻     | 2021-07-03        |
|  4 | 上海新闻     | 2021-07-03        |
+----+--------------+-------------------+
4 rows in set (0.00 sec)

# 查询在10分钟内发布的新闻
mysql> select * from `msg` where date_add(`send_time`, interval 10 minute) >= now();
+----+--------------+---------------------+
| id | content      | send_time           |
+----+--------------+---------------------+
|  6 | 上海新闻     | 2021-07-03 06:58:03 |
+----+--------------+---------------------+
1 row in set (0.00 sec)

mysql> select * from `msg` where date_sub(now(), interval 15 minute) <= `send_time`;
+----+--------------+---------------------+
| id | content      | send_time           |
+----+--------------+---------------------+
|  5 | 广州新闻     | 2021-07-03 06:57:04 |
|  6 | 上海新闻     | 2021-07-03 06:58:03 |
+----+--------------+---------------------+
2 rows in set (0.00 sec)

# '2011-11-11', '1990-1-1' 之间间隔多少天
mysql> select datediff('2011-11-11', '1990-1-1') from DUAL;
+------------------------------------+
| datediff('2011-11-11', '1990-1-1') |
+------------------------------------+
|                               7984 |
+------------------------------------+
1 row in set (0.00 sec)

mysql> select datediff('1990-1-1', '2011-11-11') from DUAL;
+------------------------------------+
| datediff('1990-1-1', '2011-11-11') |
+------------------------------------+
|                              -7984 |
+------------------------------------+
1 row in set (0.00 sec)

# 生日: 1994-10-23, 计算这小子活了多少天
mysql> select datediff(now(), '1994-10-20')  from DUAL;
+-------------------------------+
| datediff(now(), '1994-10-20') |
+-------------------------------+
|                          9753 |
+-------------------------------+
1 row in set (0.00 sec)

mysql> select datediff(now(), '1994-10-20')/365 as `man_age`  from DUAL;
+---------+
| man_age |
+---------+
| 26.7205 |
+---------+
1 row in set (0.00 sec)

# 如果能或到80岁,计算你还能活多少天(生日: 1994-10-23)
# 先求出 80岁时的日期
# 再减去 now(), 再转 天数 datediff(date2, date1)
# interval 间隔: interval x [year|mouth|date|hour|mitune|second]
mysql> select date_add('1994-10-23', interval 80 year) as `latest_time`,datediff(date_add('1994-10-23', interval 80 year), now()) as `less_date`  from dual;
+-------------+-----------+
| latest_time | less_date |
+-------------+-----------+
| 2074-10-23  |     19470 |
+-------------+-----------+
1 row in set (0.00 sec)

# 时分秒时间差计算
mysql> select timediff('10:11:31', '05:59:16') from DUAL;
+----------------------------------+
| timediff('10:11:31', '05:59:16') |
+----------------------------------+
| 04:12:15                         |
+----------------------------------+
1 row in set (0.00 sec)

# 取出日期时间中的 年、月、日： year(date), moNth(date), day(date)
mysql> select year(now()), moNth(now()), day(now()) from DUAL;
+-------------+--------------+------------+
| year(now()) | moNth(now()) | day(now()) |
+-------------+--------------+------------+
|        2021 |            7 |          3 |
+-------------+--------------+------------+
1 row in set (0.00 sec)

# 
mysql> select unix_timestamp() from DUAL;
+------------------+
| unix_timestamp() |
+------------------+
|       1625269333 |
+------------------+
1 row in set (0.00 sec)

mysql> select unix_timestamp()/(24*3600*365) as `has_year_1970` from DUAL;
+---------------+
| has_year_1970 |
+---------------+
|       51.5370 |
+---------------+
1 row in set (0.00 sec)

# from_unixtime(unix_timestamp()|秒数, '%Y-%m-%d')
# from_unixtime(unix_timestamp()|秒数, '%Y-%m-%d %H:%m:%s')
# 将时间转成整数数值，通过 from_unixtime 进行时间转换
mysql> select from_unixtime(unix_timestamp(), '%Y-%m-%d') from DUAL;
+---------------------------------------------+
| from_unixtime(unix_timestamp(), '%Y-%m-%d') |
+---------------------------------------------+
| 2021-07-03                                  |
+---------------------------------------------+
1 row in set (0.00 sec)

mysql> select from_unixtime(unix_timestamp(), '%Y-%m-%d %H:%m:%s') from DUAL;
+------------------------------------------------------+
| from_unixtime(unix_timestamp(), '%Y-%m-%d %H:%m:%s') |
+------------------------------------------------------+
| 2021-07-03 07:07:00                                  |
+------------------------------------------------------+
1 row in set (0.00 sec)

```


#### 加密和系统函数
- 1.查询操作数据库的用户+ip: user()
- 2.操作的是哪数据库名称: databaase()
- 3.为字符串算出一个md5 32为的字符(加密): md5()
- 4.加密算法二(mysql给数据库用户连接登录进行加密的操作): password(str), mysql8 已移除了该函数
- 5.xxx: xxx()
```bash
- 1.查询操作数据库的用户+ip: user()
mysql> select user();
+-------------------+
| user()            |
+-------------------+
| apem789@localhost |
+-------------------+
1 row in set (0.00 sec)

- 2.操作的是哪数据库名称: databaase()
mysql> select database();
+------------+
| database() |
+------------+
| xyz        |
+------------+
1 row in set (0.00 sec)

- 3.为字符串算出一个md5 32为的字符(加密): md5()
mysql> select md5('abc') as `md5_32` from DUAL;
+----------------------------------+
| md5_32                           |
+----------------------------------+
| 900150983cd24fb0d6963f7d28e17f72 |
+----------------------------------+
1 row in set (0.00 sec)


```


#### 流程控制函数
- 1. 三元表达式：if(expr1, expr2, expr3) => 如果 expr1 true? return expr2 else return expr3
- 2. ifnull(expr1, expr2) => 如果 expr1 不为 null, 则返回 expr1, 否则返回 expr2
- 3. is null 是空, is not null 非空
- 3. 多重分支: case when 条件1 then 结果1 when 条件2 then 结果2 else 结果3 end
```bash
mysql> select if(true, '北京', '上海');
+------------------------------+
| if(true, '北京', '上海')     |
+------------------------------+
| 北京                         |
+------------------------------+
1 row in set (0.00 sec)

mysql> select if(false, '北京', '上海');
+-------------------------------+
| if(false, '北京', '上海')     |
+-------------------------------+
| 上海                          |
+-------------------------------+
1 row in set (0.00 sec)

mysql> select ifnull('北京', '上海');
+----------------------------+
| ifnull('北京', '上海')     |
+----------------------------+
| 北京                       |
+----------------------------+
1 row in set (0.00 sec)

mysql> select ifnull('', '上海');
+----------------------+
| ifnull('', '上海')   |
+----------------------+
|                      |
+----------------------+
1 row in set (0.00 sec)

mysql> select ifnull(NULL, '上海');
+------------------------+
| ifnull(NULL, '上海')   |
+------------------------+
| 上海                   |
+------------------------+
1 row in set (0.00 sec)

# 1.查询 emp 表, 如果 comm 为 null, 则显示 0.0
mysql> select ifnull(`comm`, 0.0) from `emp`;
+---------------------+
| ifnull(`comm`, 0.0) |
+---------------------+
|                0.00 |
|              300.00 |
|              500.00 |
|                0.00 |
|             1400.00 |
|                0.00 |
|                0.00 |
|                0.00 |
|                0.00 |
|                0.00 |
|                0.00 |
|                0.00 |
|                0.00 |
+---------------------+
13 rows in set (0.00 sec)

mysql> select if(`comm` is null, 0.0, `comm`) from `emp`;
+---------------------------------+
| if(`comm` is null, 0.0, `comm`) |
+---------------------------------+
|                             0.0 |
|                          300.00 |
|                          500.00 |
|                             0.0 |
|                         1400.00 |
|                             0.0 |
|                             0.0 |
|                             0.0 |
|                             0.0 |
|                             0.0 |
|                             0.0 |
|                             0.0 |
|                             0.0 |
+---------------------------------+
13 rows in set (0.00 sec)


# 2.如果 emp 表的 job 是 `clerk` 则显示`职员`, 如果是`manager` 则显示为 `经理`, 如果是 `salesman` 则显示为 `销售员`, 其他正常显示.
mysql> select case when `job`='clerk' then '职员' when `job`='manager' then '经理' when `job`='salesman' then '销售员' else `job` end as 'job_name' from `emp`;
+-----------+
| job_name  |
+-----------+
| 职员      |
| 销售员    |
| 销售员    |
| 经理      |
| 销售员    |
| 经理      |
| 经理      |
| analyst   |
| president |
| 销售员    |
| 职员      |
| analyst   |
| 职员      |
+-----------+
13 rows in set (0.00 sec)

```


#### 查询-其他
```bash
# 1.使用 where 字句:
#		  如何查询 1991.11.1 后入职的员工
mysql> select * from `emp` where `hiredate` > '1991-11-01';
+----+-------+---------+---------+------+---------------------+---------+------+--------+
| id | empno | empname | job     | mgr  | hiredate            | salary  | comm | deptno |
+----+-------+---------+---------+------+---------------------+---------+------+--------+
| 11 |  7900 | james   | clerk   | 7698 | 1991-12-03 00:00:00 |  950.00 | NULL |     30 |
| 12 |  7902 | ford    | analyst | 7566 | 1991-12-03 00:00:00 | 3000.00 | NULL |     20 |
| 13 |  7934 | miller  | clerk   | 7782 | 1992-01-23 00:00:00 | 3000.00 | NULL |     10 |
+----+-------+---------+---------+------+---------------------+---------+------+--------+
3 rows in set (0.00 sec)

# 2.如何使用 like 操作符(模糊查询)
#			`%`: 表示 0 到 多个字符串
#			`_`: 表示 任意单个字符
#
# 显示首字符为 `s` 的员工姓名和工资
mysql> select * from `emp` where `empname` like 's%';
+----+-------+---------+---------+------+---------------------+---------+------+--------+
| id | empno | empname | job     | mgr  | hiredate            | salary  | comm | deptno |
+----+-------+---------+---------+------+---------------------+---------+------+--------+
|  1 |  7639 | smite   | clerk   | 7902 | 1990-12-17 00:00:00 |  800.00 | NULL |     30 |
|  8 |  7788 | scott   | analyst | 7566 | 1991-04-19 00:00:00 | 3000.00 | NULL |     20 |
+----+-------+---------+---------+------+---------------------+---------+------+--------+
2 rows in set (0.01 sec)

# 显示第三字符为 `o` 的所有员工的姓名和工资
mysql> select * from `emp` where `empname` like '__o%';
+----+-------+---------+---------+------+---------------------+---------+------+--------+
| id | empno | empname | job     | mgr  | hiredate            | salary  | comm | deptno |
+----+-------+---------+---------+------+---------------------+---------+------+--------+
|  8 |  7788 | scott   | analyst | 7566 | 1991-04-19 00:00:00 | 3000.00 | NULL |     20 |
+----+-------+---------+---------+------+---------------------+---------+------+--------+
1 row in set (0.00 sec)

# 3.如何显示没有上级的雇员的情况
mysql> select * from `emp` where `mgr` is NULL;
+----+-------+---------+-----------+------+---------------------+---------+------+--------+
| id | empno | empname | job       | mgr  | hiredate            | salary  | comm | deptno |
+----+-------+---------+-----------+------+---------------------+---------+------+--------+
|  9 |  7839 | king    | president | NULL | 1990-04-19 00:00:00 | 5000.00 | NULL |     10 |
+----+-------+---------+-----------+------+---------------------+---------+------+--------+
1 row in set (0.00 sec)

# 查看表结构
mysql> desc `emp`;
+----------+--------------------+------+-----+-------------------+-------------------+
| Field    | Type               | Null | Key | Default           | Extra             |
+----------+--------------------+------+-----+-------------------+-------------------+
| id       | int                | NO   | PRI | NULL              | auto_increment    |
| empno    | mediumint unsigned | NO   | PRI | 0                 |                   |
| empname  | varchar(20)        | NO   |     |                   |                   |
| job      | varchar(9)         | NO   |     |                   |                   |
| mgr      | mediumint unsigned | YES  |     | NULL              |                   |
| hiredate | timestamp          | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| salary   | decimal(7,2)       | NO   |     | NULL              |                   |
| comm     | decimal(7,2)       | YES  |     | NULL              |                   |
| deptno   | mediumint unsigned | NO   |     | 0                 |                   |
+----------+--------------------+------+-----+-------------------+-------------------+
9 rows in set (0.00 sec)

# 工资从 底 到 高的顺序,显示雇员的信息: order by
mysql> select * from `emp` order by `salary` asc;
+----+-------+---------+-----------+------+---------------------+---------+---------+--------+
| id | empno | empname | job       | mgr  | hiredate            | salary  | comm    | deptno |
+----+-------+---------+-----------+------+---------------------+---------+---------+--------+
|  1 |  7639 | smite   | clerk     | 7902 | 1990-12-17 00:00:00 |  800.00 |    NULL |     30 |
| 11 |  7900 | james   | clerk     | 7698 | 1991-12-03 00:00:00 |  950.00 |    NULL |     30 |
|  3 |  7521 | ward    | salesman  | 7698 | 1991-02-22 00:00:00 | 1250.00 |  500.00 |     30 |
|  5 |  7654 | martin  | salesman  | 7898 | 1991-09-28 00:00:00 | 1250.00 | 1400.00 |     30 |
| 10 |  7844 | turner  | salesman  | 7698 | 1991-09-08 00:00:00 | 1500.00 |    NULL |     30 |
|  2 |  7499 | allen   | salesman  | 7698 | 1991-02-20 00:00:00 | 1800.00 |  300.00 |     30 |
|  7 |  7782 | clake   | manager   | 7839 | 1991-06-09 00:00:00 | 2450.00 |    NULL |     10 |
|  6 |  7698 | blake   | manager   | 7839 | 1991-05-01 00:00:00 | 2850.00 |    NULL |     30 |
|  4 |  7566 | jones   | manager   | 7639 | 1991-04-02 00:00:00 | 2975.00 |    NULL |     20 |
|  8 |  7788 | scott   | analyst   | 7566 | 1991-04-19 00:00:00 | 3000.00 |    NULL |     20 |
| 12 |  7902 | ford    | analyst   | 7566 | 1991-12-03 00:00:00 | 3000.00 |    NULL |     20 |
| 13 |  7934 | miller  | clerk     | 7782 | 1992-01-23 00:00:00 | 3000.00 |    NULL |     10 |
|  9 |  7839 | king    | president | NULL | 1990-04-19 00:00:00 | 5000.00 |    NULL |     10 |
+----+-------+---------+-----------+------+---------------------+---------+---------+--------+
13 rows in set (0.00 sec)

# 按照部门号升序而雇员的工资降序 排序, 显示雇员的信息: 多条件 => order by `deptno` asc,`salary` desc;
mysql> select * from `emp` order by `deptno` asc,`salary` desc;
+----+-------+---------+-----------+------+---------------------+---------+---------+--------+
| id | empno | empname | job       | mgr  | hiredate            | salary  | comm    | deptno |
+----+-------+---------+-----------+------+---------------------+---------+---------+--------+
|  9 |  7839 | king    | president | NULL | 1990-04-19 00:00:00 | 5000.00 |    NULL |     10 |
| 13 |  7934 | miller  | clerk     | 7782 | 1992-01-23 00:00:00 | 3000.00 |    NULL |     10 |
|  7 |  7782 | clake   | manager   | 7839 | 1991-06-09 00:00:00 | 2450.00 |    NULL |     10 |
|  8 |  7788 | scott   | analyst   | 7566 | 1991-04-19 00:00:00 | 3000.00 |    NULL |     20 |
| 12 |  7902 | ford    | analyst   | 7566 | 1991-12-03 00:00:00 | 3000.00 |    NULL |     20 |
|  4 |  7566 | jones   | manager   | 7639 | 1991-04-02 00:00:00 | 2975.00 |    NULL |     20 |
|  6 |  7698 | blake   | manager   | 7839 | 1991-05-01 00:00:00 | 2850.00 |    NULL |     30 |
|  2 |  7499 | allen   | salesman  | 7698 | 1991-02-20 00:00:00 | 1800.00 |  300.00 |     30 |
| 10 |  7844 | turner  | salesman  | 7698 | 1991-09-08 00:00:00 | 1500.00 |    NULL |     30 |
|  3 |  7521 | ward    | salesman  | 7698 | 1991-02-22 00:00:00 | 1250.00 |  500.00 |     30 |
|  5 |  7654 | martin  | salesman  | 7898 | 1991-09-28 00:00:00 | 1250.00 | 1400.00 |     30 |
| 11 |  7900 | james   | clerk     | 7698 | 1991-12-03 00:00:00 |  950.00 |    NULL |     30 |
|  1 |  7639 | smite   | clerk     | 7902 | 1990-12-17 00:00:00 |  800.00 |    NULL |     30 |
+----+-------+---------+-----------+------+---------------------+---------+---------+--------+
13 rows in set (0.00 sec)

# 分页查询: [limit start, count]  [start:从 0 开始, start+1] 或者  limit count offset start [start: 也是从0 开始], start+1
# 第一页
mysql> select * from `emp` order by `empno` limit 0,3;
+----+-------+---------+----------+------+---------------------+---------+--------+--------+
| id | empno | empname | job      | mgr  | hiredate            | salary  | comm   | deptno |
+----+-------+---------+----------+------+---------------------+---------+--------+--------+
|  2 |  7499 | allen   | salesman | 7698 | 1991-02-20 00:00:00 | 1800.00 | 300.00 |     30 |
|  3 |  7521 | ward    | salesman | 7698 | 1991-02-22 00:00:00 | 1250.00 | 500.00 |     30 |
|  4 |  7566 | jones   | manager  | 7639 | 1991-04-02 00:00:00 | 2975.00 |   NULL |     20 |
+----+-------+---------+----------+------+---------------------+---------+--------+--------+
3 rows in set (0.00 sec)

mysql> select * from `emp` order by `empno` limit 3 offset 0;
+----+-------+---------+----------+------+---------------------+---------+--------+--------+
| id | empno | empname | job      | mgr  | hiredate            | salary  | comm   | deptno |
+----+-------+---------+----------+------+---------------------+---------+--------+--------+
|  2 |  7499 | allen   | salesman | 7698 | 1991-02-20 00:00:00 | 1800.00 | 300.00 |     30 |
|  3 |  7521 | ward    | salesman | 7698 | 1991-02-22 00:00:00 | 1250.00 | 500.00 |     30 |
|  4 |  7566 | jones   | manager  | 7639 | 1991-04-02 00:00:00 | 2975.00 |   NULL |     20 |
+----+-------+---------+----------+------+---------------------+---------+--------+--------+
3 rows in set (0.00 sec)

# 第二页
mysql> select * from `emp` order by `empno` limit 3 offset 3;

# 按 雇员 的empno 号降序取出, 每页显示5条记录. 请分别显示5条记录,第5页 对应的sql语句、
mysql> select * from `emp` order by `empno` desc limit 5 offset 20;
Empty set (0.00 sec)

# 显示每种岗位的雇员总数、平均工资
mysql> select count(*), avg(`salary`), job from `emp` group by `job`;
+----------+---------------+-----------+
| count(*) | avg(`salary`) | job       |
+----------+---------------+-----------+
|        3 |   1583.333333 | clerk     |
|        4 |   1450.000000 | salesman  |
|        3 |   2758.333333 | manager   |
|        2 |   3000.000000 | analyst   |
|        1 |   5000.000000 | president |
+----------+---------------+-----------+
5 rows in set (0.00 sec)

# 显示雇员总数，获得补助的雇员数、没有获得补助的雇员数
mysql> select count(*), count(`comm`), count(if(`comm` is NULL, 1, NULL)) from `emp`;
+----------+---------------+------------------------------------+
| count(*) | count(`comm`) | count(if(`comm` is NULL, 1, NULL)) |
+----------+---------------+------------------------------------+
|       13 |             3 |                                 10 |
+----------+---------------+------------------------------------+
1 row in set (0.00 sec)

mysql> select count(*), count(`comm`), count(*)-count(`comm`) from `emp`;
+----------+---------------+------------------------+
| count(*) | count(`comm`) | count(*)-count(`comm`) |
+----------+---------------+------------------------+
|       13 |             3 |                     10 |
+----------+---------------+------------------------+
1 row in set (0.00 sec)

# 显示管理员的数量(distinct 去重)
mysql> select count(distinct `mgr`) from `emp`;
+-----------------------+
| count(distinct `mgr`) |
+-----------------------+
|                     7 |
+-----------------------+
1 row in set (0.00 sec)

# 显示雇员工资的最大差额
mysql> select max(`salary`)-min(`salary`) from `emp`;
+-----------------------------+
| max(`salary`)-min(`salary`) |
+-----------------------------+
|                     4200.00 |
+-----------------------------+
1 row in set (0.00 sec)

# ===次序===
selct column1,column2,column3... from table_name
	group by column      # 分组
	having condition		 # 过滤
	order by column      # 排序
	limit start, rows;   # 分页

# 统计各个部分的平均工资, 并且是大于 1000 的, 按照平均工资从高到低排序, 取出前2行记录
mysql> select `deptno`,avg(`salary`) as `salary_avg`  from `emp` group by `deptno` having  `salary_avg` > 1000 order by `salary_avg` desc limit 0,2;
+--------+-------------+
| deptno | salary_avg  |
+--------+-------------+
|     10 | 3483.333333 |
|     20 | 2991.666667 |
+--------+-------------+
2 rows in set (0.00 sec)

```









## mysql 高级操作(多表/联表)
### 笛卡尔集
- 笛卡尔集: select * from 表1,表2 => 会将2表的所有列 进行 全排组合(`m*n 行`)
- 多表查询-过滤条(正确的过滤条件)
- 指定的列: 要带上表名
注意点：
- 多表查询的条件: 不能少于 `表的个数-1`,否则会出现 `笛卡尔集` 
- 如果出现重复的列表,代表n张表都有此列。使用`此列`时, 需要指定具体`表名`:  `表名`.`列名`
```bash
1.显示雇员名、雇员工资以及所在部门的名字(员工表、部门表)
mysql> select distinct `emp`.`empname`,`emp`.`salary`,`dept`.`dname` from `emp`, `dept` where `emp`.`deptno`=`dept`.`deptno`;
+---------+---------+----------+
| empname | salary  | dname    |
+---------+---------+----------+
| smite   |  800.00 | sales    |
| allen   | 1800.00 | sales    |
| ward    | 1250.00 | sales    |
| jones   | 2975.00 | research |
| martin  | 1250.00 | sales    |
| blake   | 2850.00 | sales    |
| clake   | 2450.00 | manager  |
| scott   | 3000.00 | research |
| king    | 5000.00 | manager  |
| turner  | 1500.00 | sales    |
| james   |  950.00 | sales    |
| ford    | 3000.00 | research |
| miller  | 3000.00 | manager  |
+---------+---------+----------+
13 rows in set (0.00 sec)


# 显示 部门号为 10 的部门名、员工和工资.
mysql> select `dept`.`dname`,`emp`.`empname`,`emp`.`salary`,`emp`.`deptno`  from `emp`, `dept` where `emp`.`deptno`=`dept`.`deptno` and `emp`.`deptno`=10;
+---------+---------+---------+--------+
| dname   | empname | salary  | deptno |
+---------+---------+---------+--------+
| manager | clake   | 2450.00 |     10 |
| manager | king    | 5000.00 |     10 |
| manager | miller  | 3000.00 |     10 |
+---------+---------+---------+--------+
3 rows in set (0.00 sec)

# 显示各个员工的姓名、工资和工资级别、
mysql> select `empname`,`salary`,`grade` from `emp`,`salgrade` where `emp`.`salary` between `sal
+---------+---------+-------+
| empname | salary  | grade |
+---------+---------+-------+
| smite   |  800.00 |     1 |
| allen   | 1800.00 |     3 |
| ward    | 1250.00 |     2 |
| jones   | 2975.00 |     4 |
| martin  | 1250.00 |     2 |
| blake   | 2850.00 |     4 |
| clake   | 2450.00 |     4 |
| scott   | 3000.00 |     4 |
| king    | 5000.00 |     5 |
| turner  | 1500.00 |     3 |
| james   |  950.00 |     1 |
| ford    | 3000.00 |     4 |
| miller  | 3000.00 |     4 |
+---------+---------+-------+
13 rows in set (0.00 sec)

mysql> select `empname`,`salary`,`grade` from `emp`,`salgrade` where `emp`.`salary` >= `salgrade`.`losal` and `emp`.`salary` <= `salgrade`.`hisal`;
+---------+---------+-------+
| empname | salary  | grade |
+---------+---------+-------+
| smite   |  800.00 |     1 |
| allen   | 1800.00 |     3 |
| ward    | 1250.00 |     2 |
| jones   | 2975.00 |     4 |
| martin  | 1250.00 |     2 |
| blake   | 2850.00 |     4 |
| clake   | 2450.00 |     4 |
| scott   | 3000.00 |     4 |
| king    | 5000.00 |     5 |
| turner  | 1500.00 |     3 |
| james   |  950.00 |     1 |
| ford    | 3000.00 |     4 |
| miller  | 3000.00 |     4 |
+---------+---------+-------+
13 rows in set (0.00 sec)

# 显示雇员名、雇员工资和所在部门名，按照部门排序[降序]
mysql> select `empname`,`salary`,`dname`,`emp`.`deptno` from `emp`,`dept` where `emp`.`deptno`
= `dept`.`deptno` order by `emp`.`deptno` desc;
+---------+---------+----------+--------+
| empname | salary  | dname    | deptno |
+---------+---------+----------+--------+
| smite   |  800.00 | sales    |     30 |
| allen   | 1800.00 | sales    |     30 |
| ward    | 1250.00 | sales    |     30 |
| martin  | 1250.00 | sales    |     30 |
| blake   | 2850.00 | sales    |     30 |
| turner  | 1500.00 | sales    |     30 |
| james   |  950.00 | sales    |     30 |
| jones   | 2975.00 | research |     20 |
| scott   | 3000.00 | research |     20 |
| ford    | 3000.00 | research |     20 |
| clake   | 2450.00 | manager  |     10 |
| king    | 5000.00 | manager  |     10 |
| miller  | 3000.00 | manager  |     10 |
+---------+---------+----------+--------+
13 rows in set (0.00 sec)

```


### 多表查询-自连接
自连接：在同一张表的连接查询.
特点:
	- 将同一张表看做`2张表`使用
	- 需要给表取别名才能作查询, 形式: 表名 表的别名
	- 使用列的时候, 带上表名, 形式: 表名.列名
	- 列名不明确, 可以指定列的别名, 形式: 列名 as 列的别名
```bash
# 显示公司员工名、和他的上级的名称
# 分析: 员工名在 emp 表, 他的上级的名字也在 emp 表
#       他们的关系通过： emp 表 和 mgr 列 关联的
mysql> select emp_alias1.empname as worker,emp_alias2.empname as manager  from `emp` `emp_alias1`, `emp` `emp_alias2` where emp_alias1.`mgr`=emp_alias2.`empno`;
+--------+---------+
| worker | manager |
+--------+---------+
| jones  | smite   |
| ford   | jones   |
| scott  | jones   |
| james  | blake   |
| turner | blake   |
| ward   | blake   |
| allen  | blake   |
| miller | clake   |
| clake  | king    |
| blake  | king    |
| smite  | ford    |
+--------+---------+
11 rows in set (0.00 sec)


```


### 子查询(嵌套查询)
子查询: 嵌入在其他sql语句中的`select`语句
- 单行子查询: 只返回一行数据的子查询
- 多行子查询: 返回多行数据的子查询, 使用关键字: `in`
- 子查询, 使用 `(子查询...)` 包裹起来、
```sql
# 显示 与smite同一部门的所有员工
#    先查出 smite 所在的部门
mysql> select deptno  from `emp` where empname='smite';
+--------+
| deptno |
+--------+
|     30 |
+--------+
1 row in set (0.00 sec)
#    把上面的查询当成`子查询`,再查这个部门号下的所有员工
mysql> select *  from `emp` where deptno=(select deptno from `emp` where empname='smite');
+----+-------+---------+----------+------+---------------------+---------+---------+--------+
| id | empno | empname | job      | mgr  | hiredate            | salary  | comm    | deptno |
+----+-------+---------+----------+------+---------------------+---------+---------+--------+
|  1 |  7639 | smite   | clerk    | 7902 | 1990-12-17 00:00:00 |  800.00 |    NULL |     30 |
|  2 |  7499 | allen   | salesman | 7698 | 1991-02-20 00:00:00 | 1800.00 |  300.00 |     30 |
|  3 |  7521 | ward    | salesman | 7698 | 1991-02-22 00:00:00 | 1250.00 |  500.00 |     30 |
|  5 |  7654 | martin  | salesman | 7898 | 1991-09-28 00:00:00 | 1250.00 | 1400.00 |     30 |
|  6 |  7698 | blake   | manager  | 7839 | 1991-05-01 00:00:00 | 2850.00 |    NULL |     30 |
| 10 |  7844 | turner  | salesman | 7698 | 1991-09-08 00:00:00 | 1500.00 |    NULL |     30 |
| 11 |  7900 | james   | clerk    | 7698 | 1991-12-03 00:00:00 |  950.00 |    NULL |     30 |
+----+-------+---------+----------+------+---------------------+---------+---------+--------+
7 rows in set (0.00 sec)

# 查询和部门号为10的工作相同的雇员的名字、岗位、工资、部门号，但不包括10号部门自己的雇员
# 	 先查出 10号部门 的工作岗位(要去重)
mysql> select distnct job from emp where deptno=10;
+-----------+
| job       |
+-----------+
| manager   |
| president |
| clerk     |
+-----------+
3 rows in set (0.00 sec)
#    出现多行返回记录时, 使用 in (子查询语句)
mysql> select empname,job,salary,deptno from emp where job in (select distinct job from emp where deptno=10) and deptno != 10;
+---------+---------+---------+--------+
| empname | job     | salary  | deptno |
+---------+---------+---------+--------+
| smite   | clerk   |  800.00 |     30 |
| jones   | manager | 2975.00 |     20 |
| blake   | manager | 2850.00 |     30 |
| james   | clerk   |  950.00 |     30 |
+---------+---------+---------+--------+
4 rows in set (0.00 sec)

mysql> select empname,job,salary,deptno from emp where job in (select distinct job from emp where deptno=10) and deptno <> 10;
+---------+---------+---------+--------+
| empname | job     | salary  | deptno |
+---------+---------+---------+--------+
| smite   | clerk   |  800.00 |     30 |
| jones   | manager | 2975.00 |     20 |
| blake   | manager | 2850.00 |     30 |
| james   | clerk   |  950.00 |     30 |
+---------+---------+---------+--------+
4 rows in set (0.01 sec)

```

#### 临时表
- 子查询 当做`临时表` 使用
- `临时表`可以解决很多复杂的查询问题
```bash
# 查询 ecs_goods 表中各个类别、价格最高的商品(goods_id、cat_id、goods_name、goods_price)
mysql> select goods_id,ecs_goods.cat_id,goods_name,shop_price from `ecs_goods`,(
	select cat_id,max(shop_price) as max_price from ecs_goods group by cat_id
	) temp where ecs_goods.cat_id=temp.cat_id and ecs_goods.shop_price=temp.max_price;

```

#### 多行子查询中使用 `all` 和 `any` 操作符
- all (子查询) => 所有的
- any (子查询) => 任意一个
```bash
# 显示工资比 30号部门所有员工的工资`高的`员工的姓名、工资和部门
mysql> select empname,salary,deptno from emp where salary > all (select salary from emp where
deptno=30);
+---------+---------+--------+
| empname | salary  | deptno |
+---------+---------+--------+
| jones   | 2975.00 |     20 |
| scott   | 3000.00 |     20 |
| king    | 5000.00 |     10 |
| ford    | 3000.00 |     20 |
| miller  | 3000.00 |     10 |
+---------+---------+--------+
5 rows in set (0.00 sec)

mysql> select empname,salary,deptno from emp where salary > (select max(salary) from emp where
 deptno=30);
+---------+---------+--------+
| empname | salary  | deptno |
+---------+---------+--------+
| jones   | 2975.00 |     20 |
| scott   | 3000.00 |     20 |
| king    | 5000.00 |     10 |
| ford    | 3000.00 |     20 |
| miller  | 3000.00 |     10 |
+---------+---------+--------+
5 rows in set (0.00 sec)

# 显示工资比30号部门的其中一个员工的工资高的员工的姓名、工资、部门号
mysql> select empname,salary,deptno from emp where salary > any (select salary from emp where
deptno=30);
+---------+---------+--------+
| empname | salary  | deptno |
+---------+---------+--------+
| allen   | 1800.00 |     30 |
| ward    | 1250.00 |     30 |
| jones   | 2975.00 |     20 |
| martin  | 1250.00 |     30 |
| blake   | 2850.00 |     30 |
| clake   | 2450.00 |     10 |
| scott   | 3000.00 |     20 |
| king    | 5000.00 |     10 |
| turner  | 1500.00 |     30 |
| james   |  950.00 |     30 |
| ford    | 3000.00 |     20 |
| miller  | 3000.00 |     10 |
+---------+---------+--------+
12 rows in set (0.00 sec)

mysql> select empname,salary,deptno from emp where salary > (select min(salary) from emp where
 deptno=30);
+---------+---------+--------+
| empname | salary  | deptno |
+---------+---------+--------+
| allen   | 1800.00 |     30 |
| ward    | 1250.00 |     30 |
| jones   | 2975.00 |     20 |
| martin  | 1250.00 |     30 |
| blake   | 2850.00 |     30 |
| clake   | 2450.00 |     10 |
| scott   | 3000.00 |     20 |
| king    | 5000.00 |     10 |
| turner  | 1500.00 |     30 |
| james   |  950.00 |     30 |
| ford    | 3000.00 |     20 |
| miller  | 3000.00 |     10 |
+---------+---------+--------+
12 rows in set (0.00 sec)

```

#### 多列子查询
多列子查询: 查询返回多列数据的子查询
```bash
# 查询与 smite 相同部门和岗位的所有雇员(不包括 smite 本人)
#    (deptno,job) = (子查询结果的列相同) =》 deptno=结果1, job=结果2
mysql> select * from emp where (deptno,job) = (select deptno,job from emp where empname='smite') and empname != 'smite';
+----+-------+---------+-------+------+---------------------+--------+------+--------+
| id | empno | empname | job   | mgr  | hiredate            | salary | comm | deptno |
+----+-------+---------+-------+------+---------------------+--------+------+--------+
| 11 |  7900 | james   | clerk | 7698 | 1991-12-03 00:00:00 | 950.00 | NULL |     30 |
+----+-------+---------+-------+------+---------------------+--------+------+--------+
1 row in set (0.00 sec)

```

#### 子查询练习
```bash
# 1.查找 每个部门工资高于 本部门平均工资的员工
mysql> select `id`,`empno`,`empname`,`salary`,emp.deptno,avg_salary from emp,(select deptno, avg(salary) as avg_salary from
emp group by `deptno`) temp where emp.deptno=temp.deptno and emp.salary > avg_salary;
+----+-------+---------+---------+--------+-------------+
| id | empno | empname | salary  | deptno | avg_salary  |
+----+-------+---------+---------+--------+-------------+
|  2 |  7499 | allen   | 1800.00 |     30 | 1485.714286 |
|  6 |  7698 | blake   | 2850.00 |     30 | 1485.714286 |
|  8 |  7788 | scott   | 3000.00 |     20 | 2991.666667 |
|  9 |  7839 | king    | 5000.00 |     10 | 3483.333333 |
| 10 |  7844 | turner  | 1500.00 |     30 | 1485.714286 |
| 12 |  7902 | ford    | 3000.00 |     20 | 2991.666667 |
+----+-------+---------+---------+--------+-------------+
6 rows in set (0.00 sec)

# 2.查找每个部门工资最高的员工
mysql> select id,empno,empname,salary,emp.deptno,max_salary from emp,(select deptno,max(salary) max_salary from emp group by
 deptno) temp  where emp.deptno=temp.deptno and emp.salary=temp.max_salary;
+----+-------+---------+---------+--------+------------+
| id | empno | empname | salary  | deptno | max_salary |
+----+-------+---------+---------+--------+------------+
|  6 |  7698 | blake   | 2850.00 |     30 |    2850.00 |
|  8 |  7788 | scott   | 3000.00 |     20 |    3000.00 |
|  9 |  7839 | king    | 5000.00 |     10 |    5000.00 |
| 12 |  7902 | ford    | 3000.00 |     20 |    3000.00 |
+----+-------+---------+---------+--------+------------+
4 rows in set (0.00 sec)

# 3.查询每个部门的信息(部门名、编号、地址和人员数量)
mysql> select dept.deptno,dname,loc,nums from dept,(select deptno,count(*) as nums from emp group by deptno) temp where dept.deptno=temp.deptno;
+--------+----------+-----------+------+
| deptno | dname    | loc       | nums |
+--------+----------+-----------+------+
|     10 | manager  | beijing   |    3 |
|     20 | research | shanghei  |    3 |
|     30 | sales    | guangzhou |    7 |
+--------+----------+-----------+------+
3 rows in set (0.00 sec)

mysql> select dept.deptno,dname,loc,nums,names from dept,(select deptno,count(*) as nums,group_concat(`empname`) as names fr
om emp group by deptno) temp where dept.deptno=temp.deptno;
+--------+----------+-----------+------+--------------------------------------------+
| deptno | dname    | loc       | nums | names                                      |
+--------+----------+-----------+------+--------------------------------------------+
|     10 | manager  | beijing   |    3 | clake,king,miller                          |
|     20 | research | shanghei  |    3 | jones,scott,ford                           |
|     30 | sales    | guangzhou |    7 | smite,allen,ward,martin,blake,turner,james |
+--------+----------+-----------+------+--------------------------------------------+
3 rows in set (0.00 sec)
```


#### 表复制(自我复制)
有时,为了对某些sql语句进行效率测试,我们需要将海量数据时，可以使用表复制来创建海量数据
- 复制表结构: `create table `新表名` like `旧表`;`
- 自我复制: 指数复制
- 去重操作: distinct
```bash
- 复制表结构: `create table `新表名` like `旧表`;`
- 自我复制: 指数复制
- 去重操作: distinct
mysql> create table if not exists `emp_copy` like emp;
Query OK, 0 rows affected (0.08 sec)

mysql> desc emp_copy;
+----------+--------------------+------+-----+-------------------+-------------------+
| Field    | Type               | Null | Key | Default           | Extra             |
+----------+--------------------+------+-----+-------------------+-------------------+
| id       | int                | NO   | PRI | NULL              | auto_increment    |
| empno    | mediumint unsigned | NO   | PRI | 0                 |                   |
| empname  | varchar(20)        | NO   |     |                   |                   |
| job      | varchar(9)         | NO   |     |                   |                   |
| mgr      | mediumint unsigned | YES  |     | NULL              |                   |
| hiredate | timestamp          | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| salary   | decimal(7,2)       | NO   |     | NULL              |                   |
| comm     | decimal(7,2)       | YES  |     | NULL              |                   |
| deptno   | mediumint unsigned | NO   |     | 0                 |                   |
+----------+--------------------+------+-----+-------------------+-------------------+
9 rows in set (0.01 sec)

mysql> select * from emp_copy;
Empty set (0.00 sec)

mysql> insert into `emp_copy` select * from emp;
Query OK, 13 rows affected (0.01 sec)
Records: 13  Duplicates: 0  Warnings: 0

mysql> select empno, empname, job, mgr,deptno from emp_copy;
+-------+---------+-----------+------+--------+
| empno | empname | job       | mgr  | deptno |
+-------+---------+-----------+------+--------+
|  7639 | smite   | clerk     | 7902 |     30 |
|  7499 | allen   | salesman  | 7698 |     30 |
|  7521 | ward    | salesman  | 7698 |     30 |
|  7566 | jones   | manager   | 7639 |     20 |
|  7654 | martin  | salesman  | 7898 |     30 |
|  7698 | blake   | manager   | 7839 |     30 |
|  7782 | clake   | manager   | 7839 |     10 |
|  7788 | scott   | analyst   | 7566 |     20 |
|  7839 | king    | president | NULL |     10 |
|  7844 | turner  | salesman  | 7698 |     30 |
|  7900 | james   | clerk     | 7698 |     30 |
|  7902 | ford    | analyst   | 7566 |     20 |
|  7934 | miller  | clerk     | 7782 |     10 |
+-------+---------+-----------+------+--------+
13 rows in set (0.00 sec)

# 自我复制,插入查找自身表的记录, 先保证 表不受主键、外键约束
mysql> alter table `emp_copy` modify id int, modify empno mediumint;
Query OK, 13 rows affected (0.07 sec)
Records: 13  Duplicates: 0  Warnings: 0

mysql> alter table `emp_copy` drop primary key;
Query OK, 13 rows affected (0.04 sec)
Records: 13  Duplicates: 0  Warnings: 0

mysql> insert into emp_copy select * from emp_copy;
Query OK, 13 rows affected (0.01 sec)
Records: 13  Duplicates: 0  Warnings: 0

mysql> insert into emp_copy select * from emp_copy;
Query OK, 26 rows affected (0.01 sec)
Records: 26  Duplicates: 0  Warnings: 0

mysql> insert into emp_copy select * from emp_copy;
Query OK, 52 rows affected (0.00 sec)
Records: 52  Duplicates: 0  Warnings: 0

mysql> insert into emp_copy select * from emp_copy;
Query OK, 104 rows affected (0.01 sec)
Records: 104  Duplicates: 0  Warnings: 0

# 去重: distinct
#    去重思路: 创建一张相同结果的临时表 new_01, 把 旧表的记录 通过 distinct 过滤后 写入新表 new_01
		 		再将 new_01 改名即可得到去重后的新表
```


#### 合并查询(union)
为了合并多个 `select` 语句的结果，union
将多个查询结果简单合并,不会去重：select1... union all select2...
将多个查询结果合并,会自动去重：select1... union select2...


#### 表外连接(left join)
左外连接: 左侧的表完全显示(可以替代 右外连接,只需要调换 表的次序 即可)
	- 基本语法: select ... from 左表 left join 右表 on 条件...
	- 左连接,`左表`记录全部显示,`右表`如果匹配不上则显示为 `NULL`
右外连接: 右侧的表完全显示
	- 基本语法: select ... from 左表 right join 右表 on 条件...
	- 右连接,`右表`记录全部显示,`左表`如果匹配不上则显示为 `NULL`
```bash
# 学生表、成绩表
mysql> create table if not exists `stu`(id int, name varchar(20));
Query OK, 0 rows affected (0.02 sec)

mysql> insert into stu values (1,'Jack'),(2,'Tom'),(3,'Kity'),(4,'nono');
Query OK, 4 rows affected (0.00 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> create table if not exists `exam`(id int, grade int);
Query OK, 0 rows affected (0.02 sec)

mysql> insert into `exam` values (1,56),(2,76),(11,8);
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> select * from stu;
+------+------+
| id   | name |
+------+------+
|    1 | Jack |
|    2 | Tom  |
|    3 | Kity |
|    4 | nono |
+------+------+
4 rows in set (0.00 sec)

mysql> select * from exam;
+------+-------+
| id   | grade |
+------+-------+
|    1 |    56 |
|    2 |    76 |
|   11 |     8 |
+------+-------+
3 rows in set (0.00 sec)

# 查询所有人的成绩,如果没有成绩，则显示为NULL。
mysql> select stu.id,name,grade from stu left join exam on stu.id=exam.id;
+------+------+-------+
| id   | name | grade |
+------+------+-------+
|    1 | Jack |    56 |
|    2 | Tom  |    76 |
|    3 | Kity |  NULL |
|    4 | nono |  NULL |
+------+------+-------+
4 rows in set (0.00 sec)

# 显示所有的成绩,如果没有名字匹配,则显示为空
mysql> select exam.id,grade,name from stu right join exam on stu.id=exam.id;
+------+-------+------+
| id   | grade | name |
+------+-------+------+
|    1 |    56 | Jack |
|    2 |    76 | Tom  |
|   11 |     8 | NULL |
+------+-------+------+
3 rows in set (0.00 sec)


# 列出部门名称和这些部门的员工信息(名字和工作), 以及没有员工的部门
mysql> select dept.deptno,dname,empname,job from dept left join emp on dept.deptno=emp.deptno;
+--------+------------+---------+-----------+
| deptno | dname      | empname | job       |
+--------+------------+---------+-----------+
|     10 | manager    | miller  | clerk     |
|     10 | manager    | king    | president |
|     10 | manager    | clake   | manager   |
|     20 | research   | ford    | analyst   |
|     20 | research   | scott   | analyst   |
|     20 | research   | jones   | manager   |
|     30 | sales      | james   | clerk     |
|     30 | sales      | turner  | salesman  |
|     30 | sales      | blake   | manager   |
|     30 | sales      | martin  | salesman  |
|     30 | sales      | ward    | salesman  |
|     30 | sales      | allen   | salesman  |
|     30 | sales      | smite   | clerk     |
|     40 | operations | NULL    | NULL      |
+--------+------------+---------+-----------+
14 rows in set (0.00 sec)

mysql> select dept.deptno,dname,empname,job from emp right join dept on dept.deptno=emp.deptno;
+--------+------------+---------+-----------+
| deptno | dname      | empname | job       |
+--------+------------+---------+-----------+
|     10 | manager    | miller  | clerk     |
|     10 | manager    | king    | president |
|     10 | manager    | clake   | manager   |
|     20 | research   | ford    | analyst   |
|     20 | research   | scott   | analyst   |
|     20 | research   | jones   | manager   |
|     30 | sales      | james   | clerk     |
|     30 | sales      | turner  | salesman  |
|     30 | sales      | blake   | manager   |
|     30 | sales      | martin  | salesman  |
|     30 | sales      | ward    | salesman  |
|     30 | sales      | allen   | salesman  |
|     30 | sales      | smite   | clerk     |
|     40 | operations | NULL    | NULL      |
+--------+------------+---------+-----------+
14 rows in set (0.00 sec)

```






## mysql约束
约束: 用于确保数据库的数据 满足特定的商业规则规范
#### 主键：primary key
- 主键列的值`不能重复`，而且`不能为空`
- 一张表只能有一个`主键`,但可以是`复合主键`
- 主键的指定方式有2种
	+ 直接在字段后指定: 字段名 primary key
	+ 在表的最后写: primary key(列名1,列名2)
- 使用desc 表名.可以看到 primary key 的情况
- 实际开发中，`每一张表`往往都会设计`一个主键`。 
```bash
# 创建表-设置主键
mysql> create table if not exists t06(id int primary key,`name` varchar(20),email varchar(32)) engine innodb character set utf8mb4 collate utf8mb4_general_ci;
Query OK, 0 rows affected (0.03 sec)

mysql> desc t06;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | NO   | PRI | NULL    |       |
| name  | varchar(20) | YES  |     | NULL    |       |
| email | varchar(32) | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
3 rows in set (0.00 sec)

# 主键列的值不能重复，而且不能为空
mysql> insert into t06 values(1,'jack','jack@163.com'),(2,'tom','tom@163.com');
mysql> select * from t06;
+----+------+--------------+
| id | name | email        |
+----+------+--------------+
|  1 | jack | jack@163.com |
|  2 | tom  | tom@163.com  |
+----+------+--------------+
2 rows in set (0.00 sec)

mysql> insert into t06 values(1,'jack','jack@163.com');
ERROR 1062 (23000): Duplicate entry '1' for key 't06.PRIMARY'

mysql> insert into t06 values(NULL,'jack','jack@163.com');
ERROR 1048 (23000): Column 'id' cannot be null

# 一张表只能有一个主键、但可以是复合主键
mysql> create table if not exists t07(id int primary key,`name` varchar(20) primary key,email varchar(32)) 
ERROR 1068 (42000): Multiple primary key defined

mysql> create table if not exists t07(id int,`name` varchar(20),email varchar(32),primary key(`id`,`name`,`email`)) engine innodb character set utf8mb4 collate utf8mb4_general_ci;
Query OK, 0 rows affected (0.04 sec)

mysql> desc t07;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | NO   | PRI | NULL    |       |
| name  | varchar(20) | NO   | PRI | NULL    |       |
| email | varchar(32) | NO   | PRI | NULL    |       |
+-------+-------------+------+-----+---------+-------+
3 rows in set (0.01 sec)

```


#### 非空：not null
不能插入空值,必须提供数据。


#### 唯一：unique
当定义了唯一约束后, 该列的值是不能重复的
- 没有设置 not null 时，`NULL`可以插入成功的,而且可以重复插入多个 `NULL`
- 如果一个列(字段), 设置 unique not null => 效率类似 primary key
- 一张表 可以有 多个 unique 约束
```bash
mysql> create table if not exists t07 like t06;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> alter table t07 drop primary key;
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> alter table t07 modify `id` int unique;
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> desc t07;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | YES  | UNI | NULL    |       |
| name  | varchar(20) | NO   |     | NULL    |       |
| email | varchar(32) | NO   |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
3 rows in set (0.01 sec)

mysql> insert into t07 values(NULL,'jack','jack@163.com');
Query OK, 1 row affected (0.00 sec)

mysql> insert into t07 values(1,'jack','jack@163.com');
Query OK, 1 row affected (0.01 sec)

mysql> insert into t07 values(2,'jack','jack@163.com');
Query OK, 1 row affected (0.01 sec)

mysql> select * from t07;
+------+------+--------------+
| id   | name | email        |
+------+------+--------------+
| NULL | jack | jack@163.com |
|    1 | jack | jack@163.com |
|    2 | jack | jack@163.com |
+------+------+--------------+
3 rows in set (0.00 sec)

# 再次插入 '2' 号记录,报错
mysql> insert into t07 values(2,'jack','jack@163.com');
ERROR 1062 (23000): Duplicate entry '2' for key 't07.id'

```


#### 外键：foreign key (从表-外键列) references 主表(主表-主键列/unique列)
用于定义 主表 和 从表 之间的关系。
- `外键约束` 要定义在 `从表` 上
- 主表则必须具有: `主键约束` 或 `unique约束`
- 外键关系确定后, 外键列的数据必须在 `主表` 的主键/unique列存在 或 `为null`
- 当存在外键关系时,如果想要删除`主表`,要先删除`从表`先。否则报错: 'ERROR 3730 (HY000): Cannot drop table 'my_class' referenced by a foreign key constraint 'my_stu_ibfk_1' on table 'my_stu'.
- 同理,删除主键记录时,如果存在从表的`外键约束`, 也会报错。需要 `关闭外键约束`、删除记录后再 开启 `外键约束`
'
```bash
# 先建 主表
mysql> create table if not exists `my_class`(id int primary key,`name` varchar(32) not null default '') engine innodb character set utf8 collate utf8_general_ci;
Query OK, 0 rows affected, 3 warnings (0.01 sec)

mysql> desc my_class;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | NO   | PRI | NULL    |       |
| name  | varchar(32) | NO   |     |         |       |
+-------+-------------+------+-----+---------+-------+
2 rows in set (0.00 sec)

# 从表、外键是: class_id
mysql> create table if not exists `my_stu`(id int primary key,`name` varchar(32) not null default '', class_id int,foreign key (`class_id`) references `my_class`(`id`)) engine innodb character set utf8mb4 collate utf8mb4_general_ci;
Query OK, 0 rows affected (0.05 sec)

mysql> desc my_stu;
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| id       | int         | NO   | PRI | NULL    |       |
| name     | varchar(32) | NO   |     |         |       |
| class_id | int         | YES  | MUL | NULL    |       |
+----------+-------------+------+-----+---------+-------+
3 rows in set (0.01 sec)

mysql> insert into `my_class` values(100,'java'),(200,'javascript');
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from my_class;
+-----+------------+
| id  | name       |
+-----+------------+
| 100 | java       |
| 200 | javascript |
+-----+------------+
2 rows in set (0.00 sec)

mysql> insert into my_stu values(1,'tom',100),(2,'jack',200);
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from my_stu;
+----+------+----------+
| id | name | class_id |
+----+------+----------+
|  1 | tom  |      100 |
|  2 | jack |      200 |
+----+------+----------+
2 rows in set (0.00 sec)

# 插入 my_class 不存在的 class_id 号,会插入失败
mysql> insert into my_stu values(3,'xiaiming',300);
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`xyz`.`my_stu`, CONSTRAINT `my_stu_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `my_class` (`id`))

# foreign key (从表-外键列) references 主表(关联主键列)
```


#### 约束-练习案例
```bash
# 需求:
# 现有一个商店的数据库: shop_db, 记录 客户及器购物情况, 由下面三个表组成:
#   商品表`goods`
#			- 商品号 goods_id  商品名 goods_name  单价 unitprice  商品类别 category  供应商 provide
#   客户表`customer`
#		  - 客户号 customer_id  姓名 name  住址 address  电邮 email  性别 sex  身份证 card_id
#   购物记录表`perchase`
#			- 购没订单号 order_id  客户号 customer_id  商品号 goods_id  购买数量 nums
# 要求:
#   1.每个表的主、外键
#   2.客户的姓名不能为空值
#   3.电邮不能重复
#   4.客户的性别：[男|女], 枚举
#   5.单价: unitprice 1.0~9999.99, check

# 主表-商品表
mysql> create table if not exists `goods`(
	`goods_id` int primary key,
	`goods_name` varchar(64) not null default '',
	`unitprice` decimal(10,2) not null default 0 check (unitprice >= 1.0 and unitprice <= 9999.99),
	`category` int not null default 0,
	`provide` varchar(64) not null default ''
) engine innodb character set utf8mb4 collate utf8mb4_general_ci;

# 客户表
mysql> create table if not exists `customer`(
	`customer_id` int primary key,
	`name` varchar(64) not null default '',
	`address` varchar(64) not null default '',
	`email` varchar(64) not null default '',
	`sex` enum('男','女') not null,
	`card_id` char(18)
) engine innodb character set utf8mb4 collate utf8mb4_general_ci;

# 购物记录表(从表)
mysql> create table if not exists `perchase`(
	`order_id` int unsigned primary key,
	`customer_id` int not null,
	`goods_id` int not null,
	`nums` int not null default 0,
	foreign key (`customer_id`) references `customer`(`customer_id`),
	foreign key (`goods_id`) references `goods`(`goods_id`)
) engine innodb character set utf8mb4 collate utf8mb4_general_ci;

mysql> desc perchase;
+-------------+--------------+------+-----+---------+-------+
| Field       | Type         | Null | Key | Default | Extra |
+-------------+--------------+------+-----+---------+-------+
| order_id    | int unsigned | NO   | PRI | NULL    |       |
| customer_id | int          | NO   | MUL | NULL    |       |
| goods_id    | int          | NO   | MUL | NULL    |       |
| nums        | int          | NO   |     | 0       |       |
+-------------+--------------+------+-----+---------+-------+
4 rows in set (0.00 sec)

mysql> desc goods;
+------------+---------------+------+-----+---------+-------+
| Field      | Type          | Null | Key | Default | Extra |
+------------+---------------+------+-----+---------+-------+
| goods_id   | int           | NO   | PRI | NULL    |       |
| goods_name | varchar(64)   | NO   |     |         |       |
| unitprice  | decimal(10,2) | NO   |     | 0.00    |       |
| category   | int           | NO   |     | 0       |       |
| provide    | varchar(64)   | NO   |     |         |       |
+------------+---------------+------+-----+---------+-------+
5 rows in set (0.01 sec)

mysql> desc customer;
+-------------+-------------------+------+-----+---------+-------+
| Field       | Type              | Null | Key | Default | Extra |
+-------------+-------------------+------+-----+---------+-------+
| customer_id | int               | NO   | PRI | NULL    |       |
| name        | varchar(64)       | NO   |     |         |       |
| address     | varchar(64)       | NO   |     |         |       |
| email       | varchar(64)       | NO   |     |         |       |
| sex         | enum('男','女')   | NO   |     | NULL    |       |
| card_id     | char(18)          | YES  |     | NULL    |       |
+-------------+-------------------+------+-----+---------+-------+
6 rows in set (0.01 sec)


```



#### 自增长
从 1开始, 每次插入一条记录都会 `自动加一`
- auto_increment
- 设置自增长列后，插入数据的3种形式:
	+ insert into (字段1,字段2...) values (NULL, 值2...),(NULL， 值2...)
	+ insert into (字段2...) values (值2...),(值2...)
	+ insert into values (NULL, 值2...),(NULL， 值2...)
- `自增长`一般配合`primay key` 或 `unique`一起使用
- 手动修改表的自增长起始行位置: `alter table 表名 auto_increment=?`, 默认从 1 开始的
```bash
mysql> create table t08(
    -> `id` int primary key auto_increment,
    -> `email` varchar(32) not null default '',
    -> `name` varchar(32) not null default ''
    -> ) engine innodb character set utf8 collate utf8_general_ci;
Query OK, 0 rows affected, 2 warnings (0.03 sec)

mysql> desc t08
    -> ;
+-------+-------------+------+-----+---------+----------------+
| Field | Type        | Null | Key | Default | Extra          |
+-------+-------------+------+-----+---------+----------------+
| id    | int         | NO   | PRI | NULL    | auto_increment |
| email | varchar(32) | NO   |     |         |                |
| name  | varchar(32) | NO   |     |         |                |
+-------+-------------+------+-----+---------+----------------+
3 rows in set (0.01 sec)

mysql> insert into t08 values(null,'xiaominglin@gmail.com','xiaominglin'),(null,'12345@qq.com','tom'),(NULL,'usmag@qq.com','测试');
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> select * from t08;
+----+-----------------------+-------------+
| id | email                 | name        |
+----+-----------------------+-------------+
|  1 | xiaominglin@gmail.com | xiaominglin |
|  2 | 12345@qq.com          | tom         |
|  3 | usmag@qq.com          | 测试        |
+----+-----------------------+-------------+
3 rows in set (0.00 sec)

```



#### 索引和索引优化
引是一个排序的列表，在这个列表中存储着索引的值和包含这个值的数据所在行的物理地址，在数据十分庞大的时候，索引可以大大加快查询的速度，这是因为使用索引后可以不用扫描全表来定位某行的数据，而是先通过索引表找到该行数据对应的物理地址然后访问相应的数据。
> 表:超过百万行时,不做索引优化的情况下平均简单查询时间要:`1s-5s`
- 1.主键索引
- 2.唯一索引(unique)
- 3.普通索引(index)
- 4.全文索引
```bash
# 新增索引后,会增加表文件的内存。=> 空间换时间
create index table_name_index_name on 表名(列名)

# 使用 alter ... add 的方式添加索引
alter table 表名 add index 所引名 (列名);

# 创建表结构时,指定索引
create table 表名(
	`id` int primary key,
	username varchar(32) not null default '',
	index 索引名 (列名)
)

CREATE TABLE mytable(  
    ID INT NOT NULL,   
    username VARCHAR(16) NOT NULL,  
    INDEX [indexName] (username(length))  
);
```
注意:
> 1.创建索引后,`只对` 创建了 `索引` 的列有效。
> 2.创建一个索引, 并不能解决所有问题、
> 3.主动删除索引列, 可以清除索引的查询加速结果, 但是.ibd文件的磁盘占用空间消耗不会降低的。
```bash
# 对于一张 2,000,000 行记录的简单结构的表(自复制的方式可以快速生成测试数据)
# 查询条件带 有索引的列 查询的速度基本是最快的
# 如果查询条件 没有包含  索引的列  查询速度将降低 1000+ 倍.
# 添加索引的影响: 查询速度提升 1000+ 倍, 每加多一列索引,内存占用将平均增大 1/3 倍
mysql> select * from tmp where id=2621380;
+---------+-------------+-----+
| id      | name        | age |
+---------+-------------+-----+
| 2621380 | xiaominglin |   3 |
+---------+-------------+-----+
1 row in set (0.00 sec)

mysql> select * from tmp where name="xiaominglin";
+---------+-------------+-----+
| id      | name        | age |
+---------+-------------+-----+
| 2621380 | xiaominglin |   3 |
+---------+-------------+-----+
1 row in set (0.75 sec)

mysql> select count(*) from tmp;
+----------+
| count(*) |
+----------+
|  2359296 |
+----------+
1 row in set (0.08 sec)

# 新添加 name 列的索引,时间花费 11.7s 
mysql> create index index_name on tmp(`name`);
Query OK, 0 rows affected (11.73 sec)
Records: 0  Duplicates: 0  Warnings: 0

# 内存占用对比: 80m -> 120m -> 150m
-rw-r----- 1 systemd-coredump systemd-coredump 83886080 7月   8 09:57 tmp.ibd
-rw-r----- 1 systemd-coredump systemd-coredump 125829120 7月   9 09:02 tmp.ibd

mysql> select * from tmp where name="xiaominglin";
+---------+-------------+-----+
| id      | name        | age |
+---------+-------------+-----+
| 2621380 | xiaominglin |   3 |
+---------+-------------+-----+
1 row in set (0.00 sec)
```



#### 创建索引、删除索引、索引机制
1.创建索引
将列的现有数据值生成一个 二叉树 数据结构
```bash
mysql> create index index_name on tmp(`name`);
Query OK, 0 rows affected (11.73 sec)
Records: 0  Duplicates: 0  Warnings: 0
```
2.删除索引
```bash
mysql> drop index index_name on tmp;
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

3.索引机制
mysql索引的原理: 使用了数据结构 -> B+树
+ 1.没有索引时, 执行:`select * from tmp where id=9;`语句
	- 因为将进行`全表扫描`:
	- 逐一从 `id=1` 第一行开始进行对比,到了 `id=9`后 `依然`会继续`往下扫描`,`直到`扫描到全表记录的最后一条。
	- 因为`找到一条`后,它不能确定后面的记录是否还有 `id=9` 的结果,仍然要往下继续找。
	- 所有它会继续扫完全表才返回结果。
+ 2.索引查询: 二叉树查找
```bash
							5
		----------+----------
		2                   7
  --+--              ---+---
  1    3             6     8
       +--                 +--
         4                   9

如果一共有9条记录,要查 id=8的记录。
在创建索引时, 会以 1+2+...+9/10 = 5 中间数做头节点
大于 5 的数都会在 右边,小于5 的数都在左边。
那么要找到 8 的记录数, 只需要往下找 2次就能找到。所以查询速度极大提示
查询30次,可以覆盖的记录范围: 1~2^30
```
以上的小结:
```bash
1.没有索引外什么会慢？ 因为全表扫描
2.使用索引为什么快？ 因为建立索引,会形成一个索引的数据结构 比如二叉树(B树、B+树)
```
+ 3.索引的代价
	- 磁盘占用空间变大(创建索引记录需要消耗磁盘空间)
	- 对  update语句、delete语句、insert语句 的效率影响
		+ 比如: 删除的操作 => 索引要会重新维护
		+ 增、删、改的操作 会对索引进行维护
		+ 实际业务开发: select 操作占 90%, [update、delete、insert] 操作占 10%.



#### mysql索引类型
- 1.主键索引, 主键字段的为主索引
	+ `primay key` 是 主键,也是 索引。只要加上来,查询速度是非常快的
- 2.唯一索引(unique)
	+ `unique` 不能重复、唯一性, 也是 索引。
- 3.普通索引(index)
	+ `index` 普通索引,既要提示查询速度、又可以重复. mysql常用 index 来做业务索引
- 4.全文索引(fulltext)
	+ 适用于 `engine=myisam` 存储引擎
	+ 一般开发不会使用 mysql 自带的全文索引。因为效率很低.
	+ 开发中考虑使用的解决方案: Solr(全文搜索)、ElasticSeach(ES)
- 索引常用操作: 添加、删除、查询
```bash
mysql> create table if not exists `t09`(
    -> `id` int,
    -> `name` varchar(32) not null default '') 
    -> engine innodb character set utf8 collate utf8_general_ci;
Query OK, 0 rows affected, 2 warnings (0.04 sec)

# 1.查询表有哪些索引
mysql> show indexes from t09;
Empty set (0.01 sec)


# 2.1.创建唯一索引
mysql> create unique index index_unique_id on t09 (`id`);
Query OK, 0 rows affected (0.01 sec)
Records: 0  Duplicates: 0  Warnings: 0

# 2.2.创建普通索引的方式1
mysql> create index index_id on t09 (`name`);
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

# 2.3.添加普通索引的方式2
mysql> alter table t09 add index index_name (`name`);
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

# 2.4.唯一索引和普通索引: 如果列的数据不会重复,就优先使用`unique`唯一索引,否则使用 普通索引.

# 2.5.添加主键索引
mysql> alter table t09 add primary key (`id`);

# 3.1.查看表的索引情况方式一: show indexes from [表名].
mysql> show index from t09;
+-------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table | Non_unique | Key_name        | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+-------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| t09   |          0 | PRIMARY         |            1 | id          | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| t09   |          0 | index_unique_id |            1 | id          | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| t09   |          1 | index_name      |            1 | name        | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+-------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
3 rows in set (0.01 sec)

# 3.2.查看表索引方式二: show indexes from [表名]
mysql> show indexes from t09;
+-------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table | Non_unique | Key_name        | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+-------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| t09   |          0 | PRIMARY         |            1 | id          | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| t09   |          0 | index_unique_id |            1 | id          | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| t09   |          1 | index_name      |            1 | name        | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+-------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
3 rows in set (0.01 sec)

# 3.3.查看表索引方式三: show keys from [表名]
mysql> show keys from t09;
+-------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table | Non_unique | Key_name        | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+-------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| t09   |          0 | PRIMARY         |            1 | id          | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| t09   |          0 | index_unique_id |            1 | id          | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| t09   |          1 | index_name      |            1 | name        | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+-------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
3 rows in set (0.01 sec)

# 4.1.删除普通或唯一索引： drop index [索引名] on [表名];
mysql> drop index index_id on t09;
Query OK, 0 rows affected (0.01 sec)
Records: 0  Duplicates: 0  Warnings: 0

# 4.2.删除主键索引: alter table [表名] drop primay key;
mysql> alter table t09 drop primary key;
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

索引操作-练习:
```bash
# 1. 2种方式主键索引: 创建订单表 order(id, 商品名,订阅人,数量)
mysql> create table if not exists `order_1`( `id` int  primary key auto_increment, `goods_name` varchar(64) not null default '', `buyer_id` int not null, `nums` int not null) engine innodb character set utf8 collate utf8_general_ci;
Query OK, 0 rows affected, 2 warnings (0.03 sec)

mysql> show index from order_1;
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| order_1 |          0 | PRIMARY  |            1 | id          | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
1 row in set (0.00 sec)

mysql> create table if not exists `order_2`( `id` int, `goods_name` varchar(64) not null default '', `buyer_id` int not null, `nums`
 int not null) engine innodb character set utf8 collate utf8_general_ci;
Query OK, 0 rows affected, 2 warnings (0.02 sec)

mysql> alter table order_2 add primary key (`id`);
Query OK, 0 rows affected (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> show keys from order_2;
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table   | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| order_2 |          0 | PRIMARY  |            1 | id          | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+---------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
1 row in set (0.00 sec)

# 2. 创建一张特价菜单表 menu(id,菜单名,厨师,点餐人身份证,价格)。
# 要求: id为主键、点餐人身份证唯一不重复、用2种方式来创建
mysql> create table if not exists `menu_1`(
    -> `id` int auto_increment,
    -> `menu_name` varchar(24) not null default '',
    -> `cooker` varchar(32) not null default '',
    -> `subscrible_id` char(18) unique not null,
    -> primary key (`id`)) engine innodb character set utf8 collate utf8_general_ci;
Query OK, 0 rows affected, 2 warnings (0.04 sec)

mysql> show index from menu_1;
+--------+------------+---------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table  | Non_unique | Key_name      | Seq_in_index | Column_name   | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+--------+------------+---------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| menu_1 |          0 | PRIMARY       |            1 | id            | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| menu_1 |          0 | subscrible_id |            1 | subscrible_id | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+--------+------------+---------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
2 rows in set (0.01 sec)

mysql> create table if not exists `menu_2`(
    -> `id` int auto_increment,
    -> `menu_name` varchar(24) not null default '',
    -> `cooker` varchar(32) not null default '',
    -> `subscrible_id` char(18) not null,
    -> primary key (`id`)) engine innodb character set utf8 collate utf8_general_ci;
Query OK, 0 rows affected, 2 warnings (0.04 sec)

mysql> create unique index index_subscrible_id on `menu_2` (`subscrible_id`);
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> show keys from menu_2;
+--------+------------+---------------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table  | Non_unique | Key_name            | Seq_in_index | Column_name   | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+--------+------------+---------------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| menu_2 |          0 | PRIMARY             |            1 | id            | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| menu_2 |          0 | index_subscrible_id |            1 | subscrible_id | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+--------+------------+---------------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
2 rows in set (0.00 sec)

mysql> drop index index_subscrible_id on menu_2;
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> alter table menu_2 add unique index (`subscrible_id`);
Query OK, 0 rows affected (0.01 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> show indexes from menu_2;
+--------+------------+---------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table  | Non_unique | Key_name      | Seq_in_index | Column_name   | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+--------+------------+---------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| menu_2 |          0 | PRIMARY       |            1 | id            | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| menu_2 |          0 | subscrible_id |            1 | subscrible_id | A         |           0 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+--------+------------+---------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
2 rows in set (0.00 sec)

```


#### `哪些列` 上适合使用 `索引`
1.`较频繁的作为查询条件字段` => 适合创建索引
exp: `select * from emp where empno=1` => empno 适合创建索引

2.`唯一性太差的字段` 不适合 `单独创建索引`, 即使 `频繁的作为查询条件`
exp: `select * from emp where sex='男'` =? sex 就不适合创建索引啦

3.`更新非常频繁的字段` 不适合 `创建索引`, 意义不大,会频繁进行索引维护
exp: `select * from emp where logincount=2;` =? logincount 登录次数

4.不会出现在 `where字句的字段`  不应该 `创建索引`, 这就毫无意义.








## mysql事务(transaction)
1. 什么是数据
`事务`用于保证数据的`一致性`， 它由 一组相关的`dml`语句 组成, 要么一起操作成功、要么一起操作失败。比如 转账操作,就需要使用`事务`来处理、
这里的,一组相关的`dml`语句: 专指-> 增、删、改, 不包含 查
2.`事务`与`锁`
当 执行事务操作 时, mysql会在表上 `加锁`, 防止 其他用户 `修改表的数据`，这对 用户来说 `非常重要`
#### 事务基本操作
mysql事务的几个重要操作:
	- 1.`start transaction`:  开启一个事务
	- 2.`savepoint [保存点名称]`:  设置保存点
	- 3.`rollback to [保存点]`:  回滚事务到 某个保存点
	- 4.`rollback`:  回滚全部事务
	- 5.`commit`:  提交事务, 所有的操作生效,不能回滚了、
> 细节点:
- `rollback to [保存点名]` 后, `中间的其他保存点`会被删掉、
- `rollback` 后, `所有保存点`都将被删掉
- `commit` 后, 保存数据的最终状态,删除所有的保存点。不能再回滚了。

```bash
# 希望把 一组 操作语句 当成一个整体，要么一起成功、要么一起失败
# 如: 小明转 100 块给 小丽
mysql> create table if not exists `balance`(`id` int primary key auto_increment, `name` varchar(64) not null default '', `menoy` decimal(10,2) not null default 0) engine innodb character set utf8 collate utf8_general_ci;
Query OK, 0 rows affected, 2 warnings (0.03 sec)

mysql> insert into balance values (NULL, '小明', 3000.00),(NULL, '小丽', 5914.76);
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from balance;
+----+--------+---------+
| id | name   | menoy   |
+----+--------+---------+
|  1 | 小明   | 3000.00 |
|  2 | 小丽   | 5914.76 |
+----+--------+---------+
2 rows in set (0.00 sec)

mysql> update balance set `menoy`=`money`-100; update balance set `menoy`=`menoy`+100 where id=2;

ERROR 1054 (42S22): Unknown column 'money' in 'field list'
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from balance;
+----+--------+---------+
| id | name   | menoy   |
+----+--------+---------+
|  1 | 小明   | 3000.00 |
|  2 | 小丽   | 6014.76 |
+----+--------+---------+
2 rows in set (0.00 sec)

# 如上操作 并不能保证：数据的修改一致性，一旦 有一个金额设置失败另一个设置成功。将造成严重后果
# 所以：需要一种机制来保证 2条修改语句 都操作成功或者都操作失败, 让数据保持一致性。
# 开启事务
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

# 设置 保存点
mysql> savepoint point_001;
Query OK, 0 rows affected (0.00 sec)

# 执行 操作语句
mysql> update balance set `menoy`=`money`-100 where id=1; update balance set `menoy`=`menoy`+100 where id=2; 
ERROR 1054 (42S22): Unknown column 'money' in 'field list'
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from balance;
+----+--------+---------+
| id | name   | menoy   |
+----+--------+---------+
|  1 | 小明   | 2900.00 |
|  2 | 小丽   | 6114.76 |
+----+--------+---------+
2 rows in set (0.00 sec)

# 尝试回滚到 point_001  的保存点, 也就是 操作语句之前的状态
mysql> rollback to point_001;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from balance;
+----+--------+---------+
| id | name   | menoy   |
+----+--------+---------+
|  1 | 小明   | 3000.00 |
|  2 | 小丽   | 6014.76 |
+----+--------+---------+
2 rows in set (0.00 sec)

# 尝试提交事务: commit  保存数据的最终状态,删除所有的保存点。之后就不能再回滚了。
mysql> commit;
```


#### 事务隔离级别基础 和 事务注意事项
- 1. 读未提交（read uncommitted）
- 2. 读已提交（read committed）
- 3. 可重复读（repeatable read）
- 4. 可串行化（serializable）
这4种隔离级别的
| ------- | ----- | --------- | ----  | -----|
| 隔离级别 |  脏读  | 不可重复读 | 幻读  | 加锁读 |
| ------- | ----- | --------- | ----  | ---- |
| 读未提交 |  true |    true   | true  | 不加锁|
| 读已提交 | false |    true   | true  | 不加锁|
| 可重复读 | false |   false   | false | 不加锁|
| 可串行化 | false |   false   | false | 不加锁|
| ------- | ----- | --------- | ----  | ---- |
```bash
# 查看隔离级别, 默认的隔离级别是：可重复读的
mysql> select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| REPEATABLE-READ         |
+-------------------------+
1 row in set (0.00 sec)

# 设置隔离级别
# set session transaction isolation level [隔离级别]
# 切换 隔离级别 -> 读未提交
mysql> set session transaction isolation level read uncommitted;
Query OK, 0 rows affected (0.00 sec)

mysql> select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| READ-UNCOMMITTED        |
+-------------------------+
1 row in set (0.00 sec)

# 切换 隔离级别 -> 读已提交
mysql> set session transaction isolation level read committed;
Query OK, 0 rows affected (0.00 sec)

mysql> select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| READ-COMMITTED          |
+-------------------------+
1 row in set (0.00 sec)

# 切换 隔离级别 -> 可串行化
mysql> set session transaction isolation level serializable;
Query OK, 0 rows affected (0.00 sec)

mysql> select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| SERIALIZABLE            |
+-------------------------+
1 row in set (0.00 sec)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
```


#### 事务细节2:
- 1.如果不开启 `事务`, 默认情况下, `dml`操作 是 `自动commit`的, 所以不能回滚
```bash
mysql> desc t09;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | NO   | PRI | NULL    |       |
| name  | varchar(32) | NO   | MUL |         |       |
+-------+-------------+------+-----+---------+-------+
2 rows in set (0.01 sec)

mysql> select * from t09;
Empty set (0.00 sec)

mysql> insert into t09 values(1,'西红柿');
Query OK, 1 row affected (0.01 sec)

# 执行回滚,没效,因为默认不开启事务,mdl操作完后,自动commit.
mysql> rollback;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from t09;
+----+-----------+
| id | name      |
+----+-----------+
|  1 | 西红柿    |
+----+-----------+
1 row in set (0.00 sec)

```
- 2.如果`开始一个事务`, 你没有设置保存点, 可以执行 `rollback`, 他会默认回滚到 `事务开始的状态`
```bash
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

mysql> update t09 set `name`='香猪' where id=1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from t09;
+----+--------+
| id | name   |
+----+--------+
|  1 | 香猪   |
+----+--------+
1 row in set (0.00 sec)

mysql> rollback;
Query OK, 0 rows affected (0.01 sec)

mysql> select * from t09;
+----+-----------+
| id | name      |
+----+-----------+
|  1 | 西红柿    |
+----+-----------+
1 row in set (0.00 sec)

```
- 3.可以在这个事务中(还没提交前), 创建多个`保存点`: 比如 savepoint aaa, 执行 dml,
再 savepoint bbb, 执行 dml, 再 savepoint ccc ....
- 4.可以在`事务没有提交前`, 选择`回退`到`某个保存点`.
- 5.mysql `事务机制` 需要 `innodb`的存储引擎支持, `myisam`不好使
- 6.开始一个事务: `start transaction`, 可以设置->默认不自动commit: `set autocommit=off`



#### *事务的隔离级别*
`多个连接` 开启 `各自事务` 操作 数据库中的数据时, 需要系统负责`隔离操作`,
以确保 `各个连接` 在获取数据时的准确性。
如果不考虑隔离性 -> 会引发: 脏读、不可重复读、幻读

- 1. 读未提交（read uncommitted）
- 2. 读已提交（read committed）
- 3. 可重复读（repeatable read）
- 4. 可串行化（serializable）

这4种隔离级别引发的问题:
| ------- | ----- | --------- | ----  | -----| ------- |
| 隔离级别 |  脏读  | 不可重复读 | 幻读  | 加锁读 | 隔离强度 |
| ------- | ----- | --------- | ----  | ---- | -------  |
| 读未提交 |  true |    true   | true  | 不加锁|   弱     |
| 读已提交 | false |    true   | true  | 不加锁|   较弱   |
| 可重复读 | false |   false   | false | 不加锁| 默认:中等 |
| 可串行化 | false |   false   | false | 加锁  |   强     |
| ------- | ----- | --------- | ----  | ---- | -------- |

- 1.脏读(dirty read): 当`一个事务` 读取 `另一个事务尚未提交的修改的结果`时,产生`脏读`。
- 2.不可重复读(nonrepeatable read): `同一查询` 在 `同一事务` 中多次执行,由于`其他提交事务所做的 修改 或 删除 操作`,导致`每次返回不同的结果集`, 此时发生 `不可重复读`
	+ 修改 或 删除 操作 => 不可重复读
- 3.幻读(phantom read): `同一查询` 在 `同一事务` 中多次进行, 由于 `其他事务所做的 插入 操作`, 导致`每次返回不同的结果集`，此时发生 `幻读`
	+ 插入 操作 => 幻读

> 读未提交-分析:
```bash
# 开启2个客户端连接操作相同一个数据库同一张表 balance_1
# client a, 使用默认隔离级别: repeatable read
# client b, 使用隔离级别: read uncommited 读未提交

mysql> select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| REPEATABLE-READ         |
+-------------------------+
1 row in set (0.00 sec)

# client b, 设置隔离级别: read uncommitted
mysql> set session transaction isolation level read uncommitted;
Query OK, 0 rows affected (0.00 sec)

mysql> select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| READ-UNCOMMITTED        |
+-------------------------+
1 row in set (0.00 sec)

# cliect a 开启事务
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

# client b 开启事务
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

# 1.cliect a 新建表,查看表
mysql> create table if not exists `balance_1` like `balance`;
Query OK, 0 rows affected (0.02 sec)

mysql> desc balance_1;
+-------+---------------+------+-----+---------+----------------+
| Field | Type          | Null | Key | Default | Extra          |
+-------+---------------+------+-----+---------+----------------+
| id    | int           | NO   | PRI | NULL    | auto_increment |
| name  | varchar(64)   | NO   |     |         |                |
| menoy | decimal(10,2) | NO   |     | 0.00    |                |
+-------+---------------+------+-----+---------+----------------+
3 rows in set (0.01 sec)

mysql> select * from balance_1;
Empty set (0.00 sec)

# 2.cliect b 查看表
mysql> select * from balance_1;
Empty set (0.00 sec)

# 3.client a 插入一条记录, 但未 提交当前事务
mysql> insert into balance_1 values(NULL, '小明', 6700.00);
Query OK, 1 row affected (0.00 sec)

# 4.client b 此刻再次查表, 发现有结果了?!
mysql> select * from balance_1;
+----+--------+---------+
| id | name   | menoy   |
+----+--------+---------+
|  1 | 小明   | 6700.00 |
+----+--------+---------+
1 row in set (0.00 sec)

# 5.client b 的事务隔离级别 => 读未提交
#   可以取到到 `其他事务` dml操作(update|insert|delete) 但未提交前的改变。此时产生的就是 `脏读`.

# 6.client a 继续操作, 修改 刚才插入的 menoy 数值、
mysql> update balance_1 set menoy='7500.00' where id=1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

# 7.client a 继续操作, 再次新增一条记录
mysql> insert into balance_1 values(NULL,'小丽',5000.00);
Query OK, 1 row affected (0.01 sec)

# 8.client a 提交当前事务操作。
mysql> commit;
Query OK, 0 rows affected (0.00 sec)

# 9.client b 查询数据得到 新的修改/插入后的新结果
mysql> select * from balance_1;
+----+--------+---------+
| id | name   | menoy   |
+----+--------+---------+
|  1 | 小明   | 7500.00 |
|  2 | 小丽   | 5000.00 |
+----+--------+---------+
2 rows in set (0.00 sec)

# 10.此时 会就出现了 `不可重复读` 和 `幻读`.
#   不可重复读: `同一查询` 在 `同一事务` 中多次执行,由于`其他提交事务所做的 修改 或 删除 操作`,导致`每次返回不同的结果集`
#   幻读: `同一查询` 在 `同一事务` 中多次进行, 由于 `其他事务所做的 插入 操作`, 导致`每次返回不同的结果集`
# -> 其实在client b 连接数据库进行操作的时候,希望查询到的是 那个时刻 `balance_new` 当时的数据记录状态, 而不是 被其他连接的事务操作得到其他结果集。
```

> 读已提交-分析:
```bash
# 开启2个客户端连接操作相同一个数据库同一张表 balance_2
# client a, 使用默认隔离级别: repeatable read
# client b, 使用隔离级别: read commited

# 1.client a 开启事务，新建表 balance_2，查看表结构和状态
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

mysql> create table balance_2 like balance;
Query OK, 0 rows affected (0.02 sec)

mysql> select * from balance_2;
Empty set (0.00 sec)

mysql> select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| REPEATABLE-READ         |
+-------------------------+
1 row in set (0.00 sec)

# 2.client b 设置隔离级别: 读已提交，开启事务，查看表
mysql> set session transaction isolation level read committed; 
Query OK, 0 rows affected (0.00 sec)

mysql> select @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| READ-COMMITTED          |
+-------------------------+
1 row in set (0.00 sec)

mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from balance_2;
Empty set (0.00 sec)

# 3.client a 插入一条记录,查看表
mysql> insert into balance_2 values(NULL, '张三', 8000.00);
Query OK, 1 row affected (0.00 sec)

mysql> select * from balance_2;
+----+--------+---------+
| id | name   | menoy   |
+----+--------+---------+
|  1 | 张三   | 8000.00 |
+----+--------+---------+
1 row in set (0.00 sec)

# 4.client b 也查看表，此时是看不得任何结果的、


```



#### ACID










## mysql存储引擎
mysql中常用的2中存储引擎: innodb、mysam









## mysql视图、用户管理、权限管理











## mysql 常用优化
结构优化（Scheme optimization）
查询优化（Query optimization）









## mysql 集群方案


