# Bitácora de Uso de Inteligencia Artificial — 09_prompts_urrmat.md

**Estudiante:** Matías Cristóbal Urrutia Miranda  
**Empresa:** E22 — EnergíaViva  
**Herramienta principal:** Claude (Anthropic) — claude.ai  

---

## Registro de Prompts por Sección

---

### Sección 1 — Resumen (01_resumen_urrmat.md)

**Prompt utilizado:**
> "Necesito redactar el archivo 01_resumen para mi auditoría de seguridad web. Mi empresa asignada es EnergíaViva (es una empresa ficticia), que tiene rubro de eléctrico y servicios básicos. El portal de clientes custodia datos de clientes (RUT, consumo eléctrico, datos de pago). Genera un resumen ejecutivo que describa la empresa, el portal, los datos que custodia y el impacto potencial de una brecha de seguridad en el contexto de una empresa eléctrica en Chile, considerando la regulación de la SEC y la Ley 19.628."

**Qué acepté:** La estructura general del resumen, la descripción del portal y las funcionalidades típicas de un portal eléctrico, la tabla de datos custodiados y el impacto en el negocio con marco regulatorio chileno.

**Qué corregí / ajusté:** Verifiqué que las leyes mencionadas (Ley 19.628, Ley 21.459, SEC) fueran correctas y aplicables al rubro. Ajusté el tono para que reflejara el contexto real de una empresa de servicios básicos en Chile.

**Reflexión:** El prompt funcionó bien porque especifiqué el rubro, el tipo de datos y el marco legal específico de Chile. Un prompt genérico habría generado un texto sin contexto nacional.

---

### Sección 2 — SQL Injection (02_sqli_urrmat.md)

**Prompt utilizado:**
> "Redacta el archivo 02_sqli para la auditoría de EnergíaViva (empresa eléctrica / servicios básicos). El ataque fue SQL Injection con el payload ' OR '1'='1 en DVWA nivel Low. URL: https://dvwa-dnwe.onrender.com/vulnerabilities/sqli/. El resultado fue la exposición de todos los usuarios de la BD. Necesito: (1) descripción del resultado con impacto específico para una empresa eléctrica, (2) explicación técnica de por qué funciona con ejemplo de código vulnerable vs. seguro, (3) cálculo CVSS 3.1 justificado métrica por métrica, (4) política de prevención que mencione prepared statements y OWASP, (5) controles de mitigación con tabla y ejemplo de código PDO."

**Qué acepté:** La explicación técnica del funcionamiento de la SQLi, el vector CVSS con justificación métrica a métrica, el ejemplo de código seguro con PDO, y la tabla de controles adicionales.

**Qué corregí / ajusté:** Verifiqué el score CVSS manualmente en https://www.first.org/cvss/calculator/3.1 para confirmar que el vector `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:L` da 9.1 (Crítico). Ajusté el impacto en negocio para incluir referencias a la SEC y la manipulación de registros de consumo, que son específicas del rubro eléctrico.

**Reflexión:** El nivel de detalle del prompt (empresa, payload específico, URL, requerimientos por punto) produjo contenido directamente usable. Cuando intenté un prompt sin nombrar la empresa ni el payload, el resultado fue genérico e intercambiable.

---

### Sección 3 — XSS Reflected (03_xss_urrmat.md)

**Prompt utilizado:**
> "Redacta el archivo 03_xss para la auditoría de EnergíaViva (empresa eléctrica). El ataque fue XSS Reflected con payload <script>alert('XSS')</script> en DVWA módulo XSS (Reflected), nivel Low. Describe: (1) impacto específico para clientes de una empresa de servicios básicos (phishing, robo de sesión para pagar cuentas falsas), (2) explicación técnica con el flujo del ataque URL → servidor → navegador, (3) CVSS 3.1 con justificación, notando que requiere interacción del usuario (UI:R) y cambia el alcance (S:C), (4) política de prevención enfocada en codificación de output, (5) controles con ejemplo htmlspecialchars y cabecera CSP."

**Qué acepté:** El flujo técnico del ataque (URL maliciosa → servidor la refleja → navegador ejecuta), la justificación de UI:R y S:C en el CVSS (que diferencian XSS de SQLi), la cabecera CSP de ejemplo.

**Qué corregí / ajusté:** Ajusté el score CVSS verificándolo en la calculadora. Agregué el contexto específico de EnergíaViva: que el robo de sesión podría usarse para cambiar la cuenta bancaria de débito automático del cliente, lo cual es un impacto real en el rubro.

**Reflexión:** Especificar las diferencias de CVSS respecto al ataque anterior (UI:R vs UI:N, S:C vs S:U) en el prompt fue clave para obtener un análisis diferenciado y no genérico.

---

### Sección 4 — Command Injection (04_comandos_urrmat.md)

**Prompt utilizado:**
> "Redacta el archivo 04_comandos para la auditoría de EnergíaViva. El ataque fue Command Injection con payload '127.0.0.1; cat /etc/passwd' en DVWA, nivel Low. El resultado fue la exposición del archivo /etc/passwd del servidor. Necesito: (1) descripción del resultado y por qué /etc/passwd es relevante para el atacante, (2) explicación técnica con el código PHP vulnerable y cómo el operador ';' permite encadenar comandos, (3) CVSS 3.1 con S:C porque afecta el SO fuera de la aplicación y A:H porque puede detener servicios, (4) impacto específico para EnergíaViva considerando posible movimiento lateral hacia sistemas SCADA, (5) controles técnicos con ejemplo de regex lista blanca y alternativa sin shell_exec."

**Qué acepté:** La explicación del operador `;` en bash para encadenar comandos, el código PHP vulnerable y la corrección con `escapeshellarg()` y regex, el análisis del movimiento lateral hacia SCADA como vector específico de una empresa eléctrica.

**Qué corregí / ajusté:** El score CVSS 10.0 lo verifiqué manualmente. Agregué la referencia a la Ley 21.459 (delitos informáticos) que la IA inicialmente omitió. Revisé que la mención a SCADA fuera técnicamente coherente (acceso desde red IT a OT).

**Reflexión:** Mencionar explícitamente el impacto en SCADA en el prompt fue decisivo. Sin eso, la IA habría generado un análisis de Command Injection estándar, sin el riesgo diferencial que tiene esta vulnerabilidad en infraestructura eléctrica.

---

### Secciones 5–8 — Activos, Matriz, Controles y Recuperación

**Prompt utilizado (ejemplo para matriz):**
> "Redacta el archivo 06_matriz para EnergíaViva (eléctrica/servicios básicos). Usa metodología probabilidad × impacto (escala 1-5, resultado 1-25). Que dentificas al menos 10 riesgos derivados de las tres vulnerabilidades auditadas (ya que solo pude encontrar 4) (SQLi, XSS, Command Injection) y del contexto específico de una empresa eléctrica (infraestructura crítica, SCADA, regulación SEC). Para cada riesgo indica: activo afectado, vulnerabilidad que lo origina, P, I, R=P×I y nivel de riesgo (Bajo/Medio/Alto/Crítico con colores). Incluye un mapa de calor ASCII y tabla de priorización. Los riesgos deben conectarse con los IDs de activos del archivo 05_activos."

**Qué acepté:** La estructura de la tabla de riesgos con IDs consistentes, el mapa de calor ASCII, la conexión entre riesgos y activos del 05_activos.

**Qué corregí / ajusté:** Revisé manualmente que los valores P×I fueran coherentes con la gravedad del sector. Ajusté el riesgo de movimiento a SCADA (R04) elevando el impacto a 5 por tratarse de infraestructura crítica. Agregué el riesgo R12 de incumplimiento regulatorio SEC, que la IA no había incluido inicialmente.

**Reflexión general:** El uso de IDs consistentes entre archivos (D01, S01, R01) debe especificarse en el prompt o la IA genera nomenclaturas distintas en cada sección. Aprendí a pedir que los IDs sean coherentes entre archivos desde el primer prompt.

---

## Reflexión Final sobre el Uso de IA

Fue clave para ayudar lo que tenia de estructurado con mis analisis previos a la ayuda de la IA, donde sin embargo, la IA por sí sola no puede:

1. **Tomar las capturas de pantalla** — Eso requirió ejecutar los ataques en DVWA personalmente.
2. **Verificar los scores CVSS** — Cada puntuación fue comprobada manualmente en la calculadora de FIRST.
3. **Aplicar el contexto regulatorio chileno con precisión** — Se requirió revisar que las leyes citadas (Ley 19.628, Ley 21.459, Ley 21.663, normativas SEC) fueran correctas y vigentes.
4. **Conectar los riesgos con el contexto real de EnergíaViva** — La IA tendía a generar análisis genéricos; el valor diferencial provino de los prompts que especificaban el rubro, los activos concretos y el marco regulatorio.

**Conclusión:** La IA es una herramienta de aceleración, no un sustituto del análisis. Los prompts específicos y contextualizados producen contenido de calidad; los prompts genéricos producen contenido intercambiable que no demuestra comprensión real de la vulnerabilidad ni del negocio auditado.
