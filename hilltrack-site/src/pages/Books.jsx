import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, doc, onSnapshot, runTransaction,
  serverTimestamp, query, where,
} from "firebase/firestore";
import { auth, db, signInWithGoogle, signOutUser, FIREBASE_CONFIGURED } from "../lib/firebase";
import { Container, SectionHeading } from "../components/PublicLayout";

const CLASSES = Array.from({ length: 12 }, (_, i) => ({
  id: `class${i + 1}`,
  label: `Class ${i + 1}`,
}));

function classLabel(id) {
  return id ? id.replace("class", "Class ") : "";
}

export default function Books() {
  const [user, setUser]               = useState(undefined); // undefined = auth loading
  const [books, setBooks]             = useState({});
  const [myRequest, setMyRequest]     = useState(null);
  const [wantClass, setWantClass]     = useState("");
  const [giveClass, setGiveClass]     = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Auth state
  useEffect(() => {
    if (!FIREBASE_CONFIGURED) { setUser(null); return; }
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Real-time book counts
  useEffect(() => {
    if (!FIREBASE_CONFIGURED) return;
    return onSnapshot(collection(db, "books"), (snap) => {
      const data = {};
      snap.forEach((d) => { data[d.id] = d.data(); });
      setBooks(data);
    });
  }, []);

  // My pending request
  useEffect(() => {
    if (!FIREBASE_CONFIGURED || !user) { setMyRequest(null); return; }
    const q = query(
      collection(db, "bookRequests"),
      where("studentUid", "==", user.uid),
      where("status", "==", "pending"),
    );
    return onSnapshot(q, (snap) => {
      setMyRequest(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
    });
  }, [user]);

  function available(classId) {
    const b = books[classId] || {};
    return Math.max(0, (b.current || 0) - (b.requested || 0));
  }

  async function handleRequest(e) {
    e.preventDefault();
    setFormError("");
    if (wantClass === giveClass) {
      setFormError("The class you want and the class you're giving must be different.");
      return;
    }
    setSubmitting(true);
    try {
      const bookRef   = doc(db, "books", wantClass);
      const newReqRef = doc(collection(db, "bookRequests"));
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(bookRef);
        const b    = snap.exists() ? snap.data() : { current: 0, requested: 0 };
        const avail = (b.current || 0) - (b.requested || 0);
        if (avail <= 0) throw new Error("No books available for that class right now. Please check again later.");
        tx.update(bookRef, { requested: (b.requested || 0) + 1 });
        tx.set(newReqRef, {
          studentUid:   user.uid,
          studentEmail: user.email,
          studentName:  user.displayName || user.email,
          wantClass,
          giveClass,
          status:       "pending",
          createdAt:    serverTimestamp(),
        });
      });
      setFormSuccess("Request submitted! We'll contact you at your email to arrange the exchange.");
      setWantClass("");
      setGiveClass("");
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!FIREBASE_CONFIGURED) {
    return (
      <div className="py-32" style={{ background: "var(--surface)" }}>
        <Container>
          <SectionHeading
            overline="Setup needed"
            title="Firebase not configured"
            lead="To enable the Book Exchange, open src/lib/firebase.js and fill in your Firebase project credentials. See the comments in that file for step-by-step instructions."
          />
        </Container>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="py-20" style={{ background: "var(--ink)", color: "var(--bg)" }}>
        <Container>
          <div className="overline mb-4" style={{ color: "var(--accent)" }}>Community Programme</div>
          <h1 className="font-serif-display text-5xl sm:text-6xl leading-tight">Book Exchange</h1>
          <p className="mt-6 max-w-xl text-lg" style={{ color: "#b0c4b8" }}>
            Give your old textbooks, get the ones you need — free, from your community.
            Bring last year's books; take this year's home.
          </p>
        </Container>
      </section>

      {/* Live book counts */}
      <section className="py-16">
        <Container>
          <SectionHeading
            overline="What's available"
            title="Books by Class"
            lead="Live count of available book sets. Counts update instantly as students request books, so you always see the real picture."
          />
          <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {CLASSES.map(({ id, label }) => {
              const avail = available(id);
              return (
                <div
                  key={id}
                  className="border py-6 px-3 text-center"
                  style={{
                    borderColor: "var(--line)",
                    background:  avail > 0 ? "#fff" : "var(--surface)",
                  }}
                >
                  <div
                    className="font-serif-display text-4xl"
                    style={{ color: avail > 0 ? "var(--ink)" : "var(--ink-soft)" }}
                  >
                    {avail}
                  </div>
                  <div className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>{label}</div>
                  {avail > 0 && (
                    <div className="text-xs mt-1 font-medium" style={{ color: "var(--accent)" }}>
                      available
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs" style={{ color: "var(--ink-soft)" }}>
            "Available" = books on hand minus already-pending student requests — so the count is always honest.
          </p>
        </Container>
      </section>

      {/* Request / auth */}
      <section className="py-16 border-t" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        <Container>
          {user === undefined ? (
            <p style={{ color: "var(--ink-soft)" }}>Loading…</p>
          ) : !user ? (
            /* Not signed in */
            <div className="max-w-lg">
              <SectionHeading
                overline="Request books"
                title="Sign in to request"
                lead="Use your Google account to place a request. We'll contact you to arrange the exchange."
              />
              <button
                onClick={() => signInWithGoogle().catch(() => {})}
                className="btn-primary mt-8 flex items-center gap-3 text-sm"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>
          ) : myRequest ? (
            /* Has a pending request */
            <div className="max-w-lg">
              <SectionHeading overline="Your request" title="Exchange pending" />
              <div className="mt-8 border p-6" style={{ borderColor: "var(--line)", background: "#fff" }}>
                <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                  Signed in as <strong>{user.displayName || user.email}</strong>
                </p>
                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div>
                    <div className="overline mb-2">You will give</div>
                    <div className="font-serif-display text-3xl">{classLabel(myRequest.giveClass)}</div>
                  </div>
                  <div>
                    <div className="overline mb-2">You will receive</div>
                    <div className="font-serif-display text-3xl">{classLabel(myRequest.wantClass)}</div>
                  </div>
                </div>
                <p className="mt-6 text-sm" style={{ color: "var(--ink-soft)" }}>
                  We'll reach out to <strong>{user.email}</strong> to arrange the exchange.
                </p>
              </div>
              <button onClick={signOutUser} className="btn-outline mt-4 text-sm">Sign out</button>
            </div>
          ) : (
            /* Signed in, no pending request */
            <div className="max-w-lg">
              <SectionHeading
                overline="Request books"
                title="Arrange your exchange"
                lead="Select the class books you need and confirm which class you're donating in return."
              />
              <form onSubmit={handleRequest} className="mt-8 space-y-6">
                <div>
                  <label className="overline block mb-3">Books you want</label>
                  <select
                    value={wantClass}
                    onChange={(e) => setWantClass(e.target.value)}
                    required
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "1px solid var(--line)", background: "#fff",
                      color: "var(--ink)", font: "inherit", fontSize: "14px",
                    }}
                  >
                    <option value="">— Select a class —</option>
                    {CLASSES.map(({ id, label }) => {
                      const avail = available(id);
                      return (
                        <option key={id} value={id} disabled={avail === 0}>
                          {label}{avail === 0 ? " (none available)" : ` — ${avail} available`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="overline block mb-3">Books you will give</label>
                  <select
                    value={giveClass}
                    onChange={(e) => setGiveClass(e.target.value)}
                    required
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "1px solid var(--line)", background: "#fff",
                      color: "var(--ink)", font: "inherit", fontSize: "14px",
                    }}
                  >
                    <option value="">— Select a class —</option>
                    {CLASSES.map(({ id, label }) => (
                      <option key={id} value={id}>{label}</option>
                    ))}
                  </select>
                </div>

                {formError   && <p className="text-sm" style={{ color: "var(--error)" }}>{formError}</p>}
                {formSuccess && <p className="text-sm" style={{ color: "var(--ink)" }}>{formSuccess}</p>}

                <div className="flex items-center gap-4 flex-wrap">
                  <button type="submit" disabled={submitting} className="btn-primary text-sm">
                    {submitting ? "Submitting…" : "Request books"}
                  </button>
                  <button type="button" onClick={signOutUser} className="btn-outline text-sm">
                    Sign out
                  </button>
                </div>
                <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  Signed in as {user.displayName} ({user.email})
                </p>
              </form>
            </div>
          )}
        </Container>
      </section>

      {/* How it works */}
      <section className="py-16 border-t" style={{ borderColor: "var(--line)" }}>
        <Container>
          <SectionHeading overline="How it works" title="Simple as can be" />
          <div className="mt-10 grid sm:grid-cols-3 gap-8">
            {[
              { n: "01", h: "Sign in",           p: "Log in with your Google account — takes 10 seconds." },
              { n: "02", h: "Select your books", p: "Choose the class you need and confirm which class you're giving back." },
              { n: "03", h: "We arrange it",     p: "We contact you at your email to fix a time and place for the handover." },
            ].map(({ n, h, p }) => (
              <div key={n}>
                <div className="overline" style={{ color: "var(--accent)" }}>{n}</div>
                <h3 className="font-serif-display text-2xl mt-3">{h}</h3>
                <p className="mt-3 text-sm" style={{ color: "var(--ink-soft)" }}>{p}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
