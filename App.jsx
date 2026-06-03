import { useState, useEffect, useRef, useCallback } from "react";

// ─── 단어 데이터 ──────────────────────────────────────────────
const CLASSIC_WORDS = [
  { word: "반공", meaning: "허공, 공중", example: "학이 반공에 높이 떠올랐다.", category: "고전" },
  { word: "유정", meaning: "뜻이 있음. 마음을 가지고 있는 대상을 가리키기도 함", example: "강산도 유정하여 날 보고 웃는다.", category: "고전" },
  { word: "창해", meaning: "넓고 푸른 바다", example: "창해 같은 넓은 세상을 바라본다.", category: "고전" },
  { word: "부용", meaning: "연꽃", example: "부용이 물 위에 곱게 피었다.", category: "고전" },
  { word: "천만겁", meaning: "아주 길고 오랜 세월", example: "천만겁이 지나도 변치 않을 마음이다.", category: "고전" },
  { word: "호의현상", meaning: "흰 저고리와 검은 치마. 몸통은 희고 다리는 검은 학을 가리킴", example: "호의현상의 학이 무리 지어 난다.", category: "고전" },
  { word: "삼일우", meaning: "사흘 동안 내리는 비. 백성에게 도움이 되기에 좋은 정치를 의미하기도 함", example: "삼일우가 내려 농사에 도움이 되었다.", category: "고전" },
  { word: "필담", meaning: "글로 써서 나누는 대화", example: "말이 통하지 않아 필담으로 의사를 전했다.", category: "고전" },
  { word: "구구두", meaning: "공경하는 뜻으로 머리를 땅에 아홉 번 조아림", example: "신하가 임금 앞에 구구두를 올렸다.", category: "고전" },
  { word: "앙호수필", meaning: "양털로 만든 붓", example: "앙호수필로 글씨를 써 내려갔다.", category: "고전" },
  { word: "안표", meaning: "안회의 표주박. 가난하게 살면서도 즐거워했음을 이르는 말", example: "안표 누항에 살면서도 즐거움을 잃지 않았다.", category: "고전" },
  { word: "원헌", meaning: "공자의 제자로, 가난 속에서도 욕심 없이 깨끗하게 살았음", example: "원헌처럼 가난하나 청렴하게 살겠다.", category: "고전" },
  { word: "환곡", meaning: "곡식을 봄에 백성에게 빌려주고 가을에 이자와 함께 거두던 제도", example: "환곡의 폐단이 백성들을 괴롭혔다.", category: "고전" },
  { word: "빙자옥질", meaning: "얼음같이 맑고 깨끗한 피부와 옥같이 아름다운 성질", example: "빙자옥질의 매화가 겨울에 피었다.", category: "고전" },
  { word: "계면도", meaning: "계면조. 슬프고 애타는 듯한 느낌을 주는 국악 가락", example: "계면도로 연주하니 더욱 슬프게 들렸다.", category: "고전" },
  { word: "비익조", meaning: "암수가 각각 눈과 날개가 하나씩이어서 짝을 지어야만 나는 새", example: "비익조처럼 둘이 함께해야 완전해진다.", category: "고전" },
  { word: "연리지", meaning: "두 나무의 가지가 서로 맞닿아 결이 통한 것. 사이좋은 부부나 남녀를 비유", example: "연리지처럼 우리는 하나가 되었다.", category: "고전" },
  { word: "화조월석", meaning: "꽃 피는 아침과 달 밝은 밤. 경치가 좋은 시절을 이르는 말", example: "화조월석에 님 생각이 더욱 간절하다.", category: "고전" },
  { word: "청조", meaning: "신녀 서왕모를 위해 소식을 전해 주는 신화 속의 푸른 새. 편지나 사자를 의미", example: "청조야 너는 님 계신 곳을 아느냐.", category: "고전" },
  { word: "봉고파출", meaning: "어사가 고을 원을 파면하고 관가의 창고를 봉인하여 잠금", example: "암행어사가 봉고파출을 명하였다.", category: "고전" },
  { word: "앙대", meaning: "남녀 사이의 사귀는 정을 의미", example: "앙대의 정을 잊지 못하여 그리워한다.", category: "고전" },
  { word: "전문", meaning: "다른 사람에게 전해 들음", example: "전문으로 들은 소식이라 확실하지 않다.", category: "고전" },
  { word: "상면연", meaning: "일을 마치고 떠나가는 외국 사신들을 위하여 베풀던 잔치", example: "상면연을 베풀어 사신들을 환송하였다.", category: "고전" },
  { word: "모첨", meaning: "초가지붕의 처마", example: "모첨에 제비가 집을 지었다.", category: "고전" },
  { word: "천지간", meaning: "하늘과 땅 사이. 이 세상", example: "천지간에 이렇게 아름다운 경치가 또 있을까.", category: "고전" },
  { word: "풍월", meaning: "맑은 바람과 밝은 달. 자연을 즐기는 풍류", example: "강산 풍월을 벗 삼아 살아가련다.", category: "고전" },
  { word: "건곤", meaning: "온 천지, 온 세상", example: "건곤이 흰 눈으로 덮였다.", category: "고전" },
  { word: "도화", meaning: "복숭아꽃", example: "도화가 활짝 핀 봄날이 완연하다.", category: "고전" },
  { word: "유심터라", meaning: "속이 깊구나", example: "그 뜻이 유심터라 쉬이 헤아릴 수 없다.", category: "고전" },
  { word: "짐짓", meaning: "일부러 그렇게", example: "그는 짐짓 모르는 체하였다.", category: "고전" },
  { word: "초석", meaning: "짚으로 만든 천", example: "초석을 깔고 그 위에 앉았다.", category: "고전" },
  { word: "황혼월", meaning: "저녁에 뜨는 달", example: "황혼월이 뜨자 그리움이 사무쳤다.", category: "고전" },
  { word: "척촉", meaning: "철쭉", example: "척촉이 붉게 피어 산을 물들였다.", category: "고전" },
  { word: "매영", meaning: "매화의 그림자", example: "매영이 창에 비치니 운치가 있다.", category: "고전" },
  { word: "수괴키", meaning: "부끄럽고 창피하기", example: "이 일이 수괴키 짝이 없다.", category: "고전" },
  { word: "곡절", meaning: "이유, 까닭", example: "이런 곡절이 있어 늦게 왔노라.", category: "고전" },
  { word: "시전지", meaning: "시를 쓰는 종이", example: "시전지에 정성껏 시를 써 내려갔다.", category: "고전" },
  { word: "동명", meaning: "동해", example: "동명의 떠오르는 해를 바라보았다.", category: "고전" },
  { word: "벽수", meaning: "짙푸른 빛이 나도록 맑고 깊은 물", example: "벽수가 흘러 산을 감돌았다.", category: "고전" },
  { word: "장하다", meaning: "훌륭하다, 대단하다", example: "그 기상이 장하여 모두가 감탄하였다.", category: "고전" },
  { word: "인걸", meaning: "특히 뛰어난 인재", example: "지령이 인걸이라 하였으니 이곳도 그러하다.", category: "고전" },
  { word: "형용", meaning: "생김새, 모양새", example: "그 형용이 맑고 고와 신선 같았다.", category: "고전" },
  { word: "넉넉히", meaning: "분명히, 또렷하게 (고어)", example: "그 뜻을 넉넉히 알아차렸다.", category: "고전" },
  { word: "그지없고", meaning: "끝이 없고", example: "은혜가 그지없고 넓어 다 갚을 수 없다.", category: "고전" },
  { word: "구만리", meaning: "아득하게 먼 거리를 비유", example: "구만리 같은 먼 길을 홀로 떠났다.", category: "고전" },
  { word: "지함", meaning: "땅이 움푹하게 주저앉은 곳", example: "지함에 빠져 발을 다쳤다.", category: "고전" },
  { word: "녁넉", meaning: "분명히, 또렷하게", example: "그 잘못을 녁넉 알면서도 모른 척하였다.", category: "고전" },
  { word: "상통하다", meaning: "서로 통하다", example: "우리의 마음이 서로 상통하였다.", category: "고전" },
  { word: "서책", meaning: "책", example: "서책을 가까이하며 학문을 닦았다.", category: "고전" },
  { word: "만구하다", meaning: "가득하다", example: "기쁨이 만구하여 넘쳐흘렀다.", category: "고전" },
];

const MODERN_WORDS = [
  { word: "환원주의", meaning: "복잡한 현상을 더 단순한 구성 요소로 분해하여 설명하려는 입장", example: "환원주의는 생명 현상을 물리·화학 법칙으로 설명하려 한다.", category: "현대" },
  { word: "조작적 정의", meaning: "추상적 개념을 측정 가능한 절차나 조작으로 구체화한 정의", example: "지능을 IQ 점수로 나타내는 것은 조작적 정의의 예다.", category: "현대" },
  { word: "반증가능성", meaning: "어떤 이론이나 가설이 경험적으로 반박될 수 있는 가능성. 포퍼가 과학의 기준으로 제시", example: "반증가능성이 없는 주장은 과학적이라 할 수 없다.", category: "현대" },
  { word: "연역", meaning: "일반적인 원리에서 개별적 사실을 이끌어 내는 추론 방법", example: "삼단논법은 연역 추론의 대표적 형식이다.", category: "현대" },
  { word: "귀납", meaning: "개별적인 사실들로부터 일반적 원리를 이끌어 내는 추론 방법", example: "수천 번의 관찰로 귀납적 일반화를 시도했다.", category: "현대" },
  { word: "유비추론", meaning: "두 대상이 몇 가지 점에서 유사하다면 다른 점도 유사할 것이라는 추론", example: "지구와 화성의 유사성을 근거로 한 유비추론이 제시되었다.", category: "현대" },
  { word: "딜레마", meaning: "어느 쪽을 선택해도 바람직하지 못한 결과가 나오는 곤란한 상황", example: "죄수의 딜레마는 협력과 배신의 갈등 구조를 보여준다.", category: "현대" },
  { word: "패러독스", meaning: "겉으로는 모순된 것 같지만 실제로는 진리인 명제나 상황", example: "아킬레스와 거북의 패러독스는 무한 분할의 문제를 다룬다.", category: "현대" },
  { word: "인식론", meaning: "지식의 기원·본질·범위·한계를 탐구하는 철학 분야", example: "데카르트의 인식론은 의심할 수 없는 확실성을 추구했다.", category: "현대" },
  { word: "존재론", meaning: "존재 자체의 본질과 구조를 탐구하는 철학 분야", example: "존재론적 물음은 '무엇이 실재하는가'를 묻는다.", category: "현대" },
  { word: "공리", meaning: "증명 없이 자명하게 참으로 받아들여지는 명제", example: "유클리드 기하학은 다섯 가지 공리에서 출발한다.", category: "현대" },
  { word: "정합성", meaning: "여러 명제나 이론이 서로 모순 없이 잘 들어맞는 성질", example: "이 이론은 내적 정합성은 있으나 현실 설명력이 부족하다.", category: "현대" },
  { word: "함의", meaning: "겉으로 드러나지 않고 속에 담겨 있는 뜻. 논리학에서는 전건이 참일 때 후건도 참임을 보장하는 관계", example: "그 발언의 정치적 함의를 간파해야 한다.", category: "현대" },
  { word: "수반관계", meaning: "한 속성이 변하면 반드시 다른 속성도 변하는 의존 관계", example: "심리 상태는 뇌의 물리적 상태에 수반한다는 주장이 있다.", category: "현대" },
  { word: "환원불가능성", meaning: "어떤 현상이나 개념이 더 기본적인 것으로 완전히 설명될 수 없는 성질", example: "의식의 환원불가능성은 심리철학의 핵심 문제다.", category: "현대" },
  { word: "이분법", meaning: "어떤 개념이나 현상을 두 가지로 나누는 사고방식", example: "선과 악의 이분법적 구분은 현실을 단순화한다.", category: "현대" },
  { word: "변증법", meaning: "정(正)·반(反)·합(合)의 과정을 통해 모순을 지양하며 발전하는 논리", example: "헤겔의 변증법은 역사를 정신의 자기실현 과정으로 본다.", category: "현대" },
  { word: "상대주의", meaning: "진리·가치·지식은 절대적이지 않고 상황·문화·개인에 따라 다르다는 입장", example: "문화 상대주의는 타 문화를 그 사회의 기준으로 이해한다.", category: "현대" },
  { word: "실증주의", meaning: "경험적으로 검증 가능한 것만이 참된 지식이라는 철학적 입장", example: "실증주의는 형이상학적 명제를 무의미하다고 본다.", category: "현대" },
  { word: "기능주의", meaning: "마음의 상태를 물리적 구성이 아닌 기능적 역할로 정의하는 입장", example: "기능주의에 따르면 마음은 입력·출력 관계로 정의된다.", category: "현대" },
  { word: "창발", meaning: "하위 수준의 요소들이 결합하여 예측 불가한 새로운 성질이 나타나는 현상", example: "의식은 뇌 신경의 창발적 속성이라는 견해가 있다.", category: "현대" },
  { word: "환류", meaning: "출력 결과가 다시 입력에 영향을 미치는 순환 구조. 피드백", example: "사이버네틱스는 환류 메커니즘으로 시스템을 설명한다.", category: "현대" },
  { word: "외삽", meaning: "알려진 데이터 범위 바깥으로 추론을 확장하는 것", example: "과거 데이터를 외삽하여 미래를 예측하는 데는 한계가 있다.", category: "현대" },
  { word: "내삽", meaning: "알려진 데이터 사이의 값을 추정하는 것", example: "두 관측값 사이를 내삽하여 중간값을 구했다.", category: "현대" },
  { word: "역설", meaning: "겉으로 모순처럼 보이지만 그 속에 진리를 담고 있는 표현이나 명제", example: "제논의 역설은 무한급수 개념으로 해결된다.", category: "현대" },
  { word: "간주관성", meaning: "개인의 주관을 넘어 여러 주체 사이에서 공유되는 객관성", example: "과학적 지식의 타당성은 간주관적 검증에 의존한다.", category: "현대" },
  { word: "명제", meaning: "참이나 거짓을 판단할 수 있는 문장이나 식", example: "논리학에서 명제는 진릿값을 갖는 진술이다.", category: "현대" },
  { word: "개연성", meaning: "확실하지는 않으나 그럴 가능성이 있는 정도", example: "귀납 추론은 필연성이 아닌 개연성을 보장한다.", category: "현대" },
  { word: "정언명령", meaning: "칸트가 제시한 무조건적 도덕 명령. 조건 없이 따라야 할 의무", example: "정언명령은 결과와 무관하게 지켜야 할 도덕 원칙이다.", category: "현대" },
  { word: "공리주의", meaning: "최대 다수의 최대 행복을 도덕의 기준으로 삼는 윤리학 이론", example: "공리주의는 행위의 옳고 그름을 결과의 유용성으로 판단한다.", category: "현대" },
  { word: "존재론적 환원", meaning: "상위 수준의 존재를 하위 수준의 존재로 설명하려는 시도", example: "마음을 뇌 상태로 설명하는 것이 존재론적 환원의 예다.", category: "현대" },
  { word: "아포리아", meaning: "해결 불가능한 난제. 논리적으로 빠져나올 수 없는 막힌 상태", example: "소크라테스의 대화는 종종 아포리아로 끝맺는다.", category: "현대" },
  { word: "코페르니쿠스적 전환", meaning: "기존의 관점을 완전히 뒤집는 혁명적 발상의 전환", example: "칸트는 인식론에서 코페르니쿠스적 전환을 이루었다.", category: "현대" },
  { word: "패러다임", meaning: "특정 시대나 분야에서 사람들의 견해와 사고를 지배하는 이론적 틀", example: "쿤은 과학 혁명을 패러다임의 전환으로 설명했다.", category: "현대" },
  { word: "헤게모니", meaning: "한 집단이 다른 집단에 대해 갖는 지배적 영향력", example: "그람시는 문화적 헤게모니로 지배 구조를 설명했다.", category: "현대" },
  { word: "담론", meaning: "특정 주제에 대해 형성된 지식·권력·언어의 체계", example: "푸코는 담론이 진리를 구성한다고 보았다.", category: "현대" },
  { word: "자기언급", meaning: "명제나 시스템이 자기 자신을 지시하거나 포함하는 것", example: "이 문장은 거짓이다는 자기언급의 역설을 만들어 낸다.", category: "현대" },
  { word: "오컴의 면도날", meaning: "불필요한 가정을 제거해야 한다는 사고 절약의 원리", example: "오컴의 면도날에 따르면 더 단순한 설명이 선호된다.", category: "현대" },
  { word: "실재론", meaning: "우리의 인식과 독립하여 외부 세계가 실재한다는 철학적 입장", example: "과학적 실재론은 이론적 대상이 실제로 존재한다고 본다.", category: "현대" },
  { word: "구성주의", meaning: "지식이나 현실은 객관적으로 주어진 것이 아니라 인간이 능동적으로 구성한다는 입장", example: "구성주의 인식론은 학습자가 지식을 스스로 구성한다고 본다.", category: "현대" },
  { word: "목적론", meaning: "모든 사물이나 행위는 일정한 목적을 향해 움직인다는 이론", example: "아리스토텔레스의 목적론은 자연의 내재적 목적을 강조한다.", category: "현대" },
  { word: "결정론", meaning: "모든 사건은 이전 원인에 의해 필연적으로 결정된다는 이론", example: "결정론이 맞다면 자유의지는 환상에 불과하다.", category: "현대" },
  { word: "이원론", meaning: "세계나 인간을 두 가지 근본적으로 다른 실체로 설명하는 이론", example: "데카르트의 심신 이원론은 정신과 물질을 분리한다.", category: "현대" },
  { word: "일원론", meaning: "세계의 근본 실체는 하나라는 철학적 입장", example: "스피노자의 일원론은 신과 자연을 동일시한다.", category: "현대" },
  { word: "인과관계", meaning: "원인과 결과 사이의 필연적 연결 관계", example: "상관관계가 있다고 해서 반드시 인과관계가 성립하지는 않는다.", category: "현대" },
  { word: "후건 긍정의 오류", meaning: "P이면 Q이다에서 Q가 참이므로 P도 참이라고 잘못 추론하는 오류", example: "비가 오면 땅이 젖는다에서 땅이 젖었으니 비가 왔다는 후건 긍정의 오류다.", category: "현대" },
  { word: "전건 부정의 오류", meaning: "P이면 Q이다에서 P가 거짓이므로 Q도 거짓이라고 잘못 추론하는 오류", example: "노력하면 성공한다에서 노력 안 했으니 실패한다는 전건 부정의 오류다.", category: "현대" },
  { word: "유명론", meaning: "보편자는 실재하지 않고 이름만 있을 뿐이라는 철학적 입장", example: "유명론은 '인간'이라는 보편자는 없고 개별 인간만 있다고 본다.", category: "현대" },
  { word: "형이상학", meaning: "경험을 넘어선 존재·본질·원인 등을 탐구하는 철학 분야", example: "형이상학은 시간·공간·인과성의 본질을 묻는다.", category: "현대" },
  { word: "현상학", meaning: "의식에 나타나는 현상 자체를 직접 기술하고 분석하는 철학 방법", example: "후설의 현상학은 의식의 지향성을 핵심 개념으로 삼는다.", category: "현대" },
];

const QUESTION_TIME = 15;
const SUPABASE_URL = "https://rpmvugzjxkynkopvglpf.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZdoQVbETd9sogIFqSxZ5XA_jc7bGkcd";
const MEDAL = ["🥇","🥈","🥉"];

// ─── 음악 ────────────────────────────────────────────────────
function useMusic() {
  const ctxRef = useRef(null);
  const loopRef = useRef(null);
  const modeRef = useRef(null);
  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);
  const noteFreq = (note) => { const map={C:0,D:2,E:4,F:5,G:7,A:9,B:11}; const m=note.match(/([A-G]#?)(\d)/); if(!m)return 440; const base=map[m[1][0]]+(m[1][1]==='#'?1:0); return 440*Math.pow(2,(base+(parseInt(m[2])-4)*12-9)/12); };
  const playNote = useCallback((ctx,freq,when,dur,type="triangle",vol=0.12)=>{ try{ const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.setValueAtTime(0.001,when); g.gain.linearRampToValueAtTime(vol,when+0.03); g.gain.linearRampToValueAtTime(0.001,when+dur*0.85); o.connect(g); g.connect(ctx.destination); o.start(when); o.stop(when+dur); }catch(e){} },[]);
  const scheduleMusic = useCallback((mode)=>{
    const ctx=getCtx();
    const normal={notes:["C4","E4","G4","E4","F4","A4","G4","E4","D4","F4","A4","G4","C5","B4","G4","E4"],durs:[0.5,0.5,0.5,0.5,0.5,0.5,1.0,0.5,0.5,0.5,0.5,0.5,1.0,0.5,0.5,2.0],bpm:116};
    const urgent={notes:["C5","C5","B4","C5","D5","C5","B4","A4","G4","A4","B4","C5","D5","E5","D5","C5"],durs:[0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.5,0.25,0.25,0.25,0.25,0.25,0.5,0.25,0.5],bpm:170};
    const seq=mode==="urgent"?urgent:normal;
    const beat=60/seq.bpm; let t=ctx.currentTime+0.05;
    const totalDur=seq.durs.reduce((a,b)=>a+b,0)*beat;
    seq.notes.forEach((note,i)=>{ const dur=seq.durs[i]*beat; playNote(ctx,noteFreq(note),t,dur,mode==="urgent"?"square":"triangle",0.12); if(i%4===0){const bass=["C3","F3","G3","A3"][Math.floor(i/4)%4]; playNote(ctx,noteFreq(bass),t,beat*2,"sine",0.07);} if(mode==="urgent"&&i%2===0)playNote(ctx,55,t,beat*0.15,"sine",0.18); t+=dur; });
    return totalDur*1000;
  },[getCtx,playNote]);
  const start=useCallback((mode)=>{ if(modeRef.current===mode)return; stop(); modeRef.current=mode; const loop=()=>{ if(modeRef.current!==mode)return; const ms=scheduleMusic(mode); loopRef.current=setTimeout(loop,ms-120); }; loop(); },[scheduleMusic]);
  const stop=useCallback(()=>{ modeRef.current=null; if(loopRef.current){clearTimeout(loopRef.current);loopRef.current=null;} if(ctxRef.current){try{ctxRef.current.close();}catch(e){}ctxRef.current=null;} },[]);
  const playEffect=useCallback((type)=>{ try{ const ctx=getCtx(); const t=ctx.currentTime; if(type==="correct"){[[523,0,0.15],[659,0.07,0.15],[784,0.14,0.25]].forEach(([freq,delay,dur])=>playNote(ctx,freq,t+delay,dur,"triangle",0.18));} else if(type==="wrong"){[[280,0,0.12],[220,0.1,0.2]].forEach(([freq,delay,dur])=>playNote(ctx,freq,t+delay,dur,"sawtooth",0.15));} else if(type==="timeout"){[[440,0,0.08],[440,0.1,0.08],[330,0.2,0.2]].forEach(([freq,delay,dur])=>playNote(ctx,freq,t+delay,dur,"square",0.14));} }catch(e){} },[getCtx,playNote]);
  useEffect(()=>()=>stop(),[stop]);
  return { start, stop, playEffect };
}

// ─── 랭킹 ────────────────────────────────────────────────────
async function getRanking(category) {
  try {
    const res = await fetch(SUPABASE_URL + "/rest/v1/ranking?select=*&category=eq." + category + "&order=best.desc,best_time.asc&limit=20", {
      headers: { "Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch(e) { return []; }
}

async function submitScore(userId, pct, category, timeTaken) {
  try {
    const existing = await fetch(SUPABASE_URL + "/rest/v1/ranking?user_id=eq."+encodeURIComponent(userId)+"&category=eq."+category, {
      headers: {"apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY}
    });
    const data = await existing.json();
    if (data && data[0]) {
      const prev = data[0];
      const newBest = Math.max(prev.best, pct);
      const newBestTime = newBest > prev.best ? timeTaken : (newBest === prev.best ? Math.min(prev.best_time, timeTaken) : prev.best_time);
      await fetch(SUPABASE_URL + "/rest/v1/ranking?user_id=eq."+encodeURIComponent(userId)+"&category=eq."+category, {
        method:"PATCH", headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY},
        body:JSON.stringify({best:newBest, best_time:newBestTime, tries:prev.tries+1, last:pct})
      });
    } else {
      await fetch(SUPABASE_URL + "/rest/v1/ranking", {
        method:"POST", headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY,"Prefer":"return=minimal"},
        body:JSON.stringify({user_id:userId, best:pct, best_time:timeTaken, tries:1, last:pct, category})
      });
    }
    return await getRanking(category);
  } catch(e) { return []; }
}

// ─── UI 헬퍼 ─────────────────────────────────────────────────
const fBtn = (active) => ({padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:active?"#3d2b1a":"#e8e0d4",color:active?"#f0e8d8":"#7a6650"});
const nBtn = (dis) => ({width:40,height:40,borderRadius:"50%",border:"1px solid #d4c8b4",background:dis?"#f5f0e8":"#faf6f0",cursor:dis?"not-allowed":"pointer",color:dis?"#ccc":"#5c3d20",fontSize:16});
function Bar({v,t}) { return <div style={{height:4,background:"#e8e0d4",borderRadius:2,margin:"8px 0"}}><div style={{height:"100%",borderRadius:2,width:(v/t*100)+"%",background:"linear-gradient(90deg,#c8a882,#8b6914)",transition:"width 0.4s"}}/></div>; }

// ─── 로그인 ──────────────────────────────────────────────────
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

// ─── 플래시카드 ──────────────────────────────────────────────
function Flashcard({words}) {
  const [i,setI]=useState(0); const [flip,setFlip]=useState(false); const [known,setKnown]=useState(new Set());
  const w=words[i];
  if(!w)return <div style={{textAlign:"center",padding:40,color:"#8b6914"}}>단어가 없습니다.</div>;
  const go=d=>{setFlip(false);setTimeout(()=>setI(x=>Math.max(0,Math.min(words.length-1,x+d))),120);};
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
      <Bar v={i+1} t={words.length}/>
      <div style={{color:"#7a6650",fontSize:12}}>{i+1} / {words.length}</div>
      <div onClick={()=>setFlip(f=>!f)} style={{width:"100%",maxWidth:420,minHeight:200,background:flip?"linear-gradient(135deg,#3d2b1a,#5c3d20)":"linear-gradient(135deg,#faf6f0,#f0e8d8)",border:flip?"1px solid #8b6914":"1px solid #d4c8b4",borderRadius:20,padding:"28px 24px",cursor:"pointer",userSelect:"none",boxShadow:flip?"0 8px 32px rgba(139,105,20,0.25)":"0 4px 20px rgba(0,0,0,0.08)",transition:"all 0.3s",display:"flex",flexDirection:"column",justifyContent:"center",gap:10,boxSizing:"border-box"}}>
        {!flip?<div style={{textAlign:"center"}}><div style={{fontSize:36,fontFamily:"'Noto Serif KR',serif",fontWeight:700,color:"#2d1f0e",letterSpacing:3}}>{w.word}</div><div style={{marginTop:10,color:"#a09080",fontSize:12}}>카드를 눌러 뜻 확인</div></div>
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

// ─── 퀴즈 ────────────────────────────────────────────────────
function Quiz({words, userId, category, onDone}) {
  const [started,setStarted]=useState(false);
  const [qi,setQi]=useState(0); const [score,setScore]=useState(0); const [done,setDone]=useState(false);
  const [qs,setQs]=useState([]); const [timeLeft,setTimeLeft]=useState(QUESTION_TIME);
  const [result,setResult]=useState(null); // {rank, total}
  const ivRef=useRef(null); const scoreRef=useRef(0); const startTimeRef=useRef(0);
  const {start:startMusic,stop:stopMusic,playEffect}=useMusic();

  const build=useCallback((w)=>{
    const s=[...w].sort(()=>Math.random()-0.5).slice(0,Math.min(20,w.length));
    return s.map(q=>{ const wrongs=w.filter(x=>x.word!==q.word).sort(()=>Math.random()-0.5).slice(0,3); const opts=[...wrongs.map(x=>x.word),q.word].sort(()=>Math.random()-0.5); return {...q,options:opts,answer:q.word}; });
  },[]);

  const startTimer=useCallback(()=>{ if(ivRef.current)clearInterval(ivRef.current); setTimeLeft(QUESTION_TIME); ivRef.current=setInterval(()=>{ setTimeLeft(t=>{if(t<=1){clearInterval(ivRef.current);return 0;}return t-1;}); },1000); },[]);

  const handleStart=()=>{ const q=build(words); setQs(q); setQi(0); setScore(0); scoreRef.current=0; setDone(false); setResult(null); setStarted(true); startTimeRef.current=Date.now(); };

  useEffect(()=>{ if(!started||!qs.length||done)return; startTimer(); startMusic("normal"); return()=>{if(ivRef.current)clearInterval(ivRef.current);}; },[qi,started,qs.length,done]);

  useEffect(()=>{ if(!started||done)return; if(timeLeft>0&&timeLeft<=5)startMusic("urgent"); else if(timeLeft>5)startMusic("normal"); },[timeLeft,started,done]);

  const finishQuiz = useCallback(async (finalScore) => {
    stopMusic();
    setDone(true);
    const pct = Math.round((finalScore/qs.length)*100);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    const ranking = await onDone(finalScore, qs.length, timeTaken);
    if (ranking && ranking.length > 0) {
      const myRank = ranking.findIndex(e => e.user_id === userId) + 1;
      setResult({ rank: myRank > 0 ? myRank : ranking.length + 1, total: ranking.length });
    }
  }, [qs.length, onDone, stopMusic, userId]);

  useEffect(()=>{ if(!started||timeLeft!==0||!qs.length||done)return; playEffect("timeout"); const q=qs[qi]; if(qi===qs.length-1){ finishQuiz(scoreRef.current); } else { setTimeout(()=>{setQi(x=>x+1);},600); } },[timeLeft,started,qs.length,done,qi]);

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

  if(done){
    const pct=Math.round((scoreRef.current/qs.length)*100);
    return(
      <div style={{textAlign:"center",padding:32}}>
        <div style={{fontSize:52,marginBottom:8}}>{pct>=80?"🎉":pct>=50?"👍":"📚"}</div>
        <div style={{fontSize:28,fontWeight:700,color:"#3d2b1a",fontFamily:"'Noto Serif KR',serif"}}>{scoreRef.current} / {qs.length}</div>
        <div style={{fontSize:22,color:"#8b6914",fontWeight:700,marginTop:4}}>{pct}점</div>
        {result && (
          <div style={{marginTop:12,padding:"12px 20px",background:"linear-gradient(135deg,#fff8ec,#faf0d8)",borderRadius:16,border:"1px solid #c8a882",display:"inline-block"}}>
            <div style={{fontSize:16,fontWeight:700,color:"#3d2b1a"}}>
              {result.rank <= 3 ? MEDAL[result.rank-1] : ""} {category} 랭킹 {result.rank}위!
            </div>
            <div style={{fontSize:12,color:"#a09080",marginTop:4}}>전체 {result.total}명 중</div>
          </div>
        )}
        <div style={{color:"#a09080",fontSize:12,marginTop:12}}>랭킹에 등록됐어요</div>
        <button onClick={handleStart} style={{marginTop:20,padding:"10px 28px",background:"#8b6914",color:"#fff",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600}}>다시 풀기</button>
      </div>
    );
  }

  const q=qs[qi]; const urgent=timeLeft<=5;
  const timerColor=urgent?"#e05050":timeLeft<=10?"#e09030":"#5a8a5a";
  const timerBar=urgent?"linear-gradient(90deg,#e05050,#ff8080)":timeLeft<=10?"linear-gradient(90deg,#e09030,#f0c060)":"linear-gradient(90deg,#5a8a5a,#80c080)";

  const pick=(opt)=>{
    if(ivRef.current)clearInterval(ivRef.current);
    const correct=opt===q.answer;
    playEffect(correct?"correct":"wrong");
    if(correct){scoreRef.current+=1;setScore(s=>s+1);}
    if(qi===qs.length-1){ finishQuiz(correct?scoreRef.current:scoreRef.current); }
    else { setTimeout(()=>{setQi(x=>x+1);},correct?400:600); }
  };

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
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {q.options.map((opt,i)=>(
          <button key={i} onClick={()=>pick(opt)} style={{padding:"12px 16px",background:"#faf6f0",border:"1px solid #d4c8b4",borderRadius:12,cursor:"pointer",color:"#3d2b1a",fontSize:15,fontFamily:"'Noto Serif KR',serif",fontWeight:600,textAlign:"left",transition:"all 0.2s"}}>
            {String.fromCharCode(65+i)}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 랭킹보드 ────────────────────────────────────────────────
function RankingBoard({userId, category}) {
  const [list,setList]=useState([]); const [loading,setLoading]=useState(true);
  const load=async()=>{ setLoading(true); const data=await getRanking(category); setList(data.slice(0,20)); setLoading(false); };
  useEffect(()=>{load();},[category]);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:16,fontWeight:700,color:"#2d1f0e"}}>🏆 {category} 랭킹</div>
        <button onClick={load} style={{padding:"5px 12px",background:"#e8e0d4",border:"none",borderRadius:10,cursor:"pointer",fontSize:12,color:"#5c3d20",fontWeight:600}}>새로고침</button>
      </div>
      {loading?<div style={{textAlign:"center",padding:40,color:"#a09080"}}>불러오는 중...</div>
      :list.length===0?<div style={{textAlign:"center",padding:40,color:"#a09080"}}><div style={{fontSize:36,marginBottom:8}}>📊</div>아직 기록이 없어요!<br/>퀴즈를 풀면 여기에 등록돼요.</div>
      :<div style={{display:"flex",flexDirection:"column",gap:8}}>
        {list.map((e,i)=>(
          <div key={e.user_id} style={{background:e.user_id===userId?"linear-gradient(135deg,#fff8ec,#faf0d8)":"#faf6f0",border:e.user_id===userId?"1.5px solid #c8a882":"1px solid #e0d8cc",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:i<3?24:14,width:32,textAlign:"center",fontWeight:700,color:"#a09080"}}>{i<3?MEDAL[i]:i+1}</div>
            <div style={{flex:1}}><div style={{fontWeight:700,color:"#2d1f0e",fontSize:15}}>{e.user_id} {e.user_id===userId&&<span style={{fontSize:11,color:"#8b6914"}}>(나)</span>}</div><div style={{fontSize:12,color:"#a09080",marginTop:2}}>도전 {e.tries}회 · 최근 {e.last}점</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:700,color:"#8b6914"}}>{e.best}점</div><div style={{fontSize:11,color:"#a09080"}}>{e.best_time}초</div></div>
          </div>
        ))}
      </div>}
    </div>
  );
}

// ─── 메인 ────────────────────────────────────────────────────
export default function App() {
  const [userId,setUserId]=useState(null);
  const [wordCat,setWordCat]=useState("고전"); // 고전 / 현대
  const [mode,setMode]=useState("flash");
  const [tab,setTab]=useState("learn");

  const words = wordCat === "고전" ? CLASSIC_WORDS : MODERN_WORDS;

  const handleDone=async(score,total,timeTaken)=>{
    if(!userId)return [];
    const pct=Math.round(score/total*100);
    return await submitScore(userId,pct,wordCat,timeTaken);
  };

  if(!userId)return <Login onLogin={setUserId}/>;

  return(
    <div style={{minHeight:"100vh",background:"#f5f0e8",fontFamily:"'Noto Sans KR',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",paddingBottom:40}}>
      <div style={{width:"100%",background:"linear-gradient(135deg,#2d1f0e,#4a3020)",padding:"18px 20px 14px",boxSizing:"border-box"}}>
        <div style={{maxWidth:480,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{color:"#c8a882",fontSize:11,letterSpacing:3,marginBottom:2}}>수능 국어</div>
              <div style={{color:"#faf0e0",fontSize:20,fontWeight:700,fontFamily:"'Noto Serif KR',serif"}}>어휘 학습 카드</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:"#c8a882",fontSize:13,fontWeight:600}}>👤 {userId}</div>
              <button onClick={()=>setUserId(null)} style={{marginTop:4,padding:"3px 10px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(200,168,130,0.3)",borderRadius:10,color:"#a09070",fontSize:11,cursor:"pointer"}}>로그아웃</button>
            </div>
          </div>
          {/* 고전/현대 탭 */}
          <div style={{display:"flex",gap:6,marginTop:12}}>
            {["고전","현대"].map(c=>(
              <button key={c} onClick={()=>{setWordCat(c);setMode("flash");}} style={{padding:"6px 18px",borderRadius:20,border:"none",cursor:"pointer",background:wordCat===c?"#c8a882":"rgba(255,255,255,0.1)",color:wordCat===c?"#2d1f0e":"#c8a882",fontWeight:700,fontSize:13}}>{c} 어휘</button>
            ))}
          </div>
          {/* 메뉴 탭 */}
          <div style={{display:"flex",gap:6,marginTop:8}}>
            {[["learn","학습"],["ranking","🏆 랭킹"],["words","단어목록"]].map(([v,l])=>(
              <button key={v} onClick={()=>setTab(v)} style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",background:tab===v?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.08)",color:"#faf0e0",fontWeight:600,fontSize:12}}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{width:"100%",maxWidth:480,padding:"16px",boxSizing:"border-box"}}>
        {tab==="learn"&&(
          <>
            <div style={{display:"flex",background:"#e8e0d4",borderRadius:12,padding:4,marginBottom:16}}>
              {[["flash","📖 플래시카드"],["quiz","📝 퀴즈"]].map(([v,l])=>(
                <button key={v} onClick={()=>setMode(v)} style={{flex:1,padding:"8px",border:"none",borderRadius:10,cursor:"pointer",background:mode===v?"#fff":"transparent",color:mode===v?"#3d2b1a":"#7a6650",fontWeight:600,fontSize:13,boxShadow:mode===v?"0 2px 8px rgba(0,0,0,0.08)":"none"}}>{l}</button>
              ))}
            </div>
            {mode==="flash"?<Flashcard words={words}/>:<Quiz words={words} userId={userId} category={wordCat} onDone={handleDone}/>}
          </>
        )}
        {tab==="ranking"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {["고전","현대"].map(c=>(
                <button key={c} onClick={()=>setWordCat(c)} style={fBtn(wordCat===c)}>{c} 랭킹</button>
              ))}
            </div>
            <RankingBoard userId={userId} category={wordCat}/>
          </div>
        )}
        {tab==="words"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {words.map((w,i)=>(
              <div key={i} style={{background:"#faf6f0",border:"1px solid #e0d8cc",borderRadius:14,padding:"12px 16px"}}>
                <div style={{fontWeight:700,color:"#2d1f0e",fontSize:16,fontFamily:"'Noto Serif KR',serif",marginBottom:4}}>{w.word}</div>
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
