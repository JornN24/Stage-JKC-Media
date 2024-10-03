<template>
  <div class="container">
    <div class="form-container">
      <p class="form-title">Register</p>

      <form @submit.prevent="handleSignup">

        <!-- Email input field group -->
        <div class="form-group">
          <div class="icon">
            <i class="fas fa-envelope"></i>
          </div>
          <input
              id="email"
              type="email"
              placeholder="Email"
              v-model="email"
          />
        </div>

        <!-- Password input field group -->
        <div class="form-group">
          <div class="icon">
            <i class="fas fa-lock"></i>
          </div>
          <input
              id="password"
              type="password"
              placeholder="*********"
              v-model="password"
          />
        </div>

        <!-- Button group for register and login -->
        <div class="button-group">
          <button class="submit-button" type="submit">Register</button>
          <button class="login-button" type="button" @click="redirectToLogin">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
/* Import Vue.js ref to create reactive variables */
import { ref } from "vue";

/* Import supabase client for authentication and router for navigation */
import { supabase } from "../client/supabase.js";
import router from "../router/index";

/* Create reactive variables for email and password */
const email = ref("");
const password = ref("");

/* Function to handle the sign-up process */
const handleSignup = async () => {
  try {
    /* Call Supabase API to register the user with email and password */
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: "http://localhost:5173/home"
      }
    });
    if (error) throw error;
    router.push("/sign-in");
  } catch (error) {
    alert(error.error_description || error.message);
  }
};

/* Function to redirect user to the login page */
const redirectToLogin = () => {
  router.push("/");
};
</script>

<style>
/* Reset margins, paddings, and apply box-sizing */
* {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Center the form vertically and horizontally */
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

/* Style the form container */
.form-container {
  background: rgba(34, 39, 54, 0.9);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
  max-width: 400px;
  width: 100%;
  box-sizing: border-box;
  color: white;
}

/* Style for the form title */
.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;
}

/* Form group to position the icon and input fields */
.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

/* Style for the icon inside the input fields */
.icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #aaa;
}

/* Style for the input fields */
.form-group input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  background: #1e212d;
  color: #fff;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

/* Placeholder text color */
.form-group input::placeholder {
  color: #888;
}

/* Change input background when focused */
.form-group input:focus {
  background-color: #292d3e;
  outline: none;
}

/* Style for submit and login buttons */
.submit-button, .login-button {
  flex: 1;
  background-color: #444a5f;
  color: white;
  font-weight: 600;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

/* Hover effect for buttons */
.submit-button:hover, .login-button:hover {
  background-color: #5a6278;
}

/* Active button effect (pressed state) */
.submit-button:active, .login-button:active {
  transform: scale(0.98);
}

/* Style for the button group layout */
.button-group {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
