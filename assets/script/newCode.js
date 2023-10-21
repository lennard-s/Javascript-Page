
let data = {
    'quality': ['low rendering', 'medium rendering'],
    'low rendering': ['components', 'composition'],
    'components': ['eyes', 'mouths'],
    'composition': ['head', 'torso'],
    'medium rendering': ['is sitting', 'is standing'],
    'is sitting': ['facing forward', 'facing backward'],
    'is standing': ['is a girl', 'is a boy']
};


//////////////// START OF HELPER FUNCTIONS ////////////////

// getElementById shortcut
function $(id) {
    return document.getElementById(id);
}

function buildSelector(dom, dataIndex) {
    // check to see if the selector being updated is the last child
    // repeat this until there are no more nextSiblings
    while (dom.nextSibling != null) {
        dom.nextSibling.remove();
    }

    // check to see if there is a next set of options in the dataset
    if (data[dataIndex]) {

        let selectEle = document.createElement('select');
        selectEle.setAttribute('id', 'selector' + ($('selectorForm').childElementCount));
        selectEle.setAttribute('onchange', 'mainDoer(this)');
        selectEle.setAttribute('style', 'top:8px; left:200px');
        selectEle.setAttribute('title', dataIndex);
    
        let options = data[dataIndex];
    
        // create first default option
        let defOpt = document.createElement('option');
        let defText = document.createTextNode('------');
        defOpt.appendChild(defText);
    
        selectEle.appendChild(defOpt);
    
        // loop through strings in data set to populate selector
        for (let i = 0; i < options.length; i++) {
            // create option tag
            let optEle = document.createElement('option');
    
            // create textNode from data set
            let optionText = document.createTextNode(options[i]);
    
            // put text in option tag & set value to match
            optEle.appendChild(optionText);
            optEle.setAttribute('value', options[i]);
    
            // place option tag within 'selector0'
            selectEle.appendChild(optEle);
        }
    
        // append select to form
        $('selectorForm').appendChild(selectEle);
    }
}

function buildListItems(presenterElement) {
    // loop through the values from the selectors on the page
    // build the list items based on those values

    let listEle = document.createElement('ul');
    listEle.setAttribute('id', 'choicesList');

    let selectorsArray = document.getElementsByTagName('select');
    
    for (let i = 0; i < selectorsArray.length; i++) {
        let userData = selectorsArray[i].value;
        console.log(userData);
        
        let listItem = document.createElement('li');
        listItem.setAttribute('id', ('listItem' + i));
        let itemText = document.createTextNode(userData);
        listItem.appendChild(itemText);
        listEle.appendChild(listItem);
    }

    presenterElement.appendChild(listEle);
}

function drawingGenerator() {
    // only care about the last option
    let finalOption = $('choicesList').lastChild.textContent;

    // check to see if there is already an image on the page
    if (!document.body.contains($('imageContainer'))) {
        // create new div to house the image
        let imageContainer = document.createElement('div');
        imageContainer.id = "imageContainer";
        imageContainer.style.top = 1000 + 'px';
        // create a new image tag and append the appropriate image in there
        let sketch = document.createElement('img');
        sketch.id = "sketch";
        sketch.src = "assets/images/" + finalOption + ".jpg";
        sketch.alt = "a sketch drawn by Lennard S.";
        sketch.style.opacity = 0.1;

        imageContainer.appendChild(sketch);

        document.body.appendChild(imageContainer);
    } else {
        // get old image
        let oldSketch = $('imageContainer').childNodes[0];
        // create new image
        let newSketch = document.createElement('img');
        newSketch.id = "sketch";
        newSketch.src = "assets/images/" + finalOption + ".jpg";
        newSketch.alt = "a drawing by Lennard S."
        newSketch.style.opacity = 0.1;

        $('imageContainer').replaceChild(newSketch, oldSketch);
    }
}

function buildDrawButt(presenterElement) {
    let drawButt = document.createElement('button');
    drawButt.setAttribute('id', 'drawButt');
    drawButt.setAttribute('type', 'button');
    drawButt.setAttribute('onclick', 'drawingGenerator(); buildFormTwo(); requestAnimationFrame(fadeFrame); requestAnimationFrame(slideFrame);');
    drawButt.appendChild(document.createTextNode('DRAW THE DRAWING'))
    presenterElement.appendChild(drawButt);
}

////// ANIMATION SECTION //////
function fadeFrame() {
    let target = $('sketch');

    let opa = parseFloat(target.style.opacity);

    if (opa < 1) {
        target.style.opacity = opa + 0.005;
        requestAnimationFrame(fadeFrame);
    }
}

function slideFrame() {
    let target = $('imageContainer');

    let pos = parseInt(target.style.top);

    if (pos > 0) {
        target.style.top = pos - 10 + 'px';
        requestAnimationFrame(slideFrame);
    }
}

////// STORAGE SECTION //////
function storeUserData(firstName, lastName) {
    if (window.localStorage) {
        localStorage.setItem('fname', firstName);
        localStorage.setItem('lname', lastName);
    } else { 
        SetCookie(fname, firstName);
        SetCookie(lname, lastName);
    }
}

function getUserData(key) {
    if (window.localStorage) {
        if (localStorage.getItem(key)) {
            return localStorage.getItem(key);
        }
    } else { 
        if (GetCookie(key)) {
            return GetCookie(key);
        }
    }
    return false;
}

function clearUserData() {
    if (window.localStorage) {
        localStorage.removeItem('fname');
        localStorage.removeItem('lname');
    } else { 
        DeleteCookie('fname');
        DeleteCookie('lname');
    }

    $('fname').value = '';
    $('lname').value = '';
}

/// FORM TWO HELPER FUNCTIONS ///
function buildInput(id, formElement) {
    let inputEle = document.createElement('input');
    inputEle.type = 'text';
    inputEle.id = id;
    inputEle.name = id;

    if (getUserData(id)) {
        inputEle.value = getUserData(id);
    }

    formElement.appendChild(inputEle);
}

function buildLabel(forAtt, text, formElement) {
    let labelEle = document.createElement('label');
    labelEle.setAttribute('for', forAtt);
    let textNode = document.createTextNode(text)
    labelEle.appendChild(textNode);

    formElement.appendChild(labelEle);
}

function buildButt(value, type, formElement) {
    let buttEle = document.createElement('input');
    buttEle.type = type;
    buttEle.value = value;
    buttEle.id = value;

    formElement.appendChild(buttEle);
}

function buildRadio(id, formElement) {
    let radioEle = document.createElement('input');
    radioEle.type = 'radio';
    radioEle.id = id;
    radioEle.name = 'opinion';
    radioEle.value = id;

    if (id === 'neutral') {
        radioEle.checked = true;
    }

    formElement.appendChild(radioEle);
    buildLabel(id, 'I feel ' + id + ' about this drawing!', formElement);  
}

function verifyForm() {
    let userFName = $('fname').value;
    let userLName = $('lname').value;
    
    // make sure the two fields have text in them 
    if (userFName == "") {
        $('fname').setAttribute('style', 'background-color: pink');
        return false;
    } else if (userLName == "") {
        $('lname').setAttribute('style', 'background-color: pink');
        return false;
    } else {
        storeUserData(userFName, userLName);
    }
    return true;
}

function buildFormTwo() {
    if (!document.body.contains($('userForm'))) {
        let formEle2 = document.createElement('form');
        formEle2.id = "userForm";
        formEle2.setAttribute('target', '_blank');
        formEle2.setAttribute('method', 'get');
        formEle2.setAttribute('action', 'assets/formSubmit/landingPage.html');
        formEle2.setAttribute('onsubmit', 'return verifyForm()');
    
        formEle2.appendChild(document.createElement('br'));
        buildRadio('bad', formEle2);
        formEle2.appendChild(document.createElement('br'));
        buildRadio('neutral', formEle2);
        formEle2.appendChild(document.createElement('br'));
        buildRadio('good', formEle2);
        formEle2.appendChild(document.createElement('br'));
        formEle2.appendChild(document.createElement('br'));
        buildLabel('fname', 'First Name:', formEle2);
        buildInput('fname', formEle2);
        formEle2.appendChild(document.createElement('br'));
        buildLabel('lname', 'Last Name:', formEle2);
        buildInput('lname', formEle2);
        formEle2.appendChild(document.createElement('br'));
        buildButt('Submit', 'submit', formEle2);
        buildButt('Clear', 'button', formEle2);

        $('form1').appendChild(formEle2);

        $('Clear').setAttribute('onclick', 'clearUserData()')
    }
}

//////////////// END OF THE HELPER FUNCTIONS ////////////////


//////////////// START OF THE MAIN FUNCTION ////////////////

function mainDoer(dom) {
    ///////////// BUILD FORM /////////////
    if (!document.body.contains($('selectorForm'))) {
        let formEle = document.createElement('form');
        formEle.setAttribute('id', 'selectorForm');
        formEle.setAttribute('method', 'get');
        formEle.setAttribute('action', 'index.html');
        // append form to div
        $('form1').appendChild(formEle);
    }

    ///////////// BUILD SELECTORS /////////////
    let dataIndex;
    if ($('selectorForm').childElementCount === 0) {
        dataIndex = Object.keys(data)[0];
        buildSelector(dom, dataIndex);
    } else {
        dataIndex = dom.value;
        buildSelector(dom, dataIndex);
    }

    ///////////// PRESENT USER CHOICES /////////////
    // if there are no more options in the dataset, present info to user
    if (document.body.contains($('presenterDiv'))) {
        $('presenterDiv').remove();
    }
    if (document.body.contains($('userForm'))) {
        $('userForm').remove();
    }

    if ((!data[dataIndex]) && (dataIndex != '------')) {
        let presenterDiv = document.createElement('div');
        presenterDiv.id = "presenterDiv";
        
        let choicePres = document.createElement('p');
        choicePres.setAttribute('id', 'choiceIntro');
        let choiceString = document.createTextNode('You want the sketch to have the following features: ');
        choicePres.appendChild(choiceString);
        
        presenterDiv.appendChild(document.createElement('br'));
        presenterDiv.appendChild(choicePres);
        
        buildListItems(presenterDiv);
        buildDrawButt(presenterDiv);

        $('form1').appendChild(presenterDiv);
    }
}