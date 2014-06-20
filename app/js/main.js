(function() {
  'use strict';

  var elements = [];

  //return a random number between min and max
  function random( min, max ) {
    return ( min + ( Math.random() * ( max - min ) ) );
  }

  //return a random value of the array
  function randomChoice(array){
    return array[ Math.round( random( 0, array.length - 1 ) ) ];
  }

  //return and cache a reference to the element,
  function getElementById(id){
    if(!elements[id]){
      elements[id] = document.getElementById( id );
    }
    return elements[id];
  }

  //add a class to an element
  function addClass( id, class_ ) {
    getElementById( id ).classList.add( class_ );
  }

  //remove a class of an element
  function removeClass( id, class_ ) {
    getElementById( id ).classList.remove( class_ );
  }

  //change the text of an element (the doors)
  function changeText(element, text){
    getElementById(element).innerHTML = '';
    getElementById(element).appendChild( document.createTextNode( text ) );
  }

      // the first chosen door
  var firstChosenDoor,
      // the second chosen door
      secondChosenDoor,
      // have a random door sequence
      doors = generateDoors(),
      // the last chosen door
      choice,
      // door open after the first was choose
      firstOpened,
      // is set to true when all door are open and is set to false when clean up
      allDoorsOpen = false,
      // log container
      logContainer = getElementById('log'),
      //set to true when automatic button is pressed
      automatic = false,
      //'false' is 'change door' and 'true' is 'without change door'
      mode = false,
      //turn on alternate between mode 0 (false, 'change door') and mode 1 (true, 'without change door')
      alternateMode = true,
      //is set to true when about 'button' is pressed
      showAbout = false,
      //hold the results of the game
      results = {
        // is incremented +1 when win changing door
        winsChangeDoor: 0,
        // is incremented +1 when lose changing door
        loseChangeDoor: 0,
        // is incremented +1 when win without change dorr
        winsWithoutChangeDoor: 0,
        // is incremented +1 when lose without change dorr
        loseWithoutChangeDoor: 0,
        //update some cells of the table
        updateTable: function() {
          getElementById('change-door-total').innerHTML = this.totalChangeDoor();
          getElementById('without-change-door-total').innerHTML = this.totalWithoutChangeDoor();
          getElementById('total').innerHTML = this.totalMatches();
        },
        //this function is called when win the game
        setWin: function() {
          //if choose pick another door
          if(secondChosenDoor){
            // incremente +1 when win changing door
            this.winsChangeDoor += 1;
            //update table
            getElementById('win-change-door').innerHTML = this.winsChangeDoor;
            //add classes to the table to show where was incremetend
            addClass('win-change-door', 'green');
            addClass('change-door-total', 'blue');
            // if only choose one door
          } else {
            //incremente +1 when win without pick another door
            this.winsWithoutChangeDoor += 1;
            //update table
            getElementById('win-without-change-door').innerHTML = this.winsWithoutChangeDoor;
            //add classes to the table to show where was incremetend
            addClass('win-without-change-door', 'green');
            addClass('without-change-door-total', 'blue');
          }
          //update table
          addClass('status', 'won');
          removeClass('status', 'lose');
          getElementById('status').innerHTML = 'WON!';
          this.updateTable();
        },
        setLose: function() {
           //if choose pick another door
          if(secondChosenDoor){
            // incremente +1 when lose without change door
            this.loseChangeDoor += 1;
            //update table
            getElementById('lose-change-door').innerHTML = this.loseChangeDoor;
            //add classes to the table to show where was incremetend
            addClass('lose-change-door', 'red');
            addClass('change-door-total', 'blue');
            // if only choose one door
          } else {
            // incremente +1 when lose without change door
            this.loseWithoutChangeDoor += 1;
            //update table
            getElementById('lose-without-change-door').innerHTML = this.loseWithoutChangeDoor;
            //add classes to the table to show where was incremetend
            addClass('without-change-door-total', 'blue');
            addClass('lose-without-change-door', 'red');
          }
          //update table
          removeClass('status', 'won');
          addClass('status', 'lose');
          getElementById('status').innerHTML = 'LOSE!';
          this.updateTable();
        },
        // return the total of matches changing door
        totalChangeDoor: function() {
          return this.winsChangeDoor + this.loseChangeDoor;
        },
        //return the total of matches without change door
        totalWithoutChangeDoor: function() {
          return this.winsWithoutChangeDoor + this.loseWithoutChangeDoor;
        },
        //return the total of matches
        totalMatches: function() {
          addClass('total', 'blue');
          return this.totalChangeDoor() + this.totalWithoutChangeDoor();
        }
      },
      //hold all log messages
      logMessages = {
        // shown this log message when win
        win: function() {
          return 'You won! Door number '+ extractDoorNumber( choice ) +' have a car!';
        },
        // shown when lose
        lose: function(doorWithCar) {
          return 'You lose! Door number '+ doorWithCar +' have a car and you choose door number ' + extractDoorNumber(choice);
        },
        // shown after the first door is open
        askForChangeDoor: function() {
          //look for the only door that can be selected
          var door = [0, 1, 2].filter(function(element) {

            return !( element === ( extractDoorNumber( firstOpened ) - 1) || element === ( extractDoorNumber( firstChosenDoor ) - 1) )

          } );

          return 'Do you want to pick door number '+extractDoorNumber( 'door-'+door )+'?';
        },
        //shown after the first door is opened
        firstOpenedDoor: function() {
          return 'Door number ' + extractDoorNumber( firstOpened ) + ' have a zonk!';
        },
        //shown when select te first door
        chooseFirstDoor: function() {
          return 'You choose the door number '+ extractDoorNumber( firstChosenDoor );
        },
        //shown when select te second door
        chooseSecondDoor: function() {
          return  'You choose change your door ( '+ extractDoorNumber( firstChosenDoor ) +' ) to the door number '+ extractDoorNumber( secondChosenDoor );
        },
        //shown when all doors are open
        allDoorsOpen: function() {
          return 'All doors open!'
        }
      };


  function extractDoorNumber(door){
    if(door){
      return (+door.match(/[0-9]/g) + 1);
    }
  }

  //rendom generate the sequence of the doors
  function generateDoors () {
    return [ 'car', 'zonk', 'zonk' ].sort(function() {
      return Math.round( random(-1, 2) );
    });
  }

  //change the class of the chosen door
  function chooseDoor( id ) {
    addClass(id, 'door-chosen');
    if( secondChosenDoor ){
      removeClass( firstChosenDoor, 'door-chosen');
    }
  }

  //open the first door
  function openFirstDoor(){
    var canOpen = [], i;

    addClass('bar', 'active-bar');
    for ( i = 0; i < doors.length; i++ ) {
      if(doors[i] === 'zonk' && firstChosenDoor !== 'door-'+i){
        canOpen.push(i);
      }
    }

    setTimeout(function () {
      firstOpened = 'door-'+ randomChoice(canOpen);
      addClass(firstOpened, 'door-zonk');
      addLogMessage(logMessages.firstOpenedDoor());
      changeText(firstOpened, 'zonk');
      removeClass('bar', 'active-bar');
      addLogMessage(logMessages.askForChangeDoor());
    }, 1000);

  }

  function openDoors(){
    var i;
    if ( !choice || !firstOpened || allDoorsOpen ){
      return false;
    }

    addLogMessage( logMessages.allDoorsOpen() );

    for ( i = 0; i < doors.length; i++ ) {
      if( doors[ i ] === 'car' && choice === 'door-' + i ){
        addClass( 'door-' + i , 'door-car' );
        changeText('door-' + i, 'CAR');
        addLogMessage( logMessages.win() );
        results.setWin();
      } else if( doors[ i ] === 'car' && choice !== 'door-' + i ) {
        addClass( 'door-' + i , 'door-car-was' );
        changeText('door-' + i, 'CAR');
        addLogMessage( logMessages.lose( i + 1 ) );
        results.setLose();
      } else if( doors[ i ] !== 'car' && choice === 'door-' + i ) {
        addClass( 'door-'+i, 'door-wrong')
        changeText('door-' + i, 'zonk');
      } else {
        addClass( 'door-' + i , 'door-zonk');
        changeText('door-' + i, 'zonk');
      }
    }

    allDoorsOpen = true;
  }

  function setFirstChosenDoor(door){
    firstChosenDoor = door;
    chooseDoor( firstChosenDoor );
    addLogMessage( logMessages.chooseFirstDoor() );
    openFirstDoor();
    choice = door;
  }

  function setSecondChosenDoor(door){
    secondChosenDoor = door;
    addLogMessage( logMessages.chooseSecondDoor() );
    chooseDoor( secondChosenDoor );
    choice = door;
  }

  function addLogMessage(message){
    var newLi = document.createElement('li'),
        text = document.createTextNode(message);

    newLi.classList.add('message-log');

    newLi.appendChild(text);
    logContainer.appendChild(newLi);
  }

  function removeLogMessages(){
    while (logContainer.lastChild) {
      logContainer.removeChild(logContainer.lastChild);
    }
  }

  getElementById( 'stage' ).onclick = function choose( event ) {

    if( !( /door-[0-9]/g.test( event.toElement.id ) ) ){
      return false;
    }

    if( !firstChosenDoor ){
      setFirstChosenDoor( event.toElement.id );
    } else if ( !secondChosenDoor && event.toElement.id !== firstChosenDoor && event.toElement.id !== firstOpened && ( /door-[0-9]/g.test( firstOpened ) ) && !allDoorsOpen){
      setSecondChosenDoor( event.toElement.id )
    }

  };

  function clear() {
    var i;
    firstChosenDoor = null;
    secondChosenDoor = null;
    choice = null;
    firstOpened = null;
    allDoorsOpen = false;
    doors = generateDoors();
    removeLogMessages();
    //close all doors
    for ( i = 0; i < doors.length; i++ ) {
      getElementById('door-' + i).classList.remove('door-chosen', 'door-zonk', 'door-car', 'door-wrong', 'door-car-was');
      changeText('door-' + i, (i + 1));
    }
    getElementById('status').classList.remove('won', 'lose');
    getElementById('status').innerHTML = '';

    removeClass('change-door-total', 'blue');
    removeClass('without-change-door-total', 'blue');
    removeClass('total', 'blue');
    removeClass('win-change-door', 'green');
    removeClass('win-without-change-door', 'green');
    removeClass('lose-change-door', 'red');
    removeClass('lose-without-change-door', 'red');
  }

  getElementById( 'new' ).onclick = clear;

  getElementById( 'open' ).onclick = openDoors;

  getElementById( 'auto' ).onclick = function() {

    automatic = !automatic;
    if(automatic){
      getElementById( 'auto' ).innerHTML = 'Stop Automatic';
    }

    var intervalId = setInterval(function () {

      if(!automatic){
        clearInterval(intervalId);
        getElementById( 'auto' ).innerHTML = 'Automatic';
      }

      if(allDoorsOpen){
        clear();
        if(alternateMode){
          mode = !mode;
        }
      }

      if( !firstChosenDoor ){

      setFirstChosenDoor( 'door-' + randomChoice( [0, 1, 2] ) );

      } else if ( !secondChosenDoor && !allDoorsOpen && firstOpened && mode ){

        setSecondChosenDoor( 'door-'+[0, 1, 2].filter(function(element) {

          return !( element === ( extractDoorNumber( firstOpened ) - 1) || element === ( extractDoorNumber( firstChosenDoor ) - 1) )

        } ) );
      }

      if(firstChosenDoor || (mode && secondChosenDoor) ){
        openDoors();
      }

    }, 500);
  };

  getElementById('about').onclick = function() {
    showAbout = !showAbout;

    if(showAbout){
      removeClass('about-container','visuallyhidden');
    } else {
      addClass('about-container','visuallyhidden');
    }

  };

}());