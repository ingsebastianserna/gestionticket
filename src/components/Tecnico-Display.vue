<script>
import axios from 'axios';
import { formatearFecha, obtenerFecha } from '../functions';

export default {
  name: "Tecnico-Display",

  components: {
    
  },

  data() {
    return {
      nombre: '',
      tareas: [],
      tareaSeleccionada: null,
      filtro: 'cola',
      filtro2: 'none',
      verFinalizados: false
    };
  },

  computed: {
    tareasFiltradas() {
      if (this.filtro === 'none' && this.filtro2 === 'none') {
        return this.tareas;
      }
      else if (this.filtro === 'none') {
        return this.tareas.filter(tarea => tarea.prioridad === this.filtro2);
      }
      else if (this.filtro2 === 'none') {
        return this.tareas.filter(tarea => tarea.status === this.filtro);
      }
      else {
        return this.tareas.filter(tarea => tarea.status === this.filtro && tarea.prioridad === this.filtro2);
      }
    }
  },

  methods: {
    formatearFecha,

    obtenerFecha,

    obtenerTareas() {
      const usuarioId = localStorage.getItem('usuarioId');
      axios.get(`${process.env.VUE_APP_BASE_URL}/tareas`, {
        params: {
          rol: 'tecnico',
          usuarioId: usuarioId
        }
      })
        .then(response => {
          if (Array.isArray(response.data)) {
            this.tareas = response.data;
            console.log('Tareas cargadas');
          } else {
            this.tareas = [];
            console.error('La respuesta no es un array:', response.data);
          }
        })
        .catch(error => {
          console.log('Error al obtener tareas:', error);
          this.tareas = [];
        });
    },

    editarTarea(tarea) {
      this.tareaSeleccionada = { ...tarea };
    },

    actualizarTarea() {
      const respuesta = confirm(`¿Esta seguro de editar ${this.tareaSeleccionada.Equipo}?`);
      if (respuesta) {
        if (this.tareaSeleccionada.status == 'proceso') {
          this.tareaSeleccionada.fechaProceso = this.obtenerFecha();
        }
        else if (this.tareaSeleccionada.status == 'terminada') {
          this.tareaSeleccionada.fechaProceso = false;
          this.tareaSeleccionada.fechaFinalizada = this.obtenerFecha();
        }
        else {
          this.tareaSeleccionada.fechaProceso = false;
          this.tareaSeleccionada.fechaFinalizada = false;
        }
        const { tarea_id, status, fechaProceso, fechaFinalizada } = this.tareaSeleccionada;
        axios.put(`${process.env.VUE_APP_BASE_URL}/tareas/${tarea_id}`, {
          status: status,
          informado: false,
          fechaProceso: fechaProceso,
          fechaFinalizada: fechaFinalizada
        })
          .then(response => {
            console.log(response);
            this.obtenerTareas();
            this.tareaSeleccionada = null;
            console.log('Tarea actualizada');
          })
          .catch(error => {
            console.error('Error al actualizar la tarea:', error);
          });
      }
      else {
        this.tareaSeleccionada = null;
      }
    },

    cerrarSesion() {
      this.$router.push('/login');
    },

    cargarventana() {
      this.$refs.EditTasksForm.mostrar();
    }
  },

  mounted() {
    this.obtenerTareas();
    this.nombre = localStorage.getItem('nombreUsr');
  }
};
</script>

<template>
  <div class="login-form login-screen app-title">
    <h1>Hola {{ nombre }} </h1>
    <button @click="cerrarSesion" class="logOut">Cerrar sesión</button>
    <h2>Estas son tus tareas</h2>
    <div class="btn-container">
      <button class="btn" @click="obtenerTareas">Actualizar</button>
    </div>
    <section class="tareas" v-if="!tareaSeleccionada">
      <hr>
      <div class="filtros-container">
        <label class="Campo">
          <h2>Filtrar Estado:</h2>
        </label>
        <select v-model="filtro" class="Campo">
          <option value="none">Todos</option>
          <option value="cola">En cola</option>
          <option value="proceso">En proceso</option>
          <option value="espera_aut">Esperando Aut.</option>
        </select>
        <label class="Campo">
          <h2>Filtrar Prioridad:</h2>
        </label>
        <select v-model="filtro2">
          <option value="none">Todas</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>
      <hr>
      <div class="tabla-responsive table-screen ">
        <table>
          <thead class="login-screen app-title">
            <tr>
              <th>Equipo</th>
              <th>Descripción</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Fecha asignación</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody v-for="tarea in tareasFiltradas" :key="tarea.tarea_id">
            <tr v-if="tarea.status !== 'terminada'">
              <td>{{ tarea.Equipo }}</td>
              <td>{{ tarea.descripcion }}</td>
              <td> {{ tarea.prioridad }} </td>
              <td>{{ tarea.status }}</td>
              <td> {{ formatearFecha(tarea.fechaAsignacion) }} </td>
              <td>
                <button class="btnS" @click="editarTarea(tarea)">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
  <div v-if="tareaSeleccionada" class="contenedorEdit">
    <h1>Editar: {{ tareaSeleccionada.Equipo }}</h1>
    <form @submit.prevent="actualizarTarea" class="contenedor-formularioEdit">
      <select v-model="tareaSeleccionada.status" required class="CampoEdit">
        <option value="cola">En cola</option>
        <option value="proceso">En Proceso</option>
        <option v-if="tareaSeleccionada.status != 'cola'" value="espera_aut">Esperando Aut.</option>
        <option v-if="tareaSeleccionada.status != 'cola'" value="terminada">Terminada</option>
      </select>
      <button class="btn" type="submit">Guardar Cambios</button>
      <hr>
      <button class="btn" @click="tareaSeleccionada = null;">Cancelar</button>
    </form>
  </div>

</template>

<style scoped>
.admin-container {
  padding: 20px;
}

button {
  margin: 5px;
}

.formulario-editar {
  margin-top: 20px;
}

.btn {
  margin: 10px 0;
}

.filtros-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.Campo {
  margin-right: 5px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
}


.checkbox-container label {
  font-size: 16px;
}


.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}


.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: #2196F3;
}

input:checked+.slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.contenedorEdit {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.contenedor-formularioEdit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.CampoEdit {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
}

h1 {
  text-align: center;
  /* Centrar el h1 */
  font-size: 36px;
  margin-bottom: 20px;
}


.btnS {
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
  width: 125px;
  margin: 0 auto;
}

.btnS:hover {
  cursor: pointer;
  background-color: #b15151;
}
</style>