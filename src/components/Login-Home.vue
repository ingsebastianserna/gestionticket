<script>
import axios from "axios";

export default {
    data() {
        return {
            dni: "",
            password: "",
            error: ""
        };
    },
    methods: {
        login() {
            axios
                .post(`${process.env.VUE_APP_BASE_URL}/login`, {
                    dni: this.dni,
                    password: this.password
                })
                .then(response => {
                    const { rol, usuarioId, nombreUser } = response.data;
                    localStorage.setItem("rol", rol);
                    localStorage.setItem("usuarioId", usuarioId);
                    localStorage.setItem("nombreUsr", nombreUser);

                    if (rol === "administrador") {
                        this.$router.push("/admin");
                    } else if (rol === "recepcionista") {
                        this.$router.push("/recepcionista");
                    } else if (rol === "tecnico") {
                        this.$router.push("/tecnico");
                    }
                    setTimeout(() => {
                        alert('!!! La sesion ha expirado !!!');
                        this.$router.push('/login');
                    }, 10800000);
                })
                .catch(err => {
                    this.error = "Credenciales incorrectas. Intenta nuevamente";
                    console.log(err);
                    this.limpiar();
                    this.limpiarCampos();
                });
        },
        limpiar() {
            setTimeout(() => {
                this.error = '';
            }, 3000);
        },

        limpiarCampos () {
            this.dni = '';
            this.password = '';
        },

        testDBConnection() {
            axios
                .get(`${process.env.VUE_APP_BASE_URL}/test-db-connection`)
                .then(response => {
                    this.dbConnectionStatus = response.data;
                    console.log('Conexión a la base de datos exitosa');
                })
                .catch(err => {
                    this.dbConnectionStatus = "Error al conectar a la base de datos";
                    console.error(err);
                });
        } 
    },
    mounted() {
        localStorage.removeItem('rol');
        localStorage.removeItem('usuarioId');
    },
};
</script>

<template>
    <div class="login">
        <div class="login-screen">
            <div class="app-title">
                <h1>Iniciar sesión</h1>
            </div>
            <form @submit.prevent="login" class="login-form">
                <div class="control-group">
                    <input type="text" class="login-field" placeholder="Documento ID" v-model="dni" id="login-name"
                        required />
                    <label class="login-field-icon fui-user" for="login-name"></label>
                </div>
                <div class="control-group">
                    <input type="password" class="login-field" placeholder="Contraseña" v-model="password"
                        id="login-pass" required />
                    <label class="login-field-icon fui-lock" for="login-pass"></label>
                </div>
                <button type="submit" class="btn btn-primary btn-large btn-block">Iniciar sesión</button>
                <p v-if="error" class="error">{{ error }}</p>
            </form>
        </div>
    </div>
</template>
