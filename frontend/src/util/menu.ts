export type MenuID = number;
export type MenuName = string;
export type MenuPrice = number;
export type MenuImageSrc = string;
export type MenuImageAlt = string;
export type MenuImage = { src: MenuImageSrc; alt: MenuImageAlt };
export type SectionName = "만권화밥" | "숑숑돈까스" | "위델가";
export type MenuModel = {
  id: MenuID;
  name: MenuName;
  section: SectionName;
  price: MenuPrice;
  image: MenuImage;
  photo?: "cutlet" | "pork" | "noodle" | "bibimbap";
  description?: string;
  tag?: string;
};
export type SectionModel = { name: SectionName; list: MenuModel[] };
