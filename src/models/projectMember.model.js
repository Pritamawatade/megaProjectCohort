import mongoose, {Schema} from "mongoose";
import {AvailableUserRoles, UserRolesEnum} from "../utils/constants.js"

const ProjectMemberSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    project:{
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    role:{
        type: String,
        enum: AvailableUserRoles,
        default: UserRolesEnum.MEMBER
    }
},{
    timestamps: true
})


export const ProjectMember = mongoose.model("ProjectMember",ProjectMemberSchema) 