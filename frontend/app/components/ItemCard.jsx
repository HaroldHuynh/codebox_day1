export default function ItemCard({ item, onBuy }) {
  return (
    <article className="listing-card">
      <div className="listing-image" aria-label={`Image placeholder for ${item.item_name}`}>
        <span>{item.item_condition}</span>
      </div>
      <div className="listing-details">
        <p className="listing-category">{item.item_condition}</p>
        <h3>{item.item_name}</h3>
        <p className="listing-description">{item.item_description}</p>
        <div className="listing-meta">
          <strong>${Number(item.price).toFixed(2)}</strong>
          <button className="button button-small buy-button" type="button" onClick={() => onBuy(item)}>Buy</button>
        </div>
        <p className="listing-location">{item.location}</p>
      </div>
    </article>
  );
}
