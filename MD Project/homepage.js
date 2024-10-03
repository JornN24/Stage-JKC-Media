import { ref } from 'vue';
import Popup from "@/components/popup.vue";
import CharacterButton from "@/components/characterButton.vue";
import jayceImage from '@/img/Jayce.png';
import gillianImage from '@/img/Gilian.png';
import floraImage from '@/img/FLora.png';
import oonImage from '@/img/Oon.png';
import hercImage from '@/img/Herc.png';
import sawbossImage from '@/img/Sawboss.png';
import backgroundImage from '@/img/Webside_side_texture.jpg';

export default {
    components: {
        Popup,
        CharacterButton
    },
    setup() {
        const currentCharacter = ref(null);
        const headerPosition = ref('fixed');
        const isOpen = ref(false);

        // Function to toggle the popup with character details
        const TogglePopup = (character) => {
            currentCharacter.value = character;
            if (character) {
                headerPosition.value = 'absolute';
            }
        };

        // Function to close the character popup
        const ClosePopup = () => {
            currentCharacter.value = null;
            headerPosition.value = 'fixed';
        };

        // Function to toggle the menu and optionally scroll to a section
        const toggleMenu = (sectionId) => {
            if (isOpen.value) {
                scrollToSection(sectionId);
            }
            isOpen.value = !isOpen.value;
        };

        // Array of character objects with their details
        const characters = [
            {
                name: 'Jayce',
                imageSrc: jayceImage,
                description: 'Jayce is the protagonist of the series, bearer of the Legendary Ring of Light, and guardian of half of the Magic Root.'
            },
            {
                name: 'Gillian',
                imageSrc: gillianImage,
                description: "Gillian is a wizard and mentor to Jayce and Flora. He is Flora's co-creator and the creator of all five Lightning League vehicles."
            },
            {
                name: 'Flora',
                imageSrc: floraImage,
                description: "Created by Audric, Flora is a human-plant hybrid with a keen intellect and a deep connection to nature. She's driven by a quest for identity and a desire to protect her friends."
            },
            {
                name: 'Oon',
                imageSrc: oonImage,
                description: "Audric's loyal servant and guardian of half the root, Oon is wise, resourceful, and utterly dedicated to his mission of aiding Jayce in his quest."
            },
            {
                name: 'Herc',
                imageSrc: hercImage,
                description: "A skilled pilot and mechanic, Herc is the brawn of the Lightning League with a heart of gold, fiercely loyal to his friends and always ready for action."
            },
            {
                name: 'Saw boss',
                imageSrc: sawbossImage,
                description: "Transformed by a supernova's radiation, Saw Boss leads the ruthless Monster Minds with a singular goal of universal domination. Cunning and ruthless, he'll stop at nothing to achieve his aims."
            },
        ];

        // Function to scroll to a specific section of the page
        const scrollToSection = (sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        };

        // Returning the variables and functions to be used in the template
        return {
            currentCharacter,
            TogglePopup,
            ClosePopup,
            characters,
            headerPosition,
            isOpen,
            toggleMenu,
            backgroundImage,
            scrollToSection
        };
    }
};
