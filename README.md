**SaintLeoConnect - Proyecto de Aplicación Móvil**

---

### 📄 Descripción del proyecto

SaintLeoConnect es una aplicación móvil que facilita la comunicación entre docentes y estudiantes en el entorno universitario, sin necesidad de integraciones complejas con sistemas institucionales. Los docentes pueden crear grupos por materia y compartir códigos de invitación con sus estudiantes, quienes se registran y se unen desde sus dispositivos móviles. La app permite mantener conversaciones organizadas, compartir anuncios, encuestas y archivos dentro de un entorno controlado.

---

### ❌ Exposición del problema

Actualmente, la comunicación entre estudiantes y docentes se realiza de forma desorganizada: correos institucionales dispersos, grupos de WhatsApp creados manualmente y sin integración con el contenido del curso. Esto provoca falta de claridad, exclusión involuntaria de estudiantes y pérdida de información relevante.

SaintLeoConnect resuelve este problema permitiendo al docente crear un grupo una sola vez y compartir un enlace o código de acceso. Los estudiantes se registran y acceden de forma sencilla, centralizando toda la comunicación.

---

### 🌐 Plataforma

SaintLeoConnect se desarrollará bajo indicaciones y limitaciones futuras del curso para plataforma Android. Idealmente podría desarrollarse con React Native para una futura adaptación fácil a iOS, pero se definirá en próximas etapas.

---

### 🔹 Interfaz de usuario (UI)

* **Inicio de sesión / registro** con correo institucional o personal.
* **Pantalla de código de invitación** para unirse a materias.
* **Lista de materias activas**.
* **Chat grupal** por materia con opciones de multimedia.
* **Notificaciones** de nuevos mensajes y anuncios.

### 💻 Interfaz de administrador (docente)

* Creación de grupos/materias.
* Generación de enlaces o códigos de invitación.
* Panel de mensajes fijados.
* Publicación de anuncios, encuestas o archivos.
* Vista de estudiantes que se han unido.

---

### ⚖️ Funcionalidad

* Registro e inicio de sesión.
* Creación y unión a grupos mediante código o enlace.
* Chat en tiempo real.
* Roles diferenciados: estudiante / docente.
* Notificaciones push.
* Sistema de encuestas simples.

---

### 🖋️ Diseño

**Pantallas clave:**

1. **Login/Registro:** correo + contraseña.
2. **Unión a clase:** ingreso de código o escaneo de QR.
3. **Dashboard:** materias activas.
4. **Chat:** interfaz estilo mensajería.
5. **Panel docente:** creación de grupos, encuestas, anuncios.

*Wireframes podrían ser elaborados en Figma.*

---

**Fase actual:**

Actualmente el proyecto está inicializado y su desarrollo inicia en la parte del servidor. Asegurándose que todo se conecte correctamente intentando la simplicidad para una primera versión (MVP) con solo 5 entidades y 4 principales. Donde 3 entidades son objetos y una es una tabla de conexión many-to-many.

El desarrollo del servidor se desarrolla en NestJS con una infraestructura modular intentando dividir responsabilidades por capas. Interacción con base de datos, lógica de negocio y la capa de manejo de peticiones HTTP. El despliegue de este servicio, por ser MVP se realizará en Render, lo cual servirá para demo pero no demostrará una latencia real (Aunque base de datos y servidor deberían quedar en la misma zona geográfica)

Para una primera versión no se planea el desarrollo de algunas características muy específicas como grupos personalizados (para trabajos en grupo). Solamente contempla grupos por materia moderados por un profesor, y mensajes directos usuario a usuario. Tambien contempla un rol adicional de administrador que se encargará de moderar toda la aplicación con los permisos más altos


