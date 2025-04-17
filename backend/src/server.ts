import express from "express";
import cors from "cors";
import complaintsRouter, { createComplaint } from "./routes/complaints";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import { requireAdmin } from "./middleware/auth";


const app = express();
app.use(
    cors({
      origin: "http://localhost:5173",   
      credentials: true,                
    })
  );
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));


app.use(cookieParser());
app.use("/auth", authRouter);

app.post("/complaints", createComplaint);       
app.use("/complaints", requireAdmin, complaintsRouter); // GET, PATCH, DELET