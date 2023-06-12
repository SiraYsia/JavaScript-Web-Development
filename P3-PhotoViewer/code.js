// Global variables
let photos = [];
let currentPhotoIndex = 0;
let slideShowInterval;
let photosLoaded = false;


// Helper function to create array with photo names
function createPhotoArray(folderName, commonName, startNumber, endNumber) {
  const photoArray = [];
  for (let i = startNumber; i <= endNumber; i++) {
    photoArray.push(`${folderName}${commonName}${i}.jpg`);
  }
  return photoArray;
}

// Helper function to display current photo
function displayCurrentPhoto() {
  document.querySelector("#photo-container img").src = photos[currentPhotoIndex];
  document.querySelector("#photo-display-input").value = photos[currentPhotoIndex];
}

// Helper function to display current photo
function displayCurrentPhoto() {
  document.querySelector("#photo-container img").src = photos[currentPhotoIndex];
  document.querySelector("#photo-display-input").value = photos[currentPhotoIndex];
}

// Event listener for Load Photos button
document.querySelector("#load-photos-btn").addEventListener("click", () => {

  const folderName = document.querySelector("#folder-name-input").value;
  const commonName = document.querySelector("#common-name-input").value;
  const startNumber = Number(document.querySelector("#start-photo-input").value);
  const endNumber = Number(document.querySelector("#end-photo-input").value);

  // Check if startNumber is greater than endNumber
  if (startNumber >= endNumber) {
    document.querySelector("#system").textContent = "Error: Invalid Range";
    return;
  } 
  document.querySelector("#system").textContent = "Photo Viewer System";

  photos = createPhotoArray(folderName, commonName, startNumber, endNumber);
  currentPhotoIndex = 0;

  displayCurrentPhoto();
  photosLoaded = true;

  // Add click event listener to photo element
  const photoElement = document.querySelector("#photo-container img");
  photoElement.addEventListener("click", () => {
    // Call function that handles Next Photo button click event
    currentPhotoIndex++;
    if (currentPhotoIndex >= photos.length) {
      currentPhotoIndex = 0;
    }
    displayCurrentPhoto();
  });

});


// Event listener for Next Photo button
document.querySelector("#next-photo-btn").addEventListener("click", () => {
  if (!photosLoaded) {
    document.querySelector("#System").textContent = "Error: You must load data first";
    return;
  }

  currentPhotoIndex++;
  if (currentPhotoIndex >= photos.length) {
    currentPhotoIndex = 0;
  }
  displayCurrentPhoto();
});


// Event listener for Previous Photo button
document.querySelector("#prev-photo-btn").addEventListener("click", () => {
  if (!photosLoaded) {
    document.querySelector("#System").textContent = "Error: You must load data first";
    return;
  }

  currentPhotoIndex--;
  if (currentPhotoIndex < 0) {
    currentPhotoIndex = photos.length - 1;
  }

  displayCurrentPhoto();
});

// Event listener for First Photo button
document.querySelector("#first-photo-btn").addEventListener("click", () => {
  if (!photosLoaded) {
    document.querySelector("#System").textContent = "Error: You must load data first";
    return;
  }


  currentPhotoIndex = 0;
  displayCurrentPhoto();
});

// Event listener for Last Photo button
document.querySelector("#last-photo-btn").addEventListener("click", () => {
  if (!photosLoaded) {
    document.querySelector("#System").textContent = "Error: You must load data first";
    return;
  }

  currentPhotoIndex = photos.length - 1;
  displayCurrentPhoto();
});

// Event listener for SlideShow button
document.querySelector("#slideshow-btn").addEventListener("click", () => {
  if (!photosLoaded) {
    document.querySelector("#System").textContent = "Error: You must load data first";
    return;
  }

  clearInterval(slideShowInterval);
  slideShowInterval = setInterval(() => {
    currentPhotoIndex++;
    if (currentPhotoIndex >= photos.length) {
      currentPhotoIndex = 0;
    }
    displayCurrentPhoto();
  }, 1000);
});

// Event listener for Random SlideShow button
document.querySelector("#random-slideshow-btn").addEventListener("click", () => {
  if (!photosLoaded) {
    document.querySelector("#System").textContent = "Error: You must load data first";
    return;
  }

  clearInterval(slideShowInterval);
  slideShowInterval = setInterval(() => {
    currentPhotoIndex = Math.floor(Math.random() * photos.length);
    displayCurrentPhoto();
  }, 2000);
});



// Event listener for Stop SlideShow button
document.querySelector("#stop-slideshow-btn").addEventListener("click", () => {
  clearInterval(slideShowInterval);
});
const resetBtn = document.querySelector('input[type="reset"]');
resetBtn.addEventListener('click', function() {
  document.querySelector('#folder-name-input').value = 'umcp/';
  document.querySelector('#common-name-input').value = 'College';
  document.querySelector('#start-photo-input').value = '';
  document.querySelector('#end-photo-input').value = '';
  document.querySelector('#json-file-url-input').value = '';
  document.querySelector('#photo-display-input').value = '';
});

// Event listener for Load JSON button
document.querySelector("#load-json-btn").addEventListener("click", () => {
    const jsonFileUrl = document.querySelector("#json-file-url-input").value;
  
    // Fetch JSON data
    fetch(jsonFileUrl)
      .then(response => response.json())
      .then(data => {
        // Extract imageURL property from JSON data
        const imageURLs = data.images.map(item => item.imageURL);
  
        // Initialize photo array and current photo index
        photos = imageURLs;
        currentPhotoIndex = 0;
  
        // Display first photo
        displayCurrentPhoto();
      })
      .catch(error => {
        console.error("Error loading JSON file:", error);
      });
  });
  