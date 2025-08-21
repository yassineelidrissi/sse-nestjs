# Real-Time Notification System (NestJS + SSE + Redis)

This is a clean and extensible real time notification system built using:

- NestJS (backend framework)
- Redis Pub/Sub (for event distribution)
- Server Sent Events (SSE) for pushing real time notifications to the client
- No RxJS .. relies on async generators for clarity and performance

## How It Works

1. A notification is created and saved to the database.
2. It’s then published to Redis on a shared channel.
3. The Redis subscriber listens for messages and pushes the event to a connected user stream (if any).
4. When a user connects to the SSE endpoint:
   - Missed notifications are pulled from the database (backlog).
   - New notifications are streamed live via an open HTTP connection.

## Message Broker Agnostic

This system was designed to let you replace Redis with any broker:

- Kafka
- RabbitMQ
- NATS
- etc.

All you need to do is create a new adapter that implements `publish()` and `subscribe()` logic.

## Features

- Real-time notifications using SSE
- Missed notification replay from database
- Per user stream registry (in-memory async queue)
- Plug and play broker architecture (just swap adapters)
- Simple structure, no unnecessary abstractions or RxJS

## Folder Structure

```
src/notification/
├── dtos/
├── providers/
├── redis/
├── stream/
├── types/
├── notification.controller.ts
├── notification.entity.ts
├── notification.module.ts
```

## How to Test

1. Run the server
2. Open a terminal and start an SSE client:
   ```bash
   curl -N http://localhost:5000/notification/stream?userId=1
   ```
3. Trigger a notification by creating a post or calling the notification service.
4. You’ll see streamed notifications in real-time.

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Redis
- SSE (Server-Sent Events)

## Author

Yassine El Idrissi

If you found this helpful and want more examples using polling, Kafka, or advanced messaging patterns .. feel free to reach out.