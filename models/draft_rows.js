import mongoose from 'mongoose';

const Schema = mongoose.Schema

const draftRowSchema = new Schema({
    // Название компании
    name: {
        type: String,
        required: false,
        default: '',
    },
    // Дата изменения
    updateDate: {
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
    }
}, { strict: false })

export const DraftRow = mongoose.model('DraftRow', draftRowSchema)
