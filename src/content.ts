/**
 * TOUT le texte du site est ici, en français (fr) et en anglais (en).
 * Pour modifier un texte : change-le dans les deux langues, les deux objets ont la même forme.
 * Les identifiants de compétences (`tags`) relient expériences/projets aux compétences :
 * survoler une compétence met en évidence les éléments qui portent son identifiant.
 */

export type Lang = 'fr' | 'en'

export const site = {
  // URL publique du site (sert pour l'aperçu LinkedIn / Open Graph). À ajuster après déploiement.
  url: 'https://gastontraore.dev/',
  email: 'traoremamadouditgaston@gmail.com',
  github: 'https://github.com/MGTxlab',
  linkedin: 'https://www.linkedin.com/in/mamadou-dit-gaston-traor%C3%A9-5786ba3b9',
  cv: 'cv.pdf', // fichier dans public/
  gymcloset: 'https://thegym-closet.com',
}

export type SkillId =
  | 'esp32' | 'rs485' | 'mqtt' | 'rfid'
  | 'python' | 'etl'
  | 'sklearn' | 'lightgbm'
  | 'react' | 'angular' | 'flutter' | 'nestjs' | 'springboot'
  | 'docker' | 'nginx' | 'vps' | 'git'

export interface TimelineItem {
  id: string
  period: string // laisse vide ('') si tu ne veux pas afficher de dates
  kind: string
  org: string
  role: string
  summary: string
  points: string[]
  stack: string[]
  tags: SkillId[]
  link?: { label: string; href: string }
}

export interface Content {
  meta: { title: string; description: string }
  a11y: { skip: string; mainNav: string; langSwitch: string }
  nav: { work: string; path: string; contact: string }
  hero: {
    nameA: string
    nameB: string
    role: string
    signature: string
    cv: string
    contact: string
    availability: string
    location: string
    decision: string
    raw: string
  }
  about: { title: string; paragraphs: string[]; photoAlt: string; facts: { k: string; v: string }[] }
  caseStudy: {
    title: string
    lede: string
    open: string
    close: string
    pipeline: { id: string; label: string; detail: string; tags: SkillId[] }[]
    sections: { title: string; body: string[] }[]
    stack: string[]
  }
  timeline: { title: string; items: TimelineItem[] }
  projects: {
    title: string
    items: { id: string; title: string; context: string; summary: string; tags: SkillId[] }[]
  }
  skills: {
    title: string
    hint: string
    usedIn: (n: number) => string
    stages: { id: string; name: string; desc: string; items: { id: SkillId; label: string }[] }[]
  }
  engagement: { title: string; role: string; body: string }
  contact: { title: string; body: string; emailLabel: string; cv: string }
  footer: { note: string }
}

const fr: Content = {
  meta: {
    title: 'Mamadou dit Gaston Traoré — Data Science & IoT',
    description:
      "Étudiant-ingénieur Data Science & IoT. Du capteur à la décision : ESP32, données, modèles de ML et applications en production. Stage PFE dès février 2027.",
  },
  a11y: {
    skip: 'Aller au contenu',
    mainNav: 'Navigation principale',
    langSwitch: 'Switch to English',
  },
  nav: { work: 'Projets', path: 'Parcours', contact: 'Contact' },
  hero: {
    nameA: 'Mamadou dit Gaston',
    nameB: 'Traoré',
    role: 'Étudiant-ingénieur Data Science & IoT à SUPMTI.',
    signature: 'Je construis toute la chaîne, du capteur à la décision.',
    cv: 'Télécharger le CV',
    contact: 'Me contacter',
    availability: 'Stage PFE dès février 2027',
    location: 'Salé, Maroc',
    decision: 'décision',
    raw: 'signal brut',
  },
  about: {
    title: 'Du capteur à la décision',
    paragraphs: [
      "Je suis étudiant-ingénieur en dernière année à SUPMTI, option Data Science & IoT (2022–2027). D'origine malienne, je vis à Salé.",
      "Ma signature, c'est la chaîne complète. Je collecte les données avec des capteurs sur ESP32, je les traite, j'entraîne des modèles de machine learning, puis je livre des applications déployées en production chez de vrais clients.",
      'Je cherche un stage de fin d’études (PFE) à partir de février 2027.',
    ],
    photoAlt: 'Portrait de Mamadou dit Gaston Traoré',
    facts: [
      { k: 'Formation', v: 'SUPMTI · Data Science & IoT · 2022–2027' },
      { k: 'Basé à', v: 'Salé, Maroc' },
      { k: 'Recherche', v: 'Stage PFE · février 2027' },
    ],
  },
  caseStudy: {
    title: 'SmartFields AI',
    lede:
      "Une station de mesure des sols, du capteur planté dans la terre jusqu'à l'application mobile. Le projet où je tiens chaque maillon de la chaîne.",
    open: "Lire l'étude de cas",
    close: 'Fermer',
    pipeline: [
      { id: 'sensor', label: 'Capteur NPK 7-en-1', detail: 'mesure du sol', tags: [] },
      { id: 'esp32', label: 'ESP32', detail: 'lecture en RS485', tags: ['esp32', 'rs485'] },
      { id: 'api', label: 'Django REST', detail: 'API et stockage', tags: ['python'] },
      { id: 'model', label: 'LightGBM', detail: 'modèle', tags: ['lightgbm', 'python'] },
      { id: 'app', label: 'Flutter', detail: 'application', tags: ['flutter'] },
    ],
    sections: [
      {
        title: 'Capter',
        body: [
          "Un capteur de sol NPK 7-en-1 est relié à un ESP32 par un bus RS485. L'ESP32 interroge le capteur et transmet les mesures au backend.",
        ],
      },
      {
        title: 'Traiter et modéliser',
        body: [
          'Un backend Django REST reçoit les mesures, les stocke et les expose via une API. Un modèle LightGBM exploite ces données pour produire une prédiction.',
        ],
      },
      {
        title: 'Livrer',
        body: [
          "Une application Flutter, adossée à Supabase, rend le résultat lisible pour l'utilisateur final.",
        ],
      },
      {
        title: 'Mon rôle',
        body: [
          "J'ai conçu et réalisé l'ensemble : le câblage et le firmware de la station, le backend, le modèle et l'application mobile.",
        ],
      },
    ],
    stack: ['ESP32', 'RS485', 'Capteur NPK 7-en-1', 'Django REST', 'LightGBM', 'Flutter', 'Supabase'],
  },
  timeline: {
    title: 'Parcours',
    items: [
      {
        id: 't3',
        period: '15 avr. – 9 juil. 2026',
        kind: 'Mission',
        org: 'Sensthings (UM6P)',
        role: 'Coordonnateur Anti-Triche T3 Shield',
        summary: 'Mission menée pendant le Baccalauréat national marocain.',
        points: [
          'Coordonnateur provincial : déploiement et maintenance des équipements, formation des vérificateurs.',
          'Puis coordonnateur régional au siège de Skhirate : suivi en temps réel, alertes, rapports quotidiens.',
        ],
        stack: [],
        tags: [],
      },
      {
        id: 'gymcloset',
        period: '',
        kind: 'Projet client · Bamako',
        org: 'GymCloset',
        role: 'Plateforme e-commerce',
        summary: 'Boutique en ligne pour un client à Bamako, en production.',
        points: [
          'Paiement Orange Money.',
          "Bot d'administration WhatsApp (Evolution API, n8n, Redis).",
        ],
        stack: ['React', 'NestJS', 'PostgreSQL', 'Prisma', 'Docker', 'Nginx'],
        tags: ['react', 'nestjs', 'docker', 'nginx'],
        link: { label: 'thegym-closet.com', href: 'https://thegym-closet.com' },
      },
      {
        id: 'transit',
        period: '',
        kind: 'Projet client · Mali',
        org: 'Transit Caisse',
        role: 'Application desktop de gestion',
        summary: 'Pour une société de transit au Mali.',
        points: ['Conteneurs, facturation et caisse.', 'Fonctionne sur un réseau local de 4 postes.'],
        stack: ['Electron', 'React', 'TypeScript', 'NestJS', 'PostgreSQL'],
        tags: ['react', 'nestjs'],
      },
      {
        id: 'asem-platform',
        period: '',
        kind: 'Projet associatif',
        org: 'Plateforme ASEM',
        role: 'Site de l’association des étudiants maliens au Maroc',
        summary: 'Présentée à l’Ambassade du Mali.',
        points: [],
        stack: ['Angular', 'Spring Boot', 'PostgreSQL', 'Docker'],
        tags: ['angular', 'springboot', 'docker'],
      },
      {
        id: 'embassy',
        period: 'août – nov. 2023',
        kind: 'Stage',
        org: 'Ambassade du Mali',
        role: 'Stagiaire, section consulaire',
        summary: '',
        points: [],
        stack: [],
        tags: [],
      },
    ],
  },
  projects: {
    title: 'Autres projets',
    items: [
      {
        id: '500min',
        title: '500 Minutes of Collective Intelligence',
        context: 'Hackathon · UM6P · 2026',
        summary: 'Trois jours pour travailler sur les systèmes alimentaires résilients en Afrique.',
        tags: [],
      },
      {
        id: 'carhealth',
        title: 'CarHealth AI',
        context: 'Projet de groupe',
        summary: 'IA embarquée de maintenance prédictive pour véhicules électriques.',
        tags: [],
      },
    ],
  },
  skills: {
    title: 'Compétences, dans l’ordre de la chaîne',
    hint: 'Survolez une compétence pour voir où elle a servi.',
    usedIn: (n) => (n === 0 ? '' : n === 1 ? 'utilisé dans 1 projet' : `utilisé dans ${n} projets`),
    stages: [
      {
        id: 'capture',
        name: 'Capter',
        desc: 'IoT',
        items: [
          { id: 'esp32', label: 'ESP32' },
          { id: 'rs485', label: 'RS485' },
          { id: 'mqtt', label: 'MQTT' },
          { id: 'rfid', label: 'RFID' },
        ],
      },
      {
        id: 'process',
        name: 'Traiter',
        desc: 'Data',
        items: [
          { id: 'python', label: 'Python' },
          { id: 'etl', label: 'ETL' },
        ],
      },
      {
        id: 'model',
        name: 'Modéliser',
        desc: 'IA',
        items: [
          { id: 'sklearn', label: 'scikit-learn' },
          { id: 'lightgbm', label: 'LightGBM' },
        ],
      },
      {
        id: 'ship',
        name: 'Livrer',
        desc: 'Web & DevOps',
        items: [
          { id: 'react', label: 'React' },
          { id: 'angular', label: 'Angular' },
          { id: 'flutter', label: 'Flutter' },
          { id: 'nestjs', label: 'NestJS' },
          { id: 'springboot', label: 'Spring Boot' },
          { id: 'docker', label: 'Docker' },
          { id: 'nginx', label: 'Nginx' },
          { id: 'vps', label: 'Linux VPS' },
          { id: 'git', label: 'Git' },
        ],
      },
    ],
  },
  engagement: {
    title: 'Engagement',
    role: 'Président de l’ASEM',
    body:
      "À la tête de l'association des étudiants maliens au Maroc, j'organise des journées scientifiques, sportives et culturelles, et j'anime des panels.",
  },
  contact: {
    title: 'Parlons de votre PFE',
    body: 'Je suis disponible pour un stage de fin d’études à partir de février 2027. Le plus simple est de m’écrire.',
    emailLabel: 'Écrire un email',
    cv: 'Télécharger le CV (PDF)',
  },
  footer: { note: 'Conçu et développé par Mamadou dit Gaston Traoré.' },
}

const en: Content = {
  meta: {
    title: 'Mamadou dit Gaston Traoré — Data Science & IoT',
    description:
      'Data Science & IoT engineering student. From sensor to decision: ESP32, data, ML models and production apps. Looking for a final-year internship from February 2027.',
  },
  a11y: {
    skip: 'Skip to content',
    mainNav: 'Main navigation',
    langSwitch: 'Passer en français',
  },
  nav: { work: 'Work', path: 'Experience', contact: 'Contact' },
  hero: {
    nameA: 'Mamadou dit Gaston',
    nameB: 'Traoré',
    role: 'Data Science & IoT engineering student at SUPMTI.',
    signature: 'I build the whole chain, from sensor to decision.',
    cv: 'Download CV',
    contact: 'Get in touch',
    availability: 'Final-year internship from February 2027',
    location: 'Salé, Morocco',
    decision: 'decision',
    raw: 'raw signal',
  },
  about: {
    title: 'From sensor to decision',
    paragraphs: [
      "I'm a final-year engineering student at SUPMTI, majoring in Data Science & IoT (2022–2027). Originally from Mali, I live in Salé, Morocco.",
      'My signature is the full chain. I collect data with sensors on ESP32, process it, train machine learning models, then ship applications running in production for real clients.',
      "I'm looking for a final-year engineering internship (PFE) starting February 2027.",
    ],
    photoAlt: 'Portrait of Mamadou dit Gaston Traoré',
    facts: [
      { k: 'Education', v: 'SUPMTI · Data Science & IoT · 2022–2027' },
      { k: 'Based in', v: 'Salé, Morocco' },
      { k: 'Looking for', v: 'Final-year internship · Feb 2027' },
    ],
  },
  caseStudy: {
    title: 'SmartFields AI',
    lede:
      'A soil measurement station, from the sensor in the ground to the mobile app. The project where I own every link of the chain.',
    open: 'Read the case study',
    close: 'Close',
    pipeline: [
      { id: 'sensor', label: '7-in-1 NPK sensor', detail: 'soil readings', tags: [] },
      { id: 'esp32', label: 'ESP32', detail: 'RS485 reading', tags: ['esp32', 'rs485'] },
      { id: 'api', label: 'Django REST', detail: 'API & storage', tags: ['python'] },
      { id: 'model', label: 'LightGBM', detail: 'model', tags: ['lightgbm', 'python'] },
      { id: 'app', label: 'Flutter', detail: 'app', tags: ['flutter'] },
    ],
    sections: [
      {
        title: 'Capture',
        body: [
          'A 7-in-1 NPK soil sensor is wired to an ESP32 over an RS485 bus. The ESP32 polls the sensor and sends the readings to the backend.',
        ],
      },
      {
        title: 'Process and model',
        body: [
          'A Django REST backend receives, stores and serves the readings through an API. A LightGBM model uses this data to produce a prediction.',
        ],
      },
      {
        title: 'Ship',
        body: ['A Flutter app, backed by Supabase, makes the result readable for the end user.'],
      },
      {
        title: 'My role',
        body: [
          'I designed and built all of it: the station wiring and firmware, the backend, the model and the mobile app.',
        ],
      },
    ],
    stack: ['ESP32', 'RS485', '7-in-1 NPK sensor', 'Django REST', 'LightGBM', 'Flutter', 'Supabase'],
  },
  timeline: {
    title: 'Experience',
    items: [
      {
        id: 't3',
        period: 'Apr 15 – Jul 9, 2026',
        kind: 'Assignment',
        org: 'Sensthings (UM6P)',
        role: 'T3 Shield Anti-Cheating Coordinator',
        summary: 'Carried out during the Moroccan national Baccalaureate exams.',
        points: [
          'Provincial coordinator: equipment deployment and maintenance, training of verifiers.',
          'Then regional coordinator at the Skhirate headquarters: real-time monitoring, alerts, daily reports.',
        ],
        stack: [],
        tags: [],
      },
      {
        id: 'gymcloset',
        period: '',
        kind: 'Client project · Bamako',
        org: 'GymCloset',
        role: 'E-commerce platform',
        summary: 'Online store for a client in Bamako, live in production.',
        points: ['Orange Money payments.', 'WhatsApp admin bot (Evolution API, n8n, Redis).'],
        stack: ['React', 'NestJS', 'PostgreSQL', 'Prisma', 'Docker', 'Nginx'],
        tags: ['react', 'nestjs', 'docker', 'nginx'],
        link: { label: 'thegym-closet.com', href: 'https://thegym-closet.com' },
      },
      {
        id: 'transit',
        period: '',
        kind: 'Client project · Mali',
        org: 'Transit Caisse',
        role: 'Desktop management app',
        summary: 'For a freight forwarding company in Mali.',
        points: ['Containers, invoicing and cash desk.', 'Runs on a 4-workstation local network.'],
        stack: ['Electron', 'React', 'TypeScript', 'NestJS', 'PostgreSQL'],
        tags: ['react', 'nestjs'],
      },
      {
        id: 'asem-platform',
        period: '',
        kind: 'Non-profit project',
        org: 'ASEM platform',
        role: 'Website of the Malian students’ association in Morocco',
        summary: 'Presented at the Embassy of Mali.',
        points: [],
        stack: ['Angular', 'Spring Boot', 'PostgreSQL', 'Docker'],
        tags: ['angular', 'springboot', 'docker'],
      },
      {
        id: 'embassy',
        period: 'Aug – Nov 2023',
        kind: 'Internship',
        org: 'Embassy of Mali',
        role: 'Intern, consular section',
        summary: '',
        points: [],
        stack: [],
        tags: [],
      },
    ],
  },
  projects: {
    title: 'Other projects',
    items: [
      {
        id: '500min',
        title: '500 Minutes of Collective Intelligence',
        context: 'Hackathon · UM6P · 2026',
        summary: 'Three days working on resilient food systems in Africa.',
        tags: [],
      },
      {
        id: 'carhealth',
        title: 'CarHealth AI',
        context: 'Group project',
        summary: 'Embedded AI for predictive maintenance of electric vehicles.',
        tags: [],
      },
    ],
  },
  skills: {
    title: 'Skills, in the order of the chain',
    hint: 'Hover a skill to see where it was used.',
    usedIn: (n) => (n === 0 ? '' : n === 1 ? 'used in 1 project' : `used in ${n} projects`),
    stages: [
      {
        id: 'capture',
        name: 'Capture',
        desc: 'IoT',
        items: [
          { id: 'esp32', label: 'ESP32' },
          { id: 'rs485', label: 'RS485' },
          { id: 'mqtt', label: 'MQTT' },
          { id: 'rfid', label: 'RFID' },
        ],
      },
      {
        id: 'process',
        name: 'Process',
        desc: 'Data',
        items: [
          { id: 'python', label: 'Python' },
          { id: 'etl', label: 'ETL' },
        ],
      },
      {
        id: 'model',
        name: 'Model',
        desc: 'AI',
        items: [
          { id: 'sklearn', label: 'scikit-learn' },
          { id: 'lightgbm', label: 'LightGBM' },
        ],
      },
      {
        id: 'ship',
        name: 'Ship',
        desc: 'Web & DevOps',
        items: [
          { id: 'react', label: 'React' },
          { id: 'angular', label: 'Angular' },
          { id: 'flutter', label: 'Flutter' },
          { id: 'nestjs', label: 'NestJS' },
          { id: 'springboot', label: 'Spring Boot' },
          { id: 'docker', label: 'Docker' },
          { id: 'nginx', label: 'Nginx' },
          { id: 'vps', label: 'Linux VPS' },
          { id: 'git', label: 'Git' },
        ],
      },
    ],
  },
  engagement: {
    title: 'Community',
    role: 'President of ASEM',
    body:
      'As head of the Malian students’ association in Morocco, I organise scientific, sports and cultural days, and moderate panels.',
  },
  contact: {
    title: "Let's talk about your internship",
    body: "I'm available for a final-year internship from February 2027. The easiest way is to email me.",
    emailLabel: 'Send an email',
    cv: 'Download CV (PDF)',
  },
  footer: { note: 'Designed and built by Mamadou dit Gaston Traoré.' },
}

export const content: Record<Lang, Content> = { fr, en }
