import React, { Component } from 'react'
import { extend, map } from 'lodash'
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

const CourseListTable = (props) => {
  const { hits } = props
  return (
    <div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>
       <table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
         <thead>
           <tr>
             <th>Campus</th>
             <th>Semester</th>
             <th>Number</th>
             <th>Name</th>
             <th>Instructor</th>
             <th>Schedule</th>
           </tr>
         </thead>
         <tbody>
           {map(hits, CourseListTableRow)}
         </tbody>
       </table>
     </div>
  )
}

const CourseListTableRow = (result) => {
  const source:any = extend({}, result._source, result.highlight)
  return (
    <tr key={result._id} className="sk-hits-row">
      <td>{source.campus}</td>
      <td>{source.semester}</td>
      <td>{source.courseNumber}</td>
      <td dangerouslySetInnerHTML={{__html: source.name}}></td>
      <td dangerouslySetInnerHTML={{__html: source.instructor}}></td>
      <td>{source.day.join(', ')} {source.time.join(', ')}</td>
    </tr>
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
            <RefinementListFilter listComponent={Select} id="department" title="Department" field="program.keyword" orderKey="_term" operator="OR" size={1000}/>
            <InputFilter id="instructors" searchThrottleTime={500} title="Instructors" placeholder="Search instructors" searchOnChange={true} queryFields={["instructor"]} />
            <RefinementListFilter id="days" title="Days" field="day.keyword" size={50} operator="OR"/>
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
            <Hits hitsPerPage={20} highlightFields={["name","description","instructor"]} listComponent={CourseListTable} />
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
