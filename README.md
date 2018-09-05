# thrift stater

运行：

npm run server

npm run middleware

npm run client

(注意运行顺序，按照server-middleware-client的顺序运行)


# 中间层

之前开发的时候接口形式都是https，前端只需要发送ajax请求，然后获取后端返回的字段进行前端页面的渲染。自己对于前后端开发的定义过于狭隘，从这个角度来说，其实这种情况下前端认为的后端可能也只是中间层，也有人叫Web API层，其实离真正的后端，真正的底层还是有一段距离。

传统的前后端可以简单理解为前端只负责页面的渲染，后端负责数据的提供，通常情况下，后端尽管作为数据提供者，但还是涉及到很多视图相关的操作，比如说显示数据的排序或者数据脱敏等其他二次处理等。如果后端只提供原始数据，将这些二次操作放在前端，那么势必性能较差，甚至无法实现。但是如果使用中间层来对底层数据进行包装处理，然后再返回给前端，这样就能很好解决这个问题。除此之外，如果前端需要的数据来自于不同的后端服务，或者存在鉴权等操作，那么也需要中间层来一起处理这些服务。

最近了解到了node中间层的相关概念，使用node来搭建中间层对于前端开发人员来说上手较为容易。通过对业务的合理分层，能够实现更高效的开发。结构示意图如下图，前端通过fetch或者发出ajax请求向中间层请求数据，中间层调用底层服务时可以使用RPC协议，然后得到Server端返回的数据，middleware自身加工后再返回给前端。

从路由角度来说，client中的路由可以理解为前端路由（比如vue-router、react-router），middleware层可以理解为后端路由（Koa-router）。

![示意图](https://ws2.sinaimg.cn/large/006tNbRwgy1fuhfakh3t8j30su080q3g.jpg)

# RPC

RPC（Remote Procedure Call 远程过程调用），该协议允许运行于一台计算机的程序调用另一台计算机的子程序，而程序员无需额外地为这个交互作用编程。通俗理解的话，可以理解成有A、B两个服务器，一个应用部署在A上，但是它需要依赖B上的某些服务（函数/方法），由于不在一个内存空间，所以无法直接调用。RPC为这种远程调用提供了解决方案。

理解一下就是，比如说前端需要查询并展示某个用户的订单列表，假设前端请求`/getlist`，虽然用户只请求一个接口，但是实际上不同种类的订单来源于不同的服务，那么中间层需要请求不同的底层服务器，然后将数据进行包装和整合返回给前端进行展示，这时中间层和底层服务器由于不在同一内存空间，无法直接调用。

![示意图](https://ws1.sinaimg.cn/large/006tNbRwgy1fuhfw0fv8tj30yk0hogna.jpg)

# Thrift

Thrift是Facebook 开源的跨语言框架，是目前主流的 RPC 框架之一。它是一种接口描述语言和二进制通讯协议，能够进行服务端与服务端的通信，支持各种语言。接口定义双端遵循IDL（Interface Description Language）即可。IDL相关内容可以参考[Thrift interface description language](https://thrift.apache.org/docs/idl) 、[Thrift Types](http://thrift.apache.org/docs/types)。

### 下载安装

可以在[官网地址](https://thrift.apache.org/download)这里下载，参考官网[安装过程](https://thrift.apache.org/docs/BuildingFromSource)。

安装过程中可能会遇到很多问题，下面列举了部分问题的参考解决办法。

- 安装过程中可以配置使用的语言，不需要使用的语言可以禁掉。

  ```shell
  ./configure --without-java
  ```

- 官网的安装过程中安装目录为`/usr/local`，也可以自行设置安装位置。

  ```shell
  ./configure --with-boost=/usr/local
  ```

- Couldn't find libtoolize!     [安装libtool](https://blog.csdn.net/zhouwy_sy/article/details/52993489)
- configure: error: Bison version 2.5 or higher must be installed on the system!  
  -  [bison 版本问题解决方式](https://stackoverflow.com/questions/31805431/how-to-install-bison-on-mac-osx)
  - [Mac安装thrift因bison报错的解cd 决办法 - CSDN博客](https://blog.csdn.net/cumt168/article/details/50457962)
- 其他问题可以自行搜索解决办法

### 使用

#### thrift使用

官网提供了[教程和示例代码](https://thrift.apache.org/tutorial/)，可以根据选择的语言查看不同的客户端和服务器端示例代码。

这里给出一个简单的使用demo，客户端和服务端都使用nodejs，客户端生成一个随机数，每隔一秒发送给服务端，当发送5个的时候，输出数据并断开链接。

代码仓库：[thrift使用示例代码](http://git.sankuai.com/users/chentengda/repos/thrift-tutorial/browse)。



#### FE-Middleware-BE demo

通常开发中，FE和Middleware由前端来完成，这里给出了一个简单的FE-Middleware-BE的demo。

IDL文件通常是由后端提供，安装完成thrift之后，cd到thrift文件的目录下，执行`thrift -r --gen js:node {文件名}.thrift`命令，即可生成需要使用的文件。

client使用react，实现了一个简单列表的输入和展示。初始时发送get请求获取接口数据，这里在server端引入了json文件作为初始数据。随后输入信息点击确定之后，会post数据到中间层，进而到服务端，数据处理完成后，更新列表数据，进而视图更新。

middleware使用nodejs+koa搭建，client为3000端口，middleware3001，server端3002，存在跨域，使用`koa2-cors`插件。

[地址](http://git.sankuai.com/users/chentengda/repos/thrift-starter/browse)

启动：

```shell
npm run server
npm run middleware
npm run client
```





![demo](https://ws1.sinaimg.cn/large/006tNbRwgy1fuywbe5t5cj30ky0nct9j.jpg)







