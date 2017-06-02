const Processor = require('../src/processor/WebLinkProcessor')
const axios = require('axios')
const sinon = require('sinon')
const assert = require('chai').assert
const config = require('../src/config')

describe('Webseite Preview Processor', function () {

    // takes some time currently to upload the image
    // should be rmeoved once mocked
    this.timeout(10000)

    let sandbox

    beforeEach(function () {
        sandbox = sinon.sandbox.create()
    });

    afterEach(function () {
        sandbox.restore()
    })

    it('should load preview image of url', (done) => {

        let event = {
            reference: {
                reference: 'http://www.google.de',
                uuid: '9cc094c2-3e12-4b15-9d69-3cfe6240f6b7',
            },
            bulb: {
                summary: 'asdasd',
                uuid: '8cc094c2-3e12-4b15-9d69-3cfe6240f6b7',
            }
        }

        Processor.process("addReference", event).then(() => {
            done()
        }).catch((err) => {
            done(err)
        })
        // check if file exists

    })

});