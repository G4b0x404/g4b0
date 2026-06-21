import { Newspaper, Handshake, Home, Info, Phone } from "lucide-react";
import type { ShBlogConfig } from "./src/types/shblog.config.d";

//
//    ______ _____  __             __   _  __        _____
//   / __/ // / _ )/ /__  ___ _    \ \ / |/ /____ __/ /\  \
//  _\ \/ _  / _  / / _ \/ _ `/     > >    / -_) \ / __/>  >
// /___/_//_/____/_/\___/\_, /     /_/_/|_/\__/_\_\\__//__/
//                      /___/
//     M a k e   B l o g g i n g   G r e a t   A g a i n
//
//
//   SHBlog Next es un sistema de blog moderno construido sobre el framework Astro.
//   Diseñado para creadores de contenido, ofrece una experiencia de escritura eficiente.

const config: ShBlogConfig = {
  // Nombre del sitio
  // Este nombre aparecerá en la pestaña del navegador, cabecera y resultados de búsqueda
  title: "G4b0_Docs",

  // Descripción del sitio
  // Aparecerá en el SEO y metadatos
  description:
    "Blog de G4b0 sobre Seguridad Ofensiva y Pentesting. Explora notas técnicas, metodologías Red Team y writeups detallados de CTFs en Hack The Box.",

  // Idioma del sitio (Etiqueta IETF)
  lang: "es",
  siteLang: "en", // Mantenemos la variable interna del tema para evitar conflictos

  // Ruta del Favicon
  favicon: "/favicon5.png",

  // Configuración de páginas
  pages: {
    // Configuración de la página de inicio
    home: {
      title: "El intruso no avisa\nUn verdadero hacker tampoco.", 
      heroImage: "/assets/layouts/homepage/fondoblog.png", 
      greetings: [
        // Saludos según la hora del día
        {
          begin: 0,
          finish: 6,
          text: "¡Buenas madrugadas! A esta hora el SOC duerme...",
        },
        {
          begin: 6,
          finish: 12,
          text: "¡Buenos días! Happy Hacking :D",
        },
        {
          begin: 12,
          finish: 14,
          text: "¡Buenas tardes! Una pausa activa y regresamos con fuerza",
        },
        {
          begin: 14,
          finish: 18,
          text: "¡Buenas tardes! Recuerda siempre tomar agua",
        },
        {
          begin: 18,
          finish: 21,
          text: "¡Cae la noche! Modo Black Hat.",
        },
        {
          begin: 21,
          finish: 24,
          text: "¡Buenas noches! Ese bounty no se conseguirá solo...",
        },
        {
          text: "¡Hola!",
        },
      ],
    },

    blog: {
      title: "Lista de Artículos",
      subTitle: "Aquí documento mis metodologías y writeups,\nespero te sean de ayuda.",
      heroImage: "/assets/layouts/homepage/banner.png",
    },

    // Configuración de páginas estáticas
    other: {
      search: {
        title: "Búsqueda interna",
        subTitle: "Busca el contenido que necesitas...",
        heroImage:
          "/assets/layouts/homepage/fondorecursos.png",
      },
      friends: {
        title: "Enlaces de Interés",
        subTitle:
          "Lista de herramientas y sitios recomendados en el ámbito de la ciberseguridad.",
        heroImage:
          "/assets/layouts/homepage/fondorecursos.png",
      },
      about: {
        title: "Sobre mí y este sitio",
        subTitle: "Aquí puedes conocer más sobre mi perfil.",
        heroImage:
          "/assets/layouts/homepage/acercade.png",
      },
    },
  },

  // Configuración de estilo
  style: {
    heroImage: {
      from: 80,
      to: 100,
      src: "/assets/layouts/homepage/banner.jpg",
      method: "overlay",
    },
    defaultPostImage:
      "/assets/layouts/homepage/fondoblog2.png",
    postsPerPage: 6,
    titleSeparator: "-",
    enableTransitions: false,
    enableRecentPosts: false,
  },

  // Información del autor
  author: {
    name: "Gabriel Garcia (aka G4b0)",
    bio: "Offensive Security | eJPTv2 | Electronics & Telecomunications Engineer | Network & IT Analyst | CTF Player",
    email: "mrslaac801@gmail.com",
    avatarUrl:
      "https://avatars.githubusercontent.com/u/106538662?s=400&u=f79fc18daf6e626cd8ead74d4dc91b0ca5cf8014&v=4",

    // Enlaces de redes sociales
    links: [
      {
        icon: "/assets/logo/social_media/iconlinkedin.svg",
        to: "https://www.linkedin.com/in/pgarcia-ramos",
        label: "Linkedin",
      },
      {
        icon: "Github",
        to: "https://github.com/G4b0x404",
        label: "GitHub",
      },
      {
        icon: "/assets/logo/social_media/HTB.svg",
        to: "https://app.hackthebox.com/public/users/2154988",
        label: "HackTheBox-Profile",
      },
    ],
  },

  // Configuración del menú de navegación
  navBar: {
    links: [
      {
        title: "Inicio",
        href: "/",
        icon: Home,
      },
      {
        title: "Blog",
        href: "/blog",
        icon: Newspaper,
      },
      {
        title: "Recursos",
        href: "/friends",
        icon: Handshake,
      },
      {
        title: "Sobre Mí",
        href: "/about",
        icon: Info,
      },
      {
        title: "Contacto",
        href: "https://www.linkedin.com/in/pgarcia-ramos",
        icon: Phone,
      },
    ],
  },

  // Enlaces de amigos / Recursos (Mantuve los 10 originales para no romper arreglos)
  friendLinks: [
    {
      title: "Hack The Box",
      imgUrl:
        "data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27utf-8%27?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2024.1.2,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version=%271.1%27%20id=%27Layer_1%27%20xmlns=%27http://www.w3.org/2000/svg%27%20xmlns:xlink=%27http://www.w3.org/1999/xlink%27%20x=%270px%27%20y=%270px%27%20viewBox=%270%200%2032%2033%27%20style=%27enable-background:new%200%200%2032%2033;%27%20xml:space=%27preserve%27%3e%3cstyle%20type=%27text/css%27%3e%20.st0{fill:%239FEF00;}%20%3c/style%3e%3cdesc%3eCreated%20with%20Sketch.%3c/desc%3e%3cpath%20class=%27st0%27%20d=%27M29.6,9.3C29.6,9.3,29.6,9.3,29.6,9.3c0-0.3-0.1-0.6-0.4-0.8c0,0,0,0,0,0c0,0,0,0-0.1-0.1c0,0-0.1,0-0.1-0.1%20c0,0,0,0,0,0L16.6,1.2c0,0-0.1,0-0.1,0C16.3,1,16.1,1,15.9,1c-0.1,0-0.2,0-0.3,0.1c-0.1,0-0.1,0.1-0.2,0.1L3,8.3c0,0,0,0,0,0%20c0,0,0,0,0,0c0,0,0,0,0,0C2.8,8.4,2.8,8.5,2.7,8.6c0,0,0,0,0,0C2.5,8.8,2.4,9,2.4,9.3c0,0,0,0,0,0c0,0,0,0,0,0v14.3%20c0,0.4,0.2,0.8,0.6,1l12.4,7.2c0,0,0,0,0.1,0c0,0,0,0,0,0c0.1,0,0.1,0.1,0.2,0.1c0,0,0,0,0,0c0.1,0,0.2,0,0.2,0c0.1,0,0.2,0,0.2,0%20c0,0,0,0,0,0c0.1,0,0.1,0,0.2-0.1c0,0,0,0,0,0c0,0,0,0,0.1,0L29,24.7c0.4-0.2,0.6-0.6,0.6-1L29.6,9.3C29.6,9.4,29.6,9.3,29.6,9.3z%20M7.3,8.9L15.7,4c0.2-0.1,0.4-0.1,0.5,0l8.4,4.9c0.4,0.2,0.4,0.7,0,0.9l-8.4,4.9c-0.2,0.1-0.4,0.1-0.5,0L7.3,9.8%20C6.9,9.6,6.9,9.1,7.3,8.9z%20M14.5,27.4c0,0.4-0.4,0.7-0.8,0.5L5.3,23C5.1,22.9,5,22.7,5,22.5v-9.7c0-0.4,0.4-0.7,0.8-0.5l8.4,4.9%20c0.2,0.1,0.3,0.3,0.3,0.5V27.4z%20M27,22.5c0,0.2-0.1,0.4-0.3,0.5l-8.4,4.9c-0.4,0.2-0.8-0.1-0.8-0.5v-9.7c0-0.2,0.1-0.4,0.3-0.5%20l8.4-4.9c0.4-0.2,0.8,0.1,0.8,0.5V22.5z%27/%3e%3c/svg%3e",
      desc: "Plataforma líder para entrenamiento en ciberseguridad.",
      siteUrl: "https://app.hackthebox.com/",
      tags: ["CTF","Entrenamiento"],
    },
    {
      title: "Try Hack Me",
      imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdJgpbp1its5jV0eC2KFkBXCfozllFB6pmdQ&s",
      desc: "Plataforma para entrenamiento de ciberseguridad",
      siteUrl: "https://tryhackme.com/",
      tags: ["CTF","Entrenamiento"],
    },
    {
      title: "Hack4u",
      imgUrl:
        "https://thfvnext.bing.com/th/id/OIP.t_ahZ5M7sOhpdmZKzYcYugAAAA?w=130&h=151&c=7&r=0&o=7&cb=thfvnext&pid=1.7&rm=3",
      desc: "Cursos del tito S4vitar 100% recomendado.",
      siteUrl: "https://hack4u.io/",
      tags: ["Entrenamiento"],
    },
    {
      title: "RevShells",
      imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH0COZ7GmGFCYQH_9u6IifLrZLjEnSwyL5RQiVWdGVng&s",
      desc: "Generador de reverse shells online",
      siteUrl: "https://www.revshells.com/",
      tags: ["Herramientas"],
    },
    {
      title: "HackTricks",
      imgUrl: "https://avatars.githubusercontent.com/u/166005288?s=48&v=4",
      desc: "Una pagina enorme de instrucciones y comandos",
      siteUrl: "https://hacktricks.wiki/en/index.html",
      tags: ["Educación", "Herramientas"],
    },
    {
      title: "PortSwigger",
      imgUrl:
        "https://www.softwareworld.co/assets/software/logo/portswigger.jpg",
      desc: "Plataforma para aprender hacking web",
      siteUrl: "https://portswigger.net/web-security",
      tags: ["Entrenamiento", "HackingWeb"],
    },
    {
      title: "PayloadsAllTheThings",
      imgUrl: "https://raw.githubusercontent.com/swisskyrepo/PayloadsAllTheThings/master/.github/banner.png",
      desc: "Cheatsheet e instrucciones",
      siteUrl: "https://github.com/swisskyrepo/payloadsallthethings",
      tags: ["Herramientas"],
    },
    {
      title: "Red Team Notes",
      imgUrl: "https://www.ired.team/~gitbook/image?url=https%3A%2F%2F386337598-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-LFEMnER3fywgFHoroYn%252Favatar.png%3Fgeneration%3D1536436814766237%26alt%3Dmedia&width=32&dpr=1&quality=100&sign=29a0b597&sv=2",
      desc: "Notas sobre Red Team y Cheatsheets.",
      siteUrl: "https://www.ired.team/",
      tags: ["Cheatsheets", "Herramientas"],
    },
    {
      title: "SysReptor",
      imgUrl: "https://docs.sysreptor.com/assets/dino/eating_cake.svg",
      desc: "Herramienta para redaccion de reportes corporativos",
      siteUrl: "https://docs.sysreptor.com/",
      tags: ["Reports"],
    },
    {
      title: "GOAD",
      imgUrl: "https://raw.githubusercontent.com/Orange-Cyberdefense/GOAD/main/docs/mkdocs/docs/img/logo_GOAD3.png",
      desc: "Laboratorio completo de AD en github",
      siteUrl: "https://github.com/Orange-Cyberdefense/GOAD",
      tags: ["Laboratorio", "AD"],
    },
  ],

  // Configuración de comportamiento
  behavior: {
    commentConfig: {
      enableComment: "Giscus", 

      giscusConfig: {
        repo: "510208/utterances",
        repoId: "R_kgDOKOthQw",
        category: "Announcements",
        categoryId: "DIC_kwDOKOthQ84Czwi8",
        mapping: "og:title",
        strict: "0",
        reactionsEnabled: "1",
        emitMetadata: "1",
        inputPosition: "top",
        theme: "transparent_dark",
        lang: "es", // Cambiado a español
      },

      utterancesConfig: {
        repo: "510208/utterances",
        issueTerm: "pathname",
        label: "comment",
        theme: "github-",
      },
    },

    enableGTM: true,
    gtmConfig: {
      googleTagManagerId: "GTM-N2SPWPQW",
    },

    enable404EasterEgg: true,

    tableOfContents: {
      enable: true,
      minDepth: 2,
      maxDepth: 4,
    },

    rss: {
      enable: true,
      protectContent: true,
      enableStylesheet: true,
    },
  },

  // Configuración del pie de página (Footer)
  footer: {
    description:
      "¡Hola! Bienvenido a mi blog.\nAquí comparto mis writeups y experiencias en ciberseguridad.\nSi te interesa la seguridad ofensiva, ¡acompáñame en este camino!",
    
    // Mantuve los 8 enlaces originales para no romper el diseño
    links: [
      {
        socialMedia: "/assets/logo/social_media/linkedin_icon.svg",
        url: "https://www.linkedin.com/in/pgarcia-ramos",
      },
      //{
      //  socialMedia: "Instagram",
      //  url: "https://www.instagram.com/tu-usuario/",
      //},
      {
        socialMedia: "Github",
        url: "https://github.com/G4b0x404",
      },
      //{
      //  socialMedia: "Bento",
      //  url: "https://bento.me/tu-usuario",
      //},
      //{
      //  socialMedia: "Githubpages",
      //  url: "https://tu-usuario.github.io",
      //},
      {
        socialMedia: "Discord",
        url: "https://discord.gg/58WxDzeJd",
      },
     // {
     //  socialMedia: "Figma",
     //   url: "https://www.figma.com/@tu-usuario",
      //},
     // {
       // socialMedia: "/assets/logo/social_media/penana_symbol.svg",
        //url: "https://ejemplo.com",
    //  },
    ],
    
    copyright: {
      text: "CC BY-NC 4.0",
      url: "https://creativecommons.org/licenses/by-nc/4.0/",
      yearUpdateStrategy: "auto",
    },
    countryEmoji: "🇵🇪", // Actualizado con tu bandera
  },
};

export default config;