// Additive, resumable schema migration. No product/page/publication writes.
// node scripts/setup-menu-photo-display.mjs [--apply]
import { Client, LogLevel } from '@notionhq/client';
import nextEnv from '@next/env';
import assert from 'node:assert/strict';
nextEnv.loadEnvConfig(process.cwd());
const property = '写真の表示';
const choices = ['表示する', '表示しない'];
const description = '写真だけの表示設定。未設定は表示する扱い。表示しないでも品名・説明・価格は残り、元の写真は削除しません。日英は別設定。英語の写真が空なら、写真表示中の対応日本語商品から補います。変更は次の確認版取得・公開後に反映されます。';
const client = new Client({ auth: process.env.NOTION_TOKEN, notionVersion: '2022-06-28', logLevel: LogLevel.ERROR });
try {
  const planned = [];
  for (const [store, key] of [['高台寺店', 'NOTION_KYOTO_MENU_DB_ID'], ['熊本店', 'NOTION_KUMAMOTO_MENU_DB_ID']]) {
    const database_id = process.env[key];
    assert.ok(database_id && process.env.NOTION_TOKEN, 'CMS configuration missing');
    const db = await client.databases.retrieve({ database_id });
    assert.equal(db.properties['メニュー名']?.type, 'title');
    assert.equal(db.properties['写真']?.type, 'files');
    assert.equal(db.properties['表示する']?.type, 'checkbox');
    const field = db.properties[property];
    if (field) assert.equal(field.type, 'select', 'Existing photo property has another type; review required');
    const existing = field?.select.options ?? [];
    const options = [...existing.map(({ id, name, color }) => ({ id, name, color })),
      ...choices.filter(name => !existing.some(o => o.name === name)).map(name => ({ name, color: name === '表示する' ? 'green' : 'gray' }))];
    planned.push({ store, database_id, db, field, options });
  }
  for (const { store, database_id, db, field, options } of planned) {
    const needsUpdate = !field || choices.some(name => !field.select.options.some(o => o.name === name)) || field.description !== description;
    if (process.argv.includes('--apply') && needsUpdate) {
      await client.databases.update({ database_id, properties: { [property]: { select: { options }, description } } });
      const saved = await client.databases.retrieve({ database_id });
      assert.equal(saved.properties[property].type, 'select');
      for (const choice of choices) assert.ok(saved.properties[property].select.options.some(o => o.name === choice));
      assert.equal(saved.properties[property].description, description);
      for (const [name, before] of Object.entries(db.properties)) {
        if (name !== property) assert.deepEqual(saved.properties[name], before, `Other schema changed: ${name}`);
      }
    }
    console.log(JSON.stringify({ store, database_id, property, choices, action: !needsUpdate ? 'already_configured' : process.argv.includes('--apply') ? 'added_and_verified' : 'would_add_or_complete', pageWrites: 0, publicationWrites: 0 }));
  }
} catch (error) {
  console.error(JSON.stringify({ error: error.code || error.name, message: error.code ? 'Notion request failed; inspect access and retry the additive migration.' : error.message }));
  process.exitCode = 1;
}
