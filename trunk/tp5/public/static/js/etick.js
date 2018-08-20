
class AntiwaveFootballOneMatch extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="container">
                <button type="button" className="btn btn-default matchitem" id={this.props.id}>{this.props.matchcaption}</button>
            </div>

        );
    }
}

class AntiwaveFootballMatch extends React.Component{
    constructor(props){
        super(props);
        this.state = {antiwaveFootballMatch: ""};

    }

    componentDidMount(){
        this.serverRequest = $.get("/tp5/public/index.php/etick/match/getantiwavefootballmatchlist", function (result) {
            const jsoncontent = new JSONArray(JSON.parse(result).jsoncontent);
            this.setState({
                antiwaveFootballMatch: jsoncontent
            });
        }.bind(this));
    }


    render(){
        return (
            <div>
                {this.state.antiwaveFootballMatch.map((match, index) =>
                <AntiwaveFootballOneMatch id={match.id} key={index} matchcaption={match.caption} />
                )}
                {/*{this.state.antiwaveFootballMatch.map((oneMatch, index) =>*/}
                    {/*<AntiwaveFootballOneMatch matchcaption={oneMatch.caption} key={index} id={"antiwavefootballmatch" + oneMatch.id}/>*/}
                {/*)}*/}
            </div>
        );
    }
}

ReactDOM.render(
    <AntiwaveFootballMatch />,
    document.getElementById("antiwavefootballmatchcontainer")
);

$("button").click(function(){
    alert(123);
    // var id = this.id;
});
