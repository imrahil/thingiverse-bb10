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
                        var rowItem;
                        $.each(item.sizes, function (j, image)
                        {
                            if (image.type == "thumb" && image.size == "large")
                            {
                                rowItem = document.createElement('div');
                                rowItem.setAttribute('data-bb-type', 'item');
                                rowItem.setAttribute('data-bb-img', image.url);

                                document.getElementById('itemImageGridRow').appendChild(rowItem);
                            }

                            if (image.type == "display" && image.size == "large")
                            {
                                rowItem.onclick = function() {
                                    bb.pushScreen('view/imageView.html', 'image-view', {url: image.url});
                                };
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
    },

    showImage: function(element, params)
    {
        var imagePreview = document.getElementById('imagePreview');
        imagePreview.setAttribute("src", params.url);

        var hammertime = Hammer(document.getElementById('pinchzoom'), {
            transform_always_block: true,
            transform_min_scale: 1,
            drag_block_horizontal: true,
            drag_block_vertical: true,
            drag_min_distance: 0
        });

        var rect = document.getElementById('imagePreview');

        var posX=0, posY=0,
            scale=1, last_scale,
            rotation= 1, last_rotation;

        hammertime.on('touch drag transform', function(ev) {
            switch(ev.type) {
                case 'touch':
                    last_scale = scale;
                    last_rotation = rotation;
                    break;

                case 'drag':
                     posX = ev.gesture.deltaX;
                     posY = ev.gesture.deltaY;
                     break;

                case 'transform':
                    scale = Math.max(1, Math.min(last_scale * ev.gesture.scale, 10));
                    break;
            }

            // transform!
            var transform =
                    "translate3d("+posX+"px,"+posY+"px, 0) " +
                    "scale3d("+scale+","+scale+", 0) ";

            rect.style.transform = transform;
            rect.style.oTransform = transform;
            rect.style.msTransform = transform;
            rect.style.mozTransform = transform;
            rect.style.webkitTransform = transform;
        });
    }
};
