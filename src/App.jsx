import React, { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Lenis from 'lenis';

const iconPaths = {
  ArrowLeft: ['M19 12H5', 'M12 19l-7-7 7-7'],
  ArrowRight: ['M5 12h14', 'M12 5l7 7-7 7'],
  Bath: ['M7 10V6a3 3 0 0 1 6 0v4', 'M4 11h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3Z', 'M8 19v2', 'M16 19v2'],
  BedDouble: ['M4 11V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5', 'M4 11h16v8', 'M4 19v-8', 'M8 11V8h8v3'],
  Building2: ['M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16', 'M16 8h2a2 2 0 0 1 2 2v11', 'M8 7h4', 'M8 11h4', 'M8 15h4', 'M3 21h18'],
  Check: ['M20 6 9 17l-5-5'],
  ChevronDown: ['M6 9l6 6 6-6'],
  ChevronLeft: ['M15 18l-6-6 6-6'],
  ChevronRight: ['M9 18l6-6-6-6'],
  Mail: ['M4 6h16v12H4z', 'M4 7l8 6 8-6'],
  MapPin: ['M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11Z', 'M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  Maximize2: ['M15 3h6v6', 'M21 3l-7 7', 'M9 21H3v-6', 'M3 21l7-7'],
  Menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  Moon: ['M21 13.2A8.5 8.5 0 0 1 10.8 3a7 7 0 1 0 10.2 10.2Z'],
  Phone: ['M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z'],
  Quote: ['M8 11H5a4 4 0 0 1 4-4v10H5v-6', 'M19 11h-3a4 4 0 0 1 4-4v10h-4v-6'],
  Send: ['M22 2 11 13', 'M22 2l-7 20-4-9-9-4 20-7Z'],
  ShieldCheck: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z', 'M9 12l2 2 4-5'],
  Sparkles: ['M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z', 'M5 17l.8 2.2L8 20l-2.2.8L5 23l-.8-2.2L2 20l2.2-.8L5 17Z'],
  Sun: ['M12 5V2', 'M12 22v-3', 'M5 12H2', 'M22 12h-3', 'M4.2 4.2l2.1 2.1', 'M17.7 17.7l2.1 2.1', 'M19.8 4.2l-2.1 2.1', 'M6.3 17.7l-2.1 2.1', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
  X: ['M18 6 6 18', 'M6 6l12 12'],
  Map: ['M21 3l-6 4-6-4-6 4v14l6-4 6 4 6-4V3z', 'M8 7v14', 'M16 3v14'],
  Coffee: ['M18 8h1a4 4 0 0 1 0 8h-1', 'M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z', 'M6 1v3', 'M10 1v3', 'M14 1v3'],
  Instagram: ['M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', 'M6.5 6.5h.01', 'M4 4h16v16H4z'],
  Twitter: ['M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'],
  Linkedin: ['M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z', 'M2 9h4v12H2z', 'M4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z'],
};

function IconSvg({ name, size = 18, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name].map((path) => <path key={path} d={path} />)}
    </svg>
  );
}

const makeIcon = (name) => (props) => <IconSvg name={name} {...props} />;
const ArrowLeft = makeIcon('ArrowLeft');
const ArrowRight = makeIcon('ArrowRight');
const Bath = makeIcon('Bath');
const BedDouble = makeIcon('BedDouble');
const Building2 = makeIcon('Building2');
const Check = makeIcon('Check');
const ChevronDown = makeIcon('ChevronDown');
const ChevronLeft = makeIcon('ChevronLeft');
const ChevronRight = makeIcon('ChevronRight');
const Mail = makeIcon('Mail');
const MapPin = makeIcon('MapPin');
const Maximize2 = makeIcon('Maximize2');
const Menu = makeIcon('Menu');
const Moon = makeIcon('Moon');
const Phone = makeIcon('Phone');
const Quote = makeIcon('Quote');
const Send = makeIcon('Send');
const ShieldCheck = makeIcon('ShieldCheck');
const Sparkles = makeIcon('Sparkles');
const Sun = makeIcon('Sun');
const X = makeIcon('X');
const MapIcon = makeIcon('Map');
const Coffee = makeIcon('Coffee');
const Instagram = makeIcon('Instagram');
const Twitter = makeIcon('Twitter');
const Linkedin = makeIcon('Linkedin');

const imageBase = 'https://images.unsplash.com';

const properties = [
  {
    id: 'lagos-sky-villa',
    name: 'Lagos Sky Villa',
    location: 'Banana Island, Lagos',
    price: '$2,850,000',
    beds: 6,
    baths: 7,
    size: '9,420 sq ft',
    type: 'Waterfront Villa',
    hero: `${imageBase}/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85`,
    gallery: [
      `${imageBase}/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600607687931-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85`,
    ],
    summary: 'A glass-lined waterfront estate with double-height living spaces, private cinema, wine room, and a sunset pool deck facing the lagoon.',
    details: ['Private jetty', 'Smart climate zones', 'Staff residence', 'Six-car gallery garage'],
  },
  {
    id: 'ikoyi-courtyard-house',
    name: 'Ikoyi Courtyard House',
    location: 'Old Ikoyi, Lagos',
    price: '$1,640,000',
    beds: 5,
    baths: 6,
    size: '7,180 sq ft',
    type: 'Garden Residence',
    hero: `${imageBase}/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85`,
    gallery: [
      `${imageBase}/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1600&q=85`,
    ],
    summary: 'A calm contemporary home wrapped around a tropical courtyard, built for privacy, entertaining, and quiet everyday luxury.',
    details: ['Courtyard pool', 'Chef kitchen', 'Library lounge', 'Solar backup system'],
  },
  {
    id: 'lekki-atelier-penthouse',
    name: 'Lekki Atelier Penthouse',
    location: 'Lekki Phase 1, Lagos',
    price: '$920,000',
    beds: 4,
    baths: 5,
    size: '4,850 sq ft',
    type: 'Penthouse',
    hero: `${imageBase}/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85`,
    gallery: [
      `${imageBase}/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=85`,
    ],
    summary: 'A sculptural penthouse with skyline terraces, warm oak interiors, gallery walls, and an owner suite that feels like a private hotel.',
    details: ['Private elevator', 'Rooftop terrace', 'Home automation', 'Concierge lobby'],
  },
  {
    id: 'abuja-horizon-estate',
    name: 'Abuja Horizon Estate',
    location: 'Maitama, Abuja',
    price: '$1,280,000',
    beds: 5,
    baths: 6,
    size: '6,300 sq ft',
    type: 'Executive Estate',
    hero: `${imageBase}/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85`,
    gallery: [
      `${imageBase}/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=85`,
    ],
    summary: 'A refined family estate with mountain-view balconies, formal reception rooms, wellness suite, and discreet security planning.',
    details: ['Wellness room', 'Mountain views', 'Guard house', 'Landscaped grounds'],
  },
];

const heroImages = [
  properties[0].hero,
  properties[1].hero,
  properties[2].hero,
  properties[3].hero,
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
};

function Navbar({ theme, setTheme, activeId, onNavigate }) {
  const [open, setOpen] = useState(false);
  const items = [
    ['residences', 'Residences'],
    ['why', 'Why choose us'],
    ['lifestyle', 'Lifestyle'],
    ['testimonials', 'Testimonials'],
    ['faq', 'FAQ'],
  ];

  const go = (id) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <header className="navbar">
      <button className="brand" onClick={() => go('top')} aria-label="Go to home">
        <span className="brand-mark">A</span>
        <span>Aura Estates</span>
      </button>
      <nav className={`nav-menu ${open ? 'open' : ''}`}>
        {items.map(([id, label]) => (
          <button key={id} className={`nav-link ${activeId === id ? 'active' : ''}`} onClick={() => go(id)}>
            {label}
          </button>
        ))}
      </nav>
      <div className="nav-actions">
        <div className="theme-switch" aria-label="Theme switcher">
          <button className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')} aria-label="Use light mode">
            <Sun size={16} />
          </button>
          <button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')} aria-label="Use dark mode">
            <Moon size={16} />
          </button>
        </div>
        <button className="icon-button mobile-toggle" onClick={() => setOpen((value) => !value)} aria-label="Open navigation">
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
    </header>
  );
}

function Hero({ onNavigate, theme }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setIndex((value) => (value + 1) % heroImages.length), 4200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="top" className="hero-section">
      <div className="hero-media" aria-hidden="true">
        {heroImages.map((image, imageIndex) => (
          <motion.img
            key={image}
            src={image}
            alt=""
            initial={false}
            animate={{ opacity: index === imageIndex ? 1 : 0, scale: index === imageIndex ? 1.05 : 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        ))}
      </div>
      <div className="hero-shade" />
      <motion.div className="hero-content" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
        <motion.p variants={fadeUp} className="eyebrow">
          Private advisory for exceptional homes
        </motion.p>
        <motion.h1 variants={fadeUp}>Residences selected with taste, evidence, and quiet confidence.</motion.h1>
        <motion.p variants={fadeUp} className="hero-copy">
          Explore verified luxury listings across Lagos and Abuja with image-led storytelling, transparent pricing, and a premium buying journey.
        </motion.p>
        <motion.div variants={fadeUp} className="hero-actions">
          <button className="primary-button" onClick={() => onNavigate('residences')}>
            View listings <ArrowRight size={18} />
          </button>
          <button className="secondary-button" onClick={() => onNavigate('contact')}>
            Speak with advisor <Phone size={17} />
          </button>
        </motion.div>
      </motion.div>
      <motion.div className="hero-panel" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        <div className="canvas-wrap" style={{ height: '240px', background: 'var(--surface-strong)', overflow: 'hidden' }}>
           <img src={properties[index % properties.length].hero} alt="Featured Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '20px' }}>
          <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Featured now</span>
          <strong style={{ fontSize: '1.4rem', margin: '4px 0 8px', display: 'block' }}>{properties[index % properties.length].name}</strong>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <small style={{ color: 'var(--muted)', fontSize: '0.95rem' }}><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>{properties[index % properties.length].location}</small>
            <strong style={{ color: 'var(--text)' }}>{properties[index % properties.length].price}</strong>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function StatsBand() {
  return (
    <motion.section className="stats-band" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      {[
        ['42', 'verified prime homes'],
        ['$96M', 'active portfolio value'],
        ['18', 'neighborhood data points'],
        ['24h', 'private tour scheduling'],
      ].map(([value, label]) => (
        <motion.div key={label} variants={fadeUp}>
          <strong>{value}</strong>
          <span>{label}</span>
        </motion.div>
      ))}
    </motion.section>
  );
}

function PropertyCard({ property, onOpen }) {
  return (
    <motion.article className="property-card" variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <button className="property-image-button" onClick={() => onOpen(property.id)} aria-label={`Open ${property.name}`}>
        <img src={property.hero} alt={`${property.name} exterior and interior`} />
        <span>{property.type}</span>
      </button>
      <div className="property-body" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '8px', lineHeight: 1.2 }}>{property.name}</h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
              <MapPin size={15} /> {property.location}
            </p>
          </div>
        </div>
        
        <strong style={{ fontSize: '1.5rem', color: 'var(--accent)', display: 'block', marginBottom: '20px' }}>{property.price}</strong>
        
        <div className="property-meta" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '16px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', marginBottom: '24px', flexWrap: 'nowrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}><BedDouble size={16} /> {property.beds}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}><Bath size={16} /> {property.baths}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}><Maximize2 size={16} /> {property.size}</span>
        </div>
        
        <button className="text-button" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', padding: '14px', background: 'rgba(147, 112, 219, 0.1)', borderRadius: '8px', color: 'var(--text)', transition: 'background 0.2s' }} onClick={() => onOpen(property.id)} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(147, 112, 219, 0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(147, 112, 219, 0.1)'}>
          View property <ArrowRight size={16} />
        </button>
      </div>
    </motion.article>
  );
}

function Listings({ onOpen }) {
  const [slide, setSlide] = useState(0);
  const featured = properties[slide];

  return (
    <section id="residences" className="section">
      <motion.div className="section-heading" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}>
        <p className="eyebrow">Listings and prices</p>
        <h2>Image-led property cards that move like a private catalogue.</h2>
      </motion.div>
      <div className="featured-slider">
        <button className="slider-arrow left" onClick={() => setSlide((value) => (value + properties.length - 1) % properties.length)} aria-label="Previous listing">
          <ChevronLeft size={20} />
        </button>
        <motion.div key={featured.id} className="featured-slide" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
          <img src={featured.hero} alt={featured.name} />
          <div>
            <span>{featured.type}</span>
            <h3>{featured.name}</h3>
            <p>{featured.summary}</p>
            <strong>{featured.price}</strong>
            <button className="primary-button compact" onClick={() => onOpen(featured.id)}>
              Explore details <ArrowRight size={17} />
            </button>
          </div>
        </motion.div>
        <button className="slider-arrow right" onClick={() => setSlide((value) => (value + 1) % properties.length)} aria-label="Next listing">
          <ChevronRight size={20} />
        </button>
      </div>
      <motion.div className="property-grid" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} onOpen={onOpen} />
        ))}
      </motion.div>
    </section>
  );
}

function AmenitiesLifestyle() {
  const amenities = [
    { title: "24/7 Concierge", icon: <Building2 size={24} />, desc: "Unmatched service available at any hour." },
    { title: "Smart Climate", icon: <Sun size={24} />, desc: "Intelligent zoning for perfect temperatures." },
    { title: "Private Spa", icon: <Bath size={24} />, desc: "In-house wellness and relaxation facilities." },
    { title: "Gourmet Cafe", icon: <Coffee size={24} />, desc: "Exclusive lounges and coffee bars." },
  ];

  return (
    <section id="lifestyle" className="section" style={{ background: 'var(--surface-strong)', borderRadius: '16px', padding: '60px' }}>
      <motion.div className="section-heading" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}>
        <p className="eyebrow">Amenities & Lifestyle</p>
        <h2>More than just a home. A curated living experience.</h2>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        {amenities.map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '24px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--line)' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p style={{ fontSize: '0.9rem' }}>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function NeighborhoodInsights() {
  const highlights = [
    { area: 'Ikoyi', desc: 'Home to the prestigious Ikoyi Club, world-class golf, and elite diplomatic communities.' },
    { area: 'Banana Island', desc: 'Nigeria’s most exclusive enclave. Highest security, private waterfronts, and serene roads.' },
    { area: 'Victoria Island', desc: 'The financial heartbeat. Fine dining, contemporary art galleries, and vibrant high-end retail.' },
  ];

  return (
    <section className="section split-section">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}>
        <p className="eyebrow">Neighborhood Insights</p>
        <h2>Prime locations, mapped.</h2>
        <p>Discover the finest dining, exclusive schools, and high-end shopping tailored to your new neighborhood. Our properties are situated in environments that reflect your standard of living.</p>
        
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {highlights.map((item, i) => (
            <motion.div key={item.area} variants={fadeUp} style={{ padding: '16px 20px', background: 'var(--surface-strong)', borderRadius: '12px', borderLeft: '4px solid var(--accent)' }}>
              <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '6px' }}>{item.area}</strong>
              <span style={{ fontSize: '0.95rem', color: 'var(--muted)' }}>{item.desc}</span>
            </motion.div>
          ))}
        </div>

        <button className="primary-button" style={{ marginTop: '30px' }}>Explore Full Map <MapIcon size={18} /></button>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ height: '100%', minHeight: '560px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--surface-strong)' }}>
        <iframe 
          src="https://maps.google.com/maps?q=Ikoyi,%20Lagos&t=&z=13&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0, filter: 'grayscale(100%) invert(90%) hue-rotate(180deg) contrast(1.1)' }} 
          allowFullScreen="" 
          loading="lazy" 
          title="Lagos Map"
        ></iframe>
      </motion.div>
    </section>
  );
}

function GlobalPartners() {
  const partners = [
    'Architectural Digest', 'Forbes Global Properties', 'Sotheby’s',
    'Christie’s', 'Knight Frank', 'Savills', 'Bloomberg', 'WSJ Real Estate'
  ];
  return (
    <section className="section" style={{ textAlign: 'center', padding: '80px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)' }}>
      <motion.p className="eyebrow" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={fadeUp} style={{ marginBottom: '40px', letterSpacing: '0.2em' }}>
        Trusted by global industry leaders
      </motion.p>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={{ show: { transition: { staggerChildren: 0.1 } } }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(30px, 6vw, 60px)', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
        {partners.map(p => (
          <motion.h3 key={p} variants={fadeUp} style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'serif', fontStyle: 'italic', fontWeight: '400', opacity: 0.6, transition: 'opacity 0.3s ease, transform 0.3s ease', cursor: 'default' }} onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.05)' }} onMouseOut={(e) => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.transform = 'scale(1)' }}>
            {p}
          </motion.h3>
        ))}
      </motion.div>
    </section>
  );
}

function WhyChooseUs() {
  const items = [
    ['Verified inventory', 'Every home is screened for ownership, pricing logic, and presentation quality before it appears.'],
    ['Design-literate tours', 'We read layouts, light, materials, neighborhood fit, and resale angles with you.'],
    ['Negotiation calm', 'Clear comparables and advisor notes keep offers precise instead of emotional.'],
    ['After-sale support', 'Introductions for legal, inspection, furnishing, and property management partners.'],
  ];

  return (
    <section id="why" className="section split-section">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}>
        <p className="eyebrow">Why choose us</p>
        <h2>A sharper way to buy remarkable homes.</h2>
        <p>
          Premium real estate should feel intelligent, not noisy. Aura gives buyers a focused shortlist, clear property stories, and an advisor who knows what details matter.
        </p>
      </motion.div>
      <div className="why-grid">
        {items.map(([title, text], index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 24, rotateX: -8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.08, duration: 0.55 }}
          >
            <span style={{ background: 'rgba(147, 112, 219, 0.15)' }}><ShieldCheck size={18} /></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function CeoWords() {
  return (
    <section className="ceo-section">
      <motion.div className="ceo-portrait" initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <img src={`${imageBase}/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85`} alt="CEO portrait" />
      </motion.div>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}>
        <Quote size={36} />
        <h2>Our work is to protect the buyer's imagination with facts.</h2>
        <p>
          A beautiful property can win attention in seconds. The right property keeps making sense after due diligence, after negotiation, and after the keys are handed over.
        </p>
        <strong>Taiwo Adeyemi</strong>
        <span>Chief Executive Officer, Aura Estates</span>
      </motion.div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <motion.div className="section-heading" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}>
        <p className="eyebrow">Testimonials</p>
        <h2>Buyers remember how clearly the process felt.</h2>
      </motion.div>
      <div className="testimonial-grid">
        {[
          ['Ada M.', 'Aura reduced twenty possible homes to three serious options. The final inspection notes saved us from a costly mistake.'],
          ['Khalil R.', 'The listing pages felt like editorial property reports. We understood price, lifestyle, and negotiation room before touring.'],
          ['Tomi O.', 'Quietly premium, fast, and deeply informed. The team handled the whole purchase like a private office.'],
        ].map(([name, quote], index) => (
          <motion.article
            key={name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: index * 0.1 }}
          >
            <Sparkles size={20} />
            <p>{quote}</p>
            <strong>{name}</strong>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  const questions = [
    ['Are the property prices final?', 'Prices are guide prices from the seller side. We support buyers with market comparables and negotiation strategy before any formal offer.'],
    ['Can I book a private viewing?', 'Yes. Shortlisted homes can be toured physically or by guided video walkthrough with 24 hours notice for most listings.'],
    ['Do you support international buyers?', 'Yes. We coordinate remote viewings, document review, funds planning, and local professional introductions.'],
    ['What happens on each property page?', 'Each property has a focused detail view with gallery slider, key numbers, highlights, and a direct enquiry path.'],
  ];

  return (
    <section id="faq" className="section faq-section">
      <motion.div className="section-heading" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}>
        <p className="eyebrow">FAQ</p>
        <h2>Questions serious buyers ask first.</h2>
      </motion.div>
      <div className="faq-list">
        {questions.map(([question, answer], index) => (
          <motion.article key={question} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
            <button onClick={() => setOpen(open === index ? -1 : index)}>
              <span>{question}</span>
              <ChevronDown className={open === index ? 'rotated' : ''} size={19} />
            </button>
            <motion.div initial={false} animate={{ height: open === index ? 'auto' : 0, opacity: open === index ? 1 : 0 }}>
              <p>{answer}</p>
            </motion.div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function VipNewsletter() {
  return (
    <section className="section" style={{ margin: '80px auto' }}>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={fadeUp} style={{ padding: '80px 40px', background: 'var(--gradient)', borderRadius: '16px', color: '#fff', textAlign: 'center', boxShadow: '0 24px 60px rgba(147, 112, 219, 0.3)' }}>
        <Mail size={40} style={{ margin: '0 auto 20px', opacity: 0.9 }} />
        <h2 style={{ color: '#fff', marginBottom: '10px' }}>Join the VIP Club</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: '0 auto 40px', fontSize: '1.1rem' }}>Get access to exclusive off-market listings, private tours, and architectural insights delivered straight to your inbox.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <input type="email" placeholder="Enter your email address" style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', flex: 1 }} />
          <button className="primary-button" style={{ background: '#fff', color: '#8a2be2', border: 'none', padding: '0 30px' }}>Subscribe</button>
        </div>
      </motion.div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="contact-section">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
        <p className="eyebrow">Send email</p>
        <h2>Tell us the kind of home you want.</h2>
        <p>Use the form and we will prepare a private shortlist with availability, viewing windows, and price notes.</p>
      </motion.div>
      <motion.form
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <label>
          Name
          <input required name="name" placeholder="Your full name" />
        </label>
        <label>
          Email
          <input required name="email" type="email" placeholder="you@example.com" />
        </label>
        <label>
          Budget and location
          <input name="budget" placeholder="$900k - $2m, Lagos or Abuja" />
        </label>
        <label>
          Message
          <textarea name="message" rows="4" placeholder="Bedrooms, lifestyle needs, timeline, preferred neighborhoods" />
        </label>
        <button className="primary-button" type="submit">
          {sent ? 'Request received' : 'Send enquiry'} {sent ? <Check size={18} /> : <Send size={18} />}
        </button>
      </motion.form>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: 'var(--surface-strong)', padding: '80px 0 40px', marginTop: '60px', borderTop: '1px solid var(--line)' }}>
      <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '60px', paddingBottom: '60px', borderBottom: '1px solid var(--line)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
             <span className="brand-mark">A</span>
             <strong style={{ fontSize: '1.2rem' }}>Aura Estates</strong>
          </div>
          <p style={{ fontSize: '0.95rem' }}>The premier advisory for exceptional homes in Lagos and Abuja. Private, precise, and profoundly premium.</p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Explore</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '12px', margin: 0, color: 'var(--muted)' }}>
            <li><a href="#residences" style={{ color: 'inherit', textDecoration: 'none' }}>Residences</a></li>
            <li><a href="#lifestyle" style={{ color: 'inherit', textDecoration: 'none' }}>Lifestyle</a></li>
            <li><a href="#why" style={{ color: 'inherit', textDecoration: 'none' }}>Why Aura</a></li>
            <li><a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Legal</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '12px', margin: 0, color: 'var(--muted)' }}>
            <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a></li>
            <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a></li>
            <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cookie Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Connect</h3>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--muted)' }}>
             <Instagram size={24} style={{ cursor: 'pointer' }} />
             <Twitter size={24} style={{ cursor: 'pointer' }} />
             <Linkedin size={24} style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </div>
      <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.9rem' }}>
        <span>&copy; {new Date().getFullYear()} Aura Estates. All rights reserved.</span>
        <span>Designed with precision.</span>
      </div>
    </footer>
  );
}

function PropertyDetail({ property, onBack }) {
  const [slide, setSlide] = useState(0);
  const image = property.gallery[slide];

  return (
    <main className="detail-page" style={{ padding: '0', paddingTop: '80px' }}>
      <section style={{ position: 'relative', height: '80vh', minHeight: '600px', width: '100vw', left: '50%', transform: 'translateX(-50%)' }}>
        <motion.img key={image} src={image} alt={`${property.name} gallery ${slide + 1}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to top, var(--bg) 0%, transparent 40%)' }} />
        
        <div style={{ position: 'absolute', top: '40px', left: 'max(24px, calc((100vw - 1180px) / 2))', zIndex: 10 }}>
           <button className="secondary-button" onClick={onBack} style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', backdropFilter: 'blur(10px)' }}>
            <ArrowLeft size={18} /> Back to listings
          </button>
        </div>

        <div className="detail-controls" style={{ bottom: '40px', right: 'max(24px, calc((100vw - 1180px) / 2))', padding: '12px' }}>
          <button onClick={() => setSlide((value) => (value + property.gallery.length - 1) % property.gallery.length)} aria-label="Previous image">
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{slide + 1} / {property.gallery.length}</span>
          <button onClick={() => setSlide((value) => (value + 1) % property.gallery.length)} aria-label="Next image">
            <ChevronRight size={24} />
          </button>
        </div>
      </section>
      
      <div style={{ width: 'min(1180px, calc(100% - 32px))', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '60px', padding: '60px 0' }}>
        <div>
          <p className="eyebrow" style={{ fontSize: '1rem' }}>{property.type}</p>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', margin: '10px 0 20px' }}>{property.name}</h1>
          <p className="detail-location" style={{ fontSize: '1.2rem', marginBottom: '30px' }}><MapPin size={20} /> {property.location}</p>
          
          <div style={{ padding: '30px', background: 'var(--surface-strong)', borderRadius: '16px', marginBottom: '40px' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', margin: 0 }}>{property.summary}</p>
          </div>

          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Property Highlights</h3>
          <section className="detail-highlights" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {property.details.map((detail) => (
              <article key={detail} style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                <Building2 size={24} />
                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{detail}</span>
              </article>
            ))}
          </section>
        </div>

        <aside style={{ position: 'sticky', top: '120px', alignSelf: 'start', padding: '40px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
          <span style={{ display: 'block', fontSize: '1rem', color: 'var(--muted)', marginBottom: '10px' }}>Asking Price</span>
          <strong style={{ display: 'block', fontSize: '2.8rem', color: 'var(--accent)', marginBottom: '30px' }}>{property.price}</strong>
          
          <div className="property-meta vertical" style={{ gap: '20px', marginBottom: '40px' }}>
            <span style={{ fontSize: '1.1rem' }}><BedDouble size={20} /> {property.beds} bedrooms</span>
            <span style={{ fontSize: '1.1rem' }}><Bath size={20} /> {property.baths} bathrooms</span>
            <span style={{ fontSize: '1.1rem' }}><Maximize2 size={20} /> {property.size}</span>
          </div>
          
          <button className="primary-button" style={{ width: '100%', height: '56px', fontSize: '1.1rem' }} onClick={() => window.location.href = 'mailto:hello@auraestates.example?subject=Private%20viewing%20request'}>
            Request private viewing <Mail size={20} />
          </button>
        </aside>
      </div>
    </main>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('aura-theme') || 'dark');
  const [activeId, setActiveId] = useState('top');
  const [path, setPath] = useState(() => window.location.pathname.replace('/', ''));

  const selectedProperty = useMemo(() => properties.find((property) => property.id === path), [path]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aura-theme', theme);
  }, [theme]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let frame;
    function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname.replace('/', ''));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigateTo = (id) => {
    if (selectedProperty) {
      window.history.pushState({}, '', '/');
      setPath('');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveId(id);
  };

  const openProperty = (id) => {
    window.history.pushState({}, '', `/${id}`);
    setPath(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backHome = () => {
    window.history.pushState({}, '', '/');
    setPath('');
    setTimeout(() => document.getElementById('residences')?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} activeId={activeId} onNavigate={navigateTo} />
      {selectedProperty ? (
        <PropertyDetail property={selectedProperty} onBack={backHome} />
      ) : (
        <main>
          <Hero onNavigate={navigateTo} theme={theme} />
          <StatsBand />
          <GlobalPartners />
          <Listings onOpen={openProperty} />
          <AmenitiesLifestyle />
          <WhyChooseUs />
          <NeighborhoodInsights />
          <CeoWords />
          <Testimonials />
          <VipNewsletter />
          <Contact />
        </main>
      )}
      <Footer />
    </>
  );
}
