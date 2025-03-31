import {Router} from "express"
import healthcheck from "../controllers/healthcheck.controller.js"

const router = Router()

// this is also a way to make a route
router.route("/").get(healthcheck)

// router.get('/', healthcheck) :both are way to make route

export default router