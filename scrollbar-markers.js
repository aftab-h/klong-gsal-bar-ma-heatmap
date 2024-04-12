document.addEventListener("DOMContentLoaded", function () {
    const containers = document.querySelectorAll('.container');
  
    containers.forEach(function(container) {
      const containerHeight = container.offsetHeight;
      const scrollMarker = container.querySelector('.scroll-marker');
      const colorfulStuff = container.querySelectorAll('.text-container span.highlight');
  
      // Function to create markers
      function createMarkers() {
        const containerScrollHeight = container.scrollHeight;
  
        // Clear existing markers
        scrollMarker.innerHTML = '';
  
        // Iterate over each highlighted span and create markers
        colorfulStuff.forEach(function (span) {
          const spanTop = span.offsetTop;
          const spanBottom = spanTop + span.offsetHeight;
  
          const markerTop = Math.ceil(spanTop * containerHeight / containerScrollHeight);
          const markerBottom = Math.ceil(spanBottom * containerHeight / containerScrollHeight);
  
          // Create marker element
          const markerElement = document.createElement("span");
          markerElement.style.backgroundColor = '#f65e5a'; // Choose the correct color
          markerElement.style.top = markerTop + "px";
          markerElement.style.height = (markerBottom - markerTop) + "px";
          scrollMarker.appendChild(markerElement);
        });
      }
  
      // Initial creation of markers
      createMarkers();
  
      // Recalculate markers on container scroll
      container.addEventListener('scroll', function () {
        createMarkers();
      });
    });
  });
  