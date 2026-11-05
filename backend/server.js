import app from "./src/app.js"
import db from './src/db/db.js'
const PORT = Number(process.env.PORT) || 3000

if (!process.env.VERCEL) {
  db()
    .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
    .catch((error) => {
      console.error('Failed to connect to the database', error)
      process.exitCode = 1
    })
}


export default app;