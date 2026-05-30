const { Server } = require("socket.io");
const Redis = require("ioredis");

let io;
let redisPublisher;
let redisSubscriber;

const initRealtime = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Use REDIS_URL from env, otherwise fallback to local for development
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    // We create two connections: one for publishing, one for subscribing
    // Ignore connection errors if Redis isn't running locally to avoid crashing nodemon
    redisPublisher = new Redis(redisUrl, { retryStrategy: () => 5000, maxRetriesPerRequest: 1 });
    redisSubscriber = new Redis(redisUrl, { retryStrategy: () => 5000, maxRetriesPerRequest: 1 });

    redisSubscriber.on('error', (err) => console.log('Redis subscriber err (expected if no redis running):', err.message));
    redisPublisher.on('error', (err) => console.log('Redis publisher err (expected if no redis running):', err.message));

    // Subscribe to blood request notifications
    redisSubscriber.subscribe("blood_requests", (err, count) => {
        if (err) console.log("Failed to subscribe to blood_requests", err.message);
    });

    // Listen for messages on Redis and broadcast via Socket.io
    redisSubscriber.on("message", (channel, message) => {
        if (channel === "blood_requests") {
            const data = JSON.parse(message);
            // Broadcast to all connected clients. In a real app, you'd target specific users/rooms
            io.emit("new_blood_request", data);
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected to realtime socket: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

const getIo = () => io;

const publishBloodRequest = (data) => {
    if (redisPublisher && redisPublisher.status === 'ready') {
        redisPublisher.publish("blood_requests", JSON.stringify(data));
    }
};

module.exports = { initRealtime, getIo, publishBloodRequest };
