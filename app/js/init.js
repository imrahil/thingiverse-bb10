// This flag will allow us to run the code in Ripple by dynamically swapping/disabling some device specific functions
// e.g. BBM, cover labels, toasts etc
inRipple = ((navigator.userAgent.indexOf('Ripple') >= 0) || window.tinyHippos);

config = {
    actionBarDark: true,
    controlsDark: true,
    listsDark: true,
    highlightColor: '#00BFFF',
    coloredTitleBar: true,

    // Fires "before" styling is applied and "before" the screen is inserted in the DOM
    onscreenready: function (element, id)
    {

        var screen = element.querySelector('[data-bb-type=screen]');
        // Set our styles
        screen.style['background-color'] = '#242424';
        screen.style.color = 'white';
        screen.style.fontSize = "2.5em";

        switch (id) {
            case 'featured':
                break;
            case 'popular':
                break;
            case 'newest':
                break;
        }

        /*
         // add the settings menu (swipedown menu) to each screen
         if (id != "about" && id != "settings" && id != "editcities") {
         insertMenu(screen);

         // Create the tab (city) buttons except if the user is on the "add city" page
         if (id != "add") {
         var actionbar = element.querySelector('[data-bb-type=action-bar]');
         createCitiesList(actionbar);
         }
         }
         */
    },

    // Fires "after" styling is applied and "after" the screen is inserted in the DOM
    ondomready: function (element, id)
    {

        switch (id) {
            case 'viewer':
                viewer.init();
                break;
            case 'featured':
                app.getThings(element, "featured");
                break;
            case 'popular':
                app.getThings(element, "popular");
                break;
            case 'newest':
                app.getThings(element, "newest");
                break;
        }

        /*
         if (id === "settings") {
         // Toggle the radio button to show the user's settings for the unit of temperature
         if (localStorage.getItem("temperatureUnit") == 'celsius') {
         document.getElementById("c").setChecked(true);
         } else
         document.getElementById("f").setChecked(true);
         }

         if (id === "editcities") {
         // Create a list of cities which the user can edit
         var cities = util.getSavedCities();

         if (cities.length == 0) {
         var temp = document.createElement('div');
         temp.className = 'panel';
         temp.innerText = 'No cities available. Please add a city';
         document.getElementById("citiesList").appendChild(temp);
         } else {
         var items = [], item;
         // create a city tab item object and pass this object to create a bbui tab item (the list of saved cities)
         for (i in cities) {
         item = document.createElement('div');
         item.setAttribute('data-bb-type', 'item');
         item.setAttribute('data-bb-title', cities[i].name);
         // Set the ID as the value of the saved city key in local storage,
         // this will allow us to get the right key to delete from local storage
         item.setAttribute('id', cities[i].key);
         item.innerHTML = cities[i].country;
         item.setAttribute('data-bb-img', "images/icons/marker.png");
         item.onbtnclick = function() {
         var selected = document.getElementById('citiesList').selected;
         if (selected) {
         localStorage.removeItem(selected.id);
         if (localStorage.getItem('defaultCityID') == selected.id) {

         };
         selected.remove();
         }
         };
         items.push(item);
         }
         document.getElementById('citiesList').refresh(items);
         }
         }
         */
    }
};

// Called by the webworks ready event
function initApp()
{

    // Need to check if the network is available in order to use the app
    // Otherwise, notify the user
    if (!window.navigator.onLine)
    {
        bbutils.showConnectionDialog();
    }

    // If app is running in Emulator...
    if (inRipple)
    {
        bbutils.showToast = function (msg)
        {
            console.log(msg);
        };
        // Used for debugging using console.log
    }
    else
    {
        // The app is being run on device and the following code can be executed

        // Set up the window cover (displayed when app is minimized)
        // Default cover image is for the all touch device
        var coverimage = 'local:///images/coverZ.png';

        // If the device has a 1:1 screen ratio, use the appropriate cover
        if (window.innerWidth === window.innerHeight)
            coverimage = 'local:///images/coverQ.png';

        blackberry.ui.cover.setContent(blackberry.ui.cover.TYPE_IMAGE, {
            path: coverimage
        });

        // When the application is put into the background,
        // update the window cover according to the desired cover image
        blackberry.event.addEventListener("entercover", function ()
        {
            blackberry.ui.cover.updateCover();
        });

    }

    // When app is first launched on the device
    var accessToken = localStorage.getItem("tviewerAccessToken");

    if (!accessToken)
    {
        bb.pushScreen('view/start.html', 'start');
    }
    else
    {
        console.log("Token: " + accessToken);
        window.accessToken = accessToken;
        bb.pushScreen('view/featured.html', 'featured');
    }
}

/*
 function insertMenu(screen) {
 var menu = document.createElement('div'), about = document.createElement('div'), settings = document.createElement('div'), invite = document.createElement('div');

 menu.setAttribute('data-bb-type', 'menu');

 // About button
 about.setAttribute('data-bb-type', 'menu-item');
 about.setAttribute('data-bb-img', 'images/icons/info.png');
 about.setAttribute('data-bb-pin', 'left');
 about.innerHTML = 'About';
 about.onclick = showScreen.about;

 // Invite to Download Button
 invite.setAttribute('data-bb-type', 'menu-item');
 invite.setAttribute('data-bb-img', 'images/icons/bbm.png');
 invite.innerHTML = 'Invite';
 invite.onclick = function() {
 bbm.inviteToDownload()
 };

 // Settings Button
 settings.setAttribute('data-bb-type', 'menu-item');
 settings.setAttribute('data-bb-img', 'images/icons/settings.png');
 settings.setAttribute('data-bb-pin', 'right');
 settings.innerHTML = 'Settings';
 settings.onclick = showScreen.settings;

 // Add menu
 menu.appendChild(about);
 menu.appendChild(invite);
 menu.appendChild(settings);
 screen.appendChild(menu);
 }

 showScreen = {
 about : function() {
 bb.pushScreen('about.html', 'about');
 // show info screen
 },
 addItem : function() {
 bb.pushScreen('add.html', 'add');
 // add new item
 },
 settings : function() {
 bb.pushScreen('settings.html', 'settings');
 },
 addCity : function() {
 bb.pushScreen('add.html', 'add');
 },
 editCities : function() {
 bb.pushScreen('editcities.html', 'editcities');
 // show info screen
 },
 main : function() {
 bb.pushScreen('featured.html', 'main');
 },
 pop : function() {
 bb.popScreen();
 }
 };
 */

var bbutils = {
    showToast: function (str)
    {

        //create a div to overlay so user can't click behind it
        var message, buttonText = "Ok", toastId;
        message = str;

        var onToastDismissed = function ()
        {
            console.log('Toast disappeared: ' + toastId);
        }
        var options = {
            buttonText: buttonText,
            dismissCallback: onToastDismissed,
            //buttonCallback : goToMainScreen,
            timeout: 4000
        };
        toastId = blackberry.ui.toast.show(message, options);
    },

    loadShareCard: function ()
    {
        // Load the share card
        request = {
            action: 'bb.action.SHARE',
            target_type: ["CARD"],
            mime: "text/plain",
            data: bbm.messageText
        }

        blackberry.invoke.card.invokeTargetPicker(request, "Broadcast the Weather",

            // success
            function (e)
            {
                console.log("Invocation successful");
            },

            // error
            function (e)
            {
                console.log("Invocation error: " + e);
            });
    },

    showConnectionDialog: function ()
    {
        if (!inRipple)
        {
            function dialogCallBack(selection)
            {
                // alert(selection.return);
            }

            try
            {
                blackberry.ui.dialog.standardAskAsync("To use this app, please enable network connections", blackberry.ui.dialog.D_OK, dialogCallBack, {
                    title: "Network Connection Required"
                });
            }
            catch (e)
            {
                alert("Exception in standardDialog: " + e);
            }
        }
        else
            console.log("Network Connection Required");
    }
}