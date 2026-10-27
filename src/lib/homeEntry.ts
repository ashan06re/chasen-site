/** Runs before the home DOM exists, so reload restoration cannot flash a lower section. */
export const homeEntryScript = `(()=>{
  if(!/^\\/(en\\/?)?$/.test(location.pathname))return;
  const navigation=performance.getEntriesByType('navigation')[0];
  if(navigation?.type==='back_forward')return;
  if(navigation?.type!=='reload' && location.hash && location.hash!=='#stores')return;
  if(location.hash)history.replaceState(history.state,'',location.pathname+location.search);
  history.scrollRestoration='manual';
  document.documentElement.dataset.homeEntry='top';
  scrollTo({top:0,left:0,behavior:'instant'});
  addEventListener('pageshow',()=>{
    scrollTo({top:0,left:0,behavior:'instant'});
  },{once:true});
})();`;
