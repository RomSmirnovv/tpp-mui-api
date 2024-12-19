import mongoose from 'mongoose';
import { DraftRow } from '../models/draft_rows.js'

class DraftColumnRepository {


    static async create(draftrow) {
        const newDraftRow = new DraftRow(draftrow)
        const response = await newDraftRow
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
        const response = await DraftRow
            .findOne({ _id: id })
            .then((draftrow) => {
                return draftrow
            })
        if (!response) {
            return null;
        }
        return response
    }

    static async getOneByName(name) {
        const response = await DraftRow
            .findOne({ name: name })
            .then((draftrow) => {
                return draftrow
            })
        if (!response) {
            return null;
        }
        return response
    }

    static async getAllByUser(id) {
        const response = await DraftRow
            .find({ userId: id })
            .then((draftrow) => {
                return draftrow
            })
        if (!response) {
            return null;
        }
        return response
    }

    static async getAll() {
        const response = await DraftRow.find()
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
        await DraftRow
            .deleteOne({ _id: id })
    }

    static async update({ id, draftrow }) {
        await DraftRow
            .updateOne({ _id: id }, { $set: draftrow })
            .then((draftrowRes) => {
                return draftrowRes
            })
        const response = DraftRow
            .findOne({ _id: id })
            .then((draftrowRes) => {
                return draftrowRes
            })
        if (!response) {
            return null;
        }
        return response
    }
}

export default DraftColumnRepository;
