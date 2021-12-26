const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/js/app.js",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new CopyWebpackPlugin([{ from: "./index.html", to: "index.html" }]),
        new CopyWebpackPlugin([{ from: "./style.css", to: "style.css" }]),
    ],
    devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
