import ItemCard from "./ItemCard";

export default function ListingGrid({ items, onBuy }) {
  return (
    <div className="listing-grid">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onBuy={onBuy} />
      ))}
    </div>
  );
}
