import app from "./src/app.js"
import db from './src/db/db.js'
const PORT = 3000
db()
app.listen(PORT,()=>{
    console.log('server is running');
    
})