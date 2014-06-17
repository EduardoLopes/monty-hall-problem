(function() {
  'use strict';

  var Monty = (function() {

    var firstChosenDoor,
        secondChosenDoor,
        i,
        doors,
        choice,
        canOpen = [],
        firstOpened,
        allDoorsOpen = false;

    function random( min, max ) {
      return ( min + ( Math.random() * ( max - min ) ) );
    }

    function changeBackground( id, color ) {
      document.getElementById( id ).style.background = color;
    }

    function changeBorder( id, color ) {
      document.getElementById( id ).style.border = '10px solid '+color;
    }

    function removeBorder( id ) {
      document.getElementById( id ).style.borderWidth = '0px';
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
      canOpen = [];

      addClass('bar', 'active-bar');
      for ( i = 0; i < doors.length; i++ ) {
        if(doors[i] === 'zonk' && firstChosenDoor !== 'door-'+i){
          canOpen.push(i);
        }
      }

      setTimeout(function () {
        firstOpened = 'door-'+ canOpen[ Math.round( random( 0, canOpen.length - 1 ) ) ];
        addClass(firstOpened, 'door-zonk');
        addLogMessage('Door number ' + (+firstOpened.match(/[0-9]/g) + 1) + ' have a zonk!');
        changeText(firstOpened, 'zonk');
        removeClass('bar', 'active-bar');

      }, 1000);

    }

    function openDoors(){
      for ( i = 0; i < doors.length; i++ ) {

        if( doors[ i ] === 'car' && choice === 'door-' + i ){
          addClass( 'door-' + i , 'door-car' );
          changeText('door-' + i, 'car');
          addLogMessage('You won! Door number '+ (i + 1) +' have a car');
        } else if( doors[ i ] === 'car' ) {
          addClass( 'door-' + i , 'door-car-was' );
          changeText('door-' + i, 'car');
          addLogMessage('You lose! Door number '+ (i + 1) +' have a car and you choose door number ' + (+choice.match(/[0-9]/g) + 1));
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

    function clear () {
      firstChosenDoor = null;
      secondChosenDoor = null;
      choice = null;
      firstOpened = null;
      allDoorsOpen = false;
      doors = generateDoors();
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

    document.getElementById( 'stage' ).onclick = function( event ) {

      if( !( /door-[0-9]/g.test( event.toElement.id ) ) ){
        return false;
      }

      if( !firstChosenDoor ){
        firstChosenDoor = event.toElement.id;
        chooseDoor( firstChosenDoor );
        addLogMessage('You choose the door number '+ (+firstChosenDoor.match(/[0-9]/g) + 1));
        openFirstDoor();
        choice = event.toElement.id;
      } else if ( !secondChosenDoor && event.toElement.id !== firstChosenDoor && event.toElement.id !== firstOpened && ( /door-[0-9]/g.test( firstOpened ) ) && !allDoorsOpen){
        secondChosenDoor = event.toElement.id;
        addLogMessage('You choose change your door ( '+(+firstChosenDoor.match(/[0-9]/g) + 1)+' ) to the door number '+ (+secondChosenDoor.match(/[0-9]/g) + 1));
        chooseDoor( secondChosenDoor );
        choice = event.toElement.id;
      }

      // if(firstChosenDoor && secondChosenDoor){
      //   openDoors();
      // }

    };

    document.getElementById( 'new' ).onclick = function(){
      removeLogMessages();
      clear();
    };

    document.getElementById( 'open' ).onclick = function(){
      if ( !choice || !firstOpened || allDoorsOpen ){
        return false;
      }

      addLogMessage('Doors are opened');
      openDoors();
    };

    var logContainer = document.getElementById('log');
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

    return{
      init: function() {
        doors = generateDoors();
      }
    };

  }());

  Monty.init();

}());