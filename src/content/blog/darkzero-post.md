---
title: DarkZero
description: Machine HTB
pubDate: 2026-06-22
heroImage: ../../assets/darkzeroimage.png
category: Writeup
tags:
  - DarkZero
  - AD
  - MSSQL
  - Trusted Links
  - Unconstrained Delegation
  - TGT Delegation
  - Kerberos
  - ADCS
  - RunasCs
  - windows
  - Hard
draft: false
---

DarkZero es una máquina Windows de dificultad **Hard** basada en un escenario de *assumed breach*: nos entregan credenciales de un usuario de bajos privilegios desde el inicio. El entorno es un bosque de Active Directory con dos dominios (`darkzero.htb` y `darkzero.ext`) unidos por un **trust bidireccional**. La cadena de ataque pasa por un **MSSQL Trusted Link cross-domain**, la recuperación de privilegios de una cuenta de servicio vía **Service Logon (Logon Type 5)**, y finalmente el compromiso del dominio raíz abusando de **TGT Delegation + Unconstrained Delegation**.

Credenciales iniciales:

```
john.w / RFulUtONCOL!
```
## 1. Enumeración

### Escaneo de puertos

Empezamos con un escaneo completo de puertos y luego un escaneo de versiones/scripts sobre los que estén abiertos.

![](images_darkzero/Pasted%20image%2020260518160426.png)

Se observa un **Microsoft SQL Server 2022** escuchando. El propio nmap nos confirma además que el servidor MSSQL tiene **autenticación NTLM habilitada**.

#### MSSQL – (1433)

Validamos que nuestras credenciales iniciales funcionan en la autenticacion con MSSQL y se procede a enumerar

![](images_darkzero/Pasted%20image%2020260518171449.png)

Validamos un linked server, que es una configuración legítima que permite a una instancia SQL ejecutar consultas contra otra instancia remota como si fuera local. El problema aparece cuando ese enlace guarda **credenciales de un login remoto con privilegios altos**: cualquiera que pueda usar el enlace hereda esos privilegios en el otro servidor.

![](images_darkzero/Pasted%20image%2020260519232253.png)

Existe un enlace hacia `DC02.darkzero.ext` (¡el otro dominio del bosque!) y el *Remote Login* configurado es `dc01_sql_svc`. Saltamos al enlace y comprobamos qué privilegios tiene ese login en el servidor remoto.

Probamos habilitar `xp_cmdshell` y ejecutar comandos del sistema operativo en DC02, atravesando la frontera entre dominios.

![](images_darkzero/Pasted%20image%2020260519232803.png)

