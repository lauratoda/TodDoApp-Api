window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.forms[0];
    const email = document.querySelector('#inputEmail');
    const password = this.document.querySelector('#inputPassword')
    const url = 'https://todo-api.ctd.academy/v1'



    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
       event.preventDefault();
       mostrarSpinner()

       const payload = {
        email : " ",
        password : " "
       };
       
       if (validarEmail(email.value) && validarContrasenia(password.value)){
        payload.email = email.value;
        payload.password = password.value

        const settings = {
            method : "POST",
            body : JSON.stringify(payload),
            headers : {
                'Content-Type': 'application/json'
            }
        }
        
        realizarLogin(settings); 
        form.reset();
       

        } else {
        alert ("los datos no son correctos")
        ocultarSpinner()
       }
        
    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {

        console.log('lanzando la consulta a la api');
        
        fetch (`${url}/users/login`, settings)
            .then(response =>{
                console.log(response);
                if(response.ok !== true){ //!response.ok
                    alert('Alguno de los datos ingresados es incorrecto')
                } 
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