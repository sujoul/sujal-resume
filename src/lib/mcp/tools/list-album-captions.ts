import { defineTool } from "@lovable.dev/mcp-js";
import { GALLERY_PHOTOS } from "../../site-content";

export default defineTool({
  name: "list_album_captions",
  title: "List album captions",
  description: "List the portfolio's public album captions and locations without exposing image files or storage paths.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const entries = GALLERY_PHOTOS.map(({ title, location }) => ({ title, location }));
    return {
      content: [{ type: "text", text: entries.length ? entries.map((entry) => `${entry.title} — ${entry.location}`).join("\n") : "No album captions are available." }],
      structuredContent: { entries },
    };
  },
});