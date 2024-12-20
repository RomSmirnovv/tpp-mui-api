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

    static async getAllByUser(userId) {
        const response = await DraftRepository.getAllByUser(userId)
        return response
    }

    static async getAll() {
        const response = await DraftRepository.getAll()
        return response
    }

    static async delete(id) {
        const draftData = await DraftRepository.getOne(id);
        if (!draftData) {
            throw new Conflict("Нет черновика с таким ID");
        }
        await DraftRepository.delete(id)
    }

    static async update({ id, draft }) {
        const draftData = await DraftRepository.getOne(id);
        if (!draftData) {
            throw new Conflict("Нет черновика с таким ID");
        }

        const response = await DraftRepository.update({ id, draft })
        return response
    }
}

export default DraftService