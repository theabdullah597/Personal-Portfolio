import {
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  Service,
  SocialLink,
  ContactMessage,
} from "@/types";

export const initialProfile: Profile = {
  id: "profile-1",
  full_name: "Abdullah",
  headline: "Full-Stack Software Engineer & AI Systems Architect",
  career_focus: "Scalable Web Platforms & Intelligent AI Applications",
  bio: "Experienced full-stack engineer specializing in modern web architecture, distributed systems, and generative AI integrations. Passionate about engineering high-performance user interfaces, reliable APIs, and production-grade RAG and machine learning workflows.",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  resume_url: "#",
  location: "Islamabad, Pakistan / Remote",
  email: "contact@abdullah.dev",
  phone: "+92 300 1234567",
  available_for_hire: true,
  years_experience: 4,
  completed_projects: 24,
};

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "AI Research Assistant",
    slug: "ai-research-assistant",
    short_description:
      "Enterprise research copilot featuring contextual vector search, semantic document synthesis, and hybrid retrieval-augmented generation.",
    full_description:
      "A high-throughput research assistant built with Next.js, FastAPI, Qdrant vector database, and LangChain. It allows researchers to upload multi-gigabyte corpus libraries, ask natural language queries, and receive sourced answers with citations down to individual page numbers. Designed with sub-second vector search latency, stream-rendered LLM responses, and multi-tenant security.",
    category: "AI/ML",
    technologies: ["Next.js", "TypeScript", "FastAPI", "Python", "Qdrant", "OpenAI", "Tailwind CSS"],
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80"
    ],
    github_url: "https://github.com",
    live_url: "https://demo.example.com",
    metrics: {
      "Vector Search Latency": "< 45ms",
      "Retrieval Accuracy": "94.2%",
      "Documents Indexed": "120,000+"
    },
    featured: true,
    published: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-2",
    title: "Real-Time Object Detection & Tracking",
    slug: "object-detection-system",
    short_description:
      "Edge-optimized computer vision pipeline with real-time multi-camera tracking, spatial anomaly alerts, and WebRTC streaming.",
    full_description:
      "High-precision computer vision pipeline built with YOLOv8, PyTorch, and TensorRT, streamed directly to a Next.js dashboard using low-latency WebRTC. Features multi-camera spatial tracking, zone occupancy telemetry, and automated incident alerts sent to cloud data stores.",
    category: "Computer Vision",
    technologies: ["PyTorch", "YOLOv8", "WebRTC", "TensorRT", "Next.js", "Docker"],
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
    ],
    github_url: "https://github.com",
    live_url: null,
    metrics: {
      "Frame Rate": "60 FPS Edge",
      "Mean Average Precision": "88.6 mAP",
      "Inference Delay": "14ms"
    },
    featured: true,
    published: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-3",
    title: "Cloud Native Distributed Task Engine",
    slug: "distributed-task-engine",
    short_description:
      "Resilient background job processing orchestrator with automatic partition recovery, real-time telemetry, and rate limiting.",
    full_description:
      "Engineered a distributed workflow and queue management platform in Go and Node.js. Built for high-throughput background processing with Redis cluster coordination, guaranteed at-least-once execution semantics, and live Prometheus/Grafana observability.",
    category: "Backend",
    technologies: ["Go", "Node.js", "Redis", "Docker", "Kubernetes", "Prometheus"],
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
    ],
    github_url: "https://github.com",
    live_url: "https://demo.example.com",
    metrics: {
      "Throughput": "25,000 req/sec",
      "Uptime": "99.99%",
      "Failover Time": "< 2s"
    },
    featured: true,
    published: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-4",
    title: "Secure Online Examination Platform",
    slug: "secure-online-examination",
    short_description:
      "Enterprise proctoring and assessment platform with automated face verification, browser locking, and real-time grading.",
    full_description:
      "Full-stack SaaS application supporting thousands of concurrent examinees. Features browser integrity monitoring, automated webcam anomaly recognition, dynamic question bank randomization, and instantaneous grading with comprehensive analytics.",
    category: "Full Stack",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Tailwind CSS", "WebSockets"],
    image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"
    ],
    github_url: "https://github.com",
    live_url: "https://demo.example.com",
    metrics: {
      "Concurrent Users": "10,000+",
      "Audit Accuracy": "99.2%",
      "Latency": "80ms"
    },
    featured: false,
    published: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const initialSkills: Skill[] = [
  // Programming
  { id: "sk-1", name: "TypeScript", category: "Programming", icon: "Code2", proficiency: 95, display_order: 1, featured: true },
  { id: "sk-2", name: "Python", category: "Programming", icon: "Terminal", proficiency: 92, display_order: 2, featured: true },
  { id: "sk-3", name: "Go", category: "Programming", icon: "Cpu", proficiency: 80, display_order: 3, featured: false },
  // Frontend
  { id: "sk-4", name: "Next.js & React", category: "Frontend", icon: "Layout", proficiency: 96, display_order: 4, featured: true },
  { id: "sk-5", name: "Tailwind CSS", category: "Frontend", icon: "Palette", proficiency: 95, display_order: 5, featured: true },
  { id: "sk-6", name: "Three.js / WebGL", category: "Frontend", icon: "Box", proficiency: 75, display_order: 6, featured: false },
  // Backend
  { id: "sk-7", name: "Node.js & Express", category: "Backend", icon: "Server", proficiency: 90, display_order: 7, featured: true },
  { id: "sk-8", name: "FastAPI", category: "Backend", icon: "Zap", proficiency: 88, display_order: 8, featured: true },
  // Database
  { id: "sk-9", name: "PostgreSQL & Supabase", category: "Database", icon: "Database", proficiency: 92, display_order: 9, featured: true },
  { id: "sk-10", name: "Redis", category: "Database", icon: "Layers", proficiency: 84, display_order: 10, featured: false },
  // AI/ML
  { id: "sk-11", name: "LangChain & RAG Systems", category: "AI/ML", icon: "Bot", proficiency: 89, display_order: 11, featured: true },
  { id: "sk-12", name: "Qdrant Vector DB", category: "AI/ML", icon: "Cpu", proficiency: 86, display_order: 12, featured: true },
  { id: "sk-13", name: "PyTorch & Computer Vision", category: "AI/ML", icon: "Sparkles", proficiency: 80, display_order: 13, featured: false },
  // DevOps & Tools
  { id: "sk-14", name: "Docker & Kubernetes", category: "DevOps", icon: "Container", proficiency: 85, display_order: 14, featured: true },
  { id: "sk-15", name: "Git & CI/CD Actions", category: "Tools", icon: "GitBranch", proficiency: 90, display_order: 15, featured: false }
];

export const initialExperiences: Experience[] = [
  {
    id: "exp-1",
    company: "Apex Tech Innovations",
    role: "Senior Full-Stack & AI Engineer",
    location: "Remote",
    start_date: "2023-01-01",
    end_date: null,
    currently_working: true,
    description: "Leading development of intelligent web platforms, modernizing microservices to Next.js and FastAPI, and implementing enterprise RAG search engines saving 30% research overhead.",
    technologies: ["Next.js", "TypeScript", "FastAPI", "Qdrant", "PostgreSQL", "Docker"],
    display_order: 1,
  },
  {
    id: "exp-2",
    company: "Nova Digital Solutions",
    role: "Full-Stack Software Developer",
    location: "Islamabad, PK",
    start_date: "2021-06-01",
    end_date: "2022-12-31",
    currently_working: false,
    description: "Architected high-volume web portals, built secure RESTful and GraphQL APIs, streamlined database queries reducing average page load by 45%.",
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "Redis"],
    display_order: 2,
  }
];

export const initialEducation: Education[] = [
  {
    id: "edu-1",
    institution: "National University of Sciences and Technology (NUST)",
    degree: "Bachelor of Science",
    field: "Computer Science",
    start_date: "2018-09-01",
    end_date: "2022-06-30",
    currently_studying: false,
    description: "Graduated with honors. Focused on algorithms, distributed computing, database systems, and machine learning foundations.",
    display_order: 1,
  }
];

export const initialServices: Service[] = [
  {
    id: "srv-1",
    title: "Full-Stack Web Engineering",
    description: "End-to-end production web applications engineered for speed, high scalability, and robust user engagement.",
    icon: "Layout",
    features: [
      "Next.js App Router Architecture",
      "Responsive, accessible UI with Tailwind CSS",
      "Type-safe REST & GraphQL APIs",
      "Supabase / PostgreSQL database design"
    ],
    display_order: 1,
    is_active: true,
  },
  {
    id: "srv-2",
    title: "AI & RAG Systems Integration",
    description: "Tailored vector search systems, contextual LLM agents, and semantic document analysis engines.",
    icon: "Bot",
    features: [
      "Vector search with Qdrant and pgvector",
      "Retrieval-Augmented Generation pipelines",
      "Low-latency streaming responses",
      "Evaluation and safety guardrails"
    ],
    display_order: 2,
    is_active: true,
  },
  {
    id: "srv-3",
    title: "Cloud & Backend Architecture",
    description: "High-concurrency microservices, Docker orchestration, and bulletproof relational database architectures.",
    icon: "Server",
    features: [
      "Go / Node.js / Python API microservices",
      "Redis caching & queue orchestration",
      "Row-Level Security & Auth systems",
      "Automated CI/CD workflows"
    ],
    display_order: 3,
    is_active: true,
  }
];

export const initialSocialLinks: SocialLink[] = [
  { id: "soc-1", platform: "GitHub", url: "https://github.com", icon: "Github", display_order: 1, is_active: true },
  { id: "soc-2", platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin", display_order: 2, is_active: true },
  { id: "soc-3", platform: "Twitter / X", url: "https://twitter.com", icon: "Twitter", display_order: 3, is_active: true },
  { id: "soc-4", platform: "Email", url: "mailto:contact@abdullah.dev", icon: "Mail", display_order: 4, is_active: true }
];

export const initialMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@enterprise.io",
    subject: "Inquiry on Full-Stack AI Project Collaboration",
    message: "Hi Abdullah, we came across your portfolio and were very impressed with your AI research assistant project. We'd love to schedule a technical discovery call next week.",
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "msg-2",
    name: "Alex Rivera",
    email: "alex@techstart.co",
    subject: "Contract Opportunity: Next.js Platform",
    message: "Hello, looking for a senior engineer to lead the frontend architecture of our analytics product. Let me know if you are open to contract engagements.",
    is_read: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];
