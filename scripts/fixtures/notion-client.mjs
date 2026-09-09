// Read-only in-memory CMS used by integration tests. Never calls the live API.
export const notion = {};
let handler;
export const calls = [];
export function respond(fn) { handler=fn; calls.length=0; }
export async function queryNotion(params) { calls.push({...params,fresh:false}); return handler(params); }
export async function queryNotionFresh(params) { calls.push({...params,fresh:true}); return handler(params); }
