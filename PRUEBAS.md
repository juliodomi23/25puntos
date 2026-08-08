# Guion de pruebas — Panel 25 Puntos

Demo para Leyva Asesores. Se corre a mano antes de cada demo con la clienta.
Tarda ~8 minutos. Si algo falla, **no** se deploya.

- **Local:** `node server.js` → http://localhost:3070
- **Producción:** https://demo.ambarrojostudios.cloud/
- **Usuarios:** `julio / Leyva2026` (agente) · `flordeliz / Leyva2026` (dueña)

> El estado vive en memoria del servidor: al reiniciar vuelve al seed.
> Para repetir el tour desde cero: DevTools → Application → Local Storage →
> borrar `tour25pts_v1` (o el botón **? Cómo funciona** del header).

---

## 1. Login y roles

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 1.1 | Abrir la URL sin sesión | Se ve la pantalla de login, no el panel |
| 1.2 | Usuario o contraseña mal | Mensaje "Usuario o contraseña incorrectos", no entra |
| 1.3 | Entrar como `julio` | Vista de agente, **sin** los chips para cambiar de agente |
| 1.4 | Recargar la página | Sigue dentro (la sesión se guarda) |
| 1.5 | "Cerrar sesión" | Vuelve al login |
| 1.6 | Entrar como `flordeliz` | Vista de dueña (semáforo, ranking, heatmap) |

## 2. Onboarding guiado (spotlight) — vista agente

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 2.1 | Primer login de un agente (sin `tour25pts_v1`) | El tour arranca solo en el paso 1/7, con el fondo oscurecido y el hero iluminado |
| 2.2 | "Siguiente" 6 veces | Recorre: meta del día → captura → solicitudes → seguimiento → semana → cierres en el horno → 5 prospectos. El recuadro sigue al elemento y la página hace scroll sola |
| 2.3 | Último paso | El botón dice "¡Listo!" y al tocarlo cierra el tour |
| 2.4 | Recargar | El tour **no** vuelve a salir |
| 2.5 | Botón "? Cómo funciona" | El tour arranca otra vez desde 1/7 |
| 2.6 | "Saltar" en cualquier paso | Cierra el tour de inmediato |
| 2.7 | Tecla `Esc` con el tour abierto | Cierra el tour |
| 2.8 | Con el tour abierto, hacer scroll con la rueda | El recuadro y la ventana iluminada siguen pegados al elemento |
| 2.9 | Con el tour abierto, esperar >4 s | La página **no** se repinta ni se pierde el spotlight (el polling está en pausa) |
| 2.10 | Login como dueña | El botón "? Cómo funciona" **no** aparece y el tour no arranca |

## 3. Captura del agente

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 3.1 | Tocar `+` en "Llamadas realizadas" | El número sube de 1 en 1, aparece "N pts" en la tarjeta y el hero suma +1 |
| 3.2 | Tocar `−` hasta 0 | No baja de 0 y el "N pts" desaparece |
| 3.3 | Tocar `+` en cierres | El hero suma +3 y la barra de progreso avanza |
| 3.4 | Abrir "Seguimiento · no suma puntos" | Salen los 5 contadores restantes; al usarlos el hero **no** cambia |
| 3.5 | Llegar a 25 pts | Barra verde, insignia "✓ Día cumplido" y mensaje de meta cumplida |
| 3.6 | Recargar la página | Todo lo capturado sigue ahí (viene del servidor) |

## 4. Solicitudes

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 4.1 | "+ Agregar solicitud" | Aparece una fila nueva y el hero suma **+5** |
| 4.2 | Escribir el monto (ej. 12000) | Se guarda; el agente **no** ve comisión por ningún lado |
| 4.3 | "✕" en la solicitud | Se borra la fila y el hero baja 5 pts |
| 4.4 | Agregar 2 solicitudes | El embudo de la semana muestra Solicitudes = 2 |

## 5. Cierres en el horno (pipeline)

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 5.1 | "+ Agregar posible cierre" | Fila nueva con prospecto, monto, etapa y fecha |
| 5.2 | Llenar los 4 campos | Se guardan al salir del campo |
| 5.3 | Recargar | Los datos siguen ahí |
| 5.4 | "✕" | Se borra la fila |

## 5b. Las 4 listas del formato

Son las mismas de las primeras filas del Excel: 5 mejores prospectos,
oportunidades de venta, oportunidades de servicio y desarrollo personal.

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 5b.1 | Escribir en cada una de las 4 listas | Se guarda al salir del campo |
| 5b.2 | Recargar | Los 4 textos siguen ahí |
| 5b.3 | En escritorio | Se ven en 2 columnas; en móvil, apiladas |

## 6. Vista de la dueña (en vivo)

> ⚠️ La sesión vive en `localStorage`, que es **compartido entre pestañas** del
> mismo navegador: si abres agente y dueña en dos pestañas normales, la segunda
> pisa la sesión de la primera. Para verlas lado a lado usa **una ventana normal
> y una de incógnito** (o dos dispositivos, que es como va a pasar en la vida real).

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 6.1 | El agente toca `+` en llamadas | En ≤2 s la dueña ve el puntaje de Julio actualizado, sin recargar |
| 6.2 | El agente agrega una solicitud de $10,000 | La "Comisión est. semana" de la dueña sube **$3,000** (30%) |
| 6.3 | El agente agrega un cierre en el horno | Aparece en la tabla "Cierres en el horno · equipo" y suma al total del pipeline |
| 6.4 | Revisar semáforo | Los agentes sin capturar hoy salen marcados en rojo/alerta |
| 6.5 | Revisar el mock de WhatsApp | Los mensajes traen nombres y números coherentes con lo capturado |

## 7. Móvil

Chrome DevTools → iPhone 14 (390 px). Si DevTools no está a mano, sirve
abrir la consola en la página y montar la app en un iframe de 390 px:

```js
document.documentElement.innerHTML =
  '<body style="margin:0;display:flex;justify-content:center;background:#333">' +
  '<iframe src="/" style="width:390px;height:780px;border:0;background:#fff"></iframe></body>';
```

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 7.1 | Vista agente | 2 tarjetas por fila, el botón `+` grande y cómodo con el pulgar |
| 7.2 | Tour completo | El recuadro nunca se sale de la pantalla ni tapa el elemento iluminado |
| 7.3 | Cierres en el horno | Los campos se apilan, no se desbordan a lo ancho |
| 7.4 | Vista dueña | Tablas apiladas como tarjetas, sin scroll horizontal en el `body` |

---

## Antes de la demo

- [ ] Reiniciar el servidor para tener el seed limpio.
- [ ] Borrar `tour25pts_v1` del navegador con el que vas a presentar.
- [ ] `git push` **y** Deploy manual en EasyPanel
      (`http://187.77.20.78:3000/projects/internos/compose/25puntos/deployments`) — el
      redeploy no es automático.
- [ ] Verificar que https://demo.ambarrojostudios.cloud/ ya trae los cambios (recarga dura).
