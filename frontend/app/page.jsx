import Link from "next/link";

const sampleItems = [
  { title: "Vintage wooden desk", category: "Furniture", price: "$120" },
  { title: "Ceramic table lamp", category: "Home", price: "$35" },
  { title: "Classic film camera", category: "Electronics", price: "$85" },
];

export default function MarketplacePage() {
  return (
    <main className="marketplace-page">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" href="/">Goodies</Link>
        <div className="nav-actions">
          <Link className="text-link" href="/login">Sign in</Link>
          <Link className="button button-small" href="/create-account">Join Goodies</Link>
        </div>
      </nav>

      <section className="marketplace-hero">
        <p className="eyebrow">The better secondhand marketplace</p>
        <h1>Good things deserve a second home.</h1>
        <p className="hero-copy">
          Discover useful, pre-loved goods from people in your community.
        </p>
        <div className="hero-actions">
          <a className="button" href="#listings">Browse listings</a>
          <Link className="button button-secondary" href="/login">Sell an item</Link>
        </div>
      </section>

      <section id="listings" className="listings-section" aria-labelledby="listings-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Fresh finds</p>
            <h2 id="listings-title">Browse the marketplace</h2>
          </div>
          <span className="listing-count">Sample listings</span>
        </div>
        <div className="listing-grid">
          {sampleItems.map((item) => (
            <article className="listing-card" key={item.title}>
              <div className="listing-image" aria-hidden="true">Goodies</div>
              <div className="listing-details">
                <p className="listing-category">{item.category}</p>
                <h3>{item.title}</h3>
                <strong>{item.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
