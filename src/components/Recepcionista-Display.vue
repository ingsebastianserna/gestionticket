<script>
import axios from 'axios';
import AddTaskForm from './Add-Task-Form.vue';
import vistaArchivada from './Tareas-Archivadas.vue';
import { obtenerFecha, formatearFecha } from '../functions';
import '../styles/recepcionistaStyle.css'

export default {
  name: "Recepcionista-Display",

  components: {
    AddTaskForm,
    vistaArchivada
  },

  data() {
    return {
      nombre: '',
      tareaArchivar: {
                Equipo: '',
                descripcion: '',
                status: '',
                prioridad: '',
                informado: '',
                tecnico_id: '',
                fechaAsignacion: '',
                fechaProceso: '',
                fechaFinalizada:'',
                fechaArchivada:''
            },
      usuarios: [],
      tareas: [],
      tareasArchivadas: [],
      filtro: 'none',
      filtro2: 'none',
      filtro3: 'none',
      filtro4: 'none',
      ventanaTask: false,
      ventanaSelfTask: false,
      ventanaEdit: null,
      verFinalizados: false,
      tareaSeleccionada: null      
    };
  },
  
  computed: {
    tareasFiltradas() {
      return this.tareas.filter(tarea => {
        const statusMatch = this.filtro === 'none' || tarea.status === this.filtro;
        const informadoMatch = this.filtro2 === 'none' || tarea.informado == this.filtro2;
        const nombreMatch = this.filtro3 === 'none' || tarea.nombre === this.filtro3;
        const prioridadMatch = this.filtro4 === 'none' || tarea.prioridad == this.filtro4;

        return statusMatch && informadoMatch && nombreMatch && prioridadMatch;
      });
    },
    usuariosfiltrados() {
      return this.usuarios.filter(usuario => usuario.nombre !== this.nombre);
    }
  },

  methods: {

    obtenerFecha,

    formatearFecha,

    obtenerUsuarios() {
      axios.get(`${process.env.VUE_APP_BASE_URL}/usuarios`)
        .then(response => {
          this.usuarios = response.data;
          console.log('Usuarios cargados');
        })
        .catch(error => {
          console.error('Error al obtener usuarios:', error);
        });
    },

    obtenerTareas() {
      axios.get(`${process.env.VUE_APP_BASE_URL}/tareas`, {
        params: { rol: 'administrador' }
      })
        .then(response => {
          this.tareas = response.data;
          console.log('Tareas cargadas');
        })
        .catch(error => {
          console.error('Error al obtener tareas:', error);
        });
    },

    actualizarTarea(tarea) {
      this.tareaSeleccionada = { ...tarea };
      this.cargarActualizar();
    },

    cargarActualizar() {
      const { tarea_id, status } = this.tareaSeleccionada;
      const info = this.tareaSeleccionada.informado;
      let actual = null;

      if (info === 1) {
        actual = false;
      }
      else {
        actual = true;
      }

      axios.put(`${process.env.VUE_APP_BASE_URL}/tareas/${tarea_id}`, {
        status: status,
        informado: actual 
      })
        .then(response => {
          console.log(response);
          this.obtenerTareas();
          this.tareaSeleccionada = null;
          console.log('Tarea Actualizada')
        })
        .catch(error => {
          console.error('Error al actualizar la tarea:', error);
        });
    },

    editarTarea(tarea) {
      this.tareaSeleccionada = { ...tarea };
      this.mostarVentanaEdit();
    },

    cargarEditar() {
      const { tarea_id, Equipo, descripcion, status, prioridad, tecnico_id } = this.tareaSeleccionada;
      
      axios.put(`${process.env.VUE_APP_BASE_URL}/tareaUpdate/${tarea_id}`, {
        Equipo: Equipo,
        descripcion: descripcion,
        status: status,
        prioridad: prioridad,
        tecnico_id: tecnico_id
      })
        .then(response => {
          console.log(response);
          this.obtenerTareas();
          this.cancelarEdicion();
          console.log('Tarea Actualizada')
        })
        .catch(error => {
          console.error('Error al actualizar la tarea:', error);
        });
    },

    editarTareaPropia() {
      const { tarea_id, status } = this.tareaSeleccionada;
      axios.put(`${process.env.VUE_APP_BASE_URL}/tareas/${tarea_id}`, {
        status: status, 
        informado: false  
      })
        .then(response => {
          console.log(response);
          this.obtenerTareas();
          this.mostarVentanaSelfTasks();
          this.tareaSeleccionada = null;
          console.log('Tarea actualizada');
        })
        .catch(error => {
          console.error('Error al actualizar la tarea:', error);
        });
    },

    archivarTarea(tarea) {
      this.tareaArchivar = { ...tarea };
      const respuesta = confirm(`¿Esta seguro de archivar ${this.tareaArchivar.Equipo}?`);
      if (respuesta) {
        this.tareaArchivar.fechaArchivada = this.obtenerFecha();
        this.tareaArchivar.fechaAsignacion = this.formatearFecha(this.tareaArchivar.fechaAsignacion);
        this.tareaArchivar.fechaFinalizada = this.formatearFecha(this.tareaArchivar.fechaFinalizada);
        this.tareaArchivar.fechaProceso = this.formatearFecha(this.tareaArchivar.fechaProceso);
        console.log(this.tareaArchivar);

        axios.post(`${process.env.VUE_APP_BASE_URL}/tareasArchivadas`, this.tareaArchivar)
          .then(() => {
            alert('Tarea archivada con éxito');
            this.eliminarTarea(this.tareaArchivar.tarea_id);
            setTimeout(() => {
              this.obtenerTareas();
            }, 1800);
            
          })
          .catch(error => {
            alert('Error al archivar tarea');
            console.error('Error al archivar tarea:', error);
          });
      }
      else {
        alert('Operacion cancelada');
      }

    },

    eliminarTarea(id) {
      axios.delete(`${process.env.VUE_APP_BASE_URL}/tareas/${id}`)
        .then(() => {
          console.log('Tarea movida a archivadas');
          this.obtenerUsuarios();
        })
        .catch(error => {
          console.error('Error al archivar la tarea:', error);
        });
    },

    abrirVentana() {
      this.$refs.AddTaskForm.mostrar();
    },

    mostarArchivadas() {
      this.$refs.vistaArchivada.mostar();
      this.ventanaTask = false;
      this.ventanaSelfTask = false;
      this.ventanaEdit = false;
    },

    mostarVentanaTasks() {
      this.ventanaTask = true;
      this.ventanaSelfTask = false;
      this.ventanaEdit = false;
      this.$refs.vistaArchivada.ocultar();
    },

    mostarVentanaSelfTasks() {
      this.ventanaTask = false;
      this.ventanaSelfTask = true;
      this.ventanaEdit = false;
      this.$refs.vistaArchivada.ocultar();
    },

    mostarVentanaEdit() {
      this.ventanaTask = false;
      this.ventanaSelfTask = false;
      this.ventanaEdit = true;
      this.$refs.vistaArchivada.ocultar();
    },

    cerrarSesion() {
      this.$router.push('/login');
    },

    cancelarEdicion() {
      this.mostarVentanaTasks();
      this.tareaSeleccionada = null;
    },

  },
  mounted() {
    this.nombre = localStorage.getItem('nombreUsr');
    this.obtenerUsuarios();
    this.obtenerTareas();
  }
};
</script>

<template>
  <div class="login-form login-screen app-title">
    <h1>Hola {{ nombre }}</h1>
    <h2>Panel de gestión</h2>
    <!-- Barra de Navegacion -->
    <section class="main-navigation">
      <nav class="nav-links container-links" aria-label="Navegación Principal">
        <a class="cta-button" @click="mostarVentanaTasks">Tareas activas</a>
        <a class="cta-button" @click="mostarVentanaSelfTasks">Mis tareas</a>
        <a class="cta-button" @click="mostarArchivadas">Tareas archivadas</a>
        <a class="cta-button" @click="cerrarSesion">&#x021E0; Cerrar sesión</a>
      </nav>
    </section>
    <br>
    <!-- Gestión de tareas tecnicos -->
    <section v-if="ventanaTask" class="tareas">
      <!-- Botones -->
      <div class="btn-container">
        <button class="btnn" @click="obtenerTareas">Actualizar tareas</button>
        <button class="btnn" @click="abrirVentana">Agregar tarea</button>
        <AddTaskForm ref="AddTaskForm" @actualizarTareas="obtenerTareas" :usuarios="usuarios"></AddTaskForm>
      </div>
      <hr>
      <!-- Seccion de Filtrado -->
      <div class="filtros-container">
        <label class="Campo"> Filtrar Estado: </label>
        <select v-model="filtro" class="Campo">
          <option value="none">Todos</option>
          <option value="cola">En cola</option>
          <option value="proceso">En proceso</option>
          <option value="espera_aut">Esperando Aut.</option>
          <option value="terminada">Finalizadas</option>
        </select>
        <label class="Campo">Filtrar Informados:</label>
        <select v-model="filtro2">
          <option value="none">Todos</option>
          <option value=1>Informado</option>
          <option value=0>No informado</option>
        </select>
        <label class="Campo">Filtrar Usuarios:</label>
        <select v-model="filtro3">
          <option value="none">Todos</option>
          <option v-for="usuario in usuariosfiltrados" :key="usuario.id" :value="usuario.nombre"> {{ usuario.nombre }}
          </option>
        </select>
        <label class="Campo">Filtrar Prioridad:</label>
        <select v-model="filtro4">
          <option value="none">Todas</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>
      <hr>
      <!-- Tabla de Tareas Activas -->
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
            <th>Informe</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody v-for="tarea in tareasFiltradas" :key="tarea.tarea_id">
          <tr>
            <td>{{ tarea.Equipo }}</td>
            <td>{{ tarea.descripcion }}</td>
            <td> {{ tarea.prioridad }} </td>
            <td>{{ tarea.status }}</td>
            <td>{{ tarea.nombre }}</td>
            <td v-if="tarea.informado === 0">No informado</td>
            <td v-else>Informado</td>
            <td> {{ formatearFecha(tarea.fechaAsignacion) }} </td>
            <td v-if="tarea.fechaProceso == null"> No iniciada </td>
            <td v-else> {{ formatearFecha(tarea.fechaProceso) }} </td>
            <td v-if="tarea.fechaFinalizada == null"> No finalizada </td>
            <td v-else> {{ formatearFecha(tarea.fechaFinalizada) }} </td>
            <td v-if="tarea.informado === 0"> <button id="inf" class="btnn"
                @click="actualizarTarea(tarea)">Informar</button> </td>
            <td v-else> <button class="inf" @click="actualizarTarea(tarea)">Cambiar</button> </td>
            <td v-if="tarea.informado == 1 && tarea.fechaFinalizada != null && tarea.status === 'terminada'">
              <button class="btnnDisable" @click="archivarTarea(tarea)">Archivar tarea</button>
            </td>
            <td v-else> <button class="btnn" @click="editarTarea(tarea)">Editar tarea</button> </td>
          </tr>
        </tbody>
      </table>
    </section>
    <!-- Gestion de Tareas Propias-->
    <section class="tareas" v-if="ventanaSelfTask">
      <hr>
      <!-- Seccion de Filtrado-->
      <div class="filtros-container">
        <label class="Campo"> Filtrar Estado: </label>
        <select v-model="filtro" class="Campo">
          <option value="none">Todos</option>
          <option value="cola">En Cola</option>
          <option value="proceso">En Proceso</option>
          <option value="espera_aut">Esperando Aut.</option>
          <option value="terminada">Finalizadas</option>
        </select>
        <label class="Campo">Filtrar Prioridad:</label>
        <select v-model="filtro4">
          <option value="none">Todas</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
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
            <th>Fecha asignación</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody v-for="tarea in tareasFiltradas" :key="tarea.tarea_id">
          <tr v-if="tarea.nombre === this.nombre && tarea.status != 'terminada'">
            <td>{{ tarea.Equipo }}</td>
            <td>{{ tarea.descripcion }}</td>
            <td> {{ tarea.prioridad }} </td>
            <td>{{ tarea.status }}</td>
            <td> {{ formatearFecha(tarea.fechaAsignacion) }} </td>
            <td>
              <button class="btn" @click="editarTarea(tarea)">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <vistaArchivada ref="vistaArchivada" :usuarios="usuarios"></vistaArchivada>

  </div>
  <!-- Ventana de edicion de tareas -->
  <div v-if="ventanaEdit" class="contenedorEdit">
    <h3>Editar Tarea: {{ tareaSeleccionada.Equipo }}</h3>
    <!--Edicion de tarea de Tecnicos-->
    <section v-if="tareaSeleccionada.nombre != this.nombre">
      <form @submit.prevent="cargarEditar" class="contenedor-formularioEdit">
        <div class="Campo">
          <label>Equipo: </label>
          <input type="text" v-model="tareaSeleccionada.Equipo" required>
        </div>
        <div class="Campo">
          <label>Descripción: </label>
          <input type="text" v-model="tareaSeleccionada.descripcion" required>
        </div>
        <div class="Campo">
          <label for="prioridad">Prioridad: </label>
          <select v-model="tareaSeleccionada.prioridad" required>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <div class="Campo">
          <label for="rol">Encargado: </label>
          <select v-model="tareaSeleccionada.tecnico_id" required>
            <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
              {{ usuario.nombre }}
            </option>
          </select>
        </div>
        <hr>
        <div>
          <button class="btn" type="submit">Guardar cambios</button>
          <hr>
        </div>
      </form>
    </section>
    <!--Edicion de tarea Propia-->
    <section v-else>
      <form @submit.prevent="editarTareaPropia" class="contenedor-formularioEdit">
        <select v-model="tareaSeleccionada.status" required class="Campo">
          <option value="cola">En cola</option>
          <option value="proceso">En proceso</option>
          <option v-if="tareaSeleccionada.status != 'cola'" value="espera_aut">Esperando Aut.</option>
          <option v-if="tareaSeleccionada.status != 'cola'" value="terminada">Terminada</option>
        </select>
        <hr>
        <div>
          <button class="btn" type="submit">Guardar cambios</button>
        </div>
      </form>
      <hr>
    </section>
    <button class="btn" @click="cancelarEdicion">Cancelar</button>
  </div>
</template>

<style scoped>

</style>
