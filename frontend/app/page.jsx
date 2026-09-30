"use client";

import ListingGrid from "./components/ListingGrid";
import Navbar from "./components/Navbar";
import SellModal from "./components/SellModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getAccessToken() {
  return (
    localStorage.getItem("goodies_access_token") ||
    sessionStorage.getItem("goodies_access_token")
  );
}

function getTokenUserId() {
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  try {
    const payload = JSON.parse(
      atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export default function MarketplacePage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [itemError, setItemError] = useState("");
  const [purchaseMessage, setPurchaseMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(() =>
    typeof window === "undefined" ? null : getTokenUserId(),
  );
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      fetch("/api/me", { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((response) => (response.ok ? response.json() : null))
        .then((user) => user && setCurrentUserId(user.id))
        .catch(() => {});
    }
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
    const accessToken =
      localStorage.getItem("goodies_access_token") ||
      sessionStorage.getItem("goodies_access_token");
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

    setItems((current) =>
      current.filter((currentItem) => currentItem.id !== item.id),
    );
    setPurchaseMessage(true);
    window.setTimeout(() => setPurchaseMessage(false), 2200);
  }

  function handleItemPosted(item) {
    setItems((current) => [item, ...current]);
    setStatus("ready");
  }

  function handleItemUpdated(item) {
    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === item.id ? item : currentItem,
      ),
    );
    setEditingItem(null);
  }

  function handleItemDeleted(itemId) {
    setItems((current) =>
      current.filter((currentItem) => currentItem.id !== itemId),
    );
  }

  return (
    <main className="marketplace-page">
      <Navbar onItemPosted={handleItemPosted} />
      {purchaseMessage && (
        <div className="purchase-toast" role="alert">
          Item Bought!
        </div>
      )}

      <section className="listings-section" aria-labelledby="listings-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Goodies marketplace</p>
            <h1 id="listings-title">Items for sale</h1>
          </div>
          <span className="listing-count">{items.length} listings</span>
        </div>
        {status === "loading" && (
          <p className="listing-message">Loading listings...</p>
        )}
        {status === "error" && (
          <p className="listing-message">Unable to load listings right now.</p>
        )}
        {itemError && <p className="listing-message">{itemError}</p>}
        {status === "ready" && items.length === 0 && (
          <p className="listing-message">No items have been posted yet.</p>
        )}
        {status === "ready" && items.length > 0 && (
          <ListingGrid
            items={items}
            onBuy={handleBuy}
            onEdit={setEditingItem}
            currentUserId={currentUserId}
          />
        )}
      </section>
      {editingItem && (
        <SellModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onItemPosted={handleItemUpdated}
          onItemDeleted={handleItemDeleted}
        />
      )}
    </main>
  );
}
