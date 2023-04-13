/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
    let textoValido = /^[A-Z+ " "]+$/i;
    if (textoValido.test(texto)){
      return true;

    } else {
      alert("Los campos nombre y apellido solo admiten letras")
      return false;
    }
}

function normalizarTexto(texto) {
    let miTexto = texto.toLowerCase();
    return miTexto
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
    let emailValido= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailValido.test(email)&& email != null && email != " ")
    {
      return true;
    }
      alert("El email ingresado es inválido")
      return false    
}

function normalizarEmail(email) {
  let miEmail = email.toLowerCase();
  return miEmail
    
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
    if (contrasenia.length >= 6 && contrasenia != null){
      return true;

    } else {
      alert ("la constraseña debe tener al menos 6 caracteres")
      return false;
    }
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    if (contrasenia_1 === contrasenia_2){
      return true;
    }else {
      alert("las contraseñas no coinciden, por favor intetlo nuevamente")
      return false;
    }
}

