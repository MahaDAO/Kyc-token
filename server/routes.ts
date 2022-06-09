import { Router } from "express";
import * as blockpass from "./controller/blockpass"
const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "online",
  });
});

router.post("/api/webhook", (req, res) => { blockpass.webhook(req, res)})
router.post("/api/address", (req, res) => { blockpass.getWalletAddress(req, res)})

export default router;
