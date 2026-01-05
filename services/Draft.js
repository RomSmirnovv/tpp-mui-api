import DraftRepository from '../repositories/Draft.js';
import { Conflict } from '../utils/Errors.js'

class DraftService {

    static async create(draft) {
        const response = await DraftRepository.create(draft)
        return response
    }

    static async getOne(id) {
        const response = await DraftRepository.getOne(id)
        return response
    }

    static async getAllByUser(userId, workspaceId) {
        const response = await DraftRepository.getAllByUser(userId, workspaceId)
        return response
    }

    static async getAll(workspaceId) {
        const response = await DraftRepository.getAll(workspaceId)
        return response
    }

    static async delete(id, workspaceId) {
        const draftData = await DraftRepository.getOne(id, workspaceId);
        if (!draftData) {
            throw new Conflict("Нет черновика с таким ID");
        }
        await DraftRepository.delete(id, workspaceId)
    }

    static async update({ id, draft, workspaceId }) {
        const draftData = await DraftRepository.getOne(id, workspaceId);
        if (!draftData) {
            throw new Conflict("Нет черновика с таким ID");
        }

        const response = await DraftRepository.update({ id, draft })
        return response
    }
}

export default DraftService