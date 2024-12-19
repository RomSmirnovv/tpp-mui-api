import mongoose from 'mongoose';
import { DraftColumn } from '../models/draft_columns.js'

class DraftColumnRepository {


    static async create(draftcolumn) {
        const newDraftColumn = new DraftColumn(draftcolumn)
        const response = await newDraftColumn
            .save()
            .then((result) => {
                return result
            })
            .catch((e) => console.log(e))
        if (!response) {
            return null;
        }
        return response

    }

    static async getOne(id) {
        const response = await DraftColumn
            .findOne({ _id: id })
            .then((draftcolumn) => {
                return draftcolumn
            })
        if (!response) {
            return null;
        }
        return response
    }

    static async getOneByName(name) {
        const response = await DraftColumn
            .findOne({ name: name })
            .then((draftcolumn) => {
                return draftcolumn
            })
        if (!response) {
            return null;
        }
        return response
    }

    static async getAllByUser(id) {
        const response = await DraftColumn
            .find({ userId: id })
            .then((draftcolumn) => {
                return draftcolumn
            })
        if (!response) {
            return null;
        }
        return response
    }

    static async getAll() {
        const response = await DraftColumn.find()
            .then((result) => {
                return result
            })
            .catch((e) => console.log(e))
        if (!response) {
            return null;
        }
        return response
    }

    static async delete(id) {
        await DraftColumn
            .deleteOne({ _id: id })
    }

    static async update({ id, draftcolumn }) {
        await DraftColumn
            .updateOne({ _id: id }, { $set: draftcolumn })
            .then((draftcolumnRes) => {
                return draftcolumnRes
            })
        const response = DraftColumn
            .findOne({ _id: id })
            .then((draftcolumnRes) => {
                return draftcolumnRes
            })
        if (!response) {
            return null;
        }
        return response
    }
}

export default DraftColumnRepository;
