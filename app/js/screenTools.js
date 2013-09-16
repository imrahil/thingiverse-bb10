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
        menuItem = screenTools.createMenuItem('tabFeatured', 'images/icons/ic_favorite.png', 'Featured', 'view/thingsGridList.html', 'featured');
        actionBar.appendChild(menuItem);

        menuItem = screenTools.createMenuItem('tabPopular', 'images/icons/ic_diagnostics.png', 'Popular', 'view/thingsGridList.html', 'popular');
        actionBar.appendChild(menuItem);

        menuItem = screenTools.createMenuItem('tabNewest', 'images/icons/ic_download.png', 'Newest', 'view/thingsGridList.html', 'newest');
        actionBar.appendChild(menuItem);

        menuItem = screenTools.createMenuItem('tabCollections', 'images/icons/ic_all.png', 'Collections', 'view/listView.html', 'collections');
        actionBar.appendChild(menuItem);

        menuItem = screenTools.createMenuItem('tabCategories', 'images/icons/ic_entry.png', 'Categories', 'view/listView.html', 'categories');
        actionBar.appendChild(menuItem);

        menuItem = screenTools.createMenuItem('btnSearch', 'images/icons/ic_search.png', 'Search', 'view/search.html', 'search', 'button', false);
        actionBar.appendChild(menuItem);

        menuItem = screenTools.createMenuItem('btnOpen', 'images/icons/ic_open.png', 'Open', 'view/openItem.html', 'open-item', 'button', false);
        actionBar.appendChild(menuItem);

//        menuItem = document.createElement('div');
//        menuItem.setAttribute('id', 'btnSearch');
//        menuItem.setAttribute('data-bb-type', 'action');
//        menuItem.setAttribute('data-bb-style', 'button');
//        menuItem.setAttribute('data-bb-img', 'images/icons/ic_search.png');
//        menuItem.innerHTML = 'Search';
//        menuItem.onclick = function() {
//            bb.pushScreen('view/search.html', 'search');
//        };
//        actionBar.appendChild(menuItem);

        element.appendChild(actionBar);
    },

    addBackBtn : function(element)
    {
        console.log("Adding back btn");

        var actionBar = document.createElement('div');
        actionBar.setAttribute('data-bb-type', 'action-bar');
        actionBar.setAttribute('data-bb-back-caption', 'Back');

        element.appendChild(actionBar);
    },

    createMenuItem : function (id, icon, label, click_target, click_id, style, overflow)
    {
        style = typeof style !== 'undefined' ? style : 'tab';
        overflow = typeof overflow !== 'undefined' ? overflow : 'true';

        var menuItem = document.createElement('div');
        menuItem.setAttribute('id', id);
        menuItem.setAttribute('data-bb-type', 'action');
        menuItem.setAttribute('data-bb-style', style);
        menuItem.setAttribute('data-bb-overflow', overflow);
        menuItem.setAttribute('data-bb-img', icon);
        menuItem.innerHTML = label;
        menuItem.onclick = function() {
            bb.pushScreen(click_target, click_id);
        };

        return menuItem;
    }
};