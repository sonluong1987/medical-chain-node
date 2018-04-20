function createRecord() {
    method = "get";
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", '/practitioner/createRecord');
    document.body.appendChild(form);
    form.submit();
}