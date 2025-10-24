import express from "express";
const router = express.Router();

// GET /api/reviews/book/:bookId
router.get("/book/:bookId", async (req, res) => {
  try {
    // TODO: Implement get reviews for a book
    res.status(501).json({ message: "Not implemented yet" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reviews
router.post("/", async (req, res) => {
  try {
    // TODO: Implement create new review
    res.status(501).json({ message: "Not implemented yet" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/reviews/:id
router.delete("/:id", async (req, res) => {
  try {
    // TODO: Implement delete review
    res.status(501).json({ message: "Not implemented yet" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
