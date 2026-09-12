// Clubs guide: /data/clubs.json, cross-referenced with upcoming picks by venue name.
const element=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
function safeURL(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}}
function link(url,text,label){const href=safeURL(url);if(!href)return null;const a=element('a',text);a.href=href;a.target='_blank';a.rel='noopener noreferrer';if(label)a.setAttribute('aria-label',label);return a;}
const load=path=>fetch(path).then(r=>{if(!r.ok)throw Error('Could not load '+path);return r.json();}).then(d=>Array.isArray(d)?d:[]);
const container=document.querySelector('#club-listings');
if(container){Promise.all([load('/data/clubs.json'),load('/data/picks.json').catch(()=>[])]).then(([clubs,picks])=>{
 container.replaceChildren();const now=Date.now();const upcoming=picks.filter(p=>Date.parse(p.ends_at)>now);
 const list=clubs.filter(c=>c.tier==='club');const count=document.querySelector('#result-count');if(count)count.textContent=list.length+' clubs · checked '+(list.map(c=>c.verified_at).sort().pop()||'');
 for(const c of list){const article=element('article',undefined,'pick listing-row club-row');article.id='club-'+c.id;const body=element('div',undefined,'listing-body');
  body.append(element('p',c.neighborhood,'pick-time'),element('h4',c.name,'pick-title'),element('p',c.character,'pick-description'));
  const facts=element('dl',undefined,'mic-facts');const fact=(k,v)=>{if(v)facts.append(element('dt',k),element('dd',v));};
  fact('Where',c.address);fact('Rooms',c.rooms);fact('Tickets',c.price_label);fact('Minimum',c.minimum);fact('Age',c.age);fact('Getting in',c.reservations);body.append(facts);
  const here=upcoming.filter(p=>p.venue&&c.name&&p.venue.toLowerCase().includes(c.name.toLowerCase()));
  const board=element('p',undefined,'club-board');if(here.length){board.append(document.createTextNode('On our board: '));here.forEach((p,i)=>{const a=element('a',p.title+' ('+p.date+')');a.href='/#show-'+p.id;board.append(a);if(i<here.length-1)board.append(document.createTextNode(', '));});}else board.textContent='Nothing from this club on our board this week. Their calendar has the full schedule.';body.append(board);
  const actions=element('div',undefined,'pick-actions');const cal=link(c.calendar_url,'Calendar & tickets ↗','Calendar and tickets for '+c.name);if(cal)actions.append(cal);const src=link(c.source_url,(c.source_label||'Source')+' ↗','Policy source for '+c.name);if(src){src.className='flyer-credit';actions.append(src);}actions.append(element('span','Checked '+c.verified_at,'checked-on'));body.append(actions);article.append(body);container.append(article);}
 if(!list.length)container.append(element('p','No clubs listed yet.'));
}).catch(()=>{container.replaceChildren(element('p','The club guide could not be loaded. Try again shortly.'));});}
