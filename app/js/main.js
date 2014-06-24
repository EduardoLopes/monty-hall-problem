(function(global) {
  'use strict';

  var elements = [];
  //i think this is not the best way to translate something inside the code, but ¯\_(ツ)_/¯.
  var pt_br = (global.pt_br) ? true : false;

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

  //the first chosen door
  var firstChosenDoor,
    //the second chosen door
    secondChosenDoor,
    //the last chosen door
    choice,
    //door open after the first was choose
    firstOpened,
    //is set to true when all door are open and is set to false when clean() is called
    allDoorsOpen = false,
    //log container
    logContainer = getElementById('log'),
    //set to true when automatic button is pressed
    automatic = false,
    //'false' is 'change door' and 'true' is 'without change door'
    mode = false,
    //turn on alternate between mode 0 (false, 'change door') and mode 1 (true, 'without change door')
    alternateMode = true,
    //Turn on the one hundred doors mode
    oneHundredMode = false,
    //when true show about container
    showAbout = false,
    //used for one hundred doors mode, it's the last door to pick
    lastDoor,
    //hold the results of the game
    results = {
      //is incremented +1 when win changing door
      winsChangeDoor: 0,
      //is incremented +1 when lose changing door
      loseChangeDoor: 0,
      //is incremented +1 when win without change dorr
      winsWithoutChangeDoor: 0,
      //is incremented +1 when lose without change dorr
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
          //incremente +1 when win changing door
          this.winsChangeDoor += 1;
          //update table
          getElementById('win-change-door').innerHTML = this.winsChangeDoor;
          //add classes to the table to show where was incremetend
          addClass('win-change-door', 'green');
          addClass('change-door-total', 'blue');
          //if only choose one door
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
        if(pt_br){
          getElementById('status').innerHTML = 'Ganhou!';
        } else {
          getElementById('status').innerHTML = 'WON!';
        }

        this.updateTable();
      },
      setLose: function() {
         //if choose pick another door
        if(secondChosenDoor){
          //incremente +1 when lose without change door
          this.loseChangeDoor += 1;
          //update table
          getElementById('lose-change-door').innerHTML = this.loseChangeDoor;
          //add classes to the table to show where was incremetend
          addClass('lose-change-door', 'red');
          addClass('change-door-total', 'blue');
          //if only choose one door
        } else {
          //incremente +1 when lose without change door
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

        if(pt_br){
          getElementById('status').innerHTML = 'Perdeu!';
        } else {
          getElementById('status').innerHTML = 'LOSE!';
        }

        this.updateTable();
      },
      //return the total of matches changing door
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
      //shown this log message when win
      win: function() {
        if(pt_br){
          return 'Você ganhou! Porta número '+ extractDoorNumber( choice ) +' tem um carro!';
        }
        return 'You won! Door number '+ extractDoorNumber( choice ) +' have a car!';
      },
      //shown when lose
      lose: function(doorWithCar) {
        if(pt_br){
          return 'Você perdeu! Porta número '+ doorWithCar +' have a car and you choose door number ' + extractDoorNumber(choice);
        }
        return 'You lose! Door number '+ doorWithCar +' have a car and you choose door number ' + extractDoorNumber(choice);
      },
      //shown after the first door wis open
      askForChangeDoor: function() {
        var door;
        //look for the only door that can be selected
        if(oneHundredMode){
          door = lastDoor;
        } else {
          door = 'door-'+Doors.numbersIds.filter(function(element) {

            return !( element === ( extractDoorNumber( firstOpened ) - 1) || element === ( extractDoorNumber( firstChosenDoor ) - 1) );

          } );
        }

        if(pt_br){
          return 'Você quer escolher a porta numero '+extractDoorNumber( door )+'?';
        }

        return 'Do you want to pick door number '+extractDoorNumber( door )+'?';
      },
      //shown after the first door is opened
      firstOpenedDoor: function() {
        if(pt_br){
          return 'Porta numero ' + extractDoorNumber( firstOpened ) + ' tem um \'zonk\'!';
        }
        return 'Door number ' + extractDoorNumber( firstOpened ) + ' have a zonk!';
      },
      //shown when select te first door
      chooseFirstDoor: function() {
        if(pt_br){
          return 'Você escolheu a porta numero '+ extractDoorNumber( firstChosenDoor );
        }
        return 'You choose the door number '+ extractDoorNumber( firstChosenDoor );
      },
      //shown when select te second door
      chooseSecondDoor: function() {
        if(pt_br){
          return 'Você escolheu trocar a porta numero '+ extractDoorNumber( firstChosenDoor )+' pela porta numero '+ extractDoorNumber( secondChosenDoor );
        }
        return  'You choose change your door ( '+ extractDoorNumber( firstChosenDoor ) +' ) to the door number '+ extractDoorNumber( secondChosenDoor );
      },
      //shown when all doors are open
      allDoorsOpen: function() {
        if(pt_br){
          return 'Todas as portas foram abertas';
        }
        return 'All doors open!';
      }
    },
    Doors = {
      //quantity of doors
      quantity: 0,
      //doors
      doors: [],
      //index of the doors with a carr
      withCar: 0,
      //number id of all door
      numbersIds: [],
      //set quantity of doors
      setQuantity: function(quantity) {
        this.quantity = quantity;
      },
      //generate doors
      generate: function(quantity) {
        var i, randomNumber = Math.round(random(0, quantity - 1));

        this.doors = [];
        this.numbersIds = [];

        for ( i = 0; i < quantity; i++ ) {
          this.numbersIds.push(i);
          if( i === randomNumber ){
            this.doors.push( 'car' );
            this.withCar = i;
          } else {
            this.doors.push( 'zonk' );
          }
          //add doors to the dom
          addDoor(i);

        }

        this.setQuantity(this.doors.length);
      }
    };

  /**
  * The id number of each door it's one number smaller, like: door 'door-0' means 'door-1'.
  * What this function makes it's extract the number of the id (door-0 or door-1) and increment +1
  * return @number
  */
  function extractDoorNumber(door){
    if(door){
      return +(/door-(\d*)/.exec(door)[1]) + 1;
    }
  }

  //add door to the DOM
  function addDoor(number){
    var newDoor,
        doorContainer = document.createElement('div');

    //cache elements
    if(!elements['door-'+number]){
      newDoor = document.createElement('div');
      newDoor.classList.add('door', 'door-'+number);
      newDoor.setAttribute('id', 'door-'+number);
      elements['door-'+number] = newDoor;
    }
    //get the cached element
    newDoor = elements['door-'+number];

    //if one hundred mode is on add this classes
    if(oneHundredMode){
      doorContainer.classList.add('col-xs-2', 'col-md-1');
      newDoor.classList.add('door-100', 'door-'+number);
      //if no
    } else {
      doorContainer.classList.add('col-xs-4', 'col-md-4');
      newDoor.classList.add('door-'+number);
      newDoor.appendChild( document.createTextNode( number + 1 ) );
    }

    //each door is inside a div
    doorContainer.appendChild(newDoor);
    //all doors are inside another div called #doors-container
    getElementById('doors-container').appendChild(doorContainer);

  }

  //generate door sequence
  if(oneHundredMode){
    Doors.generate(100);
  } else {
    Doors.generate(3);
  }

  //change the class of the chosen door
  function chooseDoor( id ) {
    //add class to the chosen door

    addClass(id, 'door-chosen');
    //if pick another door remove the class 'door-chosen' from the first door chosen
    if( secondChosenDoor ){
      removeClass( firstChosenDoor, 'door-chosen');
    }
  }

  //open the first door
  function openFirstDoor(){
    var canOpen = [],
      i,
      //doorNumber
      dn,
      arrayWithoutFirstChosen = [];
    //active the 'load' bar
    addClass('bar', 'active-bar');
    //look for doors with zonks
    for ( i = 0; i < Doors.doors.length; i++ ) {
      if(Doors.doors[i] === 'zonk' && firstChosenDoor !== 'door-'+i){
        canOpen.push(i);
      }
    }

    //wait one second to open the door with a zonk
    setTimeout(function () {
      if(oneHundredMode){
        arrayWithoutFirstChosen = Doors.numbersIds.filter(function(element) {
          return element !== ( extractDoorNumber( firstChosenDoor ) - 1 );
        });

        dn = randomChoice(arrayWithoutFirstChosen);
        //door that stay closed
        firstOpened = 'door-'+ dn;

        //if the randomly chosen door have a car
        if(Doors.doors[dn] === 'car'){
          lastDoor = 'door-'+dn;
          //close all doors but not the random one and the first chosen by the player
          for ( i = 0; i < arrayWithoutFirstChosen.length; i++ ) {
            if(arrayWithoutFirstChosen[i] !== dn){
              addClass('door-'+arrayWithoutFirstChosen[i], 'door-zonk');
              changeText('door-'+arrayWithoutFirstChosen[i], 'zonk');
            } else {
              lastDoor = 'door-'+i;
            }
          }
        //if the fist chosen don't have a car
        } else {
          lastDoor = 'door-'+Doors.withCar;
          //close all doors but not the door with a car and the first chosen by the player
          for ( i = 0; i < arrayWithoutFirstChosen.length; i++ ) {
            if(arrayWithoutFirstChosen[i] !== Doors.withCar){
              addClass('door-'+arrayWithoutFirstChosen[i], 'door-zonk');
              changeText('door-'+arrayWithoutFirstChosen[i], 'zonk');
            }
          }
        }
        //hide load bar
        removeClass('bar', 'active-bar');

        //add log mensage to the log
        addLogMessage(logMessages.askForChangeDoor());

        return false;
      }

      //random choose a zonk door to open
      firstOpened = 'door-'+ randomChoice(canOpen);
      //'open' this door
      addClass(firstOpened, 'door-zonk');
      //show a message in the log
      addLogMessage(logMessages.firstOpenedDoor());
      //change the text of the door to zonk
      changeText(firstOpened, 'zonk');
      //hide the load bar
      removeClass('bar', 'active-bar');
      //Ask in the log if want to pick another door
      addLogMessage(logMessages.askForChangeDoor());
    }, 1000);

  }

  //open all doors
  function openDoors(){
    var i;
    //Only open the doors if already choose one, if the first door with a zonk was open, and if all doors was no open yet
    if ( !choice || !firstOpened || allDoorsOpen ){
      return false;
    }

    //show a message saying that all doors are open
    addLogMessage( logMessages.allDoorsOpen() );

    //pass throng all dorrs
    for ( i = 0; i < Doors.doors.length; i++ ) {
      //if choose a door with a car
      if( Doors.doors[ i ] === 'car' && choice === 'door-' + i ){
        addClass( 'door-' + i , 'door-car' );
        changeText('door-' + i, 'CAR');
        addLogMessage( logMessages.win() );
        results.setWin();
      //if choose a door with a zonk show the door with a car
      } else if( Doors.doors[ i ] === 'car' && choice !== 'door-' + i ) {
        addClass( 'door-' + i , 'door-car-was' );
        changeText('door-' + i, 'CAR');
        addLogMessage( logMessages.lose( i + 1 ) );
        results.setLose();
      //if choose a dor with a zonk shows this door paint of red
      } else if( Doors.doors[ i ] !== 'car' && choice === 'door-' + i ) {
        addClass( 'door-'+i, 'door-wrong');
        changeText('door-' + i, 'zonk');
      //show the others doors with a zonk
      } else {
        addClass( 'door-' + i , 'door-zonk');
        changeText('door-' + i, 'zonk');
      }
    }

    allDoorsOpen = true;
  }

  //set the first chosen door
  function setFirstChosenDoor(door){
    firstChosenDoor = door;
    chooseDoor( firstChosenDoor );
    addLogMessage( logMessages.chooseFirstDoor() );
    openFirstDoor();
    choice = door;
  }

  //set the second chosen door
  function setSecondChosenDoor(door){
    secondChosenDoor = door;
    addLogMessage( logMessages.chooseSecondDoor() );
    chooseDoor( secondChosenDoor );
    choice = door;
  }

  //add a log message to the log container
  function addLogMessage(message){
    var newLi = document.createElement('li'),
        text = document.createTextNode(message);

    newLi.classList.add('message-log');

    newLi.appendChild(text);
    logContainer.appendChild(newLi);
  }

  //remove all messages from the log container
  function removeLogMessages(){
    while (logContainer.lastChild) {
      logContainer.removeChild(logContainer.lastChild);
    }
  }

  //click event on the container of all doors
  getElementById( 'stage' ).onclick = function choose( event ) {

    var clickedDoor = (event.target) ? event.target.id : event.srcElement.id;

    //chack if the clicked element is a door
    if( !( /door-\d*/g.test( clickedDoor ) ) ){
      return false;
    }
    //if the first door was not chosen yet
    if( !firstChosenDoor ){
      setFirstChosenDoor( clickedDoor );
    /**
    * This check a lot of things:
    * - if the second door was not chosen yet
    * - if the clicked door it's different from the first chosen one
    * - if the first door was already chosen
    * - if the clicked door it's different form the first open with a zonk
    * - if all door are not alrady open
    **/
    } else if ( !secondChosenDoor && clickedDoor !== firstChosenDoor && ( /door-\d*/g.test( firstOpened ) ) && !getElementById(clickedDoor).classList.contains('door-zonk') && !allDoorsOpen){
      setSecondChosenDoor( clickedDoor );
    }
  };

  //clear vars and etc
  function clear() {
    var i;
    //clear vars
    firstChosenDoor = null;
    secondChosenDoor = null;
    choice = null;
    firstOpened = null;
    allDoorsOpen = false;

    //
    while (getElementById('doors-container').lastChild) {
      getElementById('doors-container').removeChild(getElementById('doors-container').lastChild);
    }

    //generate another door sequence
    if(oneHundredMode){
      Doors.generate(100);
    } else {
      Doors.generate(3);
    }
    //remove log messages
    removeLogMessages();

    //remove all classes from the doors
    for ( i = 0; i < Doors.doors.length; i++ ) {
      getElementById('door-' + i).classList.remove('door-chosen', 'door-zonk', 'door-car', 'door-wrong', 'door-car-was');
      changeText('door-' + i, (i + 1));
    }

    //remove the status from the tables cell
    getElementById('status').classList.remove('won', 'lose');
    getElementById('status').innerHTML = '';

    //remove classes from the table
    removeClass('change-door-total', 'blue');
    removeClass('without-change-door-total', 'blue');
    removeClass('total', 'blue');
    removeClass('win-change-door', 'green');
    removeClass('win-without-change-door', 'green');
    removeClass('lose-change-door', 'red');
    removeClass('lose-without-change-door', 'red');

  }

  //button 'new' click event
  getElementById( 'new' ).onclick = clear;

  //button 'Open doors' click event
  getElementById( 'open' ).onclick = openDoors;

  //button Automatic click event
  getElementById( 'auto' ).onclick = function() {
    //work as a interrupter
    automatic = !automatic;
    //if automatic is on
    if(automatic){
      if(pt_br){
        getElementById( 'auto' ).innerHTML = 'Parar Automático';
      } else {
        getElementById( 'auto' ).innerHTML = 'Stop Automatic';
      }

    }

    //called every 1/2 second
    var intervalId = setInterval(function () {

      //if automatic is off stop setInterval
      if(!automatic){
        clearInterval(intervalId);
        if(pt_br){
          getElementById( 'auto' ).innerHTML = 'Automático';
        } else {
          getElementById( 'auto' ).innerHTML = 'Automatic';
        }

      }

      //if open all doors
      if(allDoorsOpen){
        //clear (new game)
        clear();
        //alternate between 'change door' and 'without change door'
        if(alternateMode){
          mode = !mode;
        }
      }

      //if the first door was not chosen yet
      if( !firstChosenDoor ){
        setFirstChosenDoor( 'door-' + randomChoice( Doors.numbersIds ) );

      /**
      * This check a lot of things:
      * - if the second door was not chosen yet
      * - if the door with a zonk was already opened
      * - if all door are not alrady open
      * - check the mode if is 'without change door' go to the next 'if' that open all doors
      **/
      } else if ( !secondChosenDoor && firstOpened && !allDoorsOpen && mode ){

        if(oneHundredMode){

          setSecondChosenDoor(lastDoor);

          return false;
        }

        setSecondChosenDoor( 'door-'+ Doors.numbersIds.filter(function(element) {
          //remove the already chosen doors form the array

          return !( element === ( extractDoorNumber( firstOpened ) - 1) || element === ( extractDoorNumber( firstChosenDoor ) - 1) );

        } ) );

      }

      //check if the first door was already chosen
      if(firstChosenDoor || (mode && secondChosenDoor) ){
        openDoors();
      }

    }, 500);
  };

  getElementById('one-hundred').onclick = function(e) {

    //work as a interrupter
    oneHundredMode = !oneHundredMode;

    //Change button text
    if(oneHundredMode){
      if(pt_br){
        getElementById( 'one-hundred' ).innerHTML = '3 Portas';
      } else {
        getElementById( 'one-hundred' ).innerHTML = '3 Doors';
      }

    }

    //Change button text and remove classe .door-100 when back to the 3 doors mode
    if(!oneHundredMode){
      if(pt_br){
        getElementById( 'one-hundred' ).innerHTML = '100 Portas';
      } else {
        getElementById( 'one-hundred' ).innerHTML = '100 Doors';
      }
      removeClass('door-0', 'door-100');
      removeClass('door-1', 'door-100');
      removeClass('door-2', 'door-100');
    }

    clear();

    //set automatic to false when change the mode
    automatic = false;

  };

  //shows the about container
  getElementById('about').onclick = function(e) {
    e.preventDefault();
    //work as a interrupter
    showAbout = !showAbout;

    if(showAbout){
      removeClass('about-container','visuallyhidden');
    } else {
      addClass('about-container','visuallyhidden');
    }

  };

}(window));