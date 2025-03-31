import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./db/db.js";

const PORT = process.env.PORT || 4000;
dotenv.config({
    path: "./.env"
});

connectDB()
        .then(()=>{
            app.listen(PORT, ()=>{
                console.log(`server is running at ${PORT}`)
            })
        })
        .catch((error)=>{
            console.log("error while connection Db. error:",error)
            process.exit(1)
        })
