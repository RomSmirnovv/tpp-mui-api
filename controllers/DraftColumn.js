import DraftColumnService from '../services/DraftColumn.js'
import ErrorsUtils from "../utils/Errors.js";

class DraftColumnController {

    static async create(req, res) {
        const draftcolumn = req.body
        try {
            const newDraftColumn = await DraftColumnService.create(draftcolumn)
            return res.status(200).json(newDraftColumn);
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }

    static async getOne(req, res) {
        const { id } = req.params
        try {
            const draftcolumn = await DraftColumnService.getOne(id)
            return res.status(200).json(draftcolumn);
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }


    static async getAll(req, res) {
        try {
            const draftcolumn = await DraftColumnService.getAll()
            return res.status(200).json(draftcolumn)
        } catch (err) {
            return ErrorsUtils.catchError(res, err)
        }
    }


    static async getAllByUser(req, res) {
        const { userId } = req.params
        try {
            const draftcolumn = await DraftColumnService.getAllByUser(userId)
            return res.status(200).json(draftcolumn)
        } catch (err) {
            return ErrorsUtils.catchError(res, err)
        }
    }

    static async delete(req, res) {
        const { id } = req.params
        try {
            await DraftColumnService.delete(id)
            return res.status(200).json(`Колонка с id = ${id} удалена!`)
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }

    static async update(req, res) {
        const { id } = req.params
        const draftcolumn = req.body
        try {
            const updateDraftColumn = await DraftColumnService.update({ id, draftcolumn })
            return res.status(200).json(updateDraftColumn);
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }
}

export default DraftColumnController