const search_bar = document.getElementById("search-bar");

// Init the SearchBar actions
function initSearchBar() {
  search_bar.onkeydown = function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      search_bar.blur();
      search(search_bar);
    }
  };
}

function search() {
  console.log("search()");
  const query_string = search_bar.querySelector("#query").value;
  const cLatLng = currentPos;
  var range = 30; // Stub
  const range_option = search_bar.querySelector("#search_range");
  if (range_option !== null) {
    const range = range_option.value;
  }
  var query = JSON.stringify({
    query: query_string,
    position: cLatLng,
    range: range
  });
  // Now construct the query url:
  const url = "/search?data=" + encodeURIComponent(query);
  window.location = url;
}

var matched_providers = [];

function search_results(data) {
  data = JSON.stringify(data);
  var xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      clear_results_list();
      var results_list = JSON.parse(this.responseText);
      show_results(results_list);
    }
  });

  xhr.open("POST", "http://localhost:5000/search");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
}

function show_results(result_list) {
  let result_list_div;
  result_list_div = document.getElementById("results-list");
  for (let i = 0; i < result_list.length; i++) {
    var result = result_list[i];
    result_div = get_result_div(result);
    result_marker = get_result_marker(result);
    // TODO: Store it in a global list
    result_list_div.appendChild(result_div);
  }
}

function get_result_div(result) {
  var address =
    result.address + "," + result.city + "\n" + result.state + "," + result.zip;
  var content = document.createElement("div");
  content.classList.add("result");
  content.classList.add("item");
  content.classList.add("ui");
  content.classList.add("card");
  content.classList.add("content");
  var p0 = document.createElement("div");
  content.classList.add("header");
  p0.innerText = result.name;
  var p1 = document.createElement("p");
  content.classList.add("small");
  content.classList.add("feed");
  content.classList.add("event");
  content.classList.add("content");
  content.classList.add("summary");
  p1.innerText = result.speciality;
  var p2 = document.createElement("p");
  content.classList.add("event");
  content.classList.add("content");
  content.classList.add("summary");
  p2.innerText = address;
  // var p3 = document.createElement('p');
  // p3.innerText = result.contact;
  var bttn = document.createElement("button");
  content.classList.add("extra");
  content.classList.add("content");
  content.classList.add("button");
  bttn.innerHTML = "Apply";
  bttn.onclick = function() {
    apply_now(result.id);
  };
  content.appendChild(p0);
  content.appendChild(p1);
  content.appendChild(p2);
  content.appendChild(bttn);
  return content;
}

function get_result_marker(result) {
  // placeMarkerMap(result.lat, result.lng);
}

function clear_results_list() {
  for (let i = 0; i < matched_providers.length; i++) {
    // TODO: Add removal logic here.
  }
}

function apply_now(id) {
  const url = "/apply?provider=" + id;
  window.location = url;
}

// </script>
// <script async defer
// src="https://maps.googleapis.com/maps/api/js?key=gmaps_api_key&callback=initMap">
// </script>
