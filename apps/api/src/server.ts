import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { meRouter } from "./routes/me";
import { categoriesRouter } from "./routes/categories";
import { postsRouter } from "./routes/posts";
import { commentsRouter } from "./routes/comments";
import { likesRouter } from "./routes/likes";
import { reportsRouter } from "./routes/reports";
import { listingsRouter } from "./routes/listings";
import { adRequestsRouter } from "./routes/adRequests";
import { notificationsRouter } from "./routes/notifications";
import { partnersRouter } from "./routes/partners";
import { adminRouter } from "./routes/admin";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/likes", likesRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/ad-requests", adRequestsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/partners", partnersRouter);
app.use("/api/admin", adminRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "서버 오류가 발생했습니다" });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Sinity API http://localhost:${port} portida ishga tushdi`);
});
