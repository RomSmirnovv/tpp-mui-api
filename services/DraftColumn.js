import DraftColumnRepository from '../repositories/DraftColumn.js';
import { Conflict } from '../utils/Errors.js'

class DraftColumnService {

    static async create(draftcolumn) {
        const response = await DraftColumnRepository.create(draftcolumn)
        return response
    }

    static async getOne(id) {
        const response = await DraftColumnRepository.getOne(id)
        return response
    }

    static async getAllByDraft(draftId) {
        const response = await DraftColumnRepository.getAllByDraft(draftId)
        return response
    }

    static async getAll() {
        const response = await DraftColumnRepository.getAll()
        return response
    }

    static async delete(id) {
        const draftcolumnData = await DraftColumnRepository.getOne(id);
        if (!draftcolumnData) {
            throw new Conflict("Нет колонки с таким ID");
        }
        await DraftColumnRepository.delete(id)
    }

    static async update({ id, draftcolumn }) {
        const draftcolumnData = await DraftColumnRepository.getOne(id);
        if (!draftcolumnData) {
            throw new Conflict("Нет колонки с таким ID");
        }

        const response = await DraftColumnRepository.update({ id, draftcolumn })
        return response
    }
}

export default DraftColumnService