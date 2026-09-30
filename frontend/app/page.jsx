"use client";

import ListingGrid from "./components/ListingGrid";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MarketplacePage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [itemError, setItemError] = useState("");
  const [purchaseMessage, setPurchaseMessage] = useState(false);

  useEffect(() => {
    fetch("/api/items")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load listings");
        return response.json();
      })
      .then((data) => {
        setItems(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  async function handleBuy(item) {
    const accessToken = localStorage.getItem("goodies_access_token") || sessionStorage.getItem("goodies_access_token");
    if (!accessToken) {
      router.push("/login");
      return;
    }

    setItemError("");
    const response = await fetch(`/api/items/${item.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      router.push("/login");
      return;
    }

    if (!response.ok) {
      setItemError("Unable to remove this item right now.");
      return;
    }

    setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
    setPurchaseMessage(true);
    window.setTimeout(() => setPurchaseMessage(false), 2200);
  }

  return (
    <main className="marketplace-page">
      <Navbar />
      {purchaseMessage && <div className="purchase-toast" role="alert">Item Bought!</div>}

      <section className="listings-section" aria-labelledby="listings-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Goodies marketplace</p>
            <h1 id="listings-title">Items for sale</h1>
          </div>
          <span className="listing-count">{items.length} listings</span>
        </div>
        {status === "loading" && <p className="listing-message">Loading listings...</p>}
        {status === "error" && <p className="listing-message">Unable to load listings right now.</p>}
        {itemError && <p className="listing-message">{itemError}</p>}
        {status === "ready" && items.length === 0 && <p className="listing-message">No items have been posted yet.</p>}
        {status === "ready" && items.length > 0 && <ListingGrid items={items} onBuy={handleBuy} />}
      </section>
    </main>
  );
}
