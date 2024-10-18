<h2 align='center'>Queue Management</h2>
<p align="center">
<a href="https://github.com/saurabh-kud"><img title="Author" src="https://img.shields.io/badge/Author-saurabh-kud--red.svg?style=for-the-badge&logo=github"></a>
</p>

<p align="center">
<a href="https://github.com/saurabh-kud"><img title="Followers" src="https://img.shields.io/github/followers/saurabh-kud?color=teal&style=flat-square"></a>
<a href="https://github.com/saurabh-kud/queue-management/network/members"><img title="Forks" src="https://img.shields.io/github/forks/saurabh-kud/queue-management?color=lightgrey&style=flat-square"></a>
<a href="https://github.com/saurabh-kud/queue-management/issues"><img title="issues" src="https://img.shields.io/github/issues/saurabh-kud/queue-management?style=flat-square">
</a>

</p>

<p align="center">
    Queue Management- manage your request queue
</p>

## api-postman-docs 🔗

[https://documenter.getpostman.com/view/38681155/2sAXxWZp2j](https://documenter.getpostman.com/view/38681155/2sAXxWZp2j)

# task

Design and implement a backend system that efficiently manages
requests from multiple users using a queue structure. Each client connected
will have its queue where all requests will be processed sequentially. The
system should be robust and scalable, ensuring that the queue is empty once
all requests are processed and all users disconnect.
Requirements:

1. User Authentication : Securely authenticate users before they can
   enqueue requests.
2. Request Queueing : Implement a queue for each client to handle requests
   in a First-In-First-Out (FIFO) manner.
3. Request Processing : Develop a process to handle and execute requests
   sequentially.
4. Concurrency Management : Handle multiple clients and their queues
   concurrently.
5. Scalability : Ensure the system can scale to handle an increasing number
   of users and requests without degradation in performance.
6. Robustness : Implement error handling and recovery mechanisms to manage
   failures without data loss.
7. Logging and Monitoring : Set up logging for tracking request handling
   and system monitoring for performance metrics.

# tech stack used

Backend

- nodejs, express,jwt, bcrypt, rabbitmq

Database

- mongodb

visualization

- grafana, prometheus

logging

- winston

## Installation

```sh

# Clone the repo
$ git clone https://github.com/saurabh-kud/queue-management

# go to queue-management directory
$ cd queue-management

# run docker compose
$ docker compose -f docker-compose.yml -p queue-stack up -d --build --force-recreate --remove-orphans

# Access your app
$ http://localhost:8080

# visualization
# prometheus
$ http://localhost:9090

# grafana
# user: admin
# password: admin
# set prometheus as data source and create new dashboard and add your metrics
$ http://localhost:3000



```

# Microservice

- api_server
- rabbitmq-server
- mongo-server
- prometheus-server
- grafana-server

# endpoint response

> [GET] Home Endpoint [/](http://localhost:8080)

<details open>
<summary> See response</summary>
<p>

```json
RESPONSE 200
{
    "msg": "server is working fine🚀🚀",
    "api_doc": "https://documenter.getpostman.com/view/38681155/2sAXxWZp2j"
}
```

</p>
</details>

> [POST] User Register Endpoint [/register](http://localhost:8080/register)

<details open>
<summary> See response</summary>
<p>

```json
{
    "fullname":"user2 raj",
    "email": "user2@gmail.com",
    "password":"user@123"
}

RESPONSE 201
{
    "status": true,
    "message": "User created successfully",
    "data": {
        "id": "67064a57d6c57f4d43d421cf",
        "name": "user2 raj",
        "email": "user2@gmail.com",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoic2F1cmFiaEBnbWFpbC5jb20iLCJpZCI6IjY3MDY0YTU3ZDZjNTdmNGQ0M2Q0MjFjZiJ9LCJpYXQiOjE3Mjg0NjU0OTUsImV4cCI6MTcyODU1MTg5NX0.2CN1sstOBfLVYkVewDLUwzIXWe6i0uyQ7O44ZqTetr4",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoic2F1cmFiaEBnbWFpbC5jb20iLCJpZCI6IjY3MDY0YTU3ZDZjNTdmNGQ0M2Q0MjFjZiJ9LCJpYXQiOjE3Mjg0NjU0OTUsImV4cCI6MTcyODcyNDY5NX0.QAoBX0pNGL3LhVVxSSJFDQVofAIVRkHSOG68HRGqqPs"
    }
}
```

</p>
</details>

> [POST] Login Endpoint [/login](http://localhost:8080/login)

<details open>
<summary> See response</summary>
<p>

```json
{
    "email": "admin1@gmail.com",
    "password":"admin@123"
}

RESPONSE 200
{
    "status": true,
    "message": "Login successfull",
    "data": {
        "id": "6705fcff38459c1aa3e65358",
        "name": "saurabh kumar",
        "email": "admin1@gmail.com",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYWRtaW4xQGdtYWlsLmNvbSIsImlkIjoiNjcwNWZjZmYzODQ1OWMxYWEzZTY1MzU4In0sImlhdCI6MTcyODUzNjM2MSwiZXhwIjoxNzI4NjIyNzYxfQ.0-NvZ4KV87hmzosPc7aoc8rbnPJu8ze_RFsZRejLfBE",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYWRtaW4xQGdtYWlsLmNvbSIsImlkIjoiNjcwNWZjZmYzODQ1OWMxYWEzZTY1MzU4In0sImlhdCI6MTcyODUzNjM2MSwiZXhwIjoxNzI4NjIyNzYxfQ.LEC2p7tAwbdFQoS1MAbO9nALJiRMKqGnQpiWNrdpomE"
    }
}
```

</p>
</details>

> [GET] Process Endpoint (authenticate user ) [/process](http://localhost:8080/process)

<details open>
<summary> See response</summary>
<p>

```json
Headers : Bearer eyJhbGciO.......


RESPONSE 200
{
    "status": true,
    "message": "Processed request for user 1729269709850"
}
```

</p>
</details>

> [GET] Process Endpoint (unauthenticate user ) [/process](http://localhost:8080/process)

<details open>
<summary> See response</summary>
<p>

```json
RESPONSE 401
{
    "status": false,
    "message": "access token is required || Unauthorized"
}
```

</p>
</details>

## Screenshot

- architecture diagram
<div align="center">
  <img  src="./example/1.png" />
</div>
<br/>
- grafana dashboard
<div align="center">
  <img  src="./example/2.png" />
</div>
<br/>
- prometheus dashboard
<div align="center">
  <img  src="./example/3.png" />
</div>
<br/>
-rabbitmq dashboard
<div align="center">
  <img  src="./example/4.png" />
</div>
<br/>
- logging
<div align="center">
  <img  src="./example/5.png" />
</div>
<br/>

## Author

👤 **Saurabh kumar**

- Github: [@saurabh-kud](https://github.com/saurabh-kud)
- LinkedIN: [@saurabh-kud](https://www.linkedin.com/in/saurabh-kud/)

---

## License

&copy; Saurabh Kumar | MIT
