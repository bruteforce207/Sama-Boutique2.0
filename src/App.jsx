import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  Check,
  CheckCircle2,
  Menu,
  MessageCircle,
  MoveUpRight,
  Package,
  MapPin,
  UserRound,
  X,
} from "lucide-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth.jsx";
import {
  ButtonLink,
  FeatureCard,
  ProductStack,
  ReceiptInterface,
  SectionLabel,
  steps,
  StepGraphic,
  TillInterface,
} from "./components.jsx";
import {
  AuthRoute,
  CheckoutModalHost,
  ProtectedDashboard,
  ProtectedSubscription,
} from "./pages.jsx";

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_BASE = "https://wa.me/221784570993";
const WHATSAPP_HELLO = `${WHATSAPP_BASE}?text=${encodeURIComponent("Bonjour, je veux en savoir plus sur Sama-Boutique")}`;
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=70";
const MANIFEST_IMAGE =
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=70";

function LandingPage() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (!showIntro) return undefined;
    const timeout = window.setTimeout(() => {
      setShowIntro(false);
      const heroContent = rootRef.current?.querySelectorAll(".hero-copy > *");
      if (heroContent) gsap.set(heroContent, { clearProps: "all" });
    }, 1450);
    return () => window.clearTimeout(timeout);
  }, [showIntro]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".intro-letter", { yPercent: 110, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: 0.25, stagger: 0.025,
        })
        .to(".intro-screen", {
          yPercent: -100,
          duration: 0.5,
          delay: 0.2,
          ease: "power2.inOut",
          onComplete: () => setShowIntro(false),
        })
        .fromTo(".hero-copy > *", { y: 32, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.65, stagger: 0.1,
        }, "-=0.22");

      gsap.to(".hero-image", {
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      gsap.to(".hero-image", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.2 },
      });

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "bottom top+=90",
        onEnter: () => document.querySelector(".floating-nav")?.classList.add("nav-scrolled"),
        onLeaveBack: () => document.querySelector(".floating-nav")?.classList.remove("nav-scrolled"),
      });

      gsap.utils.toArray(".reveal").forEach((element) => {
        const cardDelay = element.matches(".protocol-card")
          ? Number(element.dataset.stepIndex || 0) * 0.12
          : 0;
        gsap.fromTo(element, { y: 28, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.75,
          delay: cardDelay,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      gsap.fromTo(".manifest-word", { opacity: 0.13 }, {
        opacity: 1,
        stagger: 0.035,
        ease: "none",
        scrollTrigger: {
          trigger: ".manifest-statement",
          start: "top 80%",
          end: "bottom 55%",
          scrub: 0.5,
        },
      });

      gsap.fromTo(".metric-value", { innerText: 0 }, {
        innerText: (index, element) => Number(element.dataset.value),
        duration: 1.6,
        snap: { innerText: 1 },
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: { trigger: ".metrics-band", start: "top 85%", once: true },
      });

      gsap.to(".ticker-track", { xPercent: -50, duration: 28, ease: "none", repeat: -1 });

      const receiptTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
      receiptTimeline
        .set(".typed-line", { clipPath: "inset(0 100% 0 0)" })
        .set(".sent-note", { autoAlpha: 0, y: 4 })
        .to(".typed-line", {
          clipPath: "inset(0 0% 0 0)",
          duration: (index, element) => Math.max(0.32, element.textContent.length * 0.035),
          stagger: 0.28,
          ease: "steps(18)",
        })
        .to(".sent-note", { autoAlpha: 1, y: 0, duration: 0.25 }, "+=0.2")
        .to(".sent-note", { autoAlpha: 0, duration: 0.2 }, "+=2");

      const cursorTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
      cursorTimeline
        .set(".demo-cursor", { left: "8%", top: "65%", autoAlpha: 0 })
        .set(".week-day:nth-child(5) .day-bar", { backgroundColor: "#e8e4dd" })
        .to(".demo-cursor", { autoAlpha: 1, duration: 0.2 })
        .to(".demo-cursor", { left: "63%", top: "49%", duration: 0.65, ease: "power2.inOut" })
        .to(".demo-cursor", { scale: 0.88, duration: 0.12 })
        .to(".week-day:nth-child(5) .day-bar", { backgroundColor: "#e63b2e", duration: 0.12 }, "<")
        .to(".demo-cursor", { scale: 1, duration: 0.15 })
        .to(".demo-cursor", { left: "56%", top: "91%", duration: 0.55, delay: 0.25, ease: "power2.inOut" })
        .to(".report-button", { scale: 0.97, duration: 0.12 }, "<")
        .to(".report-button", { scale: 1, duration: 0.18 })
        .to(".demo-cursor", { autoAlpha: 0, duration: 0.25 });

      const priceCards = gsap.utils.toArray(".price-card");
      priceCards.forEach((card) => {
        const move = (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, { rotateY: x * 5, rotateX: y * -5, transformPerspective: 900, duration: 0.35, ease: "power2.out" });
        };
        const reset = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.45, ease: "power2.out" });
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", reset);
        card._tiltCleanup = () => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", reset);
        };
      });

      gsap.fromTo(".price-amount", { y: 12, opacity: 0.3 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".pricing-grid", start: "top 82%", once: true },
      });

      const magnetic = gsap.utils.toArray(".magnetic");
      magnetic.forEach((button) => {
        const move = (event) => {
          const rect = button.getBoundingClientRect();
          gsap.to(button, {
            x: (event.clientX - rect.left - rect.width / 2) * 0.12,
            y: (event.clientY - rect.top - rect.height / 2) * 0.12,
            scale: 1.03,
            duration: 0.35,
            ease: "power2.out",
          });
        };
        const reset = () => gsap.to(button, { x: 0, y: 0, scale: 1, duration: 0.45, ease: "power2.out" });
        button.addEventListener("pointermove", move);
        button.addEventListener("pointerleave", reset);
        button._magneticCleanup = () => {
          button.removeEventListener("pointermove", move);
          button.removeEventListener("pointerleave", reset);
        };
      });

      const cursor = document.querySelector(".custom-cursor");
      if (cursor && window.matchMedia("(pointer: fine)").matches) {
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.22, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.22, ease: "power3" });
        const follow = (event) => {
          xTo(event.clientX);
          yTo(event.clientY);
        };
        window.addEventListener("pointermove", follow);
        cursor._followCleanup = () => window.removeEventListener("pointermove", follow);
      }
    }, root);

    return () => {
      root.querySelectorAll(".price-card").forEach((card) => card._tiltCleanup?.());
      root.querySelectorAll(".magnetic").forEach((button) => button._magneticCleanup?.());
      root.querySelector(".custom-cursor")?._followCleanup?.();
      ctx.revert();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell" ref={rootRef}>
      <div className="noise-overlay" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <div className="custom-cursor" aria-hidden="true"><i /></div>

      {showIntro && (
        <div className="intro-screen" aria-hidden="true">
          <div className="intro-name">
            {"Sama-Boutique".split("").map((letter, index) => (
              <span className="intro-letter" key={`${letter}-${index}`}>{letter === " " ? "\u00a0" : letter}</span>
            ))}
          </div>
          <span className="intro-caption">LE COMMERCE, SANS LES COMPLICATIONS.</span>
        </div>
      )}

      <nav className="floating-nav" aria-label="Navigation principale">
        <a className="brand-lockup" href="#accueil" onClick={closeMenu} aria-label="Sama-Boutique, accueil">
          <span className="brand-mark">S<span>.</span></span>
          <span>Sama-Boutique</span>
        </a>
        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          <a href="#fonctionnalites" onClick={closeMenu}>Fonctionnalités</a>
          <a href="#protocole" onClick={closeMenu}>Comment ça marche</a>
          <a href="#tarifs" onClick={closeMenu}>Tarifs</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </div>
        <ButtonLink href="/connexion" className="nav-cta">
          <span>Commencer</span><ArrowRight size={15} />
        </ButtonLink>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      <main>
        <section className="hero" id="accueil" ref={heroRef}>
          <img className="hero-image" src={HERO_IMAGE} alt="Rayonnages d'un entrepôt de commerce" fetchPriority="high" />
          <div className="hero-shade" />
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-copy">
            <div className="hero-eyebrow"><span className="live-dot" /> FAIT POUR LES COMMERCES D’ICI</div>
            <h1>Gérez votre stock sans y penser.<br /><em>Fini les cahiers.</em></h1>
            <p>Chaque vente met votre stock à jour. Envoyez un reçu professionnel à votre client sur WhatsApp, en un clic.</p>
            <div className="hero-actions">
              <ButtonLink href="/connexion">Commencer <ArrowRight size={17} /></ButtonLink>
              <a className="hero-whatsapp" href={WHATSAPP_HELLO}><MessageCircle size={17} /> Parler à l’équipe</a>
            </div>
            <div className="hero-meta">
              <span><MapPin size={14} /> Guédiawaye, Dakar</span>
              <span className="hero-meta-divider" />
              <span>POUR VOTRE BOUTIQUE</span>
            </div>
          </div>
          <a className="scroll-cue" href="#fonctionnalites" aria-label="Défiler vers les fonctionnalités">
            <span>FAITES DÉFILER</span><ArrowDown size={16} />
          </a>
          <span className="hero-index">01 — 04</span>
        </section>

        <section className="metrics-band" aria-label="Sama-Boutique en chiffres">
          <div className="metric-item">
            <strong><span className="metric-value" data-value="3">0</span><i>+</i></strong>
            <span>caisses suivies</span>
          </div>
          <span className="metric-separator" />
          <div className="metric-item">
            <strong><span className="metric-value" data-value="1">0</span><i> clic</i></strong>
            <span>pour envoyer un reçu</span>
          </div>
          <span className="metric-separator" />
          <div className="metric-item">
            <strong><span className="metric-value" data-value="0">0</span><i> calcul</i></strong>
            <span>à faire à la main</span>
          </div>
          <div className="metrics-note">CONÇU POUR<br />LE QUOTIDIEN <ArrowDownRight size={16} /></div>
        </section>

        <section className="features section-pad" id="fonctionnalites">
          <div className="section-heading reveal">
            <SectionLabel number="01">LES BONS OUTILS</SectionLabel>
            <div className="section-title-row">
              <h2>La boutique tourne.<br /><em>Vous gardez le fil.</em></h2>
              <p>Moins de comptes à refaire. Plus de temps pour vos clients. Tout ce qu’il faut, au même endroit.</p>
            </div>
          </div>
          <div className="feature-grid">
            <FeatureCard
              number="FONCTION 01"
              title="Un stock toujours à jour."
              description="Chaque vente met à jour les quantités. Une alerte vous prévient avant la rupture."
            >
              <ProductStack />
            </FeatureCard>
            <FeatureCard
              number="FONCTION 02"
              title="Le reçu part sur WhatsApp."
              description="Un reçu au nom de votre boutique, envoyé à votre client en un clic."
            >
              <ReceiptInterface />
            </FeatureCard>
            <FeatureCard
              number="FONCTION 03"
              title="Vos caisses sous contrôle."
              description="Suivez les ventes jour par jour et caisse par caisse, sans calculer à la main."
            >
              <TillInterface />
            </FeatureCard>
          </div>
        </section>

        <div className="ticker" aria-label="Stock à jour, reçus WhatsApp, caisses sous contrôle, fait au Sénégal">
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <div className="ticker-group" key={copy} aria-hidden={copy === 1}>
                <span>Stock à jour</span><i>✳</i><span>Reçus WhatsApp</span><i>✳</i>
                <span>Caisses sous contrôle</span><i>✳</i><span>Fait au Sénégal</span><i>✳</i>
              </div>
            ))}
          </div>
        </div>

        <section className="manifest" id="manifeste">
          <img className="manifest-image" src={MANIFEST_IMAGE} alt="Texture sombre de béton brut" loading="lazy" />
          <div className="manifest-wash" />
          <div className="manifest-content section-pad">
            <SectionLabel number="02" light>NOTRE MANIFESTE</SectionLabel>
            <p className="manifest-intro reveal">La plupart des logiciels de caisse misent sur les écrans compliqués et les formations interminables.</p>
            <h2 className="manifest-statement">
              {"Nous, on mise sur ".split(" ").filter(Boolean).map((word, i) => <span className="manifest-word" key={`lead-${i}`}>{word} </span>)}
              <em>
                {"la vente qui se fait toute seule.".split(" ").map((word, i) => (
                  <span className="manifest-word" key={`em-${i}`}>{word} </span>
                ))}
              </em>
            </h2>
            <div className="manifest-signoff"><span>SAMA-BOUTIQUE</span><span>LE SIMPLE, BIEN FAIT.</span></div>
          </div>
        </section>

        <section className="protocol section-pad" id="protocole">
          <div className="section-heading reveal">
            <SectionLabel number="03">COMMENT ÇA MARCHE</SectionLabel>
            <div className="section-title-row">
              <h2>Trois gestes.<br /><em>Et c’est parti.</em></h2>
              <p>Vous connaissez votre commerce. Sama-Boutique s’occupe du suivi pendant que vous le faites tourner.</p>
            </div>
          </div>
          <div className="protocol-deck">
            {steps.map((step, index) => (
              <article className={`protocol-card protocol-card-${index + 1} reveal`} data-step-index={index} key={step.number}>
                <div className="protocol-card-top">
                  <span className="protocol-step">{step.number} <i>/ 03</i></span>
                  <span className="protocol-card-type">ÉTAPE {index + 1}</span>
                </div>
                <div className="protocol-copy">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <div className={`protocol-art protocol-art-${step.graphic}`}>
                  <StepGraphic type={step.graphic} />
                </div>
                <span className="protocol-marker"><i />{step.marker}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing section-pad" id="tarifs">
          <div className="section-heading reveal">
            <SectionLabel number="04">DES TARIFS SANS SURPRISE</SectionLabel>
            <div className="section-title-row">
              <h2>La bonne taille<br /><em>pour votre boutique.</em></h2>
              <p>Choisissez selon vos caisses. Pour démarrer ou pour plusieurs points de vente, parlons-en.</p>
            </div>
          </div>
          <div className="pricing-grid">
            <article className="price-card reveal">
              <div className="price-card-top"><span>01 / PETIT COMMERCE</span><Package size={19} /></div>
              <h3>Solo</h3>
              <p className="price-for">Pour une boutique, une caisse.</p>
              <div className="price-amount"><strong>4 790</strong><span>FCFA <i>/ mois</i></span></div>
              <div className="price-divider" />
              <ul>
                <li><Check size={15} /> 1 caisse</li>
                <li><Check size={15} /> Suivi du stock et des alertes</li>
                <li><Check size={15} /> Reçus WhatsApp</li>
                <li><Check size={15} /> Suivi des ventes</li>
              </ul>
              <ButtonLink href="/connexion?next=%2Fabonnement%3Fplan%3Dsolo" secondary>Choisir Solo <ArrowRight size={16} /></ButtonLink>
            </article>
            <article className="price-card price-card-featured reveal">
              <div className="popular-badge"><i /> LE PLUS CHOISI</div>
              <div className="price-card-top"><span>02 / PETITE ÉQUIPE</span><Package size={19} /></div>
              <h3>3 Caisses</h3>
              <p className="price-for">Jusqu’à trois caisses, une équipe.</p>
              <div className="price-amount"><strong>9 900</strong><span>FCFA <i>/ mois</i></span></div>
              <div className="price-divider" />
              <ul>
                <li><Check size={15} /> Jusqu’à 3 caisses</li>
                <li><Check size={15} /> Suivi du stock et des alertes</li>
                <li><Check size={15} /> Reçus WhatsApp</li>
                <li><Check size={15} /> Ventes suivies par caisse</li>
              </ul>
              <ButtonLink href="/connexion?next=%2Fabonnement%3Fplan%3D3-caisses">Choisir 3 Caisses <ArrowRight size={16} /></ButtonLink>
            </article>
            <article className="price-card reveal">
              <div className="price-card-top"><span>03 / PLUSIEURS BOUTIQUES</span><MoveUpRight size={19} /></div>
              <h3>Multicaisse</h3>
              <p className="price-for">À partir de 4 caisses, plusieurs points de vente.</p>
              <div className="price-amount price-on-quote"><strong>Sur devis</strong></div>
              <div className="price-divider" />
              <ul>
                <li><Check size={15} /> À partir de 4 caisses</li>
                <li><Check size={15} /> Pour plusieurs points de vente</li>
                <li><Check size={15} /> Reçus WhatsApp</li>
                <li><Check size={15} /> Parlons de vos besoins</li>
              </ul>
              <ButtonLink href={`${WHATSAPP_BASE}?text=${encodeURIComponent("Bonjour, je souhaite un devis Multicaisse pour Sama-Boutique.")}`} secondary>Demander un devis <ArrowRight size={16} /></ButtonLink>
            </article>
          </div>
          <p className="pricing-note reveal"><CheckCircle2 size={15} /> Un doute sur l’offre qui vous convient ? <a href="/connexion">Commencez par créer votre espace <ArrowRight size={13} /></a></p>
        </section>

        <section className="closing-cta">
          <div className="closing-ornament" aria-hidden="true"><i /><i /><i /></div>
          <SectionLabel number="05" light>ON FAIT SIMPLE</SectionLabel>
          <h2>Votre boutique.<br /><em>Bien dans ses comptes.</em></h2>
          <p>Parlons de votre activité. On vous aide à choisir la formule qui vous ressemble.</p>
          <ButtonLink href="/connexion">Commencer <MoveUpRight size={16} /></ButtonLink>
          <span className="closing-location"><MapPin size={14} /> Guédiawaye, Dakar, Sénégal</span>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="footer-logo" href="#accueil"><span className="brand-mark">S<span>.</span></span> Sama-Boutique</a>
            <p>Le stock suit. Le reçu part.<br />Et vous, vous faites tourner la boutique.</p>
            <div className="system-status"><i /> SYSTÈME OPÉRATIONNEL</div>
          </div>
          <div className="footer-column">
            <h3>EXPLORER</h3>
            <a href="#fonctionnalites">Fonctionnalités <MoveUpRight size={13} /></a>
            <a href="#protocole">Comment ça marche <MoveUpRight size={13} /></a>
            <a href="#tarifs">Tarifs <MoveUpRight size={13} /></a>
            <a href="#manifeste">Notre manifeste <MoveUpRight size={13} /></a>
          </div>
          <div className="footer-column footer-legal">
            <h3>INFORMATIONS</h3>
            <a href="mailto:mouhamadoub275@gmail.com?subject=Demande%20de%20mentions%20l%C3%A9gales">Mentions légales <MoveUpRight size={13} /></a>
            <a href="mailto:mouhamadoub275@gmail.com?subject=Demande%20de%20politique%20de%20confidentialit%C3%A9">Confidentialité <MoveUpRight size={13} /></a>
            <a href="mailto:mouhamadoub275@gmail.com?subject=Demande%20des%20conditions%20g%C3%A9n%C3%A9rales">Conditions d’utilisation <MoveUpRight size={13} /></a>
          </div>
          <div className="footer-column footer-contact">
            <h3>ON EST À VOTRE ÉCOUTE</h3>
            <span><UserRound size={16} /> Mouhamadou BA</span>
            <a href="https://wa.me/221784570993"><MessageCircle size={16} /> +221 78 457 09 93 <MoveUpRight size={13} /></a>
            <a href="mailto:mouhamadoub275@gmail.com">mouhamadoub275@gmail.com <MoveUpRight size={13} /></a>
            <span><MapPin size={16} /> Guédiawaye, Dakar, Sénégal</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SAMA-BOUTIQUE</span>
          <span>FAIT AVEC SOIN À DAKAR <i>✳</i></span>
          <a href="#accueil">RETOUR EN HAUT <ArrowDown size={14} /></a>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/connexion" element={<AuthRoute />} />
          <Route path="/abonnement" element={<ProtectedSubscription />} />
          <Route path="/app" element={<ProtectedDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <CheckoutModalHost />
      </AuthProvider>
    </BrowserRouter>
  );
}
