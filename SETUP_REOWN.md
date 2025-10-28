# Configuración de Reown para NovaFi

## Paso 1: Obtén tu Reown Project ID

1. Ve a https://cloud.reown.com/sign-in
2. Crea una cuenta o inicia sesión
3. Haz clic en "Create Project"
4. Completa la información del proyecto:
   - **Name:** NovaFi
   - **Homepage:** Tu URL o https://localhost:5173 para desarrollo
5. Selecciona "AppKit" como producto
6. Selecciona "React" como framework
7. Haz clic en "Create"
8. Copia el **Project ID** que aparece en la parte superior izquierda

## Paso 2: Configura los dominios permitidos (IMPORTANTE)

1. En el dashboard de Reown (https://cloud.reown.com)
2. Ve a tu proyecto
3. Busca la sección "Settings" o "Allowed Domains"
4. Agrega TODOS estos dominios:
   - `http://localhost:5173`
   - `https://localhost:5173`
   - La URL completa de tu navegador (cópiala de la barra de direcciones)
5. Haz clic en "Save" o "Update"

IMPORTANTE: El error "The origin ... is not in your allow list" significa que necesitas agregar el dominio actual a la lista permitida en Reown.

## Paso 3: Configura el .env

Abre el archivo `.env` y reemplaza `your_reown_project_id_here` con tu Project ID real:

```env
VITE_REOWN_PROJECT_ID=tu_project_id_aqui
```

## Paso 4: Inicia la aplicación

```bash
npm run dev
```

## Cómo funciona la integración

1. **Conexión de Wallet:** Los usuarios hacen clic en "Connect Wallet" y eligen su wallet preferida (MetaMask, WalletConnect, Coinbase Wallet, etc.)

2. **Autenticación:** Cuando se conecta una wallet, el usuario firma un mensaje para autenticarse

3. **Perfil automático:** Se crea automáticamente un perfil en Supabase vinculado a la dirección de la wallet

4. **Uso de la plataforma:** Una vez conectado, el usuario puede:
   - Crear intents
   - Hacer propuestas
   - Aceptar/rechazar propuestas

## Redes soportadas

- Ethereum Mainnet
- Polygon
- Arbitrum
- Base

## Troubleshooting

### Error: "The origin ... is not in your allow list"

Este es el error más común. Solución:

1. Ve a https://cloud.reown.com
2. Abre tu proyecto NovaFi
3. Ve a Settings > Allowed Domains
4. Copia la URL completa de tu navegador
5. Agrégala a la lista de dominios permitidos
6. Guarda y recarga la página

### Otros problemas:

1. Verifica que el Project ID esté correctamente configurado en `.env`
2. Asegúrate de que el archivo `.env` esté en la raíz del proyecto
3. Reinicia el servidor de desarrollo después de modificar `.env`
4. Verifica que tu wallet esté instalada y desbloqueada
