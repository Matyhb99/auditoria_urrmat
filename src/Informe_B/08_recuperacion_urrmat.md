# Mejora Tecnológica y Plan de Recuperación — EnergíaViva

**Empresa auditada:** E22 — EnergíaViva  
**Rubro:** Eléctrica / Servicios Básicos  
**Marco de referencia:** ISO/IEC 22301, NIST SP 800-34, ISO/IEC 27035  

---

## 1. Mejora Tecnológica Propuesta

Las siguientes mejoras tecnológicas abordan las vulnerabilidades identificadas y elevan el nivel de madurez de seguridad del portal de clientes de EnergíaViva.

### 1.1 Arquitectura Segura del Portal

**Estado actual (vulnerable):**
```
Internet → Servidor Web (PHP) → Base de Datos MySQL
                 ↕
           SCADA/OT (sin segmentación)
```

**Arquitectura propuesta:**
```
Internet → WAF/CDN (Cloudflare) → Load Balancer
                                       ↓
                              [DMZ] Servidor Web
                              (Docker, no root,
                               sin acceso a SCADA)
                                       ↓
                         [Red interna] BD MySQL
                         (solo acepta conexiones
                          del servidor web)
                                       ↓
                    [Red OT aislada] SCADA/OT
                    (air gap o firewall industrial)
```

### 1.2 Roadmap de Mejoras Tecnológicas

| Plazo | Mejora | Vulnerabilidad que mitiga | Costo estimado |
|-------|--------|---------------------------|----------------|
| Inmediato (< 1 semana) | Implementar prepared statements en toda la BD | SQL Injection | Bajo (refactoring) |
| Inmediato (< 1 semana) | Aplicar htmlspecialchars y CSP | XSS Reflected | Bajo (config) |
| Inmediato (< 1 semana) | Eliminar shell_exec con input usuario | Command Injection | Bajo (refactoring) |
| Corto plazo (1 mes) | Desplegar WAF (ModSecurity / Cloudflare) | Todas | Medio |
| Corto plazo (1 mes) | Contenerizar portal en Docker | Command Injection | Medio |
| Corto plazo (1 mes) | Implementar 2FA para clientes | XSS / Credenciales | Medio |
| Mediano plazo (3 meses) | Segmentación de red OT/IT | Command Injection | Alto |
| Mediano plazo (3 meses) | SIEM para monitoreo centralizado | Detección de incidentes | Alto |
| Mediano plazo (3 meses) | Programa de pentesting anual | Todas | Medio |
| Largo plazo (6 meses) | Certificación ISO/IEC 27001 | Marco general | Alto |

---

## 2. Plan de Recuperación ante Desastres (DR)

### 2.1 Objetivos de Recuperación

| Parámetro | Definición | Valor objetivo EnergíaViva |
|-----------|------------|---------------------------|
| **RPO** (Recovery Point Objective) | Máxima pérdida de datos tolerable | 4 horas |
| **RTO** (Recovery Time Objective) | Tiempo máximo para restaurar el servicio | 8 horas |
| **MTTR** (Mean Time to Recover) | Tiempo promedio de recuperación tras incidente | < 6 horas |

> Justificación: EnergíaViva es un servicio básico esencial. Los clientes deben poder acceder al portal para reportar fallas y pagar cuentas. Un portal caído más de 8 horas genera incumplimientos regulatorios ante la SEC.

---

### 2.2 Clasificación de Incidentes

| Nivel | Criterio | Ejemplo | Tiempo de respuesta inicial |
|-------|----------|---------|----------------------------|
| P1 — Crítico | Brecha de datos confirmada o servicio completamente caído | SQLi explotada, ransomware activo | 15 minutos |
| P2 — Alto | Acceso no autorizado detectado o degradación severa | Sesiones comprometidas, portal lento | 30 minutos |
| P3 — Medio | Anomalías de seguridad sin impacto confirmado | Alertas WAF, escaneos masivos | 2 horas |
| P4 — Bajo | Vulnerabilidades identificadas sin explotación activa | Reporte de bug bounty | 24 horas |

---

### 2.3 Procedimiento de Respuesta a Incidentes

#### Fase 1 — Detección y Clasificación (0–15 min)

1. El SIEM o equipo de monitoreo detecta la anomalía.
2. El analista de seguridad de turno evalúa y clasifica el incidente (P1–P4).
3. Se activa el árbol de llamadas correspondiente al nivel de prioridad.
4. Se abre un ticket en el sistema de gestión de incidentes.

#### Fase 2 — Contención (15 min – 2 horas)

Para **SQL Injection / Command Injection activos:**
- [ ] Activar modo mantenimiento en el portal (bloquear acceso público)
- [ ] Aislar el servidor web comprometido de la red interna
- [ ] Bloquear la IP del atacante en el WAF y firewall perimetral
- [ ] Revocar todas las sesiones activas del portal
- [ ] Cambiar contraseñas del usuario de BD usado por la aplicación
- [ ] Preservar logs del servidor web, BD y WAF (no sobrescribir)

Para **XSS Reflected con robo de sesiones:**
- [ ] Invalidar todas las cookies de sesión activas
- [ ] Bloquear la URL maliciosa en el WAF
- [ ] Notificar a los clientes afectados que cambien sus contraseñas

#### Fase 3 — Erradicación y Corrección (2–6 horas)

- [ ] Identificar y parchear la vulnerabilidad explotada en el código fuente
- [ ] Verificar que no existan backdoors o webshells instalados
- [ ] Revisar integridad de todos los archivos del servidor (checksums)
- [ ] Restaurar desde backup limpio si el servidor fue comprometido
- [ ] Ejecutar análisis de malware en todos los servidores afectados

#### Fase 4 — Recuperación y Restauración (6–8 horas)

- [ ] Desplegar versión parcheada del portal desde repositorio Git verificado
- [ ] Restaurar base de datos desde el último backup íntegro (RPO = 4h)
- [ ] Realizar pruebas de funcionalidad y seguridad básica antes de reabrir
- [ ] Levantar el modo mantenimiento de forma controlada (primero usuarios internos)
- [ ] Monitorear intensivamente durante las primeras 24 horas post-incidente

#### Fase 5 — Post-Incidente (primeras 72 horas)

- [ ] Redactar informe técnico del incidente (causa raíz, impacto, cronología)
- [ ] Notificar a clientes afectados (si hubo exposición de datos personales)
- [ ] Notificar a la Agencia Nacional de Ciberseguridad (ANCI) según Ley 21.663
- [ ] Notificar a la SEC si el incidente afectó operaciones reguladas
- [ ] Realizar análisis de causa raíz (RCA) y lecciones aprendidas
- [ ] Actualizar el plan de DR con los hallazgos

---

### 2.4 Estrategia de Respaldo (Backup)

| Tipo | Frecuencia | Retención | Almacenamiento | Cifrado |
|------|------------|-----------|----------------|---------|
| Backup completo de BD | Diario (02:00 AM) | 30 días | Almacenamiento externo (S3/Azure) | AES-256 |
| Backup incremental de BD | Cada 4 horas | 7 días | Almacenamiento externo | AES-256 |
| Snapshot del servidor web | Semanal | 4 semanas | Cloud provider secundario | AES-256 |
| Backup offline (air gap) | Mensual | 12 meses | Cinta/disco físico fuera del datacenter | AES-256 |

> Los backups **nunca deben estar conectados permanentemente** a la red de producción para evitar que un ransomware los cifre.

---

### 2.5 Comunicación de Crisis

| Audiencia | Canal | Responsable | Plazo |
|-----------|-------|-------------|-------|
| Clientes afectados | Correo electrónico + SMS | Gerencia Comercial | < 72 horas |
| Autoridades (SEC, ANCI) | Oficio formal | Gerencia General + Asesoría Legal | < 72 horas |
| Medios de comunicación | Comunicado de prensa (si es masivo) | Comunicaciones corporativas | Según gravedad |
| Personal interno | Comunicado interno | CISO + Gerencia TI | Inmediato |

---

## 3. Indicadores de Mejora (KPIs de Seguridad)

| KPI | Meta | Medición |
|-----|------|----------|
| Tiempo medio de detección (MTTD) | < 1 hora | SIEM |
| Tiempo medio de respuesta (MTTR) | < 6 horas | Tickets de incidentes |
| Vulnerabilidades críticas sin parchar | 0 en producción | Scans mensuales |
| Cobertura de backups funcionales | 100% | Pruebas de restauración trimestrales |
| Empleados capacitados en seguridad | > 90% | Registro de capacitaciones anuales |