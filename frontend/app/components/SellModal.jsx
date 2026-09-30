"use client";

import { useState } from "react";

const emptyForm = { itemName: "", itemDescription: "", price: "", itemCondition: "", location: "" };

export default function SellModal({ onClose, onItemPosted, item }) {
  const isEditing = Boolean(item);
  const [form, setForm] = useState(item ? {
    itemName: item.item_name,
    itemDescription: item.item_description,
    price: item.price,
    itemCondition: item.item_condition,
    location: item.location,
  } : emptyForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);
    const accessToken = localStorage.getItem("goodies_access_token") || sessionStorage.getItem("goodies_access_token");
    try {
      const response = await fetch(isEditing ? `/api/items/${item.id}` : "/api/items", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to post item.");
      onItemPosted(result);
      onClose();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="sell-modal" role="dialog" aria-modal="true" aria-labelledby="sell-title">
        <div className="modal-heading">
          <div><p className="eyebrow">{isEditing ? "Update your listing" : "Create a listing"}</p><h2 id="sell-title">{isEditing ? "Edit item" : "Sell an item"}</h2></div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close sell form">×</button>
        </div>
        <form className="sell-form" onSubmit={handleSubmit}>
          <label>Item name<input name="itemName" value={form.itemName} onChange={updateField} required /></label>
          <label>Item description<textarea name="itemDescription" value={form.itemDescription} onChange={updateField} rows="3" required /></label>
          <div className="sell-form-row">
            <label>Price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={updateField} required /></label>
            <label>Condition<input name="itemCondition" value={form.itemCondition} onChange={updateField} required /></label>
          </div>
          <label>Location<input name="location" value={form.location} onChange={updateField} required /></label>
          {status.message && <p className={`form-status ${status.type}`} role="status">{status.message}</p>}
          <button className="button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Posting..." : "Post"}</button>
        </form>
      </section>
    </div>
  );
}
