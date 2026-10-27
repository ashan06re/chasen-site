import assert from 'node:assert/strict';
import {test} from 'node:test';
import vm from 'node:vm';
import {homeEntryScript} from '../src/lib/homeEntry.ts';
import {isSamePageTopLink} from '../src/lib/navigationTarget.ts';

test('logo navigation from contact resets both languages without intercepting anchors or other destinations',()=>{
 for(const path of ['/','/en']){
  const current=new URL('https://example.com'+path+'#contact');
  assert.equal(isSamePageTopLink(current,new URL('https://example.com'+path)),true);
  for(const suffix of ['#stores','?draft=1','/stores/kyoto'])assert.equal(isSamePageTopLink(current,new URL('https://example.com'+path+suffix)),false);
  assert.equal(isSamePageTopLink(current,new URL('https://other.example'+path)),false);
 }
});

function enter(pathname,hash='',type='navigate'){
 const calls=[],listeners={};const location={pathname,hash,search:'?view=preview'};
 const history={state:{preserve:true},scrollRestoration:'auto',replaceState(state,unused,url){calls.push(['url',url,state]);location.hash='';}};
 vm.runInNewContext(homeEntryScript,{location,history,document:{documentElement:{dataset:{}}},performance:{getEntriesByType:()=>[{type}]},scrollTo:options=>calls.push(['scroll',options.top]),addEventListener:(name,fn)=>listeners[name]=fn});
 return {calls,listeners,history};
}
test('fresh home and reload start at the top, including the previously shared stores URL',()=>{
 for(const path of ['/','/en','/en/'])for(const [hash,type]of [['','navigate'],['#stores','navigate'],['#contact','reload'],['','reload']]){
  const e=enter(path,hash,type);assert.equal(e.history.scrollRestoration,'manual');
  assert.deepEqual(e.calls.filter(c=>c[0]==='scroll'),[['scroll',0]]);
  if(hash)assert.equal(e.calls[0][1],path+'?view=preview');
  e.listeners.pageshow();assert.equal(e.history.scrollRestoration,'manual');
 }
});
test('explicit contact deep links, store routes and back/forward retain their destination',()=>{
 for(const args of [['/','#contact'],['/en','#brand'],['/stores/kyoto','#access'],['/','#stores','back_forward'],['/','','back_forward']])assert.deepEqual(enter(...args).calls,[]);
});
