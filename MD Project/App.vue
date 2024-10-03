<script src="./components/homepage.js"></script>
<style src="./components/homepage.css"></style>

<template>
  <div id="app" class="app-container" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <!-- Navbar Section -->
    <section>
      <div class="navbar-container">
        <header :style="{ position: headerPosition }">
          <div class="header">
            <div class="hamburger" @click="toggleMenu">
              <div class="line" :class="{ open: isOpen }"></div>
              <div class="line" :class="{ open: isOpen }"></div>
              <div class="line" :class="{ open: isOpen }"></div>
            </div>
            <nav :class="{ menu: true, open: isOpen }">
              <ul>
                <li><a href="#" @click.prevent="toggleMenu('game')">GAME</a></li>
                <li><a href="#" @click.prevent="toggleMenu('story')">STORY</a></li>
                <li><a href="#" @click.prevent="toggleMenu('characters')">CHARACTERS</a></li>
                <li><a href="#" @click.prevent="toggleMenu('our-plan')">OUR PLAN</a></li>
                <li><a href="https://github.com/JornN24" target="_blank">CONTACT US</a></li>
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </section>

    <!-- Game view section -->
    <section class="game-view" id="game">
      <iframe height="640" src="src/game/index.html" frameborder="0"></iframe>
    </section>

    <!-- Story section -->
    <section class="story-section" id="story">
      <div class="story-content">
        <h3 class="story-title">The story</h3>
        <p class="story-text">
          The series follows protagonists Jayce, Flora, Herc, Oon, and Gillian in their search for Jayce's father, Audric.
          Meanwhile, they are opposing the main antagonist Saw Boss and his followers the Monster Minds.
          Audric was a botanist who performed experiments with biotechnology, one of which created Flora.
          In another experiment, Audric attempted to create a plant that could prevent starvation. However, when he succeeded, a nearby star exploded into a supernova.
          The radiation from the supernova's explosion changed the plant and four others into the Monster Minds: a race of plant-like monsters who wish to conquer the universe.
          Audric created a root that could destroy the Monster Minds but was forced to flee before he could complete the task.
          Afterward, the Monster Minds made Audric's laboratory their headquarters. Audric kept half of the root himself and gave the other half to his servant, the Eternal Squire Oon, whom he sent to serve Jayce.
          Jayce and his friends are thereafter on a quest to find Audric and form the complete root.        </p>
        <h3 id="characters" class="characters-title">Characters</h3>
      </div>
    </section>

    <!-- Characters section -->
    <section class="characters-section">
      <div class="characters-content">
        <div class="character-buttons">
          <CharacterButton
              v-for="character in characters"
              :key="character.name"
              :name="character.name"
              :imageSrc="character.imageSrc"
              @click="TogglePopup(character)"
          />
        </div>
        <main>
          <Popup v-if="currentCharacter" :character="currentCharacter" :TogglePopup="ClosePopup"></Popup>
        </main>
      </div>
    </section>

    <!-- Our plan section -->
    <section class="ourPlan-section" id="our-plan">
      <div class="ourPlan-content">
        <h3 class="ourPlan-title">Our plan</h3>
        <p class="ourPlan-text">
          Based on the success of similar reboots, we have decided to target an older demographic than the original series. Therefore, we have chosen the age of 17. Our target audience is playful, adventurous, and imaginative, aligning with the essence of the series. They are also interested in cars, space, anime, cartoons, magic, mutated creatures, and technology.

          Reboots often target an older audience because the financial focus has shifted from toys to streaming services. While character themes are often retained, the overall themes of the series are frequently adapted. This strategic shift allows us to engage a more mature audience who not only seek nostalgia but also appreciate contemporary storytelling and technology.

          Our plan is to blend the beloved elements of the original series with fresh, engaging content that appeals to both nostalgic fans and new viewers, ensuring a successful reboot that resonates across generations.        </p>
        <button class="cta-button">Learn More</button>
      </div>
      <div class="image-container">
        <img src="./img/bewitched.png" alt="">
      </div>
    </section>

    <!-- Footer section -->
    <section class="footer-section">
      <footer>
        <div class="footer-content">
          <div class="footer-links">
            <ul>
              <li><a href="#" @click.prevent="scrollToSection('game')">GAME</a></li>
              <li><a href="#" @click.prevent="scrollToSection('story')">STORY</a></li>
              <li><a href="#" @click.prevent="scrollToSection('characters')">CHARACTERS</a></li>
              <li><a href="#" @click.prevent="scrollToSection('our-plan')">OUR PLAN</a></li>
              <li><a href="mailto:BewitchedStudios@gmail.com" target="_blank">CONTACT US</a></li>
            </ul>
          </div>
          <div class="footer-info">
            <p>&copy; 2024 Bewitched studios. All rights reserved. Designed by <a href="https://github.com/JornN24">JornN24</a></p>
          </div>
        </div>
      </footer>
    </section>
  </div>
</template>