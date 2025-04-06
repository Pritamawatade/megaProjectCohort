import express from "express"
import healthCheckRoute from "./routes/healthcheck.route.js"
import router from "./routes/auth.route.js";

const app = express()

app.use("/api/v1/healthcheck", healthCheckRoute); 
app.use("/api/v1/user", router)

export default app;