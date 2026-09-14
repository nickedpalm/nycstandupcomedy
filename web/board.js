// Recurring rooms rail (home) and the open-mics page. Data: /data/recurring.json, /data/open-mics.json.
const element=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
function safeURL(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}}
function sourceLink(item,label){const url=safeURL(item.source_url);if(!url)return null;const a=element('a',label||item.source_label||'Source ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',(item.source_label||'Source')+' for '+item.title);return a;}
const WEEKDAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const venues=fetch('/data/venues.json').then(r=>r.ok?r.json():[]).catch(()=>[]).then(v=>new Map((Array.isArray(v)?v:[]).map(x=>[x.name,x.neighborhood])));
const load=path=>Promise.all([fetch(path).then(r=>{if(!r.ok)throw Error('Could not load '+path);return r.json();}),venues]).then(([d,area])=>(Array.isArray(d)?d:[]).map(r=>({...r,neighborhood:area.get(r.venue)||r.neighborhood})));

const rail=document.querySelector('#recurring-list');
if(rail){load('/data/recurring.json').then(rows=>{rail.replaceChildren();
 const today=new Date(new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())+'T12:00:00Z').getUTCDay();
 const minutes=t=>{const m=/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(t||'');if(!m)return 1e9;let h=Number(m[1])%12;if(/pm/i.test(m[3]))h+=12;return h*60+Number(m[2]||0);};
 const list=rows.filter(r=>r.tier==='recurring');
 for(let i=0;i<7;i++){const day=(today+i)%7;const tonight=list.filter(r=>Number(r.weekday)===day).sort((a,b)=>minutes(a.time_label)-minutes(b.time_label));if(!tonight.length)continue;
  rail.append(element('li',(i===0?'Tonight · ':i===1?'Tomorrow · ':'')+WEEKDAYS[day],'rail-night'));
  for(const r of tonight){const li=element('li');const a=sourceLink(r,r.title);if(a){a.className='rail-title';li.append(a);}else li.append(element('span',r.title,'rail-title'));
   const weekly=/^every\s/i.test(r.cadence||'');li.append(element('span',[weekly?null:r.cadence,r.time_label,r.venue+' · '+r.neighborhood,r.price_label].filter(Boolean).join(' · '),'room-detail'));rail.append(li);}}
 if(!list.length)rail.append(element('li','No recurring rooms listed yet.'));
}).catch(()=>{rail.replaceChildren(element('li','Recurring rooms could not be loaded.'));});}
const mics=document.querySelector('#mic-listings');
if(mics){load('/data/open-mics.json').then(rows=>{mics.replaceChildren();
 const list=rows.filter(r=>r.tier==='open-mic');const count=document.querySelector('#result-count');if(count)count.textContent=list.length+' open mics · '+new Set(list.map(r=>r.venue)).size+' rooms · checked '+(list.map(r=>r.verified_at).sort().pop()||'');
 const groups=new Map();for(const r of list){const key=WEEKDAYS[r.weekday]||'Any night';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
 for(const day of [...WEEKDAYS,'Any night']){const rows=groups.get(day);if(!rows)continue;const section=element('section',undefined,'day');section.append(element('h3',day));
  for(const r of rows){const article=element('article',undefined,'pick listing-row mic-row');article.id='mic-'+r.id;const body=element('div',undefined,'listing-body');
   body.append(element('p',[r.cadence,r.time_label].filter(Boolean).join(' · '),'pick-time'),element('h4',r.title,'pick-title'));
   const facts=element('dl',undefined,'mic-facts');const fact=(k,v)=>{if(!v)return;facts.append(element('dt',k),element('dd',v));};
   fact('Where',r.venue+' · '+r.address+' · '+r.neighborhood);fact('Cost',r.cost_label);fact('Sign-up',r.signup);fact('Set',r.set_length);fact('Formats',r.formats);fact('Age',r.age);body.append(facts);
   if(r.notes)body.append(element('p',r.notes,'pick-description'));
   const actions=element('div',undefined,'pick-actions');const src=sourceLink(r,(r.source_label||'Source')+' ↗');if(src)actions.append(src);actions.append(element('span','Checked '+r.verified_at,'checked-on'));body.append(actions);article.append(body);section.append(article);}
  mics.append(section);}
 if(!list.length)mics.append(element('p','No open mics listed yet.'));
}).catch(()=>{mics.replaceChildren(element('p','Open mics could not be loaded. Try again shortly.'));});}
