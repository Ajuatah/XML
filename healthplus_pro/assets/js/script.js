 document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.getAttribute('data-page');
    fetch('../assets/data/content.xml')
        .then(res => res.text())
        .then(xmlText => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, "application/xml");
            const title = xml.getElementsByTagName(page)[0].getElementsByTagName("title")[0].textContent;
            const body = xml.getElementsByTagName(page)[0].getElementsByTagName("body")[0].innerHTML;
            document.getElementById("title").textContent = title;
            document.getElementById("content").innerHTML = body;

            fetch("../store.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `page=${page}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
            });
        });
});