import React from "react";

import Page from "./index";

const Tags = ()=>(
  <>
    <title>POLITICAS DE USO DE COOKIES - Fitemos</title>
    <meta name="description" content="Estos Términos y Condiciones, en adelante, “Términos”, son aplicables a cualquier acceso y uso del sitio web www.fitemos.com , en adelante, el “Sitio Web” operado y propiedad de FITEMOS CORP.   Cualquier acceso o uso continuo del “Servicio” implican la aceptación de estos “Términos” como contrato legalmente vinculante con FITEMOS CORP., en adelante, la “Empresa”." />
  </>
)
const Content = ()=>(
  <>
    <h1 className="text-center mb-5">POLITICAS DE USO DE COOKIES</h1>
    <p className="mbr-semibold">AVISO DE COOKIES</p>
    <p>Utilizamos cookies propias y de terceros para obtener datos estadísticos de la navegación de nuestros “Usuarios” y mejorar nuestros servicios.  
      Si acepta o continúa navegando, consideramos que acepta su uso. 
      Puede cambiar la configuración u obtener más información <strong>aquí</strong> <em>(enlace a página de cookies)</em>.</p>
    <p className="mbr-semibold">¿QUÉ SON LAS COOKIES?</p>
    <p>Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web, 
      entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, 
      dependiendo de la información que contengan y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario. </p>
    <p className="mbr-semibold">¿QUÉ TIPOS DE COOKIES UTILIZA ESTA PÁGINA WEB?</p>
    <p>Esta página web utiliza los siguientes tipos de cookies: </p>
    <p><strong><u>Cookies de análisis,</u></strong>: Son aquéllas que bien tratadas por nosotros o por terceros, 
      nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio ofertado. 
      Para ello se analiza su navegación en nuestra página web con el fin de mejorar la oferta de productos o servicios que le ofrecemos.</p>
    <p><strong><u>Cookies técnicas</u></strong>: Son aquellas que permiten al usuario la navegación a través del área restringida y la utilización de sus diferentes funciones, 
      como, por ejemplo, llevar a cambio el proceso de compra de un artículo.</p>
    <p><strong><u>Cookies de personalización</u></strong>: Son aquellas que permiten al usuario acceder al servicio con algunas características de carácter general predefinidas en 
      función de una serie de criterios en el terminal del usuario como por ejemplo serian el idioma o el tipo de navegador a través del cual se conecta al servicio.</p>
    <p><strong><u>Cookies publicitarias</u></strong>: Son aquéllas que, bien tratadas por esta web o por terceros, 
      permiten gestionar de la forma más eficaz posible la oferta de los espacios publicitarios que hay en la página web, 
      adecuando el contenido del anuncio al contenido del servicio solicitado o al uso que realice de nuestra página web. 
      Para ello podemos analizar sus hábitos de navegación en Internet y podemos mostrarle publicidad relacionada con su perfil de navegación.</p>
    <p><strong><u>Cookies de publicidad comportamental</u></strong>: Son aquellas que permiten la gestión, de la forma más eficaz posible, 
      de los espacios publicitarios que, en su caso, el editor haya incluido en una página web, 
      aplicación o plataforma desde la que presta el servicio solicitado. 
      Este tipo de cookies almacenan información del comportamiento de los visitantes obtenida a través de la observación continuada de sus hábitos 
      de navegación, lo que permite desarrollar un perfil específico para mostrar avisos publicitarios en función del mismo.</p>
    <p className="mbr-semibold">DESACTIVAR LAS COOKIES.</p>
    <p>Puede usted <strong>permitir, bloquear o eliminar las cookies</strong> instaladas en su equipo mediante la configuración de las opciones del navegador 
      instalado en su ordenador.</p>
    <p>En la mayoría de los navegadores web se ofrece la posibilidad de permitir, 
      bloquear o eliminar las cookies instaladas en su equipo.</p>
    <p className="mbr-semibold">COOKIES DE TERCEROS.</p>
    <p>Este “Sitio Web” utiliza servicios de terceros para recopilar información con fines estadísticos y de uso de la web. </p>
    <p className="mbr-semibold">ADVERTENCIA SOBRE ELIMINAR COOKIES.</p>
    <p>Usted puede eliminar y bloquear todas las cookies de este “Sitio Web”, pero parte del sitio no funcionará o la calidad de la 
      página web puede verse afectada.</p>
    <p>Si tiene cualquier duda acerca de nuestra política de cookies, puede contactarnos a: <a href="mailto:soporte@fitemos.com">soporte@fitemos.com</a> </p>

  </>
)

const cookies = () => (
  <Page
    tags={()=>(
      <Tags />
    )}
    content={()=>(
      <Content />
    )}
  />
);
export default cookies;
