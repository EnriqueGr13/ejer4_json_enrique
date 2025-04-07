// FUENTES EXTERNAS: Para el ejercicio he utilizado ChatGPT para pulir el resultado final y como ayuda para realizar el filtro.
// Además de visitar apartados sueltos de las webs W3Schools(https://www.w3schools.com/) y MDN Web(https://developer.mozilla.org/en-US/)

// Contenedor donde se mostrarán las tarjetas
const contenedor = document.querySelector("#cards-container");

// Variable global para almacenar los personajes para filtrarlos después
let personajes = [];

// ------------------------------ LLAMADA A LA API ------------------------------
fetch('https://akabab.github.io/superhero-api/api/all.json')
    .then(res => res.json())
    .then(data => {
        personajes = data;
        data.forEach(personaje => {
            mostrarTarjeta(personaje);
        });

        crearFiltro();
    })
    .catch(err => console.log("Error en la comunicación: " + err));


// ------------------------------ FUNCIÓN PARA MOSTRAR TARJETAS ------------------------------
function mostrarTarjeta(personaje){
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("card");

    const bando = personaje.biography.alignment;

    // Según el bando, le agrego una clase distinta para aplicar estilos
    if(bando === "good"){
        tarjeta.classList.add("hero");
    } else if (bando === "bad"){
        tarjeta.classList.add("villain");
    }

    // ------------------ Contenido de la tarjeta ------------------
    const imagen = document.createElement("img");
    imagen.src = personaje.images.lg;
    imagen.alt = personaje.name;

    const nombre = document.createElement("h2");
    nombre.textContent = personaje.name;

    const genero = document.createElement("p");
    genero.textContent = `Género: ${personaje.appearance.gender}`;

    const editorial = document.createElement("p");
    editorial.textContent = `Editorial: ${personaje.biography.publisher || "Desconocida"}`;

    const raza = document.createElement("p");
    raza.textContent = `Raza: ${personaje.appearance.race || "Desconocida"}`;

    const altura = document.createElement("p");
    altura.textContent = `Altura: ${personaje.appearance.height[1]}`;

    const peso = document.createElement("p");
    peso.textContent = `Peso: ${personaje.appearance.weight[1]}`;

    const textoBando = document.createElement("p"); 
    textoBando.textContent = `Bando: ${traducirBando(bando)}`; // Bando (traducido)

    // Añado todos los elementos a la tarjeta
    tarjeta.appendChild(imagen);
    tarjeta.appendChild(nombre);
    tarjeta.appendChild(genero);
    tarjeta.appendChild(editorial);
    tarjeta.appendChild(raza);
    tarjeta.appendChild(altura);
    tarjeta.appendChild(peso);
    tarjeta.appendChild(textoBando);

    // Agrego la tarjeta al contenedor principal
    contenedor.appendChild(tarjeta);
}

// ------------------------------ TRADUCIR EL BANDO ------------------------------
// Función para traducir el valor de 'alignment' a español para que en los datos de la tarjeta se muestre en español
function traducirBando(alignment){
    switch (alignment) {
        case "good":
            return "Héroe";
        case "bad":
            return "Villano";
        case "neutral":
            return "Neutral";
        default:
            return "Desconocido";
    }
}

// ------------------------------ CREAR FILTRO ------------------------------
// Función q crea un <select> y sus opciones para filtrar por bando
function crearFiltro(){
    const filtro = document.createElement("select");
    filtro.id = "filtro-bando";
    filtro.classList.add("filtro-select");

    // Distintas opciones del filtro
    const opciones = [
        { valor: "todos", texto: "Todos los bandos" },
        { valor: "good", texto: "Héroes" },
        { valor: "bad", texto: "Villanos" },
        { valor: "neutral", texto: "Neutrales" }
    ];

    // Creación de cada opción del filtro
    opciones.forEach(op => {
        const option = document.createElement("option");
        option.value = op.valor;
        option.textContent = op.texto;
        filtro.appendChild(option);
    });

    // Contenedor para el filtro y se inserta antes de las tarjetas
    const contenedorFiltro = document.createElement("div");
    contenedorFiltro.classList.add("filtro-container");
    contenedorFiltro.appendChild(filtro);
    contenedor.before(contenedorFiltro);

    // Evento para detectar cuando el usuario selecciona una opción
    filtro.addEventListener("input", () => {
        const valor = filtro.value;
        contenedor.innerHTML = "";

        // Filtro de los personajes según el valor seleccionado
        let filtrados;
        if (valor === "todos") {
            filtrados = personajes;
        } else {
            filtrados = personajes.filter(p => p.biography.alignment === valor);
        }

        filtrados.forEach(personaje => mostrarTarjeta(personaje));
    });
}
