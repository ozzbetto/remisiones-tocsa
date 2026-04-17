# Documentación del Proyecto: Remisiones IT TOCSA S.A.

## 1. Descripción General
El proyecto "Remisiones IT TOCSA S.A." es una aplicación web de pila completa (Full-Stack) diseñada específicamente para la gestión y generación de notas de remisión (documentos de envío/traslado) de equipos informáticos para el departamento de IT de TOCSA S.A. 

El sistema permite automatizar la creación de estos documentos, mantener un historial centralizado de las remisiones, buscar datos de inventario y generar un PDF oficial listo para impresión con firmas de recibido/entregado.

## 2. Pila Tecnológica (MEAN Stack)
La aplicación utiliza la arquitectura clásica **MEAN**, además de estar contenerizada:
- **Base de Datos:** MongoDB (almacenamiento de documentos BSON, ideal para los ítems y contadores secuenciales).
- **Backend (API Rest):** Node.js con Express.js, escrito en **TypeScript** para mayor seguridad de tipado y mantenibilidad.
- **Frontend:** **Angular v20**, estilizado con la librería de componentes UI **PrimeNG v20** y el popular framework CSS **Bootstrap v5.3**.
- **Iconografía:** Usa `lucide-angular` y `primeicons` para la iconografía del sistema.
- **Generación de PDFs:** Se utiliza la librería `pdfmake` para la confección del documento para imprimir.
- **Despliegue:** Docker y Docker Compose para facilitar la portabilidad e instalación en servidores de producción y unificar variables de entorno.

## 3. Arquitectura y Estructura
El proyecto está dividido en dos capas principales:

### 3.1. Frontend (`/frontend`)
Una SPA (Single Page Application) desarrollada en Angular 20. 
- **Roles principales:** Interfaz de usuario interactiva y moderna para interactuar con la información.
- **Desarrollo:** Formularios reactivos (Reactive Forms) para capturar datos de destinatarios y equipos. Ruteo interno y manejo del cliente HTTP hacia el backend.

### 3.2. Backend (`/backend`)
Una API REST desarrollada en Node.js + Express.
- **Conexión de BD:** Realizada mediante Mongoose a MongoDB.
- **Estructura Interna (`/src`):**
  - **Models:**
    - `Remission`: Guarda la información completa de la transacción física (remitente, receptor, listado de ítems, motivo de traslado, responsables, estado).
    - `Counter`: Colección auxiliar indispensable para la generación automática de folios continuos.
  - **Routes & Controllers:**
    - `remission`: Endpoints para crear remisiones, listarlas y anularlas.
    - `inventory`: Endpoints para la búsqueda e integración de equipos del inventario.
  - **Services:**
    - `inventory.service`: Abstracción para conectarse o buscar remotamente en el sistema *InvGate Asset Management* (según describe el proyecto).

## 4. Funcionalidades Clave

1. **Integración con InvGate:** Permite al usuario buscar rápidamente detalles técnicos de un equipo (marca, modelo, serie) en un sistema de inventario externo, ahorrando ingresos manuales rutinarios y errores tipográficos.
2. **Numeración Secuencial Automática:** Emplea "Hooks" pre-guardado (`pre-save`) en Mongoose para asegurar que cada remisión sea legalmente válida al asignarle un número único y estrictamente serializado (ejemplo: *001-001-0000001*). 
3. **Generación Instantánea de PDF:** Convierte los datos de la web directamente a una representación de papel membretado en el navegador, listo para recolectar las firmas físicas ('Recibí Conforme' / 'Autorizado Por').
4. **Estados y Condiciones:** 
  - Soporta estados para las Remisiones (`active` / `annulled`), cuidando la integridad del historial.
  - Soporta clasificar los equipos en (`nuevo`, `usado`, `reparado`, `dañado`).
5. **Multi-Usuario / Local Network:** Al alojarse de forma remota/docker, permite a todo el personal de la empresa acceder a un histórico unificado a través de la IP del servidor en el puerto expuesto.

## 5. Implementación y Despliegue

La solución está completamente **Dockerizada**. El ambiente de producción se levanta muy fácil con Docker Compose:
```bash
docker-compose up -d --build
```
En un paso, se orquestan los contenedores necesarios (Base de datos, aplicación Node, cliente Angular servido en Nginx/Node).

Para desarrollo local, se pueden utilizar secuencias tradicionales de `npm run dev` (backend) y `npm start` (Frontend sirviendo en localhost:4200).
