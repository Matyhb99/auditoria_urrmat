# Matriz de Riesgo — EnergíaViva

**Empresa auditada:** E22 — EnergíaViva  
**Metodología:** Probabilidad × Impacto (escala 1–5)  

---

## 1. Escala de Valoración

### Probabilidad (P)
| Nivel | Valor | Descripción |
|-------|-------|-------------|
| Muy baja | 1 | El evento es excepcional y poco probable |
| Baja | 2 | Podría ocurrir alguna vez en varios años |
| Media | 3 | Podría ocurrir una vez al año |
| Alta | 4 | Ocurre varias veces al año |
| Muy alta | 5 | Ocurre frecuentemente / vulnerabilidad activamente explotada |

### Impacto (I)
| Nivel | Valor | Descripción |
|-------|-------|-------------|
| Insignificante | 1 | Sin consecuencias relevantes para el negocio |
| Menor | 2 | Impacto leve, recuperable sin mayores costos |
| Moderado | 3 | Daño significativo, requiere intervención |
| Mayor | 4 | Daño grave, afecta operaciones críticas |
| Catastrófico | 5 | Daño irreversible, puede comprometer la continuidad |

### Nivel de Riesgo (R = P × I)
| Rango | Clasificación | Color |
|-------|---------------|-------|
| 1 – 4 | Bajo | 🟢 Verde |
| 5 – 9 | Medio | 🟡 Amarillo |
| 10 – 14 | Alto | 🟠 Naranja |
| 15 – 25 | Crítico | 🔴 Rojo |

---

## 2. Identificación y Valoración de Riesgos

| ID | Riesgo | Activo afectado | Vulnerabilidad | P | I | R = P×I | Nivel |
|----|--------|----------------|----------------|---|---|---------|-------|
| R01 | Exfiltración masiva de datos de clientes | D01 — BD clientes | SQL Injection | 5 | 5 | **25** | 🔴 Crítico |
| R02 | Toma de control del servidor web | S01 — Portal web / I01 | Command Injection | 4 | 5 | **20** | 🔴 Crítico |
| R03 | Robo de datos bancarios y de tarjetas | D03 — Datos de pago | SQL Injection | 5 | 4 | **20** | 🔴 Crítico |
| R04 | Movimiento lateral hacia SCADA/OT | I05 — SCADA | Command Injection | 3 | 5 | **15** | 🔴 Crítico |
| R05 | Secuestro de sesión de clientes | D05 — Credenciales | XSS Reflected | 4 | 4 | **16** | 🔴 Crítico |
| R06 | Fraude en mediciones de consumo | D02 — Registros consumo | SQL Injection | 4 | 4 | **16** | 🔴 Crítico |
| R07 | Instalación de malware/ransomware | I04 — Backups / Servidores | Command Injection | 3 | 5 | **15** | 🔴 Crítico |
| R08 | Phishing a clientes vía enlace XSS | D05 — Credenciales | XSS Reflected | 4 | 3 | **12** | 🟠 Alto |
| R09 | Interrupción del portal de clientes | S01 — Portal web | Command Injection | 3 | 4 | **12** | 🟠 Alto |
| R10 | Exposición de contratos industriales | D06 — Clientes industriales | SQL Injection | 3 | 4 | **12** | 🟠 Alto |
| R11 | Suplantación de identidad de clientes | D01 — BD clientes | XSS / SQLi | 3 | 3 | **9** | 🟡 Medio |
| R12 | Incumplimiento regulatorio SEC | — | Todas | 5 | 3 | **15** | 🔴 Crítico |

---

## 3. Mapa de Calor (Heatmap)

La siguiente tabla representa visualmente la distribución de riesgos según probabilidad e impacto:

```
         IMPACTO
         1-Insig  2-Menor  3-Moder  4-Mayor  5-Catastr
         ┌────────┬────────┬────────┬────────┬────────┐
5-MuyAlta│  🟢    │  🟡    │  🔴 R12│  🔴    │  🔴 R01│
         │        │        │        │        │        │
4-Alta   │  🟢    │  🟡    │  🟠 R08│  🔴 R05│  🔴 R03│
         │        │        │        │  🔴 R06│        │
3-Media  │  🟢    │  🟡    │  🟡 R11│  🟠 R09│  🔴 R04│
         │        │        │        │  🟠 R10│  🔴 R07│
         │        │        │        │        │  🔴 R02│
2-Baja   │  🟢    │  🟢    │  🟡    │  🟡    │  🟠    │
         │        │        │        │        │        │
1-MuyBaj │  🟢    │  🟢    │  🟢    │  🟡    │  🟡    │
         └────────┴────────┴────────┴────────┴────────┘
P
R
O
B
A
B
I
L
I
D
A
D
```

> **Nota:** El componente React (Matriz.jsx) renderiza este mapa de calor como un componente visual interactivo con colores reales.

---

## 4. Priorización de Riesgos

### Riesgos Críticos (acción inmediata)

| Prioridad | ID | Riesgo | R | Acción |
|-----------|-----|--------|---|--------|
| 1 | R01 | Exfiltración masiva de datos de clientes | 25 | Implementar prepared statements de inmediato |
| 2 | R03 | Robo de datos bancarios | 20 | Prepared statements + cifrado de BD |
| 3 | R02 | Toma de control del servidor | 20 | Eliminar shell_exec con input de usuario |
| 4 | R12 | Incumplimiento regulatorio SEC | 15 | Notificar a equipo legal, preparar planes de respuesta |
| 5 | R05 | Secuestro de sesión de clientes | 16 | htmlspecialchars + HttpOnly en cookies |
| 6 | R06 | Fraude en mediciones | 16 | Prepared statements + auditoría de BD |
| 7 | R04 | Movimiento lateral a SCADA | 15 | Segmentación de red urgente |
| 8 | R07 | Ransomware en servidores | 15 | Parcheo + contenerización + backups offline |

### Riesgos Altos (atención en 30 días)

| Prioridad | ID | Riesgo | R | Acción |
|-----------|-----|--------|---|--------|
| 9 | R08 | Phishing vía XSS | 12 | Implementar CSP + HttpOnly |
| 10 | R09 | Interrupción del portal | 12 | WAF + Plan de continuidad |
| 11 | R10 | Exposición contratos industriales | 12 | Control de acceso por roles |