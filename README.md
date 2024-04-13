# A Server Ping Display Tool

## Overview
This software is a Node.js application designed to measure and display ping values between a browser and your server using socket.io. It provides real-time latency insights, which are essential for network analysis, server monitoring, and troubleshooting connectivity issues.

## Features
* **Real-Time Ping Metrics:** Instantly view the ping time between your server and the client's browser.
* **User-Friendly Interface:** Simple and intuitive browser-based interface for viewing latency.
* **Cross-Platform Compatibility:** Works on any system that supports Node.js and a web browser.
* **Easy Configuration:** Minimal setup required to get up and running.

## Getting Started
Follow these steps to set up and run the Server Ping Display Tool on your machine:

### Prerequisites
* Node.js >=12.22.12 installed on your server
* npm >=6.14.16
* Reverse Proxy Server (Recommend Nginx)
* A modern web browser

### Installation
1. Clone this repository:

```bash
git clone https://github.com/ROZ-MOFUMOFU-ME/ping
```

2. Navigate to the cloned directory:

```bash
cd ping
```

3. Install dependencies

```bash
npm install
```

### Usage
1. Run the server using:
```bash
npm start
```

2. Set up a reverse proxy (this is an example configuration for Nginx):
```nginx.conf
server {

  # reverse proxy
  location /socket.io/ {
      proxy_pass            http://127.0.0.1:3000;
      proxy_set_header      Host $host;
      proxy_http_version                 1.1;
      proxy_cache_bypass                 $http_upgrade;

      # Proxy SSL
      proxy_ssl_server_name              on;

      # Proxy headers
      proxy_set_header Upgrade           $http_upgrade;
      proxy_set_header Connection        $connection_upgrade;
      proxy_set_header X-Real-IP         $remote_addr;
      proxy_set_header Forwarded         $proxy_add_forwarded;
      proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host  $host;
      proxy_set_header X-Forwarded-Port  $server_port;

      # Proxy add headers
      add_header Access-Control-Allow-Origin      '*' always;
      add_header Access-Control-Allow-Methods     "POST, GET, OPTIONS";
      add_header Access-Control-Allow-Headers     "Origin, Authorization, Accept";
      add_header Access-Control-Allow-Credentials true;

      # Proxy timeouts
      proxy_connect_timeout              60s;
      proxy_send_timeout                 60s;
      proxy_read_timeout                 60s;
  }

}
```

3. make html:
```index.html
<html>
    <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.5/socket.io.js"></script>
    </head>
<body>

    <div><span id="Ping"></span></div>

<script>
function setSocketConnection(spanId, serverName, serverUrl) {
  $(`span#${spanId}`).html("connecting...");
  
  setTimeout(function() {
    const socket = io.connect(serverUrl, { 'reconnect': true });

    socket._connectTimer = setTimeout(function () {
      $(`span#${spanId}`).html("connect error!");
      socket.close();
    }, 10000);

    socket.on('connect', function () {
      console.log(`Connected to ${serverName}`);
      clearTimeout(socket._connectTimer);
      socket._connectTimer = setTimeout(function () {
        socket.close();
      }, 60000);

      $(`span#${spanId}`).html("starting...");
      setInterval(function () {
        const startTime = Date.now();
        socket.emit('latency', startTime, function () {
          const latency = Date.now() - startTime;
          $(`span#${spanId}`).html(`Your Ping is ${latency} ms`);
        });
      }, 3000);
    });
  }, 5000);
}
$(function () {
  setSocketConnection('Ping', 'Server', 'http://127.0.0.1');
});
</script>

</body>
</html>
```

Open your web browser and access to view **http://127.0.0.1/** the ping measurements.

## Contributing
Contributions are what make the open-source community such a fantastic place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (**git checkout -b feature/AmazingFeature**)
3. Commit your Changes (**git commit -m 'Add some AmazingFeature'**)
4. Push to the Branch (**git push origin feature/AmazingFeature**)
5. Open a Pull Request

## License
Distributed under the MIT License. See **LICENSE** for more information.

## Contact
ROZ-MOFUMOFU-ME - [@ROZ_mofumofu_me](https://twitter.com/ROZ_mofumofu_me)

Aoi Emerauda - [@Aoi_Emerauda](https://twitter.com/Aoi_Emerauda) Alternative

Project Link: [https://github.com/ROZ-MOFUMOFU-ME/ping](https://github.com/ROZ-MOFUMOFU-ME/ping)

## Donations
Donations for development are greatly appreciated!

[GitHub Sponsors](https://github.com/sponsors/ROZ-MOFUMOFU-ME)

[Patreon](https://patreon.com/emerauda)

[FANBOX](https://emerauda.fanbox.cc/)

[Fantia](https://fantia.jp/emerauda)

[Buy Me a Coffee](https://buymeacoffee.com/emerauda)

BTC: 3C8oCWjVs2sycQcK3ttiPRSKV4AKBhC7xT

ETH: 0xc664a0416c23b1b13a18e86cb5fdd1007be375ae

LTC: Lh96WZ7Rw9Wf4GDX2KXpzieneZFV5Xe5ou

BCH: pzdsppue8uwc20x35psaqq8sgchkenr49c0qxzazxu

ETC: 0xc664a0416c23b1b13a18e86cb5fdd1007be375ae


## Credits
[ROZ-MOFUMOFU-ME](https://github.com/ROZ-MOFUMOFU-ME) - Author

[Aoi Emerauda](https://github.com/emerauda) - Alternative
