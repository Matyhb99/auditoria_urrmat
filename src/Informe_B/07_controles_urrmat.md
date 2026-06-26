# Políticas de Prevención y Controles de Mitigación — EnergíaViva

**Empresa auditada:** E22 — EnergíaViva  
**Marco de referencia:** OWASP Top 10, ISO/IEC 27001, NIST SP 800-53  

---

## 1. Políticas de Prevención (3.1.4)

Las políticas de prevención son directrices organizacionales que buscan evitar que las vulnerabilidades existan desde el origen, aplicando principios de seguridad desde el diseño.

---

### POL-01 — Desarrollo Seguro de Software (DevSecOps)

**Objetivo:** Integrar la seguridad en cada etapa del ciclo de vida del desarrollo de software del portal de clientes.

**Alcance:** Todo el equipo de desarrollo, QA y DevOps de EnergíaViva.

**Directrices:**
- Todo código nuevo debe pasar por análisis de seguridad estático (SAST) antes de ser desplegado.
- Prohibido el uso de concatenación de strings para construir consultas SQL con input de usuario.
- Prohibido el uso de funciones de ejecución de comandos del SO (`shell_exec`, `exec`, `system`) con datos provenientes del usuario sin lista blanca validada.
- Todo output HTML que incluya datos de usuario debe ser codificado con funciones de escape.
- Se realizarán revisiones de código (code reviews) con enfoque de seguridad obligatorias antes de cada merge a producción.

**Estándar:** OWASP Secure Coding Practices; ISO/IEC 27034.

---

### POL-02 — Gestión de Credenciales y Autenticación

**Objetivo:** Garantizar que el acceso al portal de clientes sea seguro y que las credenciales estén protegidas.

**Directrices:**
- Las contraseñas deben almacenarse usando hashing con bcrypt (costo mínimo 12) o Argon2.
- Implementar autenticación de dos factores (2FA) para clientes con datos de pago registrados.
- Las sesiones deben expirar automáticamente tras 15 minutos de inactividad.
- Las cookies de sesión deben tener atributos `HttpOnly`, `Secure` y `SameSite=Strict`.
- Bloquear cuentas tras 5 intentos de inicio de sesión fallidos consecutivos.

---

### POL-03 — Seguridad en la Infraestructura y Separación de Ambientes

**Objetivo:** Proteger la infraestructura del portal de clientes y limitar el impacto de una brecha.

**Directrices:**
- Los servidores web y de base de datos deben estar en segmentos de red separados (DMZ).
- El portal de clientes no debe tener conectividad directa con sistemas SCADA/OT.
- Se debe aplicar el principio de mínimo privilegio: el proceso web no puede ejecutarse como root.
- Los entornos de desarrollo, QA y producción deben estar completamente separados.
- Todos los servidores de producción deben tener un firewall de aplicación web (WAF) activo.

---

### POL-04 — Protección de Datos Personales y de Pago

**Objetivo:** Cumplir con la Ley 19.628, normativas de la SEC y estándares PCI-DSS para el manejo de datos de clientes.

**Directrices:**
- Los datos de tarjetas de crédito/débito nunca deben almacenarse en los sistemas de EnergíaViva; deben tokenizarse mediante la pasarela de pago (Transbank/WebPay).
- Los datos personales de clientes deben cifrarse en reposo usando AES-256.
- El acceso a la base de datos de clientes está restringido a roles autorizados con registro de auditoría.
- Ante una brecha de datos, EnergíaViva debe notificar a los afectados y a la autoridad competente dentro de las 72 horas.

---

## 2. Controles de Mitigación (3.1.5)

Los controles de mitigación son medidas técnicas y organizacionales que reducen la probabilidad de explotación o el impacto de las vulnerabilidades ya identificadas.

---

### 2.1 Controles para SQL Injection

| Control | Tipo | Descripción | Prioridad |
|---------|------|-------------|-----------|
| Consultas parametrizadas | Técnico | Reemplazar toda concatenación SQL por prepared statements (PDO/MySQLi) | **Crítica** |
| ORM Framework | Técnico | Usar un ORM (Eloquent, Doctrine) que maneja el escape automáticamente | Alta |
| Validación de tipos | Técnico | Verificar que los campos numéricos solo acepten enteros antes de consultar | Alta |
| Principio de mínimo privilegio en BD | Técnico | El usuario de BD del portal solo puede SELECT/INSERT en tablas autorizadas | Alta |
| WAF con reglas SQLi | Técnico | Activar reglas OWASP Core Rule Set en ModSecurity/Cloudflare WAF | Alta |
| Auditoría de consultas | Operativo | Log y alerta ante consultas que devuelvan más de N registros inesperados | Media |

**Ejemplo de implementación (PHP PDO):**
```php
// ✅ Código seguro con prepared statement
$stmt = $pdo->prepare("SELECT first_name, last_name FROM users WHERE user_id = :id");
$stmt->execute([':id' => $id]);
```

---

### 2.2 Controles para XSS Reflected

| Control | Tipo | Descripción | Prioridad |
|---------|------|-------------|-----------|
| Codificación de output (htmlspecialchars) | Técnico | Escapar caracteres especiales en todo dato reflejado en HTML | **Crítica** |
| Content Security Policy (CSP) | Técnico | Cabecera HTTP que restringe scripts a fuentes autorizadas | Alta |
| HttpOnly y Secure en cookies | Técnico | Impedir acceso a cookies desde JavaScript | Alta |
| Validación de input | Técnico | Rechazar o sanitizar `<`, `>`, `"`, `'` en entradas de texto libre | Alta |
| DOMPurify (frontend) | Técnico | Sanitizar HTML dinámico en el cliente | Media |
| Capacitación OWASP | Organizativo | Entrenamiento anual en codificación segura para desarrolladores | Media |

**Ejemplo de implementación (PHP):**
```php
// ✅ Código seguro con htmlspecialchars
echo '<pre>Hello ' . htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8') . '</pre>';
```

**Cabecera CSP recomendada:**
```
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';
```

---

### 2.3 Controles para Inyección de Comandos

| Control | Tipo | Descripción | Prioridad |
|---------|------|-------------|-----------|
| Eliminar ejecución de comandos del SO | Técnico | Reemplazar `shell_exec` por funciones nativas de PHP/librerías | **Crítica** |
| Lista blanca de inputs | Técnico | Si hay necesidad de comandos, validar con regex estricta (solo IP válidas) | **Crítica** |
| Contenerización (Docker) | Técnico | Aislar la aplicación para limitar el alcance de un RCE | Alta |
| Principio de mínimo privilegio | Técnico | Proceso web ejecutado como usuario sin privilegios | Alta |
| Monitoreo de procesos hijo | Operativo | Alertar si el proceso web genera procesos inesperados | Alta |
| Análisis SAST | Técnico | Detectar uso de shell_exec con variables en el análisis de código | Media |

---

## 3. Resumen de Priorización de Controles

| Vulnerabilidad | Control clave | Impacto en riesgo | Esfuerzo |
|---------------|---------------|-------------------|----------|
| SQL Injection | Prepared statements | R01, R03, R06 → de Crítico a Bajo | Bajo |
| XSS Reflected | htmlspecialchars + CSP | R05, R08 → de Crítico a Bajo | Bajo |
| Command Injection | Eliminar shell_exec / lista blanca | R02, R04, R07 → de Crítico a Bajo | Medio |
| Todas | WAF activado | Reduce probabilidad en todos los R | Medio |
| Todas | Capacitación DevSecOps | Previene nuevas vulnerabilidades | Medio |