import React, { Component } from "react";
import API from "../../utils/API";
import { Article } from "../../components/Article"


export default class Articles extends Component {
  state = {
    searchTerm: "",
    startYear: "",
    endYear: "",
    page: "0",
    previousSearch: {},
    results: [],
    noResults: false,
  };


  //helper function to save an article
  save = (article) => {
    let newArticle = {
      date: article.pub_date,
      title: article.headline.main,
      url: article.web_url,
      summary: article.snippet
    }
    //Call API in utils, bounce to Routes, then pushed to controller to write to MongoDB
    API
      .save(newArticle)
      .then(results => {
        //remove saved article from homepage results
        let unsavedArticles = this.state.results.filter(article => article.headline.main !== newArticle.title)
        this.setState({results: unsavedArticles})
      })
      .catch(err => console.log(err));
  }

  //helper function to capture value of inputs on change
  handleInputChange = event => {
    let { name, value } = event.target;
    this.setState({[name] : value})
  };

  //take the form on submit and grab parameters to query NYT API
  handleFormSubmit = event => {
    event.preventDefault();
    let { searchTerm, startYear, endYear } = this.state;
    let query = { searchTerm, startYear, endYear }
    this.getArticles(query)
  };

  //function to ping NYT api based on user parameters
  getArticles = query => {
    //clears the previous results page if the parameters of search have changed, prevent bad returns
    if (query.searchTerm !== this.state.previousSearch.searchTerm ||
        query.endYear !==this.state.previousSearch.endYear ||
        query.startYear !==this.state.previousSearch.startYear) {
      this.setState({results: []})
    }
    let { searchTerm, startYear, endYear } = query

    let queryUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?sort=newest&page=${this.state.page}`
    let key = `&api-key=2b4af346ebca46a08d42029aacff4a1d`

    //regex to remove spaces from search term and replace with plus symbol, better ux nyt params won"t take spaces
    if(searchTerm.indexOf(" ")>=0){
      searchTerm = searchTerm.replace(/\s/g, "+");
    }
    //add each provided parameter to queryURL before adding it to key and pinging API
    if (searchTerm){
      queryUrl+= `&q=${searchTerm}`
    }
    if(startYear){
      queryUrl+= `&begin_date=${startYear}`
    }
    if(endYear){
      queryUrl+= `&end_date=${endYear}`
    }
    queryUrl+=key;

    //calling the API
    API
      .queryNYT(queryUrl)
      .then(results => {
          console.log(results.data.response.docs[0].multimedia[2])
          //use spread operator to continually append to page on button push while not mutating state
          //also set noResults value at this time to use conditionally to render results return div
          this.setState({
            results: [...this.state.results, ...results.data.response.docs],
            previousSearch: query,
            searchTerm: "",
            startYear: "",
            endYear: ""
          }, function (){
            this.state.results.length === 0 ? this.setState({noResults: true}) : this.setState({noResults: false})
          });
      })
      .catch(err=> console.log(err))
  }

  //helper function to add more results to app by using the pagination property of the NYT API,
  //on each click 10 more results (one page worth) will be added
  getMoreResults = () => {
    let { searchTerm, endYear, startYear} = this.state.previousSearch;
    let query = { searchTerm, endYear, startYear }
    let page = this.state.page;
    page++
    this.setState({page: page}, function (){
      this.getArticles(query)
    });
  }

  render() {
    return (
      <div className="container-fluid pageBody">
        <div className="row">
          <div className="col-sm-1"></div>
          <div className="col-sm-10">
            <div className="panel panel-primary bg-light">
            <div className="panel-heading clearfix">
              <div className="panel-heading clearfix">
                <h3>Search</h3>
              </div>
              <div className="panel-body">
                <form style={{marginBottom: "30px"}}>
                  <div className="form-group">
                    <label htmlFor="searchTerm">Enter a searchTerm to search for:</label>
                    <input className="form-control"
                      onChange={this.handleInputChange}
                      name="searchTerm"
                      value={this.state.searchTerm}
                      placeholder="searchTerm"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="startYear">Enter a Starting Date (optional):</label>
                    <input className="form-control"
                      onChange={this.handleInputChange}
                      type="date"
                      name="startYear"
                      value={this.state.startYear}
                      placeholder="Start Year"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endYear">Enter an Ending Date (optional):</label>
                    <input className="form-control"
                      onChange={this.handleInputChange}
                      type="date"
                      name="endYear"
                      value={this.state.endYear}
                      placeholder="End Year"
                    />
                  </div>
                  <button className="submitBtn" disabled={!(this.state.searchTerm)} onClick={this.handleFormSubmit} type="info">
                    Submit
                  </button>
                </form>
              </div>
            </div>
            </div>
            { this.state.noResults ?
              (<h1>No results Found.  Please try again</h1>) :
              this.state.results.length>0 ? (
                <div className="panel panel-primary">
                <div className="panel-heading clearfix">
                  <div className="panel-heading bg-light clearfix">
                    <h3>Results</h3>
                  </div>
                  <div className="panel-body">
                    {
                      this.state.results.map((article, i) => (
                          <Article
                            key={i}
                            title={article.headline.main}
                            url={article.web_url}
                            summary={article.snippet}
                            date={article.pub_date}
                            type="Save"
                            onClick={() => this.save(article)}
                          />
                        )
                      )
                    }
                    <button className="submitBtn btn-info" onClick={this.getMoreResults}>
                      Get more results
                    </button>
                  </div>
                </div>
                </div>
                //if no results do not print this block
              ) : ""
            }
          </div>
          <div className="col-sm-1"></div>
        </div>
      </div>
    );
  }
}
