import express from "express"
import healthCheckRoute from "./routes/healthcheck.route.js"
import router from "./routes/auth.route.js";

const app = express()
app.use(express.json())
app.use("/api/v1/healthcheck", healthCheckRoute); 
app.use("/api/v1/users", router)

export default app;