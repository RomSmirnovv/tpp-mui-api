import mongoose from 'mongoose';

const Schema = mongoose.Schema

const draftColumnSchema = new Schema({
    // Название колонки
    headerName: {
        type: String,
        required: true,
    },
    // Название колонки латиницей
    slug: {
        type: String,
        required: true,
    },
    // Название колонки латиницей
    field: {
        type: String,
        required: true,
    },
    // Название колонки которое будет сохраняться в базу
    saveName: {
        type: String,
        required: true,
    },
    // Название колонки латиницей которое будет сохраняться в базу
    saveField: {
        type: String,
        required: true,
    },
    // Включена колонка или нет
    checked: {
        type: Boolean,
        required: false,
        default: true
    },
    // Удаляемый ли столбец или нет
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    },
    // Ширина колонки
    width: {
        type: Number,
        required: false,
        default: 190
    },
    // тип колонки
    type: {
        type: String,
        required: true,
    },
    // ID пользователя
    userId: {
        type: String,
        required: true
    },
    // ID черновика
    draftId: {
        type: String,
        required: true
    }
},
    {
        strict: false,
        timestamps: true
    })

export const DraftColumn = mongoose.model('DraftColumn', draftColumnSchema)
