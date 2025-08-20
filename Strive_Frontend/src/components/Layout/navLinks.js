// src/components/navLinks.js
const NAV_LINKS = [
  {
    name: "Overview",
    to: "/",
    dropdown: [
      { name: "Our Identity", to: "/our-identity" },
      { name: "Beyond SMA", to: "/beyond-sma" }
    ]
  },
  {
    name: "SMA Endgame",
    to: "/sma-endgame",
    // dropdown: [
    //   { name: "Exemple 1", to: "/sma-endgame/ex1" },
    //   { name: "Exemple 2", to: "/sma-endgame/ex2" }
    // ]
  },
  {
    name: "Our Legacy",
    to: "/legacy",
    // dropdown: [
    //   { name: "Exemple 1", to: "/legacy/ex1" },
    //   { name: "Exemple 2", to: "/legacy/ex2" }
    // ]
  },
  {
    name: "Media Center",
    to: "/media-center",
    dropdown: [
      { name: "Exemple 1", to: "/media/ex1" },
      { name: "Exemple 2", to: "/media/ex2" }
    ]
  },
  {
    name: "Contact Us",
    to: "/contact"
  },
];

export default NAV_LINKS;
