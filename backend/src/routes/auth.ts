import { Router, Request, Response } from "express";

const router = Router();

/* POST /auth/login  -------------------------------------------- */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    res.cookie("admin", "true", { httpOnly: true, sameSite: "lax" });
    res.status(200).json({ ok: true });
    return;                      // <‑‑ make the function resolve to void
  }

  res.status(401).json({ message: "Wrong password" });
});

/* POST /auth/logout -------------------------------------------- */
router.post("/logout", (_req: Request, res: Response): Promise<void> => {
  res.clearCookie("admin");
  res.status(200).json({ ok: true });
  return Promise.resolve();
});

export default router;