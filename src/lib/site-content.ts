// Add the exact business email when supplied. An empty value opens a blank email draft without inventing an address.
export const CONTACT_EMAIL = "";
// Add the supplied portrait asset URL here when available. Leave empty to display the circular photo placeholder.
export const PROFILE_PHOTO = "";

// Platform homepages are placeholders, not personal profiles. Replace with actual profile URLs when supplied.
// Optional LinkedIn and X only appear once their URLs are added.
export const SOCIAL_LINKS = [
  { name: "GitHub", url: "https://github.com/" },
  { name: "Instagram", url: "https://www.instagram.com/" },
  { name: "Facebook", url: "https://www.facebook.com/" },
  { name: "LinkedIn", url: "" },
  { name: "X", url: "" },
];

export const NAV_ITEMS = [
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Work", id: "work" },
  { label: "Process", id: "process" },
  { label: "Contact", id: "contact" },
];

export const SERVICES = [
  { number: "01", icon: "globe", title: "Business websites", description: "A clear, professional online home for your business, with the pages and details your customers need." },
  { number: "02", icon: "layout", title: "Landing pages", description: "Focused pages built around one idea, offer, or campaign with a clear path to get in touch." },
  { number: "03", icon: "user", title: "Personal portfolios", description: "A distinctive space to show your work, tell your story, and make a memorable first impression." },
  { number: "04", icon: "code", title: "Webpages & custom UI", description: "Thoughtful page layouts and tailored interfaces designed around your content and goals." },
  { number: "05", icon: "phone", title: "Responsive design", description: "Layouts carefully adapted for phones, tablets, and desktops so every visitor feels at home." },
  { number: "06", icon: "search", title: "SEO-ready structure", description: "Semantic headings, descriptive page details, and a solid technical starting point for discoverability." },
];

export const PROJECTS = [
  { number: "01", name: "SDcart", category: "E-commerce practice project", description: "An exploration of online shopping experiences, from product discovery to a clean storefront interface.", tags: ["E-commerce", "UI design", "Practice project"], theme: "store" },
  { number: "02", name: "Barber Shop Website", category: "Business website concept", description: "A bold digital presence concept for a local barbershop, shaped around services and easy contact.", tags: ["Business site", "Responsive", "Concept"], theme: "barber" },
  { number: "03", name: "Developer Portfolio", category: "Personal portfolio concept", description: "A considered portfolio concept that brings personality, projects, and a clear introduction together.", tags: ["Portfolio", "Web design", "Concept"], theme: "portfolio" },
];

export const PROCESS = [
  { number: "01", title: "Discuss", description: "We talk through your idea, audience, content, and what the website needs to do." },
  { number: "02", title: "Design", description: "I shape a visual direction and page structure that fits your goals." },
  { number: "03", title: "Build", description: "I turn the design into a responsive, functional website." },
  { number: "04", title: "Launch", description: "We review the final details and get your website ready to share." },
];

export const BENEFITS = [
  { number: "01", title: "Design with intention", description: "Clear layouts and thoughtful details, not a one-size-fits-all page." },
  { number: "02", title: "Made for every screen", description: "A consistent experience whether someone visits on a phone or desktop." },
  { number: "03", title: "A collaborative approach", description: "Open communication and room to shape the website around your needs." },
  { number: "04", title: "Built around your scope", description: "Project-based work that can be tailored to what you actually need." },
];