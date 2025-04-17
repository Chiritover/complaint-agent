import { Router, Request, Response } from "express";
import { pool } from "../db";
import { z } from "zod";

const router = Router();

/* ---------- validation ---------- */
const ComplaintSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  complaint: z.string().min(1),
});

type ComplaintRow = {
  id: number;
  name: string;
  email: string;
  complaint: string;
  status: "Pending" | "Resolved";
  created_at: string;
};

/* ------------------------------------------------------------------
   PUBLIC  POST /complaints  (exported as plain handler)
-------------------------------------------------------------------*/
export const createComplaint = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = ComplaintSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error);
    return;
  }

  const { name, email, complaint } = parsed.data;

  try {
    const { rows } = await pool.query<ComplaintRow>(
      `INSERT INTO complaints (name, email, complaint, status)
       VALUES ($1,$2,$3,'Pending')
       RETURNING *`,
      [name, email, complaint]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database insert failed" });
  }
};

/* ------------------------------------------------------------------
   ADMIN‑ONLY ROUTES  (mounted behind requireAdmin)
-------------------------------------------------------------------*/

/* GET /complaints */
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query<ComplaintRow>(
      `SELECT * FROM complaints ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database query failed" });
  }
});

/* PATCH /complaints/:id */
router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }

  try {
    let newStatus: "Pending" | "Resolved";
    if (req.body?.status && ["Pending", "Resolved"].includes(req.body.status)) {
      newStatus = req.body.status;
    } else {
      const cur = await pool.query<{ status: "Pending" | "Resolved" }>(
        "SELECT status FROM complaints WHERE id = $1",
        [id]
      );
      if (!cur.rowCount) {
        res.status(404).json({ message: "Complaint not found" });
        return;
      }
      newStatus = cur.rows[0].status === "Pending" ? "Resolved" : "Pending";
    }

    const { rows } = await pool.query<ComplaintRow>(
      `UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *`,
      [newStatus, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database update failed" });
  }
});

/* DELETE /complaints/:id */
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }

  try {
    const result = await pool.query("DELETE FROM complaints WHERE id = $1", [
      id,
    ]);
    if (!result.rowCount) {
      res.status(404).json({ message: "Complaint not found" });
      return;
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database delete failed" });
  }
});

export default router;