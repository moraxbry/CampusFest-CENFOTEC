# Plan de Pruebas — CampusFest

## Metodología

Para cada funcionalidad del sistema se definen **al menos dos escenarios de prueba**: uno de flujo feliz (*happy path*) y al menos uno alternativo o de borde (*edge case*), con el fin de garantizar cobertura sobre el comportamiento esperado y sobre los casos límite que podrían romper la lógica de negocio.

Todas las pruebas fueron ejecutadas manualmente contra el entorno de desarrollo (`npm run dev`, base de datos real en MongoDB Atlas) durante el desarrollo del proyecto, usando el navegador y Thunder Client (para los endpoints de la API). Cada prueba documenta:

* **Historia:** la necesidad de negocio / requisito funcional que motiva la prueba.
* **Escenario:** nombre corto que identifica el caso.
* **Precondiciones:** estado del sistema/datos necesario antes de ejecutar la prueba.
* **Pasos de prueba:** secuencia de acciones a ejecutar.
* **Datos de prueba:** valores concretos usados.
* **Resultado esperado:** comportamiento correcto del sistema.

---

## Índice

1. [Inicio y Actividades Destacadas](#1-inicio-y-actividades-destacadas)
2. [Catálogo de Actividades y Filtros](#2-catálogo-de-actividades-y-filtros)
3. [Detalle de Actividad](#3-detalle-de-actividad)
4. [Inscripción a Actividades](#4-inscripción-a-actividades)
5. [Directorio de Stands](#5-directorio-de-stands)
6. [Formulario de Contacto](#6-formulario-de-contacto)
7. [Ganadores y Resultados](#7-ganadores-y-resultados)
8. [Acceso al Panel Admin (Login Simulado)](#8-acceso-al-panel-admin-login-simulado)
9. [Admin — Gestión de Actividades (CRUD)](#9-admin--gestión-de-actividades-crud)
10. [Admin — Gestión de Stands (CRUD)](#10-admin--gestión-de-stands-crud)
11. [Admin — Inscripciones y Lista de Espera](#11-admin--inscripciones-y-lista-de-espera)
12. [Admin — Publicación de Resultados](#12-admin--publicación-de-resultados)
13. [Admin — Configuración de Páginas Dinámicas](#13-admin--configuración-de-páginas-dinámicas)

---

## 1. Inicio y Actividades Destacadas

**Requisitos cubiertos:** RF-01, RF-02, RF-03

### TC-01.1 — Mostrar las 3 actividades con menor cupo disponible (Happy Path)

* **Historia:** Como visitante, quiero ver en la página de inicio las actividades con menos cupos disponibles, para saber cuáles inscribirme primero.
* **Precondiciones:** Existen en la base de datos al menos 3 actividades con `status: "available"` y distinta cantidad de cupos restantes (`maxCapacity - takenSpots`).
* **Pasos de prueba:**
  1. Navegar a `http://localhost:3000/home.html`.
  2. Observar la sección "Actividades Destacadas".
* **Datos de prueba:** Actividades `Hackathon de Sostenibilidad` (3 cupos), `Conferencia Magistral: El Futuro de la IA` (40 cupos).
* **Resultado esperado:** Se muestran máximo 3 tarjetas, ordenadas de menor a mayor cupo restante; la actividad con menos cupos (`Hackathon`) aparece primero.

### TC-01.2 — Sin actividades disponibles (Edge Case)

* **Historia:** Como visitante, si no hay actividades disponibles, espero un mensaje claro en vez de una sección vacía o rota.
* **Precondiciones:** Ninguna actividad en la base de datos tiene `status: "available"` (todas están `full` o `cancelled`).
* **Pasos de prueba:**
  1. Cambiar (vía admin) el estado de todas las actividades a `cancelled` o `full`.
  2. Navegar a `http://localhost:3000/home.html`.
* **Datos de prueba:** N/A (colección `Activity` sin documentos en estado `available`).
* **Resultado esperado:** Se muestra el mensaje "Todavía no hay actividades destacadas disponibles." y no queda un placeholder de "Cargando…" pegado en pantalla.

---

## 2. Catálogo de Actividades y Filtros

**Requisitos cubiertos:** RF-04, RF-05, RF-07, RF-08, RF-09

### TC-02.1 — Listado completo ordenado cronológicamente (Happy Path)

* **Historia:** Como visitante, quiero ver todas las actividades ordenadas por fecha, para planear qué actividades visitar primero.
* **Precondiciones:** Existen actividades con fechas distintas en la base de datos.
* **Pasos de prueba:**
  1. Navegar a `/catalog.html`.
  2. Verificar el orden de las tarjetas contra las fechas/horas de cada actividad.
* **Datos de prueba:** Actividades con fechas `2026-09-20`, `2026-11-15`, `2026-11-16` (x2).
* **Resultado esperado:** Las tarjetas aparecen ordenadas ascendentemente por fecha y hora; el contador "Mostrando N actividades" coincide con la cantidad total.

### TC-02.2 — Filtro combinado sin resultados + "Limpiar filtros" (Edge Case)

* **Historia:** Como visitante, si combino filtros que no coinciden con ninguna actividad, quiero un mensaje claro y una forma rápida de volver a ver todo.
* **Precondiciones:** Catálogo con actividades cargadas.
* **Pasos de prueba:**
  1. Escribir un texto de búsqueda que no coincide con ninguna actividad (ej. `zzzznoexiste`).
  2. Verificar el estado vacío.
  3. Hacer clic en "Limpiar filtros".
* **Datos de prueba:** Texto de búsqueda `zzzznoexiste`.
* **Resultado esperado:** Se muestra "No se encontraron actividades con esos filtros." con el botón "Limpiar filtros"; al hacer clic, el buscador y todos los `<select>` vuelven a su valor por defecto y reaparecen todas las actividades.

### TC-02.3 — Badge de estado según cupo (Edge Case)

* **Historia:** Como visitante, quiero distinguir visualmente si una actividad está disponible, llena o cancelada, sin tener que abrir el detalle.
* **Precondiciones:** Existen 3 actividades: una con cupo disponible, una llena (`takenSpots === maxCapacity`), una cancelada.
* **Pasos de prueba:**
  1. Navegar a `/catalog.html`.
  2. Observar el badge de cada tarjeta y el texto del botón de acción.
* **Datos de prueba:** `Taller de Cerámica` (2/2 cupos, `full`), `Networking: Conecta con Empresas` (`cancelled`).
* **Resultado esperado:** La actividad llena muestra badge "Lleno" y botón "Lista de Espera"; la cancelada muestra badge "Cancelado" y botón deshabilitado "Actividad Cancelada".

---

## 3. Detalle de Actividad

**Requisitos cubiertos:** RF-06

### TC-03.1 — Ver detalle completo de una actividad (Happy Path)

* **Historia:** Como visitante, quiero ver toda la información de una actividad antes de inscribirme.
* **Precondiciones:** Existe una actividad válida con `_id` conocido.
* **Pasos de prueba:**
  1. Navegar a `/detail.html?id=<id_actividad>`.
* **Datos de prueba:** `id=6a7ad0dcb99e92e0330368ce` (Conferencia Magistral: El Futuro de la IA).
* **Resultado esperado:** Se muestra nombre, descripción, categoría, fecha/hora, ubicación, requisitos, cupos ocupados/totales, imagen (si tiene) y el botón "Inscribirse" habilitado.

### TC-03.2 — ID de actividad inexistente o inválido (Edge Case)

* **Historia:** Como visitante, si accedo a un enlace de detalle roto o desactualizado, espero un mensaje de error claro, no una pantalla en blanco o un error técnico.
* **Precondiciones:** Ninguna.
* **Pasos de prueba:**
  1. Navegar a `/detail.html?id=000000000000000000000000` (ID válido en formato pero inexistente).
  2. Navegar a `/detail.html` (sin parámetro `id`).
* **Datos de prueba:** `id=000000000000000000000000`.
* **Resultado esperado:** En el primer caso se muestra una alerta "Actividad no encontrada."; en el segundo, "No se especificó una actividad." Ningún caso rompe la página ni expone trazas técnicas.

---

## 4. Inscripción a Actividades

**Requisitos cubiertos:** RF-13, RF-14, RF-15, RF-16, RF-17, RF-18, RF-19

### TC-04.1 — Inscripción exitosa con cupo disponible (Happy Path)

* **Historia:** Como visitante, quiero inscribirme a una actividad con cupo disponible y recibir confirmación inmediata.
* **Precondiciones:** Actividad con `takenSpots < maxCapacity` y `status !== "cancelled"`.
* **Pasos de prueba:**
  1. En `/catalog.html`, hacer clic en "Inscribirse" sobre una actividad disponible.
  2. Completar el formulario con datos válidos y enviar.
* **Datos de prueba:** `fullName: "Ana Pérez"`, `idNumber: "1-2345-6789"`, `email: "ana.perez@ejemplo.com"`, `phone: "8888-1111"`, `major: "Ingeniería de Software"`.
* **Resultado esperado:** Respuesta `201`; la inscripción queda con `status: "confirmed"`; se muestra alerta "¡Inscripción confirmada!"; `takenSpots` de la actividad se incrementa en 1.

### TC-04.2 — Correo duplicado en la misma actividad (Edge Case)

* **Historia:** Como administrador, no quiero que una misma persona pueda inscribirse dos veces a la misma actividad con el mismo correo.
* **Precondiciones:** Ya existe una inscripción confirmada con el correo `ana.perez@ejemplo.com` para la actividad de prueba.
* **Pasos de prueba:**
  1. Repetir el formulario de inscripción con el mismo correo para la misma actividad.
* **Datos de prueba:** `email: "ana.perez@ejemplo.com"` (mismo correo, misma actividad).
* **Resultado esperado:** Respuesta `409 Conflict` con mensaje "Este correo ya está inscrito en esta actividad."; no se crea un segundo documento en `Inscription`.

### TC-04.3 — Cupo lleno → asignación automática a lista de espera (Edge Case)

* **Historia:** Como visitante, si el cupo de una actividad ya está lleno, quiero quedar automáticamente en lista de espera con mi posición, no ser rechazado.
* **Precondiciones:** Actividad de prueba con `maxCapacity: 2` y ya 2 inscripciones `confirmed`.
* **Pasos de prueba:**
  1. Enviar una tercera inscripción (correo nuevo) para esa actividad.
* **Datos de prueba:** Actividad `Taller de Cerámica` (`maxCapacity: 2`, 2/2 ocupados); nueva inscripción `email: "luis.jimenez@ejemplo.com"`.
* **Resultado esperado:** Respuesta `201` con `status: "waitlisted"`, `waitlistPosition: 1` (o el siguiente consecutivo), `waitlisted: true` en la respuesta; `takenSpots` de la actividad **no** se incrementa.

### TC-04.4 — Envío con campos obligatorios vacíos (Edge Case)

* **Historia:** Como visitante, si dejo campos obligatorios vacíos, quiero ver el error antes de que se envíe la petición al servidor.
* **Precondiciones:** Modal de inscripción abierto.
* **Pasos de prueba:**
  1. Dejar "Nombre Completo" e "Identificación" vacíos.
  2. Hacer clic en "Inscribirme".
* **Datos de prueba:** Campos vacíos.
* **Resultado esperado:** La validación de `public/js/validator.js` marca los campos como inválidos (`is-invalid`) y **no** se envía la petición `POST /api/inscriptions` (verificable en la pestaña Network del navegador).

---

## 5. Directorio de Stands

**Requisitos cubiertos:** RF-10

### TC-05.1 — Listar y filtrar stands por categoría (Happy Path)

* **Historia:** Como visitante, quiero explorar los stands filtrando por categoría de proyecto.
* **Precondiciones:** Existen stands de al menos 2 categorías distintas.
* **Pasos de prueba:**
  1. Navegar a `/stands.html`.
  2. Seleccionar una categoría específica en el filtro.
* **Datos de prueba:** Categoría `Internet of Things` (stand `EcoTrack: Monitoreo Ambiental`).
* **Resultado esperado:** Solo se muestran los stands de la categoría seleccionada.

### TC-05.2 — Búsqueda sin resultados (Edge Case)

* **Historia:** Como visitante, si busco un stand que no existe, quiero un mensaje claro y la opción de limpiar la búsqueda.
* **Precondiciones:** Stands cargados.
* **Pasos de prueba:**
  1. Escribir en el buscador un texto que no coincide con ningún nombre, descripción ni encargado.
  2. Hacer clic en "Limpiar filtros".
* **Datos de prueba:** Texto `zzzznoexiste`.
* **Resultado esperado:** Se muestra "No se encontraron stands con esos filtros." con botón para limpiar; al limpiar, reaparecen todos los stands.

---

## 6. Formulario de Contacto

**Requisitos cubiertos:** RF-11

### TC-06.1 — Envío exitoso de consulta (Happy Path)

* **Historia:** Como visitante, quiero enviar una consulta al comité organizador y recibir confirmación en pantalla.
* **Precondiciones:** Ninguna.
* **Pasos de prueba:**
  1. Navegar a `/contact.html`.
  2. Completar Nombre, Correo, Asunto y Mensaje.
  3. Hacer clic en "Enviar Mensaje".
* **Datos de prueba:** `fullName: "Juan Pérez"`, `email: "juan.perez@ejemplo.com"`, `subject: "Duda sobre inscripciones"`, `message: "¿Cómo funciona la lista de espera?"`.
* **Resultado esperado:** Respuesta `200` con mensaje "Tu consulta fue enviada correctamente."; el envío queda registrado en la consola del servidor (simulado, sin correo real — ver Decisiones de Alcance en el README).

### TC-06.2 — Envío con campo obligatorio faltante (Edge Case)

* **Historia:** Como visitante, si omito un campo obligatorio del formulario de contacto, el sistema no debe aceptar la consulta.
* **Precondiciones:** Ninguna.
* **Pasos de prueba:**
  1. Enviar el formulario dejando "Asunto" vacío.
* **Datos de prueba:** `subject: ""`.
* **Resultado esperado:** El navegador bloquea el envío por validación del lado del cliente; si se fuerza vía API directamente (`POST /api/contact` sin `subject`), el backend responde `400` con "Todos los campos son obligatorios."

---

## 7. Ganadores y Resultados

**Requisitos cubiertos:** RF-12

### TC-07.1 — Ver podio del resultado más reciente (Happy Path)

* **Historia:** Como visitante, quiero ver destacado el resultado más recientemente publicado.
* **Precondiciones:** Al menos una actividad tiene `result` publicado.
* **Pasos de prueba:**
  1. Navegar a `/results.html`.
* **Datos de prueba:** Actividad `Taller de Cerámica` con resultado publicado más reciente (`firstPlace: "Equipo Ceramica Uno"`, etc.).
* **Resultado esperado:** Se muestra el podio (oro/plata/bronce) del resultado más reciente en la sección destacada, y el resto de resultados (si hay más de uno) aparece en la grilla filtrable de abajo.

### TC-07.2 — Sin resultados publicados (Edge Case)

* **Historia:** Como visitante, si todavía no hay resultados publicados, quiero un mensaje claro en vez de una página vacía.
* **Precondiciones:** Ninguna actividad tiene `result` distinto de `null`.
* **Pasos de prueba:**
  1. Navegar a `/results.html` en un entorno sin resultados publicados.
* **Datos de prueba:** N/A.
* **Resultado esperado:** Se muestra el mensaje "Todavía no se han publicado resultados." y no se muestra el podio ni la grilla.

---

## 8. Acceso al Panel Admin (Login Simulado)

**Requisitos cubiertos:** Flujo de acceso al backoffice (sin autenticación real — ver Decisiones de Alcance en el README)

### TC-08.1 — Ingreso exitoso al panel (Happy Path)

* **Historia:** Como administrador, quiero acceder al panel de control desde la pantalla de login.
* **Precondiciones:** Sesión sin la bandera `campusfest_admin` en `localStorage`.
* **Pasos de prueba:**
  1. Navegar a `/login.html`.
  2. Ingresar cualquier correo/contraseña y enviar el formulario.
* **Datos de prueba:** `email: "admin@campusfest.com"`, `password: "cualquiera"` (no se valida).
* **Resultado esperado:** Redirección a `/admin/dashboard.html`; el panel carga sus 4 secciones; el navbar cambia a mostrar "Panel Admin" y "Cerrar Sesión".

### TC-08.2 — Acceso directo al dashboard sin haber iniciado sesión (Edge Case)

* **Historia:** Como sistema, si alguien intenta entrar directo al dashboard sin pasar por el login simulado, debe ser redirigido.
* **Precondiciones:** `localStorage` sin la bandera `campusfest_admin` (sesión "cerrada").
* **Pasos de prueba:**
  1. Navegar directamente a `http://localhost:3000/admin/dashboard.html` sin haber iniciado sesión antes.
* **Datos de prueba:** N/A.
* **Resultado esperado:** Redirección automática a `/login.html`. *(Nota: esta es una protección únicamente del lado del cliente; los endpoints `/api/admin/*` en sí no están protegidos — ver Decisiones de Alcance).*

---

## 9. Admin — Gestión de Actividades (CRUD)

**Requisitos cubiertos:** RF-20

### TC-09.1 — Crear una nueva actividad (Happy Path)

* **Historia:** Como administrador, quiero registrar una nueva actividad para que aparezca en el catálogo público.
* **Precondiciones:** Sesión admin activa.
* **Pasos de prueba:**
  1. En el dashboard, pestaña "Gestión de Actividades", clic en "Nueva Actividad".
  2. Completar todos los campos obligatorios y guardar.
* **Datos de prueba:** `name: "Torneo de Ajedrez Relámpago"`, `category: "Deportes"`, `date: "2026-09-25"`, `time: "15:00"`, `location: "Sala de Juegos"`, `maxCapacity: 16`.
* **Resultado esperado:** Respuesta `201`; la nueva actividad aparece inmediatamente en la tabla del dashboard y en `/catalog.html`.

### TC-09.2 — Editar y eliminar una actividad (Edge Case: eliminar dos veces)

* **Historia:** Como administrador, quiero poder editar o eliminar una actividad existente.
* **Precondiciones:** Existe al menos una actividad de prueba.
* **Pasos de prueba:**
  1. Editar la ubicación de una actividad existente y guardar.
  2. Eliminarla.
  3. Repetir la eliminación sobre el mismo `_id`.
* **Datos de prueba:** `_id` de una actividad de prueba.
* **Resultado esperado:** La edición se refleja en la tabla; la primera eliminación responde `200` ("Actividad eliminada correctamente."); la segunda eliminación (sobre un `_id` ya borrado) responde `404` ("Actividad no encontrada."), sin romper la interfaz.

---

## 10. Admin — Gestión de Stands (CRUD)

**Requisitos cubiertos:** RF-23

### TC-10.1 — Crear un nuevo stand (Happy Path)

* **Historia:** Como administrador, quiero registrar un nuevo stand para que aparezca en el directorio público.
* **Precondiciones:** Sesión admin activa.
* **Pasos de prueba:**
  1. En "Gestionar Páginas e Info", clic en "Nuevo Stand".
  2. Completar campos obligatorios y guardar.
* **Datos de prueba:** `name: "RoboAssist"`, `category: "Robótica"`, `owner: "Grupo Alpha"`, `location: "Arena de Hardware"`.
* **Resultado esperado:** Respuesta `201`; el stand aparece en la tabla del dashboard y en `/stands.html`.

### TC-10.2 — Editar un stand existente (Edge Case: campos vacíos opcionales)

* **Historia:** Como administrador, quiero editar solo algunos campos de un stand sin afectar los demás.
* **Precondiciones:** Existe un stand de prueba.
* **Pasos de prueba:**
  1. Abrir el stand en modo edición.
  2. Modificar únicamente la ubicación, dejando el resto igual, y guardar.
* **Datos de prueba:** `location: "Pabellón B, Stand 15"`.
* **Resultado esperado:** Solo el campo `location` cambia; el resto de los campos (nombre, categoría, encargado, descripción) permanece igual.

---

## 11. Admin — Inscripciones y Lista de Espera

**Requisitos cubiertos:** RF-21, RF-22

### TC-11.1 — Consultar inscripciones filtradas por actividad (Happy Path)

* **Historia:** Como administrador, quiero ver todas las inscripciones de una actividad específica, incluyendo su posición en lista de espera.
* **Precondiciones:** Existen inscripciones `confirmed` y `waitlisted` para una misma actividad.
* **Pasos de prueba:**
  1. En "Inscripciones y Espera", seleccionar la actividad en el filtro.
* **Datos de prueba:** Actividad `Taller de Cerámica`.
* **Resultado esperado:** Se listan solo las inscripciones de esa actividad, con su estado y posición en espera (si aplica).

### TC-11.2 — Cancelar una inscripción (Edge Case)

* **Historia:** Como administrador, quiero poder cancelar la inscripción de un participante.
* **Precondiciones:** Existe una inscripción con `status: "confirmed"` o `"waitlisted"`.
* **Pasos de prueba:**
  1. Hacer clic en "Cancelar" sobre una fila de la tabla de inscripciones.
  2. Confirmar la acción.
* **Datos de prueba:** `_id` de una inscripción de prueba.
* **Resultado esperado:** La inscripción pasa a `status: "cancelled"`; el botón "Cancelar" desaparece de esa fila (no se puede cancelar dos veces).

---

## 12. Admin — Publicación de Resultados

**Requisitos cubiertos:** RF-24

### TC-12.1 — Publicar resultado de una actividad concluida (Happy Path)

* **Historia:** Como administrador, quiero publicar el podio de una actividad para que aparezca en la sección de Ganadores.
* **Precondiciones:** Sesión admin activa; existe una actividad sin resultado publicado (`result: null`).
* **Pasos de prueba:**
  1. En "Publicar Resultados", seleccionar la actividad.
  2. Completar 1er, 2do y 3er lugar y enviar.
* **Datos de prueba:** `firstPlace: "Equipo Delta"`, `secondPlace: "Equipo Sigma"`, `thirdPlace: "Equipo Omega"`.
* **Resultado esperado:** Respuesta `200`; el campo `result.publishedAt` se genera automáticamente con la fecha/hora actual (sin que el admin la escriba); el resultado aparece en `/results.html`.

### TC-12.2 — Publicar sin seleccionar actividad (Edge Case)

* **Historia:** Como sistema, no debo permitir publicar un resultado si no se eligió a qué actividad corresponde.
* **Precondiciones:** Formulario de resultados vacío, sin actividad seleccionada.
* **Pasos de prueba:**
  1. Completar los 3 lugares sin seleccionar actividad en el `<select>`.
  2. Enviar el formulario.
* **Datos de prueba:** `resultActivitySelect: ""`.
* **Resultado esperado:** Se muestra la alerta "Seleccioná una actividad primero." y no se envía ninguna petición al backend.

---

## 13. Admin — Configuración de Páginas Dinámicas

**Requisitos cubiertos:** RF-25

### TC-13.1 — Actualizar textos de la página de Inicio (Happy Path)

* **Historia:** Como administrador, quiero cambiar el título y descripción del banner de inicio sin tocar código.
* **Precondiciones:** Sesión admin activa.
* **Pasos de prueba:**
  1. En "Gestionar Páginas e Info" → sección "Página de Inicio", modificar el título.
  2. Guardar.
  3. Navegar a `/home.html`.
* **Datos de prueba:** `title: "CampusFest 2026 — Edición Especial"`.
* **Resultado esperado:** Respuesta `200`; el nuevo título aparece de inmediato en el banner de `/home.html`.

### TC-13.2 — Primera edición cuando el documento de configuración no existe (Edge Case)

* **Historia:** Como sistema, la primera vez que se edita la configuración (base de datos recién creada, sin documento `Configuration` todavía), no debe fallar.
* **Precondiciones:** La colección `Configuration` está vacía (no existe ningún documento).
* **Pasos de prueba:**
  1. Editar y guardar la sección de contacto (`contactEmail`, `contactPhone`) por primera vez.
* **Datos de prueba:** `contactEmail: "organizacion@campusfest.cenfotec.ac.cr"`, `contactPhone: "+506 2281-7300"`.
* **Resultado esperado:** Respuesta `200`; se crea automáticamente el documento único de `Configuration` (`upsert: true`) con los valores por defecto del schema en la sección `home` y los nuevos valores en `contact`.
