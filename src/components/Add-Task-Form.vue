<script>
import axios from 'axios';
import { obtenerFecha } from '../functions';

export default {
    props: {
        usuarios: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            visible: false,
            nuevaTarea: {
                Equipo: '',
                descripcion: '',
                status: 'cola',
                prioridad: 'baja',
                informado: 0,
                tecnico_id: '',
                fechaAsignacion: ''
            }
        };
    },
    computed: {
        
    },
    methods: {
        obtenerFecha,


        mostrar() {
            this.visible = true;
            document.body.style.overflow = 'hidden';
            document.body.style.height = "100vh";
            window.scrollTo(0, 0);
        },

        cerrar() {
            Object.assign(this.nuevaTarea, { Equipo: '', descripcion: '', status: 'cola', prioridad: 'baja', tecnico_id: '' });
            this.visible = false;
            document.body.style.overflow = 'auto';
            this.$emit('actualizarTareas');
        },
        agregarTarea() {
            this.nuevaTarea.fechaAsignacion = this.obtenerFecha();
            if (this.visible) {
                axios.post(`${process.env.VUE_APP_BASE_URL}/tareas`, this.nuevaTarea)
                    .then(() => {
                        console.log('Tarea agregada con éxito');
                        this.cerrar();
                    })
                    .catch(error => {
                        alert('Error al agregar tarea');
                        console.error('Error al agregar tarea:', error);
                        this.cerrar();
                    });
                    
            }
        }
    }
};
</script>

<template>
    <div class="ventana-emergente" v-if="visible">

        <div class="emergente-contenido contenedor">

            <form class="contenedor-formulario" @submit.prevent="agregarTarea">

                <div class="cerrar-Ventana">
                    <button class="btnC" @click="cerrar">X</button>
                </div>

                <legend>Agregar Tarea</legend>

                <div class="Campo">
                    <label>Equipo: </label>
                    <input type="text" v-model="nuevaTarea.Equipo" required>
                </div>

                <div class="Campo">
                    <label>Descripción: </label>
                    <input type="text" v-model="nuevaTarea.descripcion" required>
                </div>

                <div class="Campo">
                    <label for="prioridad">Prioridad</label>
                    <select v-model="nuevaTarea.prioridad" required>
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                    </select>
                </div>

                <div class="Campo">
                    <label for="rol">Encargado:</label>
                    <select v-model="nuevaTarea.tecnico_id" required>
                        <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                            {{ usuario.nombre }}
                        </option>
                    </select>
                </div>

                <button class="btn" type="submit">Agregar</button>

            </form>

        </div>

    </div>
</template>



<style scoped>
.ventana-emergente {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
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