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
    text: "In 2008, Selver Hasani started Duka Alfa Audio with a few used speakers. Since then, we’ve supplied sound and lighting to more than a thousand bars and to clubs across Kosovo. We’ve taken systems to DokuFest in Prizren and to festival stages on the Albanian coast. In a bar, two friends should be able to hear each other across a table. At an outdoor concert, the last row should catch the first words of a song.",
    note: {
      title: "A note from our founder",
      text: "“Designing the sound, setting up the stage and seeing a space ready for people to enjoy is the work I love. Whether it is a concert, a club night or the atmosphere in a restaurant, I want us to create the best experience that space can offer, with systems that last and work we’re proud to put our name to. Every project asks something different of us. The equipment, the acoustics of the space and the client’s wishes all shape the result. Understanding those details and taking the time to get them right is what I enjoy. I’m proud to share that work with my family, friends and trusted partners. For us, good sound and good relationships deserve the same care.”",
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
    text: "In May, Hapësira brought Boiler Room to Rilindja Warehouse in Prishtina. Local and international electronic artists shared the bill on a floor once occupied by printing presses. The venue was a natural choice for Hapësira, a Kosovo collective with an ear for unusual spaces. Listen to a break in a set in a room like this and you can pick out a voice nearby, a whistle further back and the sound of the last snare coming off the walls.",
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
    text: "In May, RAVE brought Ben Klock to AMC Hall. George Adi, Leo Lumezi and DTA joined him on the bill for a night of techno. With music this spare, a small change can carry across a whole dance floor. A hi-hat slips into the space between two kicks. The bass drops away for a few bars and you hear the crowd for a moment. We listen for those details at the back of the hall as well as up by the booth.",
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
    text: "RAVE marked its fifteenth anniversary with a summer of music in Prishtina. In July, Japanese DJ Yousuke Yukimatsu played the Palace of Youth. In August the programme continued with Sven Väth, ADIEL and Quest. Across those two bills, listeners could hear four quite different ways of building a set. Some transitions make you count the bars while you wait for the change. Others are so gradual that by the time you recognise the next record, you’ve already been dancing to it for a minute.",
    note: {
      title: "Two nights at the Palace",
      text: "In December, SUPERNOVA brought Dafina Zeqiri to Prishtina’s Palace of Youth for two concerts. The same hall had held a floor full of dancers in July. This time the centre of attention was a voice. A singer can move from a near whisper in a verse to a chorus the audience knows by heart. Up close you want to hear the breath before a line. Further back you want the words to carry clearly, even when everybody around you joins in.",
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
    text: "Eighteen years after those first speakers, we design sound for festival stages, club dance floors and people’s homes. Selver Hasani leads the technical work. Genc Hasani runs operations, Elza Hasani looks after branding and marketing, and Zani Dida works with our partners. On a concert day, our work ends when the last case is packed. A permanent installation has a different rhythm. It has to feel right when someone opens a restaurant for lunch, or puts on a favourite record at home, long after the crew has left.",
    photo: {
      image: media["unum-palms"],
      alt: "A crowd gathers beneath the palms facing an illuminated open-air stage.",
      position: "50% 54%",
    },
    layout: "full",
  },
];
