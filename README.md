# Biblioteca API

API HTTP en TypeScript (Express + Zod) con PostgreSQL y migraciones versionadas con Drizzle ORM.
Recurso principal: `books`.

## Requisitos
- Node.js 20+
- PostgreSQL 14+

## Base de datos local rápida (Windows)
Si ya instalaste PostgreSQL 17 pero no recuerdas la contraseña, ejecuta en PowerShell (no requiere admin):
```powershell
powershell -ExecutionPolicy Bypass -File .\setup-db.ps1
```
Crea una base propia en el puerto 5433, la base `biblioteca` y el archivo `.env`. Para apagarla: `.\stop-db.ps1`.
Después de reiniciar el PC, vuelve a ejecutar `setup-db.ps1` para encenderla.

## Instalación
```bash
npm install
copy .env.example .env     # en Linux/Mac: cp .env.example .env
```
Edita `.env` con tu usuario y contraseña de PostgreSQL y crea la base de datos:
```sql
CREATE DATABASE biblioteca;
```

## Migraciones
Las migraciones están en `drizzle/` y se versionan en Git.
- `0000_crear_tabla_books.sql`: crea la tabla `books` (id, title, author, created_at).
- `0001_evolucionar_books.sql`: agrega `isbn` (único), `year`, `genre` y `available`.

```bash
npm run db:generate   # genera una migración nueva tras cambiar src/db/schema.ts
npm run db:migrate    # aplica las migraciones pendientes
```

## Ejecución
```bash
npm run dev
```
Servidor en `http://localhost:3000`.

## Endpoints
| Método | Ruta | Descripción | Códigos |
|---|---|---|---|
| GET | /books | Listar | 200 |
| GET | /books/:id | Consultar | 200, 400, 404 |
| POST | /books | Crear | 201, 400, 409 |
| PUT | /books/:id | Actualizar | 200, 400, 404, 409 |
| DELETE | /books/:id | Eliminar | 204, 400, 404 |

Ejemplo:
```bash
curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d "{\"title\":\"Dune\",\"author\":\"Frank Herbert\",\"isbn\":\"9780441013593\",\"year\":1965}"
```
