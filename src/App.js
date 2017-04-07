import React, { Component } from 'react'
import { extend } from 'lodash'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar, Select } from 'searchkit'
import './index.css'

const host = "https://search-course-data-mspkldvllazhgahqqsihmvdzka.us-east-1.es.amazonaws.com"
const indexName = "courses";
const searchkit = new SearchkitManager(host, {
  searchUrlPath: "/" + indexName + "/_search"
})


const CourseListItem = (props)=> {
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
            <SearchBox autofocus={true} searchOnChange={true} prefixQueryOptions={{analyzer:"standard"}} prefixQueryFields={["name^9","description^5","instructor^4","program"]}/>
          </TopBar>

        <LayoutBody>

          <SideBar>
            <RefinementListFilter id="campus" title="Campus" field="campus.keyword" size={10}  operator="OR"/>
            <RefinementListFilter id="semester" title="Semester" field="semester.keyword" size={10}  operator="OR"/>
            <RefinementListFilter listComponent={Select} id="department" title="Department" field="program.keyword" orderKey="_term" operator="OR"/>
            <InputFilter id="instructors" searchThrottleTime={500} title="Instructors" placeholder="Search instructors" searchOnChange={true} queryFields={["instructor"]} />
            <RefinementListFilter id="days" title="Days" field="day.keyword" size={10} operator="OR"/>
          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <ViewSwitcherHits
                hitsPerPage={20} highlightFields={["name","description"]}
                hitComponents={[
                  {key:"list", title:"List", itemComponent:CourseListItem, defaultOption:true}
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
