const container = document.querySelector('#listings');
const dateFormatter = new Intl.DateTimeFormat('en-CA', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'});
const today = dateFormatter.format(new Date());
let picks = [], filter = 'all';
let saved;
try { const value=JSON.parse(localStorage.getItem('comedy-saved')||'[]'); saved=new Set(Array.isArray(value)?value:[]); } catch {saved=new Set();}
const element=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
function safeURL(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}}
function dateLabel(day){return new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'long',month:'long',day:'numeric'}).format(new Date(day+'T12:00:00-04:00'));}
function isWeekend(day){const d=new Date(day+'T12:00:00Z');const current=new Date(today+'T12:00:00Z');const weekday=current.getUTCDay();const start=new Date(current);start.setUTCDate(start.getUTCDate()+(weekday===0?-2:weekday===6?-1:5-weekday));const end=new Date(start);end.setUTCDate(end.getUTCDate()+2);return d>=start&&d<=end;}
function poster(pick,withCredit=true){
 if(!pick.poster || !/^\/assets\/posters\/[a-z0-9.-]+$/.test(pick.poster.src))return null;
 const figure=element('figure',undefined,'show-flyer');
 const link=element('a');link.href=pick.poster.src;link.target='_blank';link.rel='noopener';link.setAttribute('aria-label','Open full poster for '+pick.title);
 const img=element('img');img.src=pick.poster.src;img.alt=pick.poster.alt||('Promotional artwork for '+pick.title);img.width=pick.poster.width;img.height=pick.poster.height;img.loading='lazy';img.decoding='async';img.addEventListener('error',()=>figure.remove(),{once:true});link.append(img);figure.append(link);
 if(withCredit){const source=safeURL(pick.poster.source_url);if(source){const credit=element('figcaption');const a=element('a',pick.poster.credit||'Poster source');a.href=source;a.target='_blank';a.rel='noopener noreferrer';credit.append(a);figure.append(credit);}}
 return figure;
}
function ticketLink(pick){const url=safeURL(pick.ticket_url);if(!url)return null;const a=element('a',pick.link_label||'Tickets & details ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',(pick.link_label?'Event listing for ':'Tickets and details for ')+pick.title);return a;}
const WEEKDAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const todayWeekday=new Date(today+'T12:00:00Z').getUTCDay();
let rooms=null;
function loadRooms(){if(rooms)return rooms;rooms=Promise.all(['/data/recurring.json','/data/open-mics.json'].map(path=>fetch(path).then(r=>r.ok?r.json():[]).catch(()=>[]))).then(([recurring,mics])=>[...recurring,...mics].filter(r=>Number(r.weekday)===todayWeekday));return rooms;}
function listing(pick){
 const article=element('article',undefined,'pick listing-row');article.id='show-'+pick.id;
 const landscape=pick.poster&&Number(pick.poster.width)>Number(pick.poster.height);const art=landscape?null:poster(pick,false);if(art){art.classList.add('listing-thumb');article.append(art);}
 const body=element('div',undefined,'listing-body');const time=element('p',pick.time_label,'pick-time');if(pick.sponsored)time.append(element('span','Paid listing','paid-tag'));body.append(time,element('h4',pick.title,'pick-title'),element('p',pick.description,'pick-description'));
 const details=element('p',undefined,'pick-detail');details.append(document.createTextNode(pick.venue+' · '+pick.neighborhood+' · '),element('span',pick.price_label,'price-tag'));body.append(details);
 const actions=element('div',undefined,'pick-actions'),ticket=ticketLink(pick);if(ticket)actions.append(ticket);
 if(pick.poster){const source=safeURL(pick.poster.source_url);if(source){const credit=element('a','Flyer source');credit.href=source;credit.target='_blank';credit.rel='noopener noreferrer';credit.className='flyer-credit';actions.append(credit);}}
 const save=element('button',saved.has(pick.id)?'Saved ✓':'Save','save');save.type='button';save.dataset.saveId=pick.id;save.setAttribute('aria-label',(saved.has(pick.id)?'Unsave ':'Save ')+pick.title);save.setAttribute('aria-pressed',String(saved.has(pick.id)));save.addEventListener('click',()=>{saved.has(pick.id)?saved.delete(pick.id):saved.add(pick.id);try{localStorage.setItem('comedy-saved',JSON.stringify([...saved]));}catch{}render();});actions.append(save);
 body.append(actions);article.append(body);return article;
}
function byDay(target,list){let day,section;for(const pick of list){if(day!==pick.date){day=pick.date;section=element('section',undefined,'day');section.append(element('h3',dateLabel(day)));target.append(section);}section.append(listing(pick));}}
function emptyBox(title,text){const box=element('div',undefined,'empty');box.append(element('h3',title),element('p',text));return box;}
function renderTonightRooms(target){loadRooms().then(list=>{if(!list.length||!target.isConnected)return;const wrap=element('div',undefined,'tonight-rooms');wrap.append(element('p','Every '+WEEKDAYS[todayWeekday]+' on the board','rooms-label'));const ul=element('ul');
 for(const r of list){const li=element('li');const url=safeURL(r.source_url);const title=url?element('a',r.title):element('span',r.title);if(url){title.href=url;title.target='_blank';title.rel='noopener noreferrer';}title.className='rail-title';li.append(title,element('span',[r.tier==='open-mic'?'Open mic':'Show',r.time_label,r.venue+' · '+r.neighborhood,r.price_label||r.cost_label].filter(Boolean).join(' · '),'room-detail'));ul.append(li);}
 wrap.append(ul);const more=element('p',undefined,'rooms-more');const a=element('a','All open mics →');a.href='/open-mics.html';more.append(a);wrap.append(more);target.append(wrap);});}
function render(){
 const focusedSave=document.activeElement?.dataset.saveId;
 const tonightList=document.querySelector('#tonight-list'),weekendList=document.querySelector('#weekend-list'),weekendSection=document.querySelector('#weekend');
 container.replaceChildren();tonightList?.replaceChildren();weekendList?.replaceChildren();
 const now=Date.now(),area=document.querySelector('#neighborhood')?.value;
 const upcoming=picks.filter(p=>Date.parse(p.ends_at)>now).sort((a,b)=>a.starts_at.localeCompare(b.starts_at));
 const visible=upcoming.filter(p=>(!area||p.neighborhood===area)&&(filter==='all'||filter==='cheap'&&Number.isFinite(p.price_amount)&&p.price_amount<=15||filter==='saved'&&saved.has(p.id)));
 const count=document.querySelector('#result-count');if(count)count.textContent=visible.length+' upcoming '+(visible.length===1?'show':'shows')+(area?' · '+area:' · '+new Set(visible.map(p=>p.neighborhood)).size+' '+(new Set(visible.map(p=>p.neighborhood)).size===1?'neighborhood':'neighborhoods'));
 const status=document.querySelector('#board-status');if(status){const dates=[...new Set(upcoming.map(p=>p.verified_at).filter(Boolean))].sort();status.textContent=(dates.length?'Sources checked '+dates[0]+(dates.length>1?'–'+dates.at(-1):'')+'. ':'')+'New York local times. Check ticket pages for updates.';}
 const roomList=document.querySelector('#room-list');if(roomList){roomList.replaceChildren();const grouped=new Map();for(const p of upcoming){const row=grouped.get(p.venue)||{count:0,area:p.neighborhood};row.count++;grouped.set(p.venue,row);}for(const [name,data]of [...grouped].sort((a,b)=>a[0].localeCompare(b[0]))){const li=element('li');const a=element('a',name);a.href='/neighborhoods.html?area='+encodeURIComponent(data.area);li.append(a,element('span',data.count+' '+(data.count===1?'show':'shows')+' · '+data.area,'room-detail'));roomList.append(li);}}
 const board=document.querySelector('#featured-board');if(board){board.replaceChildren();const shelf=visible.filter(p=>p.poster&&(p.sponsored||p.featured)).sort((a,b)=>Number(Boolean(b.sponsored))-Number(Boolean(a.sponsored))).slice(0,4);board.hidden=!shelf.length;if(shelf.length){board.append(element('h2','On the board','board-heading'));const strip=element('div',undefined,'flyer-shelf');for(const p of shelf){const card=element('article',undefined,'pinned-pick'+(p.sponsored?' paid':''));card.append(element('p',p.sponsored?'Paid listing':'Editor’s pick','pin-tag'));const image=poster(p);if(image)card.append(image);card.append(element('p',dateLabel(p.date).replace(', September',' · Sep')+' · '+p.time_label,'pin-date'),element('h3',p.title),element('p',p.venue,'pin-venue'));const ticket=ticketLink(p);if(ticket)card.append(ticket);strip.append(card);}board.append(strip);}}
 const tonight=visible.filter(p=>p.date===today),weekend=visible.filter(p=>p.date>today&&isWeekend(p.date)),coming=visible.filter(p=>p.date>today&&!isWeekend(p.date));
 const heading=document.querySelector('#tonight-heading');if(heading)heading.textContent='Tonight · '+dateLabel(today);
 if(tonightList){if(tonight.length){tonight.forEach(p=>tonightList.append(listing(p)));}else{tonightList.append(emptyBox(filter==='saved'?'None of your saved picks are tonight.':area?'Nothing on our list tonight around '+area+'.':'Nothing on our list tonight.',filter==='all'&&!area?'Here are the rooms that run every '+WEEKDAYS[todayWeekday]+'.':'Try all picks, or check the weekend.'));if(filter==='all'&&!area)renderTonightRooms(tonightList);}}
 if(weekendSection&&weekendList){weekendSection.hidden=!weekend.length;byDay(weekendList,weekend);}
 if(!coming.length){container.append(emptyBox(filter==='saved'?'Your saved picks will show up here.':'No more picks yet.',filter==='saved'?'Use “Save” on a pick to keep it on this device.':'The next edition adds the coming week. Sign up above to get it by email.'));}else byDay(container,coming);
 if(focusedSave){[...document.querySelectorAll('[data-save-id]')].find(b=>b.dataset.saveId===focusedSave)?.focus();}
}
fetch('/data/picks.json').then(r=>{if(!r.ok)throw Error('Could not load picks');return r.json();}).then(data=>{if(!Array.isArray(data))throw Error('Invalid picks');picks=data;const select=document.querySelector('#neighborhood');if(select){[...new Set(data.map(p=>p.neighborhood))].sort().forEach(name=>{const option=element('option',name);option.value=name;select.append(option);});const area=new URLSearchParams(location.search).get('area');if([...select.options].some(o=>o.value===area))select.value=area;select.addEventListener('change',render);}render();}).catch(()=>{container.replaceChildren(element('p','The picks couldn’t load. Please refresh, or try again shortly.','empty'));});
