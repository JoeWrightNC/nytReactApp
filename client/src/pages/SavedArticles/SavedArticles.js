import React, { Component } from "react";
import API from "../../utils/API";
import { Article } from "../../components/Article"



export default class SavedArticles extends Component {
  state = {
    savedArticles: []//stores saved articles as array in state
  };

  //when the route is hit through react router,
  //call the function to call mongoDB, retrieve saved articles,
  //add them to the array in state, and render page
  componentWillMount() {
    this.loadArticles();
  };

//query MongoDB
  loadArticles = () => {
    API
      .getArticles()
      .then(results => {
        this.setState({savedArticles: results.data})
      })
  };

  //herlper function to delete an article from the saved page
  delete = id => {
    API
      .delete(id)
      .then(results => {
        //once deleted, they are removed from the array in state and page is rerendered from updated state
        let savedArticles = this.state.savedArticles.filter(article => article._id !== id)
        this.setState({savedArticles: savedArticles})
        this.loadArticles();
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div class="container-fluid pageBody">
        <div class="row">
        <div className="col-sm-1"></div>
          <div class="col-sm-10">
            <div className="panel panel-primary">
              <div className="panel-heading bg-light clearfix">
                <h3>Saved Articles</h3>
              </div>
              <div className="panel-body">
                { this.state.savedArticles.length > 0 ?
                  (this.state.savedArticles.map((article, i) => (
                    <Article
                      key={i}
                      title={article.title}
                      url={article.url}
                      summary={article.summary}
                      date={article.date}
                      type="Delete"
                      onClick={() => this.delete(article._id)}
                    />
                    )
                  )) : <h1>You have no saved articles.</h1>
                }
              </div>
            </div>
          </div>
          <div className="col-sm-1"></div>
        </div>
      </div>
    );
  };
};
