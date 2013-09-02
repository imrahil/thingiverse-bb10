var thingiurlbase;

var app = {
    createRow: function (group, columns)
    {
        columns = typeof columns !== 'undefined' ? columns : 3;

        var row = document.createElement('div');
        row.setAttribute('data-bb-type', 'row');
        row.setAttribute('data-bb-columns', columns);
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

        var grid = document.createElement('div');
        grid.setAttribute('data-bb-type','grid-layout');
        grid.setAttribute('data-bb-style','square');
        grid.setAttribute('data-bb-header-justify','left');

        var group = app.createGroup(grid);
        var row = app.createRow(group, 1);

        var rowCount = 1;
        var itemCount = 1;
        var itemMax = 4;

        // Retrieve data from storage
        var cachedObject = localStorage.getItem(type);

        if (cachedObject && window[type + 'Cached'])
        {
            console.log('Cache object exist!');

            setTimeout(function() {
                document.getElementById("loadingIndicator").hide();
                cachedObject = localStorage.getItem(type);
                createGrid(JSON.parse(cachedObject));
            }, 50);
        }
        else
        {
            var url = thingiverseOptions.apiUri + type + '?access_token=' + window.accessToken;
            console.log("URL: " + url);

            $.getJSON(url)
                .done(function (data)
                {
                    console.log("Fetching success");

                    document.getElementById("loadingIndicator").hide();

                    createGrid(data);

                    if (data.length > 0)
                    {
                        // caching data to localStorage
                        console.log("Saving cache to localStorage");
                        localStorage.setItem(type, JSON.stringify(data));

                        // flag for session cache - refresh data between app run
                        window[type + 'Cached'] = true;
                    }
                })

                .fail(function ()
                {
                    alert("Cannot fetch " + type + " things!");
                });
        }

        function createGrid(data)
        {
            console.log("Creating grid");

            $.each(data, function (i, item)
            {
                var rowItem = document.createElement('div');
                rowItem.setAttribute('data-bb-type', 'item');
                rowItem.setAttribute('data-bb-img', item.thumbnail.replace('thumb_medium', 'thumb_large'));

                var nameArr = item.name.split(" ");
                var firstLine = "";
                var secondLine = "";
                if (nameArr.length > 1)
                {
                    firstLine = nameArr[0] + " " + nameArr[1];

                    if (nameArr.length > 3)
                    {
                        secondLine = nameArr[2] + " " + nameArr[3];
                    }
                    else if (nameArr.length > 2)
                    {
                        secondLine = nameArr[2];
                    }
                }
                else
                {
                    firstLine = nameArr[0];
                }

                rowItem.setAttribute('data-bb-title', firstLine);
                rowItem.innerHTML = secondLine;
                rowItem.onclick = function() {
                    bb.pushScreen('view/itemView.html', 'item-view', {item: item});
                };
                row.appendChild(rowItem);

                itemCount++;

                if (itemCount > itemMax)
                {
                    itemCount = 1;
                    rowCount++;

                    if (rowCount == 2)
                    {
                        itemMax = 3;
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
        };
    },

    removeToken: function ()
    {
        localStorage.removeItem("tviewerAccessToken");
    },

    showViewer: function ()
    {
        bb.pushScreen('view/viewer.html', 'viewer', {url: "../../stl/light_switch_force_plate.stl"});
    },

    viewerInit: function (params)
    {
        console.log("Viewer started");

        $('#viewer').height(window.innerHeight - 200);

        $.ajax({
            url: params.url,
            type: "GET",
            beforeSend: function ( xhr ) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        })
            .done(function (data)
            {
                console.log("Downloaded STL file");

                thingiurlbase = "js/lib";
                var thingiview = new Thingiview("viewer");
                thingiview.setObjectColor('#C0D8F0');
                thingiview.setBackgroundColor('#242424');
                thingiview.initScene();

                var reader = new jDataView(data);

                reader.seek(80);
                // skip the header
                var count = reader.getUint32();

                var predictedSize = 80 /* header */ + 4 /* count */ + 50 * count;

                if (data.length == predictedSize) {
                    console.log("STL Binary");
                    thingiview.loadSTLBinary(new jDataView(data));
                } else {
                    console.log("STL String");
                    thingiview.loadSTLString(data);
                }

                document.getElementById("loadingIndicator").hide();
            });
    },

    showInfoPage: function()
    {
        if (!inRipple)
        {
            blackberry.invoke.invoke({
                uri: "http://imrahil.github.io/thingiverse-bb10/"
            });
        }
    }
};

