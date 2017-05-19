const Processor = require('../src/processor/WebLinkProcessor')
const axios = require('axios')
const sinon = require('sinon')
const assert = require('chai').assert
const config = require('../src/config')

describe('Knowledge Adapter', function () {

    let sandbox

    beforeEach(function () {
        sandbox = sinon.sandbox.create()
    });

    afterEach(function () {
        sandbox.restore()
    })

    it('should load preview image of url', () => {

        let reference = {
            reference: 'http://localhost:8081/#/',
            uuid: '9cc094c2-3e12-4b15-9d69-3cfe6240f6b7',
            bulb: {
                summary: 'asdasd',
                uuid: '8cc094c2-3e12-4b15-9d69-3cfe6240f6b7',
            }
        }

        Processor.process("addReference", reference)
        // check if file exists

    })

});