# Proyecto Frontend - React + Vite + TailwindCSS

Este proyecto frontend está creado con React, Vite y TailwindCSS. La aplicación se conecta a un servicio orquestador desarrollado en NestJS para gestionar reservas de vuelos.

## Características
 - **React + Vite:** Utilizado para un entorno de desarrollo rápido y eficiente.
 - **TailwindCSS:** Para un diseño CSS utilitario.
 - **API Integrada:** Consumo de una API de orquestación con validación de cliente, creación de reservas y generación de boletos.
 - **Validación de Formularios:** Uso de Yup para validar campos de entrada de manera sencilla y eficiente.
 - **Componentes reutilizables y hooks:** Para mantener el código modular y limpio.

## Ejecutar en desarrollo
 1. Clonar repositorio
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio

 2. Instalar dependencias:
    ```bash
    npm install

 3. Crear archivo .env en la raiz del proyecto para manejo de variables globales:
    ```bash
    VITE_API_ORCHESTRATOR=http://localhost:3003/api

 4. Iniciar proyecto en modo desarrollo, (debes tener en ejecución el backend).
    ```bash
    npm run dev
