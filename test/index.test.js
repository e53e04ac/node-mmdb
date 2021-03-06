/*!
 * node-mmdb/test/index.test.js
 * e53e04ac <e53e04ac@gmail.com>
 * MIT License
 */

'use strict';

const chai = require('chai');

describe('index.js', async () => {

    const { MMDB } = require('../');

    it('coverage', async () => {

        const mmdb = MMDB({ mmdbFilePath: './local/database.mmdb' });
        await mmdb.load();
        const address = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)].join('.');
        const data = await mmdb.lookup({ address });
        await mmdb.unload();

    });

});
