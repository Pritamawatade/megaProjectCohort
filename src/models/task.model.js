import mongoose, { Schema } from 'mongoose';
import {AvailableTaskStatus, TaskStatusEnum} from "../utils/constants.js"

const TaskSchema = new Schema({
    title:{
        type:String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
    },
    project:{
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: [true, "project reference is required"]
    },
    assignedTo:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    assignedBy:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type: String,
        enum: AvailableTaskStatus,
        default: TaskStatusEnum.TODO
    },
    attachments:{
        tyep:[
            {
                url: String,
                mimetype: String,
                size : Number
            }
        ],
        default: []
        
    }
}, { timestamps: true });

export const Task = mongoose.model('Task', TaskSchema);
