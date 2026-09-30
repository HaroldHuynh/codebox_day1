import ItemCard from "./ItemCard";

export default function ListingGrid({ items, onBuy, onEdit, currentUserId }) {
  return (
    <div className="listing-grid">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onBuy={onBuy} onEdit={onEdit} isOwn={item.seller_id === currentUserId} />
      ))}
    </div>
  );
}
