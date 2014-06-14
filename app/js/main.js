(function() {
  'use strict';

  var Monty = (function() {

    var firstChosenDoor,
        secondChosenDoor,
        i,
        doors,
        choice,
        canOpen = [],
        firstOpened;

    function random ( min, max ) {
      return ( min + ( Math.random() * ( max - min ) ) );
    };

    function generateDoors () {
      return [ 'car', 'zonk', 'zonk' ].sort(function() {
        return Math.round( random(-1, 2) );
      });
    }

    function chooseDoor( id ) {
      document.getElementById( id ).style.background = '#00A9C5';
      if( secondChosenDoor ){
        document.getElementById( firstChosenDoor ).style.background = '#70401C';
      }
    }

    function openFirstDoor(){
      canOpen = [];
      for ( i = 0; i < doors.length; i++ ) {
        if(doors[i] === 'zonk' && firstChosenDoor !== 'door-'+i){
          canOpen.push(i);
        }
      }
      firstOpened = 'door-'+ canOpen[ Math.round( random( 0, canOpen.length - 1 ) ) ];
      document.getElementById( firstOpened ).style.background = '#875E5E';

    }

    function openDoors(){
      for ( i = 0; i < doors.length; i++ ) {

        if( doors[ i ] === 'car' && choice === 'door-' + i ){
          document.getElementById( 'door-' + i ).style.background = '#08B400';
        } else if( doors[ i ] === 'car' ) {
          document.getElementById( 'door-' + i ).style.background = '#00570F';
        } else if( doors[ i ] !== 'car' && choice === 'door-' + i ) {
          document.getElementById( 'door-' + i ).style.background = '#DA0000';
        } else {
          document.getElementById( 'door-' + i ).style.background = '#875E5E';
        }

      };
    }

    function clear () {
      firstChosenDoor = null;
      secondChosenDoor = null;
      choice = null;
      doors = generateDoors();
      //close all doors
      for ( i = 0; i < doors.length; i++ ) {
        document.getElementById( 'door-' + i ).style.background = '#70401C';
      }
    }

    document.getElementById( 'stage' ).onclick = function( event ) {

      if( !( /door-[0-9]/g.test( event.toElement.id ) ) ){
        return false;
      };

      if( !firstChosenDoor ){
        firstChosenDoor = event.toElement.id;
        chooseDoor( firstChosenDoor );
        openFirstDoor();
      } else if ( !secondChosenDoor && event.toElement.id !== firstOpened ){
        secondChosenDoor = event.toElement.id;
        chooseDoor( secondChosenDoor );
      }

      choice = event.toElement.id;

      // if(firstChosenDoor && secondChosenDoor){
      //   openDoors();
      // }

    };

    document.getElementById( 'new' ).onclick = function(){
      clear();
    };

    document.getElementById( 'open' ).onclick = function(){
      if ( !choice ){
        return false;
      }

      openDoors();

    };

    return{
      init: function() {
        doors = generateDoors();
      }
    }

  }());

  Monty.init();

}());