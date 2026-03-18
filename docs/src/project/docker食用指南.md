# docker食用指南

![](https://imgstroe-redblacktree.oss-accelerate.aliyuncs.com/img/20260319045703627.png)

我第一次使用docker是在拉了一个mysql的镜像，部署到自己的Linux服务器中，相较于以往需要配置各种mysql，而且容易出现卸载mysql后配置文件删除不干净，影响下次按安装。docker真是太方便了，配置好docker文件，然后注意暴露端口，就跟安装手机软件一样傻瓜式，而且不担心跨服务器，所需的代价仅仅是略微的性能损失和稍大一些的内存。（但是注意，mysql放在docker实例中时，是需要将数据库存储文件挂载出dockers的，不然docker实例删除后，数据是会被释放丢失的）

## docker与操作系统

不恰当的说，docker是个加强版本的进程，他是打包后的应用+运行工具，以及一些所需环境。就像dockers图标来说，操作系统就是底下的鲸鱼，管理硬件并向docker提供服务，如系统调用等。而docker是鲸鱼上的集装箱，集装箱里面装着我们应用。有了集装箱，我们能够很方便的将我们应用搬到不同的鲸鱼上，配置一次，随时复用。
软件工程中，有一句话，所以的问题都能靠加一层中间层解决。

## docker

docker 重要的三个概念，镜像（Image），容器（Container），Dockerfile配置文件  （还有个  仓库，但这个不重要，知道我们可以从仓库中下载镜像就行）

### 镜像（Image）

镜像类似于c++中的类声明，定义了容器的运行环境，我们可以从仓库中拉取代码所需要的基础镜像，然后添加我们打包好的应用程序成为新一个镜像。

### 容器（Container）

通过镜像new了一个对应的对象，我们可以在容器启动时，通过端口映射（-p 参数）将容器内部端口暴露到宿主机，例如 MySQL 默认使用 3306 端口，可以映射为宿主机的 3307 端口以供访问。，但是由于容器删除后，会释放外存等，因此像mysql需要长久保持的需要设置挂载文件。

在docker run 启动容器时，还可以设置环境变量，比如保存mysql的登陆密钥，不需要硬编码在代码中。

### Dockerfile

Dockerfile 是用于构建 Docker 镜像的描述文件，它定义了镜像的构建过程，包括基础环境、依赖安装、文件拷贝以及默认启动命令等。

由于经常需要部署时候找Dockerfile文件配置，下面是一些经常用到的配置文件:

**部署spring打包获得的jar包文件**

```
# 用jdk容器执行这个程序（建议使用更轻量的 slim 版本）
FROM openjdk:8-jdk-slim

# 作者
MAINTAINER zhuozhe

# VOLUME 指定了临时文件目录为/tmp。
# 其效果是声明该目录为可挂载点，容器运行时会映射到宿主机的匿名卷中（具体路径由 Docker 管理）
VOLUME /tmp

# 将可执行的jar包放到容器当中去
COPY target/xiaohh-cost-1.0.0.jar /app.jar

# 暴露服务端口
EXPOSE 8080

# 暴露日志目录，Java程序运行的错误日志就在这个里面
VOLUME /logs

# 运行时的环境
ENV SPRING_PROFILES_ACTIVE=prod

# JVM 调优参数
ENV JAVA_OPTS="-Dfile.encoding=UTF-8 -Xmx512m -Xms512m -Xmn256m -XX:+UseParallelGC -XX:+PrintGCDetails -XX:+PrintGCCause -XX:+PrintHeapAtGC -Xloggc:/logs/xiaohh-cost.gc.log -XX:+HeapDumpOnOutOfMemoryError -XX:+DisableExplicitGC"

# 运行程序
# RUN bash -c 'touch /app.jar'

# 启动命令
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar"]
```

**部署vue 打包后的jar文件**

```
# 使用官方的Node.js镜像作为基础镜像
FROM node:14-alpine as builder

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建Vue应用
RUN npm run build

# 使用官方的Nginx镜像作为基础镜像
FROM nginx:alpine

# 复制构建好的Vue应用文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 配置Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 运行Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### CI/CD自动部署

可以通过配置Action实现提交代码后自动build，自动push镜像，实现更高的自动化，但是目前来说个人不太需要，可以未来有需求实现，不过渡设计。