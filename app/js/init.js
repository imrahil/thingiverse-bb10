// This flag will allow us to run the code in Ripple by dynamically swapping/disabling some device specific functions
// e.g. BBM, cover labels, toasts etc
inRipple = ((navigator.userAgent.indexOf('Ripple') >= 0) || window.tinyHippos);

config = {
    actionBarDark: true,
    controlsDark: true,
    listsDark: true,
    highlightColor: '#00BFFF',

    // Fires "before" styling is applied and "before" the screen is inserted in the DOM
    onscreenready: function (element, id, params)
    {
        params = typeof params !== 'undefined' ? params : '';

        var screen = element.querySelector('[data-bb-type=screen]');
        // Set our styles
        screen.style['background-color'] = '#242424';
        screen.style.color = 'white';
        screen.style.fontSize = "2.5em";

        if (id != 'info' && id != 'settings' && id != 'viewer')
        {
            screenTools.addTopMenu(screen);
        }

        if ((id == 'featured' || id == 'popular' || id == 'newest' || id == 'collections' || id == 'categories' || id == 'tags') && params.type != 'subcategory' )
        {
            screenTools.addActionBar(screen);
        }

        switch (id) {
            case 'featured':
                element.getElementById('screenTitle').setAttribute('data-bb-caption', 'Featured things');
                element.getElementById('tabFeatured').setAttribute('data-bb-selected', 'true');
                break;
            case 'popular':
                element.getElementById('screenTitle').setAttribute('data-bb-caption', 'Popular');
                element.getElementById('tabPopular').setAttribute('data-bb-selected', 'true');
                break;
            case 'newest':
                element.getElementById('screenTitle').setAttribute('data-bb-caption', 'Newest');
                element.getElementById('tabNewest').setAttribute('data-bb-selected', 'true');
                break;
            case 'collections':
                element.getElementById('screenTitle').setAttribute('data-bb-caption', 'Collections');
                element.getElementById('tabCollections').setAttribute('data-bb-selected', 'true');
                break;
            case 'collection-things':
                screenTools.addBackBtn(screen);
                element.getElementById('screenTitle').setAttribute('data-bb-caption', params.name);
                break;
            case 'categories':
                if (params.type == 'subcategory')
                {
                    element.getElementById('screenTitle').setAttribute('data-bb-caption', 'Subcategory: ' + params.name);
                    screenTools.addBackBtn(screen);
                }
                else
                {
                    element.getElementById('screenTitle').setAttribute('data-bb-caption', 'Categories');
                    element.getElementById('tabCategories').setAttribute('data-bb-selected', 'true');
                }
                break;
            case 'categories-things':
                screenTools.addBackBtn(screen);
                element.getElementById('screenTitle').setAttribute('data-bb-caption', params.name);
                break;
            case 'item-view':
                params.item.name = typeof params.item.name !== 'undefined' ? params.item.name : '';
                element.getElementById('screenTitle').setAttribute('data-bb-caption', params.item.name);
                break;
            case 'creator':
                params.creator.name = typeof params.creator.name !== 'undefined' ? params.creator.name : '';
                element.getElementById('screenTitle').setAttribute('data-bb-caption', params.creator.name);
                break;
        }
    },

    // Fires "after" styling is applied and "after" the screen is inserted in the DOM
    ondomready: function (element, id, params)
    {
        switch (id) {
            case 'start':
                if (inRipple)
                {
                    document.getElementById("debugLoginBtn").show();
                }
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
            case 'collections':
                collections.getCollections(params);
                break;
            case 'collection-things':
                app.getThings(element, "collections/" + params.id + "/things");
                break;
            case 'categories':
                categories.getCategories(params);
                break;
            case 'categories-things':
                app.getThings(element, params.url);
                break;
            case 'item-view':
                things.getThingDetails(element, params);
                break;
            case 'image-view':
                things.showImage(element, params);
                break;
            case 'viewer':
                app.viewerInit(params);
                break;
            case 'info':
                break;
            case 'settings':
                break;
            case 'search':
                break;
            case 'open-item':
                app.checkClipboard();
                break;
        }
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

        blackberry.event.addEventListener("resume", function() {
            if (!window.navigator.onLine)
            {
                bbutils.showConnectionDialog();
            }
        });
    }

    window.requestAnimFrame = (function ()
    {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback)
            {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

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
        bb.pushScreen('view/thingsGridList.html', 'featured');
    }
}
