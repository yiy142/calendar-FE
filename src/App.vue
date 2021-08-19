<template>
  <div id="app">
    <a-layout class="layout">
      <a-layout-header class="layout-header">
        <div class="layout-title">
          <h1
            :style="{ color: 'white', margin: '0 10px', textAlign: 'center' }"
          >
            Imperial Calendar Assistant
          </h1>
          <a-button type="link" v-show="logIn" @click="signOut">
            Sign Out
          </a-button>
        </div>
      </a-layout-header>
      <a-layout-content style="padding: 30px 30px">
        <div
          :style="{
            height: '100%',
            background: '#fff',
            padding: '24px',
            minHeight: '280px',
          }"
        >
          <div v-show="!logIn" class="login-page">
            <h1>Please Sign In through Google</h1>
            <div ref="signinBtn" id="signinBtn">Log In</div>
          </div>
          <div
            v-if="logIn"
            style="position: relative; height: 100%; overflow: scroll"
          >
            <router-view />
          </div>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        AI Calendar Assistant ©2021 Created by Ian Yang
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script>
export default {
  name: "app",
  components: {},
  created() {
    const gapi = window.gapi;
    let auth2 = gapi.load("auth2", () => {
      auth2 = gapi.auth2.init({
        client_id:
          "191641375774-accm6sncn5lv0fvm51k53l4lqhj3vi89.apps.googleusercontent.com",
        cookiepolicy: "single_host_origin",
        // scope: "additional_scope",
      });
      gapi.signin2.render("signinBtn", {
        // scope: "profile email",
        width: 240,
        height: 50,
        longtitle: true,
        theme: "dark",
        onsuccess: this.onSuccess,
        onfailure: this.onFailure,
      });
      this.auth2 = auth2;
      window.auth2 = auth2;
    });
  },
  watch: {
    logIn(bool) {
      if (!bool) {
        window.gapi.signin2.render("signinBtn", {
          // scope: "profile email",
          width: 240,
          height: 50,
          longtitle: true,
          theme: "dark",
          onsuccess: this.onSuccess,
          onfailure: this.onFailure,
        });
      }
    },
  },
  data() {
    return {
      auth2: null,
    };
  },
  methods: {
    onSuccess(googleUser) {
      console.log(googleUser.getBasicProfile());

      // sessionStorage.setItem('googleUser', JSON.stringify(googleUser.getProfile()));
    },
    onFailure(e) {
      console.error(e);
    },
    signOut() {
      this.auth2.signOut().then(function () {
        console.log("User signed out.");
      });
    },
  },
  computed: {
    logIn() {
      if (!this.auth2) {
        return false;
      }
      return this.auth2.isSignedIn.get();
    },
  },
};
</script>

<style lang="scss">
.ant-layout {
  height: 100%;
}
#app {
  height: 100%;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  .layout-header {
    padding: 0 10px;
  }
  .layout-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

