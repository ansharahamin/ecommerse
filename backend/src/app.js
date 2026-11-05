import express from "express";
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import cookieParser from "cookie-parser";
const app = express()

const allowedOrigins = new Set(
    (process.env.FRONTEND_ORIGINS || 'https://ecommerse-blond.vercel.app')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
)

app.use((req, res, next) => {
    const origin = req.get('Origin')
    if (origin) {
        res.vary('Origin')
        if (!allowedOrigins.has(origin)) {
            if (req.method === 'OPTIONS') {
                return res.status(403).json({ message: 'Origin not allowed' })
            }
            return next()
        }
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Access-Control-Allow-Credentials', 'true')
    }

    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        res.setHeader('Access-Control-Max-Age', '86400')
        return res.sendStatus(204)
    }

    next()
})

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth',authRoutes)
app.use('/api/product',productRoutes)
app.use('/api/cart',cartRoutes)
export default app