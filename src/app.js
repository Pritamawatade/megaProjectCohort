import express from "express"
import healthCheckRoute from "./routes/healthcheck.route.js"

const app = express()

app.use("/api/v1/healthcheck", healthCheckRoute); 

export default app;