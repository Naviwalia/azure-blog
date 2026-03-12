import { useState, useEffect } from "react";

const G = {
  bg: "#07090f", surface: "#0d1117", surface2: "#111827",
  border: "#1f2937", text: "#f1f5f9", muted: "#64748b", accent: "#38bdf8",
};

const LEVELS = {
  beginner:     { label:"Beginner",     color:"#34d399", bg:"#064e3b", icon:"🌱" },
  intermediate: { label:"Intermediate", color:"#a78bfa", bg:"#4c1d95", icon:"⚡" },
  advanced:     { label:"Advanced",     color:"#fb923c", bg:"#7c2d12", icon:"🔥" },
};

const SERIES = [
  { id:"networking", label:"Azure Networking",    color:"#38bdf8", icon:"🌐", order:1, desc:"VNets, NSGs, Private Endpoints, Bastion, Hub-and-Spoke" },
  { id:"security",   label:"Security & Identity", color:"#f472b6", icon:"🔐", order:2, desc:"RBAC, Managed Identities, Conditional Access, PIM, Zero Trust" },
  { id:"entra",      label:"Entra ID",            color:"#a78bfa", icon:"🪪", order:3, desc:"Identity, Service Principals, Identity Protection, Access Reviews" },
  { id:"finops",     label:"Cost & FinOps",       color:"#4ade80", icon:"💰", order:4, desc:"Cost leaks, Reservations, Azure Advisor, Tagging strategy" },
  { id:"iac",        label:"IaC & Automation",    color:"#fb923c", icon:"⚙️", order:5, desc:"Bicep vs Terraform, State, Pipelines, Azure Policy" },
  { id:"ai",         label:"Azure AI & Copilot",  color:"#f9a8d4", icon:"🤖", order:6, desc:"Azure OpenAI, RAG architecture, Copilot, AI workload security" },
];

const POSTS = [
  {
    id:1, series:"networking", level:"beginner", readTime:"6 min", emoji:"🌐",
    title:"VNet Design — Get This Right From Day One",
    subtitle:"Five rules every Azure engineer must know before touching a subnet",
    excerpt:"I've seen teams spend weeks fixing a network built in a day. Here's what actually matters when designing Azure Virtual Networks.",
    quiz:[
      {q:"What happens if two VNets have overlapping address spaces?",options:["They auto-merge","They cannot be peered","Traffic is duplicated","Nothing"],answer:1},
      {q:"Which subnet name is required for Azure Bastion?",options:["BastionSubnet","AzureBastionSubnet","ManagementSubnet","JumpSubnet"],answer:1},
      {q:"VNet Peering connects:",options:["Azure to on-premises","Two VNets inside Azure","Azure to the internet","Two tenants only"],answer:1},
    ],
    content:[
      {type:"intro",text:"I've seen teams spend weeks fixing a network they built in a day. Not because they weren't skilled — because they skipped the planning. In Azure, the network is the one thing that's genuinely painful to redesign once resources are deployed on top of it."},
      {type:"h2",text:"Rule 1 — Plan Your Address Space First"},
      {type:"p",text:"Before creating a single subnet, decide on IP address ranges. When you try to peer two VNets, Azure will refuse if address spaces overlap. Dev on 10.0.0.0/16 and Prod also on 10.0.0.0/16 = you can never peer them."},
      {type:"callout",label:"✅ Practical Rule",text:"Dev → 10.1.0.0/16 · QA → 10.2.0.0/16 · Prod → 10.3.0.0/16. Simple, non-overlapping, room to grow."},
      {type:"h2",text:"Rule 2 — One Subnet Per Workload Tier"},
      {type:"list",items:["Web Subnet — internet-facing layer","App Subnet — business logic, no internet","Data Subnet — databases, strictly locked down","Management Subnet — Bastion, jump hosts"]},
      {type:"h2",text:"Rule 3 — NSGs: Deny by Default"},
      {type:"callout",label:"🚨 Non-Negotiable",text:"Never open port 3389 (RDP) or 22 (SSH) to the internet. Use Azure Bastion instead. Exposed RDP ports get attacked within minutes."},
      {type:"h2",text:"Rule 4 — VNet Peering vs VPN Gateway"},
      {type:"compare",left:{title:"🔗 VNet Peering",items:["Connects VNets inside Azure","Microsoft backbone — fast & cheap","Azure-to-Azure only"]},right:{title:"🌍 VPN Gateway",items:["Connects Azure to on-premises","Encrypted internet tunnel","Monthly gateway cost"]}},
      {type:"h2",text:"Rule 5 — Learn Hub-and-Spoke Early"},
      {type:"p",text:"One Hub VNet with Firewall, Bastion, and Gateway. Spoke VNets for each environment. All traffic through the Hub Firewall — one place for rules, logs, and visibility."},
    ]
  },
  {
    id:2, series:"networking", level:"beginner", readTime:"5 min", emoji:"🔒",
    title:"Private Endpoints — Lock Down Your PaaS in 15 Minutes",
    subtitle:"Your Storage, SQL, and Key Vault are publicly accessible by default",
    excerpt:"Your Azure Storage Account is reachable from the public internet by default. Private Endpoints fix this in 15 minutes.",
    quiz:[
      {q:"What does a Private Endpoint give your PaaS service?",options:["A public IP","A private IP inside your VNet","A VPN tunnel","A DNS zone automatically"],answer:1},
      {q:"What must always be set up alongside a Private Endpoint?",options:["NSG rule","Private DNS Zone","Azure Firewall","Route table"],answer:1},
      {q:"Without a Private Endpoint, Azure PaaS services are:",options:["Blocked by default","Publicly accessible by default","Only reachable from Azure VMs","Auto-protected"],answer:1},
    ],
    content:[
      {type:"intro",text:"Your Azure Storage Account is accessible from the public internet by default. So is your SQL Database. And your Key Vault. Private Endpoints change this entirely — in about 15 minutes."},
      {type:"h2",text:"What a Private Endpoint Does"},
      {type:"p",text:"It gives your PaaS service a private IP address inside your VNet. Traffic never leaves Microsoft's backbone. No public internet involved at all."},
      {type:"callout",label:"🔐 The Security Gain",text:"Once set up with public access disabled — an attacker on the internet simply cannot reach the service. The endpoint doesn't exist from their perspective."},
      {type:"h2",text:"The One Thing People Always Forget"},
      {type:"p",text:"Private Endpoints need Private DNS Zones. Without one, DNS still resolves the hostname to the public IP. Always set them up together."},
      {type:"callout",label:"📌 Always Together",text:"Private Endpoint + Private DNS Zone. One without the other = broken name resolution and very confusing debugging sessions."},
    ]
  },
  {
    id:3, series:"networking", level:"intermediate", readTime:"5 min", emoji:"🛡️",
    title:"Azure Firewall vs NSG — Two Tools, Two Jobs",
    subtitle:"Both control traffic. Neither replaces the other.",
    excerpt:"Most teams use one when they need both. Here's the clear breakdown and how to layer them properly.",
    quiz:[
      {q:"NSGs operate at which network layer?",options:["Layer 7","Layer 4","Layer 2","Layer 1"],answer:1},
      {q:"Which tool can filter by domain name (FQDN)?",options:["NSG","Route Table","Azure Firewall","VNet Peering"],answer:2},
      {q:"The correct layered approach is:",options:["NSG only","Firewall only","NSG at subnet + Firewall at Hub","WAF only"],answer:2},
    ],
    content:[
      {type:"intro",text:"Should you use Azure Firewall or NSGs? Both. But for different reasons at different layers."},
      {type:"h2",text:"NSG — Your Door Lock (Free)"},
      {type:"p",text:"Layer 4 filtering. Works on IP addresses, ports, and protocols. Fast, cheap, applied at subnet or NIC level. Cannot filter by domain name."},
      {type:"h2",text:"Azure Firewall — Your Security Guard (Paid)"},
      {type:"p",text:"Layers 4–7. Filters by FQDN. Built-in threat intelligence. Central logging. Deployed once in Hub VNet, covers all spokes."},
      {type:"callout",label:"🏗️ Right Architecture",text:"NSGs on every subnet for granular control. Azure Firewall in Hub VNet for centralised inspection. Defence in depth — not one or the other."},
    ]
  },
  {
    id:4, series:"networking", level:"beginner", readTime:"4 min", emoji:"🏰",
    title:"Azure Bastion — Close Port 3389 Right Now",
    subtitle:"Exposed RDP ports get attacked within minutes of going public",
    excerpt:"Never expose RDP or SSH to the internet again. Azure Bastion gives you secure VM access through the portal.",
    quiz:[
      {q:"What port does Azure Bastion use?",options:["3389 over internet","22 over internet","443 (HTTPS) via portal","8080"],answer:2},
      {q:"What subnet name does Bastion require?",options:["BastionSubnet","AzureBastionSubnet","ManagementSubnet","Any name"],answer:1},
      {q:"Do VMs need a public IP with Bastion?",options:["Yes always","No — that's the point","Only Linux VMs","Only in production"],answer:1},
    ],
    content:[
      {type:"intro",text:"If your VM has port 3389 open to the internet — close it right now. Exposed RDP ports get scanned and attacked within minutes."},
      {type:"h2",text:"What Azure Bastion Does"},
      {type:"list",items:["Connect to VMs directly from the Azure Portal over HTTPS","No public IP required on the VM","No open RDP or SSH ports exposed","Traffic never leaves Microsoft's network"]},
      {type:"callout",label:"💰 Cost vs Risk",text:"Azure Bastion costs ~£140/month. Compare that to incident response when a VM gets compromised. Suddenly very cheap."},
    ]
  },
  {
    id:5, series:"security", level:"beginner", readTime:"5 min", emoji:"🔐",
    title:"RBAC — Stop Giving Everyone Owner Access",
    subtitle:"Least privilege is not optional — it's fundamental",
    excerpt:"Half the team with Owner access on production is a disaster waiting to happen. Here's how to do it correctly.",
    quiz:[
      {q:"Which role allows creating resources but NOT assigning roles?",options:["Owner","Reader","Contributor","Security Admin"],answer:2},
      {q:"Which scope is usually most appropriate?",options:["Management Group","Subscription","Resource Group","Tenant Root"],answer:2},
      {q:"Reader role allows:",options:["Creating resources","Deleting resources","Managing access","View-only"],answer:3},
    ],
    content:[
      {type:"intro",text:"I've walked into environments where half the team had Owner access on production. 'It was easier at the time.' Then someone deleted a resource group by accident."},
      {type:"h2",text:"The Three Core Roles"},
      {type:"list",items:["🔴 Owner — full control including role assignment. Almost nobody needs this at subscription level.","🟡 Contributor — create and manage resources, cannot assign roles. Right for most engineers.","🟢 Reader — view only. Right for support, auditors, and finance teams."]},
      {type:"callout",label:"✅ Pattern",text:"Developers → Contributor on resource group only. Support → Reader on production. Admins → Owner only where needed, reviewed quarterly."},
    ]
  },
  {
    id:6, series:"security", level:"beginner", readTime:"5 min", emoji:"🆔",
    title:"Managed Identities — No More Hardcoded Credentials",
    subtitle:"Stop storing secrets in config files. Azure handles auth for you.",
    excerpt:"Connection strings in config files. Storage keys in repos. Managed Identities solve this entirely.",
    quiz:[
      {q:"Main benefit of Managed Identities:",options:["Cheaper compute","No credentials to manage","Faster network","Free storage"],answer:1},
      {q:"System-Assigned MI is best when:",options:["Shared across resources","One resource needs one identity","Running outside Azure","Used by GitHub Actions"],answer:1},
      {q:"Safest way for Azure Function to access Key Vault:",options:["Client secret in app settings","Managed Identity + RBAC","Storage key","Password in env var"],answer:1},
    ],
    content:[
      {type:"intro",text:"Connection strings hardcoded in config files. Storage keys committed to repos. Client secrets in plain text. This still happens — and it's completely avoidable."},
      {type:"h2",text:"What Managed Identities Do"},
      {type:"p",text:"Azure gives your resource its own identity in Entra ID. No credentials. No rotation. No secrets. Your app requests a token from the metadata endpoint — Azure handles everything."},
      {type:"callout",label:"🔑 Real Example",text:"Azure Function needs Key Vault access. Old: store client secret in app settings. New: enable Managed Identity → assign Key Vault Secrets User role. Zero credentials anywhere."},
      {type:"compare",left:{title:"System-Assigned",items:["Tied to one resource","Deleted with resource","Simpler setup"]},right:{title:"User-Assigned",items:["Standalone resource","Shared across resources","Survives resource deletion"]}},
    ]
  },
  {
    id:7, series:"security", level:"intermediate", readTime:"5 min", emoji:"🚦",
    title:"Conditional Access — MFA Alone Isn't Enough",
    subtitle:"Someone can pass MFA from a compromised device and get in",
    excerpt:"MFA is table stakes. Conditional Access is the if/then engine that makes identity security real.",
    quiz:[
      {q:"Legacy auth protocols do what to MFA?",options:["Strengthen it","Bypass it entirely","Slow it down","Require it more"],answer:1},
      {q:"Conditional Access minimum licence:",options:["Entra Free","Entra P1","Entra P2","M365 Basic"],answer:1},
      {q:"First policy to enable:",options:["Block all apps","Block legacy auth","Require VPN","Disable admin MFA"],answer:1},
    ],
    content:[
      {type:"intro",text:"MFA is non-negotiable. But someone can complete MFA from a compromised device in an unknown country — and Azure signs them in. Conditional Access is the answer."},
      {type:"h2",text:"Day One Policies"},
      {type:"list",items:["Require MFA for all users — no exceptions","Always require MFA for privileged roles","Block all legacy authentication protocols","Require compliant device for Azure Portal access"]},
      {type:"callout",label:"🚨 Do This First",text:"Block legacy authentication immediately. IMAP, POP3, SMTP bypass MFA entirely. Very little modern software needs them."},
    ]
  },
  {
    id:8, series:"security", level:"advanced", readTime:"5 min", emoji:"⏱️",
    title:"PIM — Make Privileged Access Temporary",
    subtitle:"Permanent Global Admin is a 24/7 high-value target",
    excerpt:"PIM makes your most powerful access time-limited, approval-gated, and fully audited.",
    quiz:[
      {q:"In PIM, 'eligible' means:",options:["Always has the role","Must activate when needed","Role is blocked","Costs extra"],answer:1},
      {q:"PIM is available in:",options:["Entra Free","Entra P1","Entra P2","M365 Basic"],answer:2},
      {q:"When a PIM session expires:",options:["Role stays active","Admin must renew","Role auto-removed","Flag only"],answer:2},
    ],
    content:[
      {type:"intro",text:"Every account with permanent Global Admin is a target — 24 hours a day. PIM changes this by making privileged access something you activate when needed, not something you always have."},
      {type:"h2",text:"How PIM Works"},
      {type:"list",items:["Users are eligible for a role — not permanently assigned","Activation requires MFA + written justification","Access granted for a defined window (e.g. 2 hours)","Access expires automatically — no manual cleanup"]},
      {type:"callout",label:"🛡️ The Security Win",text:"Even if an attacker compromises an admin account — they only have privileges during an active PIM session. Outside those windows: standard user."},
    ]
  },
  {
    id:9, series:"entra", level:"beginner", readTime:"6 min", emoji:"🪪",
    title:"Microsoft Entra ID — The Identity Foundation",
    subtitle:"More than just Azure AD with a new name",
    excerpt:"Every Azure resource authenticates through Entra ID. Here's what it actually is and why it matters.",
    quiz:[
      {q:"The three pillars of Entra ID:",options:["Compute, Storage, Network","Authentication, Authorization, Governance","Users, Groups, Devices","Licences, Roles, Policies"],answer:1},
      {q:"PIM and Identity Protection require:",options:["Entra Free","Entra P1","Entra P2","Azure subscription"],answer:2},
      {q:"Conditional Access available from:",options:["Entra Free","Entra P1","Entra P2 only","Azure subscription"],answer:1},
    ],
    content:[
      {type:"intro",text:"Entra ID is the entire identity and access foundation of Azure. Every VM, app, pipeline, and user authenticates through it. Non-optional knowledge."},
      {type:"h2",text:"Three Core Pillars"},
      {type:"list",items:["Authentication — who are you? MFA, passwordless, SSO","Authorization — what can you access? RBAC, Conditional Access","Governance — should you still have access? PIM, Access Reviews"]},
      {type:"callout",label:"🔑 Key Insight",text:"Identity is the new perimeter. In a Zero Trust world, Entra ID is your primary security boundary — not the network firewall."},
    ]
  },
  {
    id:10, series:"finops", level:"beginner", readTime:"6 min", emoji:"💸",
    title:"Where Azure Costs Silently Leak",
    subtitle:"Most cloud waste follows predictable patterns",
    excerpt:"I've seen Azure bills with thousands in waste nobody noticed. Here's where to look first.",
    quiz:[
      {q:"Orphaned resources are:",options:["In wrong region","Billing but not doing anything useful","Without tags","In dev environment"],answer:1},
      {q:"Auto-shutdown saves approximately:",options:["10%","30%","73%","100%"],answer:2},
      {q:"Azure Advisor is:",options:["A paid consultant","Free and built into the Portal","Premium support only","In M365 Admin Center"],answer:1},
    ],
    content:[
      {type:"intro",text:"Azure bills you for everything you leave running. No warnings. No auto-shutoff. Most waste follows predictable patterns."},
      {type:"h2",text:"1. Orphaned Resources"},
      {type:"p",text:"Managed disks from deleted VMs. Public IPs from deleted load balancers. Snapshots from migrations. All billing. All doing nothing."},
      {type:"callout",label:"⚡ Quick Win",text:"Enable auto-shutdown on dev/test VMs right now. Running 8hrs/day instead of 24hrs saves ~73% of that VM's cost immediately."},
      {type:"h2",text:"2. Pay-As-You-Go for Stable Workloads"},
      {type:"p",text:"Reservations and Savings Plans save 40–72% on compute you're running anyway. If a workload has run 3+ months, it's a reservation candidate."},
    ]
  },
  {
    id:11, series:"iac", level:"beginner", readTime:"6 min", emoji:"⚙️",
    title:"Why Infrastructure as Code Changes Everything",
    subtitle:"Stop clicking in the Azure Portal. Write code instead.",
    excerpt:"My first Azure environment was built through the Portal. Then I had to rebuild it — and realised I couldn't remember what I'd clicked.",
    quiz:[
      {q:"Main benefit of IaC over Portal:",options:["Faster internet","Repeatable, version-controlled infrastructure","Cheaper Azure","Better UI"],answer:1},
      {q:"Bicep is:",options:["A Terraform plugin","Azure-native IaC compiling to ARM","A Python framework","An Azure CLI extension"],answer:1},
      {q:"Terraform supports:",options:["Azure only","ARM only","Multiple clouds — Azure AWS GCP","Azure DevOps only"],answer:2},
    ],
    content:[
      {type:"intro",text:"I built my first Azure environment through the Portal. Felt productive. Then I needed to replicate it — and couldn't remember half of what I'd configured. That's when I switched to IaC."},
      {type:"compare",left:{title:"🔧 Bicep",items:["Azure-native, built by Microsoft","Always current with Azure","Excellent VS Code tooling","Azure only"]},right:{title:"🌍 Terraform",items:["Multi-cloud — Azure AWS GCP","Massive community","Most in-demand IaC skill","Slight lag on new features"]}},
      {type:"callout",label:"💡 Advice",text:"Azure only? Start with Bicep. Want cloud-agnostic skills? Start with Terraform. Have time? Learn both — they complement each other."},
    ]
  },
  {
    id:12, series:"ai", level:"beginner", readTime:"5 min", emoji:"🤖",
    title:"Azure OpenAI vs ChatGPT — Why It Matters",
    subtitle:"Same models. Completely different security posture.",
    excerpt:"Same GPT-4 models. Completely different story for enterprise. Here's why the distinction matters.",
    quiz:[
      {q:"Does Azure OpenAI use your data to train models?",options:["Yes by default","No — guaranteed in service agreement","Only with opt-in","Only GPT-3.5"],answer:1},
      {q:"Azure OpenAI can be accessed via:",options:["Public internet only","Private Endpoints in your VNet","VPN only","ExpressRoute only"],answer:1},
      {q:"For healthcare data the correct choice is:",options:["ChatGPT API","Azure OpenAI","Either — same thing","Neither"],answer:1},
    ],
    content:[
      {type:"intro",text:"Same GPT-4 models. Completely different enterprise story. For personal projects — OpenAI's API is fine. For production workloads with sensitive data — Azure OpenAI is the only responsible choice."},
      {type:"compare",left:{title:"💬 OpenAI API",items:["Easy access","Data may train models","Public internet only","No Entra ID auth","No compliance certs"]},right:{title:"🏢 Azure OpenAI",items:["Same GPT-4/4o models","Data never trains models","Private Endpoint support","Entra ID + RBAC","GDPR, ISO27001, SOC2"]}},
      {type:"callout",label:"🏥 Who It Matters To",text:"Healthcare, legal, finance, government — for these sectors, Azure OpenAI isn't a preference. It's a compliance requirement."},
    ]
  },
];

const getSeries   = (id) => SERIES.find(s=>s.id===id);
const getByS      = (sid) => POSTS.filter(p=>p.series===sid).sort((a,b)=>a.id-b.id);
const getNext     = (post) => {
  const sp=getByS(post.series); const idx=sp.findIndex(p=>p.id===post.id);
  if(idx<sp.length-1) return sp[idx+1];
  const ns=SERIES.find(s=>s.order===getSeries(post.series).order+1);
  return ns?getByS(ns.id)[0]:null;
};

function LvlBadge({level,sm}) {
  const l=LEVELS[level];
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:sm?"2px 8px":"3px 10px",borderRadius:100,fontSize:sm?10:11,fontWeight:700,background:l.bg+"44",color:l.color,border:`1px solid ${l.bg}88`,fontFamily:"monospace"}}>{l.icon} {l.label}</span>;
}
function SBadge({series,sm}) {
  const s=getSeries(series); if(!s) return null;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:sm?"2px 8px":"3px 10px",borderRadius:100,fontSize:sm?10:11,fontWeight:700,background:s.color+"22",color:s.color,border:`1px solid ${s.color}44`,fontFamily:"monospace"}}>{s.icon} {s.label}</span>;
}

function Quiz({questions,onDone}) {
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const score=submitted?questions.filter((q,i)=>answers[i]===q.answer).length:0;
  const all=Object.keys(answers).length===questions.length;
  return (
    <div style={{background:"#0a1020",border:"1px solid #1e3a5f",borderRadius:16,padding:24,marginTop:40}}>
      <div style={{fontFamily:"monospace",fontSize:11,color:G.accent,letterSpacing:2,marginBottom:4}}>📝 QUICK CHECK</div>
      <div style={{fontSize:13,color:G.muted,marginBottom:22,fontStyle:"italic"}}>Test your understanding before moving on.</div>
      {questions.map((q,qi)=>(
        <div key={qi} style={{marginBottom:24}}>
          <div style={{fontSize:14,fontWeight:600,color:G.text,marginBottom:10,lineHeight:1.5}}>{qi+1}. {q.q}</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {q.options.map((opt,oi)=>{
              const sel=answers[qi]===oi,cor=submitted&&oi===q.answer,wr=submitted&&sel&&oi!==q.answer;
              return <button key={oi} onClick={()=>!submitted&&setAnswers(a=>({...a,[qi]:oi}))}
                style={{textAlign:"left",padding:"9px 14px",borderRadius:8,fontSize:13,cursor:submitted?"default":"pointer",transition:"all 0.15s",background:cor?"#052e16":wr?"#2d0a0a":sel?"#0f2a4a":"#111827",border:`1px solid ${cor?"#22c55e":wr?"#ef4444":sel?G.accent:"#1f2937"}`,color:cor?"#4ade80":wr?"#f87171":sel?G.accent:G.muted}}>
                {cor?"✅ ":wr?"❌ "}{opt}
              </button>;
            })}
          </div>
        </div>
      ))}
      {!submitted
        ?<button onClick={()=>setSubmitted(true)} disabled={!all} style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:all?"pointer":"not-allowed",background:all?G.accent:"#1f2937",color:all?"#000":G.muted,fontWeight:700,fontSize:14,transition:"all 0.2s"}}>Submit Answers</button>
        :<div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <span style={{fontSize:17,fontWeight:800,color:score===questions.length?"#4ade80":score>=questions.length/2?G.accent:"#f87171",fontFamily:"monospace"}}>
            {score}/{questions.length} {score===questions.length?"🎉 Perfect!":score>=questions.length/2?"👍 Good job!":"📖 Review the article"}
          </span>
          <button onClick={onDone} style={{padding:"9px 22px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#38bdf8,#818cf8)",color:"#000",fontWeight:700,fontSize:13}}>Continue →</button>
        </div>
      }
    </div>
  );
}

function Block({b}) {
  if(b.type==="intro")   return <p style={{fontSize:17,lineHeight:1.9,color:"#94a3b8",fontStyle:"italic",borderLeft:`3px solid ${G.accent}`,paddingLeft:18,marginBottom:24}}>{b.text}</p>;
  if(b.type==="h2")      return <h2 style={{fontSize:20,fontWeight:800,color:G.text,margin:"36px 0 14px",paddingBottom:10,borderBottom:`1px solid ${G.border}`}}>{b.text}</h2>;
  if(b.type==="p")       return <p style={{fontSize:15,lineHeight:1.85,color:"#94a3b8",marginBottom:18}}>{b.text}</p>;
  if(b.type==="callout") return (
    <div style={{background:"#0a1929",border:`1px solid ${G.accent}44`,borderLeft:`4px solid ${G.accent}`,borderRadius:"0 10px 10px 0",padding:"16px 20px",margin:"24px 0"}}>
      <div style={{fontFamily:"monospace",fontSize:10,fontWeight:700,color:G.accent,letterSpacing:2,marginBottom:6}}>{b.label}</div>
      <p style={{fontSize:14,lineHeight:1.7,color:G.text,margin:0}}>{b.text}</p>
    </div>
  );
  if(b.type==="list") return (
    <ul style={{padding:0,margin:"0 0 20px",listStyle:"none"}}>
      {b.items.map((item,i)=>(
        <li key={i} style={{display:"flex",gap:10,marginBottom:8,fontSize:14,color:"#94a3b8",lineHeight:1.7}}>
          <span style={{color:G.accent,fontWeight:700,flexShrink:0}}>→</span><span>{item}</span>
        </li>
      ))}
    </ul>
  );
  if(b.type==="compare") return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"22px 0"}}>
      {[b.left,b.right].map((side,i)=>(
        <div key={i} style={{background:G.surface2,border:`1px solid ${G.border}`,borderRadius:10,padding:"16px 18px"}}>
          <div style={{fontWeight:700,fontSize:13,color:G.text,marginBottom:10,paddingBottom:8,borderBottom:`1px solid ${G.border}`}}>{side.title}</div>
          <ul style={{padding:0,margin:0,listStyle:"none"}}>
            {side.items.map((it,j)=><li key={j} style={{fontSize:12,color:G.muted,marginBottom:6,lineHeight:1.5}}>• {it}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
  return null;
}

function Card({post,onClick,compact}) {
  const [hov,setHov]=useState(false);
  const s=getSeries(post.series);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?G.surface2:G.surface,border:`1px solid ${hov?s.color+"66":G.border}`,borderRadius:12,padding:compact?"12px 14px":"18px 20px",cursor:"pointer",transition:"all 0.2s",boxShadow:hov?`0 6px 24px ${s.color}18`:"none",transform:hov?"translateY(-2px)":"none"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <LvlBadge level={post.level} sm />
        <span style={{fontFamily:"monospace",fontSize:10,color:G.muted}}>⏱ {post.readTime}</span>
      </div>
      <div style={{fontSize:compact?13:14,fontWeight:700,color:hov?G.text:"#cbd5e1",lineHeight:1.35,marginBottom:compact?0:6}}>{post.emoji} {post.title}</div>
      {!compact&&<div style={{fontSize:12,color:G.muted,lineHeight:1.6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{post.excerpt}</div>}
      {!compact&&<div style={{marginTop:8,fontSize:11,fontWeight:700,color:s.color,fontFamily:"monospace"}}>Read →</div>}
    </div>
  );
}

function RoadmapView({onOpen}) {
  const [lvl,setLvl]=useState("all");
  const filtered=SERIES.map(s=>({...s,posts:getByS(s.id).filter(p=>lvl==="all"||p.level===lvl)})).filter(s=>s.posts.length>0);
  return (
    <div>
      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,#07090f,#0d1f3c 60%,#07090f)",padding:"60px 24px 48px",borderBottom:`1px solid ${G.border}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:500,height:500,background:"#38bdf8",borderRadius:"50%",filter:"blur(160px)",opacity:0.04,top:-200,right:-100}} />
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:100,padding:"5px 16px",fontFamily:"monospace",fontSize:11,color:G.accent,letterSpacing:2,marginBottom:20}}>
            ⚡ AZURE ENGINEER · LEARNING PATH
          </div>
          <h1 style={{fontSize:"clamp(28px,6vw,56px)",fontWeight:900,color:"#f1f5f9",lineHeight:1.05,letterSpacing:"-2px",marginBottom:14}}>
            Go from Zero to<br /><em style={{color:G.accent,fontStyle:"normal"}}>Cloud Engineer.</em>
          </h1>
          <p style={{fontSize:15,color:G.muted,maxWidth:480,margin:"0 auto 28px",lineHeight:1.8}}>
            Structured learning path — 12 articles across 6 series. Know exactly where to start, what's next, and test yourself after every article.
          </p>
          <div style={{display:"flex",justifyContent:"center",gap:32,flexWrap:"wrap"}}>
            {[["12","Articles"],["6","Series"],["3","Skill Levels"]].map(([n,l])=>(
              <div key={l} style={{borderLeft:`2px solid ${G.accent}`,paddingLeft:14,textAlign:"left"}}>
                <div style={{fontSize:28,fontWeight:900,color:"#f1f5f9",lineHeight:1}}>{n}</div>
                <div style={{fontSize:11,color:G.muted,fontFamily:"monospace",letterSpacing:1}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start here */}
      <div style={{background:"linear-gradient(90deg,#0a2540,#0f3460)",borderBottom:`1px solid ${G.border}`,padding:"16px 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <span style={{fontSize:24}}>👋</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,color:"#f1f5f9",fontSize:14,marginBottom:2}}>New to Azure? Start here.</div>
            <div style={{fontSize:12,color:G.muted}}>Begin with Networking → Beginner articles. Each ends with a quiz — complete it before moving on.</div>
          </div>
          <button onClick={()=>onOpen(POSTS[0])} style={{padding:"9px 20px",borderRadius:10,border:"none",cursor:"pointer",background:G.accent,color:"#000",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>
            Start Learning →
          </button>
        </div>
      </div>

      {/* Level filter */}
      <div style={{background:G.surface,borderBottom:`1px solid ${G.border}`,padding:"14px 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontFamily:"monospace",fontSize:11,color:G.muted,letterSpacing:1}}>LEVEL:</span>
          {[{id:"all",label:"All",icon:"🌟",color:G.accent},...Object.entries(LEVELS).map(([id,v])=>({id,...v}))].map(l=>(
            <button key={l.id} onClick={()=>setLvl(l.id)} style={{padding:"6px 14px",borderRadius:100,border:`1px solid ${lvl===l.id?l.color:G.border}`,background:lvl===l.id?l.color+"22":"transparent",color:lvl===l.id?l.color:G.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"monospace",transition:"all 0.2s"}}>
              {l.icon} {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Series */}
      <div style={{maxWidth:1000,margin:"0 auto",padding:"32px 24px 64px"}}>
        {filtered.map(series=>(
          <div key={series.id} style={{marginBottom:44}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{width:40,height:40,borderRadius:10,background:series.color+"22",border:`1px solid ${series.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{series.icon}</div>
              <div>
                <div style={{fontFamily:"monospace",fontSize:10,color:G.muted,letterSpacing:1}}>SERIES {series.order} · {series.posts.length} articles</div>
                <h2 style={{fontWeight:800,fontSize:18,color:"#f1f5f9",marginTop:2}}><span style={{color:series.color}}>{series.icon}</span> {series.label}</h2>
                <div style={{fontSize:11,color:G.muted,marginTop:1}}>{series.desc}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12,paddingLeft:52}}>
              {series.posts.map((post,pi)=>(
                <div key={post.id} style={{position:"relative"}}>
                  <div style={{position:"absolute",top:-7,left:-7,width:22,height:22,borderRadius:"50%",background:G.bg,border:`2px solid ${series.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontSize:9,fontWeight:700,color:series.color,zIndex:1}}>{pi+1}</div>
                  <Card post={post} onClick={()=>onOpen(post)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticleView({post,onBack,onOpen}) {
  const [quizDone,setQuizDone]=useState(false);
  const series=getSeries(post.series);
  const nextPost=getNext(post);
  const sp=getByS(post.series);
  const idx=sp.findIndex(p=>p.id===post.id);
  useEffect(()=>{setQuizDone(false);},[post.id]);

  return (
    <div style={{minHeight:"100vh",background:G.bg}}>
      {/* Sticky bar */}
      <div style={{background:G.surface,borderBottom:`1px solid ${G.border}`,padding:"10px 24px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",position:"sticky",top:0,zIndex:100}}>
        <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:`1px solid ${G.border}`,borderRadius:100,padding:"6px 14px",fontSize:12,color:G.muted,cursor:"pointer",fontFamily:"monospace"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=G.accent;e.currentTarget.style.color=G.accent;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=G.border;e.currentTarget.style.color=G.muted;}}>
          ← Back
        </button>
        <SBadge series={post.series} sm />
        <LvlBadge level={post.level} sm />
        <div style={{marginLeft:"auto",display:"flex",gap:4}}>
          {sp.map((p,i)=>(
            <div key={p.id} onClick={()=>onOpen(p)} title={p.title}
              style={{width:i===idx?16:6,height:6,borderRadius:100,background:i===idx?series.color:i<idx?series.color+"66":G.border,cursor:"pointer",transition:"all 0.2s"}} />
          ))}
        </div>
      </div>

      <article style={{maxWidth:680,margin:"0 auto",padding:"44px 24px 72px"}}>
        <div style={{fontSize:44,marginBottom:14,lineHeight:1}}>{post.emoji}</div>
        <h1 style={{fontSize:"clamp(22px,5vw,36px)",fontWeight:900,color:"#f1f5f9",lineHeight:1.1,letterSpacing:"-1px",marginBottom:10}}>{post.title}</h1>
        <p style={{fontSize:15,color:G.muted,fontStyle:"italic",lineHeight:1.6,marginBottom:20}}>{post.subtitle}</p>
        <div style={{display:"flex",alignItems:"center",gap:14,paddingBottom:24,borderBottom:`1px solid ${G.border}`,flexWrap:"wrap",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:G.surface2,border:`2px solid ${series.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>👨‍💻</div>
            <div>
              <div style={{fontWeight:700,fontSize:12,color:G.text}}>Azure Engineer</div>
            </div>
          </div>
          <span style={{fontSize:11,color:G.muted,fontFamily:"monospace"}}>⏱ {post.readTime}</span>
          <span style={{fontSize:11,color:G.muted,fontFamily:"monospace"}}>{idx+1} of {sp.length} in {series.label}</span>
        </div>

        {post.content.map((b,i)=><Block key={i} b={b} />)}

        {!quizDone
          ?<Quiz questions={post.quiz} onDone={()=>setQuizDone(true)} />
          :<div style={{marginTop:32,padding:20,background:"#052e16",border:"1px solid #16a34a44",borderRadius:12,textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:4}}>✅</div>
            <div style={{fontWeight:700,color:"#4ade80",fontSize:16}}>Quiz Complete!</div>
            <div style={{fontSize:12,color:G.muted,marginTop:4}}>Ready for the next article?</div>
          </div>
        }

        {nextPost&&quizDone&&(
          <div style={{marginTop:24,padding:22,background:G.surface,border:`1px solid ${series.color}44`,borderRadius:14}}>
            <div style={{fontFamily:"monospace",fontSize:10,color:series.color,letterSpacing:2,marginBottom:12}}>▶ NEXT IN YOUR LEARNING PATH</div>
            <div style={{display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:180}}>
                <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                  <SBadge series={nextPost.series} sm />
                  <LvlBadge level={nextPost.level} sm />
                </div>
                <div style={{fontWeight:800,fontSize:15,color:"#f1f5f9",marginBottom:4}}>{nextPost.emoji} {nextPost.title}</div>
                <div style={{fontSize:12,color:G.muted,lineHeight:1.6}}>{nextPost.excerpt}</div>
              </div>
              <button onClick={()=>onOpen(nextPost)} style={{padding:"11px 22px",borderRadius:10,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${series.color},#a78bfa)`,color:"#000",fontWeight:800,fontSize:14,whiteSpace:"nowrap",alignSelf:"center"}}>
                Read Next →
              </button>
            </div>
          </div>
        )}

        {!nextPost&&quizDone&&(
          <div style={{marginTop:24,padding:24,background:"#0a1929",border:`1px solid ${G.accent}44`,borderRadius:14,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:8}}>🎉</div>
            <div style={{fontWeight:800,fontSize:18,color:"#f1f5f9",marginBottom:4}}>You've completed the learning path!</div>
            <div style={{fontSize:13,color:G.muted,marginBottom:16}}>12 articles. 6 series. You're ready for the real world.</div>
            <button onClick={onBack} style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",background:G.accent,color:"#000",fontWeight:800,fontSize:13}}>Back to Roadmap</button>
          </div>
        )}
      </article>
    </div>
  );
}

function AllView({onOpen}) {
  const [q,setQ]=useState(""); const [fs,setFs]=useState("all"); const [fl,setFl]=useState("all");
  const filtered=POSTS.filter(p=>(fs==="all"||p.series===fs)&&(fl==="all"||p.level===fl)&&(!q||p.title.toLowerCase().includes(q.toLowerCase())||p.excerpt.toLowerCase().includes(q.toLowerCase())));
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"32px 24px 64px"}}>
      <h2 style={{fontSize:22,fontWeight:800,color:"#f1f5f9",marginBottom:20}}>All Articles</h2>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:22,paddingBottom:20,borderBottom:`1px solid ${G.border}`}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:G.muted,fontSize:12,pointerEvents:"none"}}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..."
            style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:100,padding:"8px 14px 8px 30px",fontSize:12,color:G.text,outline:"none",fontFamily:"monospace",width:180}}
            onFocus={e=>e.target.style.borderColor=G.accent} onBlur={e=>e.target.style.borderColor=G.border} />
        </div>
        <select value={fs} onChange={e=>setFs(e.target.value)} style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:100,padding:"8px 14px",fontSize:12,color:G.muted,outline:"none",fontFamily:"monospace",cursor:"pointer"}}>
          <option value="all">All Series</option>
          {SERIES.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
        </select>
        <select value={fl} onChange={e=>setFl(e.target.value)} style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:100,padding:"8px 14px",fontSize:12,color:G.muted,outline:"none",fontFamily:"monospace",cursor:"pointer"}}>
          <option value="all">All Levels</option>
          {Object.entries(LEVELS).map(([id,l])=><option key={id} value={id}>{l.icon} {l.label}</option>)}
        </select>
        <span style={{fontFamily:"monospace",fontSize:11,color:G.muted,alignSelf:"center",marginLeft:"auto"}}>{filtered.length} articles</span>
      </div>
      {filtered.length===0
        ?<div style={{textAlign:"center",padding:"48px 20px",color:G.muted}}>
          <div style={{fontSize:32,marginBottom:8}}>🔍</div>
          <div style={{fontSize:16,color:G.text,marginBottom:4}}>No articles found</div>
          <div>Try different search terms</div>
        </div>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
          {filtered.map((post,i)=>(
            <div key={post.id} style={{animation:`fadeUp 0.3s ease ${i*0.04}s both`}}>
              <Card post={post} onClick={()=>onOpen(post)} />
            </div>
          ))}
        </div>
      }
    </div>
  );
}

export default function App() {
  const [view,setView]=useState("roadmap");
  const [post,setPost]=useState(null);
  const openPost=(p)=>{setPost(p);setView("article");};
  const goHome=()=>{setPost(null);setView("roadmap");};

  return (
    <div style={{minHeight:"100vh",background:G.bg,color:G.text,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      {/* NAV */}
      <nav style={{background:G.surface,borderBottom:`1px solid ${G.border}`,height:56,display:"flex",alignItems:"center",padding:"0 24px",gap:16,position:"sticky",top:0,zIndex:99}}>
        <div onClick={goHome} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",flexShrink:0}}>
          <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#38bdf8,#818cf8)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontSize:11,fontWeight:700,color:"#000"}}>AE</div>
          <span style={{fontWeight:800,fontSize:16,color:"#f1f5f9"}}>Azure<span style={{color:G.accent}}>Engineer</span></span>
        </div>
        <div style={{display:"flex",gap:4}}>
          {[{id:"roadmap",label:"🗺 Path"},{id:"all",label:"📚 All"}].map(tab=>(
            <button key={tab.id} onClick={()=>{setView(tab.id);setPost(null);}} style={{padding:"6px 14px",borderRadius:100,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"monospace",transition:"all 0.2s",background:view===tab.id&&!post?G.accent+"22":"transparent",color:view===tab.id&&!post?G.accent:G.muted}}>
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:5,flexShrink:0}}>
          {Object.entries(LEVELS).map(([id,l])=>(
            <span key={id} style={{fontFamily:"monospace",fontSize:9,color:l.color,background:l.bg+"33",padding:"2px 8px",borderRadius:100,border:`1px solid ${l.bg}55`}}>{l.icon} {l.label}</span>
          ))}
        </div>
      </nav>

      {view==="article"&&post
        ?<ArticleView post={post} onBack={goHome} onOpen={openPost} />
        :view==="all"
          ?<AllView onOpen={openPost} />
          :<RoadmapView onOpen={openPost} />
      }

      {view!=="article"&&(
        <footer style={{background:G.surface,borderTop:`1px solid ${G.border}`,textAlign:"center",padding:"20px",fontFamily:"monospace",fontSize:11,color:G.muted}}>
          <div style={{fontWeight:800,fontSize:15,color:"#f1f5f9",marginBottom:4}}>Azure<span style={{color:G.accent}}>Engineer</span></div>
          12 articles · 6 series · 3 skill levels · Quizzes after every article
        </footer>
      )}

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0;}
      `}</style>
    </div>
  );
}
