'use strict';
module.exports = {
    apps: [
        {
            name: 'exchange-rate-calculator',
            script: "npm",
            args: "start",
            autorestart: true,
            watch: false,
            env: {
                PORT: 3002
            }
        }
    ],
};
