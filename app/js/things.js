var things = {
    getThingDetails: function (element, params)
    {
        console.log("Fetching thing details");

        var item = params.item;

        document.getElementById("itemNameHolder").innerHTML = item.name;
        document.getElementById("itemCreatorHolder").innerHTML = item.creator.name;

        var url = thingiverseOptions.apiUri + "things/" + item.id + '?access_token=' + window.accessToken;
        console.log("URL - details: " + url);

        $.getJSON(url)
            .done(function (data)
            {
                var screen = document.getElementById('itemViewScreen');

                if (screen)
                {
                    console.log("Fetching details success");

                    document.getElementById("loadingIndicator").hide();

                    item = data;

                    document.getElementById("itemAddedHolder").innerHTML = item.added.substr(0, 10);
                    document.getElementById("itemLikesBtn").setCaption('Likes: ' + item.like_count);
                    document.getElementById("itemCollectionsBtn").setCaption('Collections: ' + item.collect_count);

                    document.getElementById("itemDescriptionHolder").innerHTML = item.description;
                    document.getElementById("itemInstructionsHolder").innerHTML = item.instructions;
                }
            })

            .fail(function ()
            {
                alert("Cannot fetch thing details! Try again later.");
            })

        url = thingiverseOptions.apiUri + "things/" + item.id + '/images?access_token=' + window.accessToken;
        console.log("URL - images: " + url);

        $.getJSON(url)
            .done(function (data)
            {
                var screen = document.getElementById('itemViewScreen');

                if (screen)
                {
                    console.log("Fetching item images success");

                    $.each(data, function (i, item)
                    {
                        $.each(item.sizes, function (j, size)
                        {
                            if (size.type == "thumb" && size.size == "large")
                            {
                                var rowItem = document.createElement('div');
                                rowItem.setAttribute('data-bb-type', 'item');
                                rowItem.setAttribute('data-bb-img', size.url);

                                document.getElementById('itemImageGridRow').appendChild(rowItem);
                            }
                        });
                    });

                    _bb10_grid.apply(element.querySelectorAll('[data-bb-type=grid-layout]'));
                    bb.domready.fire();
                }
            })

            .fail(function ()
            {
                alert("Cannot fetch thing details! Try again later.");
            });
    }
};
