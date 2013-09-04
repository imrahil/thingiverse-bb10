var collections = {
    getCollections: function (params)
    {
        console.log("Fetching collections: " + params);

        var url;

        if (params)
        {
            url = thingiverseOptions.apiUri + "collections/" + params.id + '?access_token=' + window.accessToken;
        }
        else
        {
            url = thingiverseOptions.apiUri + "collections" + '?access_token=' + window.accessToken;
        }

        console.log("URL: " + url);

        $.getJSON(url)
            .done(function (data)
            {
                console.log("Fetching success");

                var items = [],
                    item;

                document.getElementById("loadingIndicator").hide();

                $.each(data, function (i, collection)
                {
                    item = document.createElement('div');
                    item.setAttribute('data-bb-type', 'item');
                    item.setAttribute('data-bb-title', collection.name);
                    item.innerHTML = 'Items: ' + collection.count + ', Added: ' + collection.added.substr(0, 10);
                    item.setAttribute('data-bb-img', collection.thumbnail);
                    item.onbtnclick = function ()
                    {
                        bb.pushScreen('view/thingsGridList.html', 'collection-things', {id: collection.id, name: collection.name});
                    };
                    items.push(item);
                });

                document.getElementById('myList').refresh(items);
            })
            .fail(function ()
            {
                alert("Cannot fetch collections!");
            })
    }
};
