(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var imageData = void 0;
(function (url) {
	var xhr = new XMLHttpRequest();
	xhr.open("get", url, false);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			imageData = JSON.parse(xhr.responseText).data;
		}
	};
	xhr.send(null);
})("../data/imagedata.json");

//获取区间内的一个随机值
function getRangeRandom(low, high) {
	return Math.random() * (high - low) + low;
};

//获取0-30区间的任意正负值
function get30DegRandom() {
	return (Math.random() > 0.5 ? '' : '-') + Math.random() * 30;
};

var ImageFigure = function (_React$Component) {
	_inherits(ImageFigure, _React$Component);

	function ImageFigure(props) {
		_classCallCheck(this, ImageFigure);

		var _this = _possibleConstructorReturn(this, (ImageFigure.__proto__ || Object.getPrototypeOf(ImageFigure)).call(this, props));

		_this.handleClick = _this.handleClick.bind(_this);
		return _this;
	}

	_createClass(ImageFigure, [{
		key: "handleClick",
		value: function handleClick(e) {
			if (this.props.arrange.isCenter) {
				this.props.inverse();
			} else {
				this.props.center();
			}
			e.stopPropagation();
			e.preventDefault();
		}
	}, {
		key: "render",
		value: function render() {
			var styleObj = {};

			//如果props属性中指定了这张图片的位置，则使用
			if (this.props.arrange.pos) {
				styleObj = this.props.arrange.pos;
			}

			//添加图片旋转角度
			if (this.props.arrange.rotate) {
				["-moz-", "-ms-", "-webkit-", ""].forEach(function (value) {
					styleObj[value + "transform"] = "rotate(" + this.props.arrange.rotate + "deg)";
				}.bind(this));
			}

			if (this.props.arrange.isCenter) {
				styleObj.zIndex = 11;
			}
			var imgFigClassName = "img-figure";
			imgFigClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
			return React.createElement(
				"figure",
				{ className: imgFigClassName, style: styleObj, onClick: this.handleClick },
				React.createElement("img", { src: this.props.data.fileUrl, alt: this.props.data.title, className: "img" }),
				React.createElement(
					"figcaption",
					null,
					React.createElement(
						"h2",
						{ className: "img-title" },
						this.props.data.title
					),
					React.createElement(
						"div",
						{ className: "img-back", onClick: this.handleClick },
						React.createElement(
							"p",
							null,
							this.props.data.description
						)
					)
				)
			);
		}
	}]);

	return ImageFigure;
}(React.Component);

var Gallery = function (_React$Component2) {
	_inherits(Gallery, _React$Component2);

	function Gallery(props) {
		_classCallCheck(this, Gallery);

		var _this2 = _possibleConstructorReturn(this, (Gallery.__proto__ || Object.getPrototypeOf(Gallery)).call(this, props));

		_this2.reArrange = _this2.reArrange.bind(_this2);
		_this2.inverse = _this2.inverse.bind(_this2);
		_this2.center = _this2.center.bind(_this2);
		_this2.state = {
			imagesAranArr: [{
				pos: {
					left: 0,
					top: 0
				},
				rotate: 0, //图片旋转角度
				isInverse: false, //图片是否翻转
				isCenter: false
			}]
		};
		return _this2;
	}

	/*组件加载后,为每张图片计算其位置的范围*/


	_createClass(Gallery, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			//获取舞台
			var stage = ReactDOM.findDOMNode(this.refs.stage),
			    stageWid = stage.scrollWidth,
			    stageHeight = stage.scrollHeight,
			    stageHalfWid = Math.ceil(stageWid / 2),
			    stageHalfHei = Math.ceil(stageHeight / 2);
			//获取imageFigure
			var imFig = ReactDOM.findDOMNode(this.refs.imgFigure0),
			    imgWidth = imFig.scrollWidth,
			    imgHeight = imFig.scrollHeight,
			    imgHalfWid = Math.ceil(imgWidth / 2),
			    imgHalfHei = Math.ceil(imgHeight / 2);
			//计算中心图片的高度
			var constant = this.props.Constant;
			constant.centerPos = {
				left: stageHalfWid - imgHalfWid,
				top: stageHalfHei - imgHalfHei
			};
			//计算左侧、右侧区域图片排布位置的取值范围

			constant.hoPosRange.leftSecX[0] = -imgHalfWid;
			constant.hoPosRange.leftSecX[1] = stageHalfWid - imgHalfWid * 3;

			constant.hoPosRange.rightSecx[0] = stageHalfWid + imgHalfWid;
			constant.hoPosRange.rightSecx[1] = stageWid - imgHalfWid;
			constant.hoPosRange.y[0] = -imgHalfHei;
			constant.hoPosRange.y[0] = stageHeight - imgHalfHei;

			//计算上侧区域图片排布位置的取值范围
			constant.voPosRange.topY[0] = -imgHalfHei - 30;
			constant.voPosRange.topY[1] = stageHalfHei - imgHalfHei * 3 - 30;
			constant.voPosRange.x[0] = stageHalfWid - imgWidth;
			constant.voPosRange.x[1] = stageHalfWid;
			this.reArrange(0);
		}
		/*
   * 重新布局所有图片
   * @param: centerIndex 指定居中排布哪个图片
   */

	}, {
		key: "reArrange",
		value: function reArrange(centerIndex) {

			var imagesAranArr = this.state.imagesAranArr,
			    constant = this.props.Constant,
			    centerPos = constant.centerPos,
			    hoPosRange = constant.hoPosRange,
			    voPosRange = constant.voPosRange,
			    hoPosRangeLeftSecX = hoPosRange.leftSecX,
			    hoPosRangeRightSecX = hoPosRange.rightSecx,
			    hoPosRangeY = hoPosRange.y,
			    voPosRangeTopY = voPosRange.topY,
			    voPosRangeX = voPosRange.x,
			    imagesAranTopArr = [],
			    topImgNum = Math.ceil(Math.random() * 2),
			    //取一个或者不取
			topImgSpliceIdex = 0,
			    imgsArranCenterArr = imagesAranArr.splice(centerIndex, 1);

			//居中cengerIndex图片 居中图片无需旋转
			imgsArranCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				isCenter: true
			};
			//取出要布局在上侧的图片的信息
			topImgSpliceIdex = Math.ceil(Math.random() * (imagesAranArr.length - topImgNum));
			imagesAranTopArr = imagesAranArr.splice(topImgSpliceIdex, topImgNum);

			//布局位于上侧的图片
			imagesAranTopArr.forEach(function (value, index) {
				imagesAranTopArr[index] = {
					pos: {
						left: getRangeRandom(voPosRangeX[0], voPosRangeX[1]),
						top: getRangeRandom(voPosRangeTopY[0], voPosRangeTopY[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				};
			});

			//布局位于左右两侧的图片
			for (var i = 0, j = imagesAranArr.length, k = j / 2; i < j; i++) {
				var hosPosRanLoRX = null;

				//前半部分布局左边，后半部分布局右边
				if (i < k) {
					hosPosRanLoRX = hoPosRangeLeftSecX;
				} else {
					hosPosRanLoRX = hoPosRangeRightSecX;
				}
				imagesAranArr[i] = {
					pos: {
						left: getRangeRandom(hosPosRanLoRX[0], hosPosRanLoRX[1]),
						top: getRangeRandom(hoPosRangeY[0], hoPosRangeY[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				};
			}
			if (imagesAranTopArr && imagesAranTopArr[0]) {
				imagesAranArr.splice(topImgSpliceIdex, 0, imagesAranTopArr[0]);
			}

			imagesAranArr.splice(centerIndex, 0, imgsArranCenterArr[0]);
			this.setState({
				imagesAranArr: imagesAranArr
			});
		}

		/*
   * 利用reArrange居中对应图片
   * @param: index 需要居中的对应图片信息数组的index值
   * @return: {Funtion}
   */

	}, {
		key: "center",
		value: function center(index) {
			return function () {
				this.reArrange(index);
			}.bind(this);
		}

		/*
   * 翻转图片
   * @param: index 输入当前被执行翻转的对应图片信息数组的index值
   * @return: {Function}闭包函数，其内return一个真正待被执行的函数
   */

	}, {
		key: "inverse",
		value: function inverse(index) {
			return function () {
				var imagesAranArr = this.state.imagesAranArr;
				imagesAranArr[index].isInverse = !imagesAranArr[index].isInverse;
				this.setState({
					imagesAranArr: imagesAranArr
				});
			}.bind(this);
		}
	}, {
		key: "render",
		value: function render() {
			var controller = [],
			    imgFigures = [];
			imageData.forEach(function (value, index) {
				if (!this.state.imagesAranArr[index]) {
					this.state.imagesAranArr[index] = {
						pos: {
							left: 0,
							top: 0
						},
						rotate: 0,
						isInverse: false,
						isCenter: false
					};
				}
				imgFigures.push(React.createElement(ImageFigure, { data: value, ref: "imgFigure" + index,
					arrange: this.state.imagesAranArr[index],
					inverse: this.inverse(index), center: this.center(index) }));
			}.bind(this));
			return React.createElement(
				"section",
				{ className: "stage", ref: "stage" },
				React.createElement(
					"section",
					{ className: "img-sec" },
					imgFigures
				),
				React.createElement("nav", { className: "control-nav" })
			);
		}
	}]);

	return Gallery;
}(React.Component);

;

Gallery.defaultProps = {
	Constant: {
		centerPos: {
			left: 0,
			top: 0
		},
		hoPosRange: { //水平方向取值范围
			leftSecX: [0, 0],
			rightSecx: [0, 0],
			y: [0, 0]
		},
		voPosRange: { //垂直方向取值范围
			x: [0, 0],
			topY: [0, 0]
		}
	}
};

ReactDOM.render(React.createElement(Gallery, null), document.getElementById("content"));

},{}]},{},[1]);
