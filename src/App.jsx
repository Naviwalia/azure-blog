import { useState, useEffect, useRef } from "react";

const POSTS = [
  {
    id: 1,
    slug: "vnet-design-azure",
    category: "Networking",
    categoryColor: "#2563eb",
    emoji: "🌐",
    title: "Your VNet Design Will Make or Break Your Azure Setup",
    subtitle: "Five rules I wish I knew before I deployed my first Azure network",
    excerpt: "I've seen teams spend weeks fixing a network they built in a day. Not because they were bad engineers — because they skipped the planning. Here's what actually matters.",
    readTime: "6 min read",
    date: "Jan 6, 2025",
    featured: true,
    content: [
      { type: "intro", text: "I've seen teams spend weeks fixing a network they built in a day. Not because they were bad engineers. Because they skipped the planning. And in Azure, the network is the one thing that's genuinely painful to redesign once you've deployed resources on top of it." },
      { type: "h2", text: "Rule 1 — Plan Your Address Space First" },
      { type: "p", text: "Before you create a single subnet, decide on your IP address ranges. This sounds obvious, but I've watched experienced engineers skip this and regret it later." },
      { type: "p", text: "The reason it matters: when you try to peer two VNets, Azure will flat-out refuse if the address spaces overlap. If you deploy Dev on 10.0.0.0/16 and Prod on 10.0.0.0/16, you can never peer them. Full stop." },
      { type: "callout", label: "Practical Rule", text: "Use /16 per environment. Dev gets 10.1.0.0/16. QA gets 10.2.0.0/16. Prod gets 10.3.0.0/16. Simple, non-overlapping, room to grow." },
      { type: "h2", text: "Rule 2 — One Subnet Per Workload Tier" },
      { type: "p", text: "Your web-facing VMs should not be in the same subnet as your databases. Separate subnets let you apply different security rules to different tiers, limit blast radius if something goes wrong, and make troubleshooting dramatically easier." },
      { type: "list", items: ["Web Subnet — internet-facing VMs or app services", "App Subnet — business logic tier, no internet access", "Data Subnet — databases, storage, strictly locked down", "Management Subnet — jump hosts, Bastion, admin tooling"] },
      { type: "h2", text: "Rule 3 — NSGs: Deny by Default" },
      { type: "p", text: "Network Security Groups control which traffic can flow in and out of a subnet. The default Azure rules allow quite a lot of traffic — more than you probably want in a production environment." },
      { type: "callout", label: "Non-Negotiable", text: "Never open port 3389 (RDP) or 22 (SSH) to the internet. Use Azure Bastion instead. Exposed RDP ports get attacked within minutes of going public." },
      { type: "h2", text: "Rule 4 — VNet Peering vs VPN Gateway" },
      { type: "p", text: "These two sound similar but serve completely different purposes, and choosing the wrong one costs real money." },
      { type: "compare", left: { title: "🔗 VNet Peering", items: ["Connects two VNets inside Azure", "Uses Microsoft's backbone network", "Low latency, high throughput", "Relatively cheap"] }, right: { title: "🌐 VPN Gateway", items: ["Connects Azure to on-premises", "Encrypted internet tunnel", "Higher latency", "Monthly gateway cost"] } },
      { type: "h2", text: "Rule 5 — Learn Hub-and-Spoke Architecture Early" },
      { type: "p", text: "One central Hub VNet hosts all your shared infrastructure — Azure Firewall, Azure Bastion, your VPN or ExpressRoute gateway, DNS servers. Then each environment gets its own Spoke VNet, peered to the Hub." },
      { type: "p", text: "All traffic between spokes flows through the Hub Firewall. This means you have one place to define and enforce traffic rules, one place to view logs, and complete isolation between environments." },
      { type: "callout", label: "Bottom Line", text: "The network is your foundation. Every other service you deploy in Azure sits on top of it. Spend the hour upfront. Draw the diagram. Then build it once and get it right." },
    ]
  },
  {
    id: 2,
    slug: "private-endpoints-azure",
    category: "Networking",
    categoryColor: "#2563eb",
    emoji: "🔒",
    title: "Private Endpoints — Secure Your PaaS Services in 15 Minutes",
    subtitle: "Your Storage Account, SQL Database, and Key Vault are publicly accessible by default",
    excerpt: "Your Azure Storage Account is accessible from the public internet by default. So is your SQL Database. And your Key Vault. Private Endpoints fix all of this — and they're faster to set up than you think.",
    readTime: "5 min read",
    date: "Jan 13, 2025",
    content: [
      { type: "intro", text: "Here's something that surprises a lot of engineers when they first hear it: your Azure Storage Account is accessible from the public internet by default. So is your Azure SQL Database. And your Key Vault. Private Endpoints change this entirely." },
      { type: "h2", text: "What Private Endpoints Actually Do" },
      { type: "p", text: "A Private Endpoint gives your PaaS service a private IP address inside your VNet. Instead of your application talking to a public URL like mystorageaccount.blob.core.windows.net, it talks to a private IP address that only exists inside your network." },
      { type: "p", text: "Traffic between your application and the service never leaves Microsoft's backbone network. There's no public internet involved at all." },
      { type: "callout", label: "The Security Gain", text: "Once you've set up a Private Endpoint and disabled public access on the service, an attacker on the public internet simply cannot reach it — the endpoint doesn't exist from their perspective." },
      { type: "h2", text: "The One Thing People Always Forget" },
      { type: "p", text: "Private Endpoints don't work in isolation. They need Private DNS Zones. Without a Private DNS Zone, DNS still resolves the hostname to the public IP — even though you've set up a Private Endpoint with a private IP." },
      { type: "callout", label: "Always Set These Up Together", text: "Private Endpoint + Private DNS Zone. They are a pair. Setting up one without the other results in broken name resolution that's genuinely confusing to debug." },
      { type: "h2", text: "Which Services Support Private Endpoints?" },
      { type: "p", text: "Most of the major Azure PaaS services support Private Endpoints: Storage Accounts, Azure SQL, Key Vault, Service Bus, Event Hub, Container Registry, Azure OpenAI, and many more." },
      { type: "p", text: "My recommendation: any PaaS service that holds sensitive data or gets called by production workloads should be behind a Private Endpoint. No exceptions." },
    ]
  },
  {
    id: 3,
    slug: "azure-firewall-vs-nsg",
    category: "Security",
    categoryColor: "#dc2626",
    emoji: "🛡️",
    title: "Azure Firewall vs NSG — Two Tools, Two Very Different Jobs",
    subtitle: "Both control network traffic but at completely different levels",
    excerpt: "Both control network traffic. But they operate at different levels with different capabilities. Most teams use one when they actually need both. Here's the breakdown.",
    readTime: "5 min read",
    date: "Jan 20, 2025",
    content: [
      { type: "intro", text: "One of the most common questions from engineers new to Azure networking: 'Should I use Azure Firewall or NSGs?' The honest answer is: both. But understanding why requires understanding what each one actually does." },
      { type: "h2", text: "Network Security Groups — Your Door Lock" },
      { type: "p", text: "An NSG is a layer 4 filtering tool. It works at the level of IP addresses, ports, and protocols. You write rules like 'allow TCP traffic on port 443 from this IP range' or 'deny all inbound traffic from the internet.'" },
      { type: "p", text: "NSGs are free — there's no additional cost for using them. What they can't do: they have no awareness of what's inside the packets. They can't filter by domain name. They don't have built-in threat intelligence." },
      { type: "h2", text: "Azure Firewall — Your Security Guard" },
      { type: "p", text: "Azure Firewall is a fully managed, cloud-native firewall that operates at layers 4 through 7. It can filter by fully qualified domain names (FQDNs), has built-in threat intelligence that blocks known malicious IPs and domains, and provides rich centralised logging." },
      { type: "callout", label: "Key Difference", text: "Azure Firewall can have a rule that says 'allow outbound traffic to *.microsoft.com' — a domain-based rule. An NSG has no concept of domain names. It only understands IP addresses." },
      { type: "h2", text: "How They Work Together" },
      { type: "p", text: "The right architecture uses both. NSGs at the subnet level provide granular, cheap, fast filtering. Azure Firewall at the Hub level provides centralised control and visibility over all traffic." },
      { type: "p", text: "Think of it as defence in depth: NSGs are your inner locks on each room, Azure Firewall is the security desk at the building entrance. You want both, not one or the other." },
    ]
  },
  {
    id: 4,
    slug: "rbac-azure",
    category: "Security",
    categoryColor: "#dc2626",
    emoji: "🔐",
    title: "RBAC in Azure — Stop Giving Everyone Owner Access",
    subtitle: "Least privilege matters, and here's how to implement it properly",
    excerpt: "I've walked into environments where half the team had Owner-level access on the production subscription. 'It was just easier at the time.' Until someone deleted a production resource group.",
    readTime: "5 min read",
    date: "Jan 27, 2025",
    content: [
      { type: "intro", text: "Role-Based Access Control (RBAC) is one of those topics that seems simple in theory and gets ignored in practice. I've walked into Azure environments where half the team had Owner-level access on the production subscription. The reason was always the same: 'It was just easier at the time.'" },
      { type: "h2", text: "The Three Core Roles" },
      { type: "list", items: ["Owner — full control over resources, including the ability to assign roles to others. Almost no regular user should have this at the subscription level.", "Contributor — can create and manage all types of Azure resources, but cannot grant access to others. Suitable for engineers who need to deploy and configure resources.", "Reader — view-only access. Cannot make any changes. Suitable for support teams, auditors, or anyone who needs visibility without the ability to modify anything."] },
      { type: "callout", label: "A Practical Pattern", text: "Developers get Contributor on their own resource groups, not on the subscription. Support teams get Reader on production. Only service accounts and senior administrators get Owner, and only where absolutely required." },
      { type: "h2", text: "Scope Matters as Much as Role" },
      { type: "p", text: "Assigning Contributor at the subscription level gives access to every resource in every resource group in that subscription. Assigning it at a single resource group gives access only to that group." },
      { type: "p", text: "The principle: assign roles at the lowest scope that allows the person to do their job. Resource group level is usually the right answer. Subscription level is almost always too broad." },
      { type: "h2", text: "Custom Roles" },
      { type: "p", text: "When the built-in roles don't fit, Azure lets you create custom roles with precisely the permissions you need — perfect for giving an application just the rights it needs and nothing more." },
    ]
  },
  {
    id: 5,
    slug: "managed-identities-azure",
    category: "Security",
    categoryColor: "#dc2626",
    emoji: "🆔",
    title: "Managed Identities — Stop Hardcoding Credentials",
    subtitle: "There's a better way than connection strings and client secrets",
    excerpt: "Connection strings in config files. Client secrets in plain text. Storage keys committed to repositories. This still happens far too often. There's a better way — and it's easier than you think.",
    readTime: "5 min read",
    date: "Feb 3, 2025",
    content: [
      { type: "intro", text: "I still see connection strings hardcoded in application config files. Client secrets in plain text. Storage keys committed to repos. It happens more than it should. And it's completely avoidable with Managed Identities." },
      { type: "h2", text: "The Problem with Credentials" },
      { type: "p", text: "When an application needs to access an Azure service, it traditionally authenticates with a credential: a connection string, a client secret, or an access key. The problem: credentials are secrets. Secrets need to be stored somewhere. Leaking them can be catastrophic." },
      { type: "h2", text: "What Managed Identities Solve" },
      { type: "p", text: "A Managed Identity gives an Azure resource an identity in Microsoft Entra ID. That identity can be granted permissions using RBAC, just like a user account. And crucially, there are no credentials to manage." },
      { type: "p", text: "Azure handles everything: creating the identity, rotating the underlying credentials automatically, providing tokens to the application when requested. Your application just says 'give me a token' and Azure handles it." },
      { type: "callout", label: "Practical Example", text: "An Azure Function needs to read secrets from Key Vault. Old approach: store a client secret in app settings. New approach: enable Managed Identity, grant it Key Vault Secrets User role. The Function authenticates automatically with no credentials anywhere." },
      { type: "h2", text: "System-Assigned vs User-Assigned" },
      { type: "compare", left: { title: "System-Assigned", items: ["Created as part of the resource", "Deleted when the resource is deleted", "One identity per resource", "Simpler for straightforward use cases"] }, right: { title: "User-Assigned", items: ["Standalone resource you create separately", "Persists independently of any resource", "Can be assigned to multiple resources", "Better for shared identity scenarios"] } },
    ]
  },
  {
    id: 6,
    slug: "entra-id-explained",
    category: "Entra ID",
    categoryColor: "#7c3aed",
    emoji: "🪪",
    title: "Microsoft Entra ID — More Than Just Azure AD with a New Name",
    subtitle: "The identity foundation of every Azure environment, explained properly",
    excerpt: "Most engineers think Entra ID is just Azure AD with a rebrand. It's not — it's the entire security foundation of your Azure environment. Here's what it actually does.",
    readTime: "6 min read",
    date: "Feb 10, 2025",
    content: [
      { type: "intro", text: "In 2023, Microsoft rebranded Azure Active Directory to Microsoft Entra ID. A lot of engineers rolled their eyes — another Microsoft rebrand. But the rebrand signals something real: Entra ID is the foundation of all identity and access in Azure, and it's more important than most engineers give it credit for." },
      { type: "h2", text: "What Entra ID Actually Is" },
      { type: "p", text: "Entra ID is Microsoft's cloud-based identity and access management service. Every Azure resource, every application registered in Azure, every user accessing Azure-connected services authenticates through Entra ID." },
      { type: "list", items: ["Authentication — verifying who you are: username/password, MFA, passwordless authentication", "Authorization — determining what you're allowed to access: RBAC, Conditional Access policies", "Governance — managing access at scale over time: PIM, Access Reviews, Identity Protection"] },
      { type: "callout", label: "Identity Is the New Perimeter", text: "In a Zero Trust world, identity is the primary security boundary. The network perimeter used to be the boundary — now it's the identity layer. Understanding and securing Entra ID is not optional for Azure engineers who care about security." },
      { type: "h2", text: "The Licence Tiers" },
      { type: "list", items: ["Free — basic authentication, MFA, SSO for limited apps. Included with Azure subscription.", "P1 — Conditional Access, Self-Service Password Reset, dynamic groups. In Microsoft 365 E3.", "P2 — PIM, Identity Protection, Access Reviews. In Microsoft 365 E5."] },
      { type: "h2", text: "Key Concepts Every Azure Engineer Needs" },
      { type: "p", text: "Service Principals are the identity objects that applications use to authenticate to Entra ID. Managed Identities are a special type where Azure handles lifecycle automatically. Both are essential — and knowing which to use is a real skill." },
    ]
  },
  {
    id: 7,
    slug: "pim-privileged-identity",
    category: "Entra ID",
    categoryColor: "#7c3aed",
    emoji: "⏱️",
    title: "PIM — Why Permanent Admin Access Is a Risk You Don't Need",
    subtitle: "Make your most powerful accounts time-limited, auditable, and safe",
    excerpt: "An account with permanent Global Administrator access is a high-value target, 24 hours a day. PIM makes privileged access temporary, time-limited, and auditable. Here's why and how.",
    readTime: "5 min read",
    date: "Feb 17, 2025",
    content: [
      { type: "intro", text: "Every account with permanent Global Administrator access in your tenant is a target. Not occasionally. Constantly. Attackers who compromise a Global Admin account have effectively compromised your entire Azure environment. PIM addresses this by making privileged access temporary rather than permanent." },
      { type: "h2", text: "How PIM Works" },
      { type: "p", text: "With PIM, instead of permanently assigning a user to the Global Admin role, you make them 'eligible' for the role. Eligible users don't have the permissions day-to-day — they have to actively activate them." },
      { type: "p", text: "When they need to perform an admin task, they request activation, provide a justification, complete an MFA challenge, and receive the role for a defined period — say, one or four hours. When the time expires, the role is automatically removed." },
      { type: "callout", label: "The Security Benefit", text: "Even if an attacker compromises an admin's account, they only have admin privileges if the account happens to have an active PIM session. Outside those windows — which might be just a few hours per month — the account has no more privileges than any standard user." },
      { type: "h2", text: "Approval and Notifications" },
      { type: "p", text: "PIM can be configured to require approval before a role is activated. A notification goes to a designated approver who must explicitly approve before the access is granted. All activation attempts are logged in the PIM audit log." },
      { type: "p", text: "Available in Entra ID P2. Start with your most sensitive roles: Global Admin, Privileged Role Admin, Security Admin. Convert permanent assignments to eligible. Configure maximum duration and approval requirements. Test before rolling out to everyone." },
    ]
  },
  {
    id: 8,
    slug: "azure-cost-leaks",
    category: "FinOps",
    categoryColor: "#059669",
    emoji: "💸",
    title: "Where Azure Costs Silently Leak — And How to Find Them",
    subtitle: "Most cloud waste follows predictable patterns. Here's where to look.",
    excerpt: "I've seen Azure bills with thousands of pounds in waste that nobody noticed. Not because the team wasn't careful — because nobody was looking in the right places. Here's exactly where to check.",
    readTime: "6 min read",
    date: "Feb 24, 2025",
    content: [
      { type: "intro", text: "Azure will bill you for everything you leave running. It doesn't send warnings. It doesn't turn things off automatically. It just charges, month after month, for resources you may have forgotten exist. Most cloud cost waste follows predictable patterns — once you know where to look, you can find and eliminate it systematically." },
      { type: "h2", text: "Orphaned Resources" },
      { type: "p", text: "Orphaned resources are the silent killers of Azure budgets. A managed disk attached to a VM which no longer exists. A public IP address assigned to a load balancer that got deleted. A snapshot taken for a migration six months ago and never cleaned up." },
      { type: "p", text: "These resources don't do anything. They just exist and accrue charges. In Azure Cost Management, filter by resource type and look for disks, public IPs, and snapshots not attached to active resources." },
      { type: "h2", text: "VMs Running When They Shouldn't" },
      { type: "p", text: "Development and test environments frequently run 24/7 when they only need to be available during working hours. Running a VM only during business hours (roughly 45 hours per week instead of 168) reduces that cost by about 73%." },
      { type: "callout", label: "Auto-Shutdown", text: "Azure has a built-in auto-shutdown feature for VMs. Go to any VM, find Auto-shutdown in the sidebar, enable it, and set a time. For dev environments, this is a 5-minute change that saves real money immediately." },
      { type: "h2", text: "Pay-As-You-Go for Stable Workloads" },
      { type: "p", text: "If you have workloads that run continuously and predictably, running them on pay-as-you-go pricing is the most expensive option. Reserved Instances and Azure Savings Plans offer discounts of 40–72% for commitments of one or three years." },
      { type: "callout", label: "Quick Win", text: "Open Azure Advisor right now. Filter by Cost. Every recommendation there is money being left on the table — and Advisor tells you exactly how much." },
    ]
  },
  {
    id: 9,
    slug: "iac-why-it-matters",
    category: "IaC",
    categoryColor: "#d97706",
    emoji: "⚙️",
    title: "Why Infrastructure as Code Changes Everything",
    subtitle: "Stop clicking in the Azure Portal. Write code instead.",
    excerpt: "My first Azure environment was built entirely through the Portal. Then I had to replicate it for a new project — and realised I couldn't remember half of what I'd clicked. That's when I learned Infrastructure as Code.",
    readTime: "6 min read",
    date: "Mar 3, 2025",
    content: [
      { type: "intro", text: "My first Azure environment was built entirely through the Portal. I clicked through resource creation wizards, configured settings through dropdowns, deployed VMs by filling in forms. It felt productive. Then I needed to replicate that environment for a new project. And I realised I had no reliable way to do it." },
      { type: "h2", text: "What Infrastructure as Code Actually Means" },
      { type: "p", text: "IaC means defining your infrastructure — VMs, networks, databases, security rules, everything — in code files that can be version controlled, reviewed, tested, and automated. Instead of clicking through a portal, you write a declaration of what you want and a tool creates it." },
      { type: "list", items: ["Repeatable — the same code produces the same environment, every time", "Reviewable — infrastructure changes go through code review before deployment", "Version controlled — you can see every change ever made and who made it", "Auditable — you know exactly what's deployed and why", "Scalable — deploy to ten environments with one command"] },
      { type: "h2", text: "Your Options for Azure IaC" },
      { type: "compare", left: { title: "🔧 Bicep", items: ["Azure-native DSL", "Compiles to ARM Templates", "Complete Azure feature coverage", "Excellent VS Code tooling", "Azure only"] }, right: { title: "🌍 Terraform", items: ["Multi-cloud (Azure, AWS, GCP)", "Open source, huge community", "HCL syntax", "Most in-demand IaC skill", "Slight lag on new features"] } },
      { type: "callout", label: "Getting Started", text: "Pick one and learn it properly. If you're committed to Azure only, start with Bicep. If you want a transferable skill, start with Terraform. Ideally — learn both." },
    ]
  },
  {
    id: 10,
    slug: "terraform-state",
    category: "IaC",
    categoryColor: "#d97706",
    emoji: "💾",
    title: "Terraform State — What It Is and How to Manage It Properly",
    subtitle: "Store state on your laptop and you will eventually have a very bad day",
    excerpt: "Terraform state is the source of more production incidents than almost any other aspect of infrastructure as code. Usually for a simple reason: it was stored locally when it should have been stored remotely.",
    readTime: "5 min read",
    date: "Mar 10, 2025",
    content: [
      { type: "intro", text: "Terraform state is the source of more production incidents than almost any other aspect of infrastructure as code, and usually for a simple reason: it was stored locally when it should have been stored remotely." },
      { type: "h2", text: "What State Is" },
      { type: "p", text: "Every time Terraform deploys infrastructure, it records what it deployed in a state file (terraform.tfstate). This file is Terraform's memory — it maps the resources in your configuration to the actual resources that exist in your cloud provider." },
      { type: "p", text: "When you run terraform plan, Terraform reads the state file to understand what currently exists, then compares it to your configuration to determine what needs to be created, modified, or destroyed." },
      { type: "h2", text: "Why Local State Is a Problem" },
      { type: "p", text: "If two engineers run terraform apply simultaneously with local state, they both think they have a current view of the infrastructure. They don't. The second apply will make decisions based on stale state and can cause conflicts, duplicated resources, or destructive changes." },
      { type: "callout", label: "Remote State in Azure", text: "Store your Terraform state in Azure Blob Storage with a storage account dedicated to Terraform management. Enable versioning, soft delete, and private access. This is the standard pattern for Azure-hosted Terraform state." },
      { type: "h2", text: "State Locking" },
      { type: "p", text: "When Terraform runs against remote state in Azure Blob Storage, it uses blob leases to implement state locking. While one operation is running, the state is locked and any other operation that tries to run will fail — preventing concurrent modification entirely." },
    ]
  },
  {
    id: 11,
    slug: "azure-openai-vs-chatgpt",
    category: "Azure AI",
    categoryColor: "#be185d",
    emoji: "🤖",
    title: "Azure OpenAI vs ChatGPT — Why It Matters for Enterprise",
    subtitle: "Same models. Completely different security posture.",
    excerpt: "Same GPT-4 models, completely different story for enterprise use. Here's why organisations building on AI choose Azure OpenAI over the direct OpenAI API — and when it actually matters.",
    readTime: "5 min read",
    date: "Mar 17, 2025",
    content: [
      { type: "intro", text: "A common question when organisations start exploring generative AI: why use Azure OpenAI Service when you can just call OpenAI's API directly? The models are the same. The capabilities are the same. Why add Azure in the middle?" },
      { type: "h2", text: "Data Privacy" },
      { type: "p", text: "When you send data to OpenAI's API, that data may be used to improve OpenAI's models by default. Microsoft's Azure OpenAI Service commits that your prompts, completions, and any data you submit are not used to train OpenAI models or improve Microsoft's products without your explicit consent." },
      { type: "p", text: "For healthcare, legal, financial services, and government organisations — this distinction is not a minor preference. It's a compliance requirement." },
      { type: "h2", text: "Network Security" },
      { type: "p", text: "Azure OpenAI endpoints can be accessed over Private Endpoints. This means your applications can call GPT-4 without any traffic leaving your Azure VNet or crossing the public internet. The same security controls you apply to your databases apply to your AI endpoints." },
      { type: "compare", left: { title: "💬 OpenAI API", items: ["Easy to access", "Data may train models (opt-out available)", "No private connectivity", "No Entra ID auth", "No compliance certifications"] }, right: { title: "🏢 Azure OpenAI", items: ["Same GPT-4 models", "Data never trains models", "Private Endpoint support", "Entra ID + RBAC", "GDPR, ISO, SOC2 compliant"] } },
      { type: "callout", label: "Bottom Line", text: "For personal projects or internal tooling with no sensitive data — OpenAI's API is fine. For production workloads handling customer data — Azure OpenAI is the responsible choice." },
    ]
  },
  {
    id: 12,
    slug: "rag-architecture-azure",
    category: "Azure AI",
    categoryColor: "#be185d",
    emoji: "🧩",
    title: "RAG — The Architecture Behind Enterprise AI Chatbots",
    subtitle: "GPT-4 doesn't know your internal documents. RAG fixes this.",
    excerpt: "Retrieval Augmented Generation is how most enterprise AI solutions are actually built. Here's what it is, why it works, and how to build it on Azure with OpenAI and AI Search.",
    readTime: "6 min read",
    date: "Mar 24, 2025",
    content: [
      { type: "intro", text: "If you've seen demos of AI chatbots that answer questions about specific internal documents or company policies, the underlying pattern is called Retrieval Augmented Generation (RAG). Understanding RAG is increasingly important for Azure engineers, because building and operating RAG systems is an infrastructure problem as much as an AI problem." },
      { type: "h2", text: "The Problem RAG Solves" },
      { type: "p", text: "Large language models like GPT-4 are trained on large bodies of text, but that training doesn't include your organisation's internal documents. Ask GPT-4 about your company's data retention policy — it doesn't know. It will either refuse or generate a plausible-sounding but incorrect response." },
      { type: "h2", text: "How RAG Works" },
      { type: "list", items: ["A user asks a question", "The system searches a knowledge base for documents relevant to that question", "The most relevant documents are retrieved and included in the prompt sent to GPT-4", "GPT-4 generates an answer based on the retrieved context, not from its training data", "The response can include citations to the source documents"] },
      { type: "callout", label: "The Azure RAG Stack", text: "Azure OpenAI Service for the language model. Azure AI Search for retrieval (including vector search). Azure Blob Storage for source documents. Azure App Service or Functions as the orchestration layer." },
      { type: "h2", text: "Vector Search — Why It Matters" },
      { type: "p", text: "Basic keyword search often misses relevant documents because the user's phrasing doesn't match the exact words in the document. Vector search converts both documents and queries into numerical vectors (embeddings). Mathematically similar vectors represent semantically similar content." },
      { type: "p", text: "A query about 'what happens if I delete my account' matches documents that say 'account termination policy' — even with no keyword overlap. Azure AI Search supports both vector and hybrid search natively." },
    ]
  },
];

const CATEGORIES = ["All", "Networking", "Security", "Entra ID", "FinOps", "IaC", "Azure AI"];

const CAT_COLORS = {
  Networking: "#2563eb",
  Security: "#dc2626",
  "Entra ID": "#7c3aed",
  FinOps: "#059669",
  IaC: "#d97706",
  "Azure AI": "#be185d",
};

function formatDate(d) { return d; }

function ReadingBar({ progress }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 999, background: "#eee" }}>
      <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#2563eb,#7c3aed)", transition: "width 0.1s" }} />
    </div>
  );
}

function CategoryBadge({ cat, color, small }) {
  return (
    <span style={{
      display: "inline-block",
      padding: small ? "2px 10px" : "4px 14px",
      borderRadius: 100,
      fontSize: small ? 11 : 12,
      fontWeight: 700,
      letterSpacing: "0.5px",
      background: color + "18",
      color: color,
      fontFamily: "'DM Mono', monospace",
      textTransform: "uppercase",
    }}>{cat}</span>
  );
}

function PostCard({ post, onClick, featured }) {
  const [hovered, setHovered] = useState(false);
  if (featured) {
    return (
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", background: "#fff",
          borderRadius: 20, overflow: "hidden", cursor: "pointer",
          boxShadow: hovered ? "0 24px 64px rgba(0,0,0,0.12)" : "0 4px 24px rgba(0,0,0,0.06)",
          transform: hovered ? "translateY(-4px)" : "none",
          transition: "all 0.3s ease", marginBottom: 48, border: "1px solid #f0f0f0",
        }}>
        <div style={{
          background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
          minHeight: 340, display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: 40, position: "relative", overflow: "hidden",
        }}>
          <div style={{ fontSize: 100, opacity: 0.08, position: "absolute", top: 20, right: 20, lineHeight: 1 }}>{post.emoji}</div>
          <div>
            <CategoryBadge cat={post.category} color={post.categoryColor} />
          </div>
          <div style={{ fontSize: 64, lineHeight: 1, position: "relative", zIndex: 1 }}>{post.emoji}</div>
        </div>
        <div style={{ padding: "44px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 12, color: "#999", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>
            FEATURED · {post.date}
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 800, lineHeight: 1.2, color: "#0f172a", marginBottom: 14, letterSpacing: "-0.5px" }}>
            {post.title}
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.75, marginBottom: 28, fontFamily: "'Lora', serif" }}>
            {post.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>⏱ {post.readTime}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: post.categoryColor, display: "flex", alignItems: "center", gap: 6 }}>
              Read article <span style={{ transition: "transform 0.2s", transform: hovered ? "translateX(4px)" : "none", display: "inline-block" }}>→</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 16, overflow: "hidden", cursor: "pointer",
        border: "1px solid #f0f0f0",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.1)" : "0 2px 12px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.25s ease", display: "flex", flexDirection: "column",
      }}>
      <div style={{
        height: 120, background: `linear-gradient(135deg, #0f172a, #1e293b)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 48, position: "relative", overflow: "hidden",
      }}>
        <div style={{ opacity: 0.15, fontSize: 80, position: "absolute", right: 10, top: 5 }}>{post.emoji}</div>
        <span style={{ position: "relative", zIndex: 1 }}>{post.emoji}</span>
      </div>
      <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 10 }}>
          <CategoryBadge cat={post.category} color={post.categoryColor} small />
        </div>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 800, lineHeight: 1.3, color: "#0f172a", marginBottom: 8, flex: 1 }}>
          {post.title}
        </h3>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, fontFamily: "'Lora', serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {post.excerpt}
        </p>
      </div>
      <div style={{ padding: "12px 22px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f7f7f7" }}>
        <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>⏱ {post.readTime}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: post.categoryColor }}>Read →</span>
      </div>
    </div>
  );
}

function ArticleContent({ post, onBack, allPosts }) {
  const [progress, setProgress] = useState(0);
  const bodyRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [post.id]);

  const related = allPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2);

  const renderBlock = (block, i) => {
    switch (block.type) {
      case "intro":
        return <p key={i} style={{ fontSize: 20, lineHeight: 1.85, color: "#334155", fontFamily: "'Lora', serif", fontWeight: 400, marginBottom: 28, fontStyle: "italic", borderLeft: "3px solid #e2e8f0", paddingLeft: 20 }}>{block.text}</p>;
      case "h2":
        return <h2 key={i} style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "44px 0 18px", letterSpacing: "-0.5px", paddingBottom: 12, borderBottom: "2px solid #f1f5f9" }}>{block.text}</h2>;
      case "h3":
        return <h3 key={i} style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "32px 0 12px" }}>{block.text}</h3>;
      case "p":
        return <p key={i} style={{ fontSize: 17, lineHeight: 1.85, color: "#374151", fontFamily: "'Lora', serif", marginBottom: 22 }}>{block.text}</p>;
      case "callout":
        return (
          <div key={i} style={{ background: "linear-gradient(135deg, #eff6ff, #f0fdf4)", border: "1px solid #bfdbfe", borderLeft: "4px solid #2563eb", borderRadius: "0 12px 12px 0", padding: "20px 24px", margin: "32px 0" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, color: "#2563eb", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{block.label}</div>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "#1e293b", margin: 0, fontFamily: "'Lora', serif" }}>{block.text}</p>
          </div>
        );
      case "list":
        return (
          <ul key={i} style={{ paddingLeft: 0, margin: "0 0 24px", listStyle: "none" }}>
            {block.items.map((item, j) => (
              <li key={j} style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: 16, color: "#374151", fontFamily: "'Lora', serif", lineHeight: 1.7 }}>
                <span style={{ color: "#2563eb", fontWeight: 700, marginTop: 2, flexShrink: 0 }}>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      case "compare":
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "32px 0" }}>
            {[block.left, block.right].map((side, j) => (
              <div key={j} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 22px", background: "#fafafa" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #e2e8f0" }}>{side.title}</div>
                <ul style={{ paddingLeft: 0, margin: 0, listStyle: "none" }}>
                  {side.items.map((it, k) => (
                    <li key={k} style={{ fontSize: 13, color: "#475569", marginBottom: 8, display: "flex", gap: 8, fontFamily: "'Lora', serif", lineHeight: 1.5 }}>
                      <span style={{ color: "#94a3b8", flexShrink: 0 }}>•</span>{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <>
      <ReadingBar progress={progress} />
      <div style={{ minHeight: "100vh", background: "#fafafa" }}>
        {/* Article header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "20px 0" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
            <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px solid #e2e8f0", borderRadius: 100, padding: "8px 18px", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
              ← Back to all posts
            </button>
          </div>
        </div>

        <article style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
          <CategoryBadge cat={post.category} color={post.categoryColor} />
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, lineHeight: 1.1, color: "#0f172a", margin: "16px 0 16px", letterSpacing: "-1px" }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 18, color: "#64748b", fontFamily: "'Lora', serif", lineHeight: 1.6, marginBottom: 28, fontStyle: "italic" }}>{post.subtitle}</p>

          <div style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: 32, borderBottom: "1px solid #f1f5f9", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👨‍💻</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Azure Engineer</div>
                <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>{post.date}</div>
              </div>
            </div>
            <div style={{ height: 20, width: 1, background: "#e2e8f0" }} />
            <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>⏱ {post.readTime}</span>
          </div>

          <div ref={bodyRef} style={{ marginTop: 40 }}>
            {post.content.map((block, i) => renderBlock(block, i))}
          </div>

          {/* Tags */}
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
              {post.tags?.map(tag => (
                <span key={tag} style={{ padding: "5px 14px", background: "#f1f5f9", borderRadius: 100, fontSize: 12, color: "#475569", fontFamily: "'DM Mono', monospace" }}>#{tag}</span>
              ))}
            </div>

            {related.length > 0 && (
              <>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>Continue Reading</div>
                <div style={{ display: "grid", gridTemplateColumns: related.length > 1 ? "1fr 1fr" : "1fr", gap: 16 }}>
                  {related.map(rp => (
                    <div key={rp.id} onClick={() => { onBack(); setTimeout(() => {}, 0); window.dispatchEvent(new CustomEvent("openPost", { detail: rp.id })); }}
                      style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, cursor: "pointer", background: "#fff", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = post.categoryColor; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{rp.category}</div>
                      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 15, color: "#0f172a", lineHeight: 1.3 }}>{rp.title}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </article>
      </div>
    </>
  );
}

export default function BlogApp() {
  const [activePost, setActivePost] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      setActivePost(POSTS.find(p => p.id === e.detail) || null);
    };
    window.addEventListener("openPost", handler);
    return () => window.removeEventListener("openPost", handler);
  }, []);

  const filtered = POSTS.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered.find(p => p.featured) || filtered[0];
  const rest = filtered.filter(p => p !== featured);

  if (activePost) {
    return (
      <div style={{ fontFamily: "system-ui" }}>
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,800;0,900;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 998, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f0f0f0", height: 60, display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
          <div onClick={() => setActivePost(null)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#0f172a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'DM Mono', monospace" }}>AE</div>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 17 }}>Azure<span style={{ color: "#2563eb" }}>Engineer</span></span>
          </div>
        </nav>
        <div style={{ paddingTop: 60 }}>
          <ArticleContent post={activePost} onBack={() => setActivePost(null)} allPosts={POSTS} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,800;0,900;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: "#0f172a", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'DM Mono', monospace" }}>AE</div>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 19 }}>Azure<span style={{ color: "#2563eb" }}>Engineer</span></span>
          </div>

          {/* Desktop categories */}
          <div style={{ display: "flex", gap: 4, flex: 1, justifyContent: "center", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setSearch(""); }}
                style={{ padding: "7px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", transition: "all 0.2s", background: activeCategory === cat ? "#0f172a" : "transparent", color: activeCategory === cat ? "#fff" : "#64748b" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#94a3b8", pointerEvents: "none" }}>🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setActiveCategory("All"); }}
              placeholder="Search..."
              style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 100, padding: "8px 16px 8px 34px", fontSize: 13, color: "#0f172a", outline: "none", width: 180, fontFamily: "'DM Mono', monospace", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", padding: "70px 24px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "6px 18px", fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 2, marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, background: "#22d3ee", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            AZURE ENGINEERING BLOG
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "#fff", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 18 }}>
            Cloud Engineering,<br /><em style={{ color: "#60a5fa", fontStyle: "italic" }}>Explained Simply.</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.75, fontFamily: "'Lora', serif" }}>
            Practical Azure guides written by an engineer who builds and breaks things in the cloud every day. No fluff, no jargon for the sake of it.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {[["12", "Articles"], ["6", "Series"], ["8", "Months"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center", borderLeft: "2px solid #2563eb", paddingLeft: 16 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>
        {search && (
          <div style={{ marginBottom: 28, fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#64748b" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for <strong style={{ color: "#0f172a" }}>"{search}"</strong>
            <button onClick={() => setSearch("")} style={{ marginLeft: 12, background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>Clear ×</button>
          </div>
        )}

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase" }}>
            {activeCategory === "All" ? "All Articles" : activeCategory}
          </span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#94a3b8" }}>{filtered.length} posts</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#374151", marginBottom: 8 }}>No articles found</h3>
            <p style={{ fontFamily: "'Lora', serif" }}>Try a different search term or category</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && !search && activeCategory === "All" && (
              <PostCard post={featured} onClick={() => setActivePost(featured)} featured />
            )}

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {(search || activeCategory !== "All" ? filtered : rest).map((post, i) => (
                <div key={post.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}>
                  <PostCard post={post} onClick={() => setActivePost(post)} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "32px 24px", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 0.5 }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          Azure<span style={{ color: "#2563eb" }}>Engineer</span>
        </div>
        Real Azure tips from the trenches · 12 articles across 6 series
      </footer>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 700px) {
          .featured-grid { grid-template-columns: 1fr !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
