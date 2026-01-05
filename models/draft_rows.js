import mongoose from 'mongoose';

const Schema = mongoose.Schema

const draftRowSchema = new Schema({
    // Название компании
    name: {
        type: String,
        required: false,
        default: '',
    },
    // ID пользователя
    userId: {
        type: String,
        required: true
    },
    // ФИО пользователя
    fullName: {
        type: String,
        required: true
    },
    // ID черновика
    draftId: {
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
        strict: false,
        timestamps: true
    })

export const DraftRow = mongoose.model('DraftRow', draftRowSchema)
