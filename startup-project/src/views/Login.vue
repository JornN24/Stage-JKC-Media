<template>
  <!-- Main container for the login form -->
  <div class="login-container">
    <div class="form-container">
      <p class="form-title">LOGIN</p>

      <form @submit.prevent="handleSignin">

        <!-- Email input field group -->
        <div class="form-group">
          <div class="icon">
            <i class="fas fa-user"></i>
          </div>
          <input
              id="email"
              type="email"
              placeholder="Username"
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

        <!-- Submit button for the login form -->
        <button class="submit-button" type="submit">LOGIN</button>

        <!-- Group with options (Remember me and Forgot Password) -->
        <div class="options-group">
          <label class="remember-me">
            <input type="checkbox" />
            Remember me
          </label>
          <a class="forgot-password" href="#">Forgot Password?</a>
        </div>

        <!-- Button to redirect to the signup form -->
        <button class="register-button" type="button" @click="redirectToSignup">CREATE AN ACCOUNT</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
/* Import router for page navigation and supabase for authentication */
import router from "../router/index";
import { supabase } from "../client/supabase.js";

/* Create reactive variables for email and password */
const email = ref("");
const password = ref("");

/* Function to handle the sign-in process */
const handleSignin = async () => {
  try {
    /* Call Supabase API to authenticate the user with email and password */
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    router.push("/home");
  } catch (error) {
    alert(error.error_description || error.message);
  }
};

/* Function to redirect user to the signup page */
const redirectToSignup = () => {
  router.push("/sign-up");
};
</script>

<style>
/* Reset margins, paddings, and apply box-sizing */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Center the login form vertically and horizontally */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Style for the login form container */
.form-container {
  background: rgba(34, 39, 54, 0.9);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
  max-width: 400px;
  width: 100%;
  color: white;
  text-align: center;
}

/* Style for the form title */
.form-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

/* Form group for input fields */
.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

/* Icon for the input fields */
.icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #aaa;
}

/* Style for input fields */
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

/* Change background color of input on focus */
.form-group input:focus {
  background-color: #292d3e;
  outline: none;
}

/* Style for the submit button */
.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #444a5f;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Hover effect for the submit button */
.submit-button:hover {
  background-color: #5a6278;
}

/* Group for options like Remember me and Forgot password */
.options-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  margin-top: 1rem;
  color: #888;
}

/* Style for the Remember me checkbox */
.remember-me {
  display: flex;
  align-items: center;
}

/* Style for checkbox spacing */
.remember-me input {
  margin-right: 0.5rem;
}

/* Style for the Forgot Password link */
.forgot-password {
  color: #888;
  text-decoration: none;
}

/* Hover effect for Forgot Password link */
.forgot-password:hover {
  text-decoration: underline;
}

/* Style for the register button */
.register-button {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: #2e3141;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Hover effect for the register button */
.register-button:hover {
  background-color: #444a5f;
}
</style>
