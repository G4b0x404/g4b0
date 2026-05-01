---
title: Active
description: Machine HTB
pubDate: 2/04/2026
heroImage: ../../assets/activeimage.png
category: Writeup
tags:
  - Active
  - AD
  - Kerberoasting
  - GPP
  - SMB
  - windows
  - Easy
draft: false
---
## 1. Enumeración

### Escaneo de puertos


![](images_active/Pasted%20image%2020260402215924.png)


#### SMB  - (139,445)

Probamos acceso sin user ni pass y obervamos que nos da el símbolo [+] sin el símbolo ( Pwned!) por lo que nos valida el acceso sin la obtención de vía potencial directa a la maquina.

![](images_active/Pasted%20image%2020260402231917.png)

Enumeramos la lista de archivos compartidos y observamos que hay solo 1 con capacidad de lectura.

![](images_active/Pasted%20image%2020260402232013.png)

Revisando dicho archivo, vemos un directorio llamado "active.htb"

![](images_active/Pasted%20image%2020260402220640.png)

Al ingresar vemos que se encuentran los típicos archivos de Policies, DfsrPrivate y scripts.

![](images_active/Pasted%20image%2020260402220739.png)

Buscamos el Policies e ingresamos a uno de los directorios, observamos que hay varias carpetas

![](images_active/Pasted%20image%2020260402220757.png)

![](images_active/Pasted%20image%2020260402221157.png)

Ingresamos al directorio MACHINE e ingresamos a Preferences y Groups, dentro de ella encontraremos un archivo llamado Groups.xml

![697](images_active/Pasted%20image%2020260402221319.png)

Lo descargamos y observamos que contiene credenciales. Este punto hace referencia a una vulnerabilidad llamada "GPP Password Elevation Privilege" (MS14-025)

![](images_active/Pasted%20image%2020260402231827.png)


## 2. Análisis de Vulnerabilidades

La vulnerabilidad "GPP Password Elevation Privilege" (MS14-025) consiste en una mala practica en el domain controller que permite la elevacion de privilegios con el uso de las preferencias de la directiva de grupo de Active Directory para distribuir contraseñas por el dominio.

[Microsoft Security Bulletin MS14-025 - Important | Microsoft Learn](https://learn.microsoft.com/en-us/security-updates/SecurityBulletins/2014/ms14-025)


Y porque algun usuario con privilegios permite la distribución de contraseñas?

SI usamos el sentido común, un uso se relaciona con la automatización, supongamos que un día al usuario SVC_TGS se le ocurre realizar cambios a todos los usuarios que pertenecen al dominio, si tomamos en cuenta la cantidad de mas de 100 usuarios, no es viable hacer esto manual, es aqui donde ingresa la utilidad de GPP para hacer la tarea de manera masiva. 

Cabe resaltar que cualquier tarea de GPP que requiera ingresar credenciales ya es vulnerable, porque este mismo genera un archivo XML con variables como "User", "Name" y "cpassword".

Es por eso que cuando el user SVC_TGS programa una tarea con GPP indirectamente almacena sus credenciales en un archivo XML que comúnmente se llama "Groups.xml"

![](images_active/Pasted%20image%2020260403074913.png)

Ahora, este "cpassword" se cifra con AES-256, indudablemente este cifrado es imposible de romper, pero aqui el problema no es el cifrado, sino la llave para descifrar.

AES es un cifrado de tipo simétrico por lo que solo necesita una sola llave para descrifrar, y adivina que, esta llave está expuesta en internet por su mismo fabricante (Microsoft).

En la siguiente captura, la herramienta "gpp_decrypt" en su base de datos ya contiene la llave, por lo que su unico trabajo es descifrarla.

![](images_active/Pasted%20image%2020260402222153.png)

## 3. Explotacion

Con estas credenciales, probamos el acceso mediante SMB y observamos que aparecen mas discos con modo READ ONLY

![](images_active/Pasted%20image%2020260402222427.png)

Ingresamos a Users y buscamos la flag del usuario SVC_TGS

![](images_active/Pasted%20image%2020260402222519.png)

![](images_active/Pasted%20image%2020260402223330.png)

![](images_active/Pasted%20image%2020260402223504.png)

## 4. Escalada de Privilegios (ADMINISTRATOR)

Al inicio vimos que el puerto 88 de Kerberos estaba open, procedemos solicitando la lista de SPNs disponibles, en este caso vemos en la imagen que nos dió el SPN del servicio SMB asociado al usuario Administrator, como ya tenemos un usuario valido, el request procedió sin problemas y nos entregó el TGS del usuario administrador. 

![](images_active/Pasted%20image%2020260402231657.png)

![](images_active/Pasted%20image%2020260402231458.png)


Ya con el ticket, procedemos a crackerarlo utilizando Hashcat con el modo 13100 y el wordlist rockyou.txt

![](images_active/Pasted%20image%2020260402231431.png)


Como no teníamos ningún otro servicio de conexión remota como RDP o WINRM, nos conectamos con psexec como Administrator y buscamos la flag de root

![](images_active/Pasted%20image%2020260402223944.png)

![](images_active/Pasted%20image%2020260402224053.png)
