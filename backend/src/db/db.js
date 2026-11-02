import dns from 'node:dns/promises'
dns.setServers(['1.1.1.1','8.8.8.8'])
import mongoose from 'mongoose'
import 'dotenv/config'
main().catch(err=>console.log(err))
async function main(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
          console.log("Connected to DB");
    } catch (error) {
        console.log(error)
    }
}
export default main