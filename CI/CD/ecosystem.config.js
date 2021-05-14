module.exports = {
    apps : [{
        name: "backendAPI",
        script: "./dist/main.js",
        watch: true,
        env: {
            NODE_ENV: "development",
        },
    }]
    }