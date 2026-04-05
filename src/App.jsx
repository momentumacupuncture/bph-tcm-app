import { useState, useEffect } from "react";

// ─── CONFIGURATION ─────────────────────────────────────────────────────────
// Replace with your Google Apps Script Web App URL (see deployment guide Step 1.3)
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbz1ghCcCpdrRkm39XCPbXBaAzjsVLjXXXUoGd2sKG1bmQcx6eTaANI40Z8F3cANt6hm/exec";
const PRAC_CODE = "tcm2024"; // Change this to your preferred code

// ─── PATTERN DATABASE ───────────────────────────────────────────────────────
const PATTERNS = [
  {
    id: 1, name: "Kidney Yang Vacuity & Debility", chineseName: "肾阳虚衰", nature: "Vacuity / Cold",
    color: "#1e3a5f", accent: "#4a9eda",
    symptoms: ["Inhibited urination","Frequent urination, especially at night","Clear or pale urine with weak stream","Uncontrolled spontaneous urine flow","Feeling of cold — general chilliness","Cold or retracted genitals","Soreness and weakness of lower back and knees","Pale or white facial complexion","Exhaustion or low energy","Timidity or low spirit","Pale, enlarged, tender tongue with white coating","Sinking, fine, or slow weak pulse"],
    treatment: "Warm and supplement kidney yang, transform qi and move water",
    formula: "Modified Ji Sheng Shen Qi Wan (Life Saver Kidney Qi Pill)",
    ingredients: ["Rou Gui (Cinnamomi Cortex), 6g","Fu Zi (Aconiti Radix Lateralis Praeparata), 6g — predecocted","Shu Di Huang (Rehmanniae Radix Praeparata), 15g","Shan Zhu Yu (Corni Fructus), 12g","Shan Yao (Dioscoreae Rhizoma), 12g","Fu Ling (Poria), 10g","Ze Xie (Alismatis Rhizoma), 10g","Mu Dan Pi (Moutan Cortex), 10g","Chuan Niu Xi (Cyathulae Radix), 15g","Che Qian Zi (Plantaginis Semen), 15g","Sheng Huang Qi (Astragali Radix Cruda), 30g","Yi Zhi Ren (Alpiniae Oxyphyllae Fructus), 15g","Chen Xiang (Aquilariae Lignum Resinatum), 10g"],
  },
  {
    id: 2, name: "Kidney Yin Detriment & Damage", chineseName: "肾阴亏损", nature: "Vacuity / Heat",
    color: "#5f1e1e", accent: "#e05858",
    symptoms: ["Frequent but ungratifying urination","Scanty, yellowish, or reddish urine","Scorching or burning sensation in urethra","Strong urge but inability to expel urine","Frequent urination at night","Dry mouth and throat","Insomnia or restless sleep","Heart vexation or agitation","Afternoon or evening flushing of cheeks","Soreness and weakness of lower back and knees","Dizziness or tinnitus","Dry red tongue with little or no coating","Fine, rapid pulse"],
    treatment: "Enrich yin and supplement the kidney, transform qi and disinhibit water",
    formula: "Modified Zi Yin Tong Guan Wan with Zhi Bai Di Huang Wan",
    ingredients: ["Huang Bai (Phellodendri Cortex), 10g","Zhi Mu (Anemarrhenae Rhizoma), 15g","Sheng Di Huang (Rehmanniae Radix Exsiccata), 15g","Shan Yao (Dioscoreae Rhizoma), 12g","Fu Ling (Poria), 15g","Mu Dan Pi (Moutan Cortex), 12g","Ze Xie (Alismatis Rhizoma), 15g","Bie Jia (Trionycis Carapax), 15g — predecocted","Gui Ban (Testudinis Carapax et Plastrum), 15g — predecocted","Rou Gui (Cinnamomi Cortex), 3g"],
  },
  {
    id: 3, name: "Stasis & Stagnation Obstructing the Urinary Pathway", chineseName: "瘀滞阻塞", nature: "Excess / Blood Stasis",
    color: "#3d1f00", accent: "#c47820",
    symptoms: ["Urine dribbles or comes out as a thin stream","Complete urinary blockage in severe cases","Urgency to urinate","Fullness or distention in lower abdomen","Pain in perineum or lower abdomen","Unsmooth or interrupted urine flow","Dark purple or dusky tongue","Visible stasis spots or macules on tongue","Deep, wiry, or rough pulse"],
    treatment: "Move stasis and dissipate binds, free and disinhibit urination",
    formula: "Modified Dai Di Dang Wan (Substitute Dead-On Pill)",
    ingredients: ["Da Huang (Rhei Radix et Rhizoma), 6g","Sheng Di Huang (Rehmanniae Radix Exsiccata), 15g","Dang Gui Wei (Angelicae Sinensis Radicis Extremitas), 6g","Tao Ren (Persicae Semen), 10g","Mang Xiao (Natrii Sulfas), 15g","Rou Gui (Cinnamomi Cortex), 3g","Niu Xi (Achyranthis Bidentatae Radix), 12g","Hu Po (Succinum), 3g — powdered with decoction","Zhe Bei Mu (Fritillariae Thunbergii Bulbus), 15g"],
  },
  {
    id: 4, name: "Lung Heat & Qi Congestion", chineseName: "肺热气壅", nature: "Excess / Heat",
    color: "#1a3d1a", accent: "#3ab878",
    symptoms: ["Dribbling or blocked urination","Thin or weak urine stream","Dull pain or fullness in lower abdomen","Panting or coughing","Chest tightness or oppression","Dry mouth and throat","Thirst with desire to drink","Vexation or agitation","Red tongue with slightly yellow coating","Slippery, rapid pulse"],
    treatment: "Clear heat from the lung, disinhibit the waterways",
    formula: "Modified Qing Fei Yin (Lung-Clearing Beverage)",
    ingredients: ["Huang Qin (Scutellariae Radix), 12g","Sang Bai Pi (Mori Cortex), 12g","Mai Men Dong (Ophiopogonis Radix), 15g","Che Qian Zi (Plantaginis Semen), 15g","Shan Zhi Zi (Gardeniae Fructus), 10g","Mu Tong (Akebiae Trifoliatae Caulis), 10g","Fu Ling (Poria), 15g","Ting Li Zi (Lepidii/Descurainiae Semen), 12g","Jie Geng (Platycodonis Radix), 10g","Wang Bu Liu Xing (Vaccariae Semen), 12g","Yi Mu Cao (Leonuri Herba), 12g","Sheng Gan Cao (Glycyrrhizae Radix Cruda), 6g"],
  },
  {
    id: 5, name: "Damp-Heat Pouring Downward", chineseName: "湿热下注", nature: "Excess / Damp-Heat",
    color: "#3d3400", accent: "#c4a020",
    symptoms: ["Dribbling or obstructed urine flow","Frequent urination with scorching hot urine","Rough or painful urination","Yellowish or reddish urine","Distention, pain, or fullness of lower abdomen","Bitter or sticky taste in mouth","Dry mouth with no desire to drink","Difficult or bound bowel movement","Fever or heat sensations","Red tongue with slimy yellow coating","Slippery rapid or wiry rapid pulse"],
    treatment: "Clear heat and disinhibit dampness, free strangury",
    formula: "Modified Ba Zheng San (Eight Corrections Powder)",
    ingredients: ["Mu Tong (Akebiae Trifoliatae Caulis), 12g","Che Qian Zi (Plantaginis Semen), 10g","Qu Mai (Dianthi Herba), 12g","Bian Xu (Polygoni Avicularis Herba), 12g","Da Huang (Rhei Radix et Rhizoma), 6g","Shan Zhi Zi (Gardeniae Fructus), 12g","Hua Shi (Talcum), 20g","Sheng Di Huang (Rehmanniae Radix Exsiccata), 15g","Dan Zhu Ye (Lophatheri Herba), 10g","Gan Cao Shao (Glycyrrhizae Radix Tenuis), 6g"],
  },
  {
    id: 6, name: "Liver Depression & Qi Stagnation", chineseName: "肝郁气滞", nature: "Excess / Qi Stagnation",
    color: "#1e3d00", accent: "#78c820",
    symptoms: ["Urinary stoppage or ungratifying urination","Distention or pain in chest and ribcage","Sagging or dragging sensation in lower abdomen","Lower abdominal discomfort relieved by belching or sighing","Dull pain or ache in genital region","Emotional depression or repression","Irritability, vexation, or agitation","Red tongue with thin yellow coating","Wiry (stringlike) pulse"],
    treatment: "Course the liver and rectify qi, free and disinhibit urination",
    formula: "Modified Chen Xiang San (Aquilaria Powder)",
    ingredients: ["Chen Xiang (Aquilariae Lignum Resinatum), 6g","Shi Wei (Pyrrosiae Folium), 10g","Hua Shi (Talcum), 20g","Qing Pi (Citri Reticulatae Pericarpium Viride), 10g","Bai Shao Yao (Paeoniae Radix Alba), 15g","Tian Kui Zi (Semiaquilegiae Radix), 10g","Wang Bu Liu Xing (Vaccariae Semen), 12g","Dang Gui (Angelicae Sinensis Radix), 6g","Chai Hu (Bupleuri Radix), 6g"],
  },
  {
    id: 7, name: "Center Qi Fall", chineseName: "中气下陷", nature: "Vacuity / Qi Sinking",
    color: "#2d1a40", accent: "#9a60d8",
    symptoms: ["Sagging or dragging feeling in lower abdomen","Desire to urinate but unable to expel or only scanty amount","Unsmooth or strained urination","Fatigue or low vitality","Poor appetite","Shortness of breath","Low, faint voice or reluctance to speak","Sense of prolapse or bearing down in anus","Pale tongue with thin white coating","Fine, weak pulse"],
    treatment: "Upbear the clear and downbear the turbid, transform qi and disinhibit urine",
    formula: "Bu Zhong Yi Qi Tang with Chun Ze Tang",
    ingredients: ["Dang Shen (Codonopsis Radix), 15g","Bai Zhu (Atractylodis Macrocephalae Rhizoma), 12g","Fu Ling (Poria), 15g","Huang Qi (Astragali Radix), 15g","Sheng Ma (Cimicifugae Rhizoma), 6g","Chai Hu (Bupleuri Radix), 6g","Zhu Ling (Polyporus), 15g","Ze Xie (Alismatis Rhizoma), 12g","Gui Zhi (Cinnamomi Ramulus), 10g"],
  },
];

const SYMPTOM_CATEGORIES = [
  { label: "Urination — Flow", icon: "💧", symptoms: ["Inhibited urination","Urine dribbles or comes out as a thin stream","Thin or weak urine stream","Dribbling or blocked urination","Dribbling or obstructed urine flow","Unsmooth or interrupted urine flow","Uncontrolled spontaneous urine flow","Urinary stoppage or ungratifying urination","Complete urinary blockage in severe cases","Desire to urinate but unable to expel or only scanty amount"] },
  { label: "Urination — Sensation & Frequency", icon: "🔥", symptoms: ["Frequent urination, especially at night","Frequent but ungratifying urination","Frequent urination with scorching hot urine","Strong urge but inability to expel urine","Urgency to urinate","Scorching or burning sensation in urethra","Rough or painful urination","Unsmooth or strained urination"] },
  { label: "Urine Appearance", icon: "🔬", symptoms: ["Clear or pale urine with weak stream","Scanty, yellowish, or reddish urine","Yellowish or reddish urine"] },
  { label: "Abdomen & Pelvis", icon: "🫁", symptoms: ["Fullness or distention in lower abdomen","Distention, pain, or fullness of lower abdomen","Dull pain or fullness in lower abdomen","Pain in perineum or lower abdomen","Sagging or dragging feeling in lower abdomen","Sagging or dragging sensation in lower abdomen","Lower abdominal discomfort relieved by belching or sighing","Dull pain or ache in genital region","Sense of prolapse or bearing down in anus"] },
  { label: "Temperature & Energy", icon: "❄️", symptoms: ["Feeling of cold — general chilliness","Cold or retracted genitals","Afternoon or evening flushing of cheeks","Fever or heat sensations","Exhaustion or low energy","Fatigue or low vitality"] },
  { label: "Back, Head & Senses", icon: "🦴", symptoms: ["Soreness and weakness of lower back and knees","Dizziness or tinnitus","Pale or white facial complexion"] },
  { label: "Mouth, Throat & Digestion", icon: "👄", symptoms: ["Dry mouth and throat","Thirst with desire to drink","Dry mouth with no desire to drink","Bitter or sticky taste in mouth","Poor appetite","Difficult or bound bowel movement"] },
  { label: "Breathing & Chest", icon: "🫀", symptoms: ["Panting or coughing","Chest tightness or oppression","Distention or pain in chest and ribcage","Shortness of breath","Low, faint voice or reluctance to speak"] },
  { label: "Sleep & Emotional Wellbeing", icon: "🧠", symptoms: ["Insomnia or restless sleep","Heart vexation or agitation","Emotional depression or repression","Irritability, vexation, or agitation","Vexation or agitation","Timidity or low spirit"] },
  { label: "Tongue & Pulse (Practitioner)", icon: "🩺", symptoms: ["Pale, enlarged, tender tongue with white coating","Dry red tongue with little or no coating","Dark purple or dusky tongue","Visible stasis spots or macules on tongue","Red tongue with slightly yellow coating","Red tongue with slimy yellow coating","Red tongue with thin yellow coating","Pale tongue with thin white coating","Sinking, fine, or slow weak pulse","Fine, rapid pulse","Deep, wiry, or rough pulse","Slippery, rapid pulse","Slippery rapid or wiry rapid pulse","Wiry (stringlike) pulse","Fine, weak pulse"] },
];

const INTAKE_FIELDS = [
  { key:"name", label:"Full Name", type:"text", placeholder:"Your full name", required:true },
  { key:"dob", label:"Date of Birth", type:"date", required:true },
  { key:"occupation", label:"Occupation", type:"text", placeholder:"e.g. Office worker, retired…" },
  { key:"duration", label:"How long have you had these urinary symptoms?", type:"select", required:true, options:["Less than 1 month","1–3 months","3–6 months","6–12 months","1–3 years","More than 3 years"] },
  { key:"onset", label:"How did your symptoms begin?", type:"select", options:["Gradually over time","Suddenly","After an illness","After stress or emotional upset","After physical overexertion","Other / unsure"] },
  { key:"severity", label:"How severe are your symptoms overall?", type:"select", required:true, options:["Mild — noticeable but manageable","Moderate — affecting daily life","Severe — significantly disrupting daily life"] },
  { key:"nightUrination", label:"How many times do you wake at night to urinate?", type:"select", options:["0 — I sleep through the night","1–2 times per night","3–4 times per night","5 or more times per night"] },
  { key:"previousTreatment", label:"Have you received treatment for this before?", type:"select", options:["No treatment yet","Western medication","Surgery or procedure","Chinese herbal medicine","Acupuncture","Multiple treatments"] },
  { key:"diagnosis", label:"Have you been diagnosed with BPH (enlarged prostate)?", type:"select", options:["Yes, confirmed diagnosis","Suspected but not confirmed","No","Unsure"] },
  { key:"stressLevel", label:"Current stress level?", type:"select", options:["Low — generally relaxed","Moderate — occasional stress","High — frequently stressed","Very high — chronically stressed"] },
  { key:"diet", label:"How would you describe your typical diet?", type:"select", options:["Generally healthy and light","Includes spicy or hot foods","High in greasy or fried foods","High in alcohol intake","Mixed / varies"] },
  { key:"exercise", label:"How physically active are you?", type:"select", options:["Sedentary — mostly sitting","Light activity","Moderate — regular exercise","Very active"] },
  { key:"otherConditions", label:"Other health conditions (optional)", type:"text", placeholder:"e.g. hypertension, diabetes…" },
  { key:"medications", label:"Current medications or supplements (optional)", type:"text", placeholder:"List any you are currently taking" },
  { key:"additionalNotes", label:"Anything else your practitioner should know?", type:"textarea", placeholder:"Additional symptoms, concerns, or context…" },
];

// ─── TOKENS ────────────────────────────────────────────────────────────────
const P = { bg:"#f7f4ef", card:"#fff", border:"#e2d9c8", accent:"#5a7a4a", accentL:"#eaf2e2", text:"#28201a", muted:"#7a6a52" };
const D = { bg:"#0c1118", card:"#141b26", border:"#242f42", text:"#d4e4f2", muted:"#6a8aaa" };

// ─── PATIENT: INTAKE ────────────────────────────────────────────────────────
function PatientIntake({ onComplete }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setValues(p => ({...p,[k]:v})); setErrors(p=>({...p,[k]:undefined})); };

  const submit = () => {
    const e = {};
    INTAKE_FIELDS.filter(f=>f.required).forEach(f => { if (!values[f.key]) e[f.key]="Required"; });
    setErrors(e);
    if (!Object.keys(e).length) onComplete(values);
  };

  const inp = (extra={}) => ({ outline:"none", fontFamily:"inherit", boxSizing:"border-box", width:"100%", padding:"10px 12px", borderRadius:8, fontSize:14, color:P.text, background:"white", ...extra });

  return (
    <div>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:36,marginBottom:8}}>🌿</div>
        <h2 style={{margin:"0 0 8px",fontSize:22,fontWeight:600,color:P.text,fontFamily:"Georgia,serif"}}>Patient Health Intake</h2>
        <p style={{margin:0,fontSize:14,color:P.muted,lineHeight:1.7,maxWidth:400,marginInline:"auto"}}>Please complete this form before your appointment. Your practitioner will review your responses privately.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {INTAKE_FIELDS.map(f => (
          <div key={f.key}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:P.text,marginBottom:5}}>
              {f.label}{f.required && <span style={{color:"#b04030",marginLeft:3}}>*</span>}
            </label>
            {f.type==="select" ? (
              <select value={values[f.key]||""} onChange={e=>set(f.key,e.target.value)} style={{...inp({border:`1.5px solid ${errors[f.key]?"#b04030":P.border}`,cursor:"pointer",color:values[f.key]?P.text:P.muted})}}>
                <option value="">— Select —</option>
                {f.options.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type==="textarea" ? (
              <textarea value={values[f.key]||""} onChange={e=>set(f.key,e.target.value)} placeholder={f.placeholder} rows={3} style={{...inp({border:`1.5px solid ${P.border}`,resize:"vertical"})}} />
            ) : (
              <input type={f.type} value={values[f.key]||""} onChange={e=>set(f.key,e.target.value)} placeholder={f.placeholder||""} style={{...inp({border:`1.5px solid ${errors[f.key]?"#b04030":P.border}`})}} />
            )}
            {errors[f.key] && <div style={{fontSize:12,color:"#b04030",marginTop:4}}>⚠ {errors[f.key]}</div>}
          </div>
        ))}
      </div>
      <button onClick={submit} style={{width:"100%",marginTop:28,padding:"14px",borderRadius:10,background:`linear-gradient(135deg,${P.accent},#3a6030)`,color:"white",border:"none",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.04em"}}>
        Continue to Symptoms →
      </button>
    </div>
  );
}

// ─── PATIENT: SYMPTOMS ──────────────────────────────────────────────────────
function PatientSymptoms({ onComplete }) {
  const [selected, setSelected] = useState(new Set());
  const [openCats, setOpenCats] = useState(new Set([0,1,2]));
  const toggle = s => setSelected(p => { const n=new Set(p); n.has(s)?n.delete(s):n.add(s); return n; });
  const toggleCat = i => setOpenCats(p => { const n=new Set(p); n.has(i)?n.delete(i):n.add(i); return n; });

  return (
    <div>
      <div style={{textAlign:"center",marginBottom:22}}>
        <h2 style={{margin:"0 0 8px",fontSize:22,fontWeight:600,color:P.text,fontFamily:"Georgia,serif"}}>How are you feeling?</h2>
        <p style={{margin:0,fontSize:14,color:P.muted,lineHeight:1.6}}>Tap a category to expand it. Select <strong>all</strong> symptoms that currently apply to you.</p>
      </div>

      {selected.size > 0 && (
        <div style={{background:P.accentL,border:"1px solid #b0c898",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:13,color:"#3a5a2a",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>✓ <strong>{selected.size}</strong> symptom{selected.size!==1?"s":""} selected</span>
          <button onClick={()=>setSelected(new Set())} style={{background:"none",border:"none",fontSize:12,color:P.muted,cursor:"pointer",textDecoration:"underline"}}>Clear all</button>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:22}}>
        {SYMPTOM_CATEGORIES.map((cat,ci) => {
          const isOpen = openCats.has(ci);
          const dedupedSyms = [...new Set(cat.symptoms)];
          const count = dedupedSyms.filter(s=>selected.has(s)).length;
          return (
            <div key={ci} style={{border:`1.5px solid ${isOpen?"#b0c898":P.border}`,borderRadius:10,overflow:"hidden",background:isOpen?"#fbfdf8":"white"}}>
              <button onClick={()=>toggleCat(ci)} style={{width:"100%",padding:"12px 16px",background:"none",border:"none",display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:"inherit"}}>
                <span style={{fontSize:18}}>{cat.icon}</span>
                <span style={{flex:1,textAlign:"left",fontSize:14,fontWeight:600,color:P.text}}>{cat.label}</span>
                {count>0 && <span style={{background:P.accent,color:"white",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:700}}>{count}</span>}
                <span style={{fontSize:11,color:P.muted,display:"inline-block",transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span>
              </button>
              {isOpen && (
                <div style={{padding:"4px 12px 14px",display:"flex",flexWrap:"wrap",gap:8}}>
                  {dedupedSyms.map(sym => {
                    const on = selected.has(sym);
                    return (
                      <button key={sym} onClick={()=>toggle(sym)} style={{padding:"8px 14px",borderRadius:20,border:`1.5px solid ${on?P.accent:"#d4c8b4"}`,background:on?P.accent:"white",color:on?"white":P.text,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                        {on&&"✓ "}{sym}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={()=>onComplete(selected)} disabled={selected.size===0} style={{width:"100%",padding:"14px",borderRadius:10,background:selected.size===0?"#c8bfb0":`linear-gradient(135deg,${P.accent},#3a6030)`,color:"white",border:"none",fontSize:15,fontWeight:600,cursor:selected.size===0?"not-allowed":"pointer",fontFamily:"inherit",letterSpacing:"0.04em"}}>
        {selected.size===0?"Please select at least one symptom":`Submit My Symptoms →`}
      </button>
    </div>
  );
}

// ─── PATIENT: THANK YOU ─────────────────────────────────────────────────────
function PatientThankYou({ submitting, submitError }) {
  if (submitting) return (
    <div style={{textAlign:"center",padding:"40px 16px"}}>
      <div style={{fontSize:40,marginBottom:14}}>⏳</div>
      <h2 style={{fontSize:20,color:P.text,fontFamily:"Georgia,serif"}}>Submitting your form…</h2>
      <p style={{color:P.muted,fontSize:14}}>Please wait a moment.</p>
    </div>
  );
  return (
    <div style={{textAlign:"center",padding:"28px 8px"}}>
      <div style={{fontSize:52,marginBottom:14}}>{submitError?"⚠️":"🌿"}</div>
      <h2 style={{fontSize:24,fontWeight:600,color:submitError?"#b04030":P.text,fontFamily:"Georgia,serif",marginBottom:10}}>
        {submitError?"Submission Note":"Thank You"}
      </h2>
      <p style={{fontSize:15,color:P.muted,lineHeight:1.8,maxWidth:340,marginInline:"auto",marginBottom:22}}>
        {submitError
          ? "Your information was recorded, but could not be sent to the server right now. Please let your practitioner know when you arrive."
          : "Your intake form has been received. Your practitioner will review your responses before your appointment."
        }
      </p>
      {!submitError && (
        <div style={{background:P.accentL,border:"1px solid #b0c898",borderRadius:10,padding:"16px 20px",maxWidth:340,marginInline:"auto",fontSize:13,color:"#3a5a2a",lineHeight:1.7,textAlign:"left"}}>
          <strong>What happens next?</strong><br/>Your practitioner will review your symptoms using Traditional Chinese Medicine principles and prepare a personalized assessment for your visit.
        </div>
      )}
    </div>
  );
}

// ─── PRACTITIONER: SCORE BAR ────────────────────────────────────────────────
function ScoreBar({ pct, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t=setTimeout(()=>setW(pct),120); return ()=>clearTimeout(t); }, [pct]);
  return (
    <div style={{height:6,background:"#1e2d42",borderRadius:3,overflow:"hidden",marginTop:8}}>
      <div style={{height:"100%",width:`${w}%`,background:color,borderRadius:3,transition:"width 0.9s cubic-bezier(0.4,0,0.2,1)"}}/>
    </div>
  );
}

function tier(pct) {
  if (pct>=70) return {label:"Strong Match",color:"#4adc90"};
  if (pct>=45) return {label:"Moderate Match",color:"#e0b840"};
  if (pct>=20) return {label:"Partial Match",color:"#e07840"};
  return {label:"Low Match",color:"#6a8aaa"};
}

// ─── PRACTITIONER DASHBOARD ─────────────────────────────────────────────────
function PractitionerDashboard({ intake, symptoms, onBack }) {
  const [expanded, setExpanded] = useState(null);

  const scores = PATTERNS.map(p => {
    const matched = p.symptoms.filter(s=>symptoms.has(s));
    const pct = Math.round((matched.length/p.symptoms.length)*100);
    return {...p, matched, missed:p.symptoms.filter(s=>!symptoms.has(s)), score:matched.length, pct};
  }).sort((a,b)=>b.pct-a.pct);

  return (
    <div style={{background:D.bg,minHeight:"100vh",color:D.text,fontFamily:"Georgia,serif"}}>
      <div style={{background:D.card,borderBottom:`1px solid ${D.border}`,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:10,letterSpacing:"0.3em",color:D.muted,textTransform:"uppercase",marginBottom:3}}>Practitioner Dashboard · BPH Pattern Analysis</div>
          <div style={{fontSize:17,fontWeight:"bold"}}>
            {intake?.name||"Patient"}
            <span style={{fontSize:12,fontWeight:"normal",color:D.muted,marginLeft:10}}>DOB: {intake?.dob||"—"} · {intake?.severity||"—"}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{background:"#0a1e34",border:"1px solid #1a3a58",borderRadius:6,padding:"5px 10px",fontSize:10,color:"#4a9eda",letterSpacing:"0.12em"}}>CLINICAL VIEW</div>
          <button onClick={onBack} style={{background:"none",border:`1px solid ${D.border}`,borderRadius:6,padding:"5px 12px",fontSize:11,color:D.muted,cursor:"pointer",fontFamily:"inherit"}}>← Patient View</button>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"20px 16px"}}>

        {/* Intake Summary */}
        <div style={{background:D.card,border:`1px solid ${D.border}`,borderRadius:10,padding:"16px 20px",marginBottom:14}}>
          <div style={{fontSize:10,letterSpacing:"0.2em",color:D.muted,textTransform:"uppercase",marginBottom:12}}>Patient Intake Summary</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
            {[["Duration",intake?.duration],["Onset",intake?.onset],["Severity",intake?.severity],["Nocturia",intake?.nightUrination],["Stress",intake?.stressLevel],["Diet",intake?.diet],["Exercise",intake?.exercise],["Prior Treatment",intake?.previousTreatment],["BPH Diagnosis",intake?.diagnosis],["Occupation",intake?.occupation],["Other Conditions",intake?.otherConditions||"None"],["Medications",intake?.medications||"None"]].map(([label,val])=>(
              <div key={label}>
                <div style={{fontSize:10,color:D.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>{label}</div>
                <div style={{fontSize:13,color:D.text}}>{val||"—"}</div>
              </div>
            ))}
          </div>
          {intake?.additionalNotes && (
            <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${D.border}`}}>
              <div style={{fontSize:10,color:D.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Patient Notes</div>
              <div style={{fontSize:13,color:D.text,fontStyle:"italic"}}>{intake.additionalNotes}</div>
            </div>
          )}
        </div>

        {/* Symptoms */}
        <div style={{background:D.card,border:`1px solid ${D.border}`,borderRadius:10,padding:"16px 20px",marginBottom:14}}>
          <div style={{fontSize:10,letterSpacing:"0.2em",color:D.muted,textTransform:"uppercase",marginBottom:10}}>Reported Symptoms ({symptoms.size})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {[...symptoms].map(s=>(
              <span key={s} style={{background:"#101e2e",border:"1px solid #1e3a52",borderRadius:12,padding:"4px 10px",fontSize:12,color:"#78b0d0"}}>{s}</span>
            ))}
          </div>
        </div>

        {/* Pattern scores */}
        <div style={{fontSize:10,letterSpacing:"0.2em",color:D.muted,textTransform:"uppercase",marginBottom:12}}>Pattern Discrimination — Tiered Match Analysis</div>

        {scores.map((p,idx) => {
          const t = tier(p.pct);
          const isPrimary = idx===0&&p.score>0;
          const isSecondary = idx===1&&p.score>0;
          const isExp = expanded===p.id;
          return (
            <div key={p.id} style={{background:isPrimary?"#0a1b2e":isSecondary?"#0e1820":D.card,border:`1px solid ${isPrimary?p.accent:isSecondary?"#1e3040":D.border}`,borderRadius:10,marginBottom:10,overflow:"hidden",boxShadow:isPrimary?`0 0 24px ${p.accent}1a`:"none"}}>
              <div onClick={()=>p.score>0&&setExpanded(isExp?null:p.id)} style={{padding:"14px 18px",cursor:p.score>0?"pointer":"default"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:isPrimary?p.accent:"#1e2d42",color:isPrimary?"#000810":D.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:"bold",flexShrink:0}}>{idx+1}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontSize:isPrimary?15:14,fontWeight:isPrimary?"bold":"normal",color:isPrimary?"white":D.text}}>{p.name}</span>
                      <span style={{fontSize:12,color:D.muted,fontStyle:"italic"}}>{p.chineseName}</span>
                      {isPrimary&&<span style={{fontSize:9,background:p.accent,color:"#000810",borderRadius:4,padding:"2px 7px",fontWeight:"bold",letterSpacing:"0.15em"}}>PRIMARY</span>}
                      {isSecondary&&p.score>0&&<span style={{fontSize:9,background:"#1e3040",color:"#6a9aba",borderRadius:4,padding:"2px 7px",letterSpacing:"0.1em"}}>SECONDARY</span>}
                    </div>
                    <div style={{fontSize:11,color:D.muted,marginTop:2}}>{p.nature}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:isPrimary?26:20,fontWeight:"bold",color:p.score>0?p.accent:"#2a3a4a"}}>{p.pct}%</div>
                    <div style={{fontSize:11,color:t.color,marginTop:1}}>{t.label}</div>
                    <div style={{fontSize:10,color:D.muted}}>{p.score}/{p.symptoms.length} signs</div>
                  </div>
                </div>
                <ScoreBar pct={p.pct} color={p.accent}/>
                {p.score>0&&<div style={{fontSize:10,color:D.muted,marginTop:5,textAlign:"right"}}>{isExp?"▲ Collapse":"▼ Full analysis"}</div>}
              </div>

              {isExp&&(
                <div style={{borderTop:`1px solid ${D.border}`,padding:"16px 18px"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                    <div>
                      <div style={{fontSize:10,letterSpacing:"0.15em",color:"#4adc90",textTransform:"uppercase",marginBottom:8}}>✓ Matched Signs ({p.matched.length})</div>
                      {p.matched.map(s=><div key={s} style={{fontSize:12,color:"#90d8a8",marginBottom:4,paddingLeft:8,borderLeft:"2px solid #4adc90"}}>{s}</div>)}
                    </div>
                    <div>
                      <div style={{fontSize:10,letterSpacing:"0.15em",color:D.muted,textTransform:"uppercase",marginBottom:8}}>○ Absent Signs ({p.missed.length})</div>
                      {p.missed.map(s=><div key={s} style={{fontSize:12,color:"#3a5a6a",marginBottom:4,paddingLeft:8,borderLeft:"2px solid #1e3a4a"}}>{s}</div>)}
                    </div>
                  </div>
                  <div style={{background:"#080f1a",borderRadius:8,padding:"12px 14px",marginBottom:12,borderLeft:`3px solid ${p.accent}`}}>
                    <div style={{fontSize:10,letterSpacing:"0.15em",color:p.accent,textTransform:"uppercase",marginBottom:4}}>Treatment Principles</div>
                    <div style={{fontSize:13,color:D.text,fontStyle:"italic"}}>{p.treatment}</div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:10,letterSpacing:"0.15em",color:D.muted,textTransform:"uppercase",marginBottom:4}}>Guiding Formula</div>
                    <div style={{fontSize:14,color:"white"}}>{p.formula}</div>
                  </div>
                  <div>
                    <div style={{fontSize:10,letterSpacing:"0.15em",color:D.muted,textTransform:"uppercase",marginBottom:8}}>Materia Medica</div>
                    <div style={{columns:2,columnGap:16}}>
                      {p.ingredients.map(ing=><div key={ing} style={{fontSize:12,color:"#7aaac8",marginBottom:5,breakInside:"avoid",paddingLeft:8,borderLeft:`1px solid ${p.accent}55`}}>{ing}</div>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div style={{marginTop:16,padding:"12px 16px",background:"#0a1018",border:"1px solid #182030",borderRadius:6,fontSize:11,color:"#3a5a70",lineHeight:1.7}}>
          <strong style={{color:"#5a7a90"}}>Source:</strong> Principles of Chinese Medical Andrology — Benign Prostatic Hyperplasia, Pattern Discrimination pp. 183–188. Analysis assists clinical decision-making only. Final diagnosis requires full tongue, pulse, and clinical evaluation.
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS STEPPER ───────────────────────────────────────────────────────
function Stepper({ step }) {
  const steps = ["Intake","Symptoms","Done"];
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:0,marginBottom:24}}>
      {steps.map((label,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:i<=step?P.accent:"#d4cab8",color:i<=step?"white":"#8a7a60",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:"bold",border:i===step?`2px solid #3a5a28`:"2px solid transparent",transition:"all 0.3s"}}>
              {i<step?"✓":i+1}
            </div>
            <div style={{fontSize:10,color:i<=step?P.accent:P.muted,whiteSpace:"nowrap"}}>{label}</div>
          </div>
          {i<steps.length-1&&<div style={{width:36,height:2,background:i<step?P.accent:"#d4cab8",margin:"0 4px",marginBottom:16,transition:"background 0.3s"}}/>}
        </div>
      ))}
    </div>
  );
}

// ─── ROOT ───────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("patient");
  const [step, setStep] = useState(0);
  const [intake, setIntake] = useState(null);
  const [symptoms, setSymptoms] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const submitToSheets = async (intakeData, symptomSet) => {
    if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL === "YOUR_APPS_SCRIPT_URL_HERE") return;
    setSubmitting(true);
    try {
      await fetch(GOOGLE_SHEET_URL, { method:"POST", mode:"no-cors", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...intakeData, symptoms:[...symptomSet].join(", ")}) });
    } catch { setSubmitError(true); } finally { setSubmitting(false); }
  };

  const handleSymptomsDone = async (sel) => {
    setSymptoms(sel); setStep(2);
    await submitToSheets(intake, sel);
  };

  const handlePracAccess = () => {
    if (codeInput===PRAC_CODE) { setView("practitioner"); setShowCode(false); setCodeError(false); }
    else setCodeError(true);
  };

  if (view==="practitioner") {
    if (step<2) return (
      <div style={{background:D.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:D.text,fontFamily:"Georgia,serif",padding:24}}>
        <div style={{textAlign:"center",maxWidth:360}}>
          <div style={{fontSize:40,marginBottom:14}}>🩺</div>
          <h2 style={{fontSize:20,marginBottom:10}}>No patient data yet</h2>
          <p style={{fontSize:14,color:D.muted,lineHeight:1.7,marginBottom:20}}>The patient has not yet completed their intake form.</p>
          <button onClick={()=>setView("patient")} style={{background:"none",border:`1px solid ${D.border}`,borderRadius:8,padding:"10px 20px",color:D.muted,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>← Return to Patient Form</button>
        </div>
      </div>
    );
    return <PractitionerDashboard intake={intake} symptoms={symptoms} onBack={()=>setView("patient")}/>;
  }

  return (
    <div style={{background:P.bg,minHeight:"100vh"}}>
      {/* Header */}
      <div style={{background:"white",borderBottom:`1px solid ${P.border}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:15,fontWeight:600,color:P.text,fontFamily:"Georgia,serif"}}>🌿 Patient Health Form</div>
          <div style={{fontSize:10,color:P.muted,letterSpacing:"0.15em",textTransform:"uppercase"}}>Chinese Medical Andrology</div>
        </div>
        <button onClick={()=>setShowCode(v=>!v)} style={{background:"none",border:`1px solid ${P.border}`,borderRadius:6,padding:"5px 12px",fontSize:11,color:P.muted,cursor:"pointer",fontFamily:"inherit"}}>
          Practitioner Access
        </button>
      </div>

      {/* Code entry */}
      {showCode&&(
        <div style={{background:"#f0ece0",borderBottom:`1px solid ${P.border}`,padding:"12px 20px",display:"flex",gap:10,alignItems:"center",justifyContent:"center",flexWrap:"wrap"}}>
          <input type="password" placeholder="Enter practitioner code" value={codeInput} onChange={e=>{setCodeInput(e.target.value);setCodeError(false);}} onKeyDown={e=>e.key==="Enter"&&handlePracAccess()}
            style={{padding:"8px 12px",borderRadius:6,border:`1.5px solid ${codeError?"#b04030":P.border}`,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
          <button onClick={handlePracAccess} style={{padding:"8px 18px",borderRadius:6,background:"#1a2a3a",color:"white",border:"none",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Enter</button>
          {codeError&&<span style={{fontSize:12,color:"#b04030"}}>Incorrect code</span>}
        </div>
      )}

      {/* Main */}
      <div style={{maxWidth:580,margin:"0 auto",padding:"28px 16px"}}>
        {step<2&&<Stepper step={step}/>}
        <div style={{background:"white",borderRadius:14,border:`1px solid ${P.border}`,padding:"28px 22px",boxShadow:"0 2px 20px rgba(0,0,0,0.06)"}}>
          {step===0&&<PatientIntake onComplete={data=>{setIntake(data);setStep(1);}}/>}
          {step===1&&<PatientSymptoms onComplete={handleSymptomsDone}/>}
          {step===2&&<PatientThankYou submitting={submitting} submitError={submitError}/>}
        </div>
      </div>
    </div>
  );
}
