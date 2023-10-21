
// getElementById shortcut
function $(id) {
    return document.getElementById(id);
}

let data = {
    init: ['low quality', 'medium quality'],
    'low quality': ['tall height', 'short height'],
    'tall height': ['wearing backpack', 'wearing hat'],
    'short height': ['has hands', 'has feet'],
    'medium quality': ['is sitting', 'is standing'],
    'is sitting': ['facing forward', 'facing backward'],
    'is standing': ['has a umbrella', 'has a katana']
};


// This is the function that builds the selectors
function mainDoer(dom) {
    // check to see if this is the first selector
    if ($('form1').childElementCount === 0) {
        // create form element
        let formEle = document.createElement('form');
        formEle.setAttribute('id', 'selectorForm');
        formEle.setAttribute('method', 'get');
        formEle.setAttribute('action', 'index.html');

        // create select element
        let firstSelect = document.createElement('select');
        firstSelect.setAttribute('id', 'selector0');
        firstSelect.setAttribute('onchange', 'mainDoer(this)');
        firstSelect.setAttribute('style', 'top:8px; left:200px')
        firstSelect.setAttribute('title', 1);

        let init = data[Object.keys(data)[0]];

        // create first default option
        let defOpt = document.createElement('option');
        let defText = document.createTextNode('------');
        defOpt.appendChild(defText);

        firstSelect.appendChild(defOpt);

        // loop through initial strings in data set to populate initial selector
        for (let i = 0; i < init.length; i++) {
            // create option tag
            let optEle = document.createElement('option');

            // create textNode from data set
            let optionText = document.createTextNode(data.init[i]);

            // put text in option tag & set value to match
            optEle.appendChild(optionText);
            optEle.setAttribute('value', data.init[i]);

            // place option tag within 'selector0'
            firstSelect.appendChild(optEle);
        }

        // append select to form
        formEle.appendChild(firstSelect);

        // append form to div
        $('form1').appendChild(formEle);
        
        // add event listener to selector
        $('selector0').addEventListener("change", function() { presenter(this) });

    } else {
        // check to see if the selector being updated is the last child of ??
        // repeat this until there are no more nextSiblings
        while (dom.nextSibling != null) {
            dom.nextSibling.remove();
        }

        // // check to see if there are already 3 selectors on the page
        // console.log($('selectorForm').children.length)
        // // if ($('form1').children.length == 3) {
        // //     return;
        // // }
        
        // get the value of whatever option the user clicked on
        let userChoice = (dom.value);

        ///////////////// STORAGE SECTION /////////////////
        ////////////////       OLD        //////////////////
        

        // add userChoice to either localStorage or Cookies
        if (window.localStorage) {
            localStorage.setItem($('selectorForm').childElementCount, userChoice);
        } else { 
            SetCookie($('selectorForm').childElementCount.toString(), userChoice);
        }

        ///////////////// ADDITIONAL SELECTORS SECTION /////////////////

        // create new selector
        let selEle = document.createElement('select');
        selEle.setAttribute('onchange', 'mainDoer(this)');
        selEle.setAttribute('id', userChoice);
        selEle.setAttribute('title', $('selectorForm').childElementCount + 1);
        
        // create first default option
        let defOpt = document.createElement('option');
        let defText = document.createTextNode('------');
        defOpt.appendChild(defText);

        selEle.appendChild(defOpt);

        // retrieve options from data object
        let options = data[userChoice];
        
        // use their choice to populate the new selector with options
        for (let i = 0; i < options.length; i++) {
            // create option tag
            let optEle = document.createElement('option');
            
            // create textNode from data set
            let optionText = document.createTextNode(options[i]);
            
            // put text in option tag & set value to match
            optEle.appendChild(optionText);
            optEle.setAttribute('value', options[i]);
            
            // place option tag within new selector
            selEle.appendChild(optEle);
        }
        
        // add new selector to page
        $('selectorForm').appendChild(selEle);

        // add event listener to selector
        $(userChoice).addEventListener("change", function() { presenter(this) });
    }
}

////////// EVENTLISTENER CODE //////////
function presenter(dom) {
    // get the user data from either localstorage or cookies
    let userData;
    let listItemID = ('item' + dom.title);

    ////// CODE TO POPULATE AND MODIFY THE LIST DYNAMICALLY ////////
    if (window.localStorage) {
        // new code
        // for (const key in localStorage) {
        //     if (localStorage.getItem(key) === '------') {
        //         localStorage.removeItem(key);
        //     }
        // }
        // // old code
        // if the first selector gets put back to the default option, clear the storage
        if (localStorage.getItem('1') === '------') {
            localStorage.clear();
            // also clear the presenter list
            while ($('choicesList').firstChild) {
                $('choicesList').removeChild($('choicesList').firstChild);
            }
            // and delete the button
            $('drawButt').remove();
        }
        userData = localStorage.getItem(dom.title);
    } else {
        // if the first selector gets put back to the default option, clear the storage
        if (GetCookie(1) === '------') {
            // loop through however many selectors there are 
            // and delete the cookies with the same names
            for (let i = 0; i < $('selectorForm').childElementCount; i++) {
                DeleteCookie(i);
            }
            // also clear the presenter list
            while ($('choicesList').firstChild) {
                $('choicesList').removeChild($('choicesList').firstChild);
            }
            // and delete the button
            $('drawButt').remove();
        } 
        userData = GetCookie(dom.title);
    }

    // check if the presenter element is not already on the page, create it 
    if (!document.body.contains($('choiceIntro'))) {
        // create new p tag in form1 div to hold the "these are your choices" stuff
        let choicePres = document.createElement('p');
        choicePres.setAttribute('id', 'choiceIntro');
        let choiceString = document.createTextNode('You want the sketch to have the following features: ');
        choicePres.appendChild(choiceString);
        
        // create list tag to hold options chosen
        let listEle = document.createElement('ul');
        listEle.setAttribute('id', 'choicesList');

        // create first list item
        let firstItem = document.createElement('li');
        firstItem.setAttribute('id', (listItemID));
        let itemText = document.createTextNode(userData);
        // add text to the list item
        firstItem.appendChild(itemText);
        listEle.appendChild(firstItem);

        $('form1').appendChild(document.createElement('br'));
        $('form1').appendChild(choicePres);
        $('form1').appendChild(listEle);

    } else { 
        // presenter element is already on the page, place user choice in there
        // if this user choice is not already on the page, create it
        if (!$('choicesList').contains($(listItemID))) {
            // create list item
            let listItem = document.createElement('li');
            listItem.setAttribute('id', (listItemID));
            // create new textnode containing the text from localStorage or cookies
            let itemText = document.createTextNode(userData);
            // add text to the list item
            listItem.appendChild(itemText);
            $('choicesList').appendChild(listItem);
        } else { // user choice already exists, replace text node inside
            // get old textNode
            let oldText = $(listItemID).childNodes[0];

            let newText = document.createTextNode(userData);
            // if new text is the default ("------"), delete node and button
            if (userData === "------") {
                if (dom.nextElementSibling) {
                    console.log(dom.nextElementSibling);
                    dom.nextElementSibling.remove();
                }
                if (document.body.contains($('img'))) {
                    $('img').remove();
                }
                $(listItemID).remove();
                $('drawButt').remove();
                $('userForm').remove();
            } else {
                $(listItemID).replaceChild(newText, oldText);
            }
        }
    }

    ///// DRAW BUTTON CODE /////         v this should not be hardcoded buddy boy 
    if ($('choicesList').children.length == 3 && !document.body.contains($('drawButt'))) {
        // build and place button
        let drawButt = document.createElement('button');
        drawButt.setAttribute('id', 'drawButt');
        drawButt.setAttribute('type', 'button');
        drawButt.setAttribute('onclick', 'drawingGenerator(); secondFormBuilder()');
        drawButt.appendChild(document.createTextNode('DRAW THE DRAWING'))
        $('form1').appendChild(drawButt);
    }
}

function drawingGenerator() {
    // only care about the last option
    let finalOption = $('choicesList').lastChild.textContent;

    // check to see if there is already an image on the page
    if (!document.body.contains($('imageContainer'))) {
        // create new div to house the image
        let imageContainer = document.createElement('div');
        imageContainer.id = "imageContainer";
        // create a new image tag and append the appropriate image in there
        let sketch = document.createElement('img');
        sketch.id = "sketch";
        sketch.src = "assets/images/" + finalOption + ".jpg";
        sketch.alt = "a sketch drawn by Lennard S.";

        imageContainer.appendChild(sketch);

        document.body.appendChild(imageContainer);
    } else {
        // get old image
        let oldSketch = $('imageContainer').childNodes[0];
        // create new image
        let newSketch = document.createElement('img');
        newSketch.src = "assets/images/" + finalOption + ".jpg";
        newSketch.alt = "a sketch drawn by Lennard S."

        $('imageContainer').replaceChild(newSketch, oldSketch);
    }
}


// build the form to hold user info
function secondFormBuilder() {
        // check if form2 already has already been generated
        if (!document.body.contains($('userForm'))) {
            // create userForm
            let formEle2 = document.createElement('form');
            formEle2.id = "userForm";
            formEle2.setAttribute('method', 'get');
            formEle2.setAttribute('action', 'index.html');
        
            let input1 = document.createElement('input');
            let input2 = document.createElement('input');
            input1.type = 'text';
            input2.type = 'text';
            input1.id = 'fname';
            input2.id = 'lname';
            input1.name = 'fname';
            input2.name = 'lname';
            
            let label1 = document.createElement('label');
            let label2 = document.createElement('label');
            label1.setAttribute('for', 'fname');
            label2.setAttribute('for', 'lname');
            let fnameText = document.createTextNode("First Name:")
            let lnameText = document.createTextNode("Last Name:")
            label1.appendChild(fnameText);
            label2.appendChild(lnameText);
        
            // submit button
            let submitButt = document.createElement('input');
            submitButt.type = 'submit';
            submitButt.value = 'Submit';
            submitButt.setAttribute('onclick', 'verify(event)');
        
            formEle2.appendChild(label1);
            formEle2.appendChild(input1);
            formEle2.appendChild(document.createElement('br'));
            formEle2.appendChild(label2);
            formEle2.appendChild(input2);
            formEle2.appendChild(document.createElement('br'));
            formEle2.appendChild(submitButt);
        
            $('form2').appendChild(formEle2);
        }
}

function verify(e) {
    e.preventDefault();

    let userFName = $('fname').value;
    let userLName = $('lname').value;
    
    // make sure the two fields have text in them 
    if (userFName == "") {
        $('fname').setAttribute('style', 'background-color: pink');
    } 
    if (userLName == "") {
        $('lname').setAttribute('style', 'background-color: pink');
    }
}




