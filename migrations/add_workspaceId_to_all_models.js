import mongoose from 'mongoose';
import config from '../config/env.js';
import { Column } from '../models/column.js';
import { Company } from '../models/company.js';
import { Draft } from '../models/draft.js';
import { DraftColumn } from '../models/draft_columns.js';
import { DraftRow } from '../models/draft_rows.js';
import { List } from '../models/list.js';
import { Message } from '../models/message.js';
import { Notification } from '../models/notification.js';

const WORKSPACE_ID = '6958b073759d3f087f88b363';

async function addWorkspaceIdToAllModels() {
    try {
        await mongoose.connect(config.database.url);
        console.log('✅ Подключено к MongoDB для миграции.');

        const workspaceObjectId = new mongoose.Types.ObjectId(WORKSPACE_ID);

        // Проверяем существование workspace
        const { Workspace } = await import('../models/workspace.js');
        const workspace = await Workspace.findById(workspaceObjectId);
        if (!workspace) {
            console.error(`❌ Workspace с ID ${WORKSPACE_ID} не найден!`);
            process.exit(1);
        }
        console.log(`✅ Workspace найден: ${workspace.name}`);

        // 1. Columns
        console.log('\n📊 Обновление Columns...');
        const columnsResult = await Column.updateMany(
            { workspaceId: { $exists: false } },
            { $set: { workspaceId: workspaceObjectId } }
        );
        console.log(`   ✅ Обновлено ${columnsResult.modifiedCount} колонок`);

        // 2. Companies (уже имеют workspaceId, но проверим)
        console.log('\n🏢 Обновление Companies...');
        const companiesResult = await Company.updateMany(
            { workspaceId: { $exists: false } },
            { $set: { workspaceId: workspaceObjectId } }
        );
        console.log(`   ✅ Обновлено ${companiesResult.modifiedCount} компаний`);

        // 3. Drafts
        console.log('\n📝 Обновление Drafts...');
        const draftsResult = await Draft.updateMany(
            { workspaceId: { $exists: false } },
            { $set: { workspaceId: workspaceObjectId } }
        );
        console.log(`   ✅ Обновлено ${draftsResult.modifiedCount} черновиков`);

        // 4. DraftColumns
        console.log('\n📋 Обновление DraftColumns...');
        const draftColumnsResult = await DraftColumn.updateMany(
            { workspaceId: { $exists: false } },
            { $set: { workspaceId: workspaceObjectId } }
        );
        console.log(`   ✅ Обновлено ${draftColumnsResult.modifiedCount} колонок черновиков`);

        // 5. DraftRows
        console.log('\n📄 Обновление DraftRows...');
        const draftRowsResult = await DraftRow.updateMany(
            { workspaceId: { $exists: false } },
            { $set: { workspaceId: workspaceObjectId } }
        );
        console.log(`   ✅ Обновлено ${draftRowsResult.modifiedCount} строк черновиков`);

        // 6. Lists
        console.log('\n📑 Обновление Lists...');
        const listsResult = await List.updateMany(
            { workspaceId: { $exists: false } },
            { $set: { workspaceId: workspaceObjectId } }
        );
        console.log(`   ✅ Обновлено ${listsResult.modifiedCount} листов`);

        // 7. Messages
        console.log('\n💬 Обновление Messages...');
        const messagesResult = await Message.updateMany(
            { workspaceId: { $exists: false } },
            { $set: { workspaceId: workspaceObjectId } }
        );
        console.log(`   ✅ Обновлено ${messagesResult.modifiedCount} сообщений`);

        // 8. Notifications
        console.log('\n🔔 Обновление Notifications...');
        const notificationsResult = await Notification.updateMany(
            { workspaceId: { $exists: false } },
            { $set: { workspaceId: workspaceObjectId } }
        );
        console.log(`   ✅ Обновлено ${notificationsResult.modifiedCount} уведомлений`);

        console.log('\n✅ Миграция успешно завершена!');
    } catch (error) {
        console.error('❌ Ошибка при выполнении миграции:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Отключено от MongoDB.');
    }
}

addWorkspaceIdToAllModels();
