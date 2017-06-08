# Docker Virtual Host

[![Docker Build Statu](https://img.shields.io/docker/build/riggerthegeek/docker-virtual-host.svg)]()

Create a virtual host environment using Docker.

# Purpose

This is so you can host multiple named websites from a single box. This should ideally be used with 
[Docker Compose](https://docs.docker.com/compose).

# Config

This is all done through the `VH_HOSTS` environment variable. This is a string which tells the manager where to serve
sites from. Each site is comma separated `,` and then each host/target is separated with a equals `=`.

The string `host1.domain.com=http://first.target.com,host2.domain.com=https://second.target.com` would resolve two
hosts, `host1.domain.com` which would resolve to `http://first.target.com` and `host2.domain.com` which would resolve
to `https://second.target.com`.

> The host URL should not include the protocol (eg, http:// or https://). The target URL should be the fully qualified
> domain name, including ports where necessary

# docker-compose.yml

```yaml
version: '3'
services:

  www:
    image: "riggerthegeek/docker-virtual-host:latest"
    environment:
      - VH_HOSTS=target1.domain.com=http://target1,target2.domain.com=http://target2
    links:
      - target1
      - target2
    depends_on:
      - target1
      - target2
    ports:
      - "3000:3000"

  target1:
    image: "nginx:alpine"

  target2:
    image: "httpd:alpine"
```
