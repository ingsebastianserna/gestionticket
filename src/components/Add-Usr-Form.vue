<script>
import axios from 'axios';
export default {
    data() {
        return {
            visible: false,
            nuevoUsuario: {
                dni: '',
                nombre: '',
                rol: 'tecnico',
                password: ''
            },
        };
    },

    methods: {
        mostrar() {
            this.visible = true;
            document.body.style.overflow = 'hidden';
            document.body.style.height = "100vh";
            window.scrollTo(0, 0);
        },

        cerrar() {
            Object.assign(this.nuevoUsuario, { dni: '', nombre: '', rol: 'tecnico', password: '' });
            this.visible = false;
            document.body.style.overflow = 'auto';
            this.$emit('cerrarActualizar');
        },

        agregarUsuario() {
            axios.post(`${process.env.VUE_APP_BASE_URL}/usuarios`, this.nuevoUsuario)
                .then(() => {
                    console.log('Usuario creado con exito.');
                    this.cerrar();
                })
                .catch(error => {
                    console.error('Error al agregar usuario:', error);
                });

        }
    }
};
</script>

<template>
    <div class="ventana-emergente" v-if="visible">

        <div class="emergente-contenido contenedor">

            <form class="contenedor-formulario" @submit.prevent="agregarUsuario">

                <div class="cerrar-Ventana">
                    <button class="btnC" @click="cerrar">X</button>
                </div>

                <legend>Agregar Usuario</legend>

                <div class="Campo">
                    <label>DNI: </label>
                    <input type="text" v-model="nuevoUsuario.dni" required>
                </div>

                <div class="Campo">
                    <label>Nombre: </label>
                    <input type="text" v-model="nuevoUsuario.nombre" required>
                </div>

                <div class="Campo">
                    <label for="rol">Rol:</label>
                    <select v-model="nuevoUsuario.rol" required>
                        <option value="administrador">Administrador</option>
                        <option value="tecnico">Técnico</option>
                        <option value="recepcionista">Recepcionista</option>
                    </select>
                </div>

                <div class="Campo">
                    <label for="password">Contraseña:</label>
                    <input type="password" v-model="nuevoUsuario.password" required>
                </div>

                <button class="btn" type="submit">Agregar</button>


            </form>

        </div>

    </div>
</template>

<style scoped>
.ventana-emergente {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.emergente-contenido {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
}

.contenedor-formulario {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
    max-width: 400px;
}

.contenedor-formulario legend {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
}


.Campo {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.Campo input, .Campo select {
    width: calc(100% - 100px);
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

.contenedor {
    width: 90%;
    max-width: 80rem;
    margin: 0 auto;
}

.btnC {
    border: 2px solid transparent;
    background: rgba(0, 0, 0, 0.5);
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
    width: 50px;
    margin: 0 auto;
}

.btnC:hover {
    background-color: #b93f29;
    cursor: pointer;
}

.cerrar-Ventana {
    position: absolute;
    right: 3rem;
    top: 3rem;
}

.cerrar-Ventana img {
    width: 3rem;
    cursor: pointer;
}
</style>