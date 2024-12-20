import DraftRowRepository from '../repositories/DraftRow.js';
import { Conflict } from '../utils/Errors.js'

class DraftRowService {

    static async create(draftrow) {
        const response = await DraftRowRepository.create(draftrow)
        return response
    }

    static async getOne(id) {
        const response = await DraftRowRepository.getOne(id)
        return response
    }

    static async getAllByDraft(draftId) {
        const response = await DraftRowRepository.getAllByDraft(draftId)
        return response
    }

    static async getAll() {
        const response = await DraftRowRepository.getAll()
        return response
    }

    static async delete(id) {
        const drafrowData = await DraftRowRepository.getOne(id);
        if (!drafrowData) {
            throw new Conflict("Нет строки с таким ID");
        }
        await DraftRowRepository.delete(id)
    }

    static async update({ id, draftrow }) {
        const drafrowData = await DraftRowRepository.getOne(id);
        if (!drafrowData) {
            throw new Conflict("Нет строки с таким ID");
        }

        const response = await DraftRowRepository.update({ id, draftrow })
        return response
    }
}

export default DraftRowService