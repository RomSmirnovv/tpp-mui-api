import DraftService from '../services/Draft.js'
import ErrorsUtils from "../utils/Errors.js";
import { getWorkspaceIdFromRequest } from '../utils/getWorkspaceId.js';

class DraftController {

    static async create(req, res) {
        const draft = req.body
        try {
            // Получаем workspaceId из запроса
            const workspaceId = await getWorkspaceIdFromRequest(req);
            if (workspaceId) {
                draft.workspaceId = workspaceId;
            }
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
            // Получаем workspaceId из запроса для фильтрации
            const workspaceId = await getWorkspaceIdFromRequest(req);
            const draft = await DraftService.getAll(workspaceId)
            return res.status(200).json(draft)
        } catch (err) {
            return ErrorsUtils.catchError(res, err)
        }
    }


    static async getAllByUser(req, res) {
        const { userId } = req.params
        try {
            // Получаем workspaceId из запроса для фильтрации
            const workspaceId = await getWorkspaceIdFromRequest(req);
            const draft = await DraftService.getAllByUser(userId, workspaceId)
            return res.status(200).json(draft)
        } catch (err) {
            return ErrorsUtils.catchError(res, err)
        }
    }

    static async delete(req, res) {
        const { id } = req.params
        try {
            // Получаем workspaceId из запроса для проверки принадлежности
            const workspaceId = await getWorkspaceIdFromRequest(req);
            await DraftService.delete(id, workspaceId)
            return res.status(200).json(`Черновик с id = ${id} удален!`)
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }

    static async update(req, res) {
        const { id } = req.params
        const draft = req.body
        try {
            // Получаем workspaceId из запроса для проверки принадлежности
            const workspaceId = await getWorkspaceIdFromRequest(req);
            const updateDraft = await DraftService.update({ id, draft, workspaceId })
            return res.status(200).json(updateDraft);
        } catch (err) {
            return ErrorsUtils.catchError(res, err);
        }
    }
}

export default DraftController