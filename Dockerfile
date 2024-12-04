FROM ubuntu:20.04

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    nano \
    net-tools \
    openssl \
    openvpn && \ 
    apt-get clean

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

RUN npm install -g forever

RUN node -v

WORKDIR /app

COPY app/ /app/

RUN npm install

COPY vpn/ /etc/openvpn/

EXPOSE 3000

CMD ["bash", "-c", "openvpn --config /etc/openvpn/config.ovpn & forever start server.js && tail -f /dev/null"]
