function getImageData(){
	var xhr = new XMLHttpRequest();
	xhr.open("get","../data/imagedata.json");
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			return xhr.responseText;
			xhr = null;
		}
	};
	xhr.send(null);
}
class Gallery extends React.Component{
	render(){
		return(
			<section className="stage">
				<section className="img-sec">
				</section>
				<nav className="control-nav">
				</nav>
			</section>
		)
	}
}
/*class LikeButton extends React.Component{
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.state = {liked :false};
	}
	handleClick(){
		getImageData();
		this.setState({liked : !this.state.liked});
	}
	render(){
		var text = this.state.liked ? "like" : "never liked";
		return (
			<p onClick={this.handleClick}>
				You {text} this. Click to toggle.
			</p>
		);
	}
};*/
ReactDOM.render(<Gallery/>,document.getElementById("content"));
