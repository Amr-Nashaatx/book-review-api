import express from "express";
const router = express.Router();

// GET /api/books
router.get("/", async (req, res) => {
  try {
    // TODO: Implement get all books
    res.status(501).json({ message: "Not implemented yet" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/books/:id
router.get("/:id", async (req, res) => {
  try {
    // TODO: Implement get book by id
    res.status(501).json({ message: "Not implemented yet" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/books
router.post("/", async (req, res) => {
  try {
    // TODO: Implement create new book
    res.status(501).json({ message: "Not implemented yet" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
