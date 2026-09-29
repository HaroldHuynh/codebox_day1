export default function ItemCard({ item }) {
  return (
    <article className="listing-card">
      <div className="listing-image" aria-label={`Image placeholder for ${item.title}`}>
        <span>{item.category}</span>
      </div>
      <div className="listing-details">
        <p className="listing-category">{item.category}</p>
        <h3>{item.title}</h3>
        <div className="listing-meta">
          <strong>{item.price}</strong>
          <span>{item.condition}</span>
        </div>
        <p className="listing-location">{item.location}</p>
      </div>
    </article>
  );
}
