import crypto from 'node:crypto';
import { RefreshSession } from '../models/session.js';

const hashToken = (token) =>
  crypto.createHash('sha256').update(String(token)).digest('hex');

class RefreshSessionRepository {
  static async createRefreshSession({ _id, refreshToken, fingerprint }) {
    return RefreshSession.create({
      user_id: String(_id),
      token_hash: hashToken(refreshToken),
      finger_print: String(fingerprint?.hash || ''),
    });
  }

  static async getRefreshSession(refreshToken) {
    if (!refreshToken) {
      return null;
    }

    return RefreshSession.findOne({ token_hash: hashToken(refreshToken) });
  }

  static async deleteRefreshSession(refreshToken) {
    if (!refreshToken) {
      return;
    }

    await RefreshSession.deleteOne({ token_hash: hashToken(refreshToken) });
  }

  static async deleteRefreshSessionsByUser(userId) {
    await RefreshSession.deleteMany({ user_id: String(userId) });
  }
}

export default RefreshSessionRepository;
