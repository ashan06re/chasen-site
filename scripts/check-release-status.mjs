/** Compare a deployed receipt with the checked-out edition. Read-only. */
import {readFile} from 'node:fs/promises';
const release=JSON.parse(await readFile(new URL('../src/content/cms-release.json',import.meta.url),'utf8'));
const target=process.argv[2];
if(!target)throw Error('Usage: npm run cms:status -- https://reviewed-site.example');
const url=new URL(target);
if(url.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(url.hostname))throw Error('HTTPS required');
url.pathname='/api/cms-release';url.search='';url.hash='';
const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(20000)});
if(!response.ok)throw Error('Receipt unavailable: HTTP '+response.status);
const receipt=await response.json();
const matches=receipt.revision===release.revision;
console.log(JSON.stringify({site:url.origin,expected:release.revision,actual:receipt.revision,capturedAt:receipt.capturedAt,matches},null,2));
if(!matches)process.exitCode=1;
