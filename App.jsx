import { useState, useEffect, useRef, useCallback } from "react";

const INITIAL_WORDS = [
  { word: "갈등", meaning: "서로 다른 처지나 의견이 부딪혀 충돌함", example: "주인공은 이상과 현실 사이에서 심한 갈등을 겪었다.", category: "심리", level: 2 },
  { word: "함의", meaning: "겉으로 드러나지 않고 속에 담겨 있는 뜻", example: "그의 말 속에는 깊은 함의가 담겨 있었다.", category: "언어", level: 3 },
  { word: "역설", meaning: "겉으로는 모순되어 보이지만 그 속에 진리를 담고 있는 표현", example: "빨리 가려면 돌아가라는 역설적인 표현이다.", category: "수사", level: 3 },
  { word: "관조", meaning: "고요한 마음으로 사물이나 현상을 바라봄", example: "시인은 자연을 관조하며 내면의 평화를 찾았다.", category: "심리", level: 3 },
  { word: "풍자", meaning: "사회적 부조리나 모순을 비꼬아서 비판함", example: "이 소설은 당시 사회를 날카롭게 풍자하고 있다.", category: "수사", level: 2 },
  { word: "은유", meaning: "사물의 상태나 움직임을 다른 사물에 빗대어 표현하는 방법", example: "내 마음은 호수요 라는 시구는 은유의 예이다.", category: "수사", level: 2 },
  { word: "직유", meaning: "처럼 같이 등의 말을 써서 직접 비유하는 표현법", example: "그녀의 목소리는 꾀꼬리 같다는 직유적 표현이다.", category: "수사", level: 1 },
  { word: "의인", meaning: "사람이 아닌 것을 사람인 것처럼 표현하는 방법", example: "꽃이 웃는다는 표현은 의인법을 사용한 것이다.", category: "수사", level: 1 },
  { word: "성찰", meaning: "자기 자신의 마음을 반성하고 살핌", example: "그는 하루를 돌아보며 깊은 성찰의 시간을 가졌다.", category: "심리", level: 2 },
  { word: "애상", meaning: "슬프고 쓸쓸한 감정이나 정서", example: "가을 낙엽을 보며 애상에 잠겼다.", category: "심리", level: 3 },
  { word: "향수", meaning: "고향이나 지난 시절을 그리워하는 마음", example: "고향 음식 냄새가 그에게 향수를 불러일으켰다.", category: "심리", level: 2 },
  { word: "체념", meaning: "희망을 버리고 아주 단념함", example: "오랜 기다림 끝에 그는 체념하고 말았다.", category: "심리", level: 2 },
  { word: "논증", meaning: "논리적 근거를 들어 주장의 옳고 그름을 밝힘", example: "글쓴이는 다양한 사례를 통해 자신의 주장을 논증했다.", category: "논리", level: 3 },
  { word: "귀납", meaning: "개별적인 특수 사실에서 일반적인 원리를 이끌어 내는 방법", example: "여러 실험 결과로부터 귀납적 결론을 도출했다.", category: "논리", level: 3 },
  { word: "연역", meaning: "일반적인 원리에서 개별적인 사실을 이끌어 내는 추론 방법", example: "삼단논법은 대표적인 연역 추론 방식이다.", category: "논리", level: 3 },
  { word: "반증", meaning: "어떤 사실이나 주장이 옳지 않음을 보이는 증거나 근거", example: "그의 주장은 수많은 반증으로 무너졌다.", category: "논리", level: 2 },
  { word: "맥락", meaning: "어떤 사물이나 현상이 서로 이어져 있는 관계나 흐름", example: "단어의 의미는 맥락에 따라 달라질 수 있다.", category: "언어", level: 2 },
  { word: "어조", meaning: "글이나 말에서 풍기는 말투나 분위기", example: "이 시는 절망적인 어조로 쓰여 있다.", category: "언어", level: 2 },
  { word: "운율", meaning: "시에서 느껴지는 말의 음악적 흐름과 리듬감", example: "이 시는 7·5조의 운율을 지닌다.", category: "언어", level: 2 },
  { word: "상징", meaning: "추상적인 개념이나 사상을 구체적인 사물로 나타내는 것", example: "비둘기는 평화를 상징한다.", category: "수사", level: 2 },
  { word: "모순", meaning: "두 가지 사실이나 주장이 서로 맞지 않고 어긋남", example: "그의 말에는 앞뒤가 맞지 않는 모순이 있었다.", category: "논리", level: 2 },
  { word: "비판", meaning: "옳고 그름을 따져 잘못된 점을 지적함", example: "평론가는 그 작품의 구성을 날카롭게 비판했다.", category: "논리", level: 1 },
  { word: "통찰", meaning: "예리하게 꿰뚫어 보는 능력이나 그런 관점", example: "그의 글에는 삶에 대한 깊은 통찰이 담겨 있다.", category: "심리", level: 3 },
  { word: "부각", meaning: "어떤 사실이나 특징을 두드러지게 나타냄", example: "작가는 인물의 내면 갈등을 부각시켜 서술했다.", category: "언어", level: 2 },
  { word: "서사", meaning: "사건이나 이야기의 전개 방식 또는 그 이야기를 풀어내는 방법", example: "이 소설은 1인칭 서사로 전개된다.", category: "언어", level: 2 },
  { word: "해학", meaning: "익살스럽고 우스운 말이나 행동으로 웃음을 자아내는 것", example: "판소리에는 해학과 풍자가 넘쳐난다.", category: "수사", level: 3 },
  { word: "반어", meaning: "실제와 반대되는 말로 속뜻을 전달하는 표현법", example: "아이고 잘도 한다는 반어적 표현으로 비꼬았다.", category: "수사", level: 2 },
  { word: "여운", meaning: "말이나 음악 등이 끝난 뒤에도 남아 있는 감동이나 느낌", example: "그 소설의 마지막 문장은 긴 여운을 남겼다.", category: "심리", level: 2 },
  { word: "동기", meaning: "어떤 행동이나 사건을 일으키게 하는 계기나 원인", example: "그 사건이 그가 작가를 결심하게 된 동기였다.", category: "심리", level: 1 },
  { word: "전제", meaning: "어떤 판단이나 주장의 근거로 미리 내세우는 조건이나 명제", example: "이 논문은 인간의 이성이 완전하다는 전제에서 출발한다.", category: "논리", level: 3 },
];
const CATEGORIES = ["전체","심리","언어","수사","논리","사회"];
const LEVELS = ["전체","1","2","3"];
const MEDAL = ["🥇","🥈","🥉"];
const QUESTION_TIME = 15;
const SUPABASE_URL = "https://rpmvugzjxkynkopvglpf.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZdoQVbETd9sogIFqSxZ5XA_jc7bGkcd";

function useMusic() {
  const ctxRef = useRef(null);
  const loopRef = useRef(null);
  const modeRef = useRef(null);
  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);
  const noteFreq = (note) => { const map = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}; const m = note.match(/([A-G]#?)(\d)/); if (!m) return 440; const base = map[m[1][0]] + (m[1][1]==='#'?1:0); return 440 * Math.pow(2, (base + (parseInt(m[2])-4)*12 - 9) / 12); };
  const playNote = useCallback((ctx, freq, when, dur, type="triangle", vol=0.12) => { try { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0.001, when); g.gain.linearRampToValueAtTime(vol, when + 0.03); g.gain.linearRampToValueAtTime(0.001, when + dur * 0.85); o.connect(g); g.connect(ctx.destination); o.start(when); o.stop(when + dur); } catch(e) {} }, []);
  const scheduleMusic = useCallback((mode) => {
    const ctx = getCtx();
    const normal = { notes: ["C4","E4","G4","E4","F4","A4","G4","E4","D4","F4","A4","G4","C5","B4","G4","E4"], durs: [0.5,0.5,0.5,0.5,0.5,0.5,1.0,0.5,0.5,0.5,0.5,0.5,1.0,0.5,0.5,2.0], bpm: 116 };
    const urgent = { notes: ["C5","C5","B4","C5","D5","C5","B4","A4","G4","A4","B4","C5","D5","E5","D5","C5"], durs: [0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.5,0.25,0.25,0.25,0.25,0.25,0.5,0.25,0.5], bpm: 170 };
    const seq = mode === "urgent" ? urgent : normal;
    const beat = 60 / seq.bpm; let t = ctx.currentTime + 0.05;
    const totalDur = seq.durs.reduce((a,b) => a+b, 0) * beat;
    seq.notes.forEach((note, i) => { const dur = seq.durs[i] * beat; playNote(ctx, noteFreq(note), t, dur, mode==="urgent"?"square":"triangle", 0.12); if (i%4===0) { const bass=["C3","F3","G3","A3"][Math.floor(i/4)%4]; playNote(ctx,noteFreq(bass),t,beat*2,"sine",0.07); } if (mode==="urgent"&&i%2===0) playNote(ctx,55,t,beat*0.15,"sine",0.18); t+=dur; });
    return totalDur * 1000;
  }, [getCtx, playNote]);
  const start = useCallback((mode) => { if (modeRef.current===mode) return; stop(); modeRef.current=mode; const loop=()=>{ if(modeRef.current!==mode)return; const ms=scheduleMusic(mode); loopRef.current=setTimeout(loop,ms-120); }; loop(); }, [scheduleMusic]);
  const stop = useCallback(() => { modeRef.current=null; if(loopRef.current){clearTimeout(loopRef.current);loopRef.current=null;} if(ctxRef.current){try{ctxRef.current.close();}catch(e){}ctxRef.current=null;} }, []);
  const playEffect = useCallback((type) => { try { const ctx=getCtx(); const t=ctx.currentTime; if(type==="correct"){[[523,0,0.15],[659,0.07,0.15],[784,0.14,0.25]].forEach(([freq,delay,dur])=>playNote(ctx,freq,t+delay,dur,"triangle",0.18));} else if(type==="wrong"){[[280,0,0.12],[220,0.1,0.2]].forEach(([freq,delay,dur])=>playNote(ctx,freq,t+delay,dur,"sawtooth",0.15));} else if(type==="timeout"){[[440,0,0.08],[440,0.1,0.08],[330,0.2,0.2]].forEach(([freq,delay,dur])=>playNote(ctx,freq,t+delay,dur,"square",0.14));} } catch(e){} }, [getCtx, playNote]);
  useEffect(() => () => stop(), [stop]);
  return { start, stop, playEffect };
}

async function getRanking() {
  try {
    const res = await fetch(SUPABASE_URL + "/rest/v1/ranking?select=*&order=best.desc&limit=20", { headers: { "Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY } });
    if (!res.ok) return [];
    return await res.json();
  } catch(e) { return []; }
}

async function submitScore(userId, pct) {
  try {
    const existing = await fetch(SUPABASE_URL + "/rest/v1/ranking?user_id=eq."+encodeURIComponent(userId), { headers: {"apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY} });
    const data = await existing.json();
    if (data && data[0]) {
      const prev = data[0];
      await fetch(SUPABASE_URL + "/rest/v1/ranking?user_id=eq."+encodeURIComponent(userId), { method:"PATCH", headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY}, body:JSON.stringify({best:Math.max(prev.best,pct),tries:prev.tries+1,last:pct}) });
    } else {
      await fetch(SUPABASE_URL + "/rest/v1/ranking", { method:"POST", headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY,"Prefer":"return=minimal"}, body:JSON.stringify({user_id:userId,best:pct,tries:1,last:pct}) });
    }
  } catch(e) {}
}

async function generateWords(count, category, existing) {
  const excl = existing.map(w=>w.word).join(", ");
  const cat = category&&category!=="전체"?category:"심리/언어/수사/논리/사회 중 하나";
  const prompt = `수능 국어 어휘 ${count}개 생성. 카테고리: ${cat}. 난이도 level 1~3. 제외: ${excl}. JSON 배열만 응답:\n[{"word":"","meaning":"","example":"","category":"","level":2}]`;
  const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:prompt}]}) });
  const data = await res.json();
  const text = data.content.map(i=>i.text||"").join("");
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

const fBtn = (active) => ({padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:active?"#3d2b1a":"#e8e0d4",color:active?"#f0e8d8":"#7a6650"});
const nBtn = (dis) => ({width:40,height:40,borderRadius:"50%",border:"1px solid #d4c8b4",background:dis?"#f5f0e8":"#faf6f0",cursor:dis?"not-allowed":"pointer",color:dis?"#ccc":"#5c3d20",fontSize:16});
function Bar({v,t,color1="#5a8a5a",color2="#80c080"}) { return <div style={{height:6,background:"#e8e0d4",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:(v/t*100)+"%",background:`linear-gradient(90deg,${color1},${color2})`,transition:"width 0.4s ease, background 0.5s"}}/></div>; }
function Tag({label}) { const c={심리:"#d4a8c7",언어:"#a8c4d4",수사:"#c4d4a8",논리:"#d4c4a8",사회:"#a8d4c8"}; return <span style={{background:c[label]||"#e0d8cc",color:"#4a3728",fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20}}>{label}</span>; }
function Dots({level}) { return <span style={{display:"flex",gap:3}}>{[1,2,3].map(i=><span key={i} style={{width:7,height:7,borderRadius:"50%",background:i<=level?"#8b6914":"#e0d8cc"}}/>)}</span>; }
function Login({onLogin}) {
  const [v,setV]=useState(""); const [err,setErr]=useState("");
  const go=()=>{ const id=v.trim(); if(!id)return setErr("닉네임을 입력해주세요."); if(id.length<2||id.length>12)return setErr("2~12자로 입력해주세요."); onLogin(id); };
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#2d1f0e,#4a3020)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{color:"#c8a882",fontSize:11,letterSpacing:4,marginBottom:6}}>수능 국어</div>
      <div style={{color:"#faf0e0",fontSize:26,fontWeight:700,fontFamily:"'Noto Serif KR',serif",marginBottom:4}}>어휘 학습 카드</div>
      <div style={{color:"#a09070",fontSize:13,marginBottom:36}}>친구들과 랭킹을 겨뤄요 🏆</div>
      <div style={{width:"100%",maxWidth:320,background:"rgba(255,255,255,0.07)",borderRadius:20,padding:28,border:"1px solid rgba(200,168,130,0.25)"}}>
        <div style={{color:"#e0d0b0",fontSize:14,fontWeight:600,marginBottom:14}}>닉네임으로 시작하기</div>
        <input value={v} onChange={e=>{setV(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="닉네임 입력 (2~12자)" maxLength={12} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1px solid rgba(200,168,130,0.3)",background:"rgba(255,255,255,0.08)",color:"#faf0e0",fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
        {err&&<div style={{color:"#e8a0a0",fontSize:12,marginTop:5}}>{err}</div>}
        <button onClick={go} style={{width:"100%",marginTop:14,padding:"13px",background:"linear-gradient(135deg,#8b6914,#c8a030)",color:"#fff",border:"none",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:15}}>시작하기 →</button>
        <div style={{color:"#806050",fontSize:11,marginTop:10,textAlign:"center"}}>닉네임은 다른 사용자에게 공개됩니다</div>
      </div>
    </div>
  );
}

function Flashcard({words}) {
  const [i,setI]=useState(0); const [flip,setFlip]=useState(false); const [known,setKnown]=useState(new Set());
  const w=words[i];
  if(!w)return <div style={{textAlign:"center",padding:40,color:"#8b6914"}}>단어가 없습니다.</div>;
  const go=d=>{setFlip(false);setTimeout(()=>setI(x=>Math.max(0,Math.min(words.length-1,x+d))),120);};
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
      <Bar v={i+1} t={words.length}/>
      <div style={{color:"#7a6650",fontSize:12}}>{i+1} / {words.length}</div>
      <div onClick={()=>setFlip(f=>!f)} style={{width:"100%",maxWidth:420,minHeight:200,background:flip?"linear-gradient(135deg,#3d2b1a,#5c3d20)":"linear-gradient(135deg,#faf6f0,#f0e8d8)",border:flip?"1px solid #8b6914":"1px solid #d4c8b4",borderRadius:20,padding:"28px 24px",cursor:"pointer",userSelect:"none",boxShadow:flip?"0 8px 32px rgba(139,105,20,0.25)":"0 4px 20px rgba(0,0,0,0.08)",transition:"all 0.3s",display:"flex",flexDirection:"column",justifyContent:"center",gap:10,position:"relative",boxSizing:"border-box"}}>
        <div style={{position:"absolute",top:12,right:16,display:"flex",gap:8,alignItems:"center"}}><Tag label={w.category}/><Dots level={w.level}/></div>
        {!flip?<div style={{textAlign:"center"}}><div style={{fontSize:40,fontFamily:"'Noto Serif KR',serif",fontWeight:700,color:"#2d1f0e",letterSpacing:4}}>{w.word}</div><div style={{marginTop:10,color:"#a09080",fontSize:12}}>카드를 눌러 뜻 확인</div></div>
        :<div style={{color:"#f0e8d8"}}><div style={{fontSize:17,fontWeight:600,marginBottom:8,fontFamily:"'Noto Serif KR',serif"}}>{w.meaning}</div><div style={{fontSize:13,color:"#c8b898",lineHeight:1.7,borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:8}}>예) {w.example}</div></div>}
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <button onClick={()=>go(-1)} disabled={i===0} style={nBtn(i===0)}>◀</button>
        <button onClick={()=>setKnown(k=>{const n=new Set(k);n.has(w.word)?n.delete(w.word):n.add(w.word);return n;})} style={{padding:"8px 18px",borderRadius:20,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:known.has(w.word)?"#8b6914":"#e8e0d4",color:known.has(w.word)?"#fff":"#7a6650"}}>{known.has(w.word)?"✓ 알아요":"알아요"}</button>
        <button onClick={()=>go(1)} disabled={i===words.length-1} style={nBtn(i===words.length-1)}>▶</button>
      </div>
      <div style={{fontSize:12,color:"#a09080"}}>아는 단어: {known.size} / {words.length}</div>
    </div>
  );
}
function Quiz({words,onDone}) {
  const [started,setStarted]=useState(false);
  const [qi,setQi]=useState(0); const [score,setScore]=useState(0); const [chosen,setChosen]=useState(null); const [done,setDone]=useState(false); const [qs,setQs]=useState([]); const [timeLeft,setTimeLeft]=useState(QUESTION_TIME);
  const ivRef=useRef(null); const scoreRef=useRef(0);
  const {start:startMusic,stop:stopMusic,playEffect}=useMusic();
  const build=useCallback((w)=>{ const s=[...w].sort(()=>Math.random()-0.5).slice(0,Math.min(20,w.length)); return s.map(q=>{ const wrongs=w.filter(x=>x.word!==q.word).sort(()=>Math.random()-0.5).slice(0,3); const opts=[...wrongs.map(x=>x.word),q.word].sort(()=>Math.random()-0.5); return {...q,options:opts,answer:q.word}; }); },[]);
  const startTimer=useCallback(()=>{ if(ivRef.current)clearInterval(ivRef.current); setTimeLeft(QUESTION_TIME); ivRef.current=setInterval(()=>{ setTimeLeft(t=>{if(t<=1){clearInterval(ivRef.current);return 0;}return t-1;}); },1000); },[]);
  const handleStart=()=>{ const q=build(words); setQs(q); setQi(0); setScore(0); scoreRef.current=0; setChosen(null); setDone(false); setStarted(true); };
  useEffect(()=>{ if(!started||!qs.length||done)return; startTimer(); startMusic("normal"); return()=>{if(ivRef.current)clearInterval(ivRef.current);}; },[qi,started,qs.length,done]);
  useEffect(()=>{ if(!started||done||chosen)return; if(timeLeft>0&&timeLeft<=5)startMusic("urgent"); else if(timeLeft>5)startMusic("normal"); },[timeLeft,started,done,chosen]);
  useEffect(()=>{ if(!started||timeLeft!==0||chosen||!qs.length||done)return; playEffect("timeout"); setChosen("__timeout__"); if(qi===qs.length-1){setTimeout(()=>{stopMusic();setDone(true);onDone(scoreRef.current,qs.length);},900);} },[timeLeft,started,chosen,qs.length,done,qi]);
  useEffect(()=>()=>stopMusic(),[]);
  if(words.length<4)return <div style={{textAlign:"center",color:"#8b6914",padding:40}}>단어 4개 이상 필요합니다.</div>;
  if(!started)return(
    <div style={{textAlign:"center",padding:"40px 20px"}}>
      <div style={{fontSize:48,marginBottom:12}}>📝</div>
      <div style={{fontSize:18,fontWeight:700,color:"#2d1f0e",marginBottom:8}}>퀴즈 준비 완료!</div>
      <div style={{fontSize:13,color:"#7a6650",marginBottom:6}}>문제당 {QUESTION_TIME}초 · 최대 20문제</div>
      <div style={{fontSize:13,color:"#7a6650",marginBottom:28}}>5초 이하면 긴박한 음악으로 바뀌어요 🎵</div>
      <button onClick={handleStart} style={{padding:"14px 40px",background:"linear-gradient(135deg,#8b6914,#c8a030)",color:"#fff",border:"none",borderRadius:16,cursor:"pointer",fontWeight:700,fontSize:16,boxShadow:"0 4px 16px rgba(139,105,20,0.4)"}}>퀴즈 시작!</button>
    </div>
  );
  if(done){ const pct=Math.round((scoreRef.current/qs.length)*100); return(
    <div style={{textAlign:"center",padding:32}}>
      <div style={{fontSize:52,marginBottom:8}}>{pct>=80?"🎉":pct>=50?"👍":"📚"}</div>
      <div style={{fontSize:28,fontWeight:700,color:"#3d2b1a",fontFamily:"'Noto Serif KR',serif"}}>{scoreRef.current} / {qs.length}</div>
      <div style={{fontSize:22,color:"#8b6914",fontWeight:700,marginTop:4}}>{pct}점</div>
      <div style={{color:"#7a6650",marginTop:6}}>{pct>=80?"훌륭해요! 🏆":pct>=50?"잘 했어요! 👍":"조금 더 연습해봐요! 📚"}</div>
      <div style={{color:"#a09080",fontSize:12,marginTop:4}}>랭킹에 등록됐어요</div>
      <button onClick={handleStart} style={{marginTop:20,padding:"10px 28px",background:"#8b6914",color:"#fff",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600}}>다시 풀기</button>
    </div>
  ); }
  const q=qs[qi]; const isTimeout=chosen==="__timeout__"; const urgent=timeLeft<=5;
  const pick=(opt)=>{ if(chosen)return; if(ivRef.current)clearInterval(ivRef.current); const correct=opt===q.answer; playEffect(correct?"correct":"wrong"); if(correct){scoreRef.current+=1;setScore(s=>s+1);} setChosen(opt); if(qi===qs.length-1){setTimeout(()=>{stopMusic();setDone(true);onDone(scoreRef.current,qs.length);},800);} };
  const timerColor=urgent?"#e05050":timeLeft<=10?"#e09030":"#5a8a5a";
  const timerBar=urgent?"linear-gradient(90deg,#e05050,#ff8080)":timeLeft<=10?"linear-gradient(90deg,#e09030,#f0c060)":"linear-gradient(90deg,#5a8a5a,#80c080)";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <style>{`@keyframes blink{0%{opacity:1}50%{opacity:0.3}100%{opacity:1}}`}</style>
      <Bar v={qi+1} t={qs.length}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:12,color:"#a09080"}}>남은 시간</span>
        <span style={{fontSize:20,fontWeight:700,color:timerColor,animation:urgent?"blink 0.5s infinite":"none"}}>{timeLeft}초</span>
      </div>
      <div style={{height:8,background:"#e8e0d4",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:(timeLeft/QUESTION_TIME*100)+"%",background:timerBar,transition:"width 1s linear, background 0.5s"}}/></div>
      <div style={{display:"flex",justifyContent:"space-between",color:"#7a6650",fontSize:13}}><span>{qi+1} / {qs.length}</span><span>점수: {score}</span></div>
      <div style={{background:urgent?"linear-gradient(135deg,#fff0f0,#ffe8e8)":"linear-gradient(135deg,#faf6f0,#f0e8d8)",border:urgent?"1px solid #e8b0b0":"1px solid #d4c8b4",borderRadius:16,padding:"20px",textAlign:"center",transition:"all 0.4s"}}>
        <div style={{fontSize:12,color:"#a09080",marginBottom:6}}>다음 뜻의 단어는?</div>
        <div style={{fontSize:16,fontWeight:600,color:"#2d1f0e",lineHeight:1.6}}>{q.meaning}</div>
        <div style={{marginTop:6,fontSize:12,color:"#b0a090"}}>예) {q.example}</div>
      </div>
      {isTimeout&&<div style={{textAlign:"center",color:"#e05050",fontWeight:700,fontSize:13}}>⏰ 시간 초과! 정답: {q.answer}</div>}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {q.options.map((opt,i)=>{ const isAns=opt===q.answer,isCh=opt===chosen; let bg="#faf6f0",bd="#d4c8b4",cl="#3d2b1a"; if(chosen){if(isAns){bg="#e8f4e8";bd="#5a8a5a";cl="#2d5a2d";}else if(isCh&&!isTimeout){bg="#f4e8e8";bd="#8a5a5a";cl="#5a2d2d";}} return <button key={i} disabled={!!chosen} onClick={()=>pick(opt)} style={{padding:"12px 16px",background:bg,border:"1px solid "+bd,borderRadius:12,cursor:chosen?"default":"pointer",color:cl,fontSize:15,fontFamily:"'Noto Serif KR',serif",fontWeight:600,textAlign:"left",transition:"all 0.2s"}}>{String.fromCharCode(65+i)}. {opt}</button>; })}
      </div>
      {chosen&&qi<qs.length-1&&<button onClick={()=>{setChosen(null);setQi(x=>x+1);}} style={{padding:"10px",background:"#8b6914",color:"#fff",border:"none",borderRadius:12,cursor:"pointer",fontWeight:600,fontSize:14}}>다음 문제 →</button>}
    </div>
  );
}

function Ranking({userId}) {
  const [list,setList]=useState([]); const [loading,setLoading]=useState(true); const [err,setErr]=useState("");
  const load=async()=>{ setLoading(true);setErr(""); try{ const data=await getRanking(); setList(data.slice(0,20)); }catch(e){setErr("랭킹을 불러오지 못했어요.");} setLoading(false); };
  useEffect(()=>{load();},[]);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:16,fontWeight:700,color:"#2d1f0e"}}>🏆 전체 랭킹</div>
        <button onClick={load} style={{padding:"5px 12px",background:"#e8e0d4",border:"none",borderRadius:10,cursor:"pointer",fontSize:12,color:"#5c3d20",fontWeight:600}}>새로고침</button>
      </div>
      {err&&<div style={{color:"#e05050",fontSize:13,textAlign:"center",padding:12}}>{err}</div>}
      {loading?<div style={{textAlign:"center",padding:40,color:"#a09080"}}>불러오는 중...</div>
      :list.length===0?<div style={{textAlign:"center",padding:40,color:"#a09080"}}><div style={{fontSize:36,marginBottom:8}}>📊</div>아직 기록이 없어요.<br/>퀴즈를 풀면 여기에 등록돼요!</div>
      :<div style={{display:"flex",flexDirection:"column",gap:8}}>
        {list.map((e,i)=>(
          <div key={e.user_id} style={{background:e.user_id===userId?"linear-gradient(135deg,#fff8ec,#faf0d8)":"#faf6f0",border:e.user_id===userId?"1.5px solid #c8a882":"1px solid #e0d8cc",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:i<3?24:14,width:32,textAlign:"center",fontWeight:700,color:"#a09080"}}>{i<3?MEDAL[i]:i+1}</div>
            <div style={{flex:1}}><div style={{fontWeight:700,color:"#2d1f0e",fontSize:15}}>{e.user_id} {e.user_id===userId&&<span style={{fontSize:11,color:"#8b6914"}}>(나)</span>}</div><div style={{fontSize:12,color:"#a09080",marginTop:2}}>도전 {e.tries}회 · 최근 {e.last}점</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:700,color:"#8b6914"}}>{e.best}점</div><div style={{fontSize:11,color:"#a09080"}}>최고</div></div>
          </div>
        ))}
      </div>}
    </div>
  );
}
export default function App() {
  const [userId,setUserId]=useState(null);
  const [mode,setMode]=useState("flash");
  const [words,setWords]=useState(INITIAL_WORDS);
  const [cat,setCat]=useState("전체");
  const [lv,setLv]=useState("전체");
  const [tab,setTab]=useState("learn");
  const [genLoading,setGenLoading]=useState(false);
  const [genMsg,setGenMsg]=useState("");

  const filtered=words.filter(w=>(cat==="전체"||w.category===cat)&&(lv==="전체"||w.level===parseInt(lv)));

  const handleDone=async(score,total)=>{ if(!userId)return; const pct=Math.round(score/total*100); await submitScore(userId,pct); };

  const generate=async()=>{ setGenLoading(true);setGenMsg("AI가 어휘 생성 중..."); try{ const c=cat!=="전체"?cat:""; const nw=await generateWords(5,c,words); setWords(w=>[...w,...nw]); setGenMsg("✓ "+nw.length+"개 추가!"); setTimeout(()=>setGenMsg(""),2000); }catch{setGenMsg("실패. 다시 시도해주세요.");setTimeout(()=>setGenMsg(""),2000);} setGenLoading(false); };

  if(!userId)return <Login onLogin={setUserId}/>;

  return(
    <div style={{minHeight:"100vh",background:"#f5f0e8",fontFamily:"'Noto Sans KR',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",paddingBottom:40}}>
      <div style={{width:"100%",background:"linear-gradient(135deg,#2d1f0e,#4a3020)",padding:"18px 20px 14px",boxSizing:"border-box"}}>
        <div style={{maxWidth:480,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{color:"#c8a882",fontSize:11,letterSpacing:3,marginBottom:2}}>수능 국어</div>
              <div style={{color:"#faf0e0",fontSize:20,fontWeight:700,fontFamily:"'Noto Serif KR',serif"}}>어휘 학습 카드</div>
              <div style={{color:"#a09070",fontSize:12,marginTop:2}}>총 {words.length}개 · 필터: {filtered.length}개</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:"#c8a882",fontSize:13,fontWeight:600}}>👤 {userId}</div>
              <button onClick={()=>setUserId(null)} style={{marginTop:4,padding:"3px 10px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(200,168,130,0.3)",borderRadius:10,color:"#a09070",fontSize:11,cursor:"pointer"}}>로그아웃</button>
            </div>
          </div>
          <div style={{display:"flex",gap:6,marginTop:12}}>
            {[["learn","학습"],["ranking","🏆 랭킹"],["words","단어목록"]].map(([v,l])=>(
              <button key={v} onClick={()=>setTab(v)} style={{padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer",background:tab===v?"#c8a882":"rgba(255,255,255,0.1)",color:tab===v?"#2d1f0e":"#c8a882",fontWeight:600,fontSize:12}}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{width:"100%",maxWidth:480,padding:"16px",boxSizing:"border-box"}}>
        {tab!=="ranking"&&(
          <>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>{CATEGORIES.map(c=><button key={c} onClick={()=>setCat(c)} style={fBtn(cat===c)}>{c}</button>)}</div>
            <div style={{display:"flex",gap:6,marginBottom:12}}>{LEVELS.map(l=><button key={l} onClick={()=>setLv(l)} style={fBtn(lv===l)}>{l==="전체"?"전체 난이도":"난이도 "+l}</button>)}</div>
            <button onClick={generate} disabled={genLoading} style={{width:"100%",padding:"11px",marginBottom:genMsg?6:14,background:genLoading?"#c8b898":"linear-gradient(135deg,#8b6914,#c8a030)",color:"#fff",border:"none",borderRadius:12,cursor:genLoading?"not-allowed":"pointer",fontWeight:700,fontSize:14}}>
              {genLoading?"⏳ 생성 중...":"✨ AI로 어휘 자동 생성 (+5개)"}
            </button>
            {genMsg&&<div style={{textAlign:"center",color:"#8b6914",fontSize:13,marginBottom:10}}>{genMsg}</div>}
          </>
        )}
        {tab==="learn"&&(
          <>
            <div style={{display:"flex",background:"#e8e0d4",borderRadius:12,padding:4,marginBottom:16}}>
              {[["flash","📖 플래시카드"],["quiz","📝 퀴즈"]].map(([v,l])=>(
                <button key={v} onClick={()=>setMode(v)} style={{flex:1,padding:"8px",border:"none",borderRadius:10,cursor:"pointer",background:mode===v?"#fff":"transparent",color:mode===v?"#3d2b1a":"#7a6650",fontWeight:600,fontSize:13,boxShadow:mode===v?"0 2px 8px rgba(0,0,0,0.08)":"none"}}>{l}</button>
              ))}
            </div>
            {mode==="flash"?<Flashcard words={filtered}/>:<Quiz words={filtered} onDone={handleDone}/>}
          </>
        )}
        {tab==="ranking"&&<Ranking userId={userId}/>}
        {tab==="words"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filtered.map((w,i)=>(
              <div key={i} style={{background:"#faf6f0",border:"1px solid #e0d8cc",borderRadius:14,padding:"12px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:16,fontWeight:700,color:"#2d1f0e",fontFamily:"'Noto Serif KR',serif"}}>{w.word}</span>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}><Tag label={w.category}/><Dots level={w.level}/></div>
                </div>
                <div style={{fontSize:13,color:"#5c4030",marginBottom:3}}>{w.meaning}</div>
                <div style={{fontSize:12,color:"#a09080"}}>예) {w.example}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
