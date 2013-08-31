var screenTools = {
    addTopMenu : function(element)
    {
        console.log("Adding top menu");

        var menu = document.createElement('div');
        menu.setAttribute('data-bb-type', 'menu');

        var menuItem;

        menuItem = document.createElement('div');
        menuItem.setAttribute('data-bb-type', 'menu-item');
        menuItem.setAttribute('data-bb-img', 'images/icons/ic_info.png');
        menuItem.setAttribute('data-bb-pin', 'left');
        menuItem.innerHTML = 'Info';
        menuItem.onclick = function() {
            bb.pushScreen('view/info.html', 'info');
        };
        menu.appendChild(menuItem);

        menuItem = document.createElement('div');
        menuItem.setAttribute('data-bb-type', 'menu-item');
        menuItem.setAttribute('data-bb-img', 'images/icons/ic_settings.png');
        menuItem.setAttribute('data-bb-pin', 'right');
        menuItem.innerHTML = 'Settings';
        menuItem.onclick = function() {
            bb.pushScreen('view/settings.html', 'settings');
        };
        menu.appendChild(menuItem);

        element.appendChild(menu);
    },

    addActionBar : function(element)
    {
        console.log("Adding action bar");

        var actionBar = document.createElement('div');
        actionBar.setAttribute('data-bb-type', 'action-bar');

        var menuItem;
        menuItem = screenTools.createMenuItem('tabFeatured', 'images/icons/tab1.png', 'Featured', 'view/thingsGridList.html', 'featured');
        actionBar.appendChild(menuItem);

        menuItem = screenTools.createMenuItem('tabPopular', 'images/icons/tab1.png', 'Popular', 'view/thingsGridList.html', 'popular');
        actionBar.appendChild(menuItem);

        menuItem = screenTools.createMenuItem('tabNewest', 'images/icons/tab1.png', 'Newest', 'view/thingsGridList.html', 'newest');
        actionBar.appendChild(menuItem);

        menuItem = screenTools.createMenuItem('tabCollections', 'images/icons/tab1.png', 'Collections', 'view/thingsGridList.html', 'collections');
        actionBar.appendChild(menuItem);

        menuItem = screenTools.createMenuItem('tabCategories', 'images/icons/tab1.png', 'Categories', 'view/thingsGridList.html', 'categories');
        actionBar.appendChild(menuItem);

        menuItem = screenTools.createMenuItem('tabTags', 'images/icons/tab1.png', 'Tags', 'view/thingsGridList.html', 'tags');
        actionBar.appendChild(menuItem);

        menuItem = document.createElement('div');
        menuItem.setAttribute('id', 'btnSearch');
        menuItem.setAttribute('data-bb-type', 'action');
        menuItem.setAttribute('data-bb-style', 'button');
        menuItem.setAttribute('data-bb-img', 'images/icons/ic_search.png');
        menuItem.innerHTML = 'Search';
        menuItem.onclick = function() {
            bb.pushScreen('view/search.html', 'search');
        };
        actionBar.appendChild(menuItem);

        element.appendChild(actionBar);
    },

    createMenuItem : function (id, icon, label, click_target, click_id)
    {
        var menuItem = document.createElement('div');
        menuItem.setAttribute('id', id);
        menuItem.setAttribute('data-bb-type', 'action');
        menuItem.setAttribute('data-bb-style', 'tab');
        menuItem.setAttribute('data-bb-overflow', 'true');
        menuItem.setAttribute('data-bb-img', icon);
        menuItem.innerHTML = label;
        menuItem.onclick = function() {
            bb.pushScreen(click_target, click_id);
        };

        return menuItem;
    }
};