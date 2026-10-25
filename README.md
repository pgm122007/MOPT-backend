# E-commerce Full Stack (Backend)

Aquest projecte és una aplicació d'E-commerce de plantes Full Stack desenvolupada a classe. Aquest repositori conté el **backend**: l'API REST (Node.js + Express + MongoDB) amb el CRUD de **productes**, **categories** i **usuaris**, validacions, gestió centralitzada d'errors, filtres, ordenació i paginació.

El frontend (React) es troba en un repositori independent: `<URL_REPOSITORI_FRONTEND>`.

## Tecnologies utilitzades

- React (frontend, en un altre repositori)
- Node.js + Express (backend)
- MongoDB + Mongoose (base de dades)
- bcrypt (hash de contrasenyes)
- Docker (contenidors)
- GitHub (control de versions)
- VSCode (entorn de desenvolupament)
- Postman (proves de l'API) i MongoDB Compass (comprovació de dades)

## Requisits previs

- Node.js i npm instal·lats
- Git instal·lat i configurat
- Compte de GitHub
- Docker Desktop (per executar MongoDB en un contenidor) o MongoDB instal·lat en local
- Postman Desktop (o Postman Web amb Desktop Agent)
- MongoDB Compass (opcional, per inspeccionar la base de dades)
- VSCode amb extensions recomanades (ESLint, Prettier, GitLens, Docker, MongoDB)

Pots comprovar les versions amb:

```bash
node --version
npm --version
docker --version
```

## Estructura del projecte

```
MOPT-backend/
├── api/
│   ├── src/
│   │   ├── config/db.js        # Connexió a MongoDB
│   │   ├── models/             # product, category, user
│   │   ├── controllers/        # product, category, user
│   │   ├── services/           # Lògica de negoci
│   │   ├── routes/             # product, category, user
│   │   └── index.js            # Punt d'entrada de l'API
│   ├── .env.example            # Plantilla de variables d'entorn
│   └── package.json
├── docker/                     # docker-compose per a MongoDB
├── docs/                       # Documentació
├── postman/
│   ├── ecommerce.postman_collection.json
│   └── ecommerce_local.postman_environment.json
└── README.md
```

L'arquitectura és per capes: **routes → controllers → services → models**.

## Com executar el projecte

### 1. Clonar el repositori

```bash
git clone <URL_DEL_REPOSITORI>
cd MOPT-backend
```

### 2. Configurar les variables d'entorn

Copia la plantilla i crea el teu fitxer `.env` dins de `api/` (aquest fitxer **no** es puja al repositori):

```bash
cd api
cp .env.example .env
```

Contingut de `.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerce_mongo
```

Si fas servir MongoDB Atlas, substitueix `MONGO_URI` per la teva cadena de connexió.

### 3. Iniciar MongoDB

Amb Docker, des de la carpeta `docker/`:

```bash
cd docker
docker compose up -d
docker compose ps            # comprova que el servei mongo està en marxa
docker compose logs mongo    # logs en cas d'error
```

### 4. Instal·lar dependències i arrencar l'API

```bash
cd api
npm install
npm run dev
```

Si tot va bé, la consola mostra `Servidor escoltant al port 3000`. Obre `http://localhost:3000` al navegador: ha de respondre **API Ecommerce en marxa**.

Per aturar MongoDB (des de `docker/`):

```bash
docker compose down
```

## Endpoints

Tots els recursos tenen les mateixes cinc operacions:

| Mètode | Ruta | Operació |
|---|---|---|
| POST | `/api/{recurs}` | Crear |
| GET | `/api/{recurs}` | Llistar |
| GET | `/api/{recurs}/:id` | Consultar per id |
| PUT | `/api/{recurs}/:id` | Modificar |
| DELETE | `/api/{recurs}/:id` | Eliminar (a usuaris, desactivar) |

On `{recurs}` pot ser `products`, `categories` o `users`.

### Exemples de body

**Categoria** (`name` obligatori, mínim 3 caràcters; `slug` obligatori i únic):

```json
{
  "name": "Electrònica",
  "slug": "electronica",
  "description": "Dispositius i accessoris",
  "active": true
}
```

**Producte** (`categoria` és una referència a categories; en les consultes es retorna amb `populate()`):

```json
{
  "nombre": "Monstera Deliciosa",
  "categoria": ["<id_categoria_1>", "<id_categoria_2>"],
  "descripcion": "Planta tropical de interior",
  "precio": 24.99,
  "stock": 15
}
```

**Usuari** (la contrasenya ha de tenir mínim 12 caràcters):

```json
{
  "name": "Usuari Prova",
  "email": "usuari.prova@test.com",
  "password": "Password1234"
}
```

### Regles dels usuaris

- La contrasenya es guarda com a **hash amb bcrypt**; mai es guarda ni es retorna en text pla.
- El servidor assigna sempre `role = client`: no accepta `role` ni `passwordHash` des del body.
- Només es poden modificar els camps `name` i `email` (llista explícita de camps permesos).
- `DELETE /api/users/:id` fa una **baixa lògica** (`active = false`); no esborra el document.
- L'email és únic. Un duplicat retorna `409 Conflict`.

## Filtres, ordenació i paginació

Disponible a `GET /api/categories` i `GET /api/users`.

| Paràmetre | Descripció | Exemple |
|---|---|---|
| `page` | Pàgina (per defecte 1) | `?page=2` |
| `limit` | Registres per pàgina (per defecte 10, màxim 50) | `?limit=5` |
| `sort` | Camp d'ordenació; el prefix `-` indica ordre descendent | `?sort=-createdAt` |
| `active` | Filtra per estat | `?active=false` |
| `name` | Cerca parcial, sense distingir majúscules | `?name=anna` |

Exemples:

```
GET /api/categories?active=true
GET /api/categories?name=info
GET /api/categories?sort=name
GET /api/users?name=anna
GET /api/users?sort=-createdAt
GET /api/users?page=2&limit=5
```

La resposta inclou les dades i la informació de paginació:

```json
{
  "data": [],
  "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

`page` i `limit` han de ser enters positius; amb `limit` superior a 50 l'API retorna `400`.

## Codis HTTP i format d'errors

| Codi | Significat | Exemple |
|---|---|---|
| 200 | OK | Consulta correcta |
| 201 | Created | Recurs creat |
| 400 | Bad Request | Dades o paràmetres incorrectes |
| 404 | Not Found | Recurs inexistent |
| 409 | Conflict | Email o slug duplicat |
| 422 | Unprocessable Content | Error de validació |
| 500 | Internal Server Error | Error inesperat |

Les errors tenen un format coherent i no mostren traces internes ni dades sensibles:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos no son válidos",
    "details": [{ "field": "name", "message": "El nombre es obligatorio" }]
  }
}
```

## Avís de seguretat

Fins que s'implementin **JWT i RBAC**, aquests endpoints només s'han d'executar **en local amb dades fictícies**. No s'han de desplegar públicament. El registre públic es traslladarà més endavant a `/api/auth/register` i la gestió administrativa quedarà protegida.

## Proves amb Postman

### Importar la col·lecció i l'entorn

1. Obre Postman i fes clic a **Import**.
2. Selecciona els dos fitxers de la carpeta `postman/`:
   - `ecommerce.postman_collection.json` (col·lecció **Ecommerce API**)
   - `ecommerce_local.postman_environment.json` (entorn **Ecommerce Local**)
3. Confirma amb **Import**.
4. Al selector d'entorns (a dalt a la dreta) tria **Ecommerce Local**.

L'entorn defineix `baseUrl = http://localhost:3000` i totes les peticions fan servir `{{baseUrl}}/api/...`.

> Si l'entorn no està seleccionat, Postman enviarà el text literal `{{baseUrl}}` i les peticions fallaran.

La col·lecció té tres carpetes (**Products**, **Categories** i **Users**), cadascuna amb POST, GET, GET/:id, PUT i DELETE.

### Proves mínimes

Amb l'API en marxa, executa aquestes proves en ordre:

| # | Prova | Petició | Resultat esperat |
|---|---|---|---|
| 1 | Categoria correcta | `POST /api/categories` amb `name` | `201 Created` |
| 2 | Categoria sense nom | `POST /api/categories` amb `name` buit | `422`, `VALIDATION_ERROR` |
| 3 | Slug duplicat | `POST /api/categories` amb un `slug` existent | `409 Conflict` |
| 4 | Usuari correcte | `POST /api/users` | `201 Created` |
| 5 | Email duplicat | `POST /api/users` amb un email existent | `409 Conflict` |
| 6 | Absència de `passwordHash` | Qualsevol resposta d'usuaris | La propietat no apareix |

Si repeteixes les proves 1 i 4, canvia abans el `slug`/`name` i l'email, o elimina els registres creats.

### Exportar la col·lecció sense secrets

1. Menú de la col·lecció (tres punts) > **More > Export** > **Collection v2.1** > **Export JSON**.
2. Menú de l'entorn (tres punts) > **Export**.
3. Obre els JSON i comprova que no hi ha tokens, claus ni contrasenyes reals.

## Comprovació a MongoDB (Compass)

1. Connecta Compass a la mateixa URI que `MONGO_URI` (per exemple `mongodb://localhost:27017`).
2. Obre la base de dades `ecommerce_mongo`. Té tres col·leccions:
   - `categories`: categories amb `slug` únic.
   - `plantas`: productes; el camp `categoria` guarda `ObjectId` que apunten a `categories`.
   - `users`: usuaris amb `passwordHash` (hash bcrypt, que comença per `$2b$`) i `active` (`false` en les baixes lògiques).
3. A la pestanya **Indexes** de `categories` i `users` es poden veure els índexs únics de `slug` i `email`.

> Als lliuraments, no incloguis captures amb dades sensibles ni amb URIs amb credencials.

## Problemes habituals

- **MongoDB no està iniciat o `MONGO_URI` és incorrecta:** comprova `docker compose ps` i el fitxer `.env`.
- **`req.body` arriba buit:** falta `app.use(express.json())` o el body de Postman no és `raw > JSON`.
- **404 amb `//api/...`:** la variable `baseUrl` té una barra final o hi ha un espai a la URL.
- **Els duplicats donen error 500:** cal tractar l'error d'índex únic (codi `11000`) com a `409`.
- **Les actualitzacions no validen:** `findByIdAndUpdate` necessita `runValidators: true`.

## Autor

Pau Garcia Martínez
