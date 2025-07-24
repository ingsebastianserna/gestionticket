<script>
import axios from 'axios';
import { formatearFecha } from '../functions';
import AddUsrForm from './Add-Usr-Form.vue';
import AddTaskForm from './Add-Task-Form.vue';
import vistaArchivada from './Tareas-Archivadas.vue';

export default {
  components: {
    AddUsrForm,
    AddTaskForm,
    vistaArchivada
  },

  data() {
    return {
      nombre: '',
      usuarios: [],
      tareas: [],
      filtro: 'none',
      filtro2: 'none',
      filtro3: 'none',
      filtro4: 'none',
      ventanaUsr: false,
      ventanaTask: false,
      ventanaEdit: false,
      usuarioSeleccionado: null
    };
  },
 
  computed: {
    tareasFiltradas2() {
      return this.tareas.filter(tarea => {
        const statusMatch = this.filtro === 'none' || tarea.status === this.filtro;
        const informadoMatch = this.filtro2 === 'none' || tarea.informado == this.filtro2;
        const nombreMatch = this.filtro3 === 'none' || tarea.nombre === this.filtro3;
        const prioridadMatch = this.filtro4 === 'none' || tarea.prioridad == this.filtro4;
        return statusMatch && informadoMatch && nombreMatch && prioridadMatch;
      });
    }
  },

  methods: {
    formatearFecha,

    obtenerUsuarios() {
      axios.get(`${process.env.VUE_APP_BASE_URL}/usuarios`)
        .then(response => {
          this.usuarios = response.data;
        })
        .catch(error => {
          console.error('Error al obtener usuarios:', error);
        });
    },

    editarUsuario(usuario) {
      this.usuarioSeleccionado = { ...usuario };
      this.ventanaEdit = true;
    },

    actualizarUsuario() {
      const { id, rol, password } = this.usuarioSeleccionado;
      axios.put(`${process.env.VUE_APP_BASE_URL}/usuarios/${id}`, { rol, password })
        .then(() => {
          console.log('Usuario actualizado');
          this.usuarioSeleccionado = null;
          this.obtenerUsuarios();
        })
        .catch(error => {
          console.error('Error al actualizar usuario:', error);
        });
      this.ventanaEdit = false;
    },

    eliminarUsuario(usuario) {
      this.usuarioSeleccionado = { ...usuario };
      const id = this.usuarioSeleccionado.id;
      const respuesta = confirm(`¿Esta seguro de eliminar este usuario?`);
      if (respuesta) {
        const existe = this.tareas.some((tarea) => tarea.tecnico_id === id);
        if (existe) {
          alert('No se puede eliminar un usuario con tareas asignadas');
        }
        else {
          this.enviarEliminarUsuario(id);
        }
      }
      else {
        alert('Operacion cancelada');
      }
    },

    enviarEliminarUsuario(id) {
      axios.delete(`${process.env.VUE_APP_BASE_URL}/usuarios/${id}`)
        .then(() => {
          console.log('Usuario Eliminado');
          this.obtenerUsuarios();
        })
        .catch(error => {
          console.error('Error al eliminar usuario:', error);
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

    abrirVentanaEmergente() {
      this.$refs.AddUsrForm.mostrar();
    },

    abrirVentana() {
      this.$refs.AddTaskForm.mostrar();
    },

    cerrarSesion() {
      this.$router.push('/login');
    },

    cargarTablaUsuarios() {
      this.$refs.vistaArchivada.ocultar();
      this.ventanaUsr = true;
      this.ventanaTask = false;
    },

    cargarTablaTask() {
      this.$refs.vistaArchivada.ocultar();
      this.ventanaTask = true;
      this.ventanaUsr = false;
    },

    mostarArchivadas() {
      this.$refs.vistaArchivada.mostar();
      this.ventanaUsr = false;
      this.ventanaTask = false;
    }
  },

  mounted() {
    this.obtenerUsuarios();
    this.obtenerTareas();
    this.nombre = localStorage.getItem('nombreUsr');
  }
};
</script>

<template>
  <div class="login-form login-screen app-title">
    <h1>Hola {{nombre}}</h1>
    <h2>Panel de administrador</h2>
    <section class="usuarios">
      <section class="main-navigation">
        <nav class="nav-links container-links" aria-label="Navegación Principal">
          <a class="cta-button" @click="cargarTablaUsuarios">Usuarios</a>
          <a class="cta-button" @click="cargarTablaTask">Tareas activas</a>
          <a class="cta-button" @click="mostarArchivadas">Tareas archivadas</a>
          <a class="cta-button" @click="cerrarSesion">&#x021E0; Cerrar sesión</a>
        </nav>
      </section>
      <section v-if="this.ventanaUsr">
        <h2>Gestión de usuarios</h2>
        <table class="table-screen tabla-responsive">
          <thead>
            <tr>
              <th>Num Documento</th>
              <th>Nombre</th>
              <th>Cargo</th>
            </tr>
          </thead>
          <tbody v-for="usuario in usuarios" :key="usuario.id">
            <tr v-if="usuario.nombre != this.nombre">
              <td>{{ usuario.dni }}</td>
              <td>{{ usuario.nombre }}</td>
              <td>{{ usuario.rol }}</td>
              <td>
                <button class="btn2" @click="editarUsuario(usuario)">Editar</button>
              </td>
              <td>
                <button class="btn2" @click="eliminarUsuario(usuario)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <br>
        <button class="btn" @click="abrirVentanaEmergente">Agregar Usuario</button>
        <AddUsrForm ref="AddUsrForm" @cerrarActualizar="obtenerUsuarios()"></AddUsrForm>
        <div v-if="ventanaEdit" class="formulario-editar">
          <h3>Editar Usuario: {{ usuarioSeleccionado.nombre }}</h3>
          <form @submit.prevent="actualizarUsuario">
            <label for="rol">Rol:</label>
            <select v-model="usuarioSeleccionado.rol" required>
              <option value="administrador">Administrador</option>
              <option value="tecnico">Técnico</option>
              <option value="recepcionista">Recepcionista</option>
            </select>
            <label for="password">Nueva Contraseña:</label>
            <input type="password" v-model="usuarioSeleccionado.password" required>
            <button type="submit">Guardar Cambios</button>
          </form>
        </div>
      </section>
    </section>
    <section class="tareas" v-if="ventanaTask">
      <h2>Gestión de Tareas</h2>
      <div class="btn-container">
        <button class="btnn" @click="abrirVentana">Agregar Tarea</button>
        <AddTaskForm ref="AddTaskForm" @actualizarTareas="obtenerTareas" :usuarios="usuarios"></AddTaskForm>
        <button class="btnn" @click="console.log(tareas);">Actualizar</button>
      </div>
      <hr>
      <div class="filtros-container">
        <label class="Campo">Filtrar Estado:</label>
        <select v-model="filtro" class="Campo">
          <option value="none">Todos</option>
          <option value="cola">En Cola</option>
          <option value="proceso">En Proceso</option>
          <option value="espera_aut">Esperando Aut.</option>
          <option value="terminada">Finalizadas</option>
        </select>
        <label class="Campo">Filtrar Informados:</label>
        <select v-model="filtro2">
          <option value="none">Todos</option>
          <option value=1>Informado</option>
          <option value=0>No Informado</option>
        </select>
        <label class="Campo">Filtrar Usuarios:</label>
        <select v-model="filtro3">
          <option value="none">Todos</option>
          <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.nombre"> {{ usuario.nombre }} </option>
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
            <th>tecnico</th>
            <th>Informado</th>
            <th>Fecha Asignación</th>
            <th>Fecha Inicio</th>
            <th>Fecha finalización</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tarea in tareasFiltradas2" :key="tarea.tarea_id">
            <td>{{ tarea.Equipo }}</td>
            <td>{{ tarea.descripcion }}</td>
            <td> {{ tarea.prioridad }} </td>
            <td>{{ tarea.status }}</td>
            <td>{{ tarea.nombre }}</td>
            <td v-if="tarea.informado === 0">No informado</td>
            <td v-else>Informado</td>
            <td> {{ formatearFecha(tarea.fechaAsignacion) }} </td>
            <td v-if="tarea.fechaProceso == null">No iniciada</td>
            <td v-else>{{ formatearFecha(tarea.fechaProceso) }}</td>
            <td v-if="tarea.fechaFinalizada == null">No finalizada</td>
            <td v-else> {{ formatearFecha(tarea.fechaFinalizada) }} </td>
          </tr>
        </tbody>
      </table>
    </section>
    <div>
      <vistaArchivada ref="vistaArchivada" :usuarios="usuarios"></vistaArchivada>
    </div>
  </div>
</template>

<style scoped>
.login-form {
  text-align: center;
}

h1 {
  font-size: 2rem;
}

.btn {
  background-color: #3498db;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.btnn {
  background-color: #3498db;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

.btnn:last-child {
  margin-right: 0;
}

.btn:hover {
  background-color: #2980b9;
}

.formulario-editar {
  margin-top: 20px;
}

.main-navigation {
  background-color: #d8d8d8;

}

.main-navigation a {
  color: #3498db;
  text-decoration: none;
  font-size: 1.5rem;
  padding: 1rem
}

.main-navigation a:hover {
  background-color: #2980b9;
  color: white;
  cursor: pointer;
}

.nav-links {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .nav-links {
    flex-direction: row;
    justify-content: space-between;
  }
}

.filtros-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.Campo {
  margin-right: 5px;
}

.container {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
