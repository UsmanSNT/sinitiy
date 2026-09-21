import type { ImageSourcePropType } from "react-native";
import type { Listing } from "@sinity/shared";

// Serverda rasm bo'lmasa, loyihadagi namunaviy rasmlardan navbatma-navbat olinadi.
const fallbacks: ImageSourcePropType[] = [
  require("../../assets/thumbnails/digital-care.jpg"),
  require("../../assets/thumbnails/hiking.jpg"),
  require("../../assets/thumbnails/family.jpg"),
  require("../../assets/thumbnails/board-game.jpg"),
  require("../../assets/thumbnails/benefit-counseling.jpg"),
  require("../../assets/thumbnails/job-counseling.jpg"),
];

export function listingImage(listing: Listing, index: number): ImageSourcePropType {
  if (listing.images[0]) return { uri: listing.images[0] };
  return fallbacks[index % fallbacks.length];
}
