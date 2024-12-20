import DraftService from '../services/Draft.js'
import ErrorsUtils from "../utils/Errors.js";

class DraftController {

    static async create(req, res) {
        const draft = req.body
        try {
            const newDraft = await DraftService.create(draft)
            return res.status(200).json(newDraft);
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }

    static async getOne(req, res) {
        const { id } = req.params
        try {
            const draft = await DraftService.getOne(id)
            return res.status(200).json(draft);
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }


    static async getAll(req, res) {
        try {
            const draft = await DraftService.getAll()
            return res.status(200).json(draft)
        } catch (err) {
            return ErrorsUtils.catchError(res, err)
        }
    }


    static async getAllByUser(req, res) {
        const { userId } = req.params
        try {
            const draft = await DraftService.getAllByUser(userId)
            return res.status(200).json(draft)
        } catch (err) {
            return ErrorsUtils.catchError(res, err)
        }
    }

    static async delete(req, res) {
        const { id } = req.params
        try {
            await DraftService.delete(id)
            return res.status(200).json(`Черновик с id = ${id} удален!`)
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }

    static async update(req, res) {
        const { id } = req.params
        const draft = req.body
        try {
            const updateDraft = await DraftService.update({ id, draft })
            return res.status(200).json(updateDraft);
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }
}

export default DraftController