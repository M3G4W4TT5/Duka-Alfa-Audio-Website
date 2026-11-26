import { media } from "./media";
import type { Photo } from "./types";

interface HistoryCopy {
  title: string;
  text: string;
}

interface HistoryChapter extends HistoryCopy {
  year: number;
  note?: HistoryCopy;
  photo: Photo;
  layout: "portrait" | "inset" | "full";
}

// Review copy from the company overview. The photographs are selections from
// the current site and can be replaced independently of the dated entries.
export const history: HistoryChapter[] = [
  {
    year: 2008,
    title: "Our first sound system",
    text: "In 2008, Selver Hasani started Duka Alfa Audio with a few used speakers. Since then, we’ve supplied sound and lighting to more than a thousand bars and to clubs across Kosovo. Our work has taken us from DokuFest in Prizren to festival stages on the Albanian coast. We still design each system around the room, the music and the people who come to listen.",
    note: {
      title: "A note from our founder",
      text: "“Every project asks something different of us. The equipment, the acoustics of the space and the client’s wishes all shape the result. Understanding those details and taking the time to get them right is what I enjoy.”",
    },
    photo: {
      image: media.rental,
      alt: "A hand reaches across a mixing desk in the light from the stage.",
      position: "54% 50%",
    },
    layout: "portrait",
  },
  {
    year: 2019,
    title: "Inside Rilindja Warehouse",
    text: "In May, Hapësira brought Boiler Room to Prishtina. Local and international electronic artists shared a bill at Rilindja Warehouse, the city’s former printing house.",
    photo: {
      image: media["gate-detail"],
      alt: "Blue beams cross a dark club ceiling beside a suspended loudspeaker.",
      position: "49% 50%",
    },
    layout: "inset",
  },
  {
    year: 2024,
    title: "Ben Klock at AMC Hall",
    text: "In May, RAVE brought Ben Klock to AMC Hall. George Adi, Leo Lumezi and DTA joined him on the bill for a night of techno.",
    photo: {
      image: media["ben-klock"],
      alt: "Ben Klock’s name above a red-lit stage, seen from the back of the crowd.",
      position: "50% 45%",
    },
    layout: "full",
  },
  {
    year: 2025,
    title: "Fifteen years of RAVE",
    text: "RAVE marked its fifteenth anniversary in Prishtina. Yousuke Yukimatsu played the Palace of Youth in July. The August programme brought Sven Väth, ADIEL and Quest to the city.",
    note: {
      title: "Two nights at the Palace",
      text: "In December, SUPERNOVA brought Dafina Zeqiri to Prishtina’s Palace of Youth for two concerts.",
    },
    photo: {
      image: media["sven-vath"],
      alt: "Red lights above the DJ and audience at a RAVE show.",
      position: "50% 46%",
    },
    layout: "portrait",
  },
  {
    year: 2026,
    title: "Eighteen years of sound",
    text: "Today we design sound for festival stages, club dance floors and people’s homes. Selver Hasani still leads the technical work. Genc Hasani runs operations, Elza Hasani looks after branding and marketing, and Zani Dida works with our partners.",
    photo: {
      image: media["unum-palms"],
      alt: "A crowd gathers beneath the palms facing an illuminated open-air stage.",
      position: "50% 54%",
    },
    layout: "full",
  },
];
