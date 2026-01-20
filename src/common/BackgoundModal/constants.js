import img1 from "assets/backgound/img1.jpg";
import img2 from "assets/backgound/img2.jpg";
import img3 from "assets/backgound/img3.jpg";
import img4 from "assets/backgound/img4.jpg";
import img5 from "assets/backgound/img5.jpg";
import img6 from "assets/backgound/img6.jpg";
import img7 from "assets/backgound/img7.jpg";
import img8 from "assets/backgound/img8.jpg";
import img9 from "assets/backgound/img9.jpg";
import img10 from "assets/backgound/img10.jpg";
import img11 from "assets/backgound/img11.jpg";
import img12 from "assets/backgound/img12.jpg";
import img13 from "assets/backgound/img14.jpg";
import img14 from "assets/backgound/img13.jpg";
import img15 from "assets/backgound/img15.jpg";
import img16 from "assets/backgound/img16.jpg";
import img17 from "assets/backgound/img17.jpg";

const imgs = [
  img14,
  img13,
  img15,
  img16,
  img17,
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
];

export const backgoundsDefault = imgs.map((img) => ({
  original: img,
  thumbnail: img,
}));

export const BACKGROUND_DEFAULT = 0;
export const BACKGROUND_GROUP_DEFAULT = 4;
