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
    hero: `${imageBase}/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85`,
    gallery: [
      `${imageBase}/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85`,
    ],
    summary:
      'A glass-lined waterfront estate with double-height living spaces, private cinema, wine room, and a sunset pool deck facing the lagoon.',
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
    hero: `${imageBase}/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=85`,
    gallery: [
      `${imageBase}/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1600&q=85`,
    ],
    summary:
      'A calm contemporary home wrapped around a tropical courtyard, built for privacy, entertaining, and quiet everyday luxury.',
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
    hero: `${imageBase}/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85`,
    gallery: [
      `${imageBase}/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=85`,
    ],
    summary:
      'A sculptural penthouse with skyline terraces, warm oak interiors, gallery walls, and an owner suite that feels like a private hotel.',
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
    hero: `${imageBase}/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85`,
    gallery: [
      `${imageBase}/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85`,
      `${imageBase}/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=85`,
    ],
    summary:
      'A refined family estate with mountain-view balconies, formal reception rooms, wellness suite, and discreet security planning.',
    details: ['Wellness room', 'Mountain views', 'Guard house', 'Landscaped grounds'],
  },
];

const heroImages = [
  properties[0].hero,
  properties[1].hero,
  properties[2].hero,
  `${imageBase}/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85`,
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
};

function AnimatedModel({ theme }) {
  const group = React.useRef();
  const accent = theme === 'dark' ? '#d5b26f' : '#1d4f49';

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.18;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
  });

  return (
    <group ref={group} rotation={[0.08, -0.25, 0]} position={[0, -0.2, 0]}>
      <ambientLight intensity={theme === 'dark' ? 1.6 : 1.9} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <mesh position={[0, -0.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.7, 72]} />
        <meshStandardMaterial color={theme === 'dark' ? '#1a1713' : '#e8dfcf'} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2.6, 1.5, 1.65]} />
        <meshStandardMaterial color={theme === 'dark' ? '#f7efe2' : '#ffffff'} roughness={0.45} />
      </mesh>
      <mesh position={[0.25, 1.05, 0]}>
        <boxGeometry args={[2.9, 0.18, 1.92]} />
        <meshStandardMaterial color={theme === 'dark' ? '#2d2a24' : '#243d3a'} roughness={0.5} />
      </mesh>
      {[-0.8, 0, 0.8].map((x) => (
        <mesh key={x} position={[x, 0.25, 0.84]}>
          <boxGeometry args={[0.38, 0.76, 0.04]} />
          <meshStandardMaterial color="#9fc5cf" metalness={0.1} roughness={0.08} transparent opacity={0.75} />
        </mesh>
      ))}
      <mesh position={[1.22, -0.15, -0.05]}>
        <boxGeometry args={[0.12, 1.18, 1.8]} />
        <meshStandardMaterial color={accent} roughness={0.35} />
      </mesh>
      <mesh position={[-1.35, -0.53, 0.55]}>
        <boxGeometry args={[0.5, 0.12, 0.34]} />
        <meshStandardMaterial color={accent} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Navbar({ theme, setTheme, activeId, onNavigate }) {
  const [open, setOpen] = useState(false);
  const items = [
    ['residences', 'Residences'],
    ['why', 'Why choose us'],
    ['testimonials', 'Testimonials'],
    ['faq', 'FAQ'],
    ['contact', 'Contact'],
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
      <motion.div className="hero-panel" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }}>
        <div className="canvas-wrap">
          <Canvas camera={{ position: [0, 1.2, 5.5], fov: 38 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.6]}>
            <AnimatedModel theme={theme} />
          </Canvas>
        </div>
        <div>
          <span>Featured now</span>
          <strong>{properties[index % properties.length].name}</strong>
          <small>{properties[index % properties.length].price} / {properties[index % properties.length].location}</small>
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
    <motion.article className="property-card" variants={fadeUp}>
      <button className="property-image-button" onClick={() => onOpen(property.id)} aria-label={`Open ${property.name}`}>
        <img src={property.hero} alt={`${property.name} exterior and interior`} />
        <span>{property.type}</span>
      </button>
      <div className="property-body">
        <div>
          <h3>{property.name}</h3>
          <p><MapPin size={15} /> {property.location}</p>
        </div>
        <strong>{property.price}</strong>
        <div className="property-meta">
          <span><BedDouble size={16} /> {property.beds}</span>
          <span><Bath size={16} /> {property.baths}</span>
          <span><Maximize2 size={16} /> {property.size}</span>
        </div>
        <button className="text-button" onClick={() => onOpen(property.id)}>
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
            <span><ShieldCheck size={18} /></span>
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

function PropertyDetail({ property, onBack }) {
  const [slide, setSlide] = useState(0);
  const image = property.gallery[slide];

  return (
    <main className="detail-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} /> Back to listings
      </button>
      <section className="detail-hero">
        <motion.img key={image} src={image} alt={`${property.name} gallery ${slide + 1}`} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} />
        <div className="detail-controls">
          <button onClick={() => setSlide((value) => (value + property.gallery.length - 1) % property.gallery.length)} aria-label="Previous image">
            <ChevronLeft size={20} />
          </button>
          <span>{slide + 1} / {property.gallery.length}</span>
          <button onClick={() => setSlide((value) => (value + 1) % property.gallery.length)} aria-label="Next image">
            <ChevronRight size={20} />
          </button>
        </div>
      </section>
      <section className="detail-content">
        <div>
          <p className="eyebrow">{property.type}</p>
          <h1>{property.name}</h1>
          <p className="detail-location"><MapPin size={17} /> {property.location}</p>
          <p>{property.summary}</p>
        </div>
        <aside>
          <strong>{property.price}</strong>
          <div className="property-meta vertical">
            <span><BedDouble size={17} /> {property.beds} bedrooms</span>
            <span><Bath size={17} /> {property.baths} bathrooms</span>
            <span><Maximize2 size={17} /> {property.size}</span>
          </div>
          <button className="primary-button" onClick={() => window.location.href = 'mailto:hello@auraestates.example?subject=Private%20viewing%20request'}>
            Request private viewing <Mail size={18} />
          </button>
        </aside>
      </section>
      <section className="detail-highlights">
        {property.details.map((detail) => (
          <article key={detail}>
            <Building2 size={20} />
            <span>{detail}</span>
          </article>
        ))}
      </section>
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
          <Listings onOpen={openProperty} />
          <WhyChooseUs />
          <CeoWords />
          <Testimonials />
          <Faq />
          <Contact />
        </main>
      )}
    </>
  );
}
