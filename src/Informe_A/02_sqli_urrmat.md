# Ataque 1 — Inyección SQL (SQLi)

## Contexto en EnergíaViva

El portal de clientes de EnergíaViva permite consultar el historial de consumo y datos de cuenta ingresando el **número de cliente** en un formulario de búsqueda. Este campo interactúa directamente con la base de datos relacional que almacena RUT, datos bancarios y lecturas de medidor de todos los clientes.

---

## 1. Evidencia del Ataque

### Entorno
- **Plataforma**: DVWA (Damn Vulnerable Web Application) — nivel de seguridad: **Low**
- **Módulo atacado**: SQL Injection
- **URL**: `http://<dvwa-host>/vulnerabilities/sqli/`

### Payload utilizado

```
' OR '1'='1
```

### Procedimiento

1. Se accedió al módulo **SQL Injection** de DVWA, que simula el formulario de búsqueda de usuario del portal de EnergíaViva.
2. Se ingresó el payload `' OR '1'='1` en el campo "User ID".
3. Se envió el formulario sin ninguna credencial válida.
4. El sistema devolvió **todos los registros de la base de datos** de usuarios, incluyendo nombres de usuario y hashes de contraseñas.

### Captura del ataque

![SQLi](img_urrmat/sqli_urrmat.png)

*Figura 1: Resultado del ataque SQLi en DVWA — se exponen todos los registros de usuarios de la base de datos.*

### Resultado observado

La consulta retornó todos los registros almacenados, entre ellos:

| First name | Surname |
|---|---|
| admin | admin |
| Gordon | Brown |
| Hack | Me |
| Pablo | Picasso |
| Bob | Smith |

En el contexto de EnergíaViva, esto equivaldría a exponer la **tabla de clientes completa**: RUT, nombre, dirección de suministro, datos bancarios para PAC/PAT y lecturas de medidor de potencialmente miles de usuarios.

---

## 2. ¿Por qué funciona esta vulnerabilidad?

### Explicación técnica

La inyección SQL ocurre cuando la aplicación **construye consultas SQL concatenando directamente** el input del usuario, sin validarlo ni parametrizarlo. La consulta vulnerable en el backend de DVWA tiene esta forma:

```php
// Código vulnerable (PHP)
$query = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
```

Cuando el usuario ingresa `' OR '1'='1`, la consulta resultante queda:

```sql
SELECT first_name, last_name FROM users WHERE user_id = '' OR '1'='1';
```

La condición `'1'='1'` es **siempre verdadera**, por lo que la cláusula `WHERE` no filtra ningún registro y la base de datos retorna **todas las filas** de la tabla.

### ¿Por qué es especialmente grave en EnergíaViva?

En una distribuidora eléctrica regulada como EnergíaViva, la base de datos de clientes contiene:
- **RUT**: identificador único nacional, útil para suplantación de identidad.
- **Datos bancarios**: cuenta corriente o tarjeta para pago automático (PAC/PAT).
- **Dirección física del suministro**: geolocaliza el domicilio del cliente.
- **Historial de consumo**: permite inferir patrones de presencia/ausencia en el hogar.

Un atacante con acceso a esta información puede ejecutar **fraude bancario, robo de identidad y delitos físicos** contra los clientes.

### Variantes posibles con este vector

- **SQLi basado en UNION**: recuperar columnas de otras tablas (credenciales de administradores).
- **SQLi ciego (Blind SQLi)**: extraer información carácter por carácter sin respuesta directa.
- **SQLi de escritura**: con `INSERT` o `UPDATE`, modificar lecturas de medidor o datos de facturación.

---

## 3. Puntuación y Severidad CVSS v3.1

Calculado con la herramienta oficial: [https://www.first.org/cvss/calculator/3.1](https://www.first.org/cvss/calculator/3.1)

### Vector String

```
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:L
```

### Métricas base

| Métrica | Valor | Justificación |
|---|---|---|
| **Attack Vector (AV)** | Network (N) | El portal es accesible desde internet |
| **Attack Complexity (AC)** | Low (L) | El payload es simple y no requiere condiciones especiales |
| **Privileges Required (PR)** | None (N) | No se necesita autenticación previa |
| **User Interaction (UI)** | None (N) | El ataque es directo, sin intervención de otro usuario |
| **Scope (S)** | Changed (C) | Afecta el servidor de base de datos, componente distinto al atacado |
| **Confidentiality (C)** | High (H) | Exposición total de la base de datos de clientes |
| **Integrity (I)** | High (H) | Posibilidad de modificar o eliminar registros |
| **Availability (A)** | Low (L) | Posible denegación de servicio parcial mediante consultas pesadas |

### Resultado

| Puntaje Base | Severidad |
|---|---|
| **9.9** | 🔴 **CRÍTICA** |

---

## 4. Política de Prevención (3.1.4)

> *Objetivo: evitar que la vulnerabilidad pueda ser explotada.*

### POL-SQLi-01: Uso obligatorio de consultas parametrizadas

**Descripción**: Toda consulta SQL que incorpore input del usuario debe utilizar **consultas preparadas (prepared statements)** o un **ORM** (Object-Relational Mapper) que parametrice automáticamente los valores.

**Aplicación en EnergíaViva**: El equipo de desarrollo debe refactorizar todos los módulos de consulta del portal (búsqueda de cuenta, historial de consumo, solicitudes de servicio) para eliminar la concatenación de strings en SQL.

**Ejemplo de código seguro (PHP/PDO)**:
```php
// CORRECTO — Consulta parametrizada
$stmt = $pdo->prepare("SELECT first_name, last_name FROM users WHERE user_id = ?");
$stmt->execute([$id]);
$result = $stmt->fetchAll();
```

### POL-SQLi-02: Principio de mínimo privilegio en base de datos

**Descripción**: El usuario de base de datos utilizado por la aplicación web debe tener **solo los permisos estrictamente necesarios** (SELECT en tablas de lectura; INSERT/UPDATE restringido). Ningún usuario de aplicación debe tener permisos DROP, ALTER o acceso al esquema de información.

### POL-SQLi-03: Validación y sanitización de entradas

**Descripción**: Implementar validación estricta del tipo y formato del input antes de procesarlo. Los campos numéricos (número de cliente, RUT) deben rechazar cualquier carácter no numérico antes de llegar al backend.

### POL-SQLi-04: Capacitación en desarrollo seguro

**Descripción**: Todo el equipo de desarrollo de EnergíaViva debe completar formación en OWASP Top 10 y desarrollo seguro al menos una vez al año, con énfasis en A03:2021 — Injection.

---

## 5. Control de Mitigación (3.1.5)

> *Objetivo: reducir el impacto si la vulnerabilidad es explotada.*

### CTL-SQLi-01: Web Application Firewall (WAF)

**Control**: Implementar un WAF (ej. ModSecurity, AWS WAF, Cloudflare WAF) en frente del portal de clientes, configurado con reglas OWASP Core Rule Set (CRS) para detectar y bloquear payloads SQLi conocidos.

**Eficacia**: Detecta y bloquea la gran mayoría de ataques automatizados y manuales sin modificar el código de la aplicación.

### CTL-SQLi-02: Monitoreo de consultas SQL anómalas

**Control**: Configurar el sistema gestor de base de datos (SGBD) para registrar y alertar sobre consultas que devuelvan un volumen inusualmente alto de registros, consultas que incluyan palabras clave como `UNION`, `OR 1=1`, `--` o `; DROP`, y accesos fuera del horario habitual.

### CTL-SQLi-03: Enmascaramiento de datos sensibles

**Control**: Aplicar **tokenización o enmascaramiento** a los datos bancarios almacenados. Los números de cuenta y tarjeta deben almacenarse cifrados (AES-256), de modo que aunque se extraigan sean inutilizables sin la clave.

### CTL-SQLi-04: Pruebas de penetración periódicas

**Control**: Realizar pentesting con herramientas como SQLMap al menos dos veces al año sobre el portal, y ante cualquier actualización mayor del sistema.
