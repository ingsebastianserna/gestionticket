<script>
import { formatearFecha } from '../functions';
import axios from 'axios';

export default {
    name: 'vistaArchivada',

    components: {
        // Componentes importados aqui.
    },
    
    props: {
        usuarios: {
            type: Array,
            required: true
        }
    },

    data() {
        return {
            visible: false,
            archivadas: [],
            filtro: 'none',
            tareaSelecionada: null
        }
    },

    computed: {
       archivadasfiltradas() {
        if(this.filtro == 'none') {
            return this.archivadas;
        }
        else {
            return this.archivadas.filter(archivada => archivada.nombre === this.filtro);
        }
       }
    },

    methods: {
        formatearFecha,

        mostar() {
            this.visible = true;
            this.obtenerTareasA();
        },

        ocultar() {
            this.visible = false;
            this.archivadas = [];
        },

        obtenerTareasA() {
            axios.get(`${process.env.VUE_APP_BASE_URL}/tareasArchivadas`, {
            })
                .then(response => {
                    this.archivadas = response.data;
                    console.log('Tareas archivadas cargadas');
                })
                .catch(error => {
                    console.error('Error al obtener tareas archivadas:', error);
                });
        },
    },

    mounted() {
        // funciones que se ejecutan al renderizar el componente.
        
    } 

}
</script>

<template>

    <section v-if="visible">

        <div class="filtros-container">
            <label class="Campo">Filtrar Usuarios:</label>
            <select v-model="filtro">
                <option value="none">Todos</option>
                <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.nombre"> {{
                    usuario.nombre }}
                </option>
            </select>
        </div>
        <hr>
        <table class="tabla-responsive table-screen">
            <thead class="login-screen app-title">
                <tr>
                    <th>Equipo</th>
                    <th>Descripción</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Técnico asignado</th>
                    <th>Informado</th>
                    <th>Fecha asignación</th>
                    <th>Fecha inicio</th>
                    <th>Fecha finalización</th>
                    <th>Fecha archivación</th>
                </tr>
            </thead>
            <tbody v-for="tarea in archivadasfiltradas" :key="tarea.tarea_id">
                <tr>
                    <td>{{ tarea.Equipo }}</td>
                    <td>{{ tarea.descripcion }}</td>
                    <td> {{ tarea.prioridad }} </td>
                    <td>{{ tarea.status }}</td>
                    <td>{{ tarea.nombre }}</td>
                    <td v-if="tarea.informado === 0">No informado</td>
                    <td v-else>Informado</td>
                    <td> {{ formatearFecha(tarea.fechaAsignacion) }} </td>
                    <td> {{ formatearFecha(tarea.fechaProceso) }} </td>
                    <td> {{ formatearFecha(tarea.fechaFinalizada) }} </td>
                    <td> {{ formatearFecha(tarea.fechaArchivada) }} </td>
                </tr>
            </tbody>
        </table>
    </section>

</template>

<style scoped>

</style>