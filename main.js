console.log("Welcome to my colour theory website :)");

// Registers the ScrollTrigger plugin from GSAP, used for scroll animations
gsap.registerPlugin(ScrollTrigger);

// Waits for the HTML document to be fully loaded before executing the code inside
document.addEventListener('DOMContentLoaded', function() {

	// I use a timeout to ensure all elements are ready before initialising
	setTimeout(() => {
		// Initialises animations throughout the site
		initialiseAnimations();

		// Sets up the navigation functionality between different sections
		initialiseNavigation();

		// Calls the function to animate theory boxes on scroll
		animateTheoryBoxesOnScroll();

		// Below I'm adding event listeners to option boxes. When clicked, they trigger a function to select an option and play a sound effect.
		document.getElementById("option-one-box").addEventListener('click', () => {
			selectOption('option-one');
			OptionSoundEffect.play();
		});

		// Repeating the same pattern for other options.
		document.getElementById("option-two-box").addEventListener('click', () => {
			selectOption('option-two');
			OptionSoundEffect.play();
		});

		document.getElementById("option-three-box").addEventListener('click', () => {
			selectOption('option-three');
			OptionSoundEffect.play();
		});

		document.getElementById("option-four-box").addEventListener('click', () => {
			selectOption('option-four');
			OptionSoundEffect.play();
		});

		// Adding click event listeners to reset and go back buttons in the quiz section.
		document.getElementById('retake-quiz-button').addEventListener('click', resetQuiz);
		document.getElementById('back-to-quiz-button').addEventListener('click', goToQuizPage);

		// Refreshes ScrollTrigger instances
		ScrollTrigger.refresh();
	}, 100);

	// Using anime.js to create a bouncing animation for elements with the 'colour' class
	anime({
		targets: '.colour',
		translateY: [-20, 0],
		duration: 400,
		elasticity: 500,
		loop: true,
		direction: 'alternate',
		delay: function(el, i) {
			return i * 300;
		}
	});

	// Instantiating audio for option selection sound effect
	const OptionSoundEffect = new Audio('audio/option.wav');

	// Attaching a sound effect to all menu items
	const menuItems = document.querySelectorAll('sl-menu-item');
	menuItems.forEach(item => {
		item.addEventListener('click', () => {
			OptionSoundEffect.play();
		});
	});

	// Configuring and attaching a sound effect to the quiz button
	const quizButton = document.querySelector('.quiz-button');
	const QuizSoundEffect = new Audio('audio/quiz.wav');
	quizButton.addEventListener('click', () => {
		QuizSoundEffect.currentTime = 0;
		QuizSoundEffect.play();
	});

});

// Function to initialise animations on the site
function initialiseAnimations() {
	const animation = document.querySelector('sl-animation');
	const circle = animation.querySelector('.circle');

	if (!animation || !circle) return;

	animation.addEventListener('sl-ready', () => {
		animation.play = true;
	});

	// Observer to play/pause animation based on visibility in viewport
	const observer = new IntersectionObserver(entries => {
		if (entries[0].isIntersecting) {
			animation.play = true;
		} else {
			animation.play = false;
			animation.currentTime = 0;
		}
	});
	observer.observe(circle);

	// Ensuring animation plays if already in the viewport on load
	const circlePosition = circle.getBoundingClientRect();
	if (isInViewport(circlePosition)) {
		animation.play = true;
	}
}

// Helper function to check if an element is in the viewport
function isInViewport(position) {
	return position.top >= 0 && position.bottom <= window.innerHeight;
}


// Function to initialise navigation functionality on the site
function initialiseNavigation() {
	// This array holds the different sections of the website for navigation purposes
	const sections = ["Home", "Theory", "Gallery", "Quizzes"];
	let currentSectionIndex = 0; // Tracks the current section index
	const prevButton = document.querySelector('.prev-button sl-button'); // Button to navigate to the previous section
	const nextButton = document.querySelector('.next-button sl-button'); // Button to navigate to the next section

	if (!prevButton || !nextButton) return;

	// Setting up navigation links
	const navLinks = document.querySelectorAll('nav a, header > a');

	// Adding click sound effects and navigation functionality to navigation links
	navLinks.forEach(link => {
		link.addEventListener('click', (event) => {
		  playSound();
		  const targetId = event.target.id.replace('nav-', '').toLowerCase();
		  navigateToSection(targetId);
		});
	});

	document.getElementById('nav-logo-text').addEventListener('click', () => {
		playSound();
		navigateToSection('home');
	});

	// Adding functionality to previous button for navigation
	prevButton.addEventListener('click', () => {
		if (currentSectionIndex > 0) {
			animateSections(currentSectionIndex, currentSectionIndex - 1);
			currentSectionIndex--;
			updateNavigation();
		}
	});

	// Adding functionality to next button for navigation
	nextButton.addEventListener('click', () => {
		if (currentSectionIndex < sections.length - 1) {
			animateSections(currentSectionIndex, currentSectionIndex + 1);
			currentSectionIndex++;
			updateNavigation();
		}
	});

	// Function to navigate to a specific section with header links
	function navigateToSection(targetId) {
		const targetIndex = sections.findIndex(section => section.toLowerCase() === targetId);
		if (targetIndex >= 0 && targetIndex !== currentSectionIndex) {
			animateSections(currentSectionIndex, targetIndex);
			currentSectionIndex = targetIndex;
			updateNavigation();
		}
	}

	// Function to animate transitions between sections
	function animateSections(currentIndex, nextIndex) {
		const currentSection = document.getElementById(sections[currentIndex]);
		const nextSection = document.getElementById(sections[nextIndex]);

		gsap.timeline()
			.to(currentSection, {
				left: currentIndex < nextIndex ? '-105%' : '105%',
				duration: 0.5,
				ease: 'power2.out'
			})
			.fromTo(nextSection, {
					left: currentIndex < nextIndex ? '105%' : '-105%'
				}, {
					left: '0%',
					duration: 0.5,
					ease: 'power2.inOut'
				},
				"-=0.4"
			);

		document.body.style.overflowY = "auto";
	}

	// Function to animate the background colour transition
	function animateBackgroundTo(targetColour) {
		gsap.to(document.body, {
			background: targetColour,
			duration: 0.5,
			ease: 'power1.out'
		});
	}

	// Audio setup for button click sound effect
	const buttonSoundEffect = new Audio('audio/button.wav');

	// Attaching click sound effect to gallery button
	document.querySelector('.prev-button sl-button').addEventListener('click', playSound);

	// Attaching click sound effect to theories button
	document.querySelector('.next-button sl-button').addEventListener('click', playSound);

	// Function to play sound effects
	function playSound() {
		buttonSoundEffect.currentTime = 0;
		buttonSoundEffect.play();
		buttonSoundEffect.addEventListener('ended', () => {
			buttonSoundEffect.pause();
		});
	}

	// Function to update the navigation state
	function updateNavigation() {
		// Get references to the body and header elements
		const bodyElement = document.body;
		const headerElement = document.querySelector('header');
		// Get all navigation links
		const navLinks = document.querySelectorAll('nav a');

		// Attached sound to every navigation link when clicked
		navLinks.forEach(link => {
			link.addEventListener('click', playSound);
		});

		// Loop through each section and apply styles based on the current section
		sections.forEach((section, index) => {
			const element = document.querySelector('#' + section);
			const navLink = navLinks[index];
			if (!element) return;

			if (index === currentSectionIndex) {
				element.style.display = 'block';
				navLink.classList.add('active-link'); // Highlight the active nav link

				// Apply the background colour for the gallery section
				if (section === "Gallery") {
					bodyElement.classList.add('background-gallery-colour');
					headerElement.classList.add('background-gallery-colour');
				}

				//Applies a soft fading animation for each background colour so it isn't as jarring
				if (sections[currentSectionIndex] === "Gallery") {
					animateBackgroundTo("#FBAE77");
				} else if (sections[currentSectionIndex] === "Quizzes") {
					animateBackgroundTo("#885038");
				} else {
					animateBackgroundTo("linear-gradient(#996047, #ECAE8E)");
				}

				// Reference to the logo text element.
				const logoText = document.querySelector('.logo-text');

				// If the section is "Gallery", it adds a specific class to change the logo colour so the contrast is higher and more readable
				// Otherwise, it removes that class to revert the logo colour
				if (section === "Gallery") {
					logoText.classList.add('gallery-colour');
				} else {
					logoText.classList.remove('gallery-colour');
				}

			} else {
				element.style.display = 'none';
				navLink.classList.remove('active-link'); // Remove highlight from inactive nav link

				// Remove the background colour if not in the gallery section
				if (section === "Gallery") {
					bodyElement.classList.remove('background-gallery-colour');
					headerElement.classList.remove('background-gallery-colour');
				}
			}
		});

		// Helper function to position the navigation highlight based on the active link
		function positionHighlight() {
			const highlight = document.getElementById('highlight');
			const activeLink = document.querySelector('nav a.active-link');
			if (highlight && activeLink) {
				gsap.to(highlight, {
					duration: 0.3,
					width: activeLink.offsetWidth + 20,
					left: activeLink.offsetLeft - 10,
					top: activeLink.offsetTop - 5,
					height: activeLink.offsetHeight + 5,
					ease: "power1.out"
				});
			}
		}

		// Toggle the visibility of navigation buttons based on the current section
		toggleButtonVisibility(prevButton, currentSectionIndex > 0);
		toggleButtonVisibility(nextButton, currentSectionIndex < sections.length - 1);

		// Update the labels for previous and next buttons
		updateButtonLabels();

		// Position the navigation highlight after updating the navigation
		positionHighlight();
	}

	// Function to toggle the visibility of the button based on a condition
	function toggleButtonVisibility(button, isVisible) {
		const container = button.closest('.prev-button') || button.closest('.next-button');
		if (!container) return;

		if (isVisible) {
			container.style.opacity = '1';
			container.style.pointerEvents = 'auto';
		} else {
			container.style.opacity = '0';
			container.style.pointerEvents = 'none';
		}
	}

	// Function to update the labels on the navigation buttons based on the current section
	function updateButtonLabels() {
		if (currentSectionIndex > 0) {
			prevButton.innerText = sections[currentSectionIndex - 1].toUpperCase();
		}
		if (currentSectionIndex < sections.length - 1) {
			nextButton.innerText = sections[currentSectionIndex + 1].toUpperCase();
		}
	}

	// This calls the updateNavigation function to set initial states and styles
	updateNavigation();
}

// Function to animate theory boxes on scroll, for some reason it does not play unless viewport is resized!
function animateTheoryBoxesOnScroll() {
	// Initial state for the theory boxes
	gsap.set('.theory-box', {
		autoAlpha: 0,
		scale: 1
	});

	// Loop through each theory-box
	gsap.utils.toArray('.theory-box').forEach(box => {
		gsap.to(box, {
			autoAlpha: 1, // Fade in to full opacity
			scale: 1, // Scale to original size
			duration: 1, // Animation duration
			ease: 'power2.out', // Easing for a smooth animation
			scrollTrigger: {
				trigger: box, // Element to use as trigger
				start: 'top 50%', // Starts when the top 20% of the box enters the viewport
				toggleActions: 'play none none reverse'
			}
		});
	});
}

// Mouse enter event for navigation links to animate the navigation highlight for hovering
document.querySelectorAll('nav a').forEach(link => {
	link.addEventListener('mouseenter', function() {
		const activeLink = link; // Use the current link as the active link
		gsap.to("#highlight", {
			duration: 0.3,
			width: activeLink.offsetWidth + 20,
			left: activeLink.offsetLeft - 10,
			top: activeLink.offsetTop - 5,
			height: activeLink.offsetHeight + 5,
			ease: "power1.out",
			onStart: function() {
				document.querySelectorAll('nav a').forEach(innerLink => {
					innerLink.classList.remove('active-link');
				});
				link.classList.add('active-link');
			}
		});
	});
});

// Set initial position and dimensions of the navigation highlight
gsap.set("#highlight", {
	width: document.querySelector('#nav-Home').offsetWidth + 40,
	left: document.querySelector('#nav-Home').offsetLeft - 20,
	top: document.querySelector('#nav-Home').offsetTop - 5,
	height: document.querySelector('#nav-Home').offsetHeight + 10
});


// Animation for the text content when it enters the viewport
gsap.from(".text-content", {
	x: "-100%", // Starts from 100% left (outside of the viewport)
	duration: 1,
	ease: "power2.out",
	scrollTrigger: {
		trigger: ".colour-theory-section",
		start: "top center", // Begins when the top of the section reaches the center of the viewport
		toggleActions: "play none none reverse" //Plays again if it reappears into viewport by reversing animation
	}
});

// Animation for the image content when it enters the viewport
gsap.from(".image-content", {
	x: "100%", // Starts from 100% right (outside of the viewport)
	duration: 1,
	ease: "power2.out",
	scrollTrigger: {
		trigger: ".colour-theory-section",
		start: "top center", // Begins when the top of the section reaches the center of the viewport
		toggleActions: "play none none reverse"
	}
});

// Function to initialise the gallery with default settings
function initialiseGallery() {
	updateGalleryAndDescription('complementary');
	bindEventListeners();
	highlightFirstThumbnail();
}

// Function to bind event listeners for the gallery
function bindEventListeners() {
	// Get references to the gallery elements
	const carousel = document.querySelector('.carousel-thumbnails'); // DOM element references related to the image carousel
	carousel.addEventListener('sl-change', (event) => { // The container that holds thumbnails
		updateActiveThumbnail(event.detail.index); //The description text element
	});
	const scroller = document.querySelector('.thumbnails__scroller');
	const thumbnails = document.querySelectorAll('.thumbnails__image');
	const dropdown = document.querySelector('sl-dropdown');
	const dropdownButton = dropdown.querySelector('sl-button');

	// Attach click event to thumbnails scroller
	scroller.addEventListener('click', e => {
		const target = e.target;

		if (target.matches('.thumbnails__image')) {
			const index = [...thumbnails].indexOf(target);
			carousel.goToSlide(index);
		}
	});

	// Event listener to change active thumbnail based on the current slide
	carousel.addEventListener('sl-slide-change', e => {
		const slideIndex = e.detail.index;

		[...thumbnails].forEach((thumb, i) => {
			thumb.classList.toggle('active', i === slideIndex);
			if (i === slideIndex) {
				thumb.scrollIntoView({
					block: 'nearest'
				});
			}
		});
	});

	// Audio effect for dropdown open action
	const dropdownOpenSoundEffect = new Audio('audio/open.wav');

	// Play sound effect when the dropdown is shown
	dropdown.addEventListener('sl-show', () => {
		if (dropdownOpenSoundEffect.paused) { // Check if the audio is not playing
			dropdownOpenSoundEffect.currentTime = 0; // Reset the audio to start
			dropdownOpenSoundEffect.play();
		}
	});

	// Listen for changes on the dropdown menu
	dropdown.addEventListener('sl-select', e => {
		const selectedValue = e.detail.item.value;
		updateGalleryAndDescription(selectedValue);
		dropdownButton.textContent = e.detail.item.textContent;
	});

	// Selects the thumbnails container element and initialise variables for scrolling
	const scrollContainer = document.querySelector('.thumbnails');
	let isDown = false;
	let startX;
	let scrollLeft;

	// I added an event listener to enable dragging on the thumbnail scroll container
	scrollContainer.addEventListener('mousedown', (e) => {
		isDown = true;
		scrollContainer.classList.add('active');
		startX = e.pageX - scrollContainer.offsetLeft;
		scrollLeft = scrollContainer.scrollLeft;
	});

	// I added this to handle the mouse leaving the container
	scrollContainer.addEventListener('mouseleave', () => {
		isDown = false;
		scrollContainer.classList.remove('active');
	});

	// I added this to handle the mouse release event
	scrollContainer.addEventListener('mouseup', () => {
		isDown = false;
		scrollContainer.classList.remove('active');
	});

	// This is to handle the mouse movement for scrolling
	scrollContainer.addEventListener('mousemove', (e) => {
		if (!isDown) return;
		e.preventDefault();
		const x = e.pageX - scrollContainer.offsetLeft;
		const walk = (x - startX) * 3; // 3 is the scroll speed
		scrollContainer.scrollLeft = scrollLeft - walk;
	});
}

// Function to highlight the first thumbnail in the carousel by default when page is first loaded
function highlightFirstThumbnail() {
	const firstThumbnail = document.querySelector('.thumbnails__image');
	if (firstThumbnail) {
		firstThumbnail.classList.add('active');
	}
}

// Function to synchronize the carousel with the thumbnails
function syncCarouselWithThumbnails() {
	const thumbnails = document.querySelectorAll('.thumbnails__image');
	const carousel = document.querySelector('.carousel-thumbnails');

	// Update thumbnail highlight when carousel slide changes
	carousel.addEventListener('sl-after-show', (e) => {
		const index = e.detail.index;
		thumbnails.forEach((thumb, idx) => {
			if (idx === index) {
				thumb.classList.add('active');
			} else {
				thumb.classList.remove('active');
			}
		});
	});

	// Change carousel slide when thumbnail is clicked
	thumbnails.forEach((thumbnail, index) => {
		thumbnail.addEventListener('click', () => {
			carousel.start(index); // Switch to the appropriate slide
		});
	});
}

// Function to update the gallery and description based on selected category
function updateGalleryAndDescription(category) {
	const carousel = document.querySelector('.carousel-thumbnails');
	const thumbnailsContainer = document.querySelector('.thumbnails__scroller');
	const description = document.querySelector('.description');

	// Define data based on category
	const data = {
		'complementary': {
			images: [{
				alt: "Image 1 for Complementary",
				src: "/images/complementary1.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}, {
				alt: "Image 2 for Complementary",
				src: "/images/complementary2.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}, {
				alt: "Image 3 for Complementary",
				src: "/images/complementary3.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}],
			description: "Here are some examples of a complementary colour scheme; blue and orange. Note that the striking contrast between these two hues is naturally prevalent in the world around us.<br><br> The serenity of pure blue skies juxtaposed with the warmth of orange clouds during sunsets, the vibrancy of balloons floating against a clear azure backdrop, or the vast expanse of the ocean against a peach-hued sky.<br><br> Each of these instances showcases the powerful visual impact and inherent balance achieved when these two colours come together."
		},
		'monochromatic': {
			images: [{
				alt: "Image 1 for monochromatic",
				src: "/images/monochromatic1.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}, {
				alt: "Image 2 for monochromatic",
				src: "/images/monochromatic2.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}, {
				alt: "Image 3 for monochromatic",
				src: "/images/monochromatic3.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}],
			description: "Here are some examples of a monochromatic colour scheme, varying intensities of blue. Observe the natural manifestations of this palette in the visuals presented. <br><br> The tranquillity of towering white clouds set against a brilliant blue canvas, the mystique of the oceanic depths where a school of sharks surrounds a diver, all bathed in varying shades of blue, or the mesmerizing alleys of a town, where every wall, step, and door resonates with the harmonious touch of blues. <br><br> Each of these images highlights the serene continuity and innate harmony that emerges when multiple intensities of a single colour gracefully converge."
		},
		'analogous': {
			images: [{
				alt: "Image 1 for analogous",
				src: "/images/analogous1.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}, {
				alt: "Image 2 for analogous",
				src: "/images/analogous2.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}, {
				alt: "Image 3 for analogous",
				src: "/images/analogous3.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}],
			description: "Here are some examples of an analogous colour scheme: orange, yellow, and red. The seamless blending of these hues creates a radiant display, much like the image of freshly sliced oranges against a warm backdrop, where the fiery reds meld effortlessly with the sunny yellows. <br><br> This harmony can also be visualized in a golden-hued sunrise slowly transitioning into a brilliant crimson or the sight of autumn leaves that vary from amber to deep scarlet, fluttering in unison. <br><br> Each portrayal encapsulates the lively yet cohesive essence that such closely related colours impart when combined."
		},
		'split-complimentary': {
			images: [{
				alt: "Image 1 for split-complimentary",
				src: "/images/split-complimentary1.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}, {
				alt: "Image 2 for split-complimentary",
				src: "/images/split-complimentary2.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}, {
				alt: "Image 3 for split-complimentary",
				src: "/images/split-complimentary3.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}],
			description: "Here are some examples of a split complementary colour scheme: orange, yellow, and blue. This approach uses one base colour and two secondary colours adjacent to its complementary, providing a rich contrast and harnessing some of the harmony seen in analogous hues. <br><br> The lush vibrancy of a painted pear, bursting with shades of orange and radiant yellow against a deep blue backdrop, illustrates this beautifully. Similarly, the zesty slices of grapefruit and lemon laid upon a cool blue surface exemplify the dynamic interplay of these three shades. Finally, the captivating artwork of a woman enveloped by a dance of orange and yellow flames, set against the tranquillity of a blue environment, epitomizes the exquisite balance and visual appeal this colour scheme can offer. <br><br> Each of these instances underlines the aesthetic potency and inherent equilibrium achieved when these three colours intertwine."
		},
		'triadic': {
			images: [{
				alt: "Image 1 for triadic",
				src: "/images/triadic1.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}, {
				alt: "Image 2 for triadic",
				src: "/images/triadic2.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}, {
				alt: "Image 3 for triadic",
				src: "/images/triadic3.png" //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
			}],
			description: "Here are some examples of a triadic colour scheme: red, yellow, and blue. These three colours, evenly spaced around the colour wheel, present a harmonious blend of vibrancy and balance. <br><br> The vivid yellow of a large, blooming flower, set against a rustic blue backdrop, draws attention to its rich and radiant hue. Similarly, the brilliant red of a mug stands out boldly beside a luscious strawberry resting on a yellow plate. Then, there's the iconic image of Superman, his blue suit complemented perfectly by his red cape and the symbolic yellow and red emblem on his chest. <br><br> Each of these instances exemplifies the dynamic yet cohesive visual impact achieved when these three colours unite."
		},


	};

	const categoryData = data[category];

	// Clear previously set classes from the colour-circles div
	const colourCirclesDiv = document.querySelector('.colour-circles');
	colourCirclesDiv.className = 'colour-circles';

	// Apply the new category as a class
	colourCirclesDiv.classList.add(category);

	// Determine how many circles to show based on the category
	let numOfCircles = 2; // default for complementary
	switch (category) {
		case 'monochromatic':
		case 'analogous':
		case 'split-complimentary':
		case 'triadic':
			numOfCircles = 3;
			break;
	}

	// Hide or show circles accordingly
	const galleryCircles = document.querySelectorAll('.gallery-circle');
	galleryCircles.forEach((circle, index) => {
		if (index < numOfCircles) {
			circle.style.display = 'inline-block';
		} else {
			circle.style.display = 'none';
		}
	});

	// Clear previous carousel items and thumbnails
	carousel.innerHTML = '';
	thumbnailsContainer.innerHTML = '';

	// Add new carousel items and thumbnails
	categoryData.images.forEach(img => {
		// Append to carousel
		const carouselItem = document.createElement('sl-carousel-item');
		const image = document.createElement('img');
		image.alt = img.alt;
		image.src = img.src;
		carouselItem.appendChild(image);
		carousel.appendChild(carouselItem);

		// Append to thumbnails
		const thumbnail = document.createElement('img');
		thumbnail.alt = `Thumbnail for ${img.alt}`;
		thumbnail.src = img.src;
		thumbnail.classList.add('thumbnails__image');
		thumbnailsContainer.appendChild(thumbnail);
	});

	// Update description using innerHTML to render <br> tags
	description.innerHTML = categoryData.description;

	// Re-bind the event listeners to the newly created elements
	bindEventListeners();
}

// Initialisation code
initialiseGallery();

//listens for a click on the "Quiz me!" button and toggles the visibility of the "Are-You-Ready" and "Actual-Quiz" sections accordingly
document.querySelector('.quiz-button').addEventListener('click', function() {
	document.querySelector('.Are-You-Ready').style.display = 'none';
	document.querySelector('.Actual-Quiz').style.display = 'block';
});


// Quiz data
const quizData = [{
	question: "What type of colour combination is this?",
	image: "/images/quiz1.png", //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
	options: ["Analogous", "Triadic", "Monochromatic", "Complementary"],
	answer: "Analogous"
}, {
	question: "Based on this image, which statement is true about the colours used?",
	image: "/images/quiz2.png", //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
	options: ["They create a high-contrast visual effect.", "They are often found in nature and are harmonious.", "They represent a cool and warm colour contrast.", "They are visually striking and often used in warning signs."],
	answer: "They are often found in nature and are harmonious."
}, {
	question: "What does this colour scheme predominantly feature?",
	image: "/images/quiz3.png", //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
	options: ["Warm Colours", "Cool Colours", "Complementary Colours", "Neutral Colours"],
	answer: "Cool Colours"
}, {
	question: "What effect does this colour combination typically have in design?",
	image: "/images/quiz4.png", //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
	options: ["Soothing and Calming", "Vibrant and Energetic", "Elegant and Sophisticated", "Minimalist and Subdued"],
	answer: "Vibrant and Energetic"
}, {
	question: "In this image, which colour theory concept is being illustrated?",
	image: "/images/quiz5.png", //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
	options: ["Analogous colours", "Warm and cool colours", "Triadic colour scheme", "Colour saturation"],
	answer: "Triadic colour scheme"
}, ];

// These variables keep track of the quiz progress.
let currentQuestionIndex = 0; // Index of the current question in the quiz.
let correctAnswersCount = 0; // Counter for the number of correct answers.

// Function to display a quiz question based on its index
function displayQuestion(index) {
	const questionData = quizData[index];
	document.getElementById("display-question").textContent = questionData.question;
	document.getElementById("quiz-image").src = questionData.image;

	// Update the question number
	document.getElementById("question-number").textContent = index + 1;

	// Update progress bar
	const progressBar = document.querySelector('sl-progress-bar');
	progressBar.value = ((index + 1) / quizData.length) * 100; // Sets the progress value as a percentage

	// Update options
	["option-one-label", "option-two-label", "option-three-label", "option-four-label"].forEach((id, idx) => {
		document.getElementById(id).textContent = questionData.options[idx];
	});
}

// This function is responsible for handling the user's selected answer.
function selectOption(selectedOption) {
	// Retrieves the label element of the selected answer.
	const selectedAnswerElement = document.getElementById(selectedOption + "-label");

	// I included a check to ensure that a user has selected an option. If not, it shows an alert.
	if (!selectedAnswerElement) {
		alert("Please select an option before proceeding.");
		return;
	}

	// Retrieves the text content of the selected answer.
	const selectedAnswer = selectedAnswerElement.textContent;

	// Retrieves the current question from the quizData array using the currentQuestionIndex.
	const currentQuestion = quizData[currentQuestionIndex];

	// If the selected answer is correct, I increment the correctAnswersCount.
	if (selectedAnswer === currentQuestion.answer) {
		correctAnswersCount++;
	}

	// If there are more questions, I increase the currentQuestionIndex to move to the next question.
	// Otherwise, the endQuiz function is called to end the quiz.
	if (currentQuestionIndex + 1 < quizData.length) {
		currentQuestionIndex++;
		displayQuestion(currentQuestionIndex);
	} else {
		endQuiz();
	}
}

// This function is called when the quiz is finished.
function endQuiz() {
	// Hides the quiz and shows the results page.
	document.querySelector('.Actual-Quiz').style.display = 'none';
	document.querySelector('.Results-Page').style.display = 'flex'; // or 'flex'
	document.querySelector('.Results-Page').style.visibility = 'visible';
	document.querySelector('.Results-Page').style.opacity = '1';

	// Updates the results page with the number of correct and wrong answers.
	document.getElementById('final-right-answers').textContent = correctAnswersCount;
	document.getElementById('final-wrong-answers').textContent = quizData.length - correctAnswersCount;

	// Calculates the grade percentage.
	const gradePercentage = (correctAnswersCount / quizData.length) * 100;
	document.getElementById('final-grade-percentage').textContent = gradePercentage.toFixed(2) + "%";

	// Based on the grade, I update the message and image to reflect the user's performance.
	const scoreMessageElement = document.getElementById('score-message');
	const scoreImageElement = document.getElementById('score-image');

	// Sound effects for pass or fail.
	const FailSoundEffect = new Audio('audio/fail.wav');
	const SuccessSoundEffect = new Audio('audio/success.wav');

	// Depending on the score, I set different messages, images, and play appropriate sound effects.
	if (gradePercentage >= 100) {
		scoreMessageElement.textContent = "Perfect score! Well done!";
		scoreImageElement.src = "/images/results1.png"; //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
		SuccessSoundEffect.play(); // Play the success sound effect
	} else if (gradePercentage >= 50) {
		scoreMessageElement.textContent = "Good job! You have a decent understanding.";
		scoreImageElement.src = "/images/results2.png"; //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
	} else {
		scoreMessageElement.textContent = "Keep practicing! You'll get better.";
		scoreImageElement.src = "/images/results3.png"; //--Source: https://www.pinterest.com.au/alecrimrhosmaryn/web-design-images/
		FailSoundEffect.play(); // Play the fail sound effect
	}

	// Resets all the options for a potential quiz retake.
	document.querySelectorAll('.quiz-option').forEach(option => {
		option.checked = false;
	});
}

// This function resets the quiz to its initial state.
function resetQuiz() {
	currentQuestionIndex = 0;
	correctAnswersCount = 0;
	displayQuestion(currentQuestionIndex);

	// This will hide the results page and make the quiz visible again.
	document.querySelector('.Results-Page').style.display = 'none';
	document.querySelector('.Results-Page').style.opacity = '0';
	document.querySelector('.Are-You-Ready').style.display = 'none';
	document.querySelector('.Actual-Quiz').style.display = 'block';

	// I use GSAP for a smooth transition effect when resetting the quiz
	gsap.fromTo(".Actual-Quiz", {
		opacity: 0,
		scale: 0.95
	}, {
		opacity: 1,
		scale: 1,
		duration: 0.7,
		ease: "power3.out",
		onComplete: function() {
			// This will run after the animation completes
			displayQuestion(currentQuestionIndex);
		}
	});
}

// This function is used to navigate back to the quiz introduction page.
function goToQuizPage() {
	document.querySelector('.Results-Page').style.display = 'none';
	document.querySelector('.Actual-Quiz').style.display = 'none';
	document.querySelector('.Are-You-Ready').style.display = 'flex';
}

// Event listeners for the "Retake Quiz" and "Back to Quiz" buttons.
document.getElementById('retake-quiz-button').addEventListener('click', resetQuiz);
document.getElementById('back-to-quiz-button').addEventListener('click', goToQuizPage);

// This function initiates the start of the quiz.
function startQuiz() {
	console.log("Welcome to my colour theory website :)");

	// Ensure that the Actual-Quiz section is visible but scaled down and transparent
	document.querySelector('.Actual-Quiz').style.display = 'block';

	// GSAP animation to transition in the Actual-Quiz section
	gsap.fromTo(".Actual-Quiz", {
		opacity: 0,
		scale: 0.95
	}, {
		opacity: 1,
		scale: 1,
		duration: 0.7,
		ease: "power3.out",
		onComplete: function() {
			// Display the first question once the animation is complete
			displayQuestion(currentQuestionIndex);
		}
	});
}

// Event listener for the button to start the quiz.
document.querySelector('.quiz-button').addEventListener('click', startQuiz);