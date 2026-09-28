export const BRAND = "SD Infotech";
export const CONTACT_EMAIL = "SDinfotech.indian@gmail.com";

export const SOCIAL_LINKS = [
  { name: "Instagram", url: "https://www.instagram.com/i.am__sujal?stkn=MTgxbGNkZ3dvZHM1dw==", icon: "instagram" },
  { name: "YouTube", url: "https://youtube.com/@sujal_vlogs_official-og?si=oPcUiTfuTw68PaJ9", icon: "youtube" },
  { name: "X", url: "https://x.com/SD_infotech9", icon: "x" },
  { name: "GitHub", url: "https://github.com/sujoul", icon: "github" },
  { name: "Facebook", url: "https://www.facebook.com/share/1crSJ44xX8/", icon: "facebook" },
] as const;

export const NAV_ITEMS = [
  { label: "Story", id: "story" },
  { label: "Timeline", id: "timeline" },
  { label: "Album", id: "album" },
  { label: "Web work", id: "work" },
  { label: "Contact", id: "contact" },
] as const;

export const PROJECTS = [
  { number: "01", name: "SDcart", category: "E-commerce practice project", description: "A practical exploration of a clear storefront journey, from browsing products to a focused shopping experience.", theme: "store" },
  { number: "02", name: "Barber Shop Website", category: "Business website concept", description: "A strong, service-led online presence concept shaped for a local barbershop and easy customer contact.", theme: "barber" },
  { number: "03", name: "Developer Portfolio", category: "Personal portfolio concept", description: "A personal presentation concept balancing identity, project stories, and a direct path to connect.", theme: "portfolio" },
] as const;

export const MEMORY_PLACEHOLDERS = [
  { title: "Beach memory", caption: "First time on the beach.", kind: "beach" },
  { title: "Gym memory", caption: "Showing up, one session at a time.", kind: "gym" },
  { title: "Travel memory", caption: "A pause along the journey.", kind: "temple" },
  { title: "Work memory", caption: "A day at ITC — learning on the job.", kind: "work" },
] as const;

export const FALLBACK_JOURNEY = [
  { id: "education", title: "A foundation in computer applications", summary: "B.C.A. became part of the foundation for understanding digital work with more depth and intention.", date_label: "Education", location: "", details: "Studying while continuing to build practical experience.", sort_order: 1, published: true },
  { id: "practice", title: "Ideas became practical web projects", summary: "Personal concepts and practice projects became a way to turn curiosity into useful, well-considered digital experiences.", date_label: "Building", location: "", details: "Modern websites, webpages, landing pages, portfolios, and small-business websites.", sort_order: 2, published: true },
  { id: "present", title: "Building SD Infotech", summary: "Today, the focus is on professional-level web development and thoughtful project-based work while continuing to learn.", date_label: "Now", location: "", details: "Pricing depends on the deal/project work.", sort_order: 3, published: true },
  { id: "future", title: "A future shaped through meaningful work", summary: "The direction ahead is simple: keep learning, create honest work, and build digital experiences that feel personal and useful.", date_label: "Next", location: "", details: "No shortcuts—just a journey that continues to take shape.", sort_order: 4, published: true },
] as const;