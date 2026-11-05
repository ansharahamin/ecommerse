import app from "./src/app.js"
import db from './src/db/db.js'
import express from "express";
const app = express();
const PORT = 3000
db()
// ... tumhare middleware, routes, DB connection ...

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}


export default app;