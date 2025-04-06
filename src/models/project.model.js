import mongoose, {Schema} from "mongoose";

const ProjectSchema = new Schema({
    name:{
        type:String,
        required: true,
        unique: true,
        trim: true
    },

    description:{
        type: String,
        required: true,
        unique: true,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})


export const Project = mongoose.model("Project",ProjectSchema) 