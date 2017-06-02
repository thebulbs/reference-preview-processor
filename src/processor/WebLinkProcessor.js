var webshot = require('webshot')
var AWS = require('aws-sdk')
var s3 = new AWS.S3({signatureVersion: 'v4'})
var fs = require('fs')

module.exports = {

    process: (reference) => {

        return new Promise((resolve, reject) => {

            let config = {
                region: 'eu-central-1',
            }

            // FIXME: this looks weird
            if (process.env.ACCESS_KEY_ID && process.env.SECRET_ACCESS_KEY) {
                config.accessKeyId = process.env.ACCESS_KEY_ID
                config.secretAccessKey = process.env.SECRET_ACCESS_KEY
            }

            AWS.config.update(config);

            const image = "/tmp/" + reference.uuid + ".png"
            const file = fs.createWriteStream(image, {encoding: 'binary'});
            webshot(reference.reference)
                .on('data', (data) => {
                    file.write(data.toString('binary'), 'binary');
                })
                .on('end', () => {
                    fs.readFile(image, function (err, data) {
                        if (err)
                            reject(err)
                        var base64data = new Buffer(data, 'binary');
                        var params = {
                            Bucket: "brain-mapper",
                            ACL: 'public-read',
                            Key: 'references/' + reference.uuid + ".png",
                            Body: base64data
                        }
                        s3.upload(params, function (err, data) {
                            if (err)
                                reject(err)
                            else {
                                console.log("Successfully uploaded")
                                resolve()
                            }
                        })
                    })
                })


        })

    }
}