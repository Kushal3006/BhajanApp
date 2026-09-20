"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

const emptyForm = {
  id: "",
  title: "",
  titleEn: "",
  titleHi: "",
  titleGu: "",
  slug: "",
  deity: "",
  language: "Hindi",
  categoryId: "",
  description: "",
  descriptionEn: "",
  descriptionHi: "",
  descriptionGu: "",
  lyrics: "",
  lyricsEn: "",
  lyricsHi: "",
  lyricsGu: "",
  audioUrl: "",
  thumbnailUrl: "",
  duration: "",
  status: "DRAFT",
  featured: false,
};

function requestOptions(accessToken, options = {}) {
  return {
    ...options,
    cache: "no-store",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
      ...(options.headers || {}),
    },
  };
}

export default function AdminDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [bhajans, setBhajans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingKind, setUploadingKind] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedMedia, setUploadedMedia] = useState({
    audio: "",
    image: "",
  });

  const isEditing = Boolean(form.id);
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === form.categoryId),
    [categories, form.categoryId]
  );

  useEffect(() => {
    getSupabaseClient()
      .auth.getSession()
      .then(({ data }) => {
        const session = data.session;
        if (session) {
          setAccessToken(session.access_token);
          setCurrentUser(session.user);
          loadDashboard(session.access_token);
        }
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  async function signIn(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const { data, error: signInError } = await getSupabaseClient().auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !data.session) {
        throw new Error(signInError?.message || "Unable to sign in.");
      }

      setAccessToken(data.session.access_token);
      setCurrentUser(data.session.user);
      setPassword("");
      await loadDashboard(data.session.access_token);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function signOut() {
    await getSupabaseClient().auth.signOut();
    setAccessToken("");
    setCurrentUser(null);
    setBhajans([]);
    setCategories([]);
    setForm(emptyForm);
    setMessage("Signed out.");
  }

  async function loadDashboard(activeAccessToken = accessToken) {
    if (!activeAccessToken) {
      setError("Sign in with your Supabase admin account.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const [bhajansResponse, categoriesResponse] = await Promise.all([
        fetch("/api/admin/bhajans", requestOptions(activeAccessToken)),
        fetch("/api/admin/categories", requestOptions(activeAccessToken)),
      ]);
      const bhajansData = await bhajansResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (!bhajansResponse.ok) {
        throw new Error(bhajansData.error || "Unable to load bhajans.");
      }
      if (!categoriesResponse.ok) {
        throw new Error(categoriesData.error || "Unable to load categories.");
      }

      setBhajans(bhajansData);
      setCategories(categoriesData);
      setMessage("Admin dashboard connected.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function startEditing(bhajan) {
    setForm({
      id: bhajan.id,
      title: bhajan.title,
      titleEn: bhajan.titleEn || "",
      titleHi: bhajan.titleHi || "",
      titleGu: bhajan.titleGu || "",
      slug: bhajan.slug,
      deity: bhajan.deity,
      language: bhajan.language,
      categoryId: bhajan.categoryId,
      description: bhajan.description || "",
      descriptionEn: bhajan.descriptionEn || "",
      descriptionHi: bhajan.descriptionHi || "",
      descriptionGu: bhajan.descriptionGu || "",
      lyrics: bhajan.lyrics,
      lyricsEn: bhajan.lyricsEn || "",
      lyricsHi: bhajan.lyricsHi || "",
      lyricsGu: bhajan.lyricsGu || "",
      audioUrl: bhajan.audioUrl || "",
      thumbnailUrl: bhajan.thumbnailUrl || "",
      duration: bhajan.duration || "",
      status: bhajan.status,
      featured: bhajan.featured,
    });
    setUploadedMedia({ audio: "", image: "" });
    setMessage("");
    setError("");
  }

  async function saveBhajan(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const endpoint = form.id ? `/api/admin/bhajans/${form.id}` : "/api/admin/bhajans";
      const method = form.id ? "PATCH" : "POST";
      const response = await fetch(
        endpoint,
        requestOptions(accessToken, {
          method,
          body: JSON.stringify({ ...form, id: undefined }),
        })
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save bhajan.");
      }

      setForm(emptyForm);
      setUploadedMedia({ audio: "", image: "" });
      setMessage(form.id ? "Bhajan updated." : "Bhajan created.");
      await loadDashboard(accessToken);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function changeStatus(id, status) {
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/bhajans/${id}`,
        requestOptions(accessToken, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        })
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update status.");
      }

      setMessage(`Bhajan marked ${status.toLowerCase()}.`);
      await loadDashboard(accessToken);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteBhajan(bhajan) {
    const confirmed = window.confirm(
      `Delete "${bhajan.title}" permanently? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/bhajans/${bhajan.id}`,
        requestOptions(accessToken, {
          method: "DELETE",
        })
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete bhajan.");
      }

      if (form.id === bhajan.id) {
        setForm(emptyForm);
        setUploadedMedia({ audio: "", image: "" });
      }

      setMessage("Bhajan deleted.");
      await loadDashboard(accessToken);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function createCategory(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/admin/categories",
        requestOptions(accessToken, {
          method: "POST",
          body: JSON.stringify({ name: categoryName }),
        })
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create category.");
      }

      setCategoryName("");
      setMessage("Category created.");
      await loadDashboard(accessToken);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  function uploadFile(kind, event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingKind(kind);
    setUploadProgress(0);
    setMessage("");
    setError("");

    const uploadData = new FormData();
    uploadData.append("kind", kind);
    uploadData.append("file", file);

    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/upload");
    request.setRequestHeader("Authorization", "Bearer " + accessToken);

    request.upload.addEventListener("progress", (progressEvent) => {
      if (progressEvent.lengthComputable) {
        setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    });

    request.addEventListener("load", () => {
      try {
        const data = JSON.parse(request.responseText || "{}");

        if (request.status < 200 || request.status >= 300) {
          throw new Error(data.error || `Unable to upload ${kind}.`);
        }

        updateForm(kind === "audio" ? "audioUrl" : "thumbnailUrl", data.url);
        setUploadedMedia((current) => ({ ...current, [kind]: data.url }));
        setUploadProgress(100);
        setMessage(`${kind === "audio" ? "Audio" : "Thumbnail"} uploaded.`);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setUploadingKind("");
        event.target.value = "";
      }
    });

    request.addEventListener("error", () => {
      setError(`Unable to upload ${kind}.`);
      setUploadingKind("");
      event.target.value = "";
    });

    request.send(uploadData);
  }

  async function deleteMedia(kind) {
    const field = kind === "audio" ? "audioUrl" : "thumbnailUrl";
    const url = form[field];

    if (!url) {
      return;
    }

    setError("");
    setMessage("");

    try {
      if (uploadedMedia[kind] === url) {
        const response = await fetch(
          "/api/admin/upload",
          requestOptions(accessToken, {
            method: "DELETE",
            body: JSON.stringify({ kind, url }),
          })
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Unable to delete ${kind}.`);
        }
      }

      updateForm(field, "");
      setUploadedMedia((current) => ({ ...current, [kind]: "" }));
      setMessage(`${kind === "audio" ? "Audio" : "Thumbnail"} removed.`);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl bg-stone-900 p-6 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Bhakti CMS</p>
            <h1 className="mt-2 text-3xl font-bold">Admin dashboard</h1>
            <p className="mt-2 text-sm text-stone-300">Manage content before publishing it to the devotional app.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {currentUser ? (
              <>
                <span className="rounded-full border border-stone-600 px-4 py-2 text-sm text-stone-300">{currentUser.email}</span>
                <button type="button" onClick={signOut} className="rounded-full bg-stone-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-600">Sign out</button>
              </>
            ) : (
              <form onSubmit={signIn} className="flex flex-col gap-2 sm:flex-row">
                <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Admin email" className="rounded-full border border-stone-600 bg-stone-800 px-4 py-2 text-sm text-white outline-none placeholder:text-stone-400 focus:border-amber-400" />
                <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="rounded-full border border-stone-600 bg-stone-800 px-4 py-2 text-sm text-white outline-none placeholder:text-stone-400 focus:border-amber-400" />
                <button type="submit" disabled={isLoading} className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-400 disabled:opacity-60">{isLoading ? "Signing in..." : "Sign in"}</button>
              </form>
            )}
          </div>
        </header>

        {message && <p className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p>}
        {error && <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">{isEditing ? "Editing" : "Create"}</p>
                <h2 className="mt-1 text-2xl font-bold text-stone-900">{isEditing ? form.title : "New bhajan"}</h2>
              </div>
              {isEditing && <button type="button" onClick={() => setForm(emptyForm)} className="text-sm font-semibold text-stone-500 hover:text-amber-700">Clear</button>}
            </div>

            <form onSubmit={saveBhajan} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Title" className="admin-input" />
                <input required value={form.slug} onChange={(event) => updateForm("slug", event.target.value)} placeholder="Slug" className="admin-input" />
                <input required value={form.deity} onChange={(event) => updateForm("deity", event.target.value)} placeholder="Deity" className="admin-input" />
                <input value={form.language} onChange={(event) => updateForm("language", event.target.value)} placeholder="Language" className="admin-input" />
                <select required value={form.categoryId} onChange={(event) => updateForm("categoryId", event.target.value)} className="admin-input">
                  <option value="">Select category</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                <input value={form.duration} onChange={(event) => updateForm("duration", event.target.value)} placeholder="Duration e.g. 4:32" className="admin-input" />
              </div>
              <div className="space-y-3 rounded-2xl border border-stone-200 p-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-stone-700">Localized titles</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <input value={form.titleEn} onChange={(event) => updateForm("titleEn", event.target.value)} placeholder="English title" className="admin-input" />
                  <input value={form.titleHi} onChange={(event) => updateForm("titleHi", event.target.value)} placeholder="Hindi title" className="admin-input" />
                  <input value={form.titleGu} onChange={(event) => updateForm("titleGu", event.target.value)} placeholder="Gujarati title" className="admin-input" />
                </div>
              </div>
              <div className="space-y-3 rounded-2xl border border-stone-200 p-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-stone-700">Localized descriptions</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <textarea value={form.descriptionEn} onChange={(event) => updateForm("descriptionEn", event.target.value)} placeholder="English description" rows="4" className="admin-input" />
                  <textarea value={form.descriptionHi} onChange={(event) => updateForm("descriptionHi", event.target.value)} placeholder="Hindi description" rows="4" className="admin-input" />
                  <textarea value={form.descriptionGu} onChange={(event) => updateForm("descriptionGu", event.target.value)} placeholder="Gujarati description" rows="4" className="admin-input" />
                </div>
              </div>
              <div className="space-y-3 rounded-2xl border border-stone-200 p-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-stone-700">Localized lyrics</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <textarea value={form.lyricsEn} onChange={(event) => updateForm("lyricsEn", event.target.value)} placeholder="English lyrics (one line per verse)" rows="7" className="admin-input" />
                  <textarea value={form.lyricsHi} onChange={(event) => updateForm("lyricsHi", event.target.value)} placeholder="Hindi lyrics (one line per verse)" rows="7" className="admin-input" />
                  <textarea value={form.lyricsGu} onChange={(event) => updateForm("lyricsGu", event.target.value)} placeholder="Gujarati lyrics (one line per verse)" rows="7" className="admin-input" />
                </div>
                <p className="text-xs text-stone-500">Legacy title, description, and lyrics fields remain as fallback for older records.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Audio</label>
                <input type="url" value={form.audioUrl} onChange={(event) => updateForm("audioUrl", event.target.value)} placeholder="Audio URL" className="admin-input" />
                <input type="file" accept="audio/mpeg,audio/mp4,audio/wav,audio/ogg" onChange={(event) => uploadFile("audio", event)} disabled={!accessToken || uploadingKind === "audio"} className="admin-input text-sm" />
                {uploadingKind === "audio" && (
                  <div className="space-y-1">
                    <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                      <div className="h-full bg-amber-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="text-xs text-amber-700">Uploading audio: {uploadProgress}%</p>
                  </div>
                )}
                {form.audioUrl && (
                  <div className="space-y-2 rounded-2xl bg-stone-50 p-3">
                    <audio controls preload="metadata" className="w-full" src={form.audioUrl} />
                    <button type="button" onClick={() => deleteMedia("audio")} className="text-xs font-semibold text-rose-600 hover:text-rose-700">
                      Remove audio
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Thumbnail</label>
                <input type="url" value={form.thumbnailUrl} onChange={(event) => updateForm("thumbnailUrl", event.target.value)} placeholder="Thumbnail URL" className="admin-input" />
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => uploadFile("image", event)} disabled={!accessToken || uploadingKind === "image"} className="admin-input text-sm" />
                {uploadingKind === "image" && (
                  <div className="space-y-1">
                    <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                      <div className="h-full bg-amber-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="text-xs text-amber-700">Uploading thumbnail: {uploadProgress}%</p>
                  </div>
                )}
                {form.thumbnailUrl && (
                  <div className="space-y-2 rounded-2xl bg-stone-50 p-3">
                    <img src={form.thumbnailUrl} alt="Thumbnail preview" className="max-h-48 w-full rounded-xl object-cover" />
                    <button type="button" onClick={() => deleteMedia("image")} className="text-xs font-semibold text-rose-600 hover:text-rose-700">
                      Remove thumbnail
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <select value={form.status} onChange={(event) => updateForm("status", event.target.value)} className="admin-input">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                  <input type="checkbox" checked={form.featured} onChange={(event) => updateForm("featured", event.target.checked)} />
                  Featured
                </label>
              </div>
              <button type="submit" disabled={!accessToken} className="w-full rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50">
                {isEditing ? "Update bhajan" : "Create bhajan"}
              </button>
            </form>

            <form onSubmit={createCategory} className="mt-8 border-t border-stone-200 pt-6">
              <h3 className="text-lg font-bold text-stone-900">Create category</h3>
              <div className="mt-3 flex gap-2">
                <input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Category name" className="admin-input" />
                <button type="submit" disabled={!accessToken || !categoryName.trim()} className="rounded-2xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Add</button>
              </div>
              {selectedCategory && <p className="mt-2 text-xs text-stone-500">Selected: {selectedCategory.name}</p>}
            </form>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Content</p>
                <h2 className="mt-1 text-2xl font-bold text-stone-900">Bhajan library</h2>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">{bhajans.length}</span>
            </div>
            <div className="space-y-3">
              {bhajans.map((bhajan) => (
                <article key={bhajan.id} className="rounded-2xl border border-stone-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600">{bhajan.status}</span>
                        <span className="text-xs text-stone-500">{bhajan.category.name}</span>
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-stone-900">{bhajan.title}</h3>
                      <p className="text-sm text-stone-600">{bhajan.deity} · {bhajan.language}</p>
                    </div>
                    <button type="button" onClick={() => startEditing(bhajan)} className="rounded-full border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-amber-300 hover:text-amber-700">Edit</button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {bhajan.status !== "PUBLISHED" && <button type="button" onClick={() => changeStatus(bhajan.id, "PUBLISHED")} className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">Publish</button>}
                    {bhajan.status !== "DRAFT" && <button type="button" onClick={() => changeStatus(bhajan.id, "DRAFT")} className="rounded-full bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800">Move to draft</button>}
                    {bhajan.status !== "ARCHIVED" && <button type="button" onClick={() => changeStatus(bhajan.id, "ARCHIVED")} className="rounded-full bg-stone-200 px-3 py-2 text-xs font-semibold text-stone-700">Archive</button>}
                  </div>
                </article>
              ))}
              {bhajans.length === 0 && <p className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-600">Connect with the admin token to load content.</p>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
