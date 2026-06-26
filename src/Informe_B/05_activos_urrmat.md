# Activos de Información y Riesgos — EnergíaViva

**Empresa auditada:** E22 — EnergíaViva  
**Rubro:** Eléctrica / Servicios Básicos  

---

## 1. Identificación de Activos de Información

Los activos de información son todos los elementos que tienen valor para EnergíaViva y que deben ser protegidos. Se clasifican según la norma ISO/IEC 27001.

### 1.1 Activos de Datos

| ID | Activo | Descripción | Clasificación |
|----|--------|-------------|---------------|
| D01 | Base de datos de clientes | RUT, nombre, dirección, teléfono, correo de todos los clientes del servicio | Confidencial |
| D02 | Registros de consumo eléctrico | Mediciones históricas en kWh por cliente y medidor | Confidencial |
| D03 | Datos de pago y facturación | Cuentas bancarias, tarjetas, historial de pagos | Secreto |
| D04 | Contratos de suministro | Tipo de tarifa, potencia contratada, datos del inmueble | Confidencial |
| D05 | Credenciales del portal | Usuarios y contraseñas del portal de clientes | Secreto |
| D06 | Datos de clientes industriales | Contratos de gran consumo, potencia, datos estratégicos | Secreto |
| D07 | Tickets y reportes de fallas | Historial de interrupciones y reclamos | Interno |
| D08 | Datos de empleados internos | RUT, cargo, accesos, remuneraciones del personal TI | Confidencial |

### 1.2 Activos de Software

| ID | Activo | Descripción | Clasificación |
|----|--------|-------------|---------------|
| S01 | Portal web de clientes | Aplicación web de autoatención | Crítico |
| S02 | Sistema de facturación | Software de generación y envío de boletas | Crítico |
| S03 | Base de datos (MySQL/MariaDB) | Motor de base de datos del portal | Crítico |
| S04 | Sistema de medición remota (AMI) | Software de lectura de medidores inteligentes | Crítico |
| S05 | Plataforma de pagos en línea | Integración con Transbank/WebPay | Crítico |

### 1.3 Activos de Infraestructura

| ID | Activo | Descripción | Clasificación |
|----|--------|-------------|---------------|
| I01 | Servidor web | Host del portal de clientes | Crítico |
| I02 | Servidor de base de datos | Servidor que almacena datos de clientes | Crítico |
| I03 | Red corporativa | Infraestructura de comunicaciones interna | Crítico |
| I04 | Respaldos (backups) | Copias de seguridad de datos y configuraciones | Crítico |
| I05 | Sistema SCADA/OT | Infraestructura de control operacional eléctrico | Crítico |

---

## 2. Riesgos según la Industria Eléctrica

### 2.1 Marco Regulatorio Aplicable

EnergíaViva opera bajo un marco regulatorio estricto en Chile:

- **Ley 20.936** — Marco regulatorio del sector eléctrico
- **Ley 19.628** — Protección de la vida privada y datos personales
- **Ley 21.459** — Delitos informáticos
- **Normas de la SEC** (Superintendencia de Electricidad y Combustibles)
- **DS N°66/2021** — Política Nacional de Ciberseguridad
- **Ley Marco de Ciberseguridad 21.663** — Infraestructura crítica

### 2.2 Riesgos por Activo

| Activo | Amenaza | Vulnerabilidad explotada | Consecuencia |
|--------|---------|--------------------------|--------------|
| D01 — BD clientes | Exfiltración masiva | SQL Injection (02_sqli) | Multa SEC, demandas, pérdida de clientes |
| D02 — Consumo eléctrico | Manipulación de mediciones | SQL Injection (02_sqli) | Fraude en facturación, pérdida económica |
| D03 — Datos de pago | Robo de tarjetas y cuentas | SQL Injection / Command Injection | Fraude financiero, infracción PCI-DSS |
| D05 — Credenciales | Secuestro de sesiones de clientes | XSS Reflected (03_xss) | Acceso no autorizado, suplantación |
| S01 — Portal web | Toma de control del servidor | Command Injection (04_comandos) | Interrupción del servicio, ransomware |
| I05 — SCADA/OT | Movimiento lateral desde portal | Command Injection (04_comandos) | Impacto en infraestructura eléctrica real |

### 2.3 Riesgos Específicos del Sector Eléctrico

El sector eléctrico presenta riesgos únicos respecto a otras industrias:

1. **Infraestructura crítica:** Un ataque exitoso al portal podría servir como punto de entrada hacia sistemas SCADA que controlan la distribución eléctrica real, afectando a miles de hogares y empresas.

2. **Datos sensibles de consumo industrial:** Los patrones de consumo de clientes industriales (mineras, hospitales, industria) son información estratégica y comercialmente valiosa.

3. **Obligaciones de servicio esencial:** EnergíaViva no puede interrumpir el suministro de electricidad sin cumplir procedimientos regulados. Un ataque que paralice el sistema de facturación genera incumplimientos regulatorios automáticos.

4. **Doble regulación:** La empresa está sujeta tanto a regulación de datos personales (Ley 19.628) como a regulación sectorial (SEC), duplicando el impacto de una brecha de seguridad.

---

## 3. Valoración de Activos

Escala de valoración: **1 (Bajo)** a **5 (Crítico)**

| Activo | Confidencialidad | Integridad | Disponibilidad | Valor Total |
|--------|-----------------|------------|----------------|-------------|
| D03 — Datos de pago | 5 | 5 | 4 | **14** |
| I05 — SCADA/OT | 5 | 5 | 5 | **15** |
| S01 — Portal web | 4 | 4 | 5 | **13** |
| D01 — BD clientes | 5 | 4 | 3 | **12** |
| S03 — Base de datos | 5 | 5 | 4 | **14** |
| D06 — Clientes industriales | 5 | 4 | 3 | **12** |