import ImageKit from "@imagekit/nodejs";
import 'dotenv/config'
import path from "path";
const client = new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})
async function uploadFile(buffer,originalname) {
    const ext = path.extname(originalname)
    const response =await client.files.upload({
        file:buffer.toString('base64'),
        fileName:'image'+Date.now()+ext,
        folder:'products'
      
    })
    return response
}
export default uploadFile