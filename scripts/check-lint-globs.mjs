/** Contract used by typescript-estree's allowDefaultProject file selection. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const parserRequire=createRequire(require.resolve('@typescript-eslint/typescript-estree'));
const {minimatch}=parserRequire('minimatch');

test('patched parser glob dependency retains file selection and dot-file behavior',()=>{
 for(const [file,pattern,expected] of [
  ['eslint.config.mjs','*.mjs',true],['nested/config.mjs','*.mjs',false],
  ['.config.ts','*.ts',true],['config.js','*.{js,ts}',true],
  ['config.tsx','*.{js,ts}',false],['src/item.test.ts','**/*.test.ts',true],
  ['src/item.ts','**/*.test.ts',false],['src/.hidden/item.ts','src/**/*.ts',true],
 ])assert.equal(minimatch(file,pattern,{dot:true}),expected,`${file} / ${pattern}`);
});
