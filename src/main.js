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
function getRangeRandom(low,high){
	return (Math.random()*(high-low)+low);
};
class ImageFigure extends React.Component{
	render(){
		var styleObj = {};

		//如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		return(
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.fileUrl} alt={this.props.data.title} className='img'/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		)
	}
}

class  Gallery extends React.Component{
	constructor(props){
		super(props);
		this.reArrange = this.reArrange.bind(this);
		this.state = {
				imagesAranArr:[{
				pos:{
					left:0,
					top:0
				}
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
		constant.voPosRange.topY[0] = - imgHalfHei;
		constant.voPosRange.topY[1] = stageHalfHei - imgHalfHei * 3;
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
			topImgNum = Math.ceil(Math.random() * 2),//取一个或者不取
			topImgSpliceIdex = 0,
			imgsArranCenterArr = imagesAranArr.splice(centerIndex,1);
			
			//居中cengerIndex图片
			imgsArranCenterArr[0].pos = centerPos;
			
			//取出要布局在上侧的图片的信息
			topImgSpliceIdex = Math.ceil(Math.random() * (imagesAranArr.length - topImgNum));
			imagesAranTopArr = imagesAranArr.splice(topImgSpliceIdex,topImgNum);

			//布局位于上侧的图片
			imagesAranTopArr.forEach(function(value,index){
				imagesAranTopArr[index].pos = {
					left : getRangeRandom(voPosRangeX[0],voPosRangeX[1]),
					top : getRangeRandom(voPosRangeTopY[0],voPosRangeTopY[1])
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
				imagesAranArr[i].pos = {
					left : getRangeRandom(hosPosRanLoRX[0],hosPosRanLoRX[1]),
					top : getRangeRandom(hoPosRangeY[0],hoPosRangeY[1])
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
	render(){
		let controller = [],imgFigures = [];
		imageData.forEach(function(value,index){
			if(!this.state.imagesAranArr[index]){
				this.state.imagesAranArr[index] = {
					pos: {
						left:0,
						top:0
					}
				}
			}
			imgFigures.push(<ImageFigure data={value} ref={"imgFigure"+index} 
				arrange = {this.state.imagesAranArr[index]} />);
		}.bind(this))
		return(
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="control-nav">
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
