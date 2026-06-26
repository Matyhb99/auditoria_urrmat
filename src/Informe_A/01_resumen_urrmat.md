# Resumen de Auditoría — EnergíaViva

## Datos del Auditor

| Campo | Detalle |
|---|---|
| **Estudiante** | Matías Cristóbal Urrutia Miranda |
| **Asignatura** | TI3034 — Fundamentos de Seguridad de la Información |
| **Docente** | Rubén Schnettler |
| **Sección** | Lunes |
| **Período** | Otoño 2026 |
| **Código proyecto** | `auditoria_urrmat` |

---

## La Empresa Auditada: EnergíaViva

**EnergíaViva** es una empresa de distribución eléctrica y servicios básicos que opera en Chile. Presta servicios de suministro eléctrico a clientes residenciales, comerciales e industriales en su zona de concesión, actuando bajo regulación de la Comisión Nacional de Energía (CNE) y la Superintendencia de Electricidad y Combustibles (SEC).

### Misión
Garantizar el suministro eléctrico continuo y seguro a sus clientes, ofreciendo servicios digitales modernos para la autogestión del consumo, facturación y atención al cliente.

### Portal de Clientes

El **Portal de Clientes de EnergíaViva** es una aplicación web accesible en `www.energiaviva.cl/clientes`. A través de él, los clientes pueden:

- Consultar y pagar sus **facturas y boletas** de consumo eléctrico.
- Revisar su **historial de consumo** en kWh por período.
- Solicitar **cortes, reconexiones y cambios de medidor**.
- Actualizar sus **datos personales y bancarios** para pago automático.
- Reportar **fallas o averías** en el suministro.
- Descargar **certificados de servicio** para trámites legales.

### Datos que custodia el portal

| Categoría | Ejemplos |
|---|---|
| Datos personales | RUT, nombre completo, dirección del suministro, teléfono, correo |
| Datos de pago | Número de cuenta bancaria, datos de tarjeta para PAC/PAT |
| Datos de consumo | Lecturas de medidor, historial mensual de kWh |
| Datos contractuales | Número de cliente, tipo de tarifa, potencia contratada |
| Datos operacionales | Solicitudes de corte/reconexión, reportes de falla |

### Relevancia de la seguridad en el sector eléctrico

El sector de distribución eléctrica es considerado **infraestructura crítica** del Estado. Una brecha de seguridad en el portal de EnergíaViva puede provocar:

1. **Robo de identidad y fraude bancario**: los datos de RUT, dirección y cuenta bancaria permiten suplantar la identidad del cliente para solicitar créditos o realizar transferencias fraudulentas.
2. **Manipulación de datos de consumo**: un atacante podría alterar lecturas de medidor, afectando la facturación de miles de clientes o favoreciendo el robo de energía.
3. **Interrupción de servicios esenciales**: el acceso no autorizado al sistema podría generar órdenes falsas de corte masivo del suministro eléctrico.
4. **Sanciones regulatorias**: la Ley 21.663 de Ciberseguridad en Chile clasifica a las distribuidoras eléctricas como operadores de importancia vital (OIV), sujetos a obligaciones especiales y multas por incidentes de seguridad.
5. **Daño reputacional severo**: la pérdida de confianza en una empresa de servicios básicos puede derivar en sanciones políticas y regulatorias además de las económicas.

---

## Alcance de la auditoría

Esta auditoría evalúa tres vulnerabilidades críticas encontradas en el portal de clientes de EnergíaViva, ejecutadas en el entorno controlado **DVWA (Damn Vulnerable Web Application)**, que simula el stack tecnológico del portal:

| # | Vulnerabilidad | Vector | Sección |
|---|---|---|---|
| 1 | Inyección SQL | Base de datos de clientes | `02_sqli_urrmat.md` |
| 2 | Cross-Site Scripting (XSS Reflected) | Navegador del cliente | `03_xss_urrmat.md` |
| 3 | Inyección de Comandos del SO | Servidor de aplicaciones | `04_comandos_urrmat.md` |

> **Marco ético-legal**: Todos los ataques se realizaron exclusivamente en el entorno DVWA autorizado para esta actividad académica. Atacar sistemas sin autorización es delito en Chile conforme a la **Ley 21.459 sobre Delitos Informáticos**. Estas técnicas se documentan con fines estrictamente defensivos.
