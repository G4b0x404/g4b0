---
title: Comprometiendo clientes WSUS mediante ADCS y DNS Zone Abuse
description: Secuestrando clientes WSUS mediante certificados falsos y envenenamiento DNS.
pubDate: 2026-05-01T04:00:00.000Z
heroImage: ../../assets/wsus4.png
category: Blog
draft: false
tags:
  - WSUS
  - ADCS
  - DNS_Zone
  - DNS
---

Antes de entrar de lleno a la parte práctica y los comandos, es vital asentar las bases teóricas. A menudo, en el mundo del *Red Teaming*, nos encontramos con vulnerabilidades que nacen no de un error de código, sino de una mitigación humana mal implementada. Este es el caso de **ESC17**. 

Para entender cómo llegamos aquí, primero debemos aclarar algunos conceptos clave sobre la infraestructura de Microsoft. 
## ¿Qué significa "ESC"? 

La denominación **ESC** hace referencia a vulnerabilidades enfocadas exclusivamente en abusar de **AD CS** (Active Directory Certificate Services). El número que le sigue (ESC1, ESC8, ESC17, etc.) es simplemente una convención creada por investigadores de ciberseguridad para catalogar estas técnicas en orden de descubrimiento. 
El servidor AD CS actúa como la "oficina de pasaportes" de una red corporativa: emite certificados digitales que los usuarios y las máquinas utilizan para autenticarse, cifrar tráfico o firmar código.
## El Rol de WSUS en la Red 

Por otro lado, tenemos a **WSUS** (Windows Server Update Services). Este es un servicio vital para el ahorro de ancho de banda en cualquier infraestructura corporativa. Su función es permitir a los administradores de TI descargar actualizaciones desde los servidores de Microsoft una sola vez y distribuirlas automáticamente a todos los *endpoints* del dominio, en lugar de que cada máquina lo haga individualmente saturando la red. 

Históricamente, el servicio de WSUS funcionaba por **HTTP** en texto plano. Esto era un problema enorme de seguridad: permitía a los atacantes en la red local realizar un ataque *Machine-in-the-Middle* (MITM) e inyectar actualizaciones maliciosas que se ejecutaban con los máximos privilegios del sistema (`NT AUTHORITY\SYSTEM`). Para evitar esto, la industria recomendó la mitigación lógica: **migrar WSUS a HTTPS** para cifrar el tráfico y validar la identidad del servidor. 
## El Origen de ESC17: Una mitigación a medias 

Aquí es donde la historia se pone interesante y donde entra la vulnerabilidad **ESC17**, detallada recientemente por investigadores de la firma *Digitrace* con el post [Using ADCS to Attack HTTPS-Enabled WSUS Clients](https://blog.digitrace.de/2026/01/using-adcs-to-attack-https-enabled-wsus-clients/)(basándose en el trabajo de Austin Coontz). 
ESC17 aparece de manera curiosa como consecuencia de una mala solución a una vulnerabilidad famosa anterior: **ESC1**. Cuando se descubrió ESC1, los administradores de sistemas corrieron a mitigarla. Eliminaron de sus plantillas de certificados de AD CS los permisos críticos (los EKU de *Client Authentication*), ya que estos permitían a los atacantes iniciar sesión como Administradores de Dominio. 

Sin embargo, dejaron intactos los permisos de **Autenticación de Servidor** (*Server Authentication*), asumiendo que eran inofensivos porque "solo sirven para levantar páginas web internas con HTTPS". **Grave error.** 

ESC17 demuestra que un atacante puede abusar de esa plantilla "parcheada" para emitir un certificado falso de servidor, romper la confianza del canal HTTPS de WSUS y comprometer las máquinas de la red. Si el certificado proviene del AD CS legítimo de la empresa, las computadoras confiarán ciegamente en él.

## El eslabón perdido: ADIDNS (DNS Zone Abuse) 

Los enfoques iniciales para explotar esta falla dependían de hacer *ARP Spoofing* para interceptar el tráfico. La limitación técnica de esto es que requería que el atacante y la víctima estuvieran en el mismo segmento de red (Capa 2). Aquí entra el vector documentado por *Mustafa Durukan* [ESC17: From ADCS Misconfiguration to WSUS Client Compromise via DNS Zone Abuse | Mustafa Durukan](https://mustafanafizdurukan.github.io/posts/esc17-wsus-dns-abuse/). 

En un entorno de Active Directory, la zona DNS integrada (ADIDNS) permite, por defecto, que *cualquier usuario autenticado* cree nuevos registros DNS. Si un atacante inyecta un registro (o un comodín `*`) apuntando desde el FQDN del servidor WSUS hacia la IP de su máquina atacante, el tráfico de *todos* los clientes del dominio será redirigido hacia él de forma nativa, saltándose la restricción de subredes.