/**
 * Created by Roger Felix Yuan on 7/19/2016.
 */
function check() {
    var input = document.forms["urlReceiver"]["longURL"].value;
    if (input == null || input == "") {
        alert("URL cannot be empty");
    } else {
        var longURL = document.getElementsByName("longURL").value;
        submit(input);
    }
}

function submit(data) {
    var httpRequest = new XMLHttpRequest();
    var url = "http://localhost:8080/urlshortener";
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            document.getElementById("short_url").setAttribute("href",httpRequest.responseText);
            document.getElementById("short_url").innerHTML = httpRequest.responseText;
            document.getElementById("display").setAttribute("style","visibiity: visible");
        }
    }
    httpRequest.open("POST",url,false);
    httpRequest.send(data);
}