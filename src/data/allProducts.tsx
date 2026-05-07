import jacket from "../assets/men/jacket.png";
import polo from "../assets/men/polo.png";
import shortsMen from "../assets/men/shorts.png";
import gorra from "../assets/men/gorra.png";
import angel from "../assets/men/angel.png";
import shoes from "../assets/men/shoes.png";

import blusa from "../assets/girl/blusa.png";
import converse from "../assets/girl/converse.png";
import jeans from "../assets/girl/jeans.png";

import couple from "../assets/couple/couple.png";
import black from "../assets/couple/black.png";

const allProducts = [
  // MEN
  {
    id: 1,
    name: "Chaqueta negra",
    category: "men",
    route: "/sessions/men",
    img: jacket,
  },

  {
    id: 2,
    name: "Polo hombre",
    category: "men",
    route: "/sessions/men",
    img: polo,
  },

  {
    id: 3,
    name: "Zapatos urbanos",
    category: "men",
    route: "/sessions/men",
    img: shoes,
  },
  {
    id: 4,
    name: "Shorts deportivos",
    category: "men",
    route: "/sessions/men",
    img: shortsMen, 
  },

  // GIRL
  {
    id: 4,
    name: "Blusa elegante",
    category: "girl",
    route: "/sessions/girl",
    img: blusa,
  },

  {
    id: 5,
    name: "Converse clásicos",
    category: "girl",
    route: "/sessions/girl",
    img: converse,
  },

  {
    id: 6,
    name: "Jeans modernos",
    category: "girl",
    route: "/sessions/girl",
    img: jeans,
  },

  // COUPLE
  {
    id: 7,
    name: "Couple set",
    category: "couple",
    route: "/sessions/couple",
    img: couple,
  },

  {
    id: 8,
    name: "Black match",
    category: "couple",
    route: "/sessions/couple",
    img: black,
  },
];

export default allProducts;