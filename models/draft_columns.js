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
    // Включена колонка или нет
    checked: {
        type: Boolean,
        required: false,
        default: true
    },
    // Не сортируется
    sortable: {
        type: Boolean,
        required: false,
        default: false
    },
    // Без меню в колонке
    disableColumnMenu: {
        type: Boolean,
        required: false,
        default: true
    },
    // Не меняем порядок колонок
    disableReorder: {
        type: Boolean,
        required: false,
        default: false
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
    // Удаляемый ли столбец или нет
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
})

export const DraftColumn = mongoose.model('DraftColumn', draftColumnSchema)
