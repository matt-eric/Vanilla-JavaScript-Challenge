/**
  JavaScript written to meet the deliverables in the README.md
  without making modifications to the index.html
 */

(function() {

  //Declarations of DOM elements
  const addButton = document.querySelector('.add');
  const submitButton = document.querySelector('[type=submit]');
  const ageInput = document.querySelector('[name=age]');
  const relationshipSelect = document.querySelector('[name=rel]');
  const smokerInput = document.querySelector('[name=smoker]');
  const householdMemberList = document.querySelector('.household');
  const householdList = document.querySelector( 'pre' );


  //Attribute adjustments made on initialization
  addButton.disabled = true;
  submitButton.disabled = true;
  householdMemberList.style.display = 'flex';
  householdMemberList.style.flexDirection = 'column';
  householdList.style.display = 'block';
  householdList.style.border = 'none';


  /**
   * Adds household member interface element to the <ol>
   */
  addButton.addEventListener( "click", ( e ) => {
    e.preventDefault();
    new MemberItemInterface( newMemberInterfaceId(), ageInput.value, relationshipSelect.value, smokerInput.checked ).composeAndAppend();
    setButtonsDisabledState( true, false );
    disableHouseholdButtons( true )
    resetForm();
  });


  /**
   * Combines json objects from the household member elements in the <ol> into an array and prepends it to the <pre> element
   */
  submitButton.addEventListener( "click", ( e ) => {
    e.preventDefault();
    submitHousehold();
    setButtonsDisabledState( true, true );
  });


  /**
   * Enables or disables the "add" button depending if the ageInput value meets validation requirements
   */
  ageInput.addEventListener( "input", ( e ) => {
    validateEntry() ? addButton.disabled = false : addButton.disabled = true;
  });


  /**
   * Enables or disables the "add" button depending if the relationshipSelect value meets validation requirements
   */
  relationshipSelect.addEventListener( "change", ( e ) => {
    validateEntry() ? addButton.disabled = false : addButton.disabled = true;
  });


  /**
   * Household member JSON
   * @constructor
   * @param {number} age - "age" value.
   * @param {string} relationship - "relationship" value.
   * @param {boolean} smoker - "smoker" input.
   */
  class MemberInfo {
    constructor( age, relationship, smoker ) {
      this.age = age;
      this.relationship = relationship;
      this.smoker = smoker;
    };
  };


  /**
   * Button Element
   * @constructor
   * @param {number} id - The ID assigned to the button being constructed.
   * @callback method - The method assigned to the onClick event. NOTE: Not sure if this is the correct way to document this.
   * @param {string} text - The text symbol assigned to the innerText of the button.
   */
  class Button {
    constructor( id, method, text ) {
      this.id = id;
      this.onClick = method;
      this.text = text;
    };
    compose(){
      const button = document.createElement( 'button' );
      this.id ? button.id = this.id : null;
      button.innerText = this.text;
      button.addEventListener( "click", ( e ) => this.onClick( e, this.id, button ) );
      return button;
    };
  };


  /**
   * List item element containing household member JSON
   * @constructor
   * @param {number} id - The ID assigned to the list item being constructed.
   * @param {number} age - The value from the age input.
   * @param {string} relationship - The value from the relationship input.
   * @param {boolean} smoker - The value from the smoker input.
   */
  class MemberItemInterface {
    constructor( id, age, relationship, smoker ) {
      this.id = id;
      this.age = age;
      this.relationship = relationship;
      this.smoker = smoker;
    };
    composeAndAppend(){
      const editButton = new Button( this.id, editMember, "✎" ).compose();
      const deleteButton = new Button( this.id, handleDeleteHouseholdMember, "x" ).compose();
      const householdMemberSpecifications = new Element( 'span', null, JSON.stringify( generateHouseholdMember( this.age, this.relationship, this.smoker ) ), null ).compose();
      const newMemberElement = new Element( 'li', this.id, null, [ editButton, deleteButton, householdMemberSpecifications ] ).compose();
      householdMemberList.appendChild( newMemberElement );
    };
  };


  /**
   * Dynamically creates any DOM element
   * @constructor
   * @param {string} type - The tpe of DOM element (e.g. 'div', 'button', 'li') being constructed.
   * @param {number} id - The ID assigned to the DOM element being constructed
   * @param {string} text - The innerText of the DOM element beig constructed
   * @param {Array} children - An array of DOM element nodes to be appended as children to the element being constructed.
   */
  class Element {
    constructor( type, id, text, children ) {
      this.type = type;
      this.id = id;
      this.text = text;
      this.children = children;
    };
    compose(){
      let element = document.createElement( this.type );
      this.id ? element.id = this.id : null;
      this.text ? element.innerText = this.text : null;
      this.children ? element = appendChildren( element, this.children ) : null;
      return element;
    };
  };


  /**
   * Appends an array of elements as children to a parent element.
   * @param {Object} parent - A DOM element node to which the children are to be appended.
   * @param {Array} children - An array of DOM element nodes to be used as child elements.
   */
  const appendChildren = ( parent, children ) => {
    for( let i=0; i<children.length; i++ ) {
      parent.appendChild( children[i] );
    };
    return parent;
  };


  /**
   * Creates a new MemberInfo object.
   * @param {number} age - Value of the "age" input.
   * @param {string} relationship - Value of the "relationship" input.
   * @param {boolean} smoker - Value of the "smoker" input.
   */
  const generateHouseholdMember = ( age, relationship, smoker ) => {
    return new MemberInfo( age, relationship, smoker );
  };


  /**
   * Determines if form validation requirements are met.
   */
  const validateEntry = () => {
    const relationshipOptions = Array.from( relationshipSelect.children ).map( o => o.value );
    relationshipOptions.shift();
    const relationshipOptionIsValid = relationshipOptions.includes( relationshipSelect.value );
    const ageValue = ageInput.value;
    const ageValueIsValid = Number( ageValue ) === parseInt( ageValue );
    return relationshipOptionIsValid && ageValueIsValid;
  };


  /**
   * Generates an ID for the member interface element.
   */
  const newMemberInterfaceId = () => {
    const existingMemberElements = Array.from( householdMemberList.children );
    const id = existingMemberElements.length ? Number( existingMemberElements[existingMemberElements.length-1].id )+1 : 0;
    return id;
  };


  /**
   * Determines if an existing household is to be edited or if an household being edited is to be confirmed when edit button is clicked.
   * @param {Object} e - Event fired when household member edit is initiated.
   * @param {number} id - The id of the household member being edited.
   * @param {Object} editButton - Edit button DOM element clicked to edit the household member.
   */
  const editMember = ( e, id, editButton ) => {
    const existingMemberElements = Array.from( householdMemberList.children );
    const memberToEdit = existingMemberElements.find( m => Number( m.id ) === id );
    const editableJSON = JSON.parse( memberToEdit.lastElementChild.innerText );
    if ( editButton.innerText === "✎" ) {
      startEditingHouseholdMember( editableJSON, editButton );
    } else {
      confirmEditHouseholdMember( memberToEdit, editButton );
    };
  };


  /**
   * Adds household members as individual list items to the <ol> and removes the composed household element.
   * @param {Object} e - Event from the click event that initiates editing the household.
   */
  const handleEditHousehold = ( e ) => {
    appendHouseholdMembersToList( getHouseholdMembersForEditing( e ) )
    disableHouseholdButtons( true );
    setButtonsDisabledState( true, false );
    resetForm()
  };


  /**
   * Accesses the innerText of the household element and returns the JSON for household members in an array.
   * @param {Object} e - Event from the click event that initiates editing the household.
   */
  const getHouseholdMembersForEditing = ( e ) => {
    const existingHouseholdElements = Array.from( householdList.children );
    const householdElementToEdit = existingHouseholdElements.find( h => h.id === e.target.id );
    const householdJSON = JSON.parse( householdElementToEdit.lastElementChild.innerText );
    return { householdArray: householdJSON, parentElement: householdElementToEdit };
  }


  /**
   * Uses the household members array to construct a list in the <ol> element.
   * @param {Object} householdAttributes - Contains the parent DOM element of the household being edited and a JSON array of household member attributes.
   */
  const appendHouseholdMembersToList = ( householdAttributes ) => {
    const { householdArray, parentElement } = householdAttributes
    for( let i=0; i<householdArray.length; i++ ) {
      const { age, relationship, smoker } = JSON.parse(parentElement.lastElementChild.innerText)[i];
      new MemberItemInterface( newMemberInterfaceId(), age, relationship, smoker ).composeAndAppend();
    };
    parentElement.remove();
  }


  /**
   * Composes a new member interface element and appends it to the list of existing elements.
   */
  const addHouseholdToEditableList = () => {
    new MemberItemInterface( newInterfaceId, ageInput.value, relationshipSelect.value, smokerInput.checked ).composeAndAppend();
  };


  /**
   * Sets addButton and submitButton as enabled or disabled.
   * @param {boolean} add - The value to which the display style property of the addButton will be set.
   * @param {boolean} submit - The value to which the display style property of the submitButton will be set.
   */
  const setButtonsDisabledState = ( add, submit ) => {
    addButton.disabled = add;
    submitButton.disabled = submit;
  };


  /**
   * Sets addButton and submitButton as displayed or not displayed.
   * @param {boolean} display - The value to which the display style property will be set.
   */
  const setButtonsDisplayState = ( display ) => {
    addButton.style.display = display;
    submitButton.style.display = display;
  }


  /**
   * Disables all buttons except for the "check" button for the household member currently being edited.
   */
  const disableAllOtherButtons = () => {
    const allOtherButtons = Array.from( document.querySelectorAll( 'button' ) ).filter( b => b.innerText !== "✓" );
    for( let i=0; i<allOtherButtons.length; i++ ) {
      allOtherButtons[i].disabled = true;
    };
  };


  /**
   * Enabled all buttons in the DOM.
   */
  const enableAllButtons = () => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    for( let i=0; i<allButtons.length; i++ ) {
      allButtons[i].disabled = false;
    };
  };


  /**
   * Adds the editable values to the input elements.
   * @param {Object} json -
   * @param {Object} editButton -
   */
  const startEditingHouseholdMember = ( json, editButton ) => {
    editButton.innerText = "✓";
    setButtonsDisplayState( 'none' );
    disableAllOtherButtons();
    const { age, relationship, smoker } = json;
    ageInput.value = age;
    relationshipSelect.value = relationship;
    smokerInput.checked = smoker;
  };


  /**
   * Applies the input element values to the household member element in the <ol>.
   * @param {Object} memberToEdit - the DOM element containing the JSON that is being edited.
   * @param {Object} editButton - the edit botton associated with the memberToEdit element.
   */
  const confirmEditHouseholdMember = ( memberToEdit, editButton ) => {
    editButton.innerText = "✎";
    memberToEdit.lastElementChild.innerText = JSON.stringify( generateHouseholdMember( ageInput.value, relationshipSelect.value, smokerInput.checked ) );
    resetForm();
    setButtonsDisplayState( 'block' );
    enableAllButtons();
    setButtonsDisabledState( true, false );
  };


  /**
   * onClick functionality for the household member delete button.
   * @param {Object} e - the event object from the onClick.
   * @param {number} id - the id of the button used to associate with the parent element that will be removed.
   */
  const handleDeleteHouseholdMember = ( e, id ) => {
    const existingMemberElements = Array.from( householdMemberList.children );
    const elementToRemove = existingMemberElements.find( m => Number( m.id ) === id );
    elementToRemove.remove();
    if ( !householdMemberList.children.length ) {
      submitButton.disabled = true;
      disableHouseholdButtons( false )
    };
  };


  /**
   * Compiles member list items into a an element used to represent the household.
   * @param {Object} json - An object containing the values of the input elements in the form.
   */
  const buildHouseholdElement = ( json ) => {
    const existingHouseholdElements = Array.from( householdList.children );
    const newHouseholdId = existingHouseholdElements.length ? Number( existingHouseholdElements[existingHouseholdElements.length-1].id )+1 : 0;
    const editButton = new Button( newHouseholdId, handleEditHousehold, "✎" ).compose();
    const householdJSON = new Element( 'div', null, `[${json}]`, null ).compose();
    const compiledHouseholdElement = new Element( 'div', newHouseholdId, null, [ editButton, householdJSON ] ).compose();
    return compiledHouseholdElement;
  };


  /**
   * Adds the household list to the <pre> element.
   */
  const submitHousehold = () => {
    const constructedHousehold = Array.from( householdMemberList.children );
    const mappedHousehold = Array.from( householdMemberList.children ).map( h => h.lastElementChild.innerText );
    const builtHousehold = buildHouseholdElement( mappedHousehold );
    householdList.prepend( builtHousehold );
    disableHouseholdButtons( false );
    clearCurrentMemberEntries();
    resetForm();
  };


  /**
   * Disable or enable edit buttons for household elements.
   * @param {boolean} bool - Determines if the household buttons should be enabled or disabled.
   */
  const disableHouseholdButtons = ( bool ) => {
    const existingHouseholdElements = Array.from( householdList.children );
    for( let i=0; i<existingHouseholdElements.length; i++ ) {
      existingHouseholdElements[i].firstElementChild.disabled = bool;
    };
  };


  /**
   * Removes all children from the household list composition <ol> element.
   */
  const clearCurrentMemberEntries = () => {
    while ( householdMemberList.firstChild ) {
      householdMemberList.removeChild( householdMemberList.firstChild );
    };
  };


  /**
   * Resets form inputs to default values.
   */
  const resetForm = () => {
    ageInput.value = "";
    relationshipSelect.value = "";
    smokerInput.checked = false;
  };

})();