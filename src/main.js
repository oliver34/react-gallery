let imageData;
(function(url){
	var xhr = new XMLHttpRequest();
	xhr.open("get",url,false);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			imageData =  JSON.parse(xhr.responseText).data;
		}
	};
	xhr.send(null);
})("../data/imagedata.json")

//获取区间内的一个随机值
var getRangeRandom = (low,high) => {return (Math.random()*(high-low)+low)};

//获取0-30区间的任意正负值
var get30DegRandom = () =>{
	return ((Math.random() > 0.5 ? '' : '-')+(Math.random()*30));
};

class ImageFigure extends React.Component{
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}

	render(){
		var styleObj = {};

		//如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		//添加图片旋转角度
		if(this.props.arrange.rotate){
			(["Moz","ms","Webkit",""]).forEach(function(value){
				styleObj[value+"Transform"] = "rotate("+this.props.arrange.rotate+"deg)";
			}.bind(this));
			
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}
		var imgFigClassName = "img-figure";
		imgFigClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
		return(
			<figure className = {imgFigClassName} style = {styleObj} onClick={this.handleClick}>
				<img src = {this.props.data.fileUrl} alt = {this.props.data.title} className='img'/>
				<figcaption>
					<h2 className = "img-title">{this.props.data.title}</h2>
					<div className = "img-back" onClick = {this.handleClick}>
						<p>
							{this.props.data.description}
						</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}

//控制组件
class ControBar extends React.Component{
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e){
		//如果点击选中状态的按钮，则翻转图片，否则居中对应图片
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}
	render(){
		var controBarClassName = "control-bar";
		//如果对应是居中图片，显示控制按钮的居中状态
		if(this.props.arrange.isCenter){
			controBarClassName += " is-center iconfont";
			//如果图片翻转
			if(this.props.arrange.isInverse){
				controBarClassName += " icon-arrow-left";
			}else{
				controBarClassName += " icon-arrow-right";
			}
		}

		return (
			<span className = {controBarClassName} onClick = {this.handleClick}>
			</span>
		)
	}
};

class  Gallery extends React.Component{
	constructor(props){
		super(props);
		this.reArrange = this.reArrange.bind(this);
		this.inverse = this.inverse.bind(this);
		this.center = this.center.bind(this);
		this.state = {
				imagesAranArr : [{
				pos : {
					left : 0,
					top : 0
				},
				rotate : 0, //图片旋转角度
				isInverse : false, //图片是否翻转
				isCenter : false
			}]
		};
	}

	/*组件加载后,为每张图片计算其位置的范围*/
	componentDidMount(){
		//获取舞台
		let stage = ReactDOM.findDOMNode(this.refs.stage),
			stageWid = stage.scrollWidth,
			stageHeight = stage.scrollHeight,
			stageHalfWid = Math.ceil(stageWid/2),
			stageHalfHei = Math.ceil(stageHeight/2);
		//获取imageFigure
		let imFig = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgWidth = imFig.scrollWidth,
			imgHeight = imFig.scrollHeight,
			imgHalfWid = Math.ceil(imgWidth/2),
			imgHalfHei = Math.ceil(imgHeight/2);
		//计算中心图片的高度
		var constant = this.props.Constant;
		constant.centerPos = {
			left: stageHalfWid - imgHalfWid,
			top: stageHalfHei - imgHalfHei 
		}
		//计算左侧、右侧区域图片排布位置的取值范围

		constant.hoPosRange.leftSecX[0] = - imgHalfWid;
		constant.hoPosRange.leftSecX[1] = stageHalfWid - imgHalfWid * 3;
		
		constant.hoPosRange.rightSecx[0] = stageHalfWid + imgHalfWid;
		constant.hoPosRange.rightSecx[1] = stageWid - imgHalfWid;
		constant.hoPosRange.y[0] = -imgHalfHei;
		constant.hoPosRange.y[0] = stageHeight - imgHalfHei;
		
		//计算上侧区域图片排布位置的取值范围
		constant.voPosRange.topY[0] = - imgHalfHei 	- 30;
		constant.voPosRange.topY[1] = stageHalfHei - imgHalfHei * 3 - 30;
		constant.voPosRange.x[0] = stageHalfWid - imgWidth;
		constant.voPosRange.x[1] = stageHalfWid;
		this.reArrange(0);
	}
	/*
	 * 重新布局所有图片
	 * @param: centerIndex 指定居中排布哪个图片
	 */
	reArrange (centerIndex){

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
			topImgNum = Math.floor(Math.random() * 2),//取一个或者不取
			topImgSpliceIdex = 0,
			imgsArranCenterArr = imagesAranArr.splice(centerIndex,1);
			
			//居中cengerIndex图片 居中图片无需旋转
			imgsArranCenterArr[0] = {
				pos : centerPos,
				rotate : 0,
				isCenter : true
			}
			//取出要布局在上侧的图片的信息
			topImgSpliceIdex = Math.ceil(Math.random() * (imagesAranArr.length - topImgNum));
			imagesAranTopArr = imagesAranArr.splice(topImgSpliceIdex,topImgNum);

			//布局位于上侧的图片
			imagesAranTopArr.forEach(function(value,index){
				imagesAranTopArr[index] = {
					pos : {
						left : getRangeRandom(voPosRangeX[0],voPosRangeX[1]),
						top : getRangeRandom(voPosRangeTopY[0],voPosRangeTopY[1])
					},
					rotate : get30DegRandom(),
					isCenter : false
				};
			});
			
			//布局位于左右两侧的图片
			for(let i = 0,j = imagesAranArr.length, k = j / 2;i < j; i++){
				var hosPosRanLoRX = null;

				//前半部分布局左边，后半部分布局右边
				if(i < k){
					hosPosRanLoRX = hoPosRangeLeftSecX;
				}else{
					hosPosRanLoRX = hoPosRangeRightSecX;
				}
				imagesAranArr[i] = {
					pos : {
						left : getRangeRandom(hosPosRanLoRX[0],hosPosRanLoRX[1]),
						top : getRangeRandom(hoPosRangeY[0],hoPosRangeY[1])
					},
					rotate : get30DegRandom(),
					isCenter : false
				};
			}
			if(imagesAranTopArr && imagesAranTopArr[0]){
				imagesAranArr.splice(topImgSpliceIdex,0,imagesAranTopArr[0]);
			}

			imagesAranArr.splice(centerIndex,0,imgsArranCenterArr[0]);
			this.setState({
				imagesAranArr : imagesAranArr
			})
	}

	/*
	 * 利用reArrange居中对应图片
	 * @param: index 需要居中的对应图片信息数组的index值
	 * @return: {Funtion}
	 */
	center(index){
		return function () {
			this.reArrange(index);
		}.bind(this);
	}

	/*
	 * 翻转图片
	 * @param: index 输入当前被执行翻转的对应图片信息数组的index值
	 * @return: {Function}闭包函数，其内return一个真正待被执行的函数
	 */
	inverse(index){
		return function(){
			var imagesAranArr = this.state.imagesAranArr;
			imagesAranArr[index].isInverse = !imagesAranArr[index].isInverse;
			this.setState({
				imagesAranArr : imagesAranArr
			});

		}.bind(this);
	}

	render(){
		let controlBar = [],imgFigures = [];
		imageData.forEach(function(value,index){
			if(!this.state.imagesAranArr[index]){
				this.state.imagesAranArr[index] = {
					pos : {
						left : 0,
						top : 0
					},
					rotate : 0,
					isInverse : false,
					isCenter : false
				}
			}
			imgFigures.push(<ImageFigure key = {index} data={value} ref={"imgFigure"+index} 
				arrange = {this.state.imagesAranArr[index]} 
				inverse = {this.inverse(index)} center = {this.center(index)}/>);
			controlBar.push(<ControBar key = {index} arrange = {this.state.imagesAranArr[index]} 
							inverse = {this.inverse(index)} center = {this.center(index)}/>);
		}.bind(this))
		return(
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="control-nav">
					{controlBar}
				</nav>
			</section>
		)
	}
};

Gallery.defaultProps = {
	Constant : {
		centerPos:{
			left:0,
			top:0
		},
		hoPosRange:{//水平方向取值范围
			leftSecX:[0,0],
			rightSecx:[0,0],
			y:[0,0],
		},
		voPosRange:{//垂直方向取值范围
			x:[0,0],
			topY:[0,0]
		}
	}
};

ReactDOM.render(<Gallery/>,document.getElementById("content"));
