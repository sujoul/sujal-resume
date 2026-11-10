import { defineTool } from "@lovable.dev/mcp-js";
import { BRAND, CONTACT_EMAIL, PROJECTS, SOCIAL_LINKS } from "../../site-content";

export default defineTool({
  name: "get_public_portfolio",
  title: "Get public portfolio",
  description: "Summarize the public portfolio, contact address, social profiles, and practice project concepts.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const projects = PROJECTS.map(({ number, name, category, description }) => ({ number, name, category, description }));
    const socialProfiles = SOCIAL_LINKS.map(({ name, url }) => ({ name, url }));
    return {
      content: [{ type: "text", text: `${BRAND} public portfolio: ${projects.map((project) => project.name).join(", ")}. Contact: ${CONTACT_EMAIL}.` }],
      structuredContent: {
        brand: BRAND,
        contact_email: CONTACT_EMAIL,
        projects,
        social_profiles: socialProfiles,
      },
    };
  },
});