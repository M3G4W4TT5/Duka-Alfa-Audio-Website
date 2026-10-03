import { media } from "./media";
import type { EquipmentGroup, Partner, Service, Slide, Story } from "./types";

// Temporary English review fixtures. Final projections will be derived after design.
export const site = {
  name: "Duka Alfa Audio",
  heroTitle: "18 years of sound excellence.",
  heroMessage:
    "DUKA powers the audiovisual experience of thousands of bars, festivals and events.",
  heroIntervalMs: 3000,
  about: [
    "In 2008 Duka Alfa Audio began with a few used speakers. Since then, we have supplied sound and lighting systems to every major club in Kosovo, more than 1,000 bars, and 100s of festivals and cultural events across the country, Albania, Montenegro and Macedonia.",
    "Our services cover event production, permanent installations, sales and brand distribution, rental, and bespoke home audio.",
    "Expertise, passion and reliability guide everything we do.",
  ],
  social: [
    { label: "Facebook", href: "https://www.facebook.com/dukaalfaaudio/" },
    { label: "Instagram", href: "https://www.instagram.com/dukalfaudio/" },
  ],
};

export const heroSlides: Slide[] = [
  {
    id: "dokufest",
    image: media.dokufest,
    alt: "A red-lit festival stage and audience beneath beams of light.",
    position: "50% 48%",
  },
  {
    id: "unum",
    image: media.unum,
    alt: "A crowd facing an illuminated outdoor stage among palm trees.",
    position: "50% 48%",
  },
  {
    id: "gate",
    image: media.gate,
    alt: "A full club audience under magenta stage lights.",
    position: "50% 46%",
  },
  {
    id: "prizren",
    image: media.prizren,
    alt: "An audience watching a live stage with green lighting.",
    position: "50% 45%",
  },
  {
    id: "beerfest",
    image: media.beerfest,
    alt: "Stage lighting reaching across a festival crowd at night.",
    position: "50% 44%",
  },
  {
    id: "dokufest-2024",
    image: media["dokufest-2024"],
    alt: "A festival stage illuminated blue beyond a crowd and trees.",
    position: "50% 48%",
  },
  {
    id: "gate-blue",
    image: media["gate-blue"],
    alt: "A club crowd beneath bright blue beams and suspended decorations.",
    position: "50% 48%",
  },
  {
    id: "gate-red",
    image: media["gate-red"],
    alt: "An illuminated club interior with red hanging decorations.",
    position: "50% 48%",
  },
  {
    id: "unum-palms",
    image: media["unum-palms"],
    alt: "A festival crowd gathered among palm trees beneath green stage lights.",
    position: "50% 48%",
  },
  {
    id: "unum-stage",
    image: media["unum-stage"],
    alt: "An outdoor festival crowd in front of an orange-lit stage structure.",
    position: "50% 48%",
  },
  {
    id: "sven-vath",
    image: media["sven-vath"],
    alt: "A live DJ stage and audience under red lights.",
    position: "50% 48%",
  },
  {
    id: "ben-klock",
    image: media["ben-klock"],
    alt: "A crowded indoor stage lit in red and blue.",
    position: "50% 48%",
  },
  {
    id: "rave-magenta",
    image: media["rave-magenta"],
    alt: "An indoor festival audience beneath magenta stage lighting.",
    position: "50% 48%",
  },
  {
    id: "stop-club",
    image: media["stop-club"],
    alt: "A club audience surrounded by blue and white light beams.",
    position: "50% 48%",
  },
];

// Supplied service summaries, retained without expanding unsupported capabilities.
export const services: Service[] = [
  {
    slug: "event-production",
    title: "Event Production",
    summary:
      "Planning and delivery of sound, lighting, stages and LED screens, with technical support throughout the event.",
    photo: {
      image: media.dokufest,
      alt: "Festival stage and audience at night.",
    },
  },
  {
    slug: "installations",
    title: "Installations",
    summary:
      "Sound and lighting systems designed and installed for clubs, hospitality and business spaces, with equipment selected for the room and its use.",
    photo: {
      image: media["gate-detail"],
      alt: "Lighting and sound equipment in a club setting.",
    },
  },
  {
    slug: "sales-distribution",
    title: "Sales & Distribution",
    summary:
      "Professional audio and lighting equipment, with advice on system design, product selection and compatibility.",
    photo: {
      image: media["gtx-12"],
      alt: "TT+ Audio GTX 12 line array module.",
    },
  },
  {
    slug: "rental",
    title: "Rental",
    summary:
      "Audio, lighting and DJ equipment for hire, from individual items to complete event setups.",
    photo: { image: media.rental, alt: "DJ equipment in use at a live event." },
  },
  {
    slug: "bespoke-home-audio",
    title: "Bespoke Home Audio",
    parent: "installations",
    summary:
      "High-end hi-fi, whole-home audio and home cinema systems, designed and installed around your space, listening preferences and everyday life.",
  },
];

// Context comes from supplied project copy. Duka contribution/capacity stays optional.
export const stories: Story[] = [
  {
    slug: "dokufest",
    title: "DokuFest",
    introduction:
      "DokuFest brings documentary and short film to Prizren, alongside the DokuNights music programme and other festival activities.",
    tags: ["Festival", "Prizren"],
    photo: {
      image: media.dokufest,
      alt: "DokuFest stage and audience at night.",
      position: "50% 48%",
    },
    gallery: [
      {
        image: media["dokufest-detail"],
        alt: "A view of the DokuFest stage lighting from the audience.",
      },
    ],
  },
  {
    slug: "unum-festival",
    title: "UNUM Festival",
    introduction:
      "UNUM is an electronic music festival in Shëngjin, Albania, with stages set along the coast and among the pine trees.",
    tags: ["Festival", "Shëngjin", "Albania"],
    photo: {
      image: media.unum,
      alt: "UNUM festival crowd and illuminated stage.",
      position: "50% 48%",
    },
    gallery: [
      { image: media["unum-detail"], alt: "UNUM stage lit green at night." },
    ],
  },
  {
    slug: "gate-club",
    title: "Gate Club",
    introduction:
      "Gate Club is a Prishtina nightclub with a programme of DJ nights and guest performances.",
    tags: ["Club", "Prishtina"],
    photo: {
      image: media.gate,
      alt: "Gate Club audience beneath magenta lights.",
    },
    gallery: [
      {
        image: media["gate-detail"],
        alt: "Beams of light across the Gate Club ceiling.",
      },
    ],
  },
  {
    slug: "beerfest-kosova",
    title: "Beerfest Kosova",
    introduction:
      "Beerfest Kosova combines live music, local and international beers, and food in a festival setting in Prishtina.",
    tags: ["Festival", "Prishtina"],
    photo: {
      image: media.beerfest,
      alt: "Beerfest stage and crowd under white lights.",
    },
  },
];

export const partners: Partner[] = [
  {
    slug: "tt-audio",
    name: "TT+ Audio",
    logo: "/partners/tt-audio.png",
    description: "TT+ Audio is our main live gear brand.",
  },
  { slug: "rcf", name: "RCF", logo: "/partners/rcf.png" },
  {
    slug: "electro-voice",
    name: "Electro-Voice",
    logo: "/partners/electro-voice.png",
  },
  { slug: "dynacord", name: "Dynacord", logo: "/partners/dynacord.png" },
  { slug: "audac", name: "AUDAC", logo: "/partners/audac.png" },
  { slug: "hk-audio", name: "HK Audio", logo: "/partners/hk-audio.png" },
  { slug: "work-pro", name: "WORK PRO", logo: "/partners/work-pro.png" },
  { slug: "alphatheta", name: "AlphaTheta", logo: "/partners/alphatheta.png" },
];

// Equipment quantities are review placeholders until the client supplies inventory.
export const equipmentGroups: EquipmentGroup[] = [
  {
    id: "sound",
    title: "Sound",
    summary: "+100 speakers",
    items: [
      {
        name: "TT+ Audio GTX 12",
        description: "Three-way line array module.",
        photo: {
          image: media["gtx-12"],
          alt: "TT+ Audio GTX 12 line array module.",
        },
      },
      {
        name: "TT+ Audio GTS 29",
        description: "High-performance subwoofer.",
        photo: { image: media["gts-29"], alt: "TT+ Audio GTS 29 subwoofer." },
      },
      {
        name: "TT+ Audio TTR 16K",
        description: "Touring rack assembly.",
        photo: {
          image: media["ttr-16k"],
          alt: "TT+ Audio TTR 16K touring rack assembly.",
        },
      },
      {
        name: "Allen & Heath Avantis",
        description: "Digital mixing console.",
        photo: {
          image: media.avantis,
          alt: "Allen & Heath Avantis digital mixing console.",
        },
      },
    ],
  },
  {
    id: "rigging",
    title: "Rigging",
    summary: "+50 rigging components",
    items: [
      {
        name: "Truss & support",
        description:
          "The structure behind the setup. Dimensions and configurations are discussed for each project.",
      },
      {
        name: "Suspended sound",
        description:
          "Sound systems considered together with the space and support structure.",
      },
    ],
  },
  {
    id: "stage",
    title: "Stage",
    summary: "+100 stage modules",
    items: [
      {
        name: "Stage structures",
        description:
          "Stage layout and structure are discussed around the event and site.",
      },
    ],
  },
  {
    id: "lights",
    title: "Lights",
    summary: "+100 lighting fixtures",
    items: [
      {
        name: "Stage & club lighting",
        description:
          "Lighting systems for live events and permanent installations.",
      },
    ],
  },
  {
    id: "led-screens",
    title: "LED Screens",
    summary: "+100 LED panels",
    items: [
      {
        name: "Modular LED screens",
        description:
          "Screen configurations and content requirements are discussed for each event.",
      },
    ],
  },
];
