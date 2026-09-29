import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ImagePlus, LogOut, Plus, Save, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getAdminPortfolio, removeJourney, removeMedia, saveJourney, saveMedia, uploadMedia, type JourneyEntry, type MediaItem } from "@/lib/portfolio-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Admin — SD Infotech" }, { name: "description", content: "Manage the SD Infotech journey album and portfolio." },
    { property: "og:title", content: "Admin — SD Infotech" }, { property: "og:description", content: "SD Infotech portfolio management." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Admin,
});

const blankJourney = { title: "", summary: "", date_label: "", location: "", details: "", sort_order: 0, published: false };
const blankMedia = { title: "", caption: "", alt_text: "", date_label: "", location: "", tags: [] as string[], sort_order: 0, published: false, is_profile_photo: false, media_type: "image", storage_path: null as string | null, external_url: null as string | null };
type JourneyForm = typeof blankJourney;
type MediaForm = typeof blankMedia;

function Admin() {
  const [stage, setStage] = useState<"loading" | "login" | "claim" | "dashboard">("loading");
  const [tab, setTab] = useState<"media" | "journey">("media");
  const [journey, setJourney] = useState<JourneyEntry[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [editJourney, setEditJourney] = useState<string | null>(null);
  const [editMedia, setEditMedia] = useState<string | null>(null);
  const [journeyForm, setJourneyForm] = useState<JourneyForm>(blankJourney);
  const [mediaForm, setMediaForm] = useState<MediaForm>(blankMedia);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [userId, setUserId] = useState("");

  const refresh = useCallback(async () => {
    const data = await getAdminPortfolio();
    setJourney(data.journey); setMedia(data.media);
  }, []);
  const check = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStage("login"); return; }
    setUserId(user.id);
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (error) { setMessage(error.message); setStage("claim"); return; }
    if (!data) { setStage("claim"); return; }
    try { await refresh(); setStage("dashboard"); } catch (err) { setMessage(errorText(err)); setStage("claim"); }
  }, [refresh]);
  useEffect(() => { void check(); const { data } = supabase.auth.onAuthStateChange(() => { void check(); }); return () => data.subscription.unsubscribe(); }, [check]);
  useEffect(() => { if (!file) { setPreview(""); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);

  async function signIn(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const result = creating ? await supabase.auth.signUp({ email, password }) : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else if (creating) setMessage("Check your email to confirm the account, then sign in.");
    else void check();
  }
  async function claim() {
    setBusy(true); setMessage("");
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    setBusy(false);
    if (error) setMessage("This account is not authorized, or the administrator role has already been claimed.");
    else void check();
  }
  async function logout() {
    setStage("login"); setJourney([]); setMedia([]);
    await supabase.auth.signOut();
  }
  async function submitJourney(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try { await saveJourney(editJourney === "new" ? null : editJourney, journeyForm); await refresh(); setEditJourney(null); setJourneyForm(blankJourney); setMessage("Journey entry saved."); }
    catch (err) { setMessage(errorText(err)); } finally { setBusy(false); }
  }
  async function submitMedia(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    let newPath: string | null = null;
    try {
      if (file) newPath = await uploadMedia(file, setProgress);
      const draft = { ...mediaForm, storage_path: newPath || mediaForm.storage_path, media_type: file ? file.type.startsWith("video/") ? "video" : "image" : mediaForm.media_type };
      if (!draft.storage_path && !draft.external_url) throw new Error("Choose a photo or video before saving.");
      await saveMedia(editMedia === "new" ? null : editMedia, draft); await refresh(); setEditMedia(null); setMediaForm(blankMedia); setFile(null); setProgress(0); setMessage("Media saved.");
    } catch (err) {
      if (newPath) await supabase.storage.from("journey-media").remove([newPath]);
      setMessage(errorText(err));
    } finally { setBusy(false); }
  }
  async function deleteJourney(item: JourneyEntry) {
    if (!confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    try { await removeJourney(item.id); await refresh(); setMessage("Entry deleted."); } catch (err) { setMessage(errorText(err)); }
  }
  async function deleteMedia(item: MediaItem) {
    if (!confirm(`Delete “${item.title}” and its uploaded file? This cannot be undone.`)) return;
    try { await removeMedia(item); await refresh(); setMessage("Media deleted."); } catch (err) { setMessage(errorText(err)); }
  }
  function openJourney(item?: JourneyEntry) {
    setEditJourney(item?.id || "new");
    setJourneyForm(item ? { title: item.title, summary: item.summary, date_label: item.date_label, location: item.location, details: item.details, sort_order: item.sort_order, published: item.published } : blankJourney);
  }
  function openMedia(item?: MediaItem) {
    setEditMedia(item?.id || "new"); setFile(null); setProgress(0);
    setMediaForm(item ? { title: item.title, caption: item.caption, alt_text: item.alt_text, date_label: item.date_label, location: item.location, tags: item.tags, sort_order: item.sort_order, published: item.published, is_profile_photo: item.is_profile_photo, media_type: item.media_type, storage_path: item.storage_path, external_url: item.external_url } : blankMedia);
  }

  return <div className="min-h-screen bg-background text-foreground"><header className="border-b border-border bg-card"><div className="section-wrap flex min-h-18 items-center justify-between gap-4 py-3"><div><strong className="font-display text-lg">SD Infotech</strong><p className="text-xs text-muted-foreground">Album management</p></div><div className="flex gap-2"><Button asChild variant="outline" size="sm"><Link to="/"><ArrowLeft /> View site</Link></Button>{stage === "dashboard" || stage === "claim" ? <Button variant="ghost" size="icon" aria-label="Sign out" title="Sign out" onClick={logout}><LogOut /></Button> : null}</div></div></header>
    <main className="section-wrap py-9 md:py-14">
      {stage === "loading" && <p>Loading…</p>}
      {stage === "login" && <div className="mx-auto max-w-md"><p className="section-kicker">Private access</p><h1 className="section-heading mt-3">{creating ? "Create owner account" : "Welcome back."}</h1><p className="mt-4 text-sm leading-7 text-muted-foreground">Only the authorized SD Infotech owner can manage this album. Confirm your email before signing in.</p><form onSubmit={signIn} className="mt-8 grid gap-4"><label className="grid gap-2 text-sm">Email<input className="form-field" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></label><label className="grid gap-2 text-sm">Password<input className="form-field" type="password" required minLength={6} autoComplete={creating ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} /></label><Button disabled={busy} type="submit">{creating ? "Create account" : "Sign in"}</Button></form><Button variant="link" className="mt-4 px-0" onClick={() => { setCreating(!creating); setMessage(""); }}>{creating ? "Already have an account? Sign in" : "Set up owner account"}</Button></div>}
      {stage === "claim" && <div className="mx-auto max-w-lg"><p className="section-kicker">Owner access</p><h1 className="section-heading mt-3">Verify your access.</h1><p className="mt-4 leading-7 text-muted-foreground">The first confirmed sign-in with the designated owner email can activate the administrator role. Other accounts cannot edit this portfolio.</p><Button className="mt-7" disabled={busy} onClick={claim}>Activate owner access</Button></div>}
      {stage === "dashboard" && <><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="section-kicker">Content studio</p><h1 className="section-heading mt-3">The journey, yours to shape.</h1><p className="mt-3 text-muted-foreground">{media.length} media items · {journey.length} milestones</p></div><Button onClick={() => tab === "media" ? openMedia() : openJourney()}><Plus /> Add {tab === "media" ? "media" : "milestone"}</Button></div><div className="mt-10 flex gap-2 border-b border-border pb-3"><Button variant={tab === "media" ? "default" : "ghost"} onClick={() => setTab("media")}>Gallery</Button><Button variant={tab === "journey" ? "default" : "ghost"} onClick={() => setTab("journey")}>Timeline</Button></div>
        {tab === "media" && <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{media.map(item => <article key={item.id} className="overflow-hidden rounded-md border border-border bg-card"><div className="flex aspect-video items-center justify-center bg-secondary text-primary"><ImagePlus className="size-8" /></div><div className="p-4"><div className="flex justify-between gap-3"><strong className="font-display">{item.title}</strong><span className="text-xs text-muted-foreground">{item.published ? "Published" : "Draft"}</span></div><p className="mt-1 text-sm text-muted-foreground">{item.is_profile_photo ? "Profile portrait · " : ""}{item.media_type} · Position {item.sort_order}</p><div className="mt-4 flex gap-2"><Button variant="outline" size="sm" onClick={() => openMedia(item)}>Edit</Button><Button variant="ghost" size="icon" className="text-destructive" aria-label={`Delete ${item.title}`} onClick={() => void deleteMedia(item)}><Trash2 /></Button></div></div></article>)}{media.length === 0 && <p className="text-muted-foreground">No photos or videos yet. Add the first memory.</p>}</div>}
        {tab === "journey" && <div className="mt-7 grid gap-3">{journey.map(item => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-4"><div><p className="section-kicker">{item.date_label || "Milestone"} · {item.published ? "Published" : "Draft"}</p><strong className="font-display text-lg">{item.title}</strong><p className="text-sm text-muted-foreground">Position {item.sort_order}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => openJourney(item)}>Edit</Button><Button variant="ghost" size="icon" className="text-destructive" aria-label={`Delete ${item.title}`} onClick={() => void deleteJourney(item)}><Trash2 /></Button></div></article>)}{journey.length === 0 && <p className="text-muted-foreground">No milestones yet. The public timeline shows its introductory story until you add one.</p>}</div>}
      </>}
      {message && <p role="status" className="mt-5 rounded-md border border-border bg-secondary p-3 text-sm">{message}</p>}
    </main>
    {(editJourney || editMedia) && <div className="fixed inset-0 z-80 overflow-y-auto bg-foreground/25 p-3 sm:p-7" onClick={() => { setEditJourney(null); setEditMedia(null); }}><div className="mx-auto max-w-xl rounded-md border border-border bg-card p-5 shadow-xl sm:p-8" role="dialog" aria-modal="true" aria-label={editJourney ? "Edit milestone" : "Edit media"} onClick={e => e.stopPropagation()}><div className="mb-6 flex items-center justify-between"><h2 className="font-display text-2xl font-semibold">{editJourney ? "Milestone" : "Photo or video"}</h2><Button variant="ghost" size="sm" onClick={() => { setEditJourney(null); setEditMedia(null); }}>Close</Button></div>
      {editJourney && <form onSubmit={submitJourney} className="grid gap-4"><Field label="Title" value={journeyForm.title} onChange={value => setJourneyForm({ ...journeyForm, title: value })} required /><Field label="Short summary" value={journeyForm.summary} onChange={value => setJourneyForm({ ...journeyForm, summary: value })} multiline /><div className="grid grid-cols-2 gap-3"><Field label="Date / period" value={journeyForm.date_label} onChange={value => setJourneyForm({ ...journeyForm, date_label: value })} /><Field label="Location" value={journeyForm.location} onChange={value => setJourneyForm({ ...journeyForm, location: value })} /></div><Field label="Details" value={journeyForm.details} onChange={value => setJourneyForm({ ...journeyForm, details: value })} multiline /><Field label="Display order" type="number" value={String(journeyForm.sort_order)} onChange={value => setJourneyForm({ ...journeyForm, sort_order: Number(value) })} /><label className="flex items-center gap-2"><input type="checkbox" checked={journeyForm.published} onChange={e => setJourneyForm({ ...journeyForm, published: e.target.checked })} /> Published</label><Button disabled={busy} type="submit"><Save /> Save milestone</Button></form>}
      {editMedia && <form onSubmit={submitMedia} className="grid gap-4"><label className="grid gap-2 text-sm font-medium"><span>Photo or video {editMedia === "new" ? "(required)" : "(optional replacement)"}</span><input type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files?.[0] || null)} className="form-field h-auto" /></label>{preview && (file?.type.startsWith("video/") ? <video src={preview} controls className="max-h-52 w-full rounded-md object-contain" /> : <img src={preview} alt="Selected upload preview" className="max-h-52 w-full rounded-md object-contain" />)}{progress > 0 && <p className="text-xs text-muted-foreground"><Upload className="mr-1 inline size-3" /> Upload {progress}%</p>}<Field label="Title" value={mediaForm.title} onChange={value => setMediaForm({ ...mediaForm, title: value })} required /><Field label="Caption" value={mediaForm.caption} onChange={value => setMediaForm({ ...mediaForm, caption: value })} multiline /><Field label="Image description (alt text)" value={mediaForm.alt_text} onChange={value => setMediaForm({ ...mediaForm, alt_text: value })} /><div className="grid grid-cols-2 gap-3"><Field label="Date / period" value={mediaForm.date_label} onChange={value => setMediaForm({ ...mediaForm, date_label: value })} /><Field label="Location" value={mediaForm.location} onChange={value => setMediaForm({ ...mediaForm, location: value })} /></div><Field label="Tags (comma separated)" value={mediaForm.tags.join(", ")} onChange={value => setMediaForm({ ...mediaForm, tags: value.split(",").map(tag => tag.trim()).filter(Boolean) })} /><Field label="Display order" type="number" value={String(mediaForm.sort_order)} onChange={value => setMediaForm({ ...mediaForm, sort_order: Number(value) })} /><label className="flex items-center gap-2"><input type="checkbox" checked={mediaForm.is_profile_photo} onChange={e => setMediaForm({ ...mediaForm, is_profile_photo: e.target.checked })} /> Use as circular profile portrait</label><label className="flex items-center gap-2"><input type="checkbox" checked={mediaForm.published} onChange={e => setMediaForm({ ...mediaForm, published: e.target.checked })} /> Published</label><Button disabled={busy} type="submit"><Save /> Save media</Button></form>}
      </div></div>}
  </div>;
}
function Field({ label, value, onChange, required, multiline, type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; multiline?: boolean; type?: string }) { return <label className="grid gap-2 text-sm font-medium"><span>{label}</span>{multiline ? <textarea className="form-field" value={value} required={required} onChange={e => onChange(e.target.value)} /> : <input className="form-field" type={type} value={value} required={required} onChange={e => onChange(e.target.value)} />}</label>; }
function errorText(err: unknown) { return err instanceof Error ? err.message : "Something went wrong. Please try again."; }
