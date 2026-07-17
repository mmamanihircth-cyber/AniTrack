# AniTrack - API de Backend

Este documento detalla todas las rutas y endpoints desarrollados para el backend de **AniTrack**.

## Información General

- **Base URL local:** `http://localhost:8080` (o el puerto configurado en el archivo `.env`)
- **Autenticación:** Varios endpoints protegidos requieren enviar un token JWT en las cabeceras HTTP de la siguiente manera:
  ```http
  Authorization: Bearer <access_token>
  ```

---

## Módulos de la API

- [Autenticación (`/api/auth`)](#1-autenticación-apiauth)
- [Perfil de Usuario (`/api/profile`)](#2-perfil-de-usuario-apiprofile)
- [Comunidades / Espacios de Trabajo (`/api/workspace`)](#3-comunidades--espacios-de-trabajo-apiworkspace)
- [Interacciones, Reseñas y Listas (`/api/interactions`)](#4-interacciones-reseñas-y-listas-apiinteractions)
- [Notificaciones (`/api/notifications`)](#5-notificaciones-apinotifications)

---

## 1. Autenticación (`/api/auth`)

Endpoints encargados del registro, inicio de sesión, verificación de correo y recuperación de contraseñas.

### `POST /api/auth/register`
* **Acceso:** Público
* **Descripción:** Registra un nuevo usuario en la plataforma y envía un correo de verificación.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "name": "Nombre de Usuario",
    "email": "usuario@ejemplo.com",
    "password": "mi_password_seguro",
    "imagen_url": "https://enlace-imagen.png" // Opcional
  }
  ```
* **Respuesta Exitosa (201 Created):**
  ```json
  {
    "ok": true,
    "status": 201,
    "message": "Usuario registrado con éxito",
    "data": {
      "user": {
        "id": "userId123",
        "name": "Nombre de Usuario",
        "email": "usuario@ejemplo.com",
        "imagen_url": "https://enlace-imagen.png"
      }
    }
  }
  ```

### `GET /api/auth/verify-email`
* **Acceso:** Público
* **Descripción:** Verifica el correo de un usuario mediante el token recibido en su email. Redirige al frontend.
* **Parámetros de Consulta (Query Params):**
  - `verification_token` (JWT string, requerido)
* **Respuesta:**
  - Redirecciona a `${URL_FRONTEND}/login` con parámetros en la URL indicando éxito o error (`verified=true` o `error=...`).

### `POST /api/auth/login`
* **Acceso:** Público
* **Descripción:** Autentica a un usuario y devuelve un token de acceso.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "mi_password_seguro"
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "status": 200,
    "message": "Usuario autentificado exitosamente",
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

### `POST /api/auth/reset-password-request`
* **Acceso:** Público
* **Descripción:** Solicita el restablecimiento de contraseña. Envía un correo con el link e instrucciones.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "email": "usuario@ejemplo.com"
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "status": 200,
    "message": "En caso de que tengas una cuenta asociada a este correo te enviaremos instrucciones para restablecer tu contraseña"
  }
  ```

### `POST /api/auth/reset-password`
* **Acceso:** Público (Requiere token temporal de reset en la cabecera)
* **Descripción:** Restablece la contraseña del usuario.
* **Headers:**
  - `Authorization: Bearer <reset_token>`
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "newPassword": "nueva_contraseña_segura"
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "status": 200,
    "message": "Contraseña restablecida exitosamente"
  }
  ```

### `GET /api/auth/profile`
* **Acceso:** Autenticado
* **Descripción:** Obtiene los datos del perfil del usuario autenticado actual.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "message": "Perfil obtenido con éxito",
    "user": {
      "id": "userId123",
      "email": "usuario@ejemplo.com",
      "nombre": "Nombre de Usuario",
      "fecha_creacion": "2026-07-17T...",
      "imagen_url": "https://enlace-imagen.png"
    }
  }
  ```

### `PUT /api/auth/profile`
* **Acceso:** Autenticado
* **Descripción:** Actualiza la imagen de perfil del usuario.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "imagen_url": "https://nueva-imagen.png"
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "status": 200,
    "message": "Perfil actualizado con éxito",
    "data": {
      "_id": "userId123",
      "nombre": "Nombre de Usuario",
      "email": "usuario@ejemplo.com",
      "imagen_url": "https://nueva-imagen.png"
    }
  }
  ```

---

## 2. Perfil de Usuario (`/api/profile`)

### `GET /api/profile`
* **Acceso:** Autenticado
* **Descripción:** Devuelve un resumen simplificado de los datos de la cuenta activa.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "status": 200,
    "data": {
      "id": "userId123",
      "nombre": "Nombre de Usuario",
      "email": "usuario@ejemplo.com",
      "fecha_creacion": "2026-07-17T..."
    }
  }
  ```

---

## 3. Comunidades / Espacios de Trabajo (`/api/workspace`)

Endpoints para administrar las comunidades (workspaces) y sus miembros asociados.

### `GET /api/workspace/all`
* **Acceso:** Público
* **Descripción:** Obtiene una lista de todos los espacios de trabajo activos y públicos.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "workspaces": [
        {
          "_id": "workspaceId123",
          "nombre": "Comunidad de Dragon Ball",
          "descripcion": "Espacio para fans de Dragon Ball",
          "imagen_url": "https://link-de-imagen.jpg",
          "estatus_eliminacion": false
        }
      ]
    }
  }
  ```

### `GET /api/workspace/:workspace_id/members/:decision`
* **Acceso:** Público
* **Descripción:** Procesa la respuesta de un usuario invitado a formar parte de una comunidad (Aceptar/Rechazar).
* **Parámetros de Ruta:**
  - `workspace_id`: ID del espacio de trabajo.
  - `decision`: `accepted` o `rejected`.
* **Parámetros de Consulta (Query Params):**
  - `invitation_token`: JWT token de invitación (requerido).
* **Respuesta:**
  - `200 OK`: `{ ok: true, status: 200, message: "Decision de accepted tomada con exito!" }`

### `POST /api/workspace`
* **Acceso:** Autenticado
* **Descripción:** Crea una nueva comunidad. El creador se registra automáticamente como `OWNER` de la misma.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "nombre": "Comunidad de One Piece",
    "descripcion": "Discusión sobre el anime/manga de One Piece", // Opcional
    "imagen_url": "https://link-de-imagen.jpg" // Opcional
  }
  ```
* **Respuesta Exitosa (201 Created):**
  ```json
  {
    "ok": true,
    "message": "¡Tu Comunidad de Anime ha sido creada con éxito!",
    "data": {
      "workspace": {
        "_id": "workspaceId456",
        "nombre": "Comunidad de One Piece",
        "descripcion": "Discusión sobre el anime/manga de One Piece",
        "imagen_url": "https://link-de-imagen.jpg",
        "estatus_eliminacion": false
      }
    }
  }
  ```

### `GET /api/workspace`
* **Acceso:** Autenticado
* **Descripción:** Lista todos los espacios de trabajo a los que pertenece el usuario autenticado.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "message": "Comunidades de animes obtenidos con exito",
    "data": {
      "workspaces": [
        {
          "_id": "memberRelationId",
          "usuario_id": "userId123",
          "workspace_id": {
            "_id": "workspaceId456",
            "nombre": "Comunidad de One Piece",
            "descripcion": "Discusión sobre el anime/manga de One Piece",
            "imagen_url": "https://link-de-imagen.jpg"
          },
          "rol": "owner",
          "estatus_invitacion": "accepted"
        }
      ]
    }
  }
  ```

### `GET /api/workspace/:workspace_id`
* **Acceso:** Autenticado (Requiere rol de `owner`, `admin` o `member` en la comunidad)
* **Descripción:** Obtiene los detalles de una comunidad específica por su ID.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "status": 200,
    "data": {
      "workspace": {
        "_id": "workspaceId456",
        "nombre": "Comunidad de One Piece",
        "descripcion": "Discusión sobre el anime/manga de One Piece",
        "imagen_url": "https://link-de-imagen.jpg"
      }
    }
  }
  ```

### `DELETE /api/workspace/:workspace_id`
* **Acceso:** Autenticado (Requiere rol de `owner` en la comunidad)
* **Descripción:** Realiza un borrado lógico (soft delete) del espacio de trabajo indicado.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "status": 200,
    "message": "La comunidad ha sido eliminado exitosamente",
    "data": {
      "workspace": {
        "_id": "workspaceId456",
        "estatus_eliminacion": true
      }
    }
  }
  ```

### `PUT /api/workspace/:workspace_id`
* **Acceso:** Autenticado (Requiere rol de `owner` en la comunidad)
* **Descripción:** Actualiza los datos de un espacio de trabajo. Debe enviarse al menos un campo en el cuerpo.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "nombre": "Comunidad de One Piece (Actualizado)", // Mínimo 2 caracteres (Opcional)
    "descripcion": "Nueva descripción de la comunidad" // Opcional
  }
  ```
* **Respuesta:**
  - `200 OK`: `{ ok: true, status: 200, message: "La comunidad ha sido actualizado exitosamente", data: { workspace } }`

### `POST /api/workspace/:workspace_id/members`
* **Acceso:** Autenticado (Requiere rol de `owner` o `admin` en la comunidad)
* **Descripción:** Invita a un usuario a unirse al espacio de trabajo con un rol específico.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "invited_email": "amigo@correo.com",
    "role": "member" // Ej: "admin", "member"
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "message": "Invitación enviada con éxito"
  }
  ```

---

## 4. Interacciones, Reseñas y Listas (`/api/interactions`)

Endpoints relacionados con la interacción sobre los animes (reseñas, likes, dislikes, añadir a listas personales, favoritos y feeds de comunidades).

### `GET /api/interactions/review/anime/:anime_front_id`
* **Acceso:** Público
* **Descripción:** Obtiene todos los comentarios y reseñas de un anime, ordenados por fecha más reciente.
* **Parámetros de Ruta:**
  - `anime_front_id`: ID del anime provisto por el cliente/API externa.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "reviews": [
        {
          "_id": "reviewId123",
          "anime_id": "12345",
          "puntuacion": 9,
          "comentario": "¡Excelente animación y música!",
          "usuario_id": {
            "_id": "userId1",
            "nombre": "Usuario 1",
            "email": "user1@mail.com",
            "imagen_url": "..."
          },
          "likes": [],
          "dislikes": [],
          "respuestas": [
            {
              "usuario_id": {
                "_id": "userId2",
                "nombre": "Usuario 2",
                "imagen_url": "..."
              },
              "texto": "¡Coincido totalmente!",
              "_id": "replyId1"
            }
          ],
          "fecha_publicacion": "2026-07-17T..."
        }
      ]
    }
  }
  ```

### `POST /api/interactions/review`
* **Acceso:** Autenticado
* **Descripción:** Crea una nueva reseña o actualiza la existente para un anime determinado.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "anime_id": "12345",
    "puntuacion": 8,
    "comentario": "Bastante interesante el desarrollo." // Opcional
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "review": {
      "_id": "reviewId123",
      "anime_id": "12345",
      "puntuacion": 8,
      "comentario": "Bastante interesante el desarrollo.",
      "usuario_id": "userId123"
    }
  }
  ```

### `POST /api/interactions/review/:review_id/like`
* **Acceso:** Autenticado
* **Descripción:** Añade o remueve un "Like" a una reseña. Envía una notificación al autor si se agrega.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "message": "Like agregado", // O "Like removido"
    "data": {
      "likes": 1
    }
  }
  ```

### `POST /api/interactions/review/:review_id/dislike`
* **Acceso:** Autenticado
* **Descripción:** Añade o remueve un "Dislike" a una reseña.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "message": "Dislike agregado", // O "Dislike removido"
    "data": {
      "dislikes": 1
    }
  }
  ```

### `POST /api/interactions/review/:review_id/reply`
* **Acceso:** Autenticado
* **Descripción:** Publica una respuesta a un comentario o reseña existente. Envía una notificación al autor.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "texto": "Esta es mi respuesta o réplica."
  }
  ```
* **Respuesta Exitosa (201 Created):**
  ```json
  {
    "ok": true,
    "message": "Respuesta publicada",
    "data": {
      "respuestas": [
        {
          "usuario_id": "userId123",
          "texto": "Esta es mi respuesta o réplica.",
          "_id": "replyId456"
        }
      ]
    }
  }
  ```

### `POST /api/interactions/list`
* **Acceso:** Autenticado
* **Descripción:** Añade un anime a la lista del usuario o actualiza su estado.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "anime_id": "12345",
    "estado": "viendo" // Valores comunes: "viendo", "completado", "dropeado", "plan"
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "message": "Anime guardado en tu lista como: viendo",
    "data": {
      "itemLista": {
        "_id": "listId123",
        "usuario_id": "userId123",
        "anime_id": "12345",
        "estado": "viendo",
        "favorito": false
      }
    }
  }
  ```

### `GET /api/interactions/list`
* **Acceso:** Autenticado
* **Descripción:** Obtiene la lista completa de animes guardados por el usuario.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "miLista": [
        {
          "_id": "listId123",
          "anime_id": "12345",
          "estado": "viendo",
          "favorito": false
        }
      ]
    }
  }
  ```

### `POST /api/interactions/favorite`
* **Acceso:** Autenticado
* **Descripción:** Alterna el estado de favorito de un anime. Si no está en la lista del usuario, se agrega con estado inicial `"plan"`.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "anime_id": "12345"
  }
  ```
* **Respuesta Exitosa (200 OK o 201 Created):**
  ```json
  {
    "ok": true,
    "favorite": true, // O false si se removió
    "message": "Anime agregado a favoritos", // O "Anime eliminado de favoritos"
    "data": {
      "itemLista": {
        "_id": "listId123",
        "anime_id": "12345",
        "estado": "plan",
        "favorito": true
      }
    }
  }
  ```

### `GET /api/interactions/favorite`
* **Acceso:** Autenticado
* **Descripción:** Obtiene solo la lista de animes marcados como favoritos por el usuario.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "favoritos": [
        {
          "_id": "listId123",
          "anime_id": "12345",
          "estado": "plan",
          "favorito": true
        }
      ]
    }
  }
  ```

### `GET /api/interactions/workspace/:workspace_id`
* **Acceso:** Autenticado (Requiere ser miembro activo/aceptado en el espacio de trabajo)
* **Descripción:** Obtiene el feed de publicaciones de la comunidad de anime especificada.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "message": "Feed de la comunidad obtenido con éxito",
    "data": {
      "feed": [
        {
          "_id": "postId123",
          "workspace_id": "workspaceId456",
          "usuario_id": {
            "_id": "userId1",
            "nombre": "Usuario Publicador"
          },
          "contenido": "Esta es una publicación en el feed de la comunidad.",
          "fecha_creacion": "2026-07-17T..."
        }
      ]
    }
  }
  ```

### `POST /api/interactions/workspace/:workspace_id`
* **Acceso:** Autenticado (Requiere ser miembro activo/aceptado en el espacio de trabajo)
* **Descripción:** Crea una nueva publicación en el feed de la comunidad.
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "contenido": "Esta es mi nueva publicación en el feed de la comunidad."
  }
  ```
* **Respuesta Exitosa (201 Created):**
  ```json
  {
    "ok": true,
    "message": "¡Tu publicación ha sido compartida con éxito!",
    "data": {
      "post": {
        "_id": "postId456",
        "workspace_id": "workspaceId456",
        "usuario_id": "userId123",
        "contenido": "Esta es mi nueva publicación en el feed de la comunidad.",
        "fecha_creacion": "2026-07-17T..."
      }
    }
  }
  ```

---

## 5. Notificaciones (`/api/notifications`)

Endpoints para consultar y gestionar notificaciones asociadas a interacciones del usuario (likes, respuestas a comentarios, etc.).

### `GET /api/notifications`
* **Acceso:** Autenticado
* **Descripción:** Obtiene todas las notificaciones destinadas al usuario autenticado, ordenadas por fecha más reciente.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "data": {
      "notifications": [
        {
          "_id": "notifId123",
          "usuario_destino_id": "userId123",
          "tipo": "like", // Ej: "like", "respuesta"
          "mensaje": "¡A un usuario le gustó tu comentario!",
          "leido": false,
          "redirection_url": "/anime/12345#review-reviewId123",
          "fecha": "2026-07-17T..."
        }
      ]
    }
  }
  ```

### `PUT /api/notifications/:notification_id/read`
* **Acceso:** Autenticado
* **Descripción:** Marca una notificación específica como leída.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "ok": true,
    "message": "Notificación marcada como leída"
  }
  ```
