import { defineMcp } from "@lovable.dev/mcp-js";
import getPublicPortfolio from "./tools/get-public-portfolio";
import listAlbumCaptions from "./tools/list-album-captions";
import listPublishedMilestones from "./tools/list-published-milestones";

export default defineMcp({
  name: "sujal-resume",
  title: "Sujal resume",
  version: "0.1.0",
  instructions: "Read-only tools for portfolio information intentionally presented on the public Sujal resume website. The tools do not access private records or image files.",
  tools: [getPublicPortfolio, listPublishedMilestones, listAlbumCaptions],
});