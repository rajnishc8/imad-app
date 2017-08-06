console.log('Loaded!');

//Change the text of the main-text div
var element = document.getElementById('main-text');
var button  = document.getElementById('counter');

button.onclick = function ()
{
    // make a request to the counter endpoint
    // Create a request object
    var request = new XMLHttpRequest();
    
    // capture the response and store it in a variable
    request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  //render the variable in the correct span
                  var counter = request.responseText;
                  var span = document.getElementById('count');
                  span.innerHTML = counter.toString();
                  //submit.value = 'Sucess!';
              } else if (request.status === 403) {
                  //submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  //submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  //submit.value = 'Login';
              }
              //loadLogin();
          }  
          // Not done yet
        };
    
    //Make the request
    request.open('GET', 'http://rajnishc8.imad.hasura-app.io/counter', true);
    request.send(null);
}

element.innerHTML = 'New Value';

//Move the image
var img = document.getElementById('madi');
var marginLeft = 0;
function moveRight()
{ 
  marginLeft = marginLeft + 5;
  img.style.marginLeft = marginLeft + 'px';
}

img.onclick = function ()
{
   var interval = setInterval(moveRight, 50);
}
