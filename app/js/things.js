var things = {
    item: "",

    getThingDetails: function (element, params)
    {
        console.log("Fetching thing details");

        var item = params.item;
        var noItemFlag = false;

        // ***************
        //     DETAILS
        // ***************

        // Retrieve item data from storage
        var detailsCachedObject = localStorage.getItem('Item' + item.id);

        if (detailsCachedObject && window['Item' + item.id + 'Cached'])
        {
            console.log('Cache object exist!');

            document.getElementById("loadingIndicator").hide();

            fillDetails(JSON.parse(detailsCachedObject));
        }
        else
        {
            if (item.name)
            {
                document.getElementById("itemNameHolder").innerHTML = item.name;
                document.getElementById("itemCreatorHolder").innerHTML = item.creator.name;
                document.getElementById("creatorImageHolder").setAttribute("src", item.creator.thumbnail);
            }

            var url = thingiverseOptions.apiUri + "things/" + item.id + '?access_token=' + window.accessToken;
            console.log("URL - details: " + url);

            $.getJSON(url)
                .done(function (data)
                {
                    item = data;
                    var screen = document.getElementById('itemViewScreen');

                    if (screen)
                    {
                        console.log("Fetching details success");

                        document.getElementById("loadingIndicator").hide();

                        fillDetails(data);

                        if (data.length > 0)
                        {
                            // caching data to localStorage
                            console.log("Saving item cache to localStorage");
                            localStorage.setItem('Item' + data.id, JSON.stringify(data));

                            // flag for session cache - refresh data between app run
                            window['Item' + data.id + 'Cached'] = true;
                        }
                    }
                })

                .fail(function(jqxhr, textStatus, error)
                {
                    showError(error);
                });
        }

        // ***************
        //     IMAGES
        // ***************

        // Retrieve images data from storage
        var imagesCachedObject = localStorage.getItem('ItemImages' + item.id);

        if (imagesCachedObject && window['ItemImages' + item.id + 'Cached'])
        {
            console.log('Images cache object exist!');

            setTimeout(function() {
                fillImages(JSON.parse(imagesCachedObject));
            }, 50);
        }
        else
        {
            url = thingiverseOptions.apiUri + "things/" + item.id + '/images?access_token=' + window.accessToken;
            console.log("URL - images: " + url);

            $.getJSON(url)
                .done(function (data)
                {
                    var screen = document.getElementById('itemViewScreen');

                    if (screen)
                    {
                        console.log("Fetching item images success");

                        fillImages(data);

                        if (data.length > 0)
                        {
                            // caching data to localStorage
                            console.log("Saving image cache to localStorage");
                            localStorage.setItem('ItemImages' + item.id, JSON.stringify(data));

                            // flag for session cache - refresh data between app run
                            window['ItemImages' + item.id + 'Cached'] = true;
                        }
                    }
                })

                .fail(function(jqxhr, textStatus, error)
                {
                    showError(error);
                });
        }

        // ***************
        //     FILES
        // ***************

        // Retrieve images data from storage
        var filesCachedObject = localStorage.getItem('ItemFiles' + item.id);

        if (filesCachedObject && window['ItemFiles' + item.id + 'Cached'])
        {
            console.log('Files cache object exist!');

            document.getElementById("filesIndicator").hide();

            fillFiles(JSON.parse(filesCachedObject));
        }
        else
        {
            url = thingiverseOptions.apiUri + "things/" + item.id + '/files?access_token=' + window.accessToken;
            console.log("URL - files: " + url);

            $.getJSON(url)
                .done(function (data)
                {
                    var screen = document.getElementById('itemViewScreen');

                    if (screen)
                    {
                        console.log("Fetching item files success");

                        document.getElementById("filesIndicator").hide();

                        fillFiles(data);

                        if (data.length > 0)
                        {
                            // caching data to localStorage
                            console.log("Saving image cache to localStorage");
                            localStorage.setItem('ItemFiles' + item.id, JSON.stringify(data));

                            // flag for session cache - refresh data between app run
                            window['ItemFiles' + item.id + 'Cached'] = true;
                        }
                    }
                })

                .fail(function(jqxhr, textStatus, error)
                {
                    showError(error);
                });
        }

        function fillDetails(item)
        {
            console.log("Filling item details");

            document.getElementById('screenTitle').setCaption(item.name);

            document.getElementById("itemNameHolder").innerHTML = item.name;
            document.getElementById("itemCreatorHolder").innerHTML = item.creator.name;
            document.getElementById("creatorImageHolder").setAttribute("src", item.creator.thumbnail);
            document.getElementById("creatorImageHolder").onclick = function() { things.showCreator() };

            document.getElementById("itemAddedHolder").innerHTML = item.added.substr(0, 10);
            document.getElementById("itemModifiedHolder").innerHTML = item.modified.substr(0, 10);
            document.getElementById("itemLikesBtn").setCaption('Likes: ' + item.like_count);
            document.getElementById("itemCollectionsBtn").setCaption('Collections: ' + item.collect_count);

            document.getElementById("itemDescriptionHolder").innerHTML = item.description;
            document.getElementById("itemInstructionsHolder").innerHTML = item.instructions;
        }

        function fillImages(data)
        {
            console.log("Filling images grid");

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

        function fillFiles(data)
        {
            console.log("Filling files list");

            var fileItems = [],
                fileItem;

            document.getElementById("loadingIndicator").hide();

            $.each(data, function (i, file)
            {
                fileItem = document.createElement('div');
                fileItem.setAttribute('data-bb-type', 'item');
                fileItem.setAttribute('data-bb-title', file.name);
                fileItem.setAttribute('data-bb-img', file.thumbnail);

                if (file.threejs_url != "")
                {
                    fileItem.onbtnclick = function ()
                    {
                        // FIXME
//                        bb.pushScreen('view/viewer.html', 'viewer', {url: file.threejs_url});

                        blackberry.invoke.invoke({
                            uri: file.public_url
                        });
                    };
                }
                else
                {
                    if (!inRipple)
                    {
                        fileItem.onbtnclick = function ()
                        {
                            blackberry.invoke.invoke({
                                uri: file.public_url
                            });
                        }
                    }
                }
                fileItems.push(fileItem);
            });

            document.getElementById('fileList').refresh(fileItems);
        }

        function showError(errorMsg)
        {
            if (noItemFlag == false)
            {
                noItemFlag = true;

                if (errorMsg == "Not Found")
                {
                    bbutils.showToast('Thing not exist!')
                }
                else
                {
                    bbutils.showToast('Couldn\'t load a thing!')
                }

                bb.popScreen();
            }
        }
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
            scale=1, last_scale;

        hammertime.on('touch drag transform', function(ev) {
            switch(ev.type) {
                case 'touch':
                    last_scale = scale;
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
    },

    showCreator: function()
    {
        console.log("Show creator details");

        bb.pushScreen('view/creator.html', 'creator', {creator: this.item.creator});
    },

    showLikes: function()
    {
        console.log("Show item likes");

        bb.pushScreen('view/creator.html', 'creator', {url: this.item.creator});
    },

    showCollections: function()
    {
        console.log("Show item collections");

        bb.pushScreen('view/creator.html', 'creator', {url: this.item.creator});
    }
};
