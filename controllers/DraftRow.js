import DraftRowService from '../services/DraftRow.js'
import ErrorsUtils from "../utils/Errors.js";

class DraftRowController {

    static async create(req, res) {
        const draftrow = req.body
        try {
            const newDraftRow = await DraftRowService.create(draftrow)
            return res.status(200).json(newDraftRow);
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }

    static async getOne(req, res) {
        const { id } = req.params
        try {
            const draftrow = await DraftRowService.getOne(id)
            return res.status(200).json(draftrow);
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }


    static async getAll(req, res) {
        try {
            const draftrow = await DraftRowService.getAll()
            return res.status(200).json(draftrow)
        } catch (err) {
            return ErrorsUtils.catchError(res, err)
        }
    }


    static async getAllByDraft(req, res) {
        const { draftId } = req.params
        try {
            const draftrow = await DraftRowService.getAllByDraft(draftId)
            return res.status(200).json(draftrow)
        } catch (err) {
            return ErrorsUtils.catchError(res, err)
        }
    }

    static async delete(req, res) {
        const { id } = req.params
        try {
            await DraftRowService.delete(id)
            return res.status(200).json(`Строка с id = ${id} удалена!`)
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }

    static async update(req, res) {
        const { id } = req.params
        const draftrow = req.body
        try {
            const updateDraftRow = await DraftRowService.update({ id, draftrow })
            return res.status(200).json(updateDraftRow);
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }
}

export default DraftRowController