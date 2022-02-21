const path = require("path");

module.exports = [
      /* config.module.rule("vue") */
      {
        test: /\.vue$/,
        use: [
          /* config.module.rule("vue").use("cache-loader") */
	  /*
          {
            loader: path.resolve(__dirname, "../..", "node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js"),
            options: {
              cacheDirectory: path.resolve(__dirname, "../..", "node_modules/.cache/vue-loader"),
              cacheIdentifier: "20f668de"
            }
          },
	  */
          /* config.module.rule("vue").use("vue-loader") */
          {
            loader: path.resolve(__dirname, "../..", "node_modules/vue-loader-v16/dist/index.js"),
            options: {
              cacheDirectory: path.resolve(__dirname, "../..", "node_modules/.cache/vue-loader"),
              cacheIdentifier: "20f668de",
              babelParserPlugins: [
                "jsx",
                "classProperties",
                "decorators-legacy"
              ]
            }
          }
        ]
      },
      /* config.module.rule("images") */
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          /* config.module.rule("images").use("url-loader") */
          {
            loader: path.resolve(__dirname, "../..", "node_modules/url-loader/dist/cjs.js"),
            options: {
              limit: 4096,
              fallback: {
                loader: path.resolve(__dirname, "../..", "node_modules/file-loader/dist/cjs.js"),
                options: {
                  name: "img/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      },
      /* config.module.rule("svg") */
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          /* config.module.rule("svg").use("file-loader") */
          {
            loader: path.resolve(__dirname, "../..", "node_modules/file-loader/dist/cjs.js"),
            options: {
              name: "img/[name].[hash:8].[ext]"
            }
          }
        ]
      },
      /* config.module.rule("media") */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          /* config.module.rule("media").use("url-loader") */
          {
            loader: path.resolve(__dirname, "../..", "node_modules/url-loader/dist/cjs.js"),
            options: {
              limit: 4096,
              fallback: {
                loader: path.resolve(__dirname, "../..", "node_modules/file-loader/dist/cjs.js"),
                options: {
                  name: "media/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      },
      /* config.module.rule("fonts") */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          /* config.module.rule("fonts").use("url-loader") */
          {
            loader: path.resolve(__dirname, "../..", "node_modules/url-loader/dist/cjs.js"),
            options: {
              limit: 4096,
              fallback: {
                loader: path.resolve(__dirname, "../..", "node_modules/file-loader/dist/cjs.js"),
                options: {
                  name: "fonts/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      },
      {
        test: /\.stache$/,
        use: "raw-loader"
      },
      /* config.module.rule("pug") */
      {
        test: /\.pug$/,
        oneOf: [
          /* config.module.rule("pug").oneOf("pug-vue") */
          {
            resourceQuery: /vue/,
            use: [
              /* config.module.rule("pug").oneOf("pug-vue").use("pug-plain-loader") */
              {
                loader: "pug-plain-loader"
              }
            ]
          },
          /* config.module.rule("pug").oneOf("pug-template") */
          {
            use: [
              /* config.module.rule("pug").oneOf("pug-template").use("raw") */
              {
                loader: "raw-loader"
              },
              /* config.module.rule("pug").oneOf("pug-template").use("pug-plain-loader") */
              {
                loader: "pug-plain-loader"
              }
            ]
          }
        ]
      },
      /* config.module.rule("css") */
      {
        test: /\.css$/,
        oneOf: [
          /* config.module.rule("css").oneOf("vue-modules") */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule("css").oneOf("vue-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("css").oneOf("vue-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("css").oneOf("vue-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule("css").oneOf("vue") */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule("css").oneOf("vue").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("css").oneOf("vue").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("css").oneOf("vue").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule("css").oneOf("normal-modules") */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule("css").oneOf("normal-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("css").oneOf("normal-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("css").oneOf("normal-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule("css").oneOf("normal") */
          {
            use: [
              /* config.module.rule("css").oneOf("normal").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("css").oneOf("normal").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("css").oneOf("normal").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule("postcss") */
      {
        test: /\.p(ost)?css$/,
        oneOf: [
          /* config.module.rule("postcss").oneOf("vue-modules") */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule("postcss").oneOf("vue-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("postcss").oneOf("vue-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("postcss").oneOf("vue-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule("postcss").oneOf("vue") */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule("postcss").oneOf("vue").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("postcss").oneOf("vue").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("postcss").oneOf("vue").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule("postcss").oneOf("normal-modules") */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule("postcss").oneOf("normal-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("postcss").oneOf("normal-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("postcss").oneOf("normal-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule("postcss").oneOf("normal") */
          {
            use: [
              /* config.module.rule("postcss").oneOf("normal").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("postcss").oneOf("normal").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("postcss").oneOf("normal").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule("scss") */
      {
        test: /\.scss$/,
        oneOf: [
          /* config.module.rule("scss").oneOf("vue-modules") */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule("scss").oneOf("vue-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  // ,
                  publicPath: "../"
                }
              },
              /* config.module.rule("scss").oneOf("vue-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("scss").oneOf("vue-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("scss").oneOf("vue-modules").use("sass-loader") */
              {
                loader: "sass-loader",
                options: {
                  sourceMap: false,
                  implementation: {
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    info: "dart-sass\t1.26.8\t(Sass Compiler)\t[Dart]\ndart2js\t2.8.4\t(Dart Compiler)\t[Dart]",
                    types: {
                      Boolean: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { ["native code"] }
                    },
                    NULL: {
                      toString: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      }
                    },
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  }
                }
              }
            ]
          },
          /* config.module.rule("scss").oneOf("vue") */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule("scss").oneOf("vue").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("scss").oneOf("vue").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("scss").oneOf("vue").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("scss").oneOf("vue").use("sass-loader") */
              {
                loader: "sass-loader",
                options: {
                  sourceMap: false,
                  implementation: {
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    info: "dart-sass\t1.26.8\t(Sass Compiler)\t[Dart]\ndart2js\t2.8.4\t(Dart Compiler)\t[Dart]",
                    types: {
                      Boolean: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { ["native code"] }
                    },
                    NULL: {
                      toString: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      }
                    },
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  }
                }
              }
            ]
          },
          /* config.module.rule("scss").oneOf("normal-modules") */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule("scss").oneOf("normal-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("scss").oneOf("normal-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("scss").oneOf("normal-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("scss").oneOf("normal-modules").use("sass-loader") */
              {
                loader: "sass-loader",
                options: {
                  sourceMap: false,
                  implementation: {
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    info: "dart-sass\t1.26.8\t(Sass Compiler)\t[Dart]\ndart2js\t2.8.4\t(Dart Compiler)\t[Dart]",
                    types: {
                      Boolean: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { ["native code"] }
                    },
                    NULL: {
                      toString: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      }
                    },
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  }
                }
              }
            ]
          },
          /* config.module.rule("scss").oneOf("normal") */
          {
            use: [
              /* config.module.rule("scss").oneOf("normal").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("scss").oneOf("normal").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("scss").oneOf("normal").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("scss").oneOf("normal").use("sass-loader") */
              {
                loader: "sass-loader",
                options: {
                  sourceMap: false,
                  implementation: {
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    info: "dart-sass\t1.26.8\t(Sass Compiler)\t[Dart]\ndart2js\t2.8.4\t(Dart Compiler)\t[Dart]",
                    types: {
                      Boolean: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { ["native code"] }
                    },
                    NULL: {
                      toString: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      }
                    },
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule("sass") */
      {
        test: /\.sass$/,
        oneOf: [
          /* config.module.rule("sass").oneOf("vue-modules") */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule("sass").oneOf("vue-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("sass").oneOf("vue-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("sass").oneOf("vue-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("sass").oneOf("vue-modules").use("sass-loader") */
              {
                loader: "sass-loader",
                options: {
                  sourceMap: false,
                  implementation: {
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    info: "dart-sass\t1.26.8\t(Sass Compiler)\t[Dart]\ndart2js\t2.8.4\t(Dart Compiler)\t[Dart]",
                    types: {
                      Boolean: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { ["native code"] }
                    },
                    NULL: {
                      toString: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      }
                    },
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule("sass").oneOf("vue") */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule("sass").oneOf("vue").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("sass").oneOf("vue").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("sass").oneOf("vue").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("sass").oneOf("vue").use("sass-loader") */
              {
                loader: "sass-loader",
                options: {
                  sourceMap: false,
                  implementation: {
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    info: "dart-sass\t1.26.8\t(Sass Compiler)\t[Dart]\ndart2js\t2.8.4\t(Dart Compiler)\t[Dart]",
                    types: {
                      Boolean: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { ["native code"] }
                    },
                    NULL: {
                      toString: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      }
                    },
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule("sass").oneOf("normal-modules") */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule("sass").oneOf("normal-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("sass").oneOf("normal-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("sass").oneOf("normal-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("sass").oneOf("normal-modules").use("sass-loader") */
              {
                loader: "sass-loader",
                options: {
                  sourceMap: false,
                  implementation: {
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    info: "dart-sass\t1.26.8\t(Sass Compiler)\t[Dart]\ndart2js\t2.8.4\t(Dart Compiler)\t[Dart]",
                    types: {
                      Boolean: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { ["native code"] }
                    },
                    NULL: {
                      toString: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      }
                    },
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule("sass").oneOf("normal") */
          {
            use: [
              /* config.module.rule("sass").oneOf("normal").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("sass").oneOf("normal").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("sass").oneOf("normal").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("sass").oneOf("normal").use("sass-loader") */
              {
                loader: "sass-loader",
                options: {
                  sourceMap: false,
                  implementation: {
                    render: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    renderSync: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    },
                    info: "dart-sass\t1.26.8\t(Sass Compiler)\t[Dart]\ndart2js\t2.8.4\t(Dart Compiler)\t[Dart]",
                    types: {
                      Boolean: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Color: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      List: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Map: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Null: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      },
                      Number: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      String: function () {
                        return _call(f, this, Array.prototype.slice.apply(arguments));
                      },
                      Error: function Error() { ["native code"] }
                    },
                    NULL: {
                      toString: function () {
                        return _call(f, Array.prototype.slice.apply(arguments));
                      }
                    },
                    TRUE: {
                      value: true
                    },
                    FALSE: {
                      value: false
                    },
                    cli_pkg_main_0_: function () {
                      return _call(f, Array.prototype.slice.apply(arguments));
                    }
                  },
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule("less") */
      {
        test: /\.less$/,
        oneOf: [
          /* config.module.rule("less").oneOf("vue-modules") */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule("less").oneOf("vue-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("less").oneOf("vue-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("less").oneOf("vue-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("less").oneOf("vue-modules").use("less-loader") */
              {
                loader: "less-loader",
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule("less").oneOf("vue") */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule("less").oneOf("vue").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("less").oneOf("vue").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("less").oneOf("vue").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("less").oneOf("vue").use("less-loader") */
              {
                loader: "less-loader",
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule("less").oneOf("normal-modules") */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule("less").oneOf("normal-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("less").oneOf("normal-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("less").oneOf("normal-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("less").oneOf("normal-modules").use("less-loader") */
              {
                loader: "less-loader",
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule("less").oneOf("normal") */
          {
            use: [
              /* config.module.rule("less").oneOf("normal").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("less").oneOf("normal").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("less").oneOf("normal").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("less").oneOf("normal").use("less-loader") */
              {
                loader: "less-loader",
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule("stylus") */
      {
        test: /\.styl(us)?$/,
        oneOf: [
          /* config.module.rule("stylus").oneOf("vue-modules") */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule("stylus").oneOf("vue-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("stylus").oneOf("vue-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("stylus").oneOf("vue-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("stylus").oneOf("vue-modules").use("stylus-loader") */
              {
                loader: "stylus-loader",
                options: {
                  sourceMap: false,
                  preferPathResolver: "webpack"
                }
              }
            ]
          },
          /* config.module.rule("stylus").oneOf("vue") */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule("stylus").oneOf("vue").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("stylus").oneOf("vue").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("stylus").oneOf("vue").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("stylus").oneOf("vue").use("stylus-loader") */
              {
                loader: "stylus-loader",
                options: {
                  sourceMap: false,
                  preferPathResolver: "webpack"
                }
              }
            ]
          },
          /* config.module.rule("stylus").oneOf("normal-modules") */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule("stylus").oneOf("normal-modules").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("stylus").oneOf("normal-modules").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: "[name]_[local]_[hash:base64:5]"
                  }
                }
              },
              /* config.module.rule("stylus").oneOf("normal-modules").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("stylus").oneOf("normal-modules").use("stylus-loader") */
              {
                loader: "stylus-loader",
                options: {
                  sourceMap: false,
                  preferPathResolver: "webpack"
                }
              }
            ]
          },
          /* config.module.rule("stylus").oneOf("normal") */
          {
            use: [
              /* config.module.rule("stylus").oneOf("normal").use("extract-css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/mini-css-extract-plugin/dist/loader.js"),
                options: {
                  publicPath: "../"
                }
              },
              /* config.module.rule("stylus").oneOf("normal").use("css-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/css-loader/dist/cjs.js"),
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule("stylus").oneOf("normal").use("postcss-loader") */
              {
                loader: path.resolve(__dirname, "../..", "node_modules/postcss-loader/dist/index.js"),
                options: {
                  sourceMap: false
                }
              },
              /* config.module.rule("stylus").oneOf("normal").use("stylus-loader") */
              {
                loader: "stylus-loader",
                options: {
                  sourceMap: false,
                  preferPathResolver: "webpack"
                }
              }
            ]
          }
        ]
      }
    ]
