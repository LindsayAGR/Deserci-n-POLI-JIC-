# AGENTS.md — Reglas Estrictas de Desarrollo para Kairós

## 1. Contexto y Arquitectura del Sistema
- **Proyecto:** Kairós — Sistema web de control de asistencia y prevención de deserción estudiantil (Politécnico Jaime Isaza Cadavid).
- **Entorno de Ejecución:** Node.js (v24+) con Express (`Backend/src/`).
- **Base de Datos:** MySQL (`sistema_desercion`) alojada en TiDB Cloud / Railway, accedida mediante `mysql2/promise` con pool de conexiones y TLS/SSL habilitado.
- **Frontend:** HTML5, CSS3 y JavaScript Vanilla ubicados dentro de `Backend/frontend/` (`index.html`, `landing.html`).
- **Infraestructura de Despliegue:** Render (servicio web principal que sirve tanto la API como los archivos estáticos) y configuración auxiliar en `vercel.json`.

---

## 2. Mapa de Directorios (Prohibido Alterar la Estructura)
No muevas archivos fuera de esta jerarquía ni cambies los nombres de las carpetas principales:
- `Backend/src/routes/` -> Enrutadores REST (`auth.routes.js`, `usuarios.routes.js`, `estudiantes.routes.js`, `materias.routes.js`, `asistencias.routes.js`, `alertas.routes.js`, `reportes.routes.js`).
- `Backend/src/controllers/` -> Lógica de negocio y consultas SQL.
- `Backend/src/middlewares/` -> `auth.middleware.js` (verificación JWT y roles) y `errorHandler.js`.
- `Backend/src/app.js` -> Configuración de Express, CORS, rutas API y servido de estáticos.
- `Backend/src/server.js` -> Punto de entrada del servidor.
- `Backend/frontend/` -> Vistas HTML y scripts del cliente.

---

## 3. Reglas Críticas Anti-Errores (Obligatorias)

### A. Base de Datos y Esquema (`sistema_desercion`)
1. **Nombre explícito de base de datos:** Asegura siempre que el pool de conexión apunte a `process.env.DB_NAME` (`sistema_desercion`). Nunca ejecutes consultas asumiendo la base de datos por defecto `sys`.
2. **Consultas parametrizadas:** Usa exclusivamente placeholders `?` (`pool.execute` o `pool.query` con arreglo de parámetros). Prohibido concatenar variables en strings SQL.
3. **Respeto a claves foráneas y tipos:** Antes de crear o modificar una consulta `INSERT`/`UPDATE`, verifica los nombres exactos de las columnas y relaciones entre `usuarios`, `estudiantes`, `materias`, `asistencias` y `alertas`. No inventes nombres de columnas.
4. **Conexión SSL:** Mantén intacta la configuración `ssl: { rejectUnauthorized: true }` (o la definida en la configuración actual de BD) para evitar rechazos de conexión en TiDB Cloud.

### B. Rutas Estáticas y Despliegue (Render / Vercel)
1. **Rutas relativas seguras:** En `app.js`, usa siempre `path.join(__dirname, '../frontend')` para servir archivos estáticos. Nunca uses rutas absolutas locales de Windows (`C:\...`) ni rutas relativas sin `path.join`.
2. **Orden de middlewares en `app.js`:**
   - Primero: `cors()`, `express.json()`, `express.urlencoded()`.
   - Segundo: Archivos estáticos (`express.static`).
   - Tercero: Rutas de la API (`/api/...`).
   - Cuarto: Fallback para vistas HTML y al final el `errorHandler`.
3. **Sin dependencias de build en frontend:** El frontend es Vanilla JS. No instales React, Vite, Tailwind ni bundlers que rompan el despliegue directo en Render.

### C. Autenticación, Roles y Seguridad
1. **Jerarquía de Roles:** Respeta estrictamente los tres niveles: `Super Admin`, `Administrator` y `Docente`.
2. **Validación de Super Admin:** No modifiques ni elimines la validación del correo institucional autorizado para el rol `Super Admin` en el registro/controlador de usuarios.
3. **Protección de Endpoints:** Toda ruta excepto `/api/auth/login`, `/api/auth/register` (según reglas de negocio) y vistas públicas debe pasar por `auth.middleware.js`.
4. **Variables de Entorno:** Nunca leas, imprimas, sobrescribas ni subas el archivo `.env`. Si agregas una variable nueva, documéntala únicamente como ejemplo sin valores reales.

### D. Convenciones de Código y API
1. **Separación de responsabilidades:** Los archivos `*.routes.js` solo definen los enrutadores y middlewares asociados; toda la lógica de negocio y consultas SQL deben residir en los controladores correspondientes (`*.controller.js`).
