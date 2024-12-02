# 实用工具

## VPS融合怪测试脚本

`bash <(curl -sL kejilion.sh)`

- 融合怪测试：8 32
- IP纯净度测试：8 4

## VPS一键魔法脚本
- Hysteria2（UDP）：`bash <(curl -fsSL https://raw.githubusercontent.com/0x0129/hysteria2/main/install.sh) -port 0721`
- Vless+Trojan+Shadowsocks：`bash <(curl -s -L https://git.io/v2ray.sh)`
- x-ui：`bash <(curl -Ls https://raw.githubusercontent.com/vaxilu/x-ui/master/install.sh)`

## Hysteria2 服务端搭建（全平台通用）
1. 下载 Hysteria2 可执行文件： https://github.com/apernet/hysteria/releases
2. 创建自签名SSL/TLS证书：
    - 创建私钥：`openssl genpkey -algorithm RSA -out hy2.key`
    - 创建证书签名请求：`openssl req -new -key hy2.key -out hy2.csr`
    - 创建证书：`openssl x509 -req -in hy2.csr -signkey hy2.key -out hy2.crt -days 9999`
3. `config.yaml`：
```yaml
listen: :443 

tls:
  cert: hy2.crt 
  key: hy2.key 

auth:
  type: password
  password: 0721

masquerade: 
  type: proxy
  proxy:
    url: https://news.ycombinator.com/ 
    rewriteHost: true
```
4. 启动 Hysteria2参数：`server`
5. V2Ray客户端连接直链：`hysteria2://0721@10.147.17.1:443?sni=bing.com&insecure=1#家里云`


## Cloudflare一键魔法

下载 https://github.com/cmliu/edgetunnel/archive/refs/heads/main.zip 将它上传到Cloudflare Pages设置UUID。访问 https://你的域名.pages.dev/UUID

## Cloudflare 优选方法

### A、AAAA、CNAME
1. B域名直接套CDN指向源站
2. B域名开启SaaS，设置回退源为指向源站的域名，自定义主机名为A域名
3. B域名指向优选域名，不套CDN
4. A域名指向B域名指向的优选域名的域名 ，不套CDN

### Cloudflare Pages
1. 直接在Pages创建自定义域
2. 更改子域NS到阿里云云解析DNS
3. 在阿里云云解析DNS设置解析分流

### Cloudflare Workers
1. 直接在Workers创建路由
2. 将被设置路由的域名解析到优选域名

## Cloudflare 优选域名
- [CM大佬](https://blog.cmliussss.com/)：cf.090227.xyz
- [微测网](https://www.wetest.vip/page/cloudflare/cname.html)：cloudflare.182682.xyz
- 移动快乐：cf-saas.asia

## 魔法软件
- V2rayN（Windows）：https://github.com/2dust/v2rayN
- V2rayNG（Android）：https://github.com/2dust/v2rayNG

## 使用Cloudflared中继RDP流量

`cloudflared access rdp --hostname rdp.onani.cn --url rdp://localhost:3380`

## FRP相关

### FRP基本认证参数

`auth.token = "0721"`

### FRP systemd服务配置（开机自启）
- 创建 frps.service 文件
`sudo nano /etc/systemd/system/frps.service`

- copy 以下内容到文件中
```shell
[Unit]
# 服务名称，可自定义
Description = frp server
After = network.target syslog.target
Wants = network.target

[Service]
Type = simple
# 启动frps的命令，需修改为您的frps的安装路径
ExecStart = /path/to/frps -c /path/to/frps.toml

[Install]
WantedBy = multi-user.target
```

## Linux Deb系安装Speedtest-cli
```shell
apt install -y lsb-release ca-certificates apt-transport-https curl gnupg dpkg
curl -sSL https://packagecloud.io/ookla/speedtest-cli/gpgkey | gpg --dearmor > /usr/share/keyrings/speedtest.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/speedtest.gpg] https://packagecloud.io/ookla/speedtest-cli/debian/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/speedtest.list

apt update
apt install -y speedtest
```

## Linux监控面版：s-tui

## Windows超级牛逼包管理器：https://scoop.sh

## Linux各发行版安装注意
1. 非常新的版本一般才会有Realtek有线网卡的驱动
2. 安装Debian要使用CLI安装（GUI安装会出现问题 ~~具体的问题我忘了~~）
3. 安装CentOS/Rocky一定要先安装GUI，否则会导致上不了网
4. 除了Arch连接网络使用iwd，其他发行版都可以用nmcli连接网络

## 国内Linux镜像注意事项
1. USTC（中科大源）经常会用JavaScript进行客户端验证，会导致wget和curl命令无法正确下载到文件。建议使用TUNA（清华源）

## 国内Docker镜像注意事项
- 1Panel Docker监控：https://status.1panel.top/status/docker
- 南京大学GHCR镜像源：https://ghcr.nju.edu.cn
