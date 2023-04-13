// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.



/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {



  /* ---------------- variables globales y llamado a funciones ---------------- */
  const formCrearTarea = document.querySelector('.nueva-tarea');
  const btnCerrarSesion = document.getElementById("closeApp")
  const userName = document.querySelector(".user-info p")
  // const token = localStorage.getItem("jwt")
  const token = JSON.parse(localStorage.jwt)
  const ingresoNuevaTarea = document.getElementById("nuevaTarea")



  obtenerNombreUsuario();
  consultarTareas();



  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    confirm("Esta seguro que desea cerrar sesión?")
    if (confirm){ 
      localStorage.removeItem("jwt")
      location.replace('./index.html')
    }
  //borrar token
  //mandar al index
  });


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */



  function obtenerNombreUsuario() {
    const urlGetName = 'https://todo-api.ctd.academy/v1/users/getMe';
    let setting = {
        method: "GET",
        headers:{
          authorization: token
        }
    }
    console.log("Lanzando la consulta a la api....");

    fetch(urlGetName, setting)
      .then (response => response.json())
      .then (data => {
        console.log(data);
        userName.innerText = data.firstName + " " + data.lastName;
        // userName.innerText = data.lastName;

      })
      .catch(err => console.log('promesa rechazada'+ err));



  };


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const urlGetTasks = 'https://todo-api.ctd.academy/v1/tasks';
    let setting = {
        method: "GET",
        headers:{
          authorization: token
        }
    }
    console.log("Lanzando la consulta a la api....");

    fetch(urlGetTasks, setting)
      .then (response => response.json())
      .then (tareas => {
        console.log(tareas);
        console.table(tareas);

    renderizarTareas(tareas)
    botonBorrarTarea();
    botonesCambioEstado()

      })
      .catch(err => console.log('promesa rechazada'+ err));
  };


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    
    event.preventDefault()

    console.log("crear tarea");
    console.log(ingresoNuevaTarea.value);

    const payload = {
      description: ingresoNuevaTarea.value,
      completed: false
    }


    const urlGetTasks = 'https://todo-api.ctd.academy/v1/tasks';
    let setting = {
        method: "POST",
        body: JSON.stringify(payload),
        headers:{
          'Content-Type' : 'application/json',
          authorization: token
        }
    }
    console.log("Creando tarea en la base de datos");

    fetch(urlGetTasks, setting)
      .then (response => response.json())
      .then (tareas => {
        consultarTareas()
        //vuelvo a llamar a la funcion esta xq se van agregado tareas y se modifica
        console.log(tareas)
      })
      .catch(err => console.log('promesa rechazada'+ err));

      formCrearTarea.reset();





  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {

    //Traigo los listados
    const tareasPendientes = document.querySelector(".tareas-pendientes")
  
    const tareasTerminadas = document.querySelector(".tareas-terminadas")

    //les borro el contenido (si lo tuviesen)
    tareasPendientes.innerHTML= "";
    tareasTerminadas.innerHTML= "";

    //buscamos el numero de finalizadas
    const numeroFinalizadas = document.querySelector("#cantidad-finalizadas")
    let contador = 0;
    numeroFinalizadas.innerText = contador;

    listado.forEach(tarea => { 
      let fecha = new Date (tarea.createdAt);
      
      if (tarea.completed){
        contador ++
        tareasTerminadas.innerHTML += `
        <li class="tarea" data-aos="flip-up">
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>
        `

      } else {
        tareasPendientes.innerHTML += `
        <li class="tarea" data-aos="flip-up">
          <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
          <div class="descripcion">
            <p class="nombre">${tarea.description}</p>
            <p class="timestamp">${fecha.toLocaleDateString()}</p>
          </div>
        </li>
        `
      }

    //actualizo el contador de tareas en la pantalla
    numeroFinalizadas.innerText = contador;
  })
}

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    
    //capturo todas los botones de las tareas pendientes
    const botonCambioEstado = document.querySelectorAll(".change")

    //a cada uno de esos botones, le pongo un escuchador, para extraer el id del clickeado

    botonCambioEstado.forEach(boton => {
      boton.addEventListener("click", function (event){
        const id = event.target.id;
        const url = `https://todo-api.ctd.academy/v1/tasks/${id}`
        const payload = {};

        //segun el tipo de boton que fue clickeado, cambiamos el estado de la tarea
        if (event.target.classList.contains('incompleta')) {
          // si está completada, la paso a pendiente
          payload.completed = false;
        } else {
          // sino, está pendiente, la paso a completada
          payload.completed = true;
        }

        console.log(payload);

        const settingsCambio = {
          method: 'PUT',
          headers: {
            "Authorization": token,
            "Content-type": "application/json"
          },
          body: JSON.stringify(payload)
        }

        fetch(url, settingsCambio)
          .then(response => {
            console.log(response.status);
            //vuelvo a consultar las tareas actualizadas y pintarlas nuevamente en pantalla
            consultarTareas();
          })
      })
      })
  }
  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {

    const botonBorrar = document.querySelectorAll(".borrar")

    botonBorrar.forEach(boton =>{
      boton.addEventListener("click", function(event){
        const seguroEliminar = confirm("Seguro desea eliminar la tarea")
  
        if (seguroEliminar){
          const id = event.target.id;
          const url = `https://todo-api.ctd.academy/v1/tasks/${id}`
          
          const settingsDelete = {
            method: 'DELETE',
            headers: {
              "Authorization": token,
              "Content-type": "application/json"
            }
          }
    
          fetch(url, settingsDelete)
            .then(response =>{
              console.log("Borrando tarea...");
              console.log(response.status);
              //vuelvo a consultar las tareas actualizadas y pintarlas nuevamente en pantalla
              consultarTareas();
            })
          }      
         })
    })
  }

})