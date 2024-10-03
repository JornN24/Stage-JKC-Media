<script setup>
import { computed, ref } from 'vue';
import router from '../router/index';
import { supabase } from '../client/supabase.js';

// States
const showFilters = ref(false);
const showProfileDropdown = ref(false);
const tagSearchQuery = ref('');

// Zones & Filtered Zones
const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4'];
const selectedFilters = ref([]);
const filteredTags = computed(() =>
    tags.filter((tag) => tag.toLowerCase().includes(tagSearchQuery.value.toLowerCase()))
);

// Active filters
const activeTags = computed(() => selectedFilters.value);

// Functions
function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    await router.push('/');
  } else {
    console.error('Error signing out:', error.message);
  }
}

function goToSettings() {
  router.push('/settings');
}
</script>

<template>
  <div class="navbar-container">
    <div class="navbar-content">
      <div class="left-content">
        <div class="date-range-filter">
          <select class="date-range-select">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 24 hours</option>
          </select>
        </div>

        <!-- Filter Button -->
        <div class="filter-button">
          <button @click="toggleFilters" class="filter-btn">
            Filter <span class="filter-count">{{ selectedFilters.length }}</span>
          </button>
          <!-- Filter Dropdown -->
          <div v-if="showFilters" class="filter-dropdown">
            <div class="filter-group">
              <h4>Tags</h4>
              <input
                  type="text"
                  placeholder="Search Tags"
                  v-model="tagSearchQuery"
                  class="filter-search-input"
              />
              <div class="zone-options">
                <label v-for="tag in filteredTags" :key="tag">
                  <input
                      type="checkbox"
                      :value="tag"
                      v-model="selectedFilters"
                  />
                  {{ tag }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Zone Tags -->
        <div class="active-filters">
          <span v-for="tag in activeTags" :key="tag" class="filter-tag">{{ tag }}</span>
        </div>
      </div>

      <!-- Profile Dropdown -->
      <div class="profile-dropdown-container">
        <i class="fa fa-user profile-icon" @click="toggleProfileDropdown"></i>
        <div v-if="showProfileDropdown" class="profile-dropdown">
          <ul>
            <li @click="goToSettings">Settings</li>
            <li @click="signOut">Logout</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body{
  margin: 8px;

}
/* Navbar Content */
.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;

}

/* Left Content Container */
.left-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Date Range Filter */
.date-range-filter {
  font-size: 16px;
}
.date-range-select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
/* Filter Button */
.filter-button {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

/* Active Zone Tags */
.active-filters {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-left: 20px;
}
.filter-tag {
  background-color: #a7a7a9;
  color: #444a5f;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
}

/* Filter Button */
.filter-button {
  position: relative;
}
.filter-btn {
  background-color: #444a5f;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.filter-count {
  background-color: #272a36;
  padding: 2px 6px;
  border-radius: 50%;
  margin-left: 5px;
}

/* Filter Dropdown (aligned below the button) */
.filter-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  z-index: 10;
  margin-top: 10px;
}

/* Filter Group */
.filter-group {
  margin-bottom: 10px;
}
.filter-group h4 {
  font-size: 18px;
  margin-bottom: 10px;
}
.filter-search-input {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.zone-options label {
  display: block;
  padding: 5px 0;
}

/* Profile Dropdown */
.profile-dropdown-container {
  position: relative;
  margin-right: 10px;
}
.profile-icon {
  font-size: 24px;
  cursor: pointer;
  color: #4b5563;
}
.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 150px;
  z-index: 10;
  padding: 10px;
}
.profile-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.profile-dropdown li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}
.profile-dropdown li:hover {
  background-color: #f3f4f6;
}

</style>

