import mongoose from 'mongoose';
import ErrorsUtils, { Forbidden, NotFound } from '../utils/Errors.js';
import { isAdmin } from './auth.js';
import { Draft } from '../models/draft.js';
import { Company } from '../models/company.js';

const asId = (value) => String(value || '');

const getRecord = async (Model, id, label) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFound(`${label} не найден`);
  }

  const record = await Model.findById(id);
  if (!record) {
    throw new NotFound(`${label} не найден`);
  }

  return record;
};

const ensureOwner = (req, record, ownerField, label) => {
  if (isAdmin(req)) {
    return;
  }

  if (asId(record[ownerField]) !== req.auth.userId) {
    throw new Forbidden(`Нет доступа: ${label} принадлежит другому пользователю`);
  }
};

export const requireOwnedRecord = (Model, options = {}) => async (req, res, next) => {
  try {
    const id = req.params?.[options.idParam || 'id'];
    const record = await getRecord(Model, id, options.label || 'Запись');

    ensureOwner(req, record, options.ownerField || 'userId', options.label || 'запись');

    req.resource = record;
    return next();
  } catch (error) {
    return ErrorsUtils.catchError(res, error);
  }
};

export const requireOwnedBodyRecord = (Model, options = {}) => async (req, res, next) => {
  try {
    const id = req.body?.[options.idField || '_id'];
    const record = await getRecord(Model, id, options.label || 'Запись');

    ensureOwner(req, record, options.ownerField || 'userId', options.label || 'запись');

    req.resource = record;
    return next();
  } catch (error) {
    return ErrorsUtils.catchError(res, error);
  }
};

export const requireDraftByParam = (paramName = 'draftId') => async (req, res, next) => {
  try {
    const draft = await getRecord(Draft, req.params?.[paramName], 'Черновик');
    ensureOwner(req, draft, 'userId', 'черновик');
    req.draft = draft;
    return next();
  } catch (error) {
    return ErrorsUtils.catchError(res, error);
  }
};

export const requireDraftFromBody = async (req, res, next) => {
  try {
    const draftId = req.body?.draftId;
    const draft = await getRecord(Draft, draftId, 'Черновик');
    ensureOwner(req, draft, 'userId', 'черновик');
    req.draft = draft;
    return next();
  } catch (error) {
    return ErrorsUtils.catchError(res, error);
  }
};


export const requireCompanyFromBody = async (req, res, next) => {
  try {
    const company = await getRecord(Company, req.body?.companyId, 'Компания');
    ensureOwner(req, company, 'userId', 'компания');
    req.company = company;
    return next();
  } catch (error) {
    return ErrorsUtils.catchError(res, error);
  }
};

const roomContainsUser = (room, userId) => {
  const members = String(room || '')
    .split('-')
    .map((item) => item.trim())
    .filter(Boolean);

  return String(room || '') === 'all-chat' || members.includes(String(userId));
};

export const requireRoomParticipant = (paramName = 'room') => (req, res, next) => {
  if (isAdmin(req) || roomContainsUser(req.params?.[paramName], req.auth.userId)) {
    return next();
  }

  return ErrorsUtils.catchError(res, new Forbidden('Нет доступа к этой переписке'));
};

export const protectMessageBody = (req, res, next) => {
  const room = req.body?.room;

  if (!isAdmin(req) && !roomContainsUser(room, req.auth.userId)) {
    return ErrorsUtils.catchError(res, new Forbidden('Нет доступа к этой переписке'));
  }

  if (!isAdmin(req)) {
    req.body ||= {};
    req.body.userId = req.auth.userId;
    req.body.fullName = req.auth.fullName;
  }

  return next();
};

export const roomIncludesCurrentUser = roomContainsUser;
