import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "./db/index";
import { books } from "./db/schema";
import { bookCreateSchema, bookUpdateSchema, idSchema } from "./validation";

const app = express();
app.use(express.json());

const isUniqueViolation = (e: any) =>
  e?.code === "23505" || e?.cause?.code === "23505";

app.get("/books", async (_req, res) => {
  res.json(await db.select().from(books).orderBy(books.id));
});

app.get("/books/:id", async (req, res) => {
  const id = idSchema.safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ error: "ID inválido" });
  const [book] = await db.select().from(books).where(eq(books.id, id.data));
  if (!book) return res.status(404).json({ error: "Libro no encontrado" });
  res.json(book);
});

app.post("/books", async (req, res) => {
  const parsed = bookCreateSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  try {
    const [created] = await db.insert(books).values(parsed.data).returning();
    res.status(201).json(created);
  } catch (e) {
    if (isUniqueViolation(e))
      return res.status(409).json({ error: "El ISBN ya existe" });
    throw e;
  }
});

app.put("/books/:id", async (req, res) => {
  const id = idSchema.safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ error: "ID inválido" });
  const parsed = bookUpdateSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const [updated] = await db
      .update(books)
      .set(parsed.data)
      .where(eq(books.id, id.data))
      .returning();
    if (!updated) return res.status(404).json({ error: "Libro no encontrado" });
    res.json(updated);
  } catch (e) {
    if (isUniqueViolation(e))
      return res.status(409).json({ error: "El ISBN ya existe" });
    throw e;
  }
});

app.delete("/books/:id", async (req, res) => {
  const id = idSchema.safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ error: "ID inválido" });
  const [deleted] = await db.delete(books).where(eq(books.id, id.data)).returning();
  if (!deleted) return res.status(404).json({ error: "Libro no encontrado" });
  res.status(204).send();
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`API en http://localhost:${port}`));
