import { useState, useEffect } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const G = {
  bg: "#07090f",
  surface: "#0d1117",
  surface2: "#111827",
  border: "#1f2937",
  text: "#f1f5f9",
  muted: "#64748b",
  accent: "#38bdf8",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const LEVELS = {
  beginner:     { label: "Beginner",     color: "#34d399", bg: "#064e3b", icon: "🌱" },
  intermediate: { label: "Intermediate", color: "#a78bfa", bg: "#4c1d95", icon: "⚡" },
  advanced:     { label: "Advanced",     color: "#fb923c", bg: "#7c2d12", icon: "🔥" },
};

const SERIES = [
  { id: "networking", label: "Azure Networking",    color: "#38bdf8", icon: "🌐", order: 1, desc: "VNets, subnets, NSGs, Private Endpoints, DNS, Bastion, Hub-and-Spoke" },
  { id: "security",   label: "Security & Identity", color: "#f472b6", icon: "🔐", order: 2, desc: "RBAC, Managed Identities, Conditional Access, PIM, Zero Trust" },
  { id: "entra",      label: "Entra ID Deep Dive",  color: "#a78bfa", icon: "🪪", order: 3, desc: "Identity foundation, Service Principals, Identity Protection, Access Reviews" },
  { id: "finops",     label: "Cost & FinOps",       color: "#4ade80", icon: "💰", order: 4, desc: "Cost leaks, Reservations, Azure Advisor, Tagging, FinOps culture" },
  { id: "iac",        label: "IaC & Automation",    color: "#fb923c", icon: "⚙️", order: 5, desc: "Why IaC, Bicep vs Terraform, State, Pipelines, Azure Policy" },
  { id: "ai",         label: "Azure AI & Copilot",  color: "#f9a8d4", icon: "🤖", order: 6, desc: "Azure OpenAI, RAG architecture, Copilot for Azure, AI workload security" },
  { id: "entraadv",  label: "Entra ID Advanced",   color: "#e879f9", icon: "🔮", order: 7, desc: "SSO, B2B, B2C, Hybrid Identity, App Registrations, SSPR, Passwordless" },
];

const POSTS = [
  // ── NETWORKING ──────────────────────────────────────────────────────────────
  {
    id:1, series:"networking", level:"beginner", readTime:"6 min", date:"Jan 6, 2025", emoji:"🌐",
    title:"VNet Design — Get This Right From Day One",
    subtitle:"Five rules every Azure engineer must know before touching a subnet",
    excerpt:"I've seen teams spend weeks fixing a network built in a day. Not because they were bad engineers — because they skipped the planning. Here's what actually matters.",
    quiz:[
      { q:"What happens if two VNets have overlapping address spaces?", options:["They auto-merge","They cannot be peered","Traffic is duplicated","Nothing happens"], answer:1 },
      { q:"Which subnet name is required for Azure Bastion?", options:["BastionSubnet","AzureBastionSubnet","ManagementSubnet","JumpSubnet"], answer:1 },
      { q:"VNet Peering connects:", options:["Azure to on-premises","Two VNets inside Azure","Azure to the internet","Two tenants only"], answer:1 },
    ],
    content:[
      { type:"intro", text:"I've seen teams spend weeks fixing a network they built in a day. Not because they weren't skilled — because they skipped the planning. In Azure, the network is the one thing that's genuinely painful to redesign once resources are deployed on top of it." },
      { type:"h2", text:"Rule 1 — Plan Your Address Space First" },
      { type:"p", text:"Before you create a single subnet, decide on your IP address ranges. When you try to peer two VNets, Azure will refuse if address spaces overlap. If Dev is 10.0.0.0/16 and Prod is also 10.0.0.0/16, you can never peer them. Full stop." },
      { type:"callout", label:"✅ Practical Rule", text:"Dev → 10.1.0.0/16 · QA → 10.2.0.0/16 · Prod → 10.3.0.0/16. Simple, non-overlapping, room to grow." },
      { type:"h2", text:"Rule 2 — One Subnet Per Workload Tier" },
      { type:"list", items:["Web Subnet — internet-facing layer","App Subnet — business logic, no internet access","Data Subnet — databases, strictly locked down","Management Subnet — Bastion, jump hosts, admin tooling"] },
      { type:"h2", text:"Rule 3 — NSGs: Deny by Default" },
      { type:"callout", label:"🚨 Non-Negotiable", text:"Never open port 3389 (RDP) or 22 (SSH) to the internet. Use Azure Bastion instead. Exposed RDP ports get attacked within minutes." },
      { type:"h2", text:"Rule 4 — VNet Peering vs VPN Gateway" },
      { type:"compare", left:{ title:"🔗 VNet Peering", items:["Connects VNets inside Azure","Microsoft backbone — fast & cheap","Best for Azure-to-Azure"] }, right:{ title:"🌍 VPN Gateway", items:["Connects Azure to on-premises","Encrypted internet tunnel","Monthly gateway cost"] } },
      { type:"h2", text:"Rule 5 — Learn Hub-and-Spoke Early" },
      { type:"p", text:"One Hub VNet with Firewall, Bastion, and Gateway. Spoke VNets for each environment. All traffic flows through the Hub Firewall — one place for rules, logs, and visibility." },
    ]
  },
  {
    id:2, series:"networking", level:"beginner", readTime:"5 min", date:"Jan 13, 2025", emoji:"🔒",
    title:"Private Endpoints — Lock Down Your PaaS in 15 Minutes",
    subtitle:"Your Storage, SQL, and Key Vault are publicly accessible by default",
    excerpt:"Your Azure Storage Account is reachable from the public internet by default. Private Endpoints fix this — and they're faster to set up than you think.",
    quiz:[
      { q:"What does a Private Endpoint give your PaaS service?", options:["A public IP","A private IP inside your VNet","A VPN tunnel","A new DNS zone automatically"], answer:1 },
      { q:"What must always be set up alongside a Private Endpoint?", options:["NSG rule","Private DNS Zone","Azure Firewall","Route table"], answer:1 },
      { q:"Without a Private Endpoint, Azure PaaS services are:", options:["Blocked by default","Publicly accessible by default","Only reachable from Azure VMs","Protected by Defender automatically"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Your Azure Storage Account is accessible from the public internet by default. So is your SQL Database. And your Key Vault. Private Endpoints change this entirely — and take about 15 minutes to set up." },
      { type:"h2", text:"What a Private Endpoint Does" },
      { type:"p", text:"It gives your PaaS service a private IP address inside your VNet. Traffic never leaves Microsoft's backbone. There's no public internet involved at all." },
      { type:"callout", label:"🔐 The Security Gain", text:"Once set up with public access disabled — an attacker on the internet simply cannot reach the service. The endpoint doesn't exist from their perspective." },
      { type:"h2", text:"The One Thing People Always Forget" },
      { type:"p", text:"Private Endpoints need Private DNS Zones. Without one, DNS still resolves the hostname to the public IP — even though you've created a Private Endpoint. Always set them up as a pair." },
      { type:"callout", label:"📌 Always Together", text:"Private Endpoint + Private DNS Zone. One without the other = broken name resolution and very confusing debugging." },
    ]
  },
  {
    id:3, series:"networking", level:"intermediate", readTime:"5 min", date:"Jan 20, 2025", emoji:"🛡️",
    title:"Azure Firewall vs NSG — Two Tools, Two Jobs",
    subtitle:"Both control traffic. Neither replaces the other.",
    excerpt:"Most teams use one when they need both. Here's the clear breakdown and how to layer them properly for real defence in depth.",
    quiz:[
      { q:"NSGs operate at which network layer?", options:["Layer 7","Layer 4","Layer 2","Layer 1"], answer:1 },
      { q:"Which tool can filter by domain name (FQDN)?", options:["NSG","Route Table","Azure Firewall","VNet Peering"], answer:2 },
      { q:"The correct layered approach is:", options:["NSG only","Firewall only","NSG at subnet + Firewall at Hub","WAF only"], answer:2 },
    ],
    content:[
      { type:"intro", text:"Should you use Azure Firewall or NSGs? Both. But for different reasons at different layers. Using one when you need both leaves real gaps in your security posture." },
      { type:"h2", text:"NSG — Your Door Lock (Free)" },
      { type:"p", text:"Layer 4 filtering. Works on IP addresses, ports, and protocols. Fast, cheap, applied at subnet or NIC level. Cannot filter by domain name or inspect packet contents." },
      { type:"h2", text:"Azure Firewall — Your Security Guard (Paid)" },
      { type:"p", text:"Layers 4–7. Filters by FQDN (e.g. *.microsoft.com). Built-in threat intelligence. Central logging across all environments. Deployed once in Hub VNet, covers all spokes." },
      { type:"callout", label:"🏗️ Right Architecture", text:"NSGs on every subnet for granular control. Azure Firewall in Hub VNet for centralised inspection and logging. Defence in depth — not one or the other." },
    ]
  },
  {
    id:4, series:"networking", level:"intermediate", readTime:"4 min", date:"Jan 27, 2025", emoji:"🔤",
    title:"Azure DNS — The Quiet Thing That Breaks Everything",
    subtitle:"Nobody thinks about DNS until it stops working",
    excerpt:"Invisible when it works, catastrophic when it doesn't. Here's what every Azure engineer needs to know about DNS before they hit the hard way.",
    quiz:[
      { q:"What is the Azure-provided DNS resolver IP?", options:["10.0.0.1","168.63.129.16","8.8.8.8","192.168.1.1"], answer:1 },
      { q:"Private DNS Zones are primarily used for:", options:["Public website DNS","Private Endpoint name resolution","CDN routing","Load balancer health checks"], answer:1 },
      { q:"Hybrid environments typically need:", options:["Azure DNS only","Custom DNS only","A DNS forwarder or Azure Private Resolver","No DNS configuration"], answer:2 },
    ],
    content:[
      { type:"intro", text:"DNS is completely invisible when it works and absolutely catastrophic when it doesn't. In Azure there are three DNS options — choosing the wrong one leads to the most confusing debugging sessions you'll ever have." },
      { type:"h2", text:"Three DNS Options in Azure" },
      { type:"list", items:["Azure-provided DNS (168.63.129.16) — default, works out of the box, no customisation possible","Custom DNS — point your VNet to your own DNS server, needed for hybrid environments","Private DNS Zones — managed zones for Private Endpoint resolution, linked to your VNets"] },
      { type:"callout", label:"💀 Most Common Mistake", text:"Setting up Private Endpoints without configuring Private DNS Zones. Name resolution breaks silently. Error messages are confusing. Always pair them together." },
    ]
  },
  {
    id:5, series:"networking", level:"beginner", readTime:"4 min", date:"Feb 3, 2025", emoji:"🏰",
    title:"Azure Bastion — Close Port 3389 Right Now",
    subtitle:"Exposed RDP ports get attacked within minutes of going public",
    excerpt:"Never expose RDP or SSH to the internet again. Azure Bastion gives you secure VM access through the portal — no public IPs, no open ports.",
    quiz:[
      { q:"What port does Azure Bastion use to connect?", options:["3389 over internet","22 over internet","443 (HTTPS) via portal","8080"], answer:2 },
      { q:"What exact subnet name does Azure Bastion require?", options:["BastionSubnet","AzureBastionSubnet","ManagementSubnet","Any name works"], answer:1 },
      { q:"Do VMs need a public IP when using Azure Bastion?", options:["Yes always","No — that's the whole point","Only Linux VMs","Only in production"], answer:1 },
    ],
    content:[
      { type:"intro", text:"If your VM has port 3389 open to the internet — close it right now. Exposed RDP ports get scanned and attacked within minutes. Not hours. Minutes." },
      { type:"h2", text:"What Azure Bastion Does" },
      { type:"list", items:["Connect to VMs directly from the Azure Portal over HTTPS","No public IP required on the VM","No open RDP or SSH ports exposed to internet","Traffic never leaves Microsoft's network"] },
      { type:"callout", label:"💰 Cost vs Risk", text:"Azure Bastion costs ~£140/month. Compare that to your incident response costs when a VM gets compromised. Suddenly very cheap insurance." },
      { type:"h2", text:"Setup Checklist" },
      { type:"list", items:["Create AzureBastionSubnet (minimum /26) in your Hub VNet","Deploy Bastion resource into that subnet","Remove public IPs from your VMs","Block port 3389 and 22 inbound in your NSGs"] },
    ]
  },
  {
    id:6, series:"networking", level:"advanced", readTime:"6 min", date:"Feb 10, 2025", emoji:"🕸️",
    title:"Hub-and-Spoke — The Enterprise Network Pattern",
    subtitle:"Every serious Azure environment uses this. Learn it early.",
    excerpt:"One Hub VNet. Multiple Spoke VNets. Centralised security, shared services, and complete environment isolation. Here's how it works.",
    quiz:[
      { q:"What lives in the Hub VNet?", options:["Application workloads","Shared services — Firewall, Bastion, Gateway","Only databases","Dev environment only"], answer:1 },
      { q:"How do Spoke VNets connect to the Hub?", options:["VPN Gateway","ExpressRoute","VNet Peering","Public internet"], answer:2 },
      { q:"Traffic between two spokes flows through:", options:["Direct peering","The Hub Firewall","The internet","A load balancer"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Every serious Azure environment I've worked in uses Hub-and-Spoke. Learn it early and every other networking decision starts making obvious sense." },
      { type:"h2", text:"What Goes in the Hub" },
      { type:"list", items:["Azure Firewall — inspects and logs all inter-spoke and outbound traffic","Azure Bastion — secure VM access across all spoke environments","VPN / ExpressRoute Gateway — on-premises connectivity","Private DNS Resolver — name resolution for hybrid environments"] },
      { type:"h2", text:"The Spokes" },
      { type:"list", items:["Dev VNet — development workloads, test databases","QA VNet — staging and pre-production environments","Production VNet — live customer-facing workloads"] },
      { type:"callout", label:"🚦 Traffic Flow Rule", text:"All inter-spoke traffic routes through the Hub Firewall via User Defined Routes. One place for rules, logs, and visibility. No direct spoke-to-spoke communication." },
    ]
  },
  // ── SECURITY ────────────────────────────────────────────────────────────────
  {
    id:7, series:"security", level:"beginner", readTime:"5 min", date:"Feb 17, 2025", emoji:"🔐",
    title:"RBAC — Stop Giving Everyone Owner Access",
    subtitle:"Least privilege is not optional — it's fundamental",
    excerpt:"Half the team with Owner access on production is a disaster waiting to happen. Here's how to assign Azure roles correctly from day one.",
    quiz:[
      { q:"Which role allows creating resources but NOT assigning roles?", options:["Owner","Reader","Contributor","Security Admin"], answer:2 },
      { q:"Which scope is usually most appropriate for RBAC assignments?", options:["Management Group","Subscription","Resource Group","Tenant Root"], answer:2 },
      { q:"Reader role allows:", options:["Creating resources","Deleting resources","Managing access","View-only, no changes"], answer:3 },
    ],
    content:[
      { type:"intro", text:"I've walked into environments where half the team had Owner access. 'It was easier at the time.' Then someone deleted a production resource group. It's never easier after that." },
      { type:"h2", text:"The Three Core Roles" },
      { type:"list", items:["🔴 Owner — full control including role assignment. Almost nobody needs this at subscription level.","🟡 Contributor — create and manage resources, cannot assign roles. Right for most engineers.","🟢 Reader — view only, no changes. Right for support teams, auditors, and finance."] },
      { type:"callout", label:"✅ Practical Assignment Pattern", text:"Developers → Contributor on their resource group only. Support → Reader on production. Only senior admins get Owner, reviewed quarterly." },
      { type:"h2", text:"Scope Is Everything" },
      { type:"p", text:"Assigning Contributor at subscription level = access to everything in the subscription. Assigning at resource group level = access to that group only. Always assign at the lowest scope that allows the person to do their job." },
    ]
  },
  {
    id:8, series:"security", level:"beginner", readTime:"5 min", date:"Feb 24, 2025", emoji:"🆔",
    title:"Managed Identities — No More Hardcoded Credentials",
    subtitle:"Stop storing secrets in config files. Azure handles auth for you.",
    excerpt:"Connection strings in config files. Secrets in plain text. Storage keys in repos. There's a better way and it's called Managed Identities.",
    quiz:[
      { q:"The main benefit of Managed Identities is:", options:["Cheaper compute","No credentials to manage","Faster network","Free storage"], answer:1 },
      { q:"System-Assigned Managed Identity is best when:", options:["Shared across many resources","One resource needs one identity","Running outside Azure","Used by GitHub Actions"], answer:1 },
      { q:"Which is the safest way for an Azure Function to access Key Vault?", options:["Client secret in app settings","Managed Identity + RBAC","Storage account key","Password in env variable"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Connection strings hardcoded in config files. Storage keys committed to repos. Client secrets in plain text. This still happens — and it's completely avoidable with Managed Identities." },
      { type:"h2", text:"What Managed Identities Do" },
      { type:"p", text:"Azure gives your resource its own identity in Entra ID. No credentials to store. No rotation schedule. No secrets to leak. Your app requests a token from the metadata endpoint — Azure handles everything else." },
      { type:"callout", label:"🔑 Real Example", text:"Azure Function needs Key Vault access. Old way: store client secret in app settings. New way: enable Managed Identity → assign Key Vault Secrets User role. Zero credentials anywhere." },
      { type:"compare", left:{ title:"System-Assigned", items:["Tied to one resource","Deleted with the resource","Simpler setup"] }, right:{ title:"User-Assigned", items:["Standalone resource","Shared across multiple resources","Survives resource deletion"] } },
    ]
  },
  {
    id:9, series:"security", level:"intermediate", readTime:"5 min", date:"Mar 3, 2025", emoji:"🚦",
    title:"Conditional Access — MFA Alone Isn't Enough",
    subtitle:"Someone can pass MFA from a compromised device and Azure lets them in",
    excerpt:"MFA is table stakes. Conditional Access is the if/then engine that makes identity security real. Here's what to implement on day one.",
    quiz:[
      { q:"Legacy authentication protocols do what to MFA?", options:["Strengthen it","Bypass it entirely","Slow it down","Require it more often"], answer:1 },
      { q:"Conditional Access requires which minimum licence?", options:["Entra Free","Entra P1","Entra P2","Microsoft 365 Basic"], answer:1 },
      { q:"Which policy should be enabled immediately?", options:["Block all cloud apps","Block legacy authentication","Require VPN for all users","Disable MFA for admins"], answer:1 },
    ],
    content:[
      { type:"intro", text:"MFA is non-negotiable. But MFA alone has limits. Someone can complete MFA from a compromised device, in a country you've never operated in, at 3am — and Azure signs them in. Conditional Access is the answer." },
      { type:"h2", text:"How It Works" },
      { type:"p", text:"Conditional Access evaluates every sign-in against conditions and applies an action. IF admin role → always require MFA. IF unmanaged device → block. IF high-risk sign-in → block." },
      { type:"callout", label:"🚨 Do This First", text:"Block legacy authentication immediately. IMAP, POP3, SMTP — these protocols bypass MFA entirely. Very little modern software needs them." },
      { type:"h2", text:"Day One Policies" },
      { type:"list", items:["Require MFA for all users — no exceptions","Always require MFA for privileged roles","Block all legacy authentication protocols","Require compliant device for Azure Portal access"] },
    ]
  },
  {
    id:10, series:"security", level:"advanced", readTime:"5 min", date:"Mar 10, 2025", emoji:"⏱️",
    title:"PIM — Make Privileged Access Temporary",
    subtitle:"Permanent Global Admin is a 24/7 high-value target",
    excerpt:"PIM makes your most powerful access time-limited, approval-gated, and fully audited. Here's why it matters and how to configure it.",
    quiz:[
      { q:"In PIM, 'eligible' means:", options:["Always has the role","Must activate when needed","Role is blocked","Role costs extra"], answer:1 },
      { q:"PIM is available in:", options:["Entra ID Free","Entra ID P1","Entra ID P2","Microsoft 365 Basic"], answer:2 },
      { q:"When a PIM session expires, the role is:", options:["Kept active","Manually renewed by admin","Automatically removed","Just flagged"], answer:2 },
    ],
    content:[
      { type:"intro", text:"Every account with permanent Global Admin access is a target — 24 hours a day, 7 days a week. PIM changes this by making privileged access something you activate when needed, not something you always have." },
      { type:"h2", text:"How PIM Works" },
      { type:"list", items:["Users are eligible for a role — not permanently assigned","Activation requires MFA + written justification","Access granted for a defined window (e.g. 2 hours)","Access expires automatically — no manual cleanup needed"] },
      { type:"callout", label:"🛡️ The Security Win", text:"Even if an attacker compromises an admin account — they only have admin privileges during an active PIM session. Outside those windows: standard user. Blast radius reduced dramatically." },
      { type:"h2", text:"Where to Start" },
      { type:"list", items:["Convert Global Admin, Security Admin, Privileged Role Admin to eligible","Set 2–4 hour maximum activation window","Require approval for Global Admin activations","Review activation audit logs monthly"] },
    ]
  },
  {
    id:11, series:"security", level:"advanced", readTime:"6 min", date:"Mar 17, 2025", emoji:"🏛️",
    title:"Zero Trust — What It Really Means in Azure",
    subtitle:"Never trust, always verify — built from controls you already know",
    excerpt:"Zero Trust isn't a product you buy. It's an outcome of layering the right controls consistently. Here's the Azure engineer's view.",
    quiz:[
      { q:"What replaced the traditional network perimeter?", options:["Firewall","VPN","Identity","VLAN"], answer:2 },
      { q:"'Assume Breach' maps to which controls?", options:["RBAC + PIM","Private Endpoints + Firewall + Defender","MFA + Conditional Access","Tagging + Cost Management"], answer:1 },
      { q:"Zero Trust is:", options:["A product you buy","An outcome built from multiple controls","A Microsoft licence tier","A firewall configuration"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Zero Trust gets thrown around in every security conversation. Underneath the marketing is a genuinely useful philosophy — and as an Azure engineer, you're already building it." },
      { type:"h2", text:"Three Principles → Azure Controls" },
      { type:"list", items:["Verify Explicitly → Conditional Access + MFA. Every access request evaluated every time.","Use Least Privilege → RBAC + PIM + Managed Identities. Minimum access, minimum time.","Assume Breach → Private Endpoints + Azure Firewall + Defender for Cloud. Segment everything, monitor everything."] },
      { type:"callout", label:"💡 The Big Insight", text:"If you've been following this series — RBAC, Conditional Access, PIM, Private Endpoints, Managed Identities, network segmentation — you've been building Zero Trust the entire time." },
    ]
  },
  // ── ENTRA ID ────────────────────────────────────────────────────────────────
  {
    id:12, series:"entra", level:"beginner", readTime:"6 min", date:"Mar 24, 2025", emoji:"🪪",
    title:"Microsoft Entra ID — The Identity Foundation",
    subtitle:"More than just Azure AD with a new name",
    excerpt:"Every Azure resource authenticates through Entra ID. Here's what it actually is and why it's the most important service in your environment.",
    quiz:[
      { q:"The three pillars of Entra ID are:", options:["Compute, Storage, Network","Authentication, Authorization, Governance","Users, Groups, Devices","Licences, Roles, Policies"], answer:1 },
      { q:"PIM and Identity Protection require:", options:["Entra ID Free","Entra ID P1","Entra ID P2","Azure subscription only"], answer:2 },
      { q:"Conditional Access is available from:", options:["Entra ID Free","Entra ID P1","Entra ID P2 only","Azure subscription only"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Entra ID is the entire identity and access foundation of Azure. Every VM, app, pipeline, and user authenticates through it. Understanding it is non-optional for any Azure engineer." },
      { type:"h2", text:"Three Core Pillars" },
      { type:"list", items:["Authentication — who are you? Passwords, MFA, passwordless, SSO","Authorization — what can you access? RBAC, Conditional Access, app permissions","Governance — should you still have access? PIM, Access Reviews, Identity Protection"] },
      { type:"h2", text:"Licence Tiers" },
      { type:"list", items:["Free — basic auth, MFA, limited SSO. Included with Azure.","P1 — Conditional Access, SSPR, dynamic groups. In Microsoft 365 E3.","P2 — PIM, Identity Protection, Access Reviews. In Microsoft 365 E5."] },
      { type:"callout", label:"🔑 Key Insight", text:"Identity is the new perimeter. In a Zero Trust world, Entra ID is your primary security boundary — not the network firewall." },
    ]
  },
  {
    id:13, series:"entra", level:"intermediate", readTime:"4 min", date:"Mar 31, 2025", emoji:"🔑",
    title:"Service Principals vs Managed Identities",
    subtitle:"Both are app identities. But for completely different scenarios.",
    excerpt:"The wrong choice creates credential sprawl or maintenance burden. Here's the simple decision rule every Azure engineer needs.",
    quiz:[
      { q:"Managed Identities should be used when:", options:["App runs outside Azure","App runs inside Azure","You prefer managing credentials manually","Only for VMs"], answer:1 },
      { q:"Who manages Managed Identity credentials?", options:["You","Azure automatically","The developer","Microsoft Support"], answer:1 },
      { q:"A GitHub Actions pipeline accessing Azure should use:", options:["Managed Identity","Service Principal with federated credentials","Storage key","Username/password"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Both are non-human identities in Entra ID. Both can be granted RBAC roles. But they serve different purposes — and choosing the wrong one has real consequences." },
      { type:"compare", left:{ title:"🔑 Service Principal", items:["You create and manage credentials","Rotate secrets on a schedule","Use when running OUTSIDE Azure","GitHub Actions, external CI/CD tools"] }, right:{ title:"✨ Managed Identity", items:["Azure manages everything","No credentials, no rotation needed","Use when running INSIDE Azure","VMs, Functions, App Services, AKS"] } },
      { type:"callout", label:"📌 Simple Rule", text:"Inside Azure → Managed Identity. Outside Azure → Service Principal. Default to Managed Identity wherever possible. Less to manage, harder to misconfigure, no secrets to leak." },
    ]
  },
  {
    id:14, series:"entra", level:"advanced", readTime:"5 min", date:"Apr 7, 2025", emoji:"🔎",
    title:"Identity Protection — Catch Compromised Accounts Automatically",
    subtitle:"Login from London then Brazil 10 minutes later — Entra ID catches this",
    excerpt:"Identity Protection monitors every sign-in for risk signals and responds automatically. Here's what it detects and how to configure it.",
    quiz:[
      { q:"'Impossible travel' means:", options:["A policy violation","Sign-ins from two locations too far apart in too short a time","Failed MFA attempts","Blocked legacy auth"], answer:1 },
      { q:"Leaked credential data comes from:", options:["User reports","Dark web monitoring of third-party breaches","Azure audit logs","IT admin reports"], answer:1 },
      { q:"When user risk is high, the automated response should be:", options:["Block all access permanently","Require password reset on next sign-in","Send an email only","Log and ignore"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Even with MFA enabled, accounts get compromised — phishing, credential leaks, insider threats. Identity Protection monitors every sign-in for risk signals and acts automatically." },
      { type:"h2", text:"What It Detects" },
      { type:"list", items:["Impossible travel — London then Brazil in 10 minutes","Anonymous IP or Tor exit node sign-ins","Credentials found leaked on the dark web","Malware-linked IP addresses","Completely unfamiliar sign-in properties"] },
      { type:"h2", text:"Automated Responses" },
      { type:"list", items:["Medium sign-in risk → require MFA step-up","High sign-in risk → block access immediately","High user risk → require password reset before next sign-in"] },
      { type:"callout", label:"🌐 Why It Works", text:"Microsoft processes billions of sign-ins per day across Azure, M365, and Xbox. Identity Protection benefits from all of this threat intelligence automatically — at no extra configuration cost." },
    ]
  },
  {
    id:15, series:"entra", level:"advanced", readTime:"4 min", date:"Apr 14, 2025", emoji:"📋",
    title:"Access Reviews — Do You Know Who Still Has Access?",
    subtitle:"People change roles. Projects end. Access almost never gets cleaned up.",
    excerpt:"Access Reviews automate periodic certification of who has access and why — and automatically remove access when nobody can justify it.",
    quiz:[
      { q:"When auto-remove is enabled and a reviewer doesn't respond:", options:["Access stays active","Access is automatically removed","Admin must approve","Only a flag is raised"], answer:1 },
      { q:"Who is the best reviewer for application access?", options:["Security admin","Finance team","The application owner","HR department"], answer:2 },
      { q:"Access Reviews integrate directly with:", options:["NSGs","PIM","Azure Firewall","Cost Management"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Someone left your company 6 months ago. Do they still have access to your Azure environment? In most organisations — probably. Access accumulates silently. Reviews fix this systematically." },
      { type:"h2", text:"How Access Reviews Work" },
      { type:"list", items:["Schedule a review — monthly, quarterly, or annually","Reviewers get notified automatically with a list of access to certify","They approve (still needed) or deny (should be removed) each item","Denied access is removed automatically — no manual cleanup needed"] },
      { type:"callout", label:"⏱️ Time Investment", text:"20 minutes to configure. Quarterly review of privileged roles + annual review of group memberships. Continuous security value from almost no ongoing effort." },
    ]
  },
  // ── FINOPS ──────────────────────────────────────────────────────────────────
  {
    id:16, series:"finops", level:"beginner", readTime:"6 min", date:"Apr 21, 2025", emoji:"💸",
    title:"Where Azure Costs Silently Leak",
    subtitle:"Most cloud waste follows predictable patterns — here's where to look",
    excerpt:"I've seen Azure bills with thousands in waste nobody noticed. Not because the team wasn't careful — because nobody was looking in the right places.",
    quiz:[
      { q:"Orphaned resources are:", options:["Resources in the wrong region","Resources billing but not attached to anything active","Resources without tags","Resources in dev environment"], answer:1 },
      { q:"Auto-shutdown on a dev VM can reduce cost by approximately:", options:["10%","30%","73%","100%"], answer:2 },
      { q:"Azure Advisor is:", options:["A paid consultant service","Free and built into the Azure Portal","Only available with premium support","In Microsoft 365 Admin Center"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Azure bills you for everything you leave running. No warnings. No auto-shutoff. Just charges, month after month. Most waste follows predictable patterns — once you know where to look." },
      { type:"h2", text:"1. Orphaned Resources" },
      { type:"p", text:"Managed disks attached to deleted VMs. Public IPs assigned to deleted load balancers. Snapshots from migrations six months ago. All billing. All doing nothing." },
      { type:"h2", text:"2. VMs Running 24/7 When They Don't Need To" },
      { type:"callout", label:"⚡ Quick Win", text:"Enable auto-shutdown on dev and test VMs right now. 5 minutes of configuration. Running 8hrs/day instead of 24hrs saves ~73% of that VM's cost immediately." },
      { type:"h2", text:"3. Oversized VMs" },
      { type:"p", text:"Open Azure Advisor → Cost tab. It identifies VMs running at 5–15% CPU consistently and tells you exactly what to downsize to — with projected savings." },
      { type:"h2", text:"4. Pay-As-You-Go for Stable Workloads" },
      { type:"p", text:"Reservations and Savings Plans save 40–72% on compute you're running anyway. If a workload has been running for 3+ months, it's a strong reservation candidate." },
    ]
  },
  {
    id:17, series:"finops", level:"intermediate", readTime:"5 min", date:"Apr 28, 2025", emoji:"💰",
    title:"Reservations vs Savings Plans — Stop Paying List Price",
    subtitle:"Pay-as-you-go is the most expensive way to run Azure compute",
    excerpt:"Commitment-based pricing saves 40–72%. Here's how to choose between Reservations and Savings Plans and use each correctly.",
    quiz:[
      { q:"Azure Reservations commit you to:", options:["A specific resource for 1 or 3 years","A flexible hourly spend","A monthly subscription","A specific region only"], answer:0 },
      { q:"Savings Plans are more flexible because:", options:["They cost more","They apply across VM families and regions","They don't require commitment","They only work for storage"], answer:1 },
      { q:"Maximum discount with a 3-year VM reservation:", options:["10–20%","30–40%","Up to 72%","5% only"], answer:2 },
    ],
    content:[
      { type:"intro", text:"Pay-as-you-go is convenient. It's also the most expensive option. If you have workloads running continuously — and most production workloads do — you're significantly overpaying." },
      { type:"compare", left:{ title:"📌 Reservations", items:["Commit to specific resource + region","1 or 3 year term","Up to 72% discount","Best for stable predictable workloads","Can exchange if needs change"] }, right:{ title:"📊 Savings Plans", items:["Commit to hourly spend amount","1 or 3 year term","Up to 65% discount","Flexible across regions and VM families","Good for variable compute patterns"] } },
      { type:"callout", label:"📍 How to Start", text:"Open Azure Cost Management → Reservation Recommendations. It analyses your last 30 days and tells you exactly what to reserve and the projected monthly savings." },
    ]
  },
  {
    id:18, series:"finops", level:"beginner", readTime:"4 min", date:"May 5, 2025", emoji:"🔭",
    title:"Azure Advisor — Your Free Built-In Cost Consultant",
    subtitle:"It's already running against your environment. Most people never open it.",
    excerpt:"Azure Advisor continuously analyses your environment and gives specific, actionable cost and security recommendations — for free, forever.",
    quiz:[
      { q:"Azure Advisor costs:", options:["£50/month","£10/month","Nothing — it's free and built in","Part of a support plan"], answer:2 },
      { q:"Which Advisor category identifies underutilised VMs?", options:["Reliability","Performance","Cost","Operational Excellence"], answer:2 },
      { q:"How often should you review Azure Advisor?", options:["Once a year","Only when bills spike","Monthly as a routine","Never — it's automatic"], answer:2 },
    ],
    content:[
      { type:"intro", text:"Azure Advisor is free, built in, already running against your environment right now — and most engineers never open it. That's a significant missed opportunity." },
      { type:"h2", text:"Five Recommendation Categories" },
      { type:"list", items:["💰 Cost — underutilised VMs, reservation opportunities, idle resources","🛡️ Security — open ports, missing MFA, weak configurations (from Defender for Cloud)","⚡ Performance — resources approaching limits, throughput improvements","🔁 Reliability — single points of failure, missing backups, availability zone gaps","✅ Operational Excellence — tagging gaps, deprecated APIs, Well-Architected alignment"] },
      { type:"callout", label:"📅 My Monthly Routine", text:"First week of every month: open Advisor, filter by Cost, work through every medium and high impact recommendation. Then check Security for critical findings. Takes 30–60 minutes. Consistently saves real money." },
    ]
  },
  {
    id:19, series:"finops", level:"intermediate", readTime:"5 min", date:"May 12, 2025", emoji:"🏷️",
    title:"Tagging Strategy — The Foundation of Cost Accountability",
    subtitle:"Without tags, nobody knows who owns the bill",
    excerpt:"A proper tagging taxonomy makes every team accountable for their Azure spend — and enforcement via Azure Policy makes it actually stick.",
    quiz:[
      { q:"Which Azure Policy effect prevents untagged deployments?", options:["Audit","Modify","Deny","Append"], answer:2 },
      { q:"Which tag helps finance allocate costs to departments?", options:["Environment","CostCentre","CreatedBy","Owner"], answer:1 },
      { q:"The Modify policy effect:", options:["Deletes untagged resources","Automatically adds or changes properties like tags","Blocks deployment","Sends an alert only"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Without a tagging strategy, a surprise Azure bill triggers a guessing game. Nobody knows what belongs to whom. With proper tags, every team owns their spend — and you can prove it." },
      { type:"h2", text:"Five Essential Tags" },
      { type:"list", items:["Environment — prod / dev / staging (enforce casing consistency)","Owner — team or person responsible for the resource","CostCentre — finance code for chargeback and allocation","Project — product or initiative name for project-level reporting","CreatedBy — who deployed it (useful for cleanup conversations)"] },
      { type:"callout", label:"⚙️ Enforcement Is Everything", text:"Use Azure Policy with Deny effect to block deployment of any resource missing required tags. Guidance and training alone don't work consistently — automated enforcement does." },
    ]
  },
  {
    id:20, series:"finops", level:"intermediate", readTime:"5 min", date:"May 19, 2025", emoji:"🤝",
    title:"FinOps — Cloud Cost Is Everyone's Responsibility",
    subtitle:"Engineering and Finance working together on cloud spend",
    excerpt:"FinOps is not a tool or a dedicated team. It's a culture where the people making spending decisions understand the cost of those decisions.",
    quiz:[
      { q:"FinOps stands for:", options:["Financial Operations","Finance + DevOps mindset applied to cloud","A Microsoft product","A cost management tool"], answer:1 },
      { q:"In a FinOps culture, cloud spend is owned by:", options:["Finance team only","IT only","Each team for their own resources","A dedicated FinOps team exclusively"], answer:2 },
      { q:"Cost reviews in FinOps happen:", options:["Once a year at budget time","Only after a bill spike","Monthly as an ongoing routine","Never — automation handles everything"], answer:2 },
    ],
    content:[
      { type:"intro", text:"Cloud cost management only works when the people making spending decisions — engineers — understand the cost of those decisions. That's the core insight of FinOps." },
      { type:"h2", text:"What Changes in Practice" },
      { type:"list", items:["Engineers see their team's actual spend — not a consolidated subscription bill","Budget alerts notify teams before the month closes, not after","Monthly cost reviews are engineering conversations, not finance interrogations","Cost optimisation wins are celebrated as good engineering practice"] },
      { type:"callout", label:"🚀 Three Things to Start Today", text:"1. Set up per-team budgets and alerts in Azure Cost Management. 2. Create cost dashboards per resource group or project tag. 3. Review your top 5 cost drivers together every month." },
    ]
  },
  // ── IAC ─────────────────────────────────────────────────────────────────────
  {
    id:21, series:"iac", level:"beginner", readTime:"6 min", date:"May 26, 2025", emoji:"⚙️",
    title:"Why Infrastructure as Code Changes Everything",
    subtitle:"Stop clicking in the Azure Portal. Write code instead.",
    excerpt:"My first Azure environment was built entirely through the Portal. Then I had to rebuild it for a new project — and realised I couldn't remember half of what I'd clicked.",
    quiz:[
      { q:"The main benefit of IaC over Portal deployments is:", options:["Faster internet","Repeatable, version-controlled, reviewable infrastructure","Cheaper Azure pricing","Better UI"], answer:1 },
      { q:"Bicep is:", options:["A Terraform plugin","Azure-native IaC that compiles to ARM","A Python framework","An Azure CLI extension"], answer:1 },
      { q:"Terraform supports:", options:["Azure only","ARM Templates only","Multiple clouds — Azure, AWS, GCP","Azure DevOps only"], answer:2 },
    ],
    content:[
      { type:"intro", text:"I built my first Azure environment entirely through the Portal. Felt productive. Clicked through wizards. Configured dropdowns. Then I needed to replicate it for a new project — and couldn't remember half of what I'd configured. That's when I switched to IaC." },
      { type:"h2", text:"Why IaC Changes Everything" },
      { type:"list", items:["Repeatable — same code, same result, every single time","Version controlled — full Git history of every infrastructure change","Reviewable — team reviews infrastructure changes in a PR before deploy","Auditable — know exactly what changed, when, and why","Scalable — one template deploys to ten environments with one command"] },
      { type:"compare", left:{ title:"🔧 Bicep", items:["Azure-native, built by Microsoft","Always current with Azure features","Excellent VS Code tooling","Azure only — not multi-cloud"] }, right:{ title:"🌍 Terraform", items:["Multi-cloud — Azure, AWS, GCP","Massive community and module registry","Most in-demand IaC skill in the market","Slight lag on brand new Azure features"] } },
      { type:"callout", label:"💡 My Advice", text:"Azure only shop? Start with Bicep. Want transferable cloud-agnostic skills? Start with Terraform. Have time? Learn both — they complement each other well." },
    ]
  },
  {
    id:22, series:"iac", level:"intermediate", readTime:"5 min", date:"Jun 2, 2025", emoji:"💾",
    title:"Terraform State — What It Is and Why It Matters",
    subtitle:"State stored on your laptop is a disaster waiting to happen",
    excerpt:"Terraform state is the source of more production incidents than almost any other IaC concept. Here's the right way to manage it from day one.",
    quiz:[
      { q:"Terraform state tracks:", options:["Your Azure billing","What infrastructure Terraform has deployed","Your Git commits","Azure Policy compliance"], answer:1 },
      { q:"Where should Terraform state be stored in production?", options:["Local laptop","Azure Blob Storage with versioning","GitHub repository","Azure Key Vault"], answer:1 },
      { q:"State locking prevents:", options:["Billing issues","Two people running terraform apply simultaneously","Resource deletion","Policy violations"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Terraform state is Terraform's memory of what it has deployed. Store it locally on your laptop and you will eventually have a very bad day. Here's the right setup from day one." },
      { type:"h2", text:"What State Does" },
      { type:"p", text:"The state file maps your Terraform config to real Azure resources. Without it, Terraform doesn't know what exists. When two engineers run terraform apply with local state — one overwrites the other's view. Chaos follows." },
      { type:"callout", label:"☁️ Remote State Setup", text:"Store state in Azure Blob Storage. Enable versioning and soft delete. Configure state locking via blob leases — prevents concurrent applies automatically and reliably." },
      { type:"h2", text:"Setup Steps" },
      { type:"list", items:["Create a dedicated storage account for Terraform management only","Create a blob container called 'tfstate'","Add the azurerm backend block to your Terraform configuration","Run terraform init to initialise the remote backend"] },
    ]
  },
  {
    id:23, series:"iac", level:"intermediate", readTime:"5 min", date:"Jun 9, 2025", emoji:"🚀",
    title:"IaC Pipelines — Stop Deploying From Your Laptop",
    subtitle:"The moment more than one person deploys infrastructure, you need a pipeline",
    excerpt:"Local Terraform works solo. A pipeline makes infrastructure changes team-safe, auditable, and automated. Here's the right setup.",
    quiz:[
      { q:"'terraform plan' in a pipeline shows:", options:["Cost estimate only","What will change before actually applying","Terraform version","State file contents"], answer:1 },
      { q:"Which tools can run Azure IaC pipelines?", options:["Azure DevOps only","GitHub Actions only","Azure DevOps or GitHub Actions","Jenkins only"], answer:2 },
      { q:"Pipelines should authenticate to Azure using:", options:["Username and password","Storage key","Workload Identity Federation","SSH key"], answer:2 },
    ],
    content:[
      { type:"intro", text:"Running Terraform from your laptop is fine solo. The moment more than one person deploys shared infrastructure — you need a pipeline. No exceptions." },
      { type:"h2", text:"The Pipeline Flow" },
      { type:"list", items:["Developer raises a PR with infrastructure changes","Pipeline runs terraform plan — output posted as PR comment","Team reviews: what exactly will change in production?","PR approved → terraform apply runs automatically on merge","Infrastructure deployed. Change logged. Fully auditable."] },
      { type:"callout", label:"🔐 Authentication", text:"Use Workload Identity Federation or Managed Identity to authenticate the pipeline to Azure. Never store client secrets as plain pipeline variables." },
      { type:"h2", text:"Production Approval Gate" },
      { type:"p", text:"Add a manual approval step between plan and apply for production environments. Someone must explicitly approve before any production infrastructure change goes live." },
    ]
  },
  {
    id:24, series:"iac", level:"advanced", readTime:"5 min", date:"Jun 16, 2025", emoji:"🚧",
    title:"Azure Policy — Guardrails That Actually Work",
    subtitle:"Guidelines and training alone aren't enough. Policy enforcement is.",
    excerpt:"Azure Policy enforces your standards at deployment time. No tags, no deploy. Wrong region, no deploy. Here's how to build governance guardrails that stick.",
    quiz:[
      { q:"Which Policy effect blocks deployment entirely?", options:["Audit","Modify","Deny","Append"], answer:2 },
      { q:"A Policy Initiative is:", options:["A single policy rule","A collection of policies grouped for a governance objective","A budget alert","A compliance report"], answer:1 },
      { q:"Built-in Policy initiatives align to:", options:["Terraform modules","Regulatory frameworks like CIS, NIST, ISO 27001","Azure pricing tiers","VM size families"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Someone just deployed a VM in the wrong region, with no tags, with a public IP, oversized. Written guidelines didn't stop them. Azure Policy would have — automatically, at deployment time." },
      { type:"h2", text:"Three Policy Effects" },
      { type:"list", items:["🚫 Deny — blocks deployment completely. The resource simply cannot be created.","📋 Audit — allows deployment but flags non-compliance in the dashboard.","🔧 Modify — automatically adds or changes properties (like adding missing required tags)."] },
      { type:"h2", text:"High-Value Policies to Implement First" },
      { type:"list", items:["Deny resources without all required tags","Restrict deployments to approved Azure regions only","Require HTTPS on all storage accounts","Block public IP addresses on virtual machines","Enforce approved VM SKU families only"] },
      { type:"callout", label:"📦 Policy as Code", text:"Define policies in Bicep or Terraform. Deploy through pipelines. Treat governance rules as version-controlled infrastructure — not one-off portal configurations." },
    ]
  },
  {
    id:25, series:"iac", level:"advanced", readTime:"4 min", date:"Jun 23, 2025", emoji:"🗂️",
    title:"Bicep Modules — Reusable Infrastructure Building Blocks",
    subtitle:"Stop copy-pasting Bicep. Build a module library instead.",
    excerpt:"Bicep modules let you define infrastructure patterns once and reuse them across every project and environment. Here's how to build and share them.",
    quiz:[
      { q:"A Bicep module is:", options:["A separate Bicep file referenced from a parent template","A Terraform plugin","An Azure Marketplace item","An ARM parameter file"], answer:0 },
      { q:"Bicep modules can be shared via:", options:["GitHub only","Azure Blob Storage","Azure Container Registry Bicep Registry","Azure DevOps Artifacts only"], answer:2 },
      { q:"The main benefit of modules is:", options:["Faster Azure provisioning","Reusable, consistent, tested infrastructure patterns","Lower Azure costs","Auto-generated documentation"], answer:1 },
    ],
    content:[
      { type:"intro", text:"If you find yourself copy-pasting the same Bicep code across multiple projects — you need modules. Write a pattern once, test it once, reuse it everywhere with confidence." },
      { type:"h2", text:"What Modules Do" },
      { type:"p", text:"A Bicep module is a separate .bicep file that defines a specific infrastructure pattern. Your main template calls the module with parameters. The module handles all the implementation details." },
      { type:"h2", text:"How to Share Modules Across Teams" },
      { type:"list", items:["Local path — reference modules within the same repository","Azure Container Registry — publish to a private Bicep registry for your organisation","Public Bicep Registry — community-maintained modules at aka.ms/bicep"] },
      { type:"callout", label:"🏗️ Start Small", text:"Begin by modularising your 3–5 most-reused patterns: VNet with standard subnets, Storage Account with Private Endpoint, Key Vault with standard access policies. Your deployment templates become dramatically simpler." },
    ]
  },
  // ── AZURE AI ─────────────────────────────────────────────────────────────────
  {
    id:26, series:"ai", level:"beginner", readTime:"5 min", date:"Jun 30, 2025", emoji:"🤖",
    title:"Azure AI — What's Actually Available Right Now",
    subtitle:"A practical map of the entire Azure AI service family",
    excerpt:"Azure AI is a whole family of services — not just one thing. Here's the practical map every Azure engineer needs before touching any of it.",
    quiz:[
      { q:"Which service is the backbone of most RAG architectures?", options:["Azure OpenAI","Azure AI Search","Azure Machine Learning","Azure Functions"], answer:1 },
      { q:"Azure AI Document Intelligence is used for:", options:["Generating images","Extracting structured data from documents","Text to speech","Training ML models from scratch"], answer:1 },
      { q:"Are Azure AI services production-ready today?", options:["No — still experimental","Yes — in real enterprise workloads now","Only in US regions","Only for Microsoft internal use"], answer:1 },
    ],
    content:[
      { type:"intro", text:"When people say 'Azure AI' they're pointing at a whole service family. Understanding what exists — and what each service is actually good for — is the prerequisite for using any of it well." },
      { type:"h2", text:"The Azure AI Service Map" },
      { type:"list", items:["🤖 Azure OpenAI — GPT-4, GPT-4o, DALL-E, embeddings. Enterprise-grade, private, compliant.","🔍 Azure AI Search — intelligent search with vector and semantic ranking. Backbone of RAG architectures.","📄 Azure AI Document Intelligence — extract structured data from forms, invoices, and receipts.","👁️ Azure AI Vision — image analysis, OCR, object detection, face detection.","🗣️ Azure AI Speech — speech-to-text, text-to-speech, real-time transcription.","🌐 Azure AI Translator — 100+ languages, real-time translation in apps."] },
      { type:"callout", label:"💡 For Azure Engineers Specifically", text:"These are in production enterprise workloads right now. Knowing how to secure, network, and govern them with Private Endpoints, Managed Identities, and RBAC is becoming part of the standard Azure engineering job." },
    ]
  },
  {
    id:27, series:"ai", level:"beginner", readTime:"5 min", date:"Jul 7, 2025", emoji:"🏢",
    title:"Azure OpenAI vs ChatGPT — Why It Matters for Enterprise",
    subtitle:"Same models. Completely different security posture.",
    excerpt:"Same GPT-4 models. Completely different story for enterprise use. Here's why the distinction matters and when it's genuinely non-negotiable.",
    quiz:[
      { q:"Does Azure OpenAI use your data to train models?", options:["Yes by default","No — Microsoft commits to this in the service agreement","Only with opt-in","Only for GPT-3.5"], answer:1 },
      { q:"Azure OpenAI can be accessed via:", options:["Public internet only","Private Endpoints inside your VNet","VPN only","ExpressRoute only"], answer:1 },
      { q:"For healthcare data, the appropriate choice is:", options:["ChatGPT API (cheaper)","Azure OpenAI (compliant)","Either — same thing","Neither is suitable"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Same GPT-4 models. Completely different enterprise story. For personal projects — OpenAI's API is fine. For production workloads handling sensitive data — Azure OpenAI is the only responsible choice." },
      { type:"compare", left:{ title:"💬 OpenAI API", items:["Easy to access directly","Data may train models by default","Public internet endpoint only","No Entra ID authentication","No compliance certifications"] }, right:{ title:"🏢 Azure OpenAI", items:["Same GPT-4 and GPT-4o models","Data never trains models — guaranteed","Private Endpoint support in your VNet","Entra ID + RBAC for access control","GDPR, ISO 27001, SOC2, HIPAA compliant"] } },
      { type:"callout", label:"🏥 Who It Matters To", text:"Healthcare, legal, financial services, government — for these sectors, Azure OpenAI isn't a preference. It's a compliance requirement. Your data stays within your Azure tenant boundary." },
    ]
  },
  {
    id:28, series:"ai", level:"intermediate", readTime:"6 min", date:"Jul 14, 2025", emoji:"🧩",
    title:"RAG — The Architecture Behind Enterprise AI",
    subtitle:"GPT-4 doesn't know your internal documents. RAG fixes this.",
    excerpt:"Retrieval Augmented Generation is how most enterprise AI is actually built. Here's the architecture and how to build it properly on Azure.",
    quiz:[
      { q:"RAG solves the problem of:", options:["Slow API responses","LLMs not knowing your internal data","High token costs","Training custom ML models"], answer:1 },
      { q:"What converts documents into searchable vectors?", options:["Azure Functions","An embedding model","Azure Policy","Terraform"], answer:1 },
      { q:"Which Azure service stores the document index in RAG?", options:["Azure Blob Storage","Azure SQL Database","Azure AI Search","Azure Cosmos DB"], answer:2 },
    ],
    content:[
      { type:"intro", text:"RAG — Retrieval Augmented Generation — is how most enterprise AI chatbots and copilots actually work. Understanding it is increasingly part of the Azure engineering job." },
      { type:"h2", text:"The Problem RAG Solves" },
      { type:"p", text:"GPT-4 doesn't know your internal documents, policies, or proprietary data. Ask it about your company's procedures and it will either refuse or generate a plausible-sounding wrong answer." },
      { type:"h2", text:"How RAG Works" },
      { type:"list", items:["User asks a question in natural language","System searches your knowledge base for relevant documents","Most relevant documents retrieved and ranked","Passed to GPT-4 as context in the prompt","GPT-4 answers based on YOUR actual data — citations included"] },
      { type:"callout", label:"☁️ Azure RAG Stack", text:"Azure OpenAI → language model. Azure AI Search → retrieval (vector + hybrid). Azure Blob Storage → source documents. Azure App Service → orchestration layer tying it together." },
      { type:"h2", text:"Why Vector Search Changes Everything" },
      { type:"p", text:"Keyword search fails when phrasing differs. Vector search converts documents and queries into embeddings — mathematically similar vectors represent semantically similar content. 'Delete my account' matches 'account termination policy' with no keyword overlap whatsoever." },
    ]
  },
  {
    id:29, series:"ai", level:"intermediate", readTime:"4 min", date:"Jul 21, 2025", emoji:"💬",
    title:"Copilot for Azure — AI Built Into the Portal",
    subtitle:"Ask your Azure environment questions in plain English",
    excerpt:"Microsoft Copilot for Azure is embedded directly in the Azure Portal. Here's what it genuinely does well — and where its limits are.",
    quiz:[
      { q:"Where is Copilot for Azure accessed?", options:["Separate website","Azure CLI only","Directly inside the Azure Portal","Azure DevOps only"], answer:2 },
      { q:"Copilot for Azure can:", options:["Deploy resources autonomously","Generate CLI commands and explain errors in context","Replace Azure engineers","Access your billing data directly"], answer:1 },
      { q:"For the best Copilot responses, you should:", options:["Keep prompts vague","Be specific with context and resource names","Always use another language","Only ask yes/no questions"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Microsoft Copilot for Azure is embedded directly in the Azure Portal. It's context-aware — if you're viewing a specific VM, Copilot knows which one. Here's what it genuinely does well." },
      { type:"h2", text:"What It Does Well" },
      { type:"list", items:["Generate accurate Azure CLI and PowerShell commands from plain English descriptions","Explain error messages in plain language with specific suggested remediation steps","Break down cost drivers in Azure Cost Management with context about your environment","Explain the current configuration of any resource you're viewing","Walk through deploying a service step by step with best practices"] },
      { type:"callout", label:"⚠️ Important Limit", text:"Copilot for Azure is an accelerator — not a replacement for understanding. It generates CLI commands, but you need to understand what those commands do to verify they're correct." },
      { type:"h2", text:"Prompting Tips" },
      { type:"p", text:"Be specific. 'Help me with my VM' is too vague to get useful output. 'My VM prod-web-01 is at 95% CPU between 14:00–16:00 UTC daily — what should I investigate first?' gets a genuinely useful answer." },
    ]
  },
  {
    id:30, series:"ai", level:"advanced", readTime:"5 min", date:"Jul 28, 2025", emoji:"📈",
    title:"How AI Is Changing the Azure Engineer Role",
    subtitle:"Two years ago nobody asked about AI in Azure interviews. Now it's every time.",
    excerpt:"The role isn't changing dramatically — but a new layer is being added. Here's what organisations are actually asking for and how to build it.",
    quiz:[
      { q:"The new skill organisations are asking Azure engineers for is:", options:["Python programming","Infrastructure for AI workloads","Data science","Frontend development"], answer:1 },
      { q:"Securing Azure OpenAI uses:", options:["Completely new skills","The same Private Endpoint, Managed Identity, RBAC patterns you already know","Manual credential management","A separate security team"], answer:1 },
      { q:"The best starting point for Azure engineers adding AI skills is:", options:["Learn Python first","Deploy Azure OpenAI and build a simple RAG app","Get an AI certification before touching anything","Wait for AI to become more mainstream"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Two years ago nobody asked me about AI in Azure engineering interviews. Now it comes up in almost every conversation. The role is evolving — and the good news is, you're already most of the way there." },
      { type:"h2", text:"What Organisations Are Actually Asking For" },
      { type:"list", items:["Deploying and securing Azure OpenAI endpoints with Private Endpoints and Managed Identity","Building RAG architectures with Azure OpenAI and Azure AI Search","Managing token-based AI workload costs — different model from compute pricing","Applying Zero Trust governance to AI services — content filtering, audit logging, RBAC","Monitoring AI workloads — latency, token consumption, content filtering alerts"] },
      { type:"callout", label:"✅ The Good News", text:"Everything above is a variation on what you already know from this series. Securing Azure OpenAI = same Private Endpoint and Managed Identity skills. Managing AI costs = same Cost Management tooling. AI is just a new workload on the same proven foundation." },
      { type:"h2", text:"Where to Start Right Now" },
      { type:"p", text:"Deploy an Azure OpenAI resource in a test subscription. Put a Private Endpoint on it. Authenticate with a Managed Identity from an App Service. Integrate it with Azure AI Search. Build a simple RAG app. That's the pattern appearing in most enterprise AI projects today — and you now have everything you need to do it." },
    ]
  },

  // ── ENTRA ID ADVANCED ────────────────────────────────────────────────────────
  {
    id:31, series:"entraadv", level:"beginner", readTime:"6 min", date:"Aug 4, 2025", emoji:"🔮",
    title:"Single Sign-On — One Login, Every App",
    subtitle:"How SSO actually works and why your users will thank you",
    excerpt:"Your team logs into Salesforce, then Jira, then GitHub, then Azure Portal — separate passwords for each. SSO fixes this permanently. Here is how it works in Entra ID.",
    quiz:[
      { q:"What protocol does modern SSO in Entra ID primarily use?", options:["LDAP","SAML 2.0 and OpenID Connect","Kerberos only","RADIUS"], answer:1 },
      { q:"What is a Service Provider in SSO terminology?", options:["The identity system (Entra ID)","The application the user wants to access","The user's device","The network firewall"], answer:1 },
      { q:"Gallery apps in Entra ID are:", options:["Custom-built apps only","Pre-integrated apps with SSO already configured","Only Microsoft apps","Paid add-ons"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Your team logs into Salesforce separately, then Jira separately, then GitHub, then the Azure Portal — each with a different password. SSO eliminates this entirely. One login. Every app. And it is not just convenience — it is a security upgrade too." },
      { type:"h2", text:"How SSO Actually Works" },
      { type:"p", text:"When a user opens Salesforce, Salesforce redirects them to Entra ID. Entra ID verifies the identity — checking MFA, Conditional Access policies, device compliance. It then hands back a token. Salesforce accepts the token and lets the user in. The user never typed a Salesforce password. Ever." },
      { type:"compare", left:{ title:"SAML 2.0", items:["Older but widely supported","XML-based token exchange","Used by enterprise apps — Salesforce, ServiceNow","Browser redirect flow"] }, right:{ title:"OpenID Connect", items:["Modern, JSON-based","Built on OAuth 2.0","Used by cloud-native apps","Mobile and SPA friendly"] } },
      { type:"h2", text:"Gallery Apps vs Custom Apps" },
      { type:"list", items:["Gallery apps — thousands of pre-integrated apps like Salesforce, Zoom, Jira. SSO config is mostly automatic.", "Custom apps — your own internal apps. You configure the SAML or OIDC details manually.", "On-premises apps — legacy apps via Entra Application Proxy. No VPN required."] },
      { type:"callout", label:"Security Win", text:"With SSO, users have fewer passwords to remember — so they stop writing them on sticky notes. Every authentication goes through Entra ID, so your Conditional Access and MFA policies apply to every app automatically." },
      { type:"h2", text:"Where to Start" },
      { type:"list", items:["Open Entra ID → Enterprise Applications → New Application","Search the gallery for your app — Salesforce, Zoom, GitHub","Follow the guided SSO setup wizard — usually under 20 minutes","Assign users or groups to the app","Test with a pilot user before rolling out"] },
    ]
  },
  {
    id:32, series:"entraadv", level:"beginner", readTime:"5 min", date:"Aug 11, 2025", emoji:"🤝",
    title:"Azure AD B2B — Collaborate Without Creating Accounts",
    subtitle:"Give partners and contractors access without managing their identities",
    excerpt:"A contractor needs access to your Azure environment. You could create them a company account and manage it forever. Or you could use B2B and let them use their own identity.",
    quiz:[
      { q:"In B2B collaboration, who manages the guest's credentials?", options:["Your organisation","The guest's home organisation","Microsoft","A shared responsibility"], answer:1 },
      { q:"What is a B2B guest user's UPN format in your tenant?", options:["Normal company email","user_domain.com#EXT#@yourtenant.onmicrosoft.com","A random ID assigned by Azure","Their personal email unchanged"], answer:1 },
      { q:"Cross-tenant access settings control:", options:["VNet peering between tenants","What B2B guests can access and what MFA is required","Azure subscription billing","DNS resolution between tenants"], answer:1 },
    ],
    content:[
      { type:"intro", text:"A partner company needs access to your SharePoint. A contractor needs to deploy to your Azure subscription. You have two options — create accounts you will have to manage forever, or use B2B and let them use identities they already have." },
      { type:"h2", text:"How B2B Works" },
      { type:"p", text:"You invite an external user via their email. They receive a redemption link. When they click it, they authenticate with their own identity provider — their company's Entra ID, Google, or even a one-time passcode. They appear in your tenant as a guest. You control what they can access. They manage their own password." },
      { type:"callout", label:"Key Point", text:"You never own or manage their credentials. If they leave their company and lose their account, their access to your resources stops automatically — without you doing anything." },
      { type:"h2", text:"What You Control" },
      { type:"list", items:["Which apps and resources guests can access via RBAC roles","Whether guests must satisfy your Conditional Access policies","Whether guests need to re-authenticate with MFA even if their home tenant does not require it","Which external domains you allow or block via cross-tenant access settings","Regular Access Reviews to automatically remove guests who no longer need access"] },
      { type:"h2", text:"B2B vs Creating Internal Accounts" },
      { type:"compare", left:{ title:"B2B Guest", items:["They manage their own credentials","Access tied to their identity — auto-revoked if they leave","No password rotation burden on your team","Works with any identity provider"] }, right:{ title:"Internal Account", items:["You own and manage the account","Manual offboarding required","Password resets fall on your team","Only works with your directory"] } },
      { type:"callout", label:"Best Practice", text:"Always use B2B for external collaborators. Never create internal accounts for contractors or partners unless there is a genuine business requirement. The operational overhead and security risk are not worth it." },
    ]
  },
  {
    id:33, series:"entraadv", level:"intermediate", readTime:"6 min", date:"Aug 18, 2025", emoji:"🛒",
    title:"Azure AD B2C — Identity for Your Customers",
    subtitle:"B2B is for partners. B2C is for millions of customers.",
    excerpt:"Building a customer-facing app and need login, registration, password reset? Azure AD B2C handles all of it — and scales to hundreds of millions of users.",
    quiz:[
      { q:"What is the main difference between B2B and B2C?", options:["B2C is cheaper","B2B is for employees, B2C is for customer-facing apps","B2C uses different protocols","B2B requires P2 licence"], answer:1 },
      { q:"User flows in B2C define:", options:["Network routing rules","The sign-up, sign-in, and password reset experience","Billing configurations","Admin role assignments"], answer:1 },
      { q:"B2C supports social identity providers like:", options:["Only Microsoft accounts","Google, Facebook, Apple, and custom OIDC providers","Only enterprise IdPs","Only email and password"], answer:1 },
    ],
    content:[
      { type:"intro", text:"B2B is for your partners and contractors. B2C is a completely different product — it is an identity platform for the customers of applications you build. Think of a retail app, a healthcare portal, or a banking mobile app. B2C handles all the login, registration, and account management for your end users." },
      { type:"h2", text:"What B2C Provides" },
      { type:"list", items:["Customer registration and login flows — fully customisable to match your brand","Social login — Google, Facebook, Apple, Twitter, and custom OIDC providers","Multi-factor authentication for customers","Self-service password reset — customers reset their own passwords","Custom domain support — login.yourcompany.com instead of b2clogin.com","Scales to hundreds of millions of user accounts"] },
      { type:"h2", text:"User Flows vs Custom Policies" },
      { type:"compare", left:{ title:"User Flows", items:["Pre-built, configurable flows","Sign-up, sign-in, password reset, profile edit","Good for 90% of scenarios","Visual configuration in the portal"] }, right:{ title:"Custom Policies (IEF)", items:["XML-based deep customisation","Complex multi-step journeys","Claims transformation and enrichment","Required for very specific enterprise requirements"] } },
      { type:"callout", label:"Start Here", text:"Always start with User Flows. Custom Policies (Identity Experience Framework) are powerful but complex. Only move to them if User Flows genuinely cannot meet your requirement." },
      { type:"h2", text:"B2C is a Separate Tenant" },
      { type:"p", text:"This trips people up. Azure AD B2C lives in its own separate Entra ID tenant — not your corporate tenant. Your employees' identities and your customers' identities are completely isolated from each other. This is by design and a security requirement." },
    ]
  },
  {
    id:34, series:"entraadv", level:"intermediate", readTime:"5 min", date:"Aug 25, 2025", emoji:"🔗",
    title:"Hybrid Identity — Bridging On-Premises AD and Azure",
    subtitle:"Most enterprises have Active Directory on-premises. Here is how to connect it to the cloud.",
    excerpt:"Active Directory has been running on-premises for 20 years. Azure AD Connect bridges it to Entra ID so users get one identity everywhere.",
    quiz:[
      { q:"What tool synchronises on-premises Active Directory to Entra ID?", options:["Azure Site Recovery","Azure AD Connect / Cloud Sync","Azure Arc","Active Directory Federation Services alone"], answer:1 },
      { q:"Password Hash Sync means:", options:["Passwords are stored in Azure in plain text","A hash of the password hash is synced, enabling cloud authentication","Users must change passwords monthly","Passwords sync in real time via ADFS"], answer:1 },
      { q:"Seamless SSO allows on-premises joined machines to:", options:["Bypass MFA always","Sign into cloud apps without re-entering credentials","Access Azure resources without a licence","Disable Conditional Access"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Most enterprises I work with have Active Directory on-premises — sometimes running for 20 years with thousands of users and groups. The question is always the same: how do we connect this to Azure without breaking everything? That is hybrid identity." },
      { type:"h2", text:"Azure AD Connect — The Bridge" },
      { type:"p", text:"Azure AD Connect (now Azure AD Connect Cloud Sync for newer deployments) synchronises your on-premises AD users, groups, and attributes to Entra ID. Users get the same UPN in both places. One identity. Works on-premises and in the cloud." },
      { type:"h2", text:"Three Authentication Methods" },
      { type:"list", items:["Password Hash Sync — a hash of the password hash syncs to Entra ID. Cloud authentication. Simplest, most resilient. Microsoft's recommended option for most organisations.", "Pass-through Authentication — authentication requests forwarded to on-premises AD agents in real time. Password never leaves on-premises.", "Federation with ADFS — full federation. Complex, requires ADFS infrastructure. Only justified if you have specific claims requirements."] },
      { type:"callout", label:"Microsoft Recommendation", text:"Password Hash Sync is the recommended authentication method for most organisations. It provides cloud resilience — if your on-premises environment goes down, users can still authenticate to cloud apps." },
      { type:"h2", text:"Seamless SSO" },
      { type:"p", text:"Enable Seamless SSO alongside Password Hash Sync and users on domain-joined machines walk into cloud apps without typing credentials. Kerberos ticket from on-premises AD used to get an Entra ID token silently. Completely transparent to the user." },
    ]
  },
  {
    id:35, series:"entraadv", level:"intermediate", readTime:"5 min", date:"Sep 1, 2025", emoji:"📱",
    title:"App Registrations — How Apps Authenticate to Azure",
    subtitle:"Every app that calls an Azure API needs an identity. Here is how to set it up correctly.",
    excerpt:"App Registrations are how you give an application its own identity in Entra ID. Get this wrong and you end up with credential sprawl and security gaps.",
    quiz:[
      { q:"An App Registration creates which two objects?", options:["A VM and a managed disk","An Application object and a Service Principal","A user and a group","A subscription and a resource group"], answer:1 },
      { q:"The Application object exists in:", options:["Every tenant that uses the app","Only the home tenant where the app was registered","All Azure subscriptions","The resource group of the app"], answer:1 },
      { q:"Client secrets should be rotated:", options:["Never — they are permanent","Before they expire, on a regular schedule","Only when compromised","Every 10 years"], answer:1 },
    ],
    content:[
      { type:"intro", text:"Every application that needs to authenticate to Azure, call Microsoft Graph, or access any protected API needs an identity. That identity is created via an App Registration. Get the setup wrong and you end up with secrets expiring in production, or — worse — credentials committed to a repository." },
      { type:"h2", text:"What an App Registration Creates" },
      { type:"compare", left:{ title:"Application Object", items:["The global definition of the app","Lives in the home tenant only","Defines permissions, redirect URIs, branding","One per app, regardless of how many tenants use it"] }, right:{ title:"Service Principal", items:["The local instance in each tenant","Created when app is added to a tenant","This is what gets RBAC roles assigned","Exists in every tenant where the app is used"] } },
      { type:"h2", text:"Client Secrets vs Certificates" },
      { type:"list", items:["Client secrets — simple strings, easy to set up, easy to leak. Expire — set reminders or use Azure Key Vault references.", "Certificates — private key never leaves your control. Much harder to accidentally expose. Preferred for production workloads.", "Federated credentials — for CI/CD pipelines like GitHub Actions. No secret at all — workload identity federation. Best option where supported."] },
      { type:"callout", label:"Never Do This", text:"Never store a client secret in source code, a config file, or a pipeline variable in plain text. Store secrets in Azure Key Vault and reference them at runtime. Treat them like passwords — because they are." },
      { type:"h2", text:"API Permissions: Delegated vs Application" },
      { type:"list", items:["Delegated permissions — app acts on behalf of a signed-in user. The user's permissions limit what the app can do.", "Application permissions — app acts as itself, with no user context. Background services and daemons. Requires admin consent.", "Always grant minimum required permissions. Never grant full Graph access when you only need User.Read."] },
    ]
  },
  {
    id:36, series:"entraadv", level:"intermediate", readTime:"5 min", date:"Sep 8, 2025", emoji:"🔑",
    title:"SSPR — Let Users Reset Their Own Passwords",
    subtitle:"Password reset calls are one of the most expensive IT support tickets. Eliminate them.",
    excerpt:"Password resets are the number one helpdesk ticket in most organisations. SSPR gives users a secure self-service option and cuts support costs overnight.",
    quiz:[
      { q:"What does SSPR stand for?", options:["Single Sign-On Password Recovery","Self-Service Password Reset","Secure System Password Rotation","Synced Service Principal Reset"], answer:1 },
      { q:"Which licence is required for SSPR?", options:["Entra ID Free","Entra ID P1","Entra ID P2 only","Microsoft 365 Basic only"], answer:1 },
      { q:"SSPR write-back allows:", options:["Passwords to sync from cloud to on-premises AD","Users to reset passwords on any device","SSPR to work without MFA","Admins to reset all passwords in bulk"], answer:0 },
    ],
    content:[
      { type:"intro", text:"Password reset is consistently the most common helpdesk ticket in organisations. Users forget passwords. They get locked out. They call IT. IT resets the password. This costs real money per ticket and frustrates everyone involved. SSPR eliminates the whole cycle." },
      { type:"h2", text:"How SSPR Works" },
      { type:"list", items:["User goes to aka.ms/sspr or clicks Forgot Password on the login page","They verify their identity using pre-registered methods — authenticator app, phone, email, security questions","After passing verification, they set a new password","For hybrid environments with SSPR write-back enabled, the password syncs back to on-premises AD within seconds"] },
      { type:"h2", text:"Authentication Methods for SSPR" },
      { type:"list", items:["Microsoft Authenticator app — most secure, recommended","Mobile phone (SMS or voice call) — convenient, widely supported","Alternate email address — simple but slightly weaker","Security questions — legacy option, weakest — avoid where possible"] },
      { type:"callout", label:"Require Two Methods", text:"Configure SSPR to require two verification methods. One method alone is vulnerable to SIM swap attacks or a compromised secondary email. Two methods adds meaningful resistance." },
      { type:"h2", text:"SSPR Write-Back for Hybrid Environments" },
      { type:"p", text:"If you have on-premises Active Directory synced via Azure AD Connect, enable SSPR write-back. When a user resets their password in the cloud, it writes back to on-premises AD in real time. Without this, users reset their cloud password but still cannot log into their on-premises workstation." },
      { type:"callout", label:"ROI", text:"A single helpdesk password reset typically costs between £10 and £30 in staff time when fully loaded. An organisation of 500 users might handle 50-100 password resets per month. SSPR typically pays for the P1 licence within the first quarter." },
    ]
  },
  {
    id:37, series:"entraadv", level:"advanced", readTime:"6 min", date:"Sep 15, 2025", emoji:"🚫",
    title:"Passwordless Authentication — The Future Is Already Here",
    subtitle:"Passwords are the weakest link. Entra ID lets you eliminate them entirely.",
    excerpt:"Phishing works because passwords can be stolen. Passwordless authentication removes the password from the equation entirely — and it is available in Entra ID right now.",
    quiz:[
      { q:"Which passwordless method uses biometrics or a PIN tied to a specific device?", options:["SMS OTP","FIDO2 security key","Windows Hello for Business","Microsoft Authenticator phone sign-in"], answer:2 },
      { q:"Why is passwordless more phishing-resistant than MFA with SMS?", options:["It is cheaper","The credential is cryptographically bound to the specific website — it cannot be replayed elsewhere","It requires a physical device","It does not use the internet"], answer:1 },
      { q:"FIDO2 security keys are best suited for:", options:["Users without smartphones","All users in all scenarios","Only administrators","Only Windows devices"], answer:0 },
    ],
    content:[
      { type:"intro", text:"Phishing works because passwords can be stolen and replayed. Adversary-in-the-middle attacks intercept MFA codes. The only way to be truly resistant to these attacks is to remove the password entirely. Passwordless authentication is not a future concept — it is fully available in Entra ID today." },
      { type:"h2", text:"Three Passwordless Options in Entra ID" },
      { type:"list", items:["Windows Hello for Business — biometric or PIN login on Windows devices. Credential is cryptographically bound to the device. Cannot be phished — the private key never leaves the device.", "Microsoft Authenticator — number matching and app approval instead of a password. Phone becomes the authentication factor.", "FIDO2 security keys — physical hardware keys (YubiKey, etc.). Touch the key to authenticate. Strongest phishing resistance. Best for shared workstations or users without smartphones."] },
      { type:"h2", text:"Why Passwordless is More Secure Than MFA" },
      { type:"p", text:"Standard MFA with a one-time code can be phished. An attacker creates a fake login page, you enter your password and MFA code, the attacker captures both and replays them in real time. Passwordless credentials are cryptographically bound to the specific origin — they physically cannot be used on a different website." },
      { type:"callout", label:"Phishing Resistance", text:"FIDO2 and Windows Hello for Business are classified as phishing-resistant MFA by CISA and NCSC. For privileged admin accounts especially, passwordless should be the target authentication method." },
      { type:"h2", text:"Rollout Strategy" },
      { type:"list", items:["Start with IT and security teams — lower risk, faster feedback","Deploy Microsoft Authenticator passwordless for most users — lowest friction","Use FIDO2 keys for admin accounts, shared workstations, and users without smartphones","Use Conditional Access to require phishing-resistant MFA for privileged roles and sensitive apps"] },
    ]
  },
  {
    id:38, series:"entraadv", level:"advanced", readTime:"5 min", date:"Sep 22, 2025", emoji:"🗺️",
    title:"Entra ID Governance — The Full Picture",
    subtitle:"Identity governance is how you ensure the right people have the right access for the right time",
    excerpt:"You have Conditional Access, PIM, and Access Reviews. But how do they fit together into a complete identity governance strategy? Here is the full picture.",
    quiz:[
      { q:"Entitlement Management in Entra ID Governance is used for:", options:["Billing management","Managing access packages — bundled access to resources that users can request","Device enrolment","Application deployment"], answer:1 },
      { q:"What is the Entra ID Governance lifecycle scope?", options:["Only joiners","Joiners and movers only","Joiners, movers, and leavers","Only leavers and terminated users"], answer:2 },
      { q:"Lifecycle Workflows automate:", options:["VM deployments","Tasks tied to employee HR events — onboarding, role changes, offboarding","Network configuration","Cost management"], answer:1 },
    ],
    content:[
      { type:"intro", text:"You have read about PIM, Access Reviews, and Conditional Access across this series. Entra ID Governance brings all of this together into a complete framework for ensuring the right people have the right access — and critically, that they lose it when they no longer need it." },
      { type:"h2", text:"The Three Governance Problems" },
      { type:"list", items:["Too much access — users accumulate permissions over time. Role changes, project endings, promotions — access is rarely cleaned up automatically.", "Access is permanent — standing access means anyone who compromises an account has immediate high-privilege access.", "No visibility — nobody knows who has access to what, when it was granted, or whether it is still needed."] },
      { type:"h2", text:"The Entra ID Governance Toolset" },
      { type:"list", items:["Access Reviews — periodic certification of who has access and whether they still need it. Automatic removal when nobody can justify it.", "Privileged Identity Management (PIM) — make privileged access time-limited and approval-gated.", "Entitlement Management — access packages that bundle resources. Users request access. Approvers approve. Access expires automatically.", "Lifecycle Workflows — automate tasks tied to HR events. New joiner: provision accounts and send welcome email. Leaver: disable account and remove access within hours."] },
      { type:"callout", label:"The Joiner-Mover-Leaver Framework", text:"Good identity governance covers the full employee lifecycle. Joiners get the right access from day one. Movers have access updated when they change roles. Leavers have all access removed — automatically, on their last day, before anyone manually does anything." },
      { type:"h2", text:"Where to Start" },
      { type:"list", items:["Implement Access Reviews for privileged roles first — high impact, lower complexity","Enable PIM for Global Admin, Security Admin, and Privileged Role Admin","Set up Lifecycle Workflows for offboarding — automatic account disable on termination date","Build an access package for your most-requested resource bundles"] },
      { type:"callout", label:"The Goal", text:"A mature identity governance posture means: no permanent privileged access, no orphaned accounts, no unknown access grants, and automated response to every HR lifecycle event. You do not need to achieve this overnight — but every control you add reduces real risk." },
    ]
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getSeriesInfo   = (id) => SERIES.find(s => s.id === id);
const getPostsBySeries = (sid) => POSTS.filter(p => p.series === sid).sort((a,b)=>a.id-b.id);
const getNextPost = (post) => {
  const sp = getPostsBySeries(post.series);
  const idx = sp.findIndex(p=>p.id===post.id);
  if (idx < sp.length-1) return sp[idx+1];
  const ns = SERIES.find(s=>s.order===getSeriesInfo(post.series).order+1);
  return ns ? getPostsBySeries(ns.id)[0] : null;
};

// ─── MICRO COMPONENTS ────────────────────────────────────────────────────────
function LevelBadge({ level, small }) {
  const l = LEVELS[level];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding: small?"2px 8px":"3px 10px", borderRadius:100, fontSize:small?10:11, fontWeight:700, background:l.bg+"44", color:l.color, border:`1px solid ${l.bg}88`, fontFamily:"monospace", letterSpacing:"0.5px" }}>
      {l.icon} {l.label}
    </span>
  );
}

function SeriesBadge({ series, small }) {
  const s = getSeriesInfo(series);
  if (!s) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:small?"2px 8px":"3px 10px", borderRadius:100, fontSize:small?10:11, fontWeight:700, background:s.color+"22", color:s.color, border:`1px solid ${s.color}44`, fontFamily:"monospace" }}>
      {s.icon} {s.label}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, height:3, zIndex:9999, background:"#1e2937" }}>
      <div style={{ height:"100%", width:`${value}%`, background:"linear-gradient(90deg,#38bdf8,#a78bfa)", transition:"width 0.1s" }} />
    </div>
  );
}

// ─── QUIZ COMPONENT ──────────────────────────────────────────────────────────
function Quiz({ questions, onDone }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? questions.filter((q,i)=>answers[i]===q.answer).length : 0;
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div style={{ background:"#0a1020", border:"1px solid #1e3a5f", borderRadius:16, padding:28, marginTop:44 }}>
      <div style={{ fontFamily:"monospace", fontSize:11, color:G.accent, letterSpacing:2, marginBottom:4, textTransform:"uppercase" }}>📝 Quick Check</div>
      <div style={{ fontSize:13, color:G.muted, marginBottom:24, fontFamily:"Georgia,serif" }}>Test your understanding before moving on.</div>
      {questions.map((q, qi) => (
        <div key={qi} style={{ marginBottom:28 }}>
          <div style={{ fontSize:15, fontWeight:600, color:G.text, marginBottom:12, lineHeight:1.5 }}>{qi+1}. {q.q}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {q.options.map((opt, oi) => {
              const selected = answers[qi]===oi;
              const correct  = submitted && oi===q.answer;
              const wrong    = submitted && selected && oi!==q.answer;
              return (
                <button key={oi} onClick={()=>!submitted&&setAnswers(a=>({...a,[qi]:oi}))} style={{ textAlign:"left", padding:"10px 16px", borderRadius:10, fontSize:14, cursor:submitted?"default":"pointer", transition:"all 0.15s", fontFamily:"inherit", background:correct?"#052e16":wrong?"#2d0a0a":selected?"#0f2a4a":"#111827", border:`1px solid ${correct?"#22c55e":wrong?"#ef4444":selected?G.accent:"#1f2937"}`, color:correct?"#4ade80":wrong?"#f87171":selected?G.accent:G.muted }}>
                  {correct ? <span>{"✅ "}</span> : wrong ? <span>{"❌ "}</span> : null}{opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button onClick={()=>setSubmitted(true)} disabled={!allAnswered} style={{ padding:"11px 28px", borderRadius:10, border:"none", cursor:allAnswered?"pointer":"not-allowed", background:allAnswered?G.accent:"#1f2937", color:allAnswered?"#000":G.muted, fontWeight:700, fontSize:14, fontFamily:"inherit", transition:"all 0.2s" }}>
          Submit Answers
        </button>
      ) : (
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <div style={{ fontSize:18, fontWeight:800, color:score===questions.length?"#4ade80":score>=questions.length/2?G.accent:"#f87171", fontFamily:"monospace" }}>
            {score}/{questions.length} {score===questions.length ? "Perfect!" : score>=questions.length/2 ? "Good job!" : "Review the article"}
          </div>
          <button onClick={onDone} style={{ padding:"10px 24px", borderRadius:10, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#38bdf8,#818cf8)", color:"#000", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ARTICLE CONTENT BLOCK ───────────────────────────────────────────────────
function Block({ b }) {
  switch(b.type) {
    case "intro":   return <p style={{ fontSize:18, lineHeight:1.9, color:"#94a3b8", fontFamily:"Georgia,serif", fontStyle:"italic", borderLeft:`3px solid ${G.accent}`, paddingLeft:20, marginBottom:28 }}>{b.text}</p>;
    case "h2":      return <h2 style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:800, color:G.text, margin:"44px 0 16px", paddingBottom:12, borderBottom:`1px solid ${G.border}` }}>{b.text}</h2>;
    case "p":       return <p style={{ fontSize:16, lineHeight:1.85, color:"#94a3b8", fontFamily:"Georgia,serif", marginBottom:20 }}>{b.text}</p>;
    case "callout": return (
      <div style={{ background:"#0a1929", border:`1px solid ${G.accent}44`, borderLeft:`4px solid ${G.accent}`, borderRadius:"0 12px 12px 0", padding:"20px 24px", margin:"32px 0" }}>
        <div style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, color:G.accent, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>{b.label}</div>
        <p style={{ fontSize:15, lineHeight:1.75, color:G.text, margin:0, fontFamily:"Georgia,serif" }}>{b.text}</p>
      </div>
    );
    case "list":    return (
      <ul style={{ padding:0, margin:"0 0 24px", listStyle:"none" }}>
        {b.items.map((item,i) => (
          <li key={i} style={{ display:"flex", gap:12, marginBottom:10, fontSize:15, color:"#94a3b8", fontFamily:"Georgia,serif", lineHeight:1.7 }}>
            <span style={{ color:G.accent, fontWeight:700, flexShrink:0 }}>→</span><span>{item}</span>
          </li>
        ))}
      </ul>
    );
    case "compare": return (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, margin:"28px 0" }}>
        {[b.left,b.right].map((side,i) => (
          <div key={i} style={{ background:G.surface2, border:`1px solid ${G.border}`, borderRadius:12, padding:"18px 20px" }}>
            <div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:14, color:G.text, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${G.border}` }}>{side.title}</div>
            <ul style={{ padding:0, margin:0, listStyle:"none" }}>
              {side.items.map((it,j) => (
                <li key={j} style={{ fontSize:13, color:G.muted, marginBottom:8, display:"flex", gap:8, fontFamily:"Georgia,serif", lineHeight:1.5 }}>
                  <span style={{ color:G.border, flexShrink:0 }}>•</span>{it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
    default: return null;
  }
}

// ─── POST CARD ───────────────────────────────────────────────────────────────
function PostCard({ post, onClick, compact }) {
  const [hov, setHov] = useState(false);
  const s = getSeriesInfo(post.series);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov?G.surface2:G.surface, border:`1px solid ${hov?s.color+"66":G.border}`, borderRadius:14, padding:compact?"14px 16px":"20px 22px", cursor:"pointer", transition:"all 0.2s", boxShadow:hov?`0 8px 32px ${s.color}18`:"none", transform:hov?"translateY(-2px)":"none" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:compact?6:10 }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <LevelBadge level={post.level} small />
        </div>
        <span style={{ fontFamily:"monospace", fontSize:10, color:G.muted, flexShrink:0 }}>⏱ {post.readTime}</span>
      </div>
      <div style={{ fontSize:compact?14:15, fontWeight:700, color:hov?G.text:"#cbd5e1", lineHeight:1.35, marginBottom:compact?0:8 }}>
        {post.emoji} {post.title}
      </div>
      {!compact && <div style={{ fontSize:13, color:G.muted, lineHeight:1.6, fontFamily:"Georgia,serif", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{post.excerpt}</div>}
      {!compact && <div style={{ marginTop:10, fontSize:12, fontWeight:700, color:s.color, fontFamily:"monospace" }}>Read → </div>}
    </div>
  );
}

// ─── ROADMAP VIEW ────────────────────────────────────────────────────────────
function RoadmapView({ onOpenPost }) {
  const [lvl, setLvl] = useState("all");
  const filteredSeries = SERIES.map(s => ({
    ...s, posts: getPostsBySeries(s.id).filter(p=>lvl==="all"||p.level===lvl)
  })).filter(s=>s.posts.length>0);

  return (
    <div>
      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#07090f 0%,#0d1f3c 60%,#07090f 100%)", padding:"72px 32px 56px", borderBottom:`1px solid ${G.border}`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:600, height:600, background:"#38bdf8", borderRadius:"50%", filter:"blur(160px)", opacity:0.04, top:-250, right:-150 }} />
        <div style={{ position:"absolute", width:400, height:400, background:"#a78bfa", borderRadius:"50%", filter:"blur(140px)", opacity:0.04, bottom:-150, left:-100 }} />
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.2)", borderRadius:100, padding:"6px 18px", fontFamily:"monospace", fontSize:11, color:G.accent, letterSpacing:2, marginBottom:24 }}>
            <span style={{ width:6, height:6, background:G.accent, borderRadius:"50%", display:"inline-block", animation:"blink 2s infinite" }} />
            AZURE ENGINEER · LEARNING PATH
          </div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(34px,6vw,66px)", fontWeight:900, color:"#f1f5f9", lineHeight:1.05, letterSpacing:"-2px", marginBottom:18 }}>
            Go from Zero to<br /><em style={{ color:G.accent }}>Cloud Engineer.</em>
          </h1>
          <p style={{ fontSize:17, color:G.muted, maxWidth:520, margin:"0 auto 36px", lineHeight:1.8, fontFamily:"Georgia,serif" }}>
            A structured learning path with 30 articles across 6 series. Know exactly where to start, what to read next, and test yourself after every article.
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:36, flexWrap:"wrap" }}>
            {[["30","Articles"],["6","Series"],["3","Skill Levels"]].map(([n,l])=>(
              <div key={l} style={{ borderLeft:`2px solid ${G.accent}`, paddingLeft:16, textAlign:"left" }}>
                <div style={{ fontFamily:"Georgia,serif", fontSize:30, fontWeight:900, color:"#f1f5f9", lineHeight:1 }}>{n}</div>
                <div style={{ fontSize:11, color:G.muted, fontFamily:"monospace", letterSpacing:1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start here banner */}
      <div style={{ background:"linear-gradient(90deg,#0a2540,#0f3460)", borderBottom:`1px solid ${G.border}`, padding:"18px 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <div style={{ fontSize:26 }}>👋</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, color:"#f1f5f9", fontSize:15, marginBottom:3 }}>New to Azure? Start here.</div>
            <div style={{ fontSize:13, color:G.muted, fontFamily:"Georgia,serif" }}>Begin with Networking Series → Beginner articles. Each article ends with a quiz — complete it before moving on.</div>
          </div>
          <button onClick={()=>onOpenPost(POSTS[0])} style={{ padding:"10px 22px", borderRadius:10, border:"none", cursor:"pointer", background:G.accent, color:"#000", fontWeight:700, fontSize:14, fontFamily:"inherit", whiteSpace:"nowrap" }}>
            Start Learning →
          </button>
        </div>
      </div>

      {/* Level filter */}
      <div style={{ background:G.surface, borderBottom:`1px solid ${G.border}`, padding:"18px 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontFamily:"monospace", fontSize:11, color:G.muted, letterSpacing:1 }}>SKILL LEVEL:</span>
          {[{id:"all",label:"All Levels",icon:"🌟",color:G.accent},...Object.entries(LEVELS).map(([id,v])=>({id,...v}))].map(l=>(
            <button key={l.id} onClick={()=>setLvl(l.id)} style={{ padding:"7px 16px", borderRadius:100, border:`1px solid ${lvl===l.id?l.color:G.border}`, background:lvl===l.id?l.color+"22":"transparent", color:lvl===l.id?l.color:G.muted, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"monospace", transition:"all 0.2s" }}>
              {l.icon} {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Series */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 32px 80px" }}>
        {filteredSeries.map((series)=>(
          <div key={series.id} style={{ marginBottom:52 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:series.color+"22", border:`1px solid ${series.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{series.icon}</div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontFamily:"monospace", fontSize:10, color:G.muted, letterSpacing:1 }}>SERIES {series.order}</span>
                  <span style={{ color:G.border }}>·</span>
                  <span style={{ fontFamily:"monospace", fontSize:10, color:G.muted }}>{series.posts.length} articles</span>
                </div>
                <h2 style={{ fontFamily:"Georgia,serif", fontWeight:800, fontSize:20, color:"#f1f5f9", marginTop:2 }}>
                  <span style={{ color:series.color }}>{series.icon}</span> {series.label}
                </h2>
                <div style={{ fontSize:12, color:G.muted, fontFamily:"Georgia,serif", marginTop:2 }}>{series.desc}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14, paddingLeft:58 }}>
              {series.posts.map((post,pi)=>(
                <div key={post.id} style={{ position:"relative" }}>
                  <div style={{ position:"absolute", top:-8, left:-8, width:24, height:24, borderRadius:"50%", background:G.bg, border:`2px solid ${series.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", fontSize:9, fontWeight:700, color:series.color, zIndex:1 }}>{pi+1}</div>
                  <PostCard post={post} onClick={()=>onOpenPost(post)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ARTICLE VIEW ────────────────────────────────────────────────────────────
function ArticleView({ post, onBack, onOpenPost }) {
  const [progress, setProgress] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const series    = getSeriesInfo(post.series);
  const nextPost  = getNextPost(post);
  const seriesPosts = getPostsBySeries(post.series);
  const postIdx   = seriesPosts.findIndex(p=>p.id===post.id);

  useEffect(()=>{ window.scrollTo({top:0,behavior:"smooth"}); setQuizDone(false); },[post.id]);
  useEffect(()=>{
    const fn = ()=>{ const el=document.documentElement; setProgress(el.scrollHeight>el.clientHeight?Math.min(100,(el.scrollTop/(el.scrollHeight-el.clientHeight))*100):0); };
    window.addEventListener("scroll",fn); return ()=>window.removeEventListener("scroll",fn);
  },[]);

  return (
    <>
      <ProgressBar value={progress} />
      <div style={{ minHeight:"100vh", background:G.bg }}>
        {/* Sticky bar */}
        <div style={{ background:G.surface, borderBottom:`1px solid ${G.border}`, padding:"12px 32px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", position:"sticky", top:0, zIndex:100 }}>
          <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:`1px solid ${G.border}`, borderRadius:100, padding:"7px 16px", fontSize:13, color:G.muted, cursor:"pointer", fontFamily:"monospace", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=G.accent;e.currentTarget.style.color=G.accent;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=G.border;e.currentTarget.style.color=G.muted;}}>
            ← Roadmap
          </button>
          <SeriesBadge series={post.series} small />
          <LevelBadge level={post.level} small />
          <div style={{ marginLeft:"auto", display:"flex", gap:5 }}>
            {seriesPosts.map((p,i)=>(
              <div key={p.id} onClick={()=>onOpenPost(p)} title={p.title}
                style={{ width:i===postIdx?18:7, height:7, borderRadius:100, background:i===postIdx?series.color:i<postIdx?series.color+"66":G.border, cursor:"pointer", transition:"all 0.2s" }} />
            ))}
          </div>
        </div>

        <article style={{ maxWidth:740, margin:"0 auto", padding:"52px 32px 80px" }}>
          <div style={{ fontSize:48, marginBottom:18, lineHeight:1 }}>{post.emoji}</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(26px,5vw,42px)", fontWeight:900, color:"#f1f5f9", lineHeight:1.1, letterSpacing:"-1px", marginBottom:12 }}>{post.title}</h1>
          <p style={{ fontSize:17, color:G.muted, fontFamily:"Georgia,serif", fontStyle:"italic", lineHeight:1.6, marginBottom:24 }}>{post.subtitle}</p>
          <div style={{ display:"flex", alignItems:"center", gap:16, paddingBottom:28, borderBottom:`1px solid ${G.border}`, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:G.surface2, border:`2px solid ${series.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>👨‍💻</div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:G.text }}>Azure Engineer</div>
                <div style={{ fontSize:11, color:G.muted, fontFamily:"monospace" }}>{post.date}</div>
              </div>
            </div>
            <span style={{ fontSize:12, color:G.muted, fontFamily:"monospace" }}>⏱ {post.readTime}</span>
            <span style={{ fontSize:12, color:G.muted, fontFamily:"monospace" }}>{postIdx+1} of {seriesPosts.length} in {series.label}</span>
          </div>

          <div style={{ marginTop:36 }}>
            {post.content.map((b,i)=><Block key={i} b={b} />)}
          </div>

          {/* Quiz */}
          {!quizDone ? (
            <Quiz questions={post.quiz} onDone={()=>setQuizDone(true)} />
          ) : (
            <div style={{ marginTop:36, padding:22, background:"#052e16", border:"1px solid #16a34a44", borderRadius:14, textAlign:"center" }}>
              <div style={{ fontSize:26, marginBottom:6 }}>✅</div>
              <div style={{ fontWeight:700, color:"#4ade80", fontSize:17, fontFamily:"Georgia,serif" }}>Quiz Complete!</div>
              <div style={{ fontSize:13, color:G.muted, fontFamily:"Georgia,serif", marginTop:4 }}>Ready to continue your learning path?</div>
            </div>
          )}

          {/* Next post */}
          {nextPost && quizDone && (
            <div style={{ marginTop:28, padding:26, background:G.surface, border:`1px solid ${series.color}44`, borderRadius:16 }}>
              <div style={{ fontFamily:"monospace", fontSize:10, color:series.color, letterSpacing:2, marginBottom:14, textTransform:"uppercase" }}>▶ Next in Your Learning Path</div>
              <div style={{ display:"flex", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ display:"flex", gap:8, marginBottom:8, flexWrap:"wrap" }}>
                    <SeriesBadge series={nextPost.series} small />
                    <LevelBadge level={nextPost.level} small />
                  </div>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:800, color:"#f1f5f9", marginBottom:6 }}>{nextPost.emoji} {nextPost.title}</div>
                  <div style={{ fontSize:13, color:G.muted, fontFamily:"Georgia,serif", lineHeight:1.6 }}>{nextPost.excerpt}</div>
                </div>
                <button onClick={()=>onOpenPost(nextPost)} style={{ padding:"12px 26px", borderRadius:12, border:"none", cursor:"pointer", background:`linear-gradient(135deg,${series.color},#a78bfa)`, color:"#000", fontWeight:800, fontSize:15, fontFamily:"inherit", whiteSpace:"nowrap", alignSelf:"center" }}>
                  Read Next →
                </button>
              </div>
            </div>
          )}

          {!nextPost && quizDone && (
            <div style={{ marginTop:28, padding:28, background:"#0a1929", border:`1px solid ${G.accent}44`, borderRadius:16, textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>🎉</div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:800, color:"#f1f5f9", marginBottom:6 }}>You've completed the entire learning path!</div>
              <div style={{ fontSize:13, color:G.muted, fontFamily:"Georgia,serif", marginBottom:18 }}>30 articles. 6 series. You're ready to apply this in the real world.</div>
              <button onClick={onBack} style={{ padding:"12px 28px", borderRadius:12, border:"none", cursor:"pointer", background:G.accent, color:"#000", fontWeight:800, fontSize:14, fontFamily:"inherit" }}>Back to Roadmap</button>
            </div>
          )}
        </article>
      </div>
    </>
  );
}

// ─── ALL POSTS VIEW ──────────────────────────────────────────────────────────
function AllPostsView({ onOpenPost }) {
  const [search, setSearch] = useState("");
  const [fs, setFs] = useState("all");
  const [fl, setFl] = useState("all");
  const filtered = POSTS.filter(p=>{
    const q=search.toLowerCase();
    return (fs==="all"||p.series===fs)&&(fl==="all"||p.level===fl)&&(!q||p.title.toLowerCase().includes(q)||p.excerpt.toLowerCase().includes(q));
  });

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 32px 80px" }}>
      <h2 style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:800, color:"#f1f5f9", marginBottom:24 }}>All 30 Articles</h2>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:28, paddingBottom:24, borderBottom:`1px solid ${G.border}` }}>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:G.muted, fontSize:13, pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search articles..."
            style={{ background:G.surface, border:`1px solid ${G.border}`, borderRadius:100, padding:"9px 16px 9px 34px", fontSize:13, color:G.text, outline:"none", fontFamily:"monospace", width:210 }}
            onFocus={e=>e.target.style.borderColor=G.accent} onBlur={e=>e.target.style.borderColor=G.border} />
        </div>
        <select value={fs} onChange={e=>setFs(e.target.value)} style={{ background:G.surface, border:`1px solid ${G.border}`, borderRadius:100, padding:"9px 16px", fontSize:12, color:G.muted, outline:"none", fontFamily:"monospace", cursor:"pointer" }}>
          <option value="all">All Series</option>
          {SERIES.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
        </select>
        <select value={fl} onChange={e=>setFl(e.target.value)} style={{ background:G.surface, border:`1px solid ${G.border}`, borderRadius:100, padding:"9px 16px", fontSize:12, color:G.muted, outline:"none", fontFamily:"monospace", cursor:"pointer" }}>
          <option value="all">All Levels</option>
          {Object.entries(LEVELS).map(([id,l])=><option key={id} value={id}>{l.icon} {l.label}</option>)}
        </select>
        <span style={{ fontFamily:"monospace", fontSize:11, color:G.muted, alignSelf:"center", marginLeft:"auto" }}>{filtered.length} articles</span>
      </div>
      {filtered.length===0 ? (
        <div style={{ textAlign:"center", padding:"60px 20px", color:G.muted }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:18, color:G.text, marginBottom:6 }}>No articles found</div>
          <div style={{ fontFamily:"Georgia,serif" }}>Try different search terms or filters</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:18 }}>
          {filtered.map((post,i)=>(
            <div key={post.id} style={{ animation:`fadeUp 0.35s ease ${i*0.04}s both` }}>
              <PostCard post={post} onClick={()=>onOpenPost(post)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]     = useState("roadmap");
  const [activePost, setAP] = useState(null);

  const openPost = (post) => { setAP(post); setView("article"); };
  const goHome   = ()     => { setAP(null); setView("roadmap"); };

  return (
    <div style={{ minHeight:"100vh", background:G.bg, color:G.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ background:G.surface, borderBottom:`1px solid ${G.border}`, height:60, display:"flex", alignItems:"center", padding:"0 32px", gap:20, position:"sticky", top:0, zIndex:99 }}>
        <div onClick={goHome} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#38bdf8,#818cf8)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", fontSize:12, fontWeight:700, color:"#000" }}>AE</div>
          <span style={{ fontFamily:"Georgia,serif", fontWeight:800, fontSize:17, color:"#f1f5f9" }}>Azure<span style={{ color:G.accent }}>Engineer</span></span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[{id:"roadmap",label:"🗺 Learning Path"},{id:"all",label:"📚 All Articles"}].map(tab=>(
            <button key={tab.id} onClick={()=>{setView(tab.id);setAP(null);}} style={{ padding:"7px 16px", borderRadius:100, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"monospace", transition:"all 0.2s", background:view===tab.id&&!activePost?G.accent+"22":"transparent", color:view===tab.id&&!activePost?G.accent:G.muted }}>
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          {Object.entries(LEVELS).map(([id,l])=>(
            <span key={id} style={{ fontFamily:"monospace", fontSize:10, color:l.color, background:l.bg+"33", padding:"3px 9px", borderRadius:100, border:`1px solid ${l.bg}55` }}>{l.icon} {l.label}</span>
          ))}
        </div>
      </nav>

      {view==="article"&&activePost ? (
        <ArticleView post={activePost} onBack={goHome} onOpenPost={openPost} />
      ) : view==="all" ? (
        <AllPostsView onOpenPost={openPost} />
      ) : (
        <RoadmapView onOpenPost={openPost} />
      )}

      {view!=="article" && (
        <footer style={{ background:G.surface, borderTop:`1px solid ${G.border}`, textAlign:"center", padding:"24px", fontFamily:"monospace", fontSize:12, color:G.muted }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:800, color:"#f1f5f9", marginBottom:6 }}>Azure<span style={{ color:G.accent }}>Engineer</span></div>
          30 articles · 6 series · 3 skill levels · Quizzes after every article
        </footer>
      )}

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        *{box-sizing:border-box;margin:0;padding:0;}
        @media(max-width:640px){
          nav{padding:0 16px!important;}
          article{padding:32px 18px 60px!important;}
          .hero{padding:48px 20px 40px!important;}
        }
      `}</style>
    </div>
  );
}
