const express = require("express");
const supabase = require("../config/database");
const authenticateToken = require("../middleware/auth");

const router = express.Router();
const itemFields = "id, item_name, item_description, price, item_condition, location, seller_id, created_at";

function getValidatedItem(body = {}) {
  const { itemName, itemDescription, price, itemCondition, location } = body;
  const numericPrice = typeof price === "string" ? Number(price) : price;
  if (
    typeof itemName !== "string" || !itemName.trim() ||
    typeof itemDescription !== "string" ||
    typeof numericPrice !== "number" || !Number.isFinite(numericPrice) || numericPrice < 0 ||
    typeof itemCondition !== "string" || !itemCondition.trim() ||
    typeof location !== "string" || !location.trim()
  ) return null;
  return {
    item_name: itemName.trim(),
    item_description: itemDescription.trim(),
    price: numericPrice,
    item_condition: itemCondition.trim(),
    location: location.trim(),
  };
}

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("items")
    .select(itemFields)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: "Unable to load items" });
  return res.status(200).json(data);
});

router.post("/", authenticateToken, async (req, res) => {
  const item = getValidatedItem(req.body);
  if (!item) {
    return res.status(400).json({ error: "itemName, itemDescription, price, itemCondition, and location are required" });
  }

  const { data, error } = await supabase.from("items").insert({
    ...item,
    seller_id: req.auth.id,
  }).select(itemFields).single();

  if (error) return res.status(500).json({ error: "Unable to create item" });
  return res.status(201).json(data);
});

router.put("/:id", authenticateToken, async (req, res) => {
  const item = getValidatedItem(req.body);
  if (!item) {
    return res.status(400).json({ error: "itemName, itemDescription, price, itemCondition, and location are required" });
  }

  const { data, error } = await supabase
    .from("items")
    .update(item)
    .eq("id", req.params.id)
    .eq("seller_id", req.auth.id)
    .select(itemFields)
    .maybeSingle();

  if (error) return res.status(500).json({ error: "Unable to update item" });
  if (!data) return res.status(404).json({ error: "Item not found" });
  return res.status(200).json(data);
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("items")
    .delete()
    .eq("id", req.params.id)
    .neq("seller_id", req.auth.id)
    .select("id")
    .maybeSingle();

  if (error) return res.status(500).json({ error: "Unable to delete item" });
  if (!data) return res.status(404).json({ error: "Item not found" });
  return res.status(204).send();
});

module.exports = router;
