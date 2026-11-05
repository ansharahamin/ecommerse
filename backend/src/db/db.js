import dns from 'node:dns/promises'
dns.setServers(['1.1.1.1','8.8.8.8'])
import mongoose from 'mongoose'
import 'dotenv/config'
let connectionPromise

export default function connectToDatabase() {
    if (mongoose.connection.readyState === 1) {
        return Promise.resolve(mongoose.connection)
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGO_URI).catch((error) => {
            connectionPromise = undefined
            throw error
        })
    }

    return connectionPromise
}