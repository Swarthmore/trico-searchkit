import React, { Component } from 'react'
import { extend } from 'lodash'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar } from 'searchkit'
import './index.css'

const host = "https://search-course-data-mspkldvllazhgahqqsihmvdzka.us-east-1.es.amazonaws.com"
const indexName = "courses2";
const searchkit = new SearchkitManager(host, {
  searchUrlPath: "/" + indexName + "/_search"
})


const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  //let url = "http://www.imdb.com/title/" + result._source.imdbId
  //const source:any = extend({}, result._source, result.highlight)
  let raw = JSON.stringify(result);
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      {raw}
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo">PH</div>
            <SearchBox autofocus={true} searchOnChange={true} prefixQueryOptions={{analyzer:"standard"}} prefixQueryFields={["name"]}/>
          </TopBar>

        <LayoutBody>

          <SideBar>
            <RefinementListFilter id="program" title="Program" field="program.keyword" size={10}/>
          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label:"Relevance", field:"_score", order:"desc"},
                  {label:"Latest Releases", field:"released", order:"desc"},
                  {label:"Earliest Releases", field:"released", order:"asc"}
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <ViewSwitcherHits
                hitsPerPage={5} highlightFields={["name"]}
                //sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year"]}
                hitComponents={[
                  {key:"list", title:"List", itemComponent:MovieHitsListItem, defaultOption:true}
                ]}
                scrollTo="body"
            />
            <NoHits suggestionsField={"name"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
