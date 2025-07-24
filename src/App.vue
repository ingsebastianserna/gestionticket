<script>
export default {
    name: 'App',
    methods: {
        evitarMenuContextual(event) {
            event.preventDefault(); // Evitar el menú contextual
            alert('Acción no Permitida');
        },

        detectarTeclaNoAlfanumerica(event) {
            const teclaPresionada = event.key;
            const esAlfanumerico = /^[a-zA-Z0-9]$/;
            const teclasPermitidas = ['Backspace', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', ' ', ','];
            if (!esAlfanumerico.test(teclaPresionada) && !teclasPermitidas.includes(teclaPresionada)) {
                console.log(`Caracter no Permitido: ${teclaPresionada}`);
                event.preventDefault();
            }

        }
    }
};
</script>

<template>
    <div id="app" 
    @contextmenu="evitarMenuContextual" 
    @keydown="detectarTeclaNoAlfanumerica" >

        <router-view></router-view>

    </div>
</template>

<style>
* {
    box-sizing: border-box;
}

*:focus {
    outline: none;
}

body {
    font-family: Arial;
    background-color: #3498DB;
    padding: 50px;
}

.login {
    margin: 20px auto;
    width: 300px;
}

.login-screen {
    background-color: #ece9e9;
    padding: 20px;
    border-radius: 5px
}

.app-title {
    text-align: center;
    color: #777;
}

.login-form {
    text-align: center;
}

.control-group {
    margin-bottom: 10px;
}

input {
    text-align: center;
    background-color: #ECF0F1;
    border: 2px solid transparent;
    border-radius: 3px;
    font-size: 16px;
    font-weight: 200;
    padding: 10px 0;
    width: 250px;
    transition: border .5s;
}

input:focus {
    border: 2px solid #3498DB;
    box-shadow: none;
}

.btn {
    border: 2px solid transparent;
    background: #3498DB;
    color: #ffffff;
    font-size: 16px;
    line-height: 25px;
    padding: 10px 0;
    text-decoration: none;
    text-shadow: none;
    border-radius: 3px;
    box-shadow: none;
    transition: 0.25s;
    display: block;
    width: 250px;
    margin: 0 auto;
}

.btn:hover {
    background-color: #2980B9;
    cursor: pointer;
}

.login-link {
    font-size: 12px;
    color: #444;
    display: block;
    margin-top: 12px;
}

.error {
    color: red;
}

.Campo {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

select {
    width: calc(100% - 100px);
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

.logOut {
    border: 2px solid transparent;
    background: #eb7373;
    color: #ffffff;
    font-size: 12px;
    line-height: 12px;
    padding: 5px 0;
    text-decoration: none;
    text-shadow: none;
    border-radius: 3px;
    box-shadow: none;
    transition: 0.25s;
    width: 125px;
    margin: 0 auto;
}

.logOut:hover {
    background-color: #c0392b;
    cursor: pointer;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table,
th,
td {
    border: 1px solid black;
}

th,
td {
    padding: 8px;
    text-align: left;
}

.table-screen {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 5px
}

.btn2 {
    border: 2px solid transparent;
    background: #3498DB;
    color: #ffffff;
    font-size: 16px;
    line-height: 25px;
    padding: 10px 0;
    text-decoration: none;
    text-shadow: none;
    border-radius: 3px;
    box-shadow: none;
    transition: 0.25s;
    display: block;
    width: 100px;
    margin: 0 auto;
    margin-bottom: 0.25em;
}

.btn2:hover {
    background-color: #2980B9;
    color: #ffffff;
    cursor: pointer;
}

.tabla-responsive {
    width: 100%;
    overflow-x: auto;
}

@media (max-width: 768px) {
    h1 {
        font-size: 1.5rem;
    }

    .tabla-responsive table {
        font-size: 0.9rem;
    }

    th,
    td {
        padding: 6px;
    }

    .btn {
        width: 100%;
        padding: 8px;
    }
}

@media (max-width: 400px) {
    h1 {
        font-size: 1.2rem;
    }

    .tabla-responsive table {
        font-size: 0.8rem;
    }

    th,
    td {
        padding: 5px;
    }

    .btn {
        width: 100%;
        padding: 8px;
        font-size: 14px;
    }
}
</style>
