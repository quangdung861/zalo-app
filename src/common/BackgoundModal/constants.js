import bg1 from "assets/backgound/img1.jpg";
import bg2 from "assets/backgound/img2.jpg";
import bg3 from "assets/backgound/img3.jpg";
import bg4 from "assets/backgound/img4.jpg";
import bg5 from "assets/backgound/img5.jpg";
import bg6 from "assets/backgound/img6.jpg";
import bg7 from "assets/backgound/img7.jpg";
import bg8 from "assets/backgound/img8.jpg";
import bg9 from "assets/backgound/img9.jpg";
import bg10 from "assets/backgound/img10.jpg";
import bg11 from "assets/backgound/img11.jpg";
import bg12 from "assets/backgound/img12.jpg";
import bg13 from "assets/backgound/img13.jpg";
import bg14 from "assets/backgound/img14.jpg";
import bg15 from "assets/backgound/img15.jpg";
import bg16 from "assets/backgound/img16.jpg";
import bg17 from "assets/backgound/img17.jpg";

import thumb1 from "assets/backgound/thumbnail/img1.webp";
import thumb2 from "assets/backgound/thumbnail/img2.webp";
import thumb3 from "assets/backgound/thumbnail/img3.webp";
import thumb4 from "assets/backgound/thumbnail/img4.webp";
import thumb5 from "assets/backgound/thumbnail/img5.webp";
import thumb6 from "assets/backgound/thumbnail/img6.webp";
import thumb7 from "assets/backgound/thumbnail/img7.webp";
import thumb8 from "assets/backgound/thumbnail/img8.webp";
import thumb9 from "assets/backgound/thumbnail/img9.webp";
import thumb10 from "assets/backgound/thumbnail/img10.webp";
import thumb11 from "assets/backgound/thumbnail/img11.webp";
import thumb12 from "assets/backgound/thumbnail/img12.webp";
import thumb13 from "assets/backgound/thumbnail/img13.webp";
import thumb14 from "assets/backgound/thumbnail/img14.webp";
import thumb15 from "assets/backgound/thumbnail/img15.webp";
import thumb16 from "assets/backgound/thumbnail/img16.webp";
import thumb17 from "assets/backgound/thumbnail/img17.webp";

const originals = [
  bg1,
  bg2,
  bg3,
  bg4,
  bg5,
  bg6,
  bg7,
  bg8,
  bg9,
  bg10,
  bg11,
  bg12,
  bg13,
  bg14,
  bg15,
  bg16,
  bg17,
];

const thumbnails = [
  thumb1,
  thumb2,
  thumb3,
  thumb4,
  thumb5,
  thumb6,
  thumb7,
  thumb8,
  thumb9,
  thumb10,
  thumb11,
  thumb12,
  thumb13,
  thumb14,
  thumb15,
  thumb16,
  thumb17,
];

export const backgoundsDefault = originals.map((original, index) => ({
  original,
  thumbnail: thumbnails[index],
}));

export const BACKGROUND_DEFAULT = 0;
export const BACKGROUND_GROUP_DEFAULT = 4;
