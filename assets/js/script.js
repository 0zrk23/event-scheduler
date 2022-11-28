// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.


var hour9El = $('#hour-9');
var hour10El = $('#hour-10');
var hour11El = $('#hour-11');
var hour12El = $('#hour-12');
var hour13El = $('#hour-13');
var hour14El = $('#hour-14');
var hour15El = $('#hour-15');
var hour16El = $('#hour-16');
var hour17El = $('#hour-17');
var hour18El = $('#hour-18');
var hour19El = $('#hour-19');
var timeBlockEl = $('.time-block')
var saveBtnEl = $('.saveBtn');
var currentTimeEl = $('#currentTime');
var dateTime = dayjs();
var hour = dateTime.hour();
var savedEvents = [];
var savedDate = dayjs();
var saveApnd = false;
var headerEl = $('header');

//call the page initialization
init();

//this function initializes the webpage
function init(){
  startClock();
  retrieveStoredData();
  renderTimeBlocks();
}

//this function starts the internal clock of the webpage
function startClock(){
  dateTime = dayjs();
  currentTimeEl.text(dateTime.format('dddd, MMMM D YYYY, h:mm:ss'));
  setInterval(function(){
    dateTime = dayjs();
    currentTimeEl.text(dateTime.format('dddd, MMMM D YYYY, h:mm:ss'));
    //check to see if it is a new day, if so reset the saved events and change the saved date to a new day
    if(dateTime.diff(savedDate,'day')){
      savedEvents = new Array(11).fill("");
      savedDate = dayjs();
      storeData();
      renderTimeBlocks();
    }
  }, 1000);
}

//this function retrives the stored data from local storage
function retrieveStoredData(){
  //checks to see if there are any previously saved events, if not it generates a blank event array and sets a new date
  if (!localStorage.events){
    savedEvents = new Array(11).fill("");
    savedDate = dayjs();
    return;
  }
  savedEvents = JSON.parse(localStorage.events)
  savedDate = JSON.parse(localStorage.date)
}

//this function renders the backgrounds of all of the time-blocks
function renderTimeBlocks(){
  retrieveStoredData();
  hour = dateTime.hour();
  timeBlockEl.each(function(index,element){
    var blockTime = index + 9;
    //checks if the block is less than the current hour, if so it changes the class to past
    if(blockTime < hour){
      $(element).addClass("past")
      $(element).removeClass("present");
      $(element).removeClass("future");
      // console.log('past');
    }
    //checks if the block is equal to the current hour, if so it changes the class to present
    if(blockTime === hour){
      $(element).removeClass("past;")
      $(element).addClass("present");
      $(element).removeClass("future");
      // console.log('present');
    }
    //checks if the block is greater than then current hour, if so it changes the class to fututr
    if(blockTime > hour){
      $(element).removeClass("past;")
      $(element).removeClass("present");
      $(element).addClass("future");
      // console.log('future');
    }
    //renders the text based on the saved events
    $(element).children('textarea').text(savedEvents[index]);
  });
}

//add event listener for when the save button is clicked
saveBtnEl.click(function(event){
  event.preventDefault();
  event.stopPropagation();
  var blockIndex = Number($(this).parent().attr('id').split("").splice(5,2).join('')) - 9;
  // console.log($(this).children('textarea').val());
  savedEvents[blockIndex] = $(this).parent().children('textarea').val();
  storeData();
  saveConfirm();
});

//this function will append a message to let users know that the event is saved
function saveConfirm(){
  var saveCounter = 3;
  if(saveApnd === true){
    return;
  }
  saveApnd = true;
  var saveEl = $('<p>Event has been saved &#9989</p>');
  saveEl.addClass('temp');
  headerEl.append(saveEl);
  var saveTimer = setInterval(function(){
    saveCounter--;
    // console.log(saveCounter);
    if(saveCounter<0){
      $('.temp').remove();
      saveApnd = false;
      clearInterval(saveTimer);
    }
  },1000);
}

//this funcion stores the events as well as the date they were saved
function storeData(){
  localStorage.events = JSON.stringify(savedEvents);
  localStorage.date = JSON.stringify(savedDate);
}