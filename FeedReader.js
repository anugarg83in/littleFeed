const processContainerContent = (item) => {
  var newItem = { data: "", toSave: false };

  if (item.title.match(filterFeeds)) {
    newItem.toSave = true;

    console.log(item.title);
    newItem.data +=
      '<div class="container card" id="item"><div><a href="' +
      item.link +
      '"><h4>' +
      item.title +
      "</h4></a>";
    newItem.data += item.description.substring(0, 600);
    newItem.data += "</div></div>";
  }
  return newItem;
};

let API = "https://api.rss2json.com/v1/api.json?rss_url=";
let userFeedURLs = listedUrls;
var maincontent = document.getElementById("maincontent");
var rcontent = document.getElementById("rightcontent");
var count = 0;
userFeedURLs.forEach((userUrl) => {
  if (
    sessionStorage.getItem(userUrl.Name) == undefined ||
    sessionStorage.getItem(userUrl.Name) == null ||
    sessionStorage.getItem(userUrl.Name) == ""
  ) {
    $.ajax({
      type: "GET",
      url: API + userUrl.Url,
      dataType: "jsonp",
      success: function (data) {
        console.log(userUrl);
        console.log(data);
        //  sessionStorage.setItem(userUrl.Name, JSON.stringify(data));
        data.items.map((item) => {
          count += 1;
          var newItem = processContainerContent(data);
          if (count % 2 == 0)
            maincontent.insertAdjacentHTML("beforeend", newItem.data);
          else rcontent.insertAdjacentHTML("beforeend", newItem.data);

          if (newItem.toSave)
            sessionStorage.setItem(userUrl.Name, JSON.stringify(data));
        });
      },
      error: function (error) {
        console.log(JSON.stringify(error));
      },
    });
  } else {
    console.log("reading", userUrl.Name, "from cache");
    var data = JSON.parse(sessionStorage.getItem(userUrl.Name));
    data.items.map((item) => {
      count += 1;
      // console.log(JSON.stringify(item));
      var newItem = processContainerContent(item);

      if (count % 2 == 0)
        maincontent.insertAdjacentHTML("beforeend", newItem.data);
      else rcontent.insertAdjacentHTML("beforeend", newItem.data);
    });
  }
});
