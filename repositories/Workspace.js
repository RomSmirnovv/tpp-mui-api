import mongoose from 'mongoose';
import { Workspace } from '../models/workspace.js';

class WorkspaceRepository {
	static async createWorkspace(workspaceData) {
		const workspace = new Workspace(workspaceData);
		const response = await workspace
			.save()
			.then((result) => {
				return result;
			})
			.catch((e) => {
				console.log('Error creating workspace:', e);
				throw e;
			});
		
		if (!response) {
			return null;
		}
		return response;
	}

	static async getWorkspaceById(_id) {
		const response = await Workspace
			.findOne({ _id })
			.then((workspace) => {
				return workspace;
			})
			.catch((e) => {
				console.log('Error getting workspace:', e);
				return null;
			});
		
		return response;
	}

	static async getWorkspaceByEmail(email) {
		const response = await Workspace
			.findOne({ email: email.toLowerCase() })
			.then((workspace) => {
				return workspace;
			})
			.catch((e) => {
				console.log('Error getting workspace by email:', e);
				return null;
			});
		
		return response;
	}

	static async updateWorkspace(_id, updateData) {
		const response = await Workspace
			.findOneAndUpdate(
				{ _id },
				{ $set: updateData },
				{ new: true }
			)
			.then((workspace) => {
				return workspace;
			})
			.catch((e) => {
				console.log('Error updating workspace:', e);
				return null;
			});
		
		return response;
	}

	static async deleteWorkspace(_id) {
		const response = await Workspace
			.deleteOne({ _id })
			.then((result) => {
				return result;
			})
			.catch((e) => {
				console.log('Error deleting workspace:', e);
				return null;
			});
		
		return response;
	}

	/**
	 * Получить workspace по userId (найти workspace, где пользователь является админом)
	 */
	static async getWorkspaceByUserId(userId) {
		const { User } = await import('../models/user.js');
		const user = await User.findOne({ _id: userId });
		if (!user) {
			return null;
		}
		
		// Если у пользователя есть workspaceId, используем его
		if (user.workspaceId) {
			const workspace = await this.getWorkspaceById(user.workspaceId);
			if (workspace) {
				return workspace;
			}
		}
		
		// Если пользователь админ (role 2), ищем workspace где он админ
		if (user.role === 2) {
			// Ищем workspace, где есть админ с таким userId
			const adminUser = await User.findOne({ 
				_id: userId,
				role: 2 
			});
			
			if (adminUser && adminUser.workspaceId) {
				return await this.getWorkspaceById(adminUser.workspaceId);
			}
			
			// Альтернативный способ: ищем все workspace и проверяем админов
			const allWorkspaces = await Workspace.find();
			for (const workspace of allWorkspaces) {
				const workspaceAdmin = await User.findOne({ 
					workspaceId: workspace._id,
					_id: userId,
					role: 2 
				});
				if (workspaceAdmin) {
					return workspace;
				}
			}
		}
		
		return null;
	}
}

export default WorkspaceRepository;
