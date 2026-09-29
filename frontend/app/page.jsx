import ListingGrid from "./components/ListingGrid";
import Navbar from "./components/Navbar";

const sampleItems = [
  { title: "Vintage wooden desk", category: "Furniture", price: "$120", condition: "Good condition", location: "Portland, OR" },
  { title: "Ceramic table lamp", category: "Home", price: "$35", condition: "Like new", location: "Seattle, WA" },
  { title: "Classic film camera", category: "Electronics", price: "$85", condition: "Good condition", location: "Austin, TX" },
  { title: "Wool winter coat", category: "Clothing", price: "$60", condition: "Excellent condition", location: "Boston, MA" },
  { title: "Acoustic guitar", category: "Music", price: "$180", condition: "Good condition", location: "Nashville, TN" },
  { title: "Stoneware dinner set", category: "Home", price: "$45", condition: "Like new", location: "Chicago, IL" },
];

export default function MarketplacePage() {
  return (
    <main className="marketplace-page">
      <Navbar />

      <section className="listings-section" aria-labelledby="listings-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Goodies marketplace</p>
            <h1 id="listings-title">Items for sale</h1>
          </div>
          <span className="listing-count">{sampleItems.length} listings</span>
        </div>
        <ListingGrid items={sampleItems} />
      </section>
    </main>
  );
}
