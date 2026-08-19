import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type City = "Málaga" | "Valencia";
type Tab = "home" | "explore" | "saved" | "challenges" | "profile";
type Category = "Mare" | "Food" | "Nightlife" | "Avventura" | "Tramonto" | "Eventi" | "Gratis";

type Experience = {
  id: string;
  city: City;
  title: string;
  category: Category;
  subtitle: string;
  price: number;
  duration: string;
  distance: string;
  rating: string;
  available: string;
  kind: string;
  tone: string;
  included: string[];
};

const experiences: Experience[] = [
  { id: "sunset-boat", city: "Málaga", title: "Sunset Boat", category: "Tramonto", subtitle: "La luce migliore, il mare davanti.", price: 29, duration: "2h", distance: "1,4 km", rating: "4,8", available: "Oggi · 19:00", kind: "Barca", tone: "sunset", included: ["Barca", "Equipaggio", "Drink analcolico", "Assicurazione"] },
  { id: "pedregalejo", city: "Málaga", title: "Pedregalejo Sunset Walk", category: "Gratis", subtitle: "Una passeggiata lenta dove inizia il mare.", price: 0, duration: "1h 20m", distance: "1,1 km", rating: "4,7", available: "Disponibile ora", kind: "Passeggiata", tone: "sea", included: ["Itinerario", "Punti panoramici", "Mappa offline"] },
  { id: "tapas", city: "Málaga", title: "Tapas del centro", category: "Food", subtitle: "Tre assaggi per una serata che comincia bene.", price: 24, duration: "2h", distance: "500 m", rating: "4,9", available: "Oggi · 20:30", kind: "Cibo", tone: "food", included: ["3 tapas", "Guida locale", "Scelte vegetariane"] },
  { id: "kayak", city: "Málaga", title: "Kayak & Snorkeling", category: "Avventura", subtitle: "Acqua chiara, due ore solo per te.", price: 29, duration: "2h", distance: "3,2 km", rating: "4,8", available: "Domani · 10:00", kind: "Sport", tone: "water", included: ["Kayak", "Attrezzatura", "Guida", "Assicurazione"] },
  { id: "rooftop", city: "Valencia", title: "Rooftop after eight", category: "Nightlife", subtitle: "Musica morbida e la città sotto di te.", price: 12, duration: "3h", distance: "750 m", rating: "4,6", available: "Oggi · 21:00", kind: "Nightlife", tone: "night", included: ["Ingresso", "Drink di benvenuto", "DJ set"] },
  { id: "turia", city: "Valencia", title: "Turia in bici", category: "Gratis", subtitle: "Un parco che attraversa la città.", price: 0, duration: "1h 30m", distance: "900 m", rating: "4,9", available: "Disponibile ora", kind: "Natura", tone: "green", included: ["Traccia", "Punti d'acqua", "Mappa offline"] },
  { id: "horchata", city: "Valencia", title: "Horchata stop", category: "Food", subtitle: "Una pausa fresca, nel posto giusto.", price: 5, duration: "45m", distance: "350 m", rating: "4,8", available: "Disponibile ora", kind: "Cibo", tone: "cream", included: ["Horchata", "Farton", "Mini guida"] },
  { id: "sailing", city: "Valencia", title: "Sailing at golden hour", category: "Mare", subtitle: "Il porto si allontana. Il cielo cambia.", price: 32, duration: "2h", distance: "4,0 km", rating: "4,7", available: "Oggi · 19:15", kind: "Barca", tone: "blue", included: ["Barca a vela", "Skipper", "Attrezzatura"] },
];

const categories: Category[] = ["Mare", "Food", "Nightlife", "Avventura", "Tramonto", "Eventi", "Gratis"];
const interests = ["Mare", "Spiagge", "Barca", "Sport acquatici", "Food", "Cocktail", "Nightlife", "Avventura", "Tramonti", "Concerti", "Shopping", "Fotografia", "Natura", "Romantic", "Sport", "Spettacoli"];

function euros(price: number) { return price === 0 ? "Gratis" : `€${price}`; }

function App() {
  const [onboarding, setOnboarding] = useState(() => localStorage.getItem("viva-onboarded") !== "true");
  const [step, setStep] = useState(0);
  const [city, setCity] = useState<City>("Málaga");
  const [tab, setTab] = useState<Tab>("home");
  const [category, setCategory] = useState<Category | "Tutto">("Tutto");
  const [saved, setSaved] = useState<string[]>([]);
  const [selected, setSelected] = useState<Experience | null>(null);
  const [cityPicker, setCityPicker] = useState(false);
  const [interestsSelected, setInterestsSelected] = useState<string[]>(["Mare", "Food", "Tramonti"]);
  const [budget, setBudget] = useState("€30");

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  const cityExperiences = useMemo(() => experiences.filter((item) => item.city === city), [city]);
  const filtered = useMemo(() => category === "Tutto" ? cityExperiences : cityExperiences.filter((item) => item.category === category), [category, cityExperiences]);
  const toggleSaved = (id: string) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const finishOnboarding = () => { localStorage.setItem("viva-onboarded", "true"); setOnboarding(false); };

  if (onboarding) return <Onboarding step={step} setStep={setStep} city={city} setCity={setCity} selected={interestsSelected} setSelected={setInterestsSelected} budget={budget} setBudget={setBudget} finish={finishOnboarding} />;

  return <main className="app-shell">
    <section className="phone-frame">
      <header className="topbar">
        <button className="city-switch" onClick={() => setCityPicker(true)}>⌖ <span>{city}</span> <small>⌄</small></button>
        <button className="round-button" aria-label="Notifiche">◌</button>
      </header>
      {tab === "home" && <Home city={city} items={cityExperiences} category={category} setCategory={setCategory} onSelect={setSelected} saved={saved} toggleSaved={toggleSaved} />}
      {tab === "explore" && <Explore city={city} items={filtered} onSelect={setSelected} saved={saved} toggleSaved={toggleSaved} />}
      {tab === "saved" && <Saved city={city} items={experiences.filter((item) => saved.includes(item.id))} onSelect={setSelected} toggleSaved={toggleSaved} />}
      {tab === "challenges" && <Challenges />}
      {tab === "profile" && <Profile city={city} budget={budget} interests={interestsSelected} onRestart={() => { localStorage.removeItem("viva-onboarded"); setOnboarding(true); setStep(0); }} />}
      <Nav tab={tab} setTab={setTab} />
    </section>
    {cityPicker && <CityPicker city={city} choose={(next) => { setCity(next); setCityPicker(false); setCategory("Tutto"); }} close={() => setCityPicker(false)} />}
    {selected && <Detail item={selected} saved={saved.includes(selected.id)} close={() => setSelected(null)} toggleSaved={() => toggleSaved(selected.id)} />}
  </main>;
}

function Onboarding({ step, setStep, city, setCity, selected, setSelected, budget, setBudget, finish }: { step: number; setStep: (value: number) => void; city: City; setCity: (value: City) => void; selected: string[]; setSelected: (value: string[]) => void; budget: string; setBudget: (value: string) => void; finish: () => void }) {
  const toggle = (value: string) => setSelected(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  return <main className="onboarding"><div className="onboarding-card">
    <div className="wordmark">VIVA<span>·</span></div><div className="onboarding-progress"><i style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
    {step === 0 && <div className="intro"><p className="eyebrow">Málaga · Valencia</p><h1>Discover what<br />to do now.</h1><p>Esperienze, mare, cibo e serate. Solo quello che vale il tuo tempo.</p><button className="primary" onClick={() => setStep(1)}>Inizia <span>→</span></button></div>}
    {step === 1 && <div className="intro"><p className="eyebrow">01 / città</p><h1>Dove sei<br />adesso?</h1><div className="city-cards">{(["Málaga", "Valencia"] as City[]).map((item) => <button key={item} className={`city-card ${city === item ? "chosen" : ""}`} onClick={() => setCity(item)}><b>{item === "Málaga" ? "☀" : "◒"}</b><span>{item}</span><small>{city === item ? "✓" : ""}</small></button>)}</div><button className="secondary" onClick={() => setStep(2)}>Continua</button></div>}
    {step === 2 && <div className="intro preferences"><p className="eyebrow">02 / gusti</p><h1>Cosa ti piace?</h1><p>Scegli quanto vuoi. VIVA imparerà anche da ciò che salvi.</p><div className="chips large">{interests.map((item) => <button className={selected.includes(item) ? "active" : ""} onClick={() => toggle(item)} key={item}>{item}</button>)}</div><button className="primary" onClick={() => setStep(3)}>Continua</button></div>}
    {step === 3 && <div className="intro"><p className="eyebrow">03 / budget</p><h1>Quanto vuoi<br />spendere?</h1><p>È una preferenza, non un limite. Potrai cambiarla quando vuoi.</p><div className="budget-grid">{["€0", "€5", "€10", "€15", "€20", "€30", "€50", "€100+", "Nessun limite"].map((item) => <button className={budget === item ? "active" : ""} onClick={() => setBudget(item)} key={item}>{item}</button>)}</div><button className="primary" onClick={finish}>Mostrami VIVA <span>→</span></button></div>}
  </div></main>;
}

function Home({ city, items, category, setCategory, onSelect, saved, toggleSaved }: { city: City; items: Experience[]; category: Category | "Tutto"; setCategory: (value: Category | "Tutto") => void; onSelect: (value: Experience) => void; saved: string[]; toggleSaved: (id: string) => void }) {
  const now = items.filter((item) => item.available.includes("ora") || item.available.includes("Oggi"));
  return <section className="screen home-screen">
    <div className="home-title"><p className="eyebrow">{city === "Málaga" ? "☀ 27° · Martedì" : "☀ 26° · Martedì"}</p><h1>Cosa vuoi<br />fare <em>adesso?</em></h1></div>
    <div className="chips">{["Tutto", ...categories].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item as Category | "Tutto")}>{item}</button>)}</div>
    <section className="section-head"><div><p className="eyebrow">intorno a te</p><h2>Vicino a te</h2></div><button onClick={() => setCategory("Tutto")}>Vedi tutto</button></section>
    <div className="experience-stack">{items.slice(0, 2).map((item) => <ExperienceCard item={item} key={item.id} onSelect={onSelect} saved={saved.includes(item.id)} toggleSaved={toggleSaved} />)}</div>
    <button className="choose-card" onClick={() => onSelect(items[0])}><span>🎲</span><div><p className="eyebrow">non sai scegliere?</p><b>Scegli per me</b></div><i>→</i></button>
    <section className="section-head compact"><div><p className="eyebrow">le prossime ore</p><h2>Disponibile adesso</h2></div><span>{now.length} idee</span></section>
    <div className="mini-row">{now.slice(0, 3).map((item) => <button onClick={() => onSelect(item)} key={item.id} className={`mini-card ${item.tone}`}><span>{item.kind}</span><b>{item.title}</b><small>{euros(item.price)} · {item.distance}</small></button>)}</div>
  </section>;
}

function ExperienceCard({ item, onSelect, saved, toggleSaved }: { item: Experience; onSelect: (value: Experience) => void; saved: boolean; toggleSaved: (id: string) => void }) {
  return <article className={`experience-card ${item.tone}`}><button className="card-main" onClick={() => onSelect(item)}><div className="card-top"><span>{item.kind}</span><i>★ {item.rating}</i></div><div className="card-bottom"><p>{item.available}</p><h3>{item.title}</h3><small>{item.distance} · {item.duration} <b>{euros(item.price)}</b></small></div></button><button className={`save-button ${saved ? "saved" : ""}`} onClick={() => toggleSaved(item.id)} aria-label="Salva esperienza">{saved ? "♥" : "♡"}</button></article>;
}

function Explore({ city, items, onSelect, saved, toggleSaved }: { city: City; items: Experience[]; onSelect: (value: Experience) => void; saved: string[]; toggleSaved: (id: string) => void }) {
  const [map, setMap] = useState(false);
  return <section className="screen explore-screen"><div className="page-title"><p className="eyebrow">esplora {city}</p><h1>Trova il tuo<br /><em>prossimo sì.</em></h1></div><div className="searchbar"><span>⌕</span><span>Cerca un posto, un’idea, un gusto</span></div><div className="filter-row"><button className="active">Tutto</button><button>Oggi</button><button>Gratis</button><button>Vicino</button><button onClick={() => setMap(!map)}>{map ? "Lista" : "Mappa"}</button></div>{map ? <div className="map-placeholder"><div className="map-street one" /><div className="map-street two" /><div className="pin large">☀<small>VIVA</small></div><div className="pin p1">€0</div><div className="pin p2">€29</div><div className="pin p3">€24</div><p>Le idee migliori attorno a te.</p></div> : <div className="list-view"><p className="result-count">{items.length} esperienze da scoprire</p>{items.map((item) => <ExperienceCard key={item.id} item={item} onSelect={onSelect} saved={saved.includes(item.id)} toggleSaved={toggleSaved} />)}</div>}</section>;
}

function Saved({ city, items, onSelect, toggleSaved }: { city: City; items: Experience[]; onSelect: (value: Experience) => void; toggleSaved: (id: string) => void }) {
  return <section className="screen saved-screen"><div className="page-title"><p className="eyebrow">la tua lista</p><h1>Salvati<span>.</span></h1></div><div className="saved-city">⌖ {city}<button>Filtra</button></div>{items.length === 0 ? <div className="empty"><span>♡</span><h2>Ancora niente.</h2><p>Le idee che salvi compariranno qui, pronte quando lo sarai tu.</p></div> : <div className="list-view">{items.map((item) => <ExperienceCard key={item.id} item={item} onSelect={onSelect} saved toggleSaved={toggleSaved} />)}</div>}</section>;
}

function Challenges() {
  const [joined, setJoined] = useState(false);
  return <section className="screen challenges-screen"><div className="page-title"><p className="eyebrow">con i tuoi amici</p><h1>Sfide<span>.</span></h1></div><div className="challenge-tabs"><button className="active">Attive</button><button>Ricevute</button><button>Completate</button></div><article className="challenge-card"><div><p className="eyebrow">nuova sfida</p><h2>Trova il tramonto<br />prima delle 20:30.</h2><p>Da Tommaso · <b>500 punti</b></p></div><span>🌅</span><button className="primary small">Accetta</button></article><section className="leaderboard"><p className="eyebrow">viaggio málaga 2026</p><h2>Classifica</h2><div className="podium"><div className="rank rank-two"><b>🥈</b><span>Marco</span><i>2.150</i></div><div className="rank rank-one"><b>🥇</b><span>Tommaso</span><i>2.400</i></div><div className="rank rank-three"><b>🥉</b><span>Luca</span><i>1.850</i></div></div><div className="outside-ranks"><p><b>4</b> Andrea <span>1.200</span></p><p><b>5</b> Sofia <span>950</span></p></div></section><article className="invite-box"><div><p className="eyebrow">invita fino a 5 persone</p><b>MALAGA-7X92</b></div><button onClick={() => setJoined(!joined)}>{joined ? "Copiato" : "Copia"}</button></article></section>;
}

function Profile({ city, budget, interests, onRestart }: { city: City; budget: string; interests: string[]; onRestart: () => void }) {
  return <section className="screen profile-screen"><div className="page-title"><p className="eyebrow">il tuo spazio</p><h1>Profilo<span>.</span></h1></div><div className="profile-user"><div className="avatar">D</div><div><h2>Il tuo viaggio</h2><p>Esplora come vuoi tu.</p></div><button>Modifica</button></div><section className="profile-section"><p className="eyebrow">le tue preferenze</p><div className="setting"><span>⌖</span><div><b>Città attuale</b><small>{city}</small></div><i>›</i></div><div className="setting"><span>€</span><div><b>Budget per esperienza</b><small>{budget}</small></div><i>›</i></div><div className="setting"><span>◌</span><div><b>I tuoi interessi</b><small>{interests.slice(0, 3).join(" · ")}</small></div><i>›</i></div></section><section className="profile-section"><p className="eyebrow">impostazioni</p><div className="setting"><span>◉</span><div><b>Posizione</b><small>Solo quando la usi</small></div><i>›</i></div><div className="setting"><span>◌</span><div><b>Notifiche</b><small>Silenziose e utili</small></div><i>›</i></div></section><button className="reset-demo" onClick={onRestart}>Rivedi l’onboarding</button></section>;
}

function CityPicker({ city, choose, close }: { city: City; choose: (city: City) => void; close: () => void }) {
  return <div className="modal-backdrop" onClick={close}><section className="city-modal" onClick={(event) => event.stopPropagation()}><span className="handle" /><p className="eyebrow">dove sei adesso?</p><h2>Scegli la città.</h2>{(["Málaga", "Valencia"] as City[]).map((item) => <button key={item} onClick={() => choose(item)} className={city === item ? "selected" : ""}><span>{item === "Málaga" ? "☀" : "◒"}</span>{item}<i>{city === item ? "✓" : "›"}</i></button>)}<button className="location-button">⌖ Usa la mia posizione</button></section></div>;
}

function Detail({ item, saved, close, toggleSaved }: { item: Experience; saved: boolean; close: () => void; toggleSaved: () => void }) {
  const [booked, setBooked] = useState(false);
  return <div className="modal-backdrop detail-backdrop"><section className="detail-sheet"><div className={`detail-hero ${item.tone}`}><button className="sheet-close" onClick={close}>×</button><button className={`save-button detail-save ${saved ? "saved" : ""}`} onClick={toggleSaved}>{saved ? "♥" : "♡"}</button><div><span>{item.kind}</span><h2>{item.title}</h2></div></div><div className="detail-content"><div className="facts"><span>★ {item.rating}</span><span>⌖ {item.distance}</span><span>◷ {item.duration}</span><span>€ {euros(item.price).replace("€", "")}</span></div><section><p className="eyebrow">cosa farai</p><p className="detail-copy">{item.subtitle} Questa è un’idea selezionata per il tuo momento, il tuo budget e la tua posizione.</p></section><section><p className="eyebrow">cosa è incluso</p><ul>{item.included.map((entry) => <li key={entry}>✓ {entry}</li>)}</ul></section><section><p className="eyebrow">disponibilità</p><div className="time-slots"><button className="selected">{item.available}</button><button>Domani · 10:00</button><button>Domani · 17:30</button></div></section></div><button className="book-button" onClick={() => setBooked(true)}>{booked ? "Richiesta registrata ✓" : item.price === 0 ? "Apri l’itinerario" : `Prenota — €${item.price}`}<span>→</span></button></section></div>;
}

function Nav({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  const entries: { id: Tab; icon: string; label: string }[] = [{ id: "home", icon: "⌂", label: "Home" }, { id: "explore", icon: "⌕", label: "Esplora" }, { id: "saved", icon: "♡", label: "Salvati" }, { id: "challenges", icon: "◎", label: "Sfide" }, { id: "profile", icon: "◌", label: "Profilo" }];
  return <nav className="bottom-nav">{entries.map((item) => <button className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)} key={item.id}><span>{item.icon}</span><small>{item.label}</small></button>)}</nav>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);

