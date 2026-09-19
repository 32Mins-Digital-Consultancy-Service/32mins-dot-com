export interface ServiceCard {
  title: string;
  /** One-line lead shown in white. */
  description: string;
  /** Supporting sentence shown in grey. */
  detail: string;
}

// Card copy for the Services section: a one-line lead plus one supporting
// sentence per service. The homepage JSON-LD `offers` are derived from this list
// automatically; `knowsAbout` in index.html is updated by hand.
export const SERVICES: ServiceCard[] = [
  {
    title: "Digital Media Production",
    description:
      "Video, photo and audio across pre-, post- and live production.",
    detail:
      "A next-generation studio pipeline that turns complex subjects into compelling multimedia for any platform.",
  },
  {
    title: "eLearning Production",
    description:
      "Instructor-led expertise turned into media-rich, interactive learning.",
    detail:
      "Instructional design and smart content engineering across science, medicine and engineering.",
  },
  {
    title: "AI-Enabled Digital Application & Platform Building",
    description:
      "Scalable web and mobile EdTech platforms with AI at the core.",
    detail:
      "Agile backends, real-time user–organisation mapping and seamless cross-platform access.",
  },
  {
    title: "Human-in-the-Loop Editorial Workspaces",
    description:
      "AI drafts and structures; domain experts review, refine and approve.",
    detail:
      "Machine precision for structure and syntax; human curation for rigour, authenticity and ethics.",
  },
  {
    title: "eLearning Consulting",
    description:
      "Needs assessment, content roadmaps and impact validation.",
    detail:
      "Strategic learning roadmaps for enterprises and academic institutions, from audit to measurable outcomes.",
  },
  {
    title: "LMS Management",
    description:
      "Enterprise-grade Moodle LMS with automated delivery and analytics.",
    detail:
      "Automated delivery frameworks, data-analytics trackers and dependable uptime for learner progression.",
  },
  {
    title: "SMEs Video Production (Offline / Remote)",
    description:
      "Expert-led videos with subject specialists, in studio or remote.",
    detail:
      "Varied production techniques for training, education, thought leadership and promotion.",
  },
  {
    title: "UI/UX & Interaction Design",
    description:
      "Intuitive, adaptive flows built for high-retention learning.",
    detail:
      "Interaction design optimised for digital knowledge retrieval across web and mobile.",
  },
  {
    title: "Vernacular & Multi-Format Localisation",
    description:
      "Training content localised into regional languages and formats.",
    detail:
      "Standard training blueprints transformed to break geographical barriers and reach diverse communities.",
  },
];

/** The four competencies from the 2030 vision document, grouping the services. */
export interface ServicePillar {
  /** Short label used where space is tight. */
  short: string;
  title: string;
  description: string;
  /** Sub-service names as worded in the document. */
  chips: string[];
  /** Indices into SERVICES. */
  services: number[];
}

export const PILLARS: ServicePillar[] = [
  {
    short: "Platforms",
    title: "AI-Enabled Digital Application & Platform Building",
    description:
      "Enterprise LMS engineering, full-stack EdTech development and adaptive UI/UX for high-retention learning.",
    chips: [
      "Intelligent LMS Engineering",
      "Full-Stack EdTech Development",
      "UI/UX & Interaction Design",
    ],
    services: [5, 2, 7],
  },
  {
    short: "Production",
    title: "Advanced Digital Media & eLearning Production",
    description:
      "A next-generation studio pipeline turning instructor-led expertise into media-rich, localised digital learning.",
    chips: [
      "Smart Content Engineering",
      "Next-Gen Studio Infrastructure",
      "SME Video Production",
      "Vernacular & Multi-Format Scalability",
    ],
    services: [1, 0, 6, 8],
  },
  {
    short: "Consultancy",
    title: "Strategic EdTech & AI Governance Consultancy",
    description:
      "Needs assessments, content roadmaps and impact validation for enterprises and academic institutions.",
    chips: ["Learning Roadmap Design", "Ecosystem Incubation & Scale"],
    services: [4],
  },
  {
    short: "Editorial",
    title: "Human-in-the-Loop Content & Editorial Spaces",
    description:
      "Collaborative workspaces where AI automation is guided, overridden and refined by domain experts.",
    chips: [
      "Intellectual Workspaces",
      "AI Precision + Human Judgment",
      "Smart Review Loops",
    ],
    services: [3],
  },
];
