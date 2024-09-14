import { RefreshSession } from '../models/session.js'

class RefreshSessionRepository {

	static async createRefreshSession({ _id, refreshToken, fingerprint }) {
		const refreshSession = await new RefreshSession({ user_id: _id, refresh_token: refreshToken, finger_print: fingerprint.hash })

		refreshSession
			.save()
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))

	}


	static async getRefreshSession(refreshToken) {
		const response = await RefreshSession
			.findOne({ refresh_token: refreshToken })
			.then((session) => {
				return session
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async deleteRefreshSession(refreshToken) {
		await RefreshSession
			.deleteOne({ refresh_token: refreshToken })
	}
}

export default RefreshSessionRepository;
