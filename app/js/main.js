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
      changeBorder( id, '#00A9C5' );
      if( secondChosenDoor ){
        removeBorder( firstChosenDoor, '#00A9C5' );
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
        changeBackground( firstOpened , '#875E5E' );
        addLogMessage('Door number ' + (+firstOpened.match(/[0-9]/g) + 1) + ' have a zonk!');
        changeText(firstOpened, 'zork');
        removeClass('bar', 'active-bar');

      }, 1000);

    }

    function openDoors(){
      for ( i = 0; i < doors.length; i++ ) {

        if( doors[ i ] === 'car' && choice === 'door-' + i ){
          changeBackground( 'door-' + i , '#08B400' );
          changeText('door-' + i, 'car');
          addLogMessage('You won! Door number '+ (i + 1) +' have a car');
        } else if( doors[ i ] === 'car' ) {
          changeBackground( 'door-' + i , '#00570F' );
          changeText('door-' + i, 'car');
          addLogMessage('You lose! Door number '+ (i + 1) +' have a car and you choose door number ' + (+choice.match(/[0-9]/g) + 1));
        } else if( doors[ i ] !== 'car' && choice === 'door-' + i ) {
          changeBackground( 'door-' + i , '#DA0000' );
          changeText('door-' + i, 'zork');
        } else {
          changeBackground( 'door-' + i , '#875E5E' );
          changeText('door-' + i, 'zork');
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
        changeBackground( 'door-' + i , '#70401C' );
        removeBorder( 'door-' + i );
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