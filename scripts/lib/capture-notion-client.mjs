import { Client } from '@notionhq/client';
import { createHash } from 'node:crypto';
export const failures = [];
export const observations = new Map();
let queue = Promise.resolve();
let nextAllowed = 0;
export const notion = new Client({auth:process.env.NOTION_TOKEN,notionVersion:'2022-06-28',timeoutMs:30000,fetch:(url,init)=>{
 const call=queue.then(async()=>{
  await new Promise(r=>setTimeout(r,Math.max(0,nextAllowed-Date.now())));
  try { const response=await fetch(url,{...init,signal:AbortSignal.timeout(25000)}); if(!response.ok)failures.push('Notion HTTP '+response.status); return response; }
  catch(e){failures.push('Notion network failure');throw e;}
  finally { nextAllowed=Date.now()+400; }
 });queue=call.catch(()=>{});return call;
}});
const stable=value=>JSON.stringify(value,(key,v)=>['request_id','expiry_time'].includes(key)?undefined:typeof v==='string'&&v.startsWith('https://')&&/amazonaws|notion-static/.test(v)?v.split('?')[0]:v);
export async function queryNotion(parameters){
 try{
  const result=await notion.databases.query(parameters),key=JSON.stringify(parameters),hash=createHash('sha256').update(stable(result)).digest('hex');
  if(observations.has(key)&&observations.get(key)!==hash)throw Error('CMS changed during capture; try again after editing is finished');
  observations.set(key,hash);return result;
 }catch(e){failures.push('CMS query failed');throw e;}
}
export const queryNotionFresh=queryNotion;
export async function verifyUnchanged(){for(const key of [...observations.keys()])await queryNotion(JSON.parse(key));if(failures.length)throw Error('CMS capture incomplete');}
