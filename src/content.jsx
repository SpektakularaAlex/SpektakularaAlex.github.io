/*
  ALL TEXT ON THE SITE IS IN THIS FILE.

  Add a News item: paste this as the FIRST entry in `news`:

    { when: "Jan 2027", text: "One line about what happened." },

  Add a project: paste this into `projects` (or `research`); delete lines you don't need:

    {
      title: "Title",
      when: "2027",
      where: "Group, institution",
      text: "One or two lines.",
      links: [{ label: "code", url: "https://…" }],
    },

  For italics, bold or a link inside a text, use <>…</> instead of quotes:
    text: <>A tool called <em>Manifold</em>.</>,

  Unfinished facts: search for VERIFY. These comments are not in the built page,
  but anyone can read them here if the repo is public.
*/

const gh = "https://github.com/SpektakularaAlex";

export const profile = {
  name: "Alexander Cremer",
  tagline: [
    "MSc student in Engineering Physics, Uppsala University",
    "Machine learning for physical systems, scientific computing & dynamical systems",
  ],
  email: "alexander.cremer.1041 [at] student.uu.se", // keep " [at] " (becomes a mailto link)
  cvUpdated: "October 2026",
  github: gh,
  linkedin: "https://www.linkedin.com/in/alexander-cremer-b733aa2a2/",
};

// VERIFY: the CV calls the ETH/PSI project "accelerator modelling"; this page says
// "machine learning for accelerator physics" (here and in `research`). Use one wording.
export const about = (
  <>
    I’m an Engineering Physics student at Uppsala University, specialising in scientific
    computing and AI, with parallel studies in economics. I’m interested in applying machine
    learning and numerical methods to physical systems: accelerators, fusion plasmas and orbital
    dynamics. Right now I’m working on ML-based autonomous operation of an ion source at
    Uppsala’s Tandem Laboratory and on an anisotropy project in fusion research at KTH. In
    spring 2027 I’ll be an exchange student at ETH&nbsp;Zürich, doing a research project on machine
    learning for accelerator physics with Dr.&nbsp;Andreas Adelmann (PSI). Outside research I teach,
    compete in AI hackathons, play piano and sing in the choir Orphei Drängar.
  </>
);

// Newest first.
export const news = [
  {
    when: "Dec 2026",
    // VERIFY: exact date and venue of the poster. Remove "Upcoming" once it has been presented.
    text: (
      <>
        Upcoming poster:{" "}
        <em>
          Using ML for Stable and Autonomous Operation of a Duoplasmatron Ion Source at the Tandem
          Laboratory
        </em>.
      </>
    ),
  },
  {
    when: "Nov 2026",
    text: (
      <>
        Accepted for an exchange semester at ETH&nbsp;Zürich (<span className="nb">Feb–Jun 2027</span>).
      </>
    ),
  },
  {
    // VERIFY: month of the AITX hackathon (the manifold-whisper repo was created on 9 May 2026, which suggests May).
    when: "2026",
    text: (
      <>
        1st place, Codex × AITX Hackathon, Austin (200+ teams), with <em>Manifold</em>, a tool for
        exploring cislunar gravitational pathways from plain-English prompts.
      </>
    ),
  },
  {
    when: "Spring 2026",
    text: "Bachelor thesis at the University of Texas at Austin on the Circular Restricted Three-Body Problem.",
  },
  { when: "2025", text: "2nd place (70+ teams), KTH × Florent Venture AI Hackathon." },
];

export const research = [
  {
    title: "Using ML for Stable and Autonomous Operation of a Duoplasmatron Ion Source",
    when: "2026–present",
    where: "Tandem Laboratory, Uppsala University (via Åutomate)",
    // VERIFY: supervisor name comes from the CV (Dr. Petko Chernev), not from the site brief.
    text: (
      <>
        Developing a machine-learning (Bayesian-optimisation-based) optimiser to automatically tune
        and stabilise the plasma ion source of the lab’s particle accelerator, under the supervision
        of Dr.&nbsp;Petko Chernev. Poster in December 2026.
      </>
    ),
    // When the PDF is ready, add it as public/poster.pdf and uncomment:
    // links: [{ label: "poster", url: "./poster.pdf" }],
  },
  {
    // VERIFY: project title, group/supervisor, dates and a one-sentence description, then fill in.
    title: "Anisotropy in fusion plasmas",
    when: "Ongoing",
    where: "KTH Royal Institute of Technology",
    text: "Contributing to a fusion research project.",
    // VERIFY: draft based on the public Modelling-Anisotropy repo. If that is the KTH project and the
    // code may be linked, use this instead of the line above:
    // text:
    //   "Contributing to derivations of collision and Stix diffusion terms, used to model numerically " +
    //   "the anisotropy of the velocity distribution function in tokamak plasmas.",
    // links: [{ label: "code", url: `${gh}/Modelling-Anisotropy` }],
  },
  {
    // VERIFY: DiVA registers this as an Uppsala University thesis titled "Singular Collision and Infinite
    // Period: Periodic Ejection-Collision Orbits and Homoclinic Connections in Cislunar Space", with
    // Martin Sjödin (UU) also listed as supervisor. Consider using that title, and "Uppsala University,
    // carried out at the University of Texas at Austin".
    title: "Singular Collision and Infinite Period: Periodic Ejection-Collision Orbits and Homoclinic Connections in Cislunar Space",
    // title: "Regularised phase space in the Circular Restricted Three-Body Problem",
    when: "Spring 2026",
    where: "Bachelor thesis, University of Texas at Austin",
    text: (
      <>
        Computational and mathematical methods for analysing regularised phase space in the CR3BP,
        supervised by Dr.&nbsp;Luke Peterson.
      </>
    ),
    links: [
      { label: "thesis", url: "https://urn.kb.se/resolve?urn=urn:nbn:se:uu:diva-590409" },
      { label: "code", url: `${gh}/Cislunar-CR3BP-Research-UT-Austin` },
    ],
  },
  {
    title: "Numerical methods for dynamical systems",
    // VERIFY: the brief says "2025–" (ongoing); the CV says Feb 2025 – Apr 2026. CV dates used.
    when: "2025–2026",
    where: "Research Assistant, Mathematics & Scientific Computing, Uppsala University",
    text: (
      <>
        Python (NumPy/SciPy) numerical tools for analysing dynamical systems, supervised by
        Dr.&nbsp;Jordi-Lluís Figueras.
      </>
    ),
    links: [{ label: "code", url: `${gh}/CR3BP-dynamics` }],
  },
  {
    title: "Upcoming: ML for accelerator physics",
    when: "Spring 2027",
    where: <>ETH&nbsp;Zürich / PSI</>,
    text: <>Research project with Dr.&nbsp;Andreas Adelmann.</>,
  },
];

// These two sections stay hidden while empty.
export const otherProjects = [
  // { title: "Title", when: "Year", where: "Group, institution", text: "One or two lines." },
];

export const publications = [
  // {
  //   title: "Paper title",
  //   when: "Year",
  //   text: <>First Author, <strong>Alexander Cremer</strong>, Last Author. <em>Venue</em>.</>,
  //   links: [{ label: "paper", url: "https://…" }],
  // },
];

export const projects = [
  {
    title: "Manifold: 1st place, Codex × AITX Hackathon",
    when: "2026",
    text: "Austin, 200+ teams. Plain-English exploration of cislunar transfer pathways.",
    links: [{ label: "code", url: `${gh}/manifold-whisper` }],
  },
  {
    title: "2nd place, KTH × Florent Venture AI Hackathon",
    when: "2025",
    text: "70+ teams.",
  },
  {
    title: "Top 18 of 237 teams, Considition",
    when: "2025",
    text: "ML for optimising EV charging in cities.",
    links: [{ label: "code", url: `${gh}/Considition-Hackaton-2025` }],
  },
  {
    title: "Top-5 finalist, Google × Epiminds Swarm Intelligence Hackathon",
    when: "2026",
    text: "Decentralised multi-agent LLM system (TypeScript).",
    links: [{ label: "code", url: `${gh}/Google-Epiminds-hackathon-Milou` }],
  },
  {
    title: "CISPA European AI & Cybersecurity Hackathon, Stockholm",
    when: "2026",
    // VERIFY: the linked repo's README calls the event "CISPA European Championship 2026" and covers data
    // provenance for image autoregressive models; membership inference is named only in the repo
    // description, as one of three challenges. Check name and description.
    text: "Membership-inference attacks on diffusion models (PyTorch).",
    links: [{ label: "code", url: `${gh}/CISPA-HACKATHON-2026` }],
  },
  {
    title: "SVD-based handwritten digit classification",
    text: "Digits classified by their residuals in per-digit SVD subspaces (Python/NumPy).",
    links: [{ label: "code", url: `${gh}/SVD-pattern-recognition` }],
  },
  {
    title: "SPEKTAKEL",
    when: "2025–present",
    text: "Co-founder of a student music platform (full-stack JS/SQL).",
    links: [{ label: "project", url: "https://spektakels.se" }],
  },
];

export const teaching = [
  {
    title: "Teaching Assistant, Uppsala University",
    // VERIFY: the brief says "2025–" (ongoing); the CV says Aug 2025 – Apr 2026. CV dates used.
    when: "2025–2026",
    text: "Scientific Computing I (several periods), Introduction to Computers (Python, Git, LaTeX) and Preparatory Mathematics.",
  },
  {
    title: "Piano teacher",
    text: "5+ years, including about 2.5 years at a music school in Uppsala.",
  },
];

export const awards = [
  <><strong>Nova 111</strong> (2026): named one of Sweden’s 111 most promising students (one of 11 in physics).</>,
  <><strong>Sederholms merit scholarship</strong>, Faculty of Science & Technology, Uppsala University.</>,
  <><strong>French Embassy “French + Sciences” scholarship</strong>: summer school at CIEL Bretagne, Brest (2025), the only Swedish participant.</>,
  <><strong>Student representative for Uppsala University</strong> in the ENLIGHT European University Alliance (2024–2026) and SASUF, South Africa–Sweden University Forum (2026–).</>,
  <><strong>UU AI Society</strong>: member of the competitive team. Active in 7+ student associations.</>,
];

export const beyond = (
  <>
    Music has long been a large part of my life: I’ve played the piano for more than 17 years,
    including international competitions and jazz, funk and pop bands, and I sing in the choir
    Orphei Drängar. I speak Swedish and English fluently, German at C1 level and French at B1.
  </>
);
