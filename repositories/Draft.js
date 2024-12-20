import mongoose from 'mongoose';
import { Draft } from '../models/draft.js'

class DraftRepository {

    static async create(draft) {
        const newDraft = new Draft(draft)
        const response = await newDraft
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
        const response = await Draft
            .findOne({ _id: id })
            .then((draft) => {
                return draft
            })
        if (!response) {
            return null;
        }
        return response
    }

    static async getOneByName(name) {
        const response = await Draft
            .findOne({ name: name })
            .then((draft) => {
                return draft
            })
        if (!response) {
            return null;
        }
        return response
    }

    static async getAllByUser(id) {
        const response = await Draft
            .find({ userId: id })
            .then((draft) => {
                return draft
            })
        if (!response) {
            return null;
        }
        return response
    }

    static async getAll() {
        const response = await Draft.find()
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
        await Draft
            .deleteOne({ _id: id })
    }

    static async update({ id, draft }) {
        await Draft
            .updateOne({ _id: id }, { $set: draft })
            .then((draftRes) => {
                return draftRes
            })
        const response = Draft
            .findOne({ _id: id })
            .then((draftRes) => {
                return draftRes
            })
        if (!response) {
            return null;
        }
        return response
    }
}

export default DraftRepository;
