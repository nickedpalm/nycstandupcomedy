// Neighborhoods directory: every room we track, by borough and neighborhood, with this week's picks,
// weekly rooms and open mics for each. Data: venues, picks, recurring, open-mics, clubs.
const element=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
function safeURL(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}}
const load=path=>fetch(path).then(r=>r.ok?r.json():[]).catch(()=>[]);
const WEEKDAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const BOROUGHS=['Manhattan','Brooklyn','Queens','Bronx','Staten Island'];
const dateLabel=day=>new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',month:'short',day:'numeric'}).format(new Date(day+'T12:00:00-04:00'));
const root=document.querySelector('#areas');const select=document.querySelector('#neighborhood');const count=document.querySelector('#result-count');
Promise.all(['/data/venues.json','/data/picks.json','/data/recurring.json','/data/open-mics.json','/data/clubs.json'].map(load)).then(([venues,picks,rooms,mics,clubs])=>{
 const now=Date.now();const hood=new Map(venues.map(v=>[v.name,v.neighborhood]));
 const upcoming=picks.filter(p=>Date.parse(p.ends_at)>now).map(p=>({...p,neighborhood:hood.get(p.venue)||p.neighborhood})).sort((a,b)=>a.starts_at.localeCompare(b.starts_at));
 const fix=r=>({...r,neighborhood:hood.get(r.venue)||r.neighborhood});rooms=rooms.map(fix);mics=mics.map(fix);
 const areas=new Map();
 for(const v of venues){const key=v.neighborhood;if(!areas.has(key))areas.set(key,{name:key,borough:v.borough,venues:[],picks:[],rooms:[],mics:[],clubs:[]});areas.get(key).venues.push(v);}
 for(const p of upcoming){if(areas.has(p.neighborhood))areas.get(p.neighborhood).picks.push(p);}
 for(const r of rooms){if(areas.has(r.neighborhood))areas.get(r.neighborhood).rooms.push(r);}
 for(const m of mics){if(areas.has(m.neighborhood))areas.get(m.neighborhood).mics.push(m);}
 for(const c of clubs){const n=(c.neighborhood||'').split(' · ')[0];if(areas.has(n))areas.get(n).clubs.push(c);}
 if(select){for(const b of BOROUGHS){const names=[...areas.values()].filter(a=>a.borough===b).map(a=>a.name).sort();if(!names.length)continue;const g=document.createElement('optgroup');g.label=b;names.forEach(n=>{const o=element('option',n);o.value=n;g.append(o);});select.append(g);}
  const wanted=new URLSearchParams(location.search).get('area');if(wanted&&areas.has(wanted))select.value=wanted;select.addEventListener('change',()=>{const u=new URL(location.href);select.value?u.searchParams.set('area',select.value):u.searchParams.delete('area');history.replaceState(null,'',u);render();});}
 const link=(text,url)=>{const u=safeURL(url);if(!u)return element('span',text);const a=element('a',text);a.href=u;a.target='_blank';a.rel='noopener noreferrer';return a;};
 const row=(time,titleNode,detail)=>{const li=element('li',undefined,'area-row');li.append(element('span',time,'area-time'),titleNode,element('span',detail,'area-detail'));return li;};
 function block(area,full){
  const section=element('section',undefined,'day area');section.id='area-'+area.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const h=element('h3',area.name);const a=element('a',area.name);a.href='/neighborhoods.html?area='+encodeURIComponent(area.name);h.replaceChildren(a,element('span',' · '+area.borough,'area-borough'));section.append(h);
  const summary=[area.picks.length?area.picks.length+' pick'+(area.picks.length===1?'':'s')+' this week':null,area.rooms.length?area.rooms.length+' weekly show'+(area.rooms.length===1?'':'s'):null,area.mics.length?area.mics.length+' open mic'+(area.mics.length===1?'':'s'):null,area.venues.length+' room'+(area.venues.length===1?'':'s')].filter(Boolean).join(' · ');
  section.append(element('p',summary,'area-summary'));
  if(!full)return section;
  if(area.picks.length){section.append(element('h4','This week'));const ul=element('ul',undefined,'area-list');area.picks.forEach(p=>ul.append(row(dateLabel(p.date)+' · '+p.time_label,link(p.title,p.ticket_url||p.source_url),p.venue+' · '+p.price_label)));section.append(ul);}
  if(area.rooms.length){section.append(element('h4','Every week'));const ul=element('ul',undefined,'area-list');area.rooms.sort((x,y)=>x.weekday-y.weekday).forEach(r=>ul.append(row(WEEKDAYS[r.weekday]+' · '+r.time_label,link(r.title,r.source_url),r.venue+' · '+r.price_label)));section.append(ul);}
  if(area.mics.length){section.append(element('h4','Open mics'));const ul=element('ul',undefined,'area-list');area.mics.sort((x,y)=>x.weekday-y.weekday).forEach(m=>ul.append(row(WEEKDAYS[m.weekday]+' · '+(m.time_label||m.cadence),link(m.title,m.source_url),m.venue+' · '+m.cost_label)));section.append(ul);}
  section.append(element('h4','Rooms'));const ul=element('ul',undefined,'area-list');area.venues.sort((x,y)=>x.name.localeCompare(y.name)).forEach(v=>{const url=v.calendar_url||v.website;ul.append(row(v.clubs?'':'',link(v.name,url),v.address+(v.note&&/no (usable )?(web)?site|closed/i.test(v.note)?' · no events page':'')));});section.append(ul);
  return section;
 }
 function render(){root.replaceChildren();const chosen=select?.value;
  if(chosen&&areas.has(chosen)){root.append(block(areas.get(chosen),true));if(count)count.textContent=chosen+' · '+areas.get(chosen).venues.length+' rooms';return;}
  let total=0;for(const b of BOROUGHS){const list=[...areas.values()].filter(a=>a.borough===b).sort((x,y)=>(y.picks.length+y.rooms.length+y.mics.length)-(x.picks.length+x.rooms.length+x.mics.length)||x.name.localeCompare(y.name));if(!list.length)continue;total+=list.length;root.append(element('h2',b,'section-heading'));list.forEach(a=>root.append(block(a,false)));}
  if(count)count.textContent=total+' neighborhoods · '+venues.length+' rooms across the five boroughs';}
 render();
}).catch(()=>{root.replaceChildren(element('p','The neighborhood index could not load. Try again shortly.','empty'));});
