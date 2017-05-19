var webshot = require('webshot')

module.exports = {

    process: (type, reference) => {
        webshot(reference.reference, "images/" + reference.uuid + ".png", function (err) {
            console.log("create preview of reference")
        });
    }

}