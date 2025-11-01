/* sends a POST request with our wish to the server when
 * the submit button is pressed, or the user presses the enter
 * key in the text input box.
 */

const form = document.getElementById('wishForm');
const wish = document.getElementById('wish');
const song = document.getElementById('songInput');
const wordsContainer = document.getElementById('words');

/*
 * listen for events on the form, rather than the button,
 * so that both the button press and pressing enter work to
 * submit the form.
 */
form.addEventListener('submit', async event => {
  
  // do this first so the page doesn't refresh!
  event.preventDefault();

  // these are are Request options:
  // - the type of request is POST because we want to send data to the server
  // - the data we are sending is JSON, so we need to add a content-type header
  // - and encode the relevant data as JSON
  console.log('Clicking here');
  console.log("Songs value" + song.value);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      song: song.value
    })



  };
  
  // send the request and await a response
  const response = await fetch("/external-data", options);
  const lsong = await response.json();

  var numf = lsong.response.referents.length
  if (numf == 0) {
    console.log("There are no fragments for this song.");
  } else {
      for (var i = 0; i < numf; i++) {
      //Getting all the fragments of this song
        console.log(lsong.response.referents[i].fragment);
        //Adding each fragment to a list of words
        
        var fragment = lsong.response.referents[i].fragment;
        var cell = document.createElement('div');
        cell.className = 'word-cell';
        cell.textContent = fragment;
        // Add click behavior
        cell.addEventListener('click', () => {
          console.log('You clicked:', fragment);
        // You can do more here (highlight, fetch data, etc.)
          cell.style.backgroundColor = '#b0d4ff';
      });

        // Add cell to grid container
        wordsContainer.appendChild(cell);
      }
  }
  song.innerText = JSON.stringify(lsong);
  console.log(lsong);
  //const response = await fetch("/wish", options);
  
  // parse the response into JSON
  //const json = await response.json();
  //console.log(json);

  // clear the wish value!
  songInput.value = "";
});