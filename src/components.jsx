import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  MessageCircle,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

const productsInitial = [
  { name: "Riz parfumé", detail: "Sac · 25 kg", count: "42", tone: "ok" },
  { name: "Huile végétale", detail: "Bidon · 5 L", count: "08", tone: "low" },
  { name: "Sucre cristallisé", detail: "Sac · 50 kg", count: "03", tone: "alert" },
];

const receiptLines = [
  "SAMA BOUTIQUE · REÇU N°0042",
  "13 oct. 2026 · 14:32",
  "--------------------------------",
  "Riz parfumé 25 kg      12 500",
  "Huile végétale 5 L       5 500",
  "--------------------------------",
  "TOTAL                  18 000 F",
  "Merci de votre achat !",
];

export function ButtonLink({ href, children, secondary = false, className = "", ...props }) {
  const sharedClassName = `button-link magnetic ${secondary ? "button-outline" : "button-primary"} ${className}`;
  const content = (
    <>
      <span className="button-fill" aria-hidden="true" />
      <span className="button-content">{children}</span>
    </>
  );

  if (href.startsWith("/")) {
    return <Link to={href} className={sharedClassName} {...props}>{content}</Link>;
  }

  return (
    <a
      href={href}
      className={sharedClassName}
      {...props}
    >
      {content}
    </a>
  );
}

export function SectionLabel({ number, children, light = false }) {
  return (
    <div className={`section-label ${light ? "section-label-light" : ""}`}>
      <span>{number}</span>
      <span className="section-label-line" />
      <span>{children}</span>
    </div>
  );
}

export function ProductStack() {
  const [products, setProducts] = useState(productsInitial);

  useEffect(() => {
    let order = [...productsInitial];
    const interval = window.setInterval(() => {
      order.unshift(order.pop());
      setProducts([...order]);
    }, 3000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="stock-interface" aria-label="Aperçu des quantités en stock">
      <div className="interface-topline">
        <span><Package size={15} /> STOCK DU MAGASIN</span>
        <span className="live-state"><i /> À JOUR</span>
      </div>
      <div className="stock-stack">
        {products.map((product, index) => (
          <div className={`product-row product-layer layer-${index}`} key={product.name}>
            <div className="product-icon"><Package size={17} /></div>
            <div className="product-copy">
              <strong>{product.name}</strong>
              <span>{product.detail}</span>
            </div>
            <div className="stock-count">
              <b>{product.count}</b>
              <span>en stock</span>
            </div>
            <i className={`stock-indicator ${product.tone}`} />
          </div>
        ))}
      </div>
      <div className="interface-footer">
        <span><span className="tiny-dot" /> 24 produits suivis</span>
        <span>Voir le stock <ArrowRight size={13} /></span>
      </div>
    </div>
  );
}

export function ReceiptInterface() {
  return (
    <div className="receipt-interface" aria-label="Aperçu d'un reçu envoyé sur WhatsApp">
      <div className="interface-topline">
        <span><MessageCircle size={15} /> REÇU WHATSAPP</span>
        <span className="typing-state"><i /> FLUX EN DIRECT</span>
      </div>
      <div className="receipt-screen">
        <div className="receipt-header">
          <div className="receipt-avatar">SB</div>
          <div><strong>Sama-Boutique</strong><span>en ligne maintenant</span></div>
          <MessageCircle size={18} className="whatsapp-mark" />
        </div>
        <div className="receipt-message">
          {receiptLines.map((line, index) => (
            <div className={`typed-line typed-line-${index}`} key={`${index}-${line}`}>
              {line}
            </div>
          ))}
          <span className="typing-cursor" aria-hidden="true" />
        </div>
        <div className="sent-note"><CheckCircle2 size={13} /> Envoyé sur WhatsApp <Check size={12} /></div>
      </div>
      <div className="interface-footer">
        <span>Message livré au client</span>
        <span>EN UN CLIC <ArrowRight size={13} /></span>
      </div>
    </div>
  );
}

export function TillInterface() {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div className="till-interface" aria-label="Aperçu du suivi des ventes par jour">
      <div className="interface-topline">
        <span><CircleHelp size={15} /> VENTES DE LA SEMAINE</span>
        <span>13 — 19 OCT.</span>
      </div>
      <div className="till-summary">
        <div><span>Ventes cette semaine</span><strong>428 500 <small>FCFA</small></strong></div>
        <span className="trend-pill">+12,8%</span>
      </div>
      <div className="week-grid">
        {days.map((day, index) => (
          <div className="week-day" key={`${day}-${index}`}>
            <span>{day}</span>
            <i className={`day-bar day-bar-${index}`} />
            <b>{String(13 + index).padStart(2, "0")}</b>
          </div>
        ))}
      </div>
      <button className="report-button" type="button">
        Voir le rapport <ArrowRight size={14} />
      </button>
      <svg className="demo-cursor" viewBox="0 0 24 28" aria-hidden="true">
        <path d="M3 2.5 20.7 17l-8 .8-4.4 7.1L3 2.5Z" fill="#111" stroke="#fff" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

export function FeatureCard({ number, title, description, children, className = "" }) {
  return (
    <article className={`feature-card reveal ${className}`}>
      <div className="feature-demo">{children}</div>
      <div className="feature-caption">
        <span className="mono-number">{number}</span>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <ArrowDownRight size={20} className="feature-arrow" />
      </div>
    </article>
  );
}

export const steps = [
  {
    number: "01",
    title: "Ajoutez vos produits.",
    description: "Notez les quantités et les prix de vos produits. Votre stock est prêt à suivre chaque vente.",
    graphic: "orbit",
    marker: "VOTRE STOCK, BIEN RANGÉ",
  },
  {
    number: "02",
    title: "Vendez, le stock suit.",
    description: "À chaque vente, les quantités se mettent à jour. Vous savez ce qu’il vous reste, sans recompter.",
    graphic: "grid",
    marker: "CHAQUE VENTE COMPTE",
  },
  {
    number: "03",
    title: "Le reçu part sur WhatsApp.",
    description: "Un clic suffit pour envoyer au client un reçu propre, au nom de votre boutique.",
    graphic: "wave",
    marker: "REÇU ENVOYÉ, CLIENT SERVI",
  },
];

export function StepGraphic({ type }) {
  if (type === "orbit") {
    return <div className="orbit-graphic"><i /><i /><i /><span><Package size={21} /></span></div>;
  }
  if (type === "grid") {
    return <div className="cells-graphic">{Array.from({ length: 25 }, (_, i) => <i key={i} />)}<span /></div>;
  }
  return (
    <svg className="wave-graphic" viewBox="0 0 400 120" role="img" aria-label="Onde de reçu envoyé">
      <path d="M0 60h68l17-31 24 62 28-45 17 14h55l17-31 24 62 28-45 17 14h105" />
      <path className="wave-glow" d="M0 60h68l17-31 24 62 28-45 17 14h55l17-31 24 62 28-45 17 14h105" />
    </svg>
  );
}
