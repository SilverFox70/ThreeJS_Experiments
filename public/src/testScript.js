$(document).ready(function() {
  // Create a new div element
  var newDiv = $("<div>");

  // Set the background color of the new div to light blue
  newDiv.css("background-color", "lightblue");

  // Create a new paragraph element and add it to the new div
  var newParagraph = $("<p>").text("This is a new div that has been appended by jQuery once the page loaded.");
  newDiv.append(newParagraph);

  // Append the new div to the end of the body element
  $("body").append(newDiv);
});
