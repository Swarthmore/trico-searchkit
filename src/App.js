import React, { Component } from 'react'
import { extend } from 'lodash'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  Hits, DynamicRangeFilter,
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
  const source:any = extend({}, result._source, result.highlight)
  let raw = JSON.stringify(result) + "\n\n----\n" + JSON.stringify(source) + "\n\n----\n" + JSON.stringify(props);
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className="course-campus">{source.campus}</div>
      <div className="course-semester">{source.semester}</div>
      <div className="course-id">{source.courseNumber}</div>
      <div className="course-name" dangerouslySetInnerHTML={{__html: source.name}}></div>
      <div className="course-instructor" dangerouslySetInnerHTML={{__html: source.instructor}}></div>
      <div className="course-times">{source.day}{source.time}</div>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
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
            <Hits hitsPerPage={20} highlightFields={["name","description","instructor"]} itemComponent={CourseListItem} scrollTo="body" mod="sk-hits-list" />
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
