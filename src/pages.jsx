import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  LogOut,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { RequireAuth, useAuth } from "./auth.jsx";
import {
  isDemoMode,
  signInWithGoogle,
  signInWithPassword,
  signInWithPhone,
  signOut,
  signUpWithPassword,
  verifyPhoneOtp,
} from "./lib/auth.js";
import { startCheckout, subscribeToCheckout } from "./lib/checkout.js";

function BrandLink({ dark = false }) {
  return (
    <Link className={`brand-lockup route-brand ${dark ? "route-brand-dark" : ""}`} to="/" aria-label="Sama-Boutique, accueil">
      <span className="brand-mark">S<span>.</span></span>
      <span>Sama-Boutique</span>
    </Link>
  );
}

function routeAfterLogin(searchParams) {
  const next = searchParams.get("next");
  if (next?.startsWith("/") && !next.startsWith("//")) return next;
  const plan = searchParams.get("plan");
  return plan ? `/abonnement?plan=${encodeURIComponent(plan)}` : "/abonnement";
}

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { session, setSession } = useAuth();
  const [method, setMethod] = useState("email");
  const [emailMode, setEmailMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+221 ");
  const [code, setCode] = useState("");
  const [waitingForCode, setWaitingForCode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const destination = useMemo(() => routeAfterLogin(searchParams), [searchParams]);

  useEffect(() => {
    if (session) navigate(destination, { replace: true });
  }, [session, destination, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get("plan");
    if (plan && !params.has("next")) {
      params.set("next", `/abonnement?plan=${plan}`);
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  async function submitTask(task) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await task();
      if (result?.user || result?.access_token) {
        setSession(result.session ?? result);
        navigate(destination, { replace: true });
      } else if (result?.session) {
        setSession(result.session);
        navigate(destination, { replace: true });
      } else if (result?.needsEmailConfirmation) {
        setNotice("Un lien de confirmation vient d’être envoyé à votre adresse e-mail.");
      } else if (result?.notice) {
        setNotice(result.notice);
      }
    } catch (taskError) {
      setError(taskError.message || "La connexion a échoué. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();
    await submitTask(async () => {
      if (emailMode === "signup") {
        const result = await signUpWithPassword(email, password);
        if (result?.session) return result.session;
        if (isDemoMode) return result;
        return { needsEmailConfirmation: true };
      }
      return signInWithPassword(email, password);
    });
  }

  async function handlePhoneSubmit(event) {
    event.preventDefault();
    if (waitingForCode) {
      await submitTask(() => verifyPhoneOtp(phone.trim(), code.trim()));
      return;
    }
    await submitTask(async () => {
      await signInWithPhone(phone.trim());
      setWaitingForCode(true);
      return { notice: isDemoMode ? "Code démo : 123456. Saisissez-le pour continuer." : "Le code SMS a été envoyé. Vérifiez vos messages." };
    });
  }

  return (
    <section className="login-panel">
      <div className="login-panel-heading">
        <span className="auth-eyebrow"><i /> VOTRE BOUTIQUE, À PORTÉE DE MAIN</span>
        <h1>On reprend<br /><em>où vous en étiez.</em></h1>
        <p>Connectez-vous pour retrouver votre stock et vos ventes.</p>
      </div>

      {isDemoMode && (
        <div className="demo-callout">
          <span className="demo-callout-icon"><CheckCircle2 size={17} /></span>
          <span><strong>Mode démo</strong><small>Essayez les parcours sans créer de compte ni recevoir de SMS.</small></span>
        </div>
      )}

      <button
        className="google-signin"
        type="button"
        disabled={busy}
        onClick={() => submitTask(async () => {
          const redirectTo = `${window.location.origin}/connexion?next=${encodeURIComponent(destination)}`;
          const result = await signInWithGoogle(redirectTo);
          if (isDemoMode) return result;
          return { notice: "Redirection vers Google…" };
        })}
      >
        <span className="google-g" aria-hidden="true">G</span>
        Continuer avec Google
        <ArrowRight size={16} />
      </button>

      <div className="auth-divider"><span>OU AVEC VOS IDENTIFIANTS</span></div>

      <div className="auth-tabs" role="tablist" aria-label="Choisir une méthode de connexion">
        <button type="button" role="tab" aria-selected={method === "email"} className={method === "email" ? "active" : ""} onClick={() => { setMethod("email"); setError(""); setNotice(""); }}>
          <Mail size={15} /> E-mail
        </button>
        <button type="button" role="tab" aria-selected={method === "phone"} className={method === "phone" ? "active" : ""} onClick={() => { setMethod("phone"); setError(""); setNotice(""); }}>
          <Phone size={15} /> Téléphone
        </button>
      </div>

      {error && <div className="form-feedback form-error" role="alert">{error}</div>}
      {notice && <div className="form-feedback form-notice" role="status">{notice}</div>}

      {method === "email" ? (
        <form className="auth-form" onSubmit={handleEmailSubmit}>
          <label htmlFor="auth-email">Adresse e-mail</label>
          <div className="input-wrap"><Mail size={16} /><input id="auth-email" type="email" autoComplete="email" placeholder="vous@boutique.sn" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          <label htmlFor="auth-password">Mot de passe</label>
          <div className="input-wrap"><LockKeyhole size={16} /><input id="auth-password" type="password" autoComplete={emailMode === "signup" ? "new-password" : "current-password"} placeholder="6 caractères minimum" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? "Un instant…" : emailMode === "signup" ? "Créer mon compte" : "Continuer par e-mail"}
            <ArrowRight size={16} />
          </button>
          <button className="auth-switch" type="button" onClick={() => { setEmailMode(emailMode === "signup" ? "signin" : "signup"); setError(""); setNotice(""); }}>
            {emailMode === "signup" ? "J’ai déjà un compte" : "Créer un compte avec mon e-mail"}
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handlePhoneSubmit}>
          <label htmlFor="auth-phone">Numéro de téléphone</label>
          <div className="input-wrap"><Phone size={16} /><input id="auth-phone" type="tel" autoComplete="tel" placeholder="+221 77 000 00 00" value={phone} onChange={(event) => setPhone(event.target.value)} required /></div>
          {waitingForCode && <>
            <label htmlFor="auth-code">Code reçu par SMS</label>
            <div className="input-wrap"><ShieldCheck size={16} /><input id="auth-code" inputMode="numeric" autoComplete="one-time-code" placeholder="6 chiffres" maxLength="6" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} required /></div>
          </>}
          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? "Un instant…" : waitingForCode ? "Vérifier le code" : "Recevoir un code SMS"}
            <ArrowRight size={16} />
          </button>
          {waitingForCode && <button className="auth-switch" type="button" onClick={() => { setWaitingForCode(false); setCode(""); setError(""); setNotice(""); }}>Changer de numéro</button>}
        </form>
      )}

      {isDemoMode && (
        <button
          className="demo-login-button"
          type="button"
          disabled={busy}
          onClick={() => submitTask(() => signInWithGoogle(`${window.location.origin}/connexion?next=${encodeURIComponent(destination)}`))}
        >
          <CheckCircle2 size={15} /> Entrer directement en mode démo
        </button>
      )}

      <p className="auth-terms">En continuant, vous acceptez les conditions d’utilisation de Sama-Boutique.</p>
    </section>
  );
}

export function LoginPage() {
  return (
    <main className="auth-layout">
      <div className="auth-art">
        <div className="auth-art-grid" />
        <BrandLink />
        <div className="auth-art-copy">
          <span>01 — VOTRE COMMERCE, EN CLAIR</span>
          <h2>Le stock suit.<br /><em>Vous respirez.</em></h2>
          <p>Les ventes, les quantités, les reçus : tout reste à sa place.</p>
        </div>
        <div className="auth-art-index">S / 01</div>
      </div>
      <div className="auth-form-side">
        <Link to="/" className="back-home"><ArrowLeft size={15} /> Retour au site</Link>
        <LoginForm />
        <span className="auth-side-location">GUÉDIAWAYE · DAKAR, SÉNÉGAL</span>
      </div>
    </main>
  );
}

const plans = [
  {
    id: "solo",
    name: "Solo",
    price: "4 790",
    unit: "FCFA / mois",
    summary: "Une caisse pour votre boutique.",
    features: ["1 caisse", "Suivi du stock et alertes", "Reçus WhatsApp", "Suivi des ventes"],
  },
  {
    id: "3-caisses",
    name: "3 Caisses",
    price: "9 900",
    unit: "FCFA / mois",
    summary: "Jusqu’à trois caisses, une équipe.",
    features: ["Jusqu’à 3 caisses", "Suivi du stock et alertes", "Reçus WhatsApp", "Ventes suivies par caisse"],
    popular: true,
  },
  {
    id: "multicaisse",
    name: "Multicaisse",
    price: "Sur devis",
    unit: "4 caisses ou plus",
    summary: "Pour plusieurs caisses et points de vente.",
    features: ["À partir de 4 caisses", "Plusieurs points de vente", "Reçus WhatsApp", "Une formule adaptée à vos besoins"],
    quote: true,
  },
];

export function SubscriptionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const chosenPlan = searchParams.get("plan") || "3-caisses";
  const user = useAuth().session?.user;

  function choosePlan(plan) {
    setSearchParams({ plan }, { replace: true });
    startCheckout(plan);
  }

  return (
    <main className="account-page">
      <header className="account-header">
        <BrandLink dark />
        <Link to="/app" className="account-header-link">Mon espace <ArrowRight size={15} /></Link>
      </header>
      <section className="subscription-content">
        <div className="subscription-heading">
          <span className="auth-eyebrow"><i /> ÉTAPE 02 — VOTRE FORMULE</span>
          <h1>Choisissez votre<br /><em>rythme.</em></h1>
          <p>Votre compte est prêt{user?.email ? `, ${user.email}` : ""}. Choisissez l’offre adaptée à vos caisses.</p>
        </div>
        <div className="subscription-grid">
          {plans.map((plan) => (
            <article className={`subscription-card ${plan.popular ? "subscription-card-featured" : ""} ${chosenPlan === plan.id ? "subscription-card-selected" : ""}`} key={plan.id}>
              {plan.popular && <span className="subscription-badge">LE PLUS CHOISI</span>}
              <span className="plan-kicker">{plan.id === "solo" ? "POUR DÉMARRER" : "POUR VOTRE ÉQUIPE"}</span>
              <h2>{plan.name}</h2>
              <p>{plan.summary}</p>
              <div className={`subscription-price ${plan.quote ? "subscription-price-quote" : ""}`}><strong>{plan.price}</strong><span>{plan.unit}</span></div>
              <ul>{plan.features.map((feature) => <li key={feature}><Check size={15} /> {feature}</li>)}</ul>
              {plan.quote ? (
                <a className="button-link button-outline" href={`https://wa.me/221784570993?text=${encodeURIComponent("Bonjour, je souhaite un devis Multicaisse pour Sama-Boutique.")}`}>
                  <span className="button-fill" aria-hidden="true" />
                  <span className="button-content">Demander un devis <ArrowRight size={15} /></span>
                </a>
              ) : (
                <button className={`button-link ${plan.popular ? "button-primary" : "button-outline"}`} type="button" onClick={() => choosePlan(plan.id)}>
                  <span className="button-fill" aria-hidden="true" />
                  <span className="button-content">Choisir {plan.name} <ArrowRight size={15} /></span>
                </button>
              )}
            </article>
          ))}
        </div>
        <div className="subscription-note"><LockKeyhole size={15} /> Le paiement en ligne arrive bientôt. Votre formule ne sera débitée qu’après confirmation.</div>
        <Link to="/app" className="skip-subscription">Continuer vers mon espace <ArrowRight size={15} /></Link>
      </section>
    </main>
  );
}

const initialProducts = [
  { id: 1, name: "Riz parfumé · 25 kg", stock: 42, price: 12500, status: "En stock" },
  { id: 2, name: "Huile végétale · 5 L", stock: 8, price: 5500, status: "À surveiller" },
  { id: 3, name: "Sucre cristallisé · 50 kg", stock: 3, price: 18000, status: "Stock bas" },
  { id: 4, name: "Lait en poudre · 1 kg", stock: 26, price: 4200, status: "En stock" },
];

export function DashboardPage() {
  const { session, isDemoMode: demo } = useAuth();
  const [products, setProducts] = useState(initialProducts);
  const [salesToday, setSalesToday] = useState(18);
  const [turnover, setTurnover] = useState(286500);
  const [message, setMessage] = useState("");
  const user = session.user;
  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || user.phone || "Commerçant";

  async function handleSignOut() {
    try {
      await signOut();
      window.location.assign("/");
    } catch (error) {
      setMessage(error.message || "La déconnexion a échoué.");
    }
  }

  function recordSale(product) {
    if (!product.stock) {
      setMessage(`Plus de ${product.name} en stock.`);
      return;
    }
    setProducts((current) => current.map((item) => (
      item.id === product.id ? { ...item, stock: item.stock - 1 } : item
    )));
    setSalesToday((value) => value + 1);
    setTurnover((value) => value + product.price);
    setMessage(`Vente enregistrée : ${product.name}. Stock mis à jour.`);
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <BrandLink dark />
        <nav className="dashboard-nav" aria-label="Menu de l’espace">
          <Link to="/app" className="dashboard-nav-active">Vue d’ensemble</Link>
          <Link to="/abonnement">Mon abonnement</Link>
        </nav>
        <button className="logout-button" type="button" onClick={handleSignOut}><LogOut size={15} /><span>Déconnexion</span></button>
      </header>
      <section className="dashboard-content">
        <div className="dashboard-welcome">
          <div>
            <span className="auth-eyebrow"><i /> VOTRE BOUTIQUE, EN UN COUP D’ŒIL</span>
            <h1>Bonjour, <em>{displayName}.</em></h1>
            <p>Voici ce qui se passe dans votre boutique aujourd’hui.</p>
          </div>
          {demo && <span className="dashboard-demo-tag"><i /> MODE DÉMO</span>}
        </div>
        {message && <div className="dashboard-message" role="status">{message}<button type="button" aria-label="Fermer le message" onClick={() => setMessage("")}><X size={15} /></button></div>}
        <div className="dashboard-stats">
          <article><span>VENTES AUJOURD’HUI</span><strong>{salesToday}</strong><small>ventes enregistrées</small></article>
          <article><span>CHIFFRE DU JOUR</span><strong>{turnover.toLocaleString("fr-FR")} <i>FCFA</i></strong><small>mis à jour à chaque vente</small></article>
          <article><span>PRODUITS À SURVEILLER</span><strong>{products.filter((product) => product.stock <= 8).length}</strong><small>pensez à refaire le stock</small></article>
        </div>
        <section className="inventory-panel">
          <div className="inventory-heading">
            <div><span className="plan-kicker">LE MAGASIN</span><h2>Votre stock</h2></div>
            <button type="button" className="inventory-add" onClick={() => setMessage("L’ajout de nouveaux produits sera disponible dans votre espace complet.")}><Plus size={15} /> Ajouter un produit</button>
          </div>
          <div className="inventory-table">
            <div className="inventory-row inventory-row-head"><span>PRODUIT</span><span>QUANTITÉ</span><span>ÉTAT</span><span>ACTION</span></div>
            {products.map((product) => (
              <div className="inventory-row" key={product.id}>
                <strong><Package size={17} />{product.name}</strong>
                <span>{product.stock} <small>unités</small></span>
                <span className={`inventory-status ${product.stock <= 3 ? "status-low" : product.stock <= 8 ? "status-watch" : ""}`}><i />{product.stock <= 3 ? "Stock bas" : product.stock <= 8 ? "À surveiller" : product.status}</span>
                <button type="button" onClick={() => recordSale(product)} disabled={!product.stock}><Plus size={14} /> Vente</button>
              </div>
            ))}
          </div>
        </section>
        <div className="dashboard-bottom-row">
          <div className="dashboard-tip"><MessageCircle size={18} /><div><strong>Un client vient d’acheter ?</strong><span>Envoyez-lui un reçu professionnel sur WhatsApp depuis le détail de sa vente.</span></div><ArrowRight size={16} /></div>
          <Link to="/abonnement" className="dashboard-plan-link"><CreditCard size={17} /><span>Voir mon offre</span><ArrowRight size={14} /></Link>
        </div>
      </section>
      <footer className="dashboard-footer"><span>SAMA-BOUTIQUE · GUÉDIAWAYE, DAKAR</span><span><i /> ESPACE OPÉRATIONNEL</span></footer>
    </main>
  );
}

export function CheckoutModalHost() {
  const [checkout, setCheckout] = useState(null);

  useEffect(() => subscribeToCheckout(setCheckout), []);

  useEffect(() => {
    if (!checkout) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setCheckout(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [checkout]);

  if (!checkout) return null;

  return (
    <div className="checkout-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckout(null); }}>
      <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button className="checkout-close" type="button" aria-label="Fermer" onClick={() => setCheckout(null)}><X size={19} /></button>
        <span className="checkout-icon"><CreditCard size={23} /></span>
        <span className="plan-kicker">VOTRE FORMULE · {checkout.name.toUpperCase()}</span>
        <h2 id="checkout-title">Le paiement arrive<br /><em>bientôt.</em></h2>
        <p>Votre choix est enregistré. Le paiement en ligne sera bientôt disponible sur Sama-Boutique. Aucun montant ne vous sera débité aujourd’hui.</p>
        <div className="checkout-safe"><ShieldCheck size={16} /> Paiement sécurisé bientôt disponible</div>
        <button className="auth-submit" type="button" onClick={() => setCheckout(null)}>Compris <Check size={16} /></button>
      </section>
    </div>
  );
}

export function AuthRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return <main className="route-loading" aria-live="polite">Vérification de votre session…</main>;
  if (session) {
    const next = new URLSearchParams(location.search).get("next");
    if (next?.startsWith("/") && !next.startsWith("//")) {
      return <Navigate to={next} replace />;
    }
    return <Navigate to="/abonnement" replace />;
  }
  return <LoginPage />;
}

export function ProtectedSubscription() {
  return <RequireAuth><SubscriptionPage /></RequireAuth>;
}

export function ProtectedDashboard() {
  return <RequireAuth><DashboardPage /></RequireAuth>;
}
