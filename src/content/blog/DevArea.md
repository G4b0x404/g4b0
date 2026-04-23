---
title: DevArea
description: Machine of Season 10 - Hack The Box
pubDate: 2026-04-01
heroImage: ../../assets/portadadevarea.png
category: Writeup
tags:
  - DevArea
  - WebPentest
  - HTB
  - XML
  - Medium
  - Season10
  - HoverFLY
  - writeup
draft: false
---
## 1. Enumeración

### Escaneo de Puertos

Iniciamos con la busqueda de puertos abiertos

#### Port 21 - ftp

![](images/Pasted%20image%2020260402115257.png)


#### Port 22 - ssh , 80 - http , 8080 - http

![](images/Pasted%20image%2020260402115316.png)


#### Port 8500 - fmtp? , 8888 - http

![](images/Pasted%20image%2020260402115339.png)


### Enumeracion de Servicios

#### FTP

Se observa que tenemos el puerto 21 FTP abierto y que tenemos acceso como el usuario anonymous, con esto, validamos:

![](images/Pasted%20image%2020260402115437.png)


Encontramos un directorio pub y dentro un archivo .jar (employee-service.jar)

![](images/Pasted%20image%2020260402115451.png)



Sabemos que un archivo .jar es como un .zip de puras aplicaciones y archivos netamente java, asi que para descomprimirlo usaremos UNZIP

Previo a descomprimir, listaremos la cantidad de archivos que contiene revisando las ultimas 10 lineas

![](images/Pasted%20image%2020260402115502.png)



En este caso como son demasiados archivos, procedemos extraer solo los que pertenezcan al backend de DevArea, si listamos las primeras 15 lineas:

![](images/Pasted%20image%2020260402115513.png)



Para extraer estos archivos, inidicaremos a UNZIP que del comprimido employee-service.jar solo extraiga todo lo que se encuentren dentro de el directorio “htb” en el directorio “devareacode”

![](images/Pasted%20image%2020260402115522.png)



Para revisar los archivos, tenemos 2 opciones ( jadx y javap) en mi caso usaré “javap” ya que en mi OS Parrot Security ya viene por defecto esta herramienta.

![](images/Pasted%20image%2020260402115534.png)


![](images/Pasted%20image%2020260402115550.png)


![](images/Pasted%20image%2020260402115604.png)

![](images/Pasted%20image%2020260402115621.png)


![](images/Pasted%20image%2020260402115659.png)



Dentro de los archivos, observamos que existen codigos  de operacion por cada instruccion que se va a aplicar.

Si observamos la clase Server Starter, vemos que en el codigo “new” hace el llamado a apache.cxf

![](images/Pasted%20image%2020260402115714.png)



Por lo que con esto vemos que el servicio que corre en el backend es un Apache CXF.

Este servicio es un framework que permite la comunicacion entre varias aplicaciones, tiene 2 caracteristicas JAXWS y JAXRS, respectivamente utiliza los protocolos SOAP (que trabaja con archivos XML) y REST (que trabaja con archivos JSON y otros).

De la misma captura nos damos cuenta que trabaja con JAXWS por lo que en consecuencia, hace uso del protocolo SOAP y asu vez utilizando archivos XML.

Si observamos desde la linea 26 hasta la 52, vemos que existe una carga de tipo string con la ruta *http://0.0.0.0:8080/employeeservice*, realizado por el OPCODE “ldc”

Lineas mas abajo vemos las misma operación con la ruta *http://0.0.0.0:8080/employeeservice?wsdl*


![](images/Pasted%20image%2020260402115735.png)


Los archivos de tipo WSDL son archivos XML que indica como procesa la información que recibe el backend para que distintos inputs que reciba este pueda ser leido sin problemas.

Revisamos la ruta:

![](images/Pasted%20image%2020260402115748.png)



Ok luego de

![](images/Pasted%20image%2020260402115759.png)



![](images/Pasted%20image%2020260402115808.png)



![](images/Pasted%20image%2020260402115824.png)


![](images/Pasted%20image%2020260402115834.png)



