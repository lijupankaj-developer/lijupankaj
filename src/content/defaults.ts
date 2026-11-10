import type { PublishedSnapshot, SiteSections, ThemeSettings } from "@/types/cms";

export const defaultTheme: ThemeSettings = {
  primaryFont: "Inter",
  headingFont: "Cormorant Garamond",
  bodyFont: "Inter",
  bodySize: 16,
  heroHeadingSize: 104,
  sectionHeadingSize: 64,
  cardHeadingSize: 32,
  navSize: 13,
  buttonSize: 13,
  primaryColor: "#171714",
  secondaryColor: "#1d211e",
  accentColor: "#a5482f",
  backgroundColor: "#f3f0e9",
  surfaceColor: "#fbfaf6",
  headingColor: "#171714",
  bodyColor: "#686158",
  buttonBackground: "#171714",
  buttonText: "#fffdf8",
  borderColor: "#cbc5ba",
  borderRadius: 0,
  sectionSpacing: 128,
  containerWidth: 1440
};

export const defaultExpertise: SiteSections["expertise"] = {
  heading: "Expertise across technology and design.",
  introduction: "Six connected areas of practice, from infrastructure and enterprise systems to AI, security and creative communication.",
  groups: [
    { id: "it-infrastructure", icon: "infrastructure", title: "IT Management & Infrastructure", summary: "Keeping systems available, recoverable and well run.", items: ["IT Infrastructure Management", "Cloud & Server Administration", "Network & Storage Solutions", "Data Backup & Disaster Recovery", "System Integration", "IT Operations & Technical Support"] },
    { id: "enterprise-software", icon: "enterprise", title: "Enterprise Software Development", summary: "Business systems shaped around real workflows.", items: ["ERP Systems", "Business Management Applications", "Workflow Automation", "Custom Enterprise Applications", "Database Architecture", "Financial & Operational Systems", "HR & Payroll Systems"] },
    { id: "artificial-intelligence", icon: "ai", title: "Artificial Intelligence", summary: "Practical AI that saves time without replacing judgment.", items: ["AI-Assisted Software Development", "AI Workflow Automation", "Intelligent Business Applications", "AI Tool Integration", "Productivity Automation", "AI-Enhanced Digital Experiences"] },
    { id: "web-mobile", icon: "web", title: "Web & Mobile Development", summary: "Fast, responsive applications for every screen.", items: ["Modern Web Applications", "Responsive Websites", "Progressive Web Applications", "Mobile Application Development", "API Development & Integration", "E-commerce Solutions"] },
    { id: "cloud-security", icon: "security", title: "Cloud & Cybersecurity", summary: "Security and data protection designed in from the start.", items: ["Cloud Infrastructure", "Application Security", "Authentication & Authorization", "Role-Based Access Control", "Data Protection", "Backup & Recovery", "Secure Deployment Architecture"] },
    { id: "creative-technology", icon: "creative", title: "Creative Technology", summary: "The design foundation behind every digital experience.", items: ["UI/UX Design", "Graphic Design", "Brand Identity", "Digital Campaigns", "Event & Exhibition Design", "Interactive Experiences"] }
  ]
};

export const defaultSkills: SiteSections["skills"] = {
  heading: "Technical skills.",
  introduction: "The tools and technologies I use in day-to-day work.",
  groups: [
    { id: "frontend", name: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3"] },
    { id: "backend", name: "Backend", items: ["Node.js", "REST APIs", "Server-side application development"] },
    { id: "databases", name: "Databases", items: ["PostgreSQL", "Supabase", "SQL"] },
    { id: "infrastructure", name: "Infrastructure", items: ["Docker", "Cloudflare", "Linux servers", "VPS hosting", "Cloud deployment", "Backup & recovery"] },
    { id: "ai-tools", name: "AI & development tools", items: ["OpenAI", "Codex", "Claude Code", "AI-assisted development"] },
    { id: "design", name: "Design", items: ["Adobe Creative Cloud", "Figma", "UI/UX", "Digital design"] }
  ]
};

export const defaultSections: SiteSections = {
  visibility: { profile: true, experience: true, expertise: true, portfolio: true, capabilities: false, skills: true, innovation: true, education: true, contact: true },
  navigation: {
    resumeLabel: "Download Resume",
    items: [
      { id: "about", label: "About", href: "#about", visible: true },
      { id: "expertise", label: "Expertise", href: "#expertise", visible: true },
      { id: "experience", label: "Experience", href: "#experience", visible: true },
      { id: "work", label: "Work", href: "#work", visible: true },
      { id: "skills", label: "Skills", href: "#skills", visible: true },
      { id: "capabilities", label: "Capabilities", href: "#capabilities", visible: false },
      { id: "innovation", label: "AI Innovation", href: "#innovation", visible: false },
      { id: "contact", label: "Contact", href: "#contact", visible: true }
    ]
  },
  hero: {
    eyebrow: "Bridging Technology, Intelligence & Creative Innovation.",
    title: "Liju Pankaj",
    positioning: "IT & Creative Technology Leader",
    supportingText: "Enterprise Software Architecture • Artificial Intelligence • Digital Transformation • Creative Innovation",
    introduction: "I am a UAE-based IT and creative technology professional with over 20 years of experience spanning creative design, print production and technology, with a growing focus on enterprise software, business automation and digital infrastructure. I combine technical expertise, problem-solving and design thinking to develop secure, scalable and user-friendly digital solutions.",
    location: "Dubai, UAE",
    primaryButtonLabel: "Explore My Expertise",
    workButtonLabel: "View My Work",
    contactButtonLabel: "Get in Touch",
    resumeButtonLabel: "Download Resume",
    profileMediaId: null,
    profileFallbackUrl: "/fallback/liju-pankaj.jpg"
  },
  profile: {
    heading: "About me.",
    lead: "I am a multidisciplinary technology professional with extensive experience in information technology, enterprise software development, digital transformation, artificial intelligence and creative design.",
    paragraphs: [
      "My professional journey began in the creative industry and has evolved into a combination of technology leadership, software engineering, IT infrastructure and intelligent business solutions. I work across the full technology lifecycle, from understanding business requirements and designing system architecture to application development, deployment, security and ongoing optimization.",
      "My strength lies in connecting technical functionality with intuitive design, so that technology remains practical, efficient and accessible. I believe successful digital solutions must be secure, scalable, visually refined and easy to use."
    ],
    pillars: ["Technology leadership", "Enterprise software", "AI & automation", "Creative design"]
  },
  expertise: defaultExpertise,
  skills: defaultSkills,
  experience: {
    heading: "Over two decades of experience in the UAE.",
    items: [
      { id: "eleven777", period: "2011—Present", location: "Dubai", title: "Senior Graphic Designer / AI Workflow Specialist", company: "Eleven777 Advertising LLC", summary: "Develops brand, campaign, exhibition, hospitality, banking and presentation work across concurrent accounts. Coordinates with creative, account and production teams, mentors designers, and introduces practical AI-assisted methods." },
      { id: "nabeel", period: "2009—2011", location: "Ajman", title: "Production and Prepress Manager", company: "Nabeel Printing Press LLC", summary: "Managed prepress and production readiness, maintaining artwork quality, colour accuracy and reliable handoff from design through print." },
      { id: "modern", period: "2008—2009", location: "Sharjah", title: "Prepress Supervisor", company: "Modern Graphic Printing Press LLC", summary: "Supervised file preparation, colour and output checks, helping production teams resolve artwork issues before press." },
      { id: "sidra", period: "2005—2008", location: "Sharjah", title: "Graphic Designer, CTF and Scanner Operator", company: "Al Sidra Printing Press LLC", summary: "Created print-ready design work and operated core prepress imaging and film-output processes in a deadline-led environment." }
    ]
  },
  portfolio: {
    heading: "Selected work.",
    introduction: "Branding, campaigns, events, exhibitions and digital design, combining creative thinking with careful execution. Technology work is shown only where it can be described without confidential client or business information.",
    emptyMessage: "Portfolio imagery is being reviewed. Approved case studies will appear here when their verified assets are ready."
  },
  capabilities: {
    heading: "Creative breadth, organised around outcomes.",
    items: [
      { id: "brand", title: "Brand Identity & Campaign Design", summary: "Visual identity, key visuals, campaign systems and brand-consistent rollout." },
      { id: "events", title: "Event & Exhibition Graphics", summary: "Entrances, stages, signage, sponsor environments, screens and wayfinding." },
      { id: "digital", title: "Digital & Social Media Design", summary: "Paid social, bilingual adaptations, stories, carousels, EDMs and web banners." },
      { id: "print", title: "Editorial, Print & Prepress", summary: "Brochures, reports, collateral, colour, file preparation and production control." },
      { id: "presentations", title: "Presentation & Sales Collateral", summary: "Corporate presentations, pitch materials, structured content and infographics." },
      { id: "motion", title: "Motion Graphics & Video", summary: "Social motion, screen content, editing and campaign adaptations." },
      { id: "ux", title: "UI/UX & Responsive Fundamentals", summary: "Clear hierarchy, interface thinking, responsive layouts and digital usability." },
      { id: "ai", title: "AI-Assisted Creative Production", summary: "Prompt-led exploration, image workflows and faster content variation." },
      { id: "automation", title: "Creative Workflow Automation", summary: "Practical workflow improvements using Python, APIs and LLM-assisted tools." },
      { id: "mentoring", title: "Mentoring & Collaboration", summary: "Designer support, cross-functional coordination and parallel project delivery." }
    ],
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "After Effects", "Premiere Pro", "Adobe XD", "PowerPoint", "Google Web Designer", "HTML/CSS", "WordPress", "ChatGPT", "Claude", "Gemini", "Midjourney", "Runway", "OpenAI Codex", "Sora", "Freepik AI", "Lovable.dev"]
  },
  innovation: {
    heading: "AI & Creative Innovation",
    introduction: "AI supports the design practice—not the other way around. I contribute to internal applications that improve creative exploration, design verification and production workflows.",
    accessNote: "Private internal applications — Eleven777 access required. Visitors without an authorized account will see only a login or access-denied screen.",
    apps: [
      { id: "vector-guard", name: "VectorGuard AI", purpose: "AI-assisted vector-file verification for print and prepress readiness.", problem: "Brings colour-space, raster-image and production-readiness checks into one repeatable workflow.", contribution: "Created and developed VectorGuard AI, including the product concept and validation workflow.", technologies: ["AI-assisted validation", "Python", "APIs", "Vector-file analysis"], url: "https://preflight-hub.eleven777.app", featured: true },
      { id: "edm-guard", name: "EDM Compliance Guard", purpose: "Checks EDM layouts, dimensions, spacing and brand compliance.", problem: "Gives design teams a consistent review path for recurring layout requirements.", contribution: "Contributed to design and workflow development within Eleven777’s internal AI-tools initiative.", technologies: ["Rules-based checks", "Brand-compliance logic", "Web workflows"], url: "https://preflight-hub.eleven777.app", featured: true },
      { id: "design-inspector", name: "Design Inspector", purpose: "Inspects PDF, AI and EPS files for colour, vector quality and production issues.", problem: "Consolidates common artwork checks across several professional file formats.", contribution: "Contributed to design and workflow development for the internal file-inspection experience.", technologies: ["PDF, AI & EPS analysis", "Colour validation", "Vector-quality checks"], url: "https://designinspectorpro.lovable.app", featured: true },
      { id: "idea-hub", name: "Idea Generation Hub", purpose: "Supports structured creative ideation and strategy development.", problem: "Organises the progression from an initial idea to a clearer creative direction.", contribution: "Contributed to product concept, design and workflow development for LLM-assisted ideation.", technologies: ["LLM-assisted ideation", "Prompt workflows", "Generative AI"], url: "https://igh.eleven777.app/", featured: true },
      { id: "social-editor", name: "Social Content + Visual Editor", purpose: "Generates and edits social-media content and supporting visuals.", problem: "Connects copy development and visual iteration in one internal workflow.", contribution: "Contributed to design and workflow development for AI-assisted social-content production.", technologies: ["Generative AI", "Content workflows", "Visual editing"], url: "https://social.eleven777.app/", featured: false },
      { id: "estimator", name: "Estimator Tool", purpose: "Supports project estimation and proposal preparation.", problem: "Automates repetitive estimation steps and organises project information.", contribution: "Built Eleven777 Estimate AI using Codex, Lovable.dev and LLM workflows.", technologies: ["OpenAI Codex", "Lovable.dev", "LLM workflows"], url: "https://estimator.eleven777-preflight-hub.com/", featured: false }
    ]
  },
  education: {
    heading: "Education & languages",
    items: [
      { id: "multimedia", qualification: "Diploma in Multimedia", institution: "C-DAC, Kerala" },
      { id: "software", qualification: "Diploma in Software & Hardware Management", institution: "C-DAC, Kerala" },
      { id: "degree", qualification: "Degree", institution: "St. Cyril’s College, Adoor, Kerala" }
    ],
    languages: ["English", "Hindi", "Malayalam"]
  },
  contact: { eyebrow: "Open to technology and creative collaborations", heading: "Let’s build something secure, useful and well designed.", email: "lijupankaj@gmail.com", phone: "+971 55 272 9279", location: "Dubai, UAE", buttonLabel: "Get in Touch" },
  footer: { copyright: "Liju Pankaj", descriptor: "IT & Creative Technology Leader · United Arab Emirates" },
  resume: { mediaId: null, fallbackUrl: "/fallback/liju-pankaj-resume-2026.pdf", downloadLabel: "Download Resume" }
};

export const defaultSnapshot: PublishedSnapshot = {
  schemaVersion: 1,
  revision: 0,
  publishedAt: null,
  theme: defaultTheme,
  sections: defaultSections,
  projects: [],
  categories: [],
  media: []
};
