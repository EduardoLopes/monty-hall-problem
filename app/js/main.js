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

    function random( min, max ) {
      return ( min + ( Math.random() * ( max - min ) ) );
    };

    function changeBackground( id, color ) {
      document.getElementById( id ).style.background = color;
    };

    function changeBorder( id, color ) {
      document.getElementById( id ).style.border = '10px solid '+color;
    };

    function removeBorder( id ) {
      document.getElementById( id ).style.borderWidth = '0px';
    };

    function addClass( id, class_ ) {
      document.getElementById( id ).classList.add( class_ );
    };

    function removeClass( id, class_ ) {
      document.getElementById( id ).classList.remove( class_ );
    };

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

      setTimeout(function () {

        for ( i = 0; i < doors.length; i++ ) {
          if(doors[i] === 'zonk' && firstChosenDoor !== 'door-'+i){
            canOpen.push(i);
          }
        }
        firstOpened = 'door-'+ canOpen[ Math.round( random( 0, canOpen.length - 1 ) ) ];
        changeBackground( firstOpened , '#875E5E' );

        removeClass('bar', 'active-bar');

      }, 1000);

    };

    function openDoors(){
      for ( i = 0; i < doors.length; i++ ) {

        if( doors[ i ] === 'car' && choice === 'door-' + i ){
          changeBackground( 'door-' + i , '#08B400' );
        } else if( doors[ i ] === 'car' ) {
          changeBackground( 'door-' + i , '#00570F' );
        } else if( doors[ i ] !== 'car' && choice === 'door-' + i ) {
          changeBackground( 'door-' + i , '#DA0000' );
        } else {
          changeBackground( 'door-' + i , '#875E5E' );
        }

      };
    }

    function clear () {
      firstChosenDoor = null;
      secondChosenDoor = null;
      choice = null;
      firstOpened = null;
      doors = generateDoors();
      //close all doors
      for ( i = 0; i < doors.length; i++ ) {
        changeBackground( 'door-' + i , '#70401C' );
        removeBorder( 'door-' + i );
      }
    }

    document.getElementById( 'stage' ).onclick = function( event ) {
      console.log(( /door-[0-9]/g.test( firstOpened ) ));

      if( !( /door-[0-9]/g.test( event.toElement.id ) ) ){
        return false;
      };

      if( !firstChosenDoor ){
        firstChosenDoor = event.toElement.id;
        chooseDoor( firstChosenDoor );
        openFirstDoor();
      } else if ( !secondChosenDoor && event.toElement.id !== firstOpened && ( /door-[0-9]/g.test( firstOpened ) ) ){
        console.log(firstOpened);
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