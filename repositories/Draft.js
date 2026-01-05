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

    static async getOne(id, workspaceId) {
        const query = { _id: id };
        if (workspaceId) {
            query.workspaceId = workspaceId;
        }
        const response = await Draft
            .findOne(query)
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

    static async getAllByUser(id, workspaceId) {
        const query = { userId: id };
        if (workspaceId) {
            query.workspaceId = workspaceId;
        }
        const response = await Draft
            .find(query)
            .then((draft) => {
                return draft
            })
        if (!response) {
            return null;
        }
        return response
    }

    static async getAll(workspaceId) {
        const query = {};
        if (workspaceId) {
            query.workspaceId = workspaceId;
        }
        const response = await Draft.find(query)
            .then((result) => {
                return result
            })
            .catch((e) => console.log(e))
        if (!response) {
            return null;
        }
        return response
    }

    static async delete(id, workspaceId) {
        const query = { _id: id };
        if (workspaceId) {
            query.workspaceId = workspaceId;
        }
        await Draft
            .deleteOne(query)
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
