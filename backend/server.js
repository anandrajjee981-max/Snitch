import dotenv from 'dotenv';

dotenv.config();
import app from './src/app.js'
import connectdb from './src/config/db.js'





connectdb()
app.listen(3000,()=>{
  console.log("server run on 3000")
})

