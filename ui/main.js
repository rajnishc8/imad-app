console.log('Loaded!');

//Change the text of the main-text div
var element = document.getElementById('main-text');
var button  = document.getElementById('counter');
var counter = 0;

button.onclick = function ()
{
    // make a request to the counter endpoint
    
    // capture the response and store it in a variable
    
    //render the variable in the correct span
    counter = counter +1;
    var span = document.getElementById('count');
    span.innerHTML = counter.toString();
    
   var interval = setInterval(moveRight, 50);
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
