"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const photos = {
  hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=90",
  story: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1100&q=85",
  interior: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=85",
};

const dishes = [
  {
    id: 1,
    name: "Royal Chicken Biryani",
    category: "Signature",
    price: 18,
    description:
      "Fragrant basmati rice layered with tender chicken, warming spices and golden onions.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=85",
    tag: "HOUSE FAVOURITE",
  },
  {
    id: 2,
    name: "Old Delhi Butter Chicken",
    category: "Signature",
    price: 21,
    description:
      "Tandoor-roasted chicken in a silky tomato sauce, finished with cream and fenugreek.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85",
    tag: "CHEF’S CHOICE",
  },
  {
    id: 3,
    name: "Garden Samosas",
    category: "Starters",
    price: 9,
    description:
      "Crisp golden pastry filled with spiced potatoes and peas, with tamarind chutney.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    tag: "VEGETARIAN",
  },
  {
    id: 4,
    name: "Chargrilled Chicken Tikka",
    category: "From the Grill",
    price: 19,
    description:
      "Yoghurt-marinated chicken cooked over flame, served with a refreshing mint chutney.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85",
    tag: "FROM THE TANDOOR",
  },
  {
    id: 5,
    name: "Palace Paneer",
    category: "Vegetarian",
    price: 17,
    description:
      "Soft paneer in a rich tomato and cashew sauce, finished with fresh coriander.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85",
    tag: "COMFORT ON A PLATE",
  },
  {
    id: 6,
    name: "Pistachio Kulfi",
    category: "Desserts",
    price: 8,
    description:
      "A creamy frozen dessert with pistachio and cardamom. A gently sweet finish.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85",
    tag: "A SWEET FINISH",
  },
];

const categories = [
  "All",
  "Signature",
  "Starters",
  "From the Grill",
  "Vegetarian",
  "Desserts",
];

const reasons = [
  {
    number: "01",
    title: "Good ingredients. Beautiful beginnings.",
    text: "Every memorable dish starts with the ingredients. Our kitchen brings together colourful vegetables, fragrant rice and carefully balanced spices, allowing each flavour to have its moment.",
    detail: "Thoughtfully chosen. Carefully prepared.",
  },
  {
    number: "02",
    title: "Tradition, with a fresh perspective.",
    text: "Our menu takes inspiration from the warmth of Indian home cooking and the theatre of the tandoor. Familiar favourites sit alongside dishes that invite you to try something a little different.",
    detail: "Recipes with roots. Flavours to remember.",
  },
  {
    number: "03",
    title: "A welcome that feels personal.",
    text: "A good evening is about more than what arrives on your plate. It is the welcome at the door, the time to settle in and the feeling that you are exactly where you should be.",
    detail: "Warm service. Thoughtful little touches.",
  },
  {
    number: "04",
    title: "Your occasion. Our pleasure.",
    text: "A birthday, a long-awaited catch-up or a simple dinner together: every gathering deserves care. Share a few plates, discover a new favourite and make a little more of your time together.",
    detail: "Small moments. Wonderful memories.",
  },
];

type Booking = {
  reference: string;
  name: string;
  date: string;
  time: string;
  guests: string;
};

export default function Home() {
  const [category, setCategory] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favourites, setFavourites] = useState<number[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [error, setError] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    setToday(
      new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10)
    );

    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem("saffron-favourites") || "[]"
      );
      if (Array.isArray(saved)) {
        setFavourites(
          saved.filter(
            (id): id is number =>
              typeof id === "number" &&
              dishes.some((dish) => dish.id === id)
          )
        );
      }

      const previous = JSON.parse(
        localStorage.getItem("saffron-booking") || "null"
      );

      if (
        previous &&
        typeof previous.reference === "string" &&
        typeof previous.name === "string" &&
        typeof previous.date === "string" &&
        typeof previous.time === "string" &&
        typeof previous.guests === "string"
      ) {
        setBooking(previous);
      }
    } catch {
      // The page remains usable if browser storage is unavailable.
    }
  }, []);

  function toggleFavourite(id: number) {
    const next = favourites.includes(id)
      ? favourites.filter((item) => item !== id)
      : [...favourites, id];

    setFavourites(next);

    try {
      localStorage.setItem("saffron-favourites", JSON.stringify(next));
    } catch {
      // Favourites remain available during this visit.
    }
  }

  function reserveTable(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const date = String(data.get("date") || "");
    const time = String(data.get("time") || "");
    const timestamp = new Date(`${date}T${time}:00`).getTime();

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!Number.isFinite(timestamp) || timestamp <= Date.now()) {
      setError("Please choose a future date and time.");
      return;
    }

    const next: Booking = {
      reference: `SP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      name,
      date,
      time,
      guests: String(data.get("guests") || "2"),
    };

    try {
      localStorage.setItem("saffron-booking", JSON.stringify(next));
      setBooking(next);
      setShowBooking(true);
      form.reset();
    } catch {
      setError(
        "Your browser could not save this demo booking. Please enable browser storage and try again."
      );
    }
  }

  const visibleDishes = dishes.filter(
    (dish) =>
      (category === "All" || dish.category === category) &&
      (!savedOnly || favourites.includes(dish.id))
  );

  return (
    <main className="sp">
      <div className="announcement">
        A little spice. A little splendour. A seat at our table.
        <a href="#reservation">Plan your evening ↗</a>
      </div>

      <header className="header">
        <a href="#home" className="brand" aria-label="Saffron Palace home">
          <span className="brand-icon" aria-hidden="true">✳</span>
          <span>
            <strong>SAFFRON PALACE</strong>
            <small>INDIAN KITCHEN & DINING</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#story">Our story</a>
          <a href="#menu">The menu</a>
          <a href="#why">Why Saffron</a>
          <a href="#experience">The experience</a>
        </nav>

        <div className="header-actions">
          <a href="#reservation" className="button gold compact">
            Reserve a table <span>↗</span>
          </a>
          <button
            className="mobile-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileOpen && (
          <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
            {[
              ["Our story", "#story"],
              ["The menu", "#menu"],
              ["Why Saffron", "#why"],
              ["The experience", "#experience"],
              ["Reserve a table", "#reservation"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
              >
                {label}<span>↗</span>
              </a>
            ))}
          </nav>
        )}
      </header>

      <section id="home" className="hero">
    
          <video
  className="hero-photo"
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster={photos.hero}
  style={{ objectFit: "cover" }}
>
  <source src="/restaurant.mp4" type="video/mp4" />
</video>
        <div className="hero-overlay" />

        <div className="hero-content wrap">
          <span className="eyebrow light">
            ROOTED IN TRADITION · MADE FOR TODAY
          </span>
          <h1>
            A taste of<br />
            something<br />
            <em>extraordinary.</em>
          </h1>
          <p>
            Rich flavours. Warm hospitality. Beautiful moments.
            Discover Indian dining with a little more soul.
          </p>
          <div className="hero-buttons">
            <a href="#menu" className="button gold">
              Explore the menu <span>↗</span>
            </a>
            <a href="#reservation" className="button outline">
              Find your table <span>↗</span>
            </a>
          </div>
        </div>

        <div className="hero-seal" aria-hidden="true">
          <span>CRAFTED WITH</span>
          <strong>heart</strong>
          <span>SERVED WITH SOUL</span>
        </div>

        <div className="hero-bottom wrap">
          <span>THOUGHTFULLY COOKED. BEAUTIFULLY SHARED.</span>
          <a href="#story">Discover the palace ↓</a>
        </div>
      </section>

      <div className="values-strip">
        <span>Fresh ingredients</span><i>✳</i>
        <span>Slow-cooked traditions</span><i>✳</i>
        <span>Warm hospitality</span><i>✳</i>
        <span>Memorable evenings</span>
      </div>

      <section id="story" className="story section wrap">
        <div className="story-visual">
          <img
            src={photos.story}
            alt="A beautifully presented restaurant dish"
            loading="lazy"
          />
          <div className="story-note">
            <span>OUR PHILOSOPHY</span>
            <p>
              Good food.<br />
              Great company.<br />
              <em>Lasting memories.</em>
            </p>
          </div>
        </div>

        <div className="story-copy">
          <span className="eyebrow">WELCOME TO OUR TABLE</span>
          <h2>
            Familiar flavours.<br />
            <em>A fresh perspective.</em>
          </h2>
          <p>
            Some of the best memories begin around a dining table.
            Saffron Palace brings that feeling to every plate, pairing
            comforting Indian recipes with a thoughtful, contemporary touch.
          </p>
          <p>
            Our inspiration comes from kitchens where food is made with
            patience and shared generously. Fragrant spices, vibrant
            colours and beautifully balanced flavours sit at the heart
            of our menu.
          </p>
          <p>
            Whether you are discovering your first favourite or
            returning to a familiar classic, pull up a chair.
            There is always something worth sharing.
          </p>

          <div className="story-principles">
            <div><span>01</span> Recipes with roots</div>
            <div><span>02</span> Ingredients with care</div>
            <div><span>03</span> Hospitality with heart</div>
          </div>

          <a href="#menu" className="text-link">
            Find your new favourite <span>↗</span>
          </a>
        </div>
      </section>

      <section id="menu" className="menu-section section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE SAFFRON SELECTION</span>
              <h2>
                A little temptation.<br />
                <em>A lot of flavour.</em>
              </h2>
            </div>
            <p>
              From tandoor classics to comforting curries, explore
              dishes made for sharing, savouring and coming back to.
            </p>
          </div>

          <div className="menu-toolbar">
            <div className="categories" aria-label="Filter menu">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={category === item ? "active" : ""}
                  aria-pressed={category === item}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              className={`saved-filter ${savedOnly ? "active" : ""}`}
              onClick={() => setSavedOnly(!savedOnly)}
              aria-pressed={savedOnly}
            >
              ♡ Saved ({favourites.length})
            </button>
          </div>

          <div className="dish-grid">
            {visibleDishes.map((dish) => (
              <article className="dish-card" key={dish.id}>
                <div className="dish-image">
                  <img src={dish.image} alt={dish.name} loading="lazy" />
                  <span className="dish-tag">{dish.tag}</span>
                  <button
                    className={`heart ${
                      favourites.includes(dish.id) ? "selected" : ""
                    }`}
                    onClick={() => toggleFavourite(dish.id)}
                    aria-label={`${
                      favourites.includes(dish.id) ? "Unsave" : "Save"
                    } ${dish.name}`}
                    aria-pressed={favourites.includes(dish.id)}
                  >
                    {favourites.includes(dish.id) ? "♥" : "♡"}
                  </button>
                </div>
                <div className="dish-copy">
                  <span className="dish-category">{dish.category}</span>
                  <div className="dish-title">
                    <h3>{dish.name}</h3>
                    <span>£{dish.price}</span>
                  </div>
                  <p>{dish.description}</p>
                </div>
              </article>
            ))}
          </div>

          {visibleDishes.length === 0 && (
            <div className="empty-state">
              <h3>Your next favourite is waiting.</h3>
              <p>Save a dish with its heart button or explore another category.</p>
              <button
                className="button green"
                onClick={() => {
                  setCategory("All");
                  setSavedOnly(false);
                }}
              >
                Show all dishes ↗
              </button>
            </div>
          )}

          <p className="menu-note">
            Illustrative menu, photography and prices. For allergies or
            dietary requirements, please speak to the restaurant team
            before ordering.
          </p>
        </div>
      </section>

      <section id="why" className="why-section section wrap">
        <div className="center-heading">
          <span className="eyebrow">THE LITTLE THINGS THAT MATTER</span>
          <h2>
            Why choose<br />
            <em>Saffron Palace?</em>
          </h2>
          <p>
            Beautiful food is only the beginning. It is the care behind
            every plate and the warmth around every table that shape
            the experience.
          </p>
        </div>

        <div className="reasons-grid">
          {reasons.map((reason) => (
            <article className="reason" key={reason.number}>
              <span className="reason-number">{reason.number}</span>
              <div>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
                <span className="reason-detail">{reason.detail}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="why-closing">
          <span aria-hidden="true">✳</span>
          <p>
            Come with an appetite.<br />
            <em>Leave with a memory.</em>
          </p>
          <a href="#reservation" className="text-link">
            Join us at the table ↗
          </a>
        </div>
      </section>

      <section id="experience" className="experience">
        <div className="experience-image">
          <img
            src={photos.interior}
            alt="A welcoming restaurant dining room"
            loading="lazy"
          />
        </div>

        <div className="experience-copy">
          <span className="eyebrow light">MORE THAN A MEAL</span>
          <h2>
            Settle in.<br />
            Stay a little<br />
            <em>longer.</em>
          </h2>
          <p>
            Soft lighting, thoughtful details and the gentle rhythm
            of a good evening. Our dining space is designed for
            conversation, connection and one more shared plate.
          </p>
          <div className="experience-list">
            <div><span>01</span><p>Intimate dinners</p><b>↗</b></div>
            <div><span>02</span><p>Family gatherings</p><b>↗</b></div>
            <div><span>03</span><p>Special celebrations</p><b>↗</b></div>
          </div>
          <a href="#reservation" className="button gold">
            Make an occasion of it <span>↗</span>
          </a>
        </div>
      </section>

      <section className="gallery-section section wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A GLIMPSE OF THE GOOD LIFE</span>
            <h2>
              Moments, made<br />
              <em>delicious.</em>
            </h2>
          </div>
          <p>
            A feast for the senses, from the first plate to the
            atmosphere around your table.
          </p>
        </div>

        <div className="gallery-grid">
          <figure className="gallery-large">
            <img src={photos.interior} alt="The restaurant dining atmosphere" loading="lazy" />
            <figcaption>A place to pause.</figcaption>
          </figure>
          <figure>
            <img src={dishes[0].image} alt="Aromatic chicken biryani" loading="lazy" />
            <figcaption>Flavours to linger over.</figcaption>
          </figure>
          <figure>
            <img src={dishes[2].image} alt="Golden samosas ready to share" loading="lazy" />
            <figcaption>Better when shared.</figcaption>
          </figure>
        </div>
      </section>

      <section className="quote-section">
        <div className="wrap">
          <span className="eyebrow">OUR KITCHEN. OUR PROMISE.</span>
          <span className="quote-mark" aria-hidden="true">“</span>
          <blockquote>
            Food brings us to the table.<br />
            <em>Hospitality makes us feel at home.</em>
          </blockquote>
          <span className="quote-line" />
          <p>THE HEART OF SAFFRON PALACE</p>
        </div>
      </section>

      <section id="reservation" className="reservation-section section">
        <div className="reservation-layout wrap">
          <div className="reservation-copy">
            <span className="eyebrow">SOMETHING TO LOOK FORWARD TO</span>
            <h2>
              Your evening,<br />
              <em>beautifully planned.</em>
            </h2>
            <p>
              Choose your date, bring your favourite people and
              let the evening unfold. A good meal deserves
              something lovely to look forward to.
            </p>

            <div className="reservation-detail">
              <span aria-hidden="true">✳</span>
              <div>
                <h3>A table for every occasion</h3>
                <p>Relaxed catch-ups, intimate dinners and celebrations.</p>
              </div>
            </div>
            <div className="reservation-detail">
              <span aria-hidden="true">◷</span>
              <div>
                <h3>A little time, well spent</h3>
                <p>Sample dining hours: daily, 12:00–22:00.</p>
              </div>
            </div>

            <div className="demo-note">
              <strong>Portfolio demonstration</strong>
              <p>
                This form saves a sample booking in this browser.
                It does not reserve a real table or send an email.
              </p>
            </div>
          </div>

          <div className="reservation-card">
            <div className="form-title">
              <div>
                <span className="eyebrow">YOU’RE INVITED</span>
                <h3>Find your table</h3>
              </div>
              <span className="form-flower" aria-hidden="true">✳</span>
            </div>

            <form onSubmit={reserveTable}>
              <div className="form-grid">
                <label>
                  Your name
                  <input
                    name="name"
                    placeholder="Full name"
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>
                <label>
                  Preferred date
                  <input name="date" type="date" min={today} required />
                </label>
                <label>
                  Preferred time
                  <select name="time" required defaultValue="">
                    <option value="" disabled>Select time</option>
                    {[
                      "12:00", "13:00", "14:00", "15:00",
                      "17:00", "18:00", "19:00", "20:00", "21:00",
                    ].map((time) => (
                      <option value={time} key={time}>{time}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Number of guests
                  <select name="guests" defaultValue="2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                      <option value={number} key={number}>
                        {number} {number === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  The occasion
                  <select name="occasion" defaultValue="Just because">
                    <option>Just because</option>
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Family gathering</option>
                    <option>Business dinner</option>
                  </select>
                </label>
              </div>

              {error && <p className="form-error" role="alert">{error}</p>}

              <button type="submit" className="button green full">
                Save demo reservation <span>↗</span>
              </button>
              <p className="form-caption">
                A little anticipation is part of the experience.
              </p>
            </form>

            {booking && (
              <button
                className="booking-toggle"
                onClick={() => setShowBooking(!showBooking)}
                aria-expanded={showBooking}
              >
                {showBooking ? "Hide" : "View"} saved demo booking
                <span>{showBooking ? "−" : "+"}</span>
              </button>
            )}

            {booking && showBooking && (
              <div className="booking-confirmation" role="status">
                <strong>✓ Demo booking saved</strong>
                <p>{booking.name} · {booking.guests} guests</p>
                <p>{booking.date} at {booking.time}</p>
                <small>Reference: {booking.reference}</small>
                <p>No real reservation or email has been created.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="faq-section section wrap">
        <div>
          <span className="eyebrow">BEFORE YOU JOIN US</span>
          <h2>A few helpful<br /><em>little details.</em></h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>Are there vegetarian dishes?<span>+</span></summary>
            <p>
              The sample menu includes vegetarian options. Select
              “Vegetarian” in the menu to explore them.
              Ask the restaurant team about specific dietary needs.
            </p>
          </details>
          <details>
            <summary>How do I share an allergy requirement?<span>+</span></summary>
            <p>
              Speak directly with the restaurant team before ordering.
              Dish descriptions do not provide a complete allergen list.
            </p>
          </details>
          <details>
            <summary>Can I plan a special celebration?<span>+</span></summary>
            <p>
              Choose an occasion in the sample booking form to explore
              the experience. Real event arrangements would need
              confirmation from the restaurant.
            </p>
          </details>
          <details>
            <summary>Does this website take real bookings?<span>+</span></summary>
            <p>
              This is a portfolio concept. Bookings are saved only in
              your browser; no table is reserved and no payment is taken.
            </p>
          </details>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top wrap">
          <div>
            <a href="#home" className="brand">
              <span className="brand-icon" aria-hidden="true">✳</span>
              <span>
                <strong>SAFFRON PALACE</strong>
                <small>INDIAN KITCHEN & DINING</small>
              </span>
            </a>
            <p>A gathering of flavours.<br />A place to belong.</p>
          </div>
          <div className="footer-links">
            <span>EXPLORE</span>
            <a href="#story">Our story</a>
            <a href="#menu">The menu</a>
            <a href="#why">Why Saffron</a>
            <a href="#reservation">Your table</a>
          </div>
          <div className="footer-location">
            <span>AT YOUR SERVICE</span>
            <p>London, United Kingdom</p>
            <small>Concept location · Address to be added</small>
            <p>Sample hours: 12:00–22:00 daily</p>
          </div>
          <a href="#home" className="back-top" aria-label="Back to top">↑</a>
        </div>
        <div className="footer-bottom wrap">
          <span>© {new Date().getFullYear()} Saffron Palace · Portfolio concept</span>
          <span>Designed & developed by Farkhanda Jabeen</span>
        </div>
      </footer>

      <style jsx global>{`
        .sp {
          --green: #123e33;
          --deep: #092b24;
          --gold: #dfbb75;
          --ivory: #faf7ef;
          --muted: #697266;
          background: var(--ivory);
          color: var(--green);
          font-family: Arial, Helvetica, sans-serif;
          overflow-x: clip;
          -webkit-font-smoothing: antialiased;
        }
        .sp, .sp * { box-sizing: border-box; }
        body { margin: 0; }
        html { scroll-behavior: smooth; }
        .sp a { color: inherit; text-decoration: none; }
        .sp button, .sp input, .sp select { font: inherit; }
        .sp button { cursor: pointer; }
        .sp img { display: block; width: 100%; object-fit: cover; }
        .sp h1, .sp h2, .sp h3, .sp p, .sp figure { margin: 0; }
        .sp h1, .sp h2, .sp h3, .sp blockquote {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
        }
        .sp em { font-weight: 400; }
        .sp section[id] { scroll-margin-top: 100px; }
        .sp :focus-visible { outline: 3px solid #ae7c30; outline-offset: 5px; }
        .wrap { width: min(1240px, calc(100% - 96px)); margin-inline: auto; }
        .section { padding-block: 105px; }
        .eyebrow {
          display: inline-block; color: #8a6833; font-size: 9px;
          letter-spacing: 2.6px; font-weight: 600; line-height: 1.8;
        }
        .eyebrow.light { color: #e6c78f; }
        .sp h2 {
          font-size: clamp(37px,4vw,55px); line-height: 1.15;
          letter-spacing: -1.7px; margin-top: 18px;
        }
        .announcement {
          background: var(--deep); color: #eee5d2; padding: 11px 20px;
          text-align: center; font-size: 10px; letter-spacing: .7px;
        }
        .announcement a { margin-left: 25px; color: var(--gold); }
        .header {
          position: sticky; top: 0; z-index: 40;
          min-height: 92px; padding: 17px 4%;
          display: flex; justify-content: space-between; align-items: center;
          gap: 20px; background: #faf7eff5;
          backdrop-filter: blur(18px); border-bottom: 1px solid #123e3315;
        }
        .brand { display: inline-flex; align-items: center; gap: 11px; }
        .brand-icon { font-size: 45px; line-height: 1; color: #aa813d; }
        .brand strong {
          display: block; font: 400 20px Georgia,serif; letter-spacing: 1.7px;
        }
        .brand small { display: block; font-size: 7px; letter-spacing: 2.9px; margin-top: 7px; }
        .desktop-nav { display: flex; gap: 27px; font-size: 11px; }
        .desktop-nav a:hover { color: #9c7132; }
        .header-actions { display: flex; align-items: center; gap: 15px; }
        .button {
          min-height: 53px; padding: 16px 24px; border: 1px solid transparent;
          display: inline-flex; align-items: center; justify-content: center;
          gap: 30px; font-size: 11px; font-weight: 600;
          transition: transform .2s, background .2s, box-shadow .2s;
        }
        .button:hover { transform: translateY(-3px); box-shadow: 0 8px 24px #00000015; }
        .button span { font-size: 19px; line-height: 1; }
        .button.gold { background: var(--gold); color: var(--deep); }
        .button.gold:hover { background: #edcc8c; }
        .button.green { background: var(--green); color: white; }
        .button.green:hover { background: #205440; }
        .button.outline { border-color: #ffffff70; color: white; }
        .button.outline:hover { background: #ffffff15; }
        .button.compact { min-height: 45px; padding: 12px 18px; gap: 22px; }
        .button.full { width: 100%; margin-top: 25px; justify-content: space-between; }
        .mobile-toggle { display: none; border: 0; background: none; font-size: 25px; color: var(--green); }
        .mobile-nav {
          position: absolute; top: 100%; left: 0; right: 0;
          padding: 10px 25px 25px; background: var(--ivory);
          box-shadow: 0 15px 25px #00000015;
        }
        .mobile-nav a { display: flex; justify-content: space-between; padding: 17px 0; border-bottom: 1px solid #123e3320; }
        .hero { position: relative; min-height: 760px; display: flex; align-items: center; color: white; }
        .hero-photo, .hero-overlay { position: absolute; inset: 0; height: 100%; }
        .hero-photo { object-position: center 60%; }
        .hero-overlay { background: linear-gradient(90deg,#061f19eb,#061f1990 58%,#061f1930); }
        .hero-content { position: relative; z-index: 1; padding-block: 75px 125px; animation: arrive .8s ease-out both; }
        .hero h1 { font-size: clamp(65px,7vw,102px); line-height: 1.01; letter-spacing: -3.5px; margin: 25px 0; }
        .hero h1 em { color: #e4c58b; }
        .hero-content > p { max-width: 365px; color: #e2e5dd; font-size: 13px; line-height: 1.9; }
        .hero-buttons { display: flex; gap: 15px; margin-top: 30px; }
        .hero-seal {
          position: absolute; right: 10%; bottom: 160px;
          border: 1px solid #e4c58b; outline: 1px solid #e4c58b60;
          outline-offset: 8px; border-radius: 50%; width: 145px; height: 145px;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; color: #e4c58b; transform: rotate(-12deg);
        }
        .hero-seal span { font-size: 8px; letter-spacing: 1.5px; }
        .hero-seal strong { font: italic 42px Georgia,serif; margin-block: 6px; }
        .hero-bottom {
          position: absolute; z-index: 2; bottom: 28px; left: 0; right: 0;
          border-top: 1px solid #ffffff40; padding-top: 23px;
          display: flex; justify-content: space-between; align-items: center; gap: 20px;
        }
        .hero-bottom > span { font-size: 8px; letter-spacing: 2px; color: #e4e4d8; }
        .hero-bottom a { font-size: 10px; }
        .values-strip {
          display: flex; justify-content: center; align-items: center;
          flex-wrap: wrap; gap: 35px; padding: 25px;
          border-bottom: 1px solid #123e3320; font-size: 10px; letter-spacing: .8px;
        }
        .values-strip i { font-style: normal; font-size: 19px; color: #ac8241; }
        .story { display: grid; grid-template-columns: 1fr 1fr; gap: 95px; align-items: center; }
        .story-visual { position: relative; padding-bottom: 30px; }
        .story-visual > img { height: 545px; border-radius: 190px 190px 3px 3px; }
        .story-note {
          position: absolute; bottom: 0; right: -25px; padding: 30px;
          background: var(--green); color: white;
          border: 7px solid var(--ivory); width: 245px;
        }
        .story-note > span { font-size: 8px; letter-spacing: 2px; color: var(--gold); }
        .story-note p { font: 26px/1.4 Georgia,serif; margin-top: 15px; }
        .story-note em { color: #e5c68c; }
        .story-copy > p { color: var(--muted); font-size: 13px; line-height: 1.95; margin-top: 22px; }
        .story-principles { margin: 28px 0; border-top: 1px solid #123e3320; }
        .story-principles > div { padding: 13px 0; border-bottom: 1px solid #123e3320; font-size: 11px; display: flex; gap: 24px; }
        .story-principles span { font-size: 9px; color: #9e793d; }
        .text-link { display: inline-flex; align-items: center; gap: 30px; padding-bottom: 9px; border-bottom: 1px solid #a07b3d; font-size: 11px; }
        .menu-section { background: #efeee4; }
        .section-heading { display: flex; justify-content: space-between; align-items: end; gap: 40px; }
        .section-heading > p { max-width: 320px; color: var(--muted); font-size: 13px; line-height: 1.9; padding-bottom: 5px; }
        .menu-toolbar { display: flex; justify-content: space-between; gap: 20px; align-items: center; margin: 38px 0 30px; padding-bottom: 22px; border-bottom: 1px solid #123e3320; }
        .categories { display: flex; flex-wrap: wrap; gap: 8px; }
        .categories button, .saved-filter {
          background: transparent; border: 1px solid #123e3330;
          border-radius: 30px; color: var(--green); padding: 10px 16px;
          font-size: 10px; transition: background .2s,color .2s;
        }
        .categories button.active, .saved-filter.active { background: var(--green); color: white; border-color: var(--green); }
        .saved-filter { white-space: nowrap; }
        .dish-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 25px; }
        .dish-card { background: var(--ivory); border: 1px solid #123e3310; transition: transform .25s,box-shadow .25s; }
        .dish-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px #123e3312; }
        .dish-image { height: 250px; position: relative; overflow: hidden; background: #d8d7c9; }
        .dish-image img { height: 100%; transition: transform .6s; }
        .dish-card:hover img { transform: scale(1.06); }
        .dish-tag { position: absolute; left: 15px; top: 15px; padding: 8px 10px; background: #faf7eff0; font-size: 7px; letter-spacing: 1px; font-weight: 600; }
        .heart { position: absolute; bottom: 14px; right: 14px; border: 0; border-radius: 50%; width: 37px; height: 37px; background: var(--ivory); color: var(--green); font-size: 22px; }
        .heart.selected { color: #a23b43; }
        .dish-copy { padding: 25px 22px 28px; }
        .dish-category { text-transform: uppercase; font-size: 8px; letter-spacing: 1.7px; color: #94703b; }
        .dish-title { display: flex; align-items: start; justify-content: space-between; gap: 12px; margin-block: 11px; }
        .dish-title h3 { font-size: 22px; line-height: 1.2; }
        .dish-title > span { font: 21px Georgia,serif; color: #94703b; white-space: nowrap; }
        .dish-copy p { font-size: 12px; color: var(--muted); line-height: 1.85; }
        .menu-note { text-align: center; font-size: 10px; color: var(--muted); line-height: 1.8; margin-top: 28px !important; }
        .empty-state { text-align: center; padding: 50px 15px; }
        .empty-state h3 { font-size: 28px; }
        .empty-state p { font-size: 13px; margin: 15px 0 25px; line-height: 1.8; }
        .center-heading { text-align: center; max-width: 620px; margin: auto; }
        .center-heading > p { color: var(--muted); font-size: 13px; line-height: 1.95; max-width: 475px; margin: 24px auto 0; }
        .reasons-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 45px 70px; margin-top: 60px; }
        .reason { display: flex; align-items: start; gap: 23px; border-top: 1px solid #123e3325; padding-top: 27px; }
        .reason-number { font: italic 29px Georgia,serif; color: #ad8746; flex-shrink: 0; }
        .reason h3 { font-size: 25px; line-height: 1.3; max-width: 330px; }
        .reason p { font-size: 12px; color: var(--muted); line-height: 1.95; margin-top: 15px; }
        .reason-detail { display: block; font-size: 9px; letter-spacing: .4px; color: #87652f; margin-top: 17px; line-height: 1.8; }
        .why-closing { margin-top: 60px; padding: 28px 35px; background: #eeeee3; display: flex; align-items: center; gap: 25px; }
        .why-closing > span { font-size: 46px; color: #aa8140; }
        .why-closing p { font: 25px/1.35 Georgia,serif; flex: 1; }
        .experience { display: grid; grid-template-columns: 1fr 1fr; background: var(--green); color: var(--ivory); }
        .experience-image { min-height: 700px; }
        .experience-image img { height: 100%; }
        .experience-copy { padding: 80px clamp(35px,6vw,95px); }
        .experience-copy h2 { font-size: clamp(45px,4.5vw,63px); }
        .experience-copy h2 em { color: var(--gold); }
        .experience-copy > p { font-size: 13px; color: #d2dccf; line-height: 1.95; margin-top: 24px; }
        .experience-list { margin-block: 28px; }
        .experience-list > div { display: flex; gap: 20px; align-items: center; padding-block: 17px; border-bottom: 1px solid #ffffff25; }
        .experience-list span { color: var(--gold); font-size: 9px; }
        .experience-list p { font: 21px Georgia,serif; flex: 1; }
        .experience-list b { font-weight: 400; color: var(--gold); }
        .gallery-grid { display: grid; grid-template-columns: 1.35fr 1fr 1fr; gap: 22px; margin-top: 40px; }
        .gallery-grid figure { position: relative; height: 370px; overflow: hidden; background: #e5e3d8; }
        .gallery-grid img { height: 100%; transition: transform .6s; }
        .gallery-grid figure:hover img { transform: scale(1.05); }
        .gallery-grid figcaption { position: absolute; bottom: 0; left: 0; right: 0; padding: 55px 20px 22px; background: linear-gradient(transparent,#051f19c9); color: white; font: italic 22px Georgia,serif; }
        .quote-section { background: #efece0; text-align: center; padding-block: 75px; }
        .quote-mark { display: block; height: 62px; font: 80px Georgia,serif; color: #ad8543; margin-top: 20px; }
        .quote-section blockquote { font-size: clamp(27px,3.2vw,44px); line-height: 1.45; margin: 18px 0 30px; }
        .quote-line { display: block; width: 50px; height: 1px; background: #ac864a; margin: 0 auto 22px; }
        .quote-section p { font-size: 8px; letter-spacing: 2.5px; color: #737868; }
        .reservation-section { background: #e8ecdf; }
        .reservation-layout { display: grid; grid-template-columns: 1fr 1.1fr; gap: 85px; align-items: center; }
        .reservation-copy > p { font-size: 13px; color: var(--muted); line-height: 1.95; margin: 25px 0 30px; max-width: 370px; }
        .reservation-detail { display: flex; gap: 17px; margin-top: 25px; }
        .reservation-detail > span { width: 44px; height: 44px; flex-shrink: 0; display: grid; place-items: center; border: 1px solid #123e3325; border-radius: 50%; font-size: 24px; color: #94703b; }
        .reservation-detail h3 { font-size: 21px; margin-bottom: 7px; }
        .reservation-detail p { font-size: 11px; color: var(--muted); line-height: 1.8; }
        .demo-note { border-left: 2px solid #a47e3e; padding: 4px 0 4px 16px; margin-top: 33px; max-width: 370px; }
        .demo-note strong { font-size: 10px; }
        .demo-note p { font-size: 10px; color: var(--muted); line-height: 1.8; margin-top: 8px; }
        .reservation-card { padding: 38px; background: var(--ivory); box-shadow: 0 18px 50px #123e330a; border: 1px solid #123e3315; }
        .form-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .form-title h3 { font-size: 35px; margin-top: 9px; }
        .form-flower { font-size: 49px; color: #a47e3e; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px 17px; }
        .form-grid label { display: flex; flex-direction: column; gap: 10px; font-size: 10px; font-weight: 600; min-width: 0; }
        .form-grid input, .form-grid select { width: 100%; min-width: 0; height: 47px; padding: 0 10px; border: 1px solid #123e3330; border-radius: 0; background: #fffdf8; color: var(--green); font-size: 12px; color-scheme: light; }
        .form-caption { font-size: 9px; text-align: center; color: var(--muted); line-height: 1.8; margin-top: 14px !important; }
        .form-error { color: #a03333; font-size: 12px; line-height: 1.7; margin-top: 18px !important; }
        .booking-toggle { display: flex; justify-content: space-between; gap: 15px; width: 100%; background: none; border: 0; border-top: 1px solid #123e3320; padding: 18px 0 0; margin-top: 23px; color: var(--green); font-size: 11px; text-align: left; }
        .booking-confirmation { background: #e5eddf; padding: 18px; margin-top: 18px; font-size: 12px; line-height: 1.85; overflow-wrap: anywhere; }
        .booking-confirmation strong { display: block; margin-bottom: 8px; }
        .booking-confirmation small { display: block; margin-block: 8px; }
        .booking-confirmation p:last-child { font-size: 10px; color: var(--muted); }
        .faq-section { display: grid; grid-template-columns: 1fr 1.25fr; gap: 70px; }
        .faq-list details { border-bottom: 1px solid #123e3325; }
        .faq-list details:first-child { border-top: 1px solid #123e3325; }
        .faq-list summary { display: flex; justify-content: space-between; gap: 20px; align-items: center; padding: 22px 0; font: 20px/1.4 Georgia,serif; cursor: pointer; list-style: none; }
        .faq-list summary::-webkit-details-marker { display: none; }
        .faq-list summary span { font: 24px Arial,sans-serif; color: #98723b; transition: transform .2s; }
        .faq-list details[open] summary span { transform: rotate(45deg); }
        .faq-list details > p { font-size: 12px; color: var(--muted); line-height: 1.95; padding-bottom: 23px; max-width: 520px; }
        .footer { background: var(--deep); color: #efe9da; }
        .footer-top { display: grid; grid-template-columns: 1.4fr .65fr 1fr auto; gap: 40px; padding-block: 60px; }
        .footer .brand-icon { color: var(--gold); }
        .footer-top > div:first-child > p { font: italic 24px/1.5 Georgia,serif; margin-top: 24px; color: #d3d7c8; }
        .footer-links { display: flex; flex-direction: column; align-items: start; gap: 14px; font-size: 11px; }
        .footer-links > span, .footer-location > span { font-size: 8px; letter-spacing: 2px; color: var(--gold); margin-bottom: 7px; }
        .footer-location p { font-size: 12px; line-height: 1.8; margin-top: 15px; }
        .footer-location small { font-size: 9px; color: #afbeb1; line-height: 1.8; display: block; margin-top: 7px; }
        .back-top { width: 45px; height: 45px; display: grid; place-items: center; border: 1px solid #dfbb7570; color: var(--gold) !important; border-radius: 50%; font-size: 20px; }
        .footer-bottom { border-top: 1px solid #ffffff20; display: flex; justify-content: space-between; gap: 20px; padding-block: 22px; font-size: 9px; color: #afbeb1; }
        @keyframes arrive {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media(max-width:1100px) {
          .brand strong { font-size: 17px; }
          .brand small { font-size: 6px; letter-spacing: 2.4px; }
          .desktop-nav { gap: 17px; font-size: 10px; }
          .story { gap: 60px; }
          .reservation-layout { gap: 45px; }
          .reasons-grid { gap: 35px 40px; }
          .dish-image { height: 220px; }
          .dish-title h3 { font-size: 20px; }
          .footer-top { gap: 25px; }
        }
        @media(max-width:900px) {
          .wrap { width: calc(100% - 48px); }
          .section { padding-block: 75px; }
          .header { min-height: 82px; padding-inline: 24px; }
          .desktop-nav { display: none; }
          .mobile-toggle { display: block; }
          .hero { min-height: 700px; }
          .hero h1 { font-size: 80px; }
          .hero-seal { right: 7%; width: 120px; height: 120px; }
          .story { gap: 40px; }
          .story-visual > img { height: 480px; }
          .story-note { right: -12px; width: 215px; padding: 22px; }
          .story-note p { font-size: 23px; }
          .dish-grid { grid-template-columns: repeat(2,1fr); }
          .dish-image { height: 250px; }
          .menu-toolbar { align-items: start; }
          .experience { grid-template-columns: 1fr; }
          .experience-image { min-height: 0; height: 420px; }
          .experience-copy { padding: 60px 40px; }
          .experience-copy h2 br:nth-child(2) { display: none; }
          .gallery-grid { gap: 15px; }
          .gallery-grid figure { height: 300px; }
          .gallery-grid figcaption { font-size: 19px; padding-inline: 14px; }
          .reservation-layout { grid-template-columns: 1fr; gap: 40px; }
          .reservation-copy > p { max-width: 600px; }
          .faq-section { gap: 40px; }
          .footer-top { grid-template-columns: 1.2fr .7fr 1fr; }
          .back-top { display: none; }
          .values-strip { gap: 19px; }
        }
        @media(max-width:600px) {
          .wrap { width: calc(100% - 40px); }
          .section { padding-block: 60px; }
          .announcement { font-size: 8px; line-height: 1.8; padding: 9px 15px; }
          .announcement a { display: none; }
          .header { padding: 15px 20px; min-height: 76px; }
          .brand { gap: 8px; }
          .brand-icon { font-size: 35px; }
          .brand strong { font-size: 15px; letter-spacing: 1px; }
          .brand small { font-size: 6px; letter-spacing: 1.8px; }
          .header-actions > .button { display: none; }
          .hero { min-height: 680px; }
          .hero-content { padding-block: 65px 125px; }
          .hero h1 { font-size: clamp(52px,13vw,72px); letter-spacing: -2px; line-height: 1.05; }
          .hero .eyebrow { font-size: 7px; letter-spacing: 1.8px; }
          .hero-content > p { font-size: 12px; max-width: 300px; }
          .hero-buttons { flex-wrap: wrap; gap: 10px; }
          .button { padding: 15px 17px; gap: 19px; font-size: 10px; min-height: 49px; }
          .hero-seal { display: none; }
          .hero-bottom > span { max-width: 175px; font-size: 7px; letter-spacing: 1px; line-height: 1.8; }
          .hero-bottom a { font-size: 8px; }
          .values-strip { display: grid; grid-template-columns: 1fr 1fr; text-align: center; gap: 17px; font-size: 8px; padding: 24px 15px; }
          .values-strip i { display: none; }
          .story { grid-template-columns: 1fr; gap: 38px; }
          .story-visual { padding-right: 10px; }
          .story-visual > img { height: 410px; }
          .story-note { right: 0; width: 210px; }
          .sp h2 { font-size: 39px; letter-spacing: -1.2px; }
          .eyebrow { font-size: 8px; letter-spacing: 2px; }
          .story-copy > p { font-size: 12px; }
          .section-heading { display: block; }
          .section-heading > p { max-width: 100%; margin-top: 22px; font-size: 12px; }
          .menu-toolbar { flex-direction: column; gap: 15px; margin-top: 28px; }
          .categories { gap: 7px; }
          .categories button, .saved-filter { font-size: 9px; padding: 10px 13px; }
          .dish-grid { grid-template-columns: 1fr; gap: 22px; }
          .dish-image { height: 270px; }
          .dish-title h3 { font-size: 24px; }
          .center-heading > p { font-size: 12px; }
          .reasons-grid { grid-template-columns: 1fr; margin-top: 38px; gap: 28px; }
          .reason { gap: 20px; padding-top: 24px; }
          .reason h3 { font-size: 25px; }
          .reason p { font-size: 12px; }
          .why-closing { padding: 25px; margin-top: 35px; flex-wrap: wrap; gap: 18px; }
          .why-closing p { font-size: 24px; }
          .why-closing .text-link { margin-left: 0; }
          .experience-image { height: 300px; }
          .experience-copy { padding: 50px 24px; }
          .experience-copy h2 { font-size: 46px; }
          .experience-copy > p { font-size: 12px; }
          .gallery-grid { grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 30px; }
          .gallery-grid .gallery-large { grid-column: 1 / -1; height: 280px; }
          .gallery-grid figure { height: 230px; }
          .gallery-grid figcaption { font-size: 18px; line-height: 1.3; padding: 45px 12px 16px; }
          .quote-section { padding-block: 55px; }
          .quote-section blockquote { font-size: 27px; }
          .reservation-card { padding: 26px 20px; }
          .form-grid { gap: 20px 12px; }
          .form-grid input, .form-grid select { font-size: 11px; padding-inline: 8px; }
          .form-title h3 { font-size: 31px; }
          .form-flower { font-size: 40px; }
          .faq-section { grid-template-columns: 1fr; gap: 30px; }
          .faq-list summary { font-size: 19px; padding-block: 20px; }
          .footer-top { grid-template-columns: 1fr 1fr; gap: 32px 20px; padding-block: 45px; }
          .footer-top > div:first-child { grid-column: 1 / -1; }
          .footer-top > div:first-child > p { font-size: 23px; margin-top: 20px; }
          .footer-bottom { flex-direction: column; gap: 12px; font-size: 8px; line-height: 1.8; }
        }
        @media(max-width:360px) {
          .form-grid { grid-template-columns: 1fr; }
          .hero h1 { font-size: 48px; }
          .gallery-grid { grid-template-columns: 1fr; }
          .gallery-grid figure { height: 270px; }
        }
        @media(prefers-reduced-motion:reduce) {
          html { scroll-behavior: auto; }
          .sp *, .sp *::before, .sp *::after {
            animation: none !important;
            transition: none !important;
          }
        }        /* ORANGE & CREAM THEME */
        .sp {
          --green: #a83d17;
          --deep: #401c13;
          --gold: #ffb36b;
          --ivory: #fff9f0;
          --muted: #756052;
        }

        .announcement {
          background: #a83d17;
          color: #fff9f0;
          font-size: 12px;
          padding-block: 13px;
        }

        .announcement a {
          color: #ffe0b9;
        }

        /* LARGER NAVIGATION */
        .header {
          background: #fff9f0f7;
          border-bottom: 1px solid #d477402b;
          box-shadow: 0 5px 24px #7c30100a;
          min-height: 106px;
          padding-block: 20px;
        }

        .brand {
          gap: 15px;
        }

        /* DECORATIVE LOGO BADGE */
        .brand-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: linear-gradient(145deg, #ffb76d, #cc4e19);
          color: #fff9ee;
          border: 1px solid #ef9b52;
          outline: 1px solid #cf6a3155;
          outline-offset: 5px;
          box-shadow:
            inset 0 0 0 5px #fff7e830,
            0 6px 16px #a53e1720;
          font-size: 43px;
        }

        .brand strong {
          color: #a83d17;
          font-size: 26px;
          font-weight: 600;
          letter-spacing: 1.6px;
        }

        .brand small {
          color: #805032;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 2.5px;
          margin-top: 9px;
        }

        .desktop-nav {
          gap: 25px;
          font-size: 14px;
          font-weight: 500;
          color: #603222;
        }

        .desktop-nav a {
          position: relative;
          padding-block: 10px;
        }

        .desktop-nav a::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 2px;
          height: 2px;
          background: #e76a28;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .2s;
        }

        .desktop-nav a:hover {
          color: #cb4d17;
        }

        .desktop-nav a:hover::after {
          transform: scaleX(1);
        }

        .button {
          font-size: 13px;
          border-radius: 5px;
        }

        .button.gold {
          background: #c94a16;
          color: #fffaf3;
        }

        .button.gold:hover {
          background: #aa3810;
        }

        .button.compact {
          min-height: 52px;
          padding: 15px 23px;
          font-size: 13px;
        }

        .button.green {
          background: #b94316;
          color: white;
        }

        .button.green:hover {
          background: #95300e;
        }

        /* WARM HERO COLOURS */
        .hero-overlay {
          background: linear-gradient(
            90deg,
            #2c130ef0,
            #49210f99 58%,
            #29140d38
          );
        }

        .hero h1 em {
          color: #ffb878;
        }

        .eyebrow {
          color: #a34e25;
          font-size: 11px;
          letter-spacing: 2.5px;
        }

        .eyebrow.light {
          color: #ffc992;
        }

        .hero-content > p {
          font-size: 15px;
          color: #f3e7d9;
        }

        .hero-seal {
          color: #ffd09a;
          border-color: #ffd09a;
          outline-color: #ffd09a66;
        }

        .hero-bottom > span {
          color: #f4dfcb;
          font-size: 9px;
        }

        .hero-bottom a {
          font-size: 12px;
        }

        /* WARM SECTION BACKGROUNDS */
        .values-strip {
          background: #fff0dc;
          border-bottom-color: #c96c3228;
          font-size: 12px;
          color: #8c3c1c;
        }

        .values-strip i {
          color: #d45b20;
        }

        .story-note {
          background: #a83d17;
          border-color: #fff9f0;
        }

        .story-note > span,
        .story-note em {
          color: #ffd49f;
        }

        .story-copy > p,
        .section-heading > p,
        .center-heading > p,
        .reason p {
          font-size: 14px;
        }

        .story-principles {
          border-color: #ae582a30;
        }

        .story-principles > div {
          border-color: #ae582a30;
          font-size: 13px;
        }

        .story-principles span {
          color: #c15a26;
          font-size: 11px;
        }

        .text-link {
          border-color: #cc622e;
          color: #a83d17;
          font-size: 13px;
        }

        .menu-section {
          background: #fff0df;
        }

        .menu-toolbar {
          border-bottom-color: #b45b2b30;
        }

        .categories button,
        .saved-filter {
          color: #973a17;
          border-color: #bd642d45;
          background: #fff8ee;
          font-size: 12px;
        }

        .categories button.active,
        .saved-filter.active {
          background: #b94316;
          border-color: #b94316;
          color: white;
        }

        .dish-card {
          border-color: #c6763d22;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 24px #a3481007;
        }

        .dish-card:hover {
          box-shadow: 0 18px 40px #a3481018;
        }

        .dish-tag {
          color: #873914;
          background: #fff8eef5;
          font-size: 8px;
          border-radius: 3px;
        }

        .dish-category {
          color: #b04a1c;
          font-size: 9px;
        }

        .dish-title > span {
          color: #b94718;
        }

        .dish-copy p {
          font-size: 13px;
        }

        .heart {
          color: #b94316;
        }

        .heart.selected {
          color: #d44145;
        }

        .menu-note {
          font-size: 11px;
        }

        .reason {
          border-top-color: #b7653438;
        }

        .reason-number {
          color: #d16a2d;
          font-size: 33px;
        }

        .reason-detail {
          color: #a34e25;
          font-size: 11px;
        }

        .why-closing {
          background: #ffe9d1;
          border-radius: 10px;
        }

        .why-closing > span {
          color: #cd5a21;
        }

        /* EXPERIENCE & GALLERY */
        .experience {
          background: #843016;
          color: #fff9ee;
        }

        .experience-copy h2 em {
          color: #ffc18a;
        }

        .experience-copy > p {
          color: #f3daca;
          font-size: 14px;
        }

        .experience-list span,
        .experience-list b {
          color: #ffc18a;
        }

        .experience .button.gold {
          background: #ffca97;
          color: #68240f;
        }

        .experience .button.gold:hover {
          background: #ffdbb5;
        }

        .gallery-grid figure {
          border-radius: 10px;
          background: #f3d6bb;
        }

        .gallery-grid figcaption {
          background: linear-gradient(transparent, #3b180ee0);
        }

        .quote-section {
          background: #ffedda;
        }

        .quote-mark {
          color: #d16429;
        }

        .quote-line {
          background: #cf642c;
        }

        .quote-section p {
          color: #8c593b;
          font-size: 10px;
        }

        /* BOOKING & FOOTER */
        .reservation-section {
          background: #f9e6d4;
        }

        .reservation-copy > p {
          font-size: 14px;
        }

        .reservation-detail > span {
          color: #b24b1e;
          border-color: #b65c2d45;
        }

        .reservation-detail p {
          font-size: 12px;
        }

        .demo-note {
          border-left-color: #cb642b;
        }

        .demo-note p {
          font-size: 11px;
        }

        .reservation-card {
          border-radius: 14px;
          border-color: #b8612f28;
          box-shadow: 0 20px 55px #9c451214;
        }

        .form-flower {
          color: #c75b22;
        }

        .form-grid label {
          font-size: 12px;
        }

        .form-grid input,
        .form-grid select {
          height: 50px;
          font-size: 13px;
          border-color: #b56c3c40;
          border-radius: 5px;
          background: #fffdf9;
        }

        .booking-confirmation {
          background: #ffead4;
          border-left: 3px solid #ce642a;
          border-radius: 5px;
        }

        .faq-list details,
        .faq-list details:first-child {
          border-color: #b0613435;
        }

        .faq-list summary span {
          color: #c25a24;
        }

        .faq-list details > p {
          font-size: 13px;
        }

        .footer {
          background: #381b14;
          color: #fff1df;
        }

        .footer .brand strong {
          color: #ffd4a4;
        }

        .footer .brand small {
          color: #e8b78e;
        }

        .footer .brand-icon {
          color: #fff9ed;
        }

        .footer-top > div:first-child > p {
          color: #edcdb2;
        }

        .footer-links > span,
        .footer-location > span {
          color: #ffba7b;
          font-size: 10px;
        }

        .footer-links {
          font-size: 13px;
        }

        .footer-location small,
        .footer-bottom {
          color: #d4b4a0;
        }

        .back-top {
          border-color: #ffbc7e80;
          color: #ffbc7e !important;
        }

        /* RESPONSIVE LOGO & FONT SIZES */
        @media (max-width: 1250px) {
          .brand strong {
            font-size: 22px;
          }

          .brand-icon {
            width: 57px;
            height: 57px;
            font-size: 39px;
          }

          .desktop-nav {
            gap: 17px;
            font-size: 12px;
          }

          .button.compact {
            padding-inline: 17px;
            font-size: 12px;
          }
        }

        @media (max-width: 1050px) {
          .desktop-nav {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }
        }

        @media (max-width: 600px) {
          .header {
            min-height: 90px;
            padding: 16px 20px;
          }

          .brand {
            gap: 12px;
          }

          .brand-icon {
            width: 48px;
            height: 48px;
            font-size: 34px;
            outline-offset: 3px;
          }

          .brand strong {
            font-size: 18px;
            letter-spacing: .7px;
          }

          .brand small {
            font-size: 7px;
            letter-spacing: 1.5px;
            margin-top: 7px;
          }

          .hero .eyebrow {
            font-size: 9px;
          }

          .hero-content > p {
            font-size: 14px;
          }

          .hero .button {
            font-size: 11px;
          }

          .values-strip {
            font-size: 10px;
          }

          .eyebrow {
            font-size: 10px;
            letter-spacing: 1.8px;
          }

          .categories button,
          .saved-filter {
            font-size: 11px;
          }

          .form-grid label {
            font-size: 11px;
          }

          .form-grid input,
          .form-grid select {
            font-size: 12px;
          }

          .footer .brand strong {
            font-size: 18px;
          }
        }
      `}</style>
    </main>
  );
}