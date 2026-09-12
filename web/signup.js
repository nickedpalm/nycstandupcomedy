// Newsletter signup: progressive enhancement over a plain POST form to /api/subscribe.
document.querySelectorAll('form[data-signup]').forEach(form=>{
 const status=form.querySelector('[data-signup-status]'),button=form.querySelector('button[type=submit]');
 form.addEventListener('submit',async event=>{
  event.preventDefault();const data=new FormData(form);const email=String(data.get('email')||'').trim();
  if(!email){status.textContent='Add your email first.';return;}
  button.disabled=true;status.textContent='Adding you…';
  try{const r=await fetch('/api/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,name:data.get('name')||'',website:data.get('website')||''})});const body=await r.json().catch(()=>({}));
   if(r.ok&&body.ok){form.reset();status.textContent='You’re on the list. First issue lands when the next week’s picks are ready.';status.classList.add('ok');}
   else{status.textContent=body.error||'Signup failed. Try again in a minute.';}
  }catch{status.textContent='No connection. Try again in a minute.';}
  button.disabled=false;});
});
