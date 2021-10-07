"use strict"

//#########################################################
//A0 (get base HTML elements / small helper(s))

/**
 * returns p HTML Element
 * @param {string} text 
 * @param {Array} cssClasses 
 * @returns {HTMLBaseElement}
 */
function getParargaph(text, cssClasses = []) {
    let paragraph = document.createElement('p');
    paragraph.classList = cssClasses.join(' ');
    paragraph.appendChild(document.createTextNode(text));

    return paragraph;
}

/**
 * returns span HTML Element
 * @param {string} text 
 * @param {Array} cssClasses 
 * @returns {HTMLBaseElement}
 */
function getSpan(text = '', cssClasses = []) {
    let span = document.createElement('span');
    span.classList = cssClasses.join(' ');
    span.appendChild(document.createTextNode(text));

    return span;
}

/**
 * returns div HTML Element
 * @param {Array} cssClasses 
 * @returns {HTMLBaseElement}
 */
function getDiv(cssClasses = []) {
    let div = document.createElement('div');
    div.classList = cssClasses.join(' ');

    return div;
}

/**
 * returns string with first letter uppercase
 * @param {string} string 
 * @returns {string}
 */
function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//#####################################
//A1 - USER CARDS

/**
 * returns card-title
 * @param {Object} user
 * @returns  {HTMLBaseElement}
 */
function getCardTitle(user) {
    let title = getParargaph(user.motto, [
        'card-title', 'm-0', 'p-2', 'bg-danger-light', 'text-danger', 'text-center', 'fw-bold'
    ]);

    return title;
};

/**
 * returns card-subtitle
 * @param {Object} user
 * @returns  {HTMLBaseElement}
 */
function getCardSubtitle(user) {
    let subtitle = getParargaph(`${user.anrede} ${user.name} aus ${user.ort}`, [
        'card-subtitle', 'm-0', 'p-2', 'bg-success-light', 'text-success', 'fw-bold'
    ]);

    return subtitle;
};

/**
 * returns card-text
 * @param {Object} user 
 * @param {boolean} hidden
 * @returns {HTMLBaseElement}
 */
function getCardText(user, hidden = false) {
    let cardTextBody = getDiv(['card-text']);
    let birthdayBox = getDiv(['border', 'mb-2', 'p-2']);
    if (hidden) {
        cardTextBody.classList.add('d-none');
    }

    birthdayBox.appendChild(getParargaph('Geburtstag am: ', ['d-inline']));
    birthdayBox.appendChild(getSpan(user.geburtstag, ['date-box']));
    cardTextBody.appendChild(birthdayBox);
    cardTextBody.appendChild(getParargaph('Kurze Info: ', ['mb-0', 'p-2']));
    cardTextBody.appendChild(getParargaph(user.info, ['mt-0', 'p-2']));

    return cardTextBody;
};

/**
 * returns card
 * @param {Object} user 
 * @returns {HTMLBaseElement}
 */
function getCard(user) {
    let card = getDiv(['card', 'col-md-5', 'm-0', 'my-sm-1', 'm-md-2', 'p-0', 'border', 'rounded']);
    let cardBody = getDiv(['card-body', 'p-0']);

    card.appendChild(cardBody);
    cardBody.appendChild(getCardTitle(user));
    cardBody.appendChild(getCardSubtitle(user));
    cardBody.appendChild(getCardText(user));

    return card;
};

/**
 * sets card element per user in JSON on container
 * @param {string} cardsContainerId
 * @param {JSON} responseJSON
 */
function setUserCards(cardsContainerId, responseJSON) {
    let cardsContainer = document.getElementById(cardsContainerId);

    for (let user of responseJSON.users) {
        cardsContainer.appendChild(getCard(user));
    }
};

let usersRequest = new XMLHttpRequest();

//eventlistener for creating of user cards
usersRequest.addEventListener('load', () => {
    switch (usersRequest.status) {
        case 200:
            setUserCards('user-cards', usersRequest.response); //A1 content
            setUserAge(); //A3 content
            break;
        default:
            console.log(`XMLHttp Request Fehler (${usersRequest.status})`);
            break;
    }
});

//setTimeout 0.1s for clean loading
setTimeout(() => {
    usersRequest.open('GET', 'users.json', true);
    usersRequest.responseType = 'json';
    usersRequest.setRequestHeader("Accept", "application/json");
    usersRequest.send();
}, 100);


//#####################################
//A2 - FORM VALIDATION
//validation mesages created by:
//data-name attribute on HTML form elements 
//data-regex attribute on HTML form elements

//regex pattern
const lastNameRegEx = /^(Reinhold)$/i;
const firstNameRegEx = /^(Stephan)$/i;
const mailRegEx = /@/;
const phoneRegEx = /^(|[0-9]{5,})$/;

/**
 * removes all form warnigs and success box
 */
function clearFeedback() {
    for (let warning of document.getElementsByClassName('form-warning')) {
        warning.parentElement.removeChild(warning);
    }
    for (let success of document.getElementsByClassName('form-success')) {
        success.parentElement.removeChild(success);
    }
}

/**
 * sets warning message before input
 * @param {HTMLBaseElement} formElement 
 * @param {string} warningText 
 */
function setFormWarning(formElement, warningText) {
    clearFeedback();
    formElement.parentElement.prepend(
        getParargaph(warningText, [
            'form-warning', 'text-danger', 'fw-bolder'
        ])
    );
}

/**
 * returns successbox with text value
 * @param {HTMLBaseElement} sucessBox 
 * @param {formInputElement} input 
 * @returns {HTMLBaseElement}
 */
function appendTextSuccess(successBox, input) {
    if (input.value !== '' || input.value) {
        successBox.appendChild(
            getParargaph(input.attributes['data-name'].value + ': ' + input.value)
        );
    } else {
        successBox.appendChild(
            getParargaph(input.attributes['data-name'].value + ': keine Angabe')
        );
    }

    return successBox;
}

/**
 * returns successbox with checked radio value
 * @param {HTMLBaseElement} successBox 
 * @param {formInputElement} input 
 * @returns {HTMLBaseElement}
 */
function appendRadioSuccess(successBox, input) {
    if (input.checked) {
        successBox.appendChild(
            getParargaph(
                input.attributes['data-name'].value + ': ' + input.previousElementSibling.textContent
            )
        );
    }

    return successBox;
}

/**
 * sets input values on valid form
 * @param {HTMLBaseElement} form 
 */
function setFormSuccess(form) {
    clearFeedback();
    let successBox = getDiv([
        'form-success', 'm-0', 'my-sm-1', 'm-md-2', 'col-sm-6', 'col-lg-4', 'bg-success-light'
    ]);

    successBox.appendChild(getParargaph('Vielen Dank!'))
    for (const input of form) {
        switch (input.type) {
            case 'text':
                successBox = appendTextSuccess(successBox, input);
                break;
            case 'radio':
                successBox = appendRadioSuccess(successBox, input);
                break;
            default:
                break;
        }
    }

    form.parentElement.append(successBox);
}

/**
 * sets warning when not valid
 * returns if text is valid
 * @param {HTMLInputElement} formInputElement 
 * @param {RegExp} regExPattern  
 * @param {boolean} isRequired 
 * @returns {boolean}
 */
function validateFormTextInput(formInputElement, regExPattern, isRequired = true) {
    if (isRequired && (formInputElement.value === '' || !formInputElement.value)) {
        setFormWarning(
            formInputElement,
            `${formInputElement.attributes['data-name'].value} darf nicht leer sein.`
        );
        formInputElement.focus();

        return false;
    } else if (!regExPattern.test(formInputElement.value)) {
        setFormWarning(
            formInputElement,
            formInputElement.attributes['data-regex'].value
        );
        formInputElement.focus();

        return false;
    }

    return true;
}

/**
 * sets warning when not valid
 * returns if radios are valid
 * @param {NodeList} formRadioElements 
 * @returns {boolean}
 */
function validateFormRadioInput(formRadioElements) {
    for (let i = 0; i < formRadioElements.length; i++) {
        if (formRadioElements[i].checked) {
            return true;
        }
    }

    setFormWarning(
        formRadioElements[0].parentElement.parentElement,
        `${formRadioElements[0].attributes['data-name'].value} muss ausgewaehlt werden.`
    );
    formRadioElements[0].focus();
    return false;
}

/**
 * calls validation function on inputs
 * returns if is form valid
 * @returns {boolean}
 */
function validateFormFields() {
    switch (false) {
        case validateFormRadioInput(document.getElementsByName('salutation-form-radio')):
        case validateFormTextInput(document.getElementById('lname-form-input'), lastNameRegEx):
        case validateFormTextInput(document.getElementById('fname-form-input'), firstNameRegEx):
        case validateFormTextInput(document.getElementById('mail-form-input'), mailRegEx):
        case validateFormTextInput(document.getElementById('phone-form-input'), phoneRegEx, false):
            return false
        default:
            break;
    }

    return true;
}

//submit - eventlistener
document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (validateFormFields()) {
        setFormSuccess(event.target);
    }
    event.preventDefault();
});


//#####################################
//A3 - USER AGE in USER CARDS

/**
 * returns age in years
 * birthdayString format --> YYYY.MM.DD
 * @param {string} birthdayString
 * @returns {number}
 */
function getDateDiffInYears(birthdayString) {
    let now = new Date();
    let oldDate = new Date();
    oldDate.setFullYear(birthdayString.split('.')[0]);
    oldDate.setMonth(birthdayString.split('.')[1] - 1);
    oldDate.setMonth(birthdayString.split('.')[2]);
    let dateDiff = new Date(now - oldDate);
    let userAge = Math.abs(dateDiff.getFullYear() - 1970);

    return userAge;
}

/**
 * sets user age in years after birthday date in user cards
 * called in user request eventlistener in A1
 * (user cards created by XMLHttpRequest, load order!!!)
 */
function setUserAge() {
    let ageString = '';
    let birthdayNodes = document.querySelectorAll('.date-box');

    for (let i = 0; i < birthdayNodes.length; i++) {
        ageString = ` (${getDateDiffInYears(birthdayNodes[i].textContent)}j. alt)`;
        birthdayNodes[i].appendChild(document.createTextNode(ageString));
    }
}