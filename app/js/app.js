var thingiurlbase;

var app = {
    createRow: function (group)
    {
        var row = document.createElement('div');
        row.setAttribute('data-bb-type', 'row');
        group.appendChild(row);

        return row;
    },

    createGroup: function (grid)
    {
        var group = document.createElement('div');
        group.setAttribute('data-bb-type', 'group');
        grid.appendChild(group);

        return group;
    },

    getThings: function (element, type)
    {
        console.log("Fetching things: " + type);

        var url = thingiverseOptions.apiUri + type + '?access_token=' + window.accessToken;
        console.log("URL: " + url);

        var grid = document.createElement('div');
        grid.setAttribute('data-bb-type','grid-layout');
        grid.setAttribute('data-bb-style','square');
        grid.setAttribute('data-bb-header-justify','left');

        var row;
        var group;

        $.getJSON(url)
            .done(function (data)
            {
                console.log("Fetching success");

                document.getElementById("loadingIndicator").hide();

                group = app.createGroup(grid);
                row = app.createRow(group);

                var rowCount = 1;
                var itemCount = 1;
                var itemMax = 3;

                /** @var item Thing */
                $.each(data, function (i, item)
                {
                    var rowItem = document.createElement('div');
                    rowItem.setAttribute('data-bb-type', 'item');
                    rowItem.setAttribute('data-bb-img', item.thumbnail.replace('thumb_medium', 'thumb_large'));
//                    rowItem.setAttribute('data-bb-title', (itemMax == 3) ? item.name.substr(0, 15) + '..' : item.name.substr(0, 10) + '..');
                    rowItem.setAttribute('data-bb-title', item.name);
//                    rowItem.innerHTML = item.creator.full_name;
                    row.appendChild(rowItem);

                    itemCount++;

                    if (itemCount > itemMax)
                    {
                        itemCount = 1;
                        rowCount++;

                        if (rowCount == 3)
                        {
                            itemMax = 4;
                            group = app.createGroup(grid);
                            row = app.createRow(group);
                        }
                        else {
                            row = app.createRow(group);
                        }
                    }
                });

                element.getElementById('gridContainer').appendChild(grid);
                bb.style(element);
                bb.domready.fire();
            })
            .fail(function ()
            {
                alert("Cannot fetch " + type + " things!");
            })
    },

    removeToken: function ()
    {
        localStorage.removeItem("tviewerAccessToken");
    },

    showViewer: function ()
    {
        bb.pushScreen('view/viewer.html', 'viewer');
    },

    viewerInit: function ()
    {
        $('#viewer').height(window.innerHeight - 200);

        thingiurlbase = "js/lib";
        var thingiview = new Thingiview("viewer");
        thingiview.setObjectColor('#C0D8F0');
        thingiview.setBackgroundColor('#242424');
        thingiview.initScene();
        thingiview.loadSTL("../../stl/cube.stl");
    }

};

