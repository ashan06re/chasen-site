/** Verify the exact local production build; never targets a deployed alias. */
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const port=3109,base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{cwd:root,stdio:['ignore','pipe','pipe'],env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
let output='',failure=null;
server.stdout.on('data',b=>{output=(output+b).slice(-4000);});server.stderr.on('data',b=>{output=(output+b).slice(-4000);});server.on('error',e=>{failure=e;});
function check(file){return new Promise((resolve,reject)=>{const child=spawn(process.execPath,[file,base],{cwd:root,stdio:'inherit'});child.on('error',reject);child.on('exit',(code,signal)=>code===0?resolve():reject(Error(`${file} failed (${code??signal})`)));});}
try{
 let ready=false;
 for(let n=0;n<120;n++){
  if(failure||server.exitCode!==null)throw failure||Error('Local server could not start: '+output);
  try{const response=await fetch(base,{signal:AbortSignal.timeout(500)});await response.text();ready=response.status===200;}catch{}
  if(ready){await delay(100);if(server.exitCode!==null)throw Error('Local server exited; refusing to test another process');break;}
  await delay(250);
 }
 if(!ready)throw Error('Local server did not become ready');
 const checks=await Promise.allSettled([check('scripts/check-routes.mjs'),check('scripts/check-security.mjs')]);
 const failed=checks.find(x=>x.status==='rejected');if(failed)throw failed.reason;
 console.log('PASS local production build: routes, language links, assets and security');
}finally{
 if(server.exitCode===null){const ended=new Promise(resolve=>server.once('exit',resolve));server.kill('SIGTERM');await Promise.race([ended,delay(3000)]);if(server.exitCode===null)server.kill('SIGKILL');}
}
