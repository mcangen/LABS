// Implementación de funciones que JS no trae
function acot(x) { return Math.atan(1/x); }
function acoth(x) { return 0.5 * Math.log((x+1)/(x-1)); }
function cot(x) { return 1 / Math.tan(x); }
function coth(x) { return 1 / Math.tanh(x); }
function lg(x) { return Math.log10(x); }
function ln(x) { return Math.log(x); }
function sign(x) { return Math.sign(x); }
function H(x) { return (1 + Math.sign(x)) / 2; }

// Variables detectadas
let variablesDetectadas = [];

function detectarVariables() {
    const formula = document.getElementById('formula').value;
    let vars = formula.match(/[a-zA-Z_]\w*/g) || [];
    const funciones = ["abs","acos","acosh","acot","acoth","asin","asinh","atan","cos","cosh","cot","coth","exp","lg","ln","pow","sign","sin","sinh","sqrt","tan","tanh","H","PI","E"];
    vars = [...new Set(vars.filter(v => !funciones.includes(v)))];

    if (JSON.stringify(vars) !== JSON.stringify(variablesDetectadas)) {
        variablesDetectadas = vars;
        generarCampos(vars);
    }
}

function generarCampos(vars) {
    const cont = document.getElementById('vars-container');
    cont.innerHTML = "";
    vars.forEach(v => {
        const div = document.createElement('div');
        div.className = "var-box";
        div.innerHTML = `
            <label>Variable ${v} - Valor medido:</label>
            <input type="number" id="${v}_val" step="any">
            <label>Variable ${v} - Desviación estándar:</label>
            <input type="number" id="${v}_dev" step="any">
        `;
        cont.appendChild(div);
    });
}

function calcular() {
    const formula = document.getElementById('formula').value;
    let vars = {};
    for (let v of variablesDetectadas) {
        const valor = parseFloat(document.getElementById(`${v}_val`).value);
        const dev = parseFloat(document.getElementById(`${v}_dev`).value);
        if (isNaN(valor) || isNaN(dev)) {
            document.getElementById('mensaje').textContent = `La variable ${v} no está definida correctamente.`;
            return;
        }
        vars[v] = { valor, dev };
    }
    document.getElementById('mensaje').textContent = '';

    try {
        const valor = eval(formula.replace(/\b([a-zA-Z_]\w*)\b/g, (_, v) => vars[v] ? vars[v].valor : v));

        let suma = 0;
        for (let v of variablesDetectadas) {
            const h = 1e-6;
            const valor_original = vars[v].valor;
            const dev = vars[v].dev;
            const valor_mas = eval(formula.replace(/\b([a-zA-Z_]\w*)\b/g, (_, name) => 
                name === v ? (valor_original + h) : (vars[name] ? vars[name].valor : name)
            ));
            const derivada = (valor_mas - valor) / h;
            suma += Math.pow(derivada * dev, 2);
        }
        const desviacion = Math.sqrt(suma);

        document.getElementById('resultado').textContent = valor.toFixed(6);
        document.getElementById('desv').textContent = desviacion.toFixed(6);
    } catch (e) {
        document.getElementById('mensaje').textContent = "Error en la fórmula.";
    }
}
function borrarTodo() {
    document.getElementById('formula').value = "";
    document.getElementById('vars-container').innerHTML = "";
    document.getElementById('resultado').textContent = "";
    document.getElementById('desv').textContent = "";
    document.getElementById('mensaje').textContent = "";
    variablesDetectadas = [];
}

/* Formulario de Informacion */
function guardarInfo() {
    document.getElementById("tema-info").textContent = document.getElementById("tema").value;
    document.getElementById("integrantes-info").textContent = document.getElementById("integrantes").value;
     // Procesar integrantes y separarlos por "-"
    const integrantesTexto = document.getElementById("integrantes").value;
    const listaIntegrantes = integrantesTexto.split("-").map(i => i.trim()).filter(i => i !== "");

    const ul = document.getElementById("integrantes-info");
    ul.innerHTML = ""; // limpiar lista
    listaIntegrantes.forEach(nombre => {
        const li = document.createElement("li");
        li.textContent = nombre;
        ul.appendChild(li);
    });

    document.getElementById("profesor-info").textContent = document.getElementById("profesor").value;
    document.getElementById("materia-info").textContent = document.getElementById("materia").value;
    document.getElementById("grupo-info").textContent = document.getElementById("grupo").value;

    // Oculta el formulario y muestra la info estática
    document.getElementById("lab-form").style.display = "none";
    document.getElementById("lab-info").style.display = "block";
}
function resetFormulario() {
    // Vaciar todos los inputs de texto
    document.querySelectorAll('#lab-form input').forEach(campo => {
        campo.value = '';
    });

    // Volver a mostrar el formulario
    document.getElementById("lab-form").style.display = "block";
    document.getElementById("lab-info").style.display = "none";
}

/* Calculadora de desvicacion Estandar */
let valores = [];

function agregarValor() {
    let input = document.getElementById("valor");
    let val = parseFloat(input.value);
    if (!isNaN(val)) {
        valores.push(val);
        input.value = "";
        actualizarCalculos();
    }
}
function borrarDatos() {
    valores = [];
    document.getElementById("lista-valores").textContent = "Ninguno";
    document.getElementById("valor-medio").textContent = "-";
    document.getElementById("varianza").textContent = "-";
    document.getElementById("desviacion").textContent = "-";
}
function actualizarCalculos() {
    // Mostrar lista de valores
    document.getElementById("lista-valores").textContent = valores.join(", ");

    if (valores.length > 0) {
        // Calcular valor medio
        let media = valores.reduce((a, b) => a + b, 0) / valores.length;

        // Calcular varianza
        let varianza = valores.reduce((a, b) => a + Math.pow(b - media, 2), 0) / valores.length;

        // Calcular desviación estándar
        let desviacion = Math.sqrt(varianza);

        document.getElementById("valor-medio").textContent = media.toFixed(9);
        document.getElementById("varianza").textContent = varianza.toFixed(9);
        document.getElementById("desviacion").textContent = desviacion.toFixed(9);
    }
}