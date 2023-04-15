window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.forms[0];
    const nombre = document.querySelector('#inputNombre');
    const apellido = document.querySelector('#inputApellido')
    const email = document.querySelector('#inputEmail')
    const contrasenia = document.querySelector('#inputPassword')
    const repetirContrasenia = document.querySelector('#inputPasswordRepetida')
    const url = 'https://todo-api.ctd.academy/v1'
        

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      mostrarSpinner()


    //primero normalizo las entradas
    let nombreNormalizado = validarTexto(normalizarTexto(nombre.value));
    let apellidoNormalizado = validarTexto(normalizarTexto(apellido.value));   
    let emailNormalizado =  validarEmail(normalizarEmail(email.value));
    let passwordNormalizado = validarContrasenia(contrasenia.value);
    let comparacionDeContraseñas = compararContrasenias(contrasenia.value, repetirContrasenia.value);

    if ((nombreNormalizado && apellidoNormalizado && emailNormalizado && passwordNormalizado && comparacionDeContraseñas) === true ){
        
        const payload = {
            firstName : nombre.value,
            lastName : apellido.value,
            email : email.value,
            password : contrasenia.value
           };
        
           const settings = {
            method : "POST",
            body : JSON.stringify(payload),
            headers : {
                'Content-Type': 'application/json'
            }
           };
    
            realizarRegister(settings)
            form.reset();

    } else {
            console.log("algun campo no es válido")
            ocultarSpinner()

    }
        
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {

        console.log('lanzando el registro');
        
        fetch (`${url}/users`, settings)
            .then(response =>{
                console.log(response);

            return response.json();
            })
            .then(data=>{
                console.log('la promesa esta cumplida');
                console.log(data);
                if(data.jwt){
                    localStorage.setItem('jwt', JSON.stringify(data.jwt));
                    ocultarSpinner()
                    location.replace('./mis-tareas.html');
                }
            })
            .catch (err =>{
                console.log('promesa rechazada');
                console.log(err)
                ocultarSpinner()
            })
        }  
    })