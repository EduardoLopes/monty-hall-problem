(function() {
  'use strict';

  function random( min, max ) {
    return ( min + ( Math.random() * ( max - min ) ) );
  }

  function randomChoice(array){

    return array[ Math.round( random( 0, array.length - 1 ) ) ];
  }

  function addClass( id, class_ ) {
    document.getElementById( id ).classList.add( class_ );
  }

  function removeClass( id, class_ ) {
    document.getElementById( id ).classList.remove( class_ );
  }

  function toggleClass( id, class_ ) {
    document.getElementById( id ).classList.toggle( class_ );
  }

  function changeText(element, text){
    document.getElementById(element).innerHTML = '';
    document.getElementById(element).appendChild( document.createTextNode( text ) );
  }

  var firstChosenDoor,
      secondChosenDoor,
      doors = generateDoors(),
      choice,
      firstOpened,
      allDoorsOpen = false,
      logContainer = document.getElementById('log'),
      automatic = false,
      logMessages = {
        win: function() {
          return 'You won! Door number '+ extractDoorNumber( choice ) +' have a car!';
        },
        lose: function(doorWithCar) {
          return 'You lose! Door number '+ doorWithCar +' have a car and you choose door number ' + extractDoorNumber(choice);
        },
        firstOpenedDoor: function() {
          return 'Door number ' + extractDoorNumber( firstOpened ) + ' have a zonk!';
        },
        chooseFirstDoor: function() {
          return 'You choose the door number '+ extractDoorNumber( firstChosenDoor );
        },
        chooseSecondDoor: function() {
          return  'You choose change your door ( '+ extractDoorNumber( firstChosenDoor ) +' ) to the door number '+ extractDoorNumber( secondChosenDoor );
        },
        allDoorsOpen: function() {
          return 'All doors open!'
        }
      };

  function extractDoorNumber(door){
    if(door){
      return (+door.match(/[0-9]/g) + 1);
    }
  }

  function generateDoors () {
    return [ 'car', 'zonk', 'zonk' ].sort(function() {
      return Math.round( random(-1, 2) );
    });
  }

  function chooseDoor( id ) {
    addClass(id, 'door-chosen');
    if( secondChosenDoor ){
      removeClass( firstChosenDoor, 'door-chosen');
    }
  }

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
        changeText('door-' + i, 'car');
        addLogMessage( logMessages.win() );
      } else if( doors[ i ] === 'car' ) {
        addClass( 'door-' + i , 'door-car-was' );
        changeText('door-' + i, 'car');
        addLogMessage( logMessages.lose( i + 1 ) );
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

  document.getElementById( 'stage' ).onclick = function choose( event ) {

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
      removeClass( 'door-' + i, 'door-chosen');
      removeClass( 'door-' + i, 'door-zonk');
      removeClass( 'door-' + i, 'door-car');
      removeClass( 'door-' + i, 'door-wrong');
      removeClass( 'door-' + i, 'door-car-was');
      changeText('door-' + i, (i + 1));
    }
  }

  document.getElementById( 'new' ).onclick = clear;

  document.getElementById( 'open' ).onclick = openDoors;

  document.getElementById( 'auto' ).onclick = function() {

    automatic = !automatic;
    if(automatic){
      document.getElementById( 'auto' ).innerHTML = 'Stop Automatic';
    }

    var intervalId = setInterval(function () {

      if(!automatic){
        clearInterval(intervalId);
        document.getElementById( 'auto' ).innerHTML = 'Automatic';
      }

      if(allDoorsOpen){
        clear();
      }

      if( !firstChosenDoor ){

      setFirstChosenDoor( 'door-' + randomChoice( [0, 1, 2] ) );

      } else if ( !secondChosenDoor && !allDoorsOpen && firstOpened ){

        setSecondChosenDoor( 'door-'+[0, 1, 2].filter(function(element) {

          return !( element === ( extractDoorNumber( firstOpened ) - 1) || element === ( extractDoorNumber( firstChosenDoor ) - 1) )

        } ) );
      }

      if(firstChosenDoor && secondChosenDoor){
        openDoors();
      }

    }, 500);
  };

}());