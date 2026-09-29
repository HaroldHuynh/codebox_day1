import ItemCard from "./ItemCard";

export default function ListingGrid({ items }) {
  return (
    <div className="listing-grid">
      {items.map((item) => (
        <ItemCard key={item.title} item={item} />
      ))}
    </div>
  );
}
