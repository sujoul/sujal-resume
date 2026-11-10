import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_published_milestones",
  title: "List published milestones",
  description: "List public journey milestones in display order; unpublished rows are not returned.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false, untrustedContentHint: true },
  handler: async () => {
    const supabase = supabaseAnon();
    const { data, error } = await supabase
      .from("journey_entries")
      .select("id, title, summary, date_label, location, details, sort_order")
      .eq("published", true)
      .order("sort_order")
      .limit(100);

    if (error) {
      return { content: [{ type: "text", text: "Published milestones are temporarily unavailable." }], isError: true };
    }

    const milestones = (data ?? []).map(({ id, title, summary, date_label, location, details, sort_order }) => ({
      id,
      title,
      summary,
      date_label,
      location,
      details,
      sort_order,
    }));

    return {
      content: [{ type: "text", text: milestones.length ? milestones.map((item) => `${item.date_label}: ${item.title}`).join("\n") : "No published milestones are available." }],
      structuredContent: { milestones },
    };
  },
});