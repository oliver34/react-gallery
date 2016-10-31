let React = require('react');
let ReactDOM = require('react-dom');

class LikeButton extends React.Component{
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.state = {liked :false};
	}
	handleClick(){
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
};
ReactDOM.render(<LikeButton/>,document.getElementById("example7"));
