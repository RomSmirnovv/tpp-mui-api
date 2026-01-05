import mongoose from 'mongoose';

const Schema = mongoose.Schema

const draftSchema = new Schema({
    // Название черновика
    name: {
        type: String,
        required: true,
    },
    // ID пользователя
    userId: {
        type: String,
        required: true
    },
    // ID workspace (компании)
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: false,
        default: null
    }
},
    {
        timestamps: true
    })

export const Draft = mongoose.model('Draft', draftSchema)
