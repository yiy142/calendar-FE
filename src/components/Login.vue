<template>
  <div class="login">
    <div class="login-message">
      <div>Please login though your google Account</div>
    </div>
    <div class="login-button">
      <div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {
      params: {
        client_id:
          "191641375774-accm6sncn5lv0fvm51k53l4lqhj3vi89.apps.googleusercontent.com",
      },
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true,
      },
    };
  },
  methods: {
    onSuccess(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId());
      console.log("Name: " + profile.getName());
      console.log("Image URL: " + profile.getImageUrl());
      console.log("Email: " + profile.getEmail());

      var myUserEntity = {};
      myUserEntity.Id = profile.getId();
      myUserEntity.Name = profile.getName();

      //Store the entity object in sessionStorage where it will be accessible from all pages of your site.
      sessionStorage.setItem("myUserEntity", JSON.stringify(myUserEntity));

      alert(profile.getName());
    },
    onFailure(e) {
      console.log(e);
    },
  },
};
</script>

<style>
</style>