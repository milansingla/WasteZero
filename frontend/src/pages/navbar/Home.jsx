import { ArrowRight, ArrowUpRight, Handshake, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImpactExplorer from '../../components/Impact/ImpactExplorer';
import IndiaActivityMap from '../../components/Impact/IndiaActivityMap';

export default function Home() {
  return (
    <main className="wz-home">
      <section className="wz-hero" aria-labelledby="hero-title">
        <div className="wz-hero-copy">
          <div className="wz-eyebrow"><span className="wz-live-dot" /> Rajpura &amp; Banur · Punjab</div>
          <h1 id="hero-title">Good things<br />don’t go <em>to waste.</em></h1>
          <p className="wz-intro">Book a pickup, sort with confidence, and keep useful materials in circulation. WasteZero brings residents and local collection partners onto one simple route.</p>
          <div className="wz-actions">
            <Link to="/dashboard/pickups" className="wz-button wz-button-primary">Arrange a pickup <ArrowRight size={18} /></Link>
            <Link to="/how-it-works" className="wz-button wz-button-quiet">See how it works <ArrowUpRight size={17} /></Link>
          </div>
          <div className="wz-proofline"><ShieldCheck size={16} /><span>Community-led collection, with clear handoffs</span></div>
        </div>

        <IndiaActivityMap />
        <div className="wz-side-note"><span>01 / EVERYDAY ACTION</span><span>Small habits, cleaner streets.</span></div>
      </section>

      <ImpactExplorer />

      <section className="wz-partner-cta"><span className="wz-partner-icon"><Handshake size={23} /></span><div><span className="wz-overline">GROW THE LOCAL LOOP</span><h2>Build a cleaner community with us.</h2><p>Collection partners, housing communities, and local organizations are welcome.</p></div><a className="wz-button wz-button-partner" href="mailto:vijayshikhareteam@gmail.com?subject=WasteZero%20partnership%20inquiry">Become a partner <ArrowUpRight size={17} /></a></section>

      <footer className="wz-home-footer"><span>WasteZero <span className="wz-footer-dot">●</span> Local action, lasting change</span><span>Designed for communities and the people who keep them moving.</span></footer>
    </main>
  );
}
