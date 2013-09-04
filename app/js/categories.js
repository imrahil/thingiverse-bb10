var categoriesLength = 0;
var currentCategory = 0;
var categoriesList = [];

var categories = {
    getCategories: function (params)
    {
        console.log("Fetching categories");

        categoriesList = [];

        var url;
        if (params)
        {
            url = params.url + '?access_token=' + window.accessToken;
        }
        else
        {
            url = thingiverseOptions.apiUri + "categories" + '?access_token=' + window.accessToken;
        }

        console.log("URL: " + url);

        $.getJSON(url)
            .done(function (data)
            {
                console.log("Fetching success");

                var loop;
                if (params && data.children)
                {
                    categoriesLength = data.children.length;
                    loop = data.children;
                }
                else
                {
                    categoriesLength = data.length;
                    loop = data;
                }

                $.each(loop, function (i, category)
                {
                    url = category.url + '?access_token=' + window.accessToken;
                    console.log("URL: " + url);

                    $.getJSON(url)
                        .done(function (data)
                        {
                            console.log("Fetching single category");

                            categoriesList.push(data);

                            if (currentCategory == categoriesLength - 1)
                            {
                                currentCategory = 0;
                                categories.compileCategories();
                            }
                            else
                            {
                                currentCategory++;
                            }
                        })
                        .fail(function ()
                        {
                            alert("Cannot fetch category!");
                        })

                });
            })
            .fail(function ()
            {
                alert("Cannot fetch categories!");
            })
    },

    compileCategories : function()
    {
        var items = [],
            item;

        function predicatBy(prop)
        {
            return function (a, b)
            {
                if (a[prop] > b[prop])
                {
                    return 1;
                }
                else if (a[prop] < b[prop])
                {
                    return -1;
                }
                return 0;
            }
        }

        document.getElementById("loadingIndicator").hide();

        categoriesList.sort(predicatBy("name"));

        $.each(categoriesList, function (i, category)
        {
            item = document.createElement('div');
            item.setAttribute('data-bb-type', 'item');
            item.setAttribute('data-bb-title', category.name);
            item.setAttribute('data-bb-img', category.thumbnail);

            var inner = 'Items: ' + category.count;

            if (category.children)
            {
                inner += (category.children) ? ', Subcategories: ' + category.children.length : '';

                item.onbtnclick = function ()
                {
                    bb.pushScreen('view/listView.html', 'categories', {url: category.url});
                };
            }
            else
            {
                item.onbtnclick = function ()
                {
                    var url = category.things_url.substr(category.things_url.indexOf('com/') + 4);
                    bb.pushScreen('view/thingsGridList.html', 'categories-things', {url: url});
                };
            }

            item.innerHTML = inner;

            items.push(item);
        });

        document.getElementById('myList').refresh(items);
    }
};
