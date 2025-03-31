import {ApiResponse} from "../utils/api-response.js"

const healthcheck = async (req,res)=>{

    return res.status(200).json(
        new ApiResponse(200,{message: "server is running"})
    )
}

export default healthcheck