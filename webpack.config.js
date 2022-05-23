const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 打包前移除/清理 打包目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const pathResolve = (pathUrl) => path.join(__dirname, pathUrl);
const PackageName = 'PRACTICE'

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
      loader: "postcss-loader",
      options: {
          postcssOptions: {
              plugins: ['postcss-preset-env']
          }
      }
  }
]

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, PackageName),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      '@': pathResolve('src'),
      utils: pathResolve('src/utils'),
      api: pathResolve('src/api'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/, // (匹配js/ts/jsx/tsx)
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react', {runtime: 'classic'}],
              ['@babel/preset-typescript'] // 加上这一句
            ]
          }
        }
      },
      // {
      //   test: /\.(png|jpg|gif|jpeg)$/i,
      //   includes: [
      //     path.resolve(__dirname, 'src')
      //   ],
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         limit: 5000,
      //         // img：要打包到的文件夹
      //         // name：获取图片原来的名字，放在这个位置
      //         // hash:8：为防止图片名称冲突，依然使用hash，但是只保留8位
      //         // ext：使用原来的扩展名
      //         name: 'img/[name].[hash:8].[ext]'
      //       }
      //     }
      //   ]
      // },
      /**
       * asset module type
       * 01. asset/resource -->file-loader
       * 02. asset/inline --->url-loader
       * 03. asset/source --->raw-loader
       */
      {
        test: /\.(png|svg|gif|jpe?g)$/,
        //设置资源目录
        type: 'asset',
        generator: {
          filename: "img/[name].[hash:8].[ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 5000
          }
        }
      },
      {
        test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
        type: 'asset',
        // 配置  Rule.parser.dataUrlCondition.maxSize 来 选择是 asset/resouse 或 asset\inline
        parser: {
          dataUrlCondition: {
            maxSize: 16930, // 导入图片的大小为16940，比maxsize大，采用asset/resouse方式，将生成的图片img/1.f238.jpg存放在内存的项目根目录中，虚拟。
          },
        },
        // Rule.generator.filename 只对asset和asset/resource模块类型起作用。
        generator: {
          filename: 'img/[name].[hash:4][ext]' // 采用asset和asset/resource类型生成图片的存放路径
        }
      },
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          ...commonCssLoader,
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
            ...commonCssLoader,
            'less-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "练习webpack", // 生成的html文档的标题
      template: path.resolve(__dirname, './public/index.html'),
      filename: "index.html", // 输出文件的文件名称，默认为index.html，不配置就是该文件名
      inject: true,  // JS文件注入到body结尾，CSS文件注入到head中
    }),
    // 打包前移除/清理 打包目录
    new CleanWebpackPlugin(),
    new friendlyErrorsWebpackPlugin({
      // 成功输出
      compilationSuccessInfo: {
        messages: ['Your application is running here: http://localhost:8082']
      },
      // 每次都清空控制台
      clearConsole: true
    }),
    // 对输出的css文件进行重命名
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    // 压缩 css
    new OptimizeCssAssetsWebpackPlugin()
  ],
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, PackageName),
    },
    open: false,
    hot: true,
    port: 8082,
  },
}

// "start": "webpack serve --mode=development --config ./webpack.config.js",
// "bulid": "webpack --mode=production --config ./webpack.config.js"