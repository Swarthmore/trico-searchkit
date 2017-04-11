import React, { Component } from 'react'
import { extend, map, keys } from 'lodash'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  Hits, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar, Select, CheckboxItemComponent, FastClick } from 'searchkit'
let block = require("bem-cn")

function TCGitemRenderer(props: ItemComponentProps) {
  const {
    bemBlocks, onClick, active, disabled, style, itemKey,
    label, count, showCount, showCheckbox} = props
  const block = bemBlocks.option
  const className = block()
    .state({ active, disabled })
    .mix(bemBlocks.container("item"))
  const elmId = bemBlocks.container("text") + "_" + label.toLowerCase().replace(/\s+/g, "_")

  const hasCount = showCount && (count != undefined) && (count != null)
  return (
    <TCGFastClick handler={onClick}>
    <label htmlFor={elmId}>
      <div className={className} style={style} data-qa="option" data-key={itemKey}>
        {showCheckbox ? <input type="checkbox" id={elmId} data-qa="checkbox" checked={active} className={block("checkbox").state({ active }) } ></input> : undefined}
        <div data-qa="label" className={block("text") }>{label}</div>
        {hasCount ? < div data-qa="count" className={block("count") }>{count}</div> : undefined}
      </div>
    </label>
    </TCGFastClick>
  )
}


class TCGFastClick extends FastClick{

  startPoint:Point
  threshold = 20
  supportsTouch:boolean

  handleMouseDown(event){
    if (this.supportsTouch) return
    if(event.button === 0){
      this.props.handler()
    }
  }

  cleanupTouch(){
    delete this.startPoint
  }

  getSinglePoint(event):Point{
    let touches = event.changedTouches
    if(touches.length === 1){
      return {
        x:touches[0].pageX,
        y:touches[0].pageY
      }
    }
    return null
  }

  handleTouchStart(event){
    this.supportsTouch = true
    this.startPoint = this.getSinglePoint(event)
  }

  pointsWithinThreshold(p1, p2){
    return(
      Math.abs(p1.x - p2.x) < this.threshold &&
      Math.abs(p1.y - p2.y) < this.threshold
    )
  }

  handleTouchEnd(event){
    if(this.startPoint){
      let endPoint = this.getSinglePoint(event)
      if(this.pointsWithinThreshold(this.startPoint, endPoint)){
        this.props.handler()
      }
      this.cleanupTouch()
    }

  }

  handleClick(event){
    event.preventDefault()
  }

  render(){
    //return React.cloneElement(this.props.children)
    return React.cloneElement(this.props.children, {
      onMouseDown:this.handleMouseDown.bind(this),
      onTouchStart:this.handleTouchStart.bind(this),
      onTouchEnd:this.handleTouchEnd.bind(this),
      onClick:this.handleClick.bind(this),
      onKeyDown:this.handleClick.bind(this)
    })
  }

}

export class TCGCheckboxItemComponent extends CheckboxItemComponent {
  render () {
    return TCGitemRenderer(this.props)
  }
}

export class TCGSearchBox extends SearchBox {
  render() {
    let block = this.bemBlocks.container
    return (
      <div className={block().state({focused:this.state.focused})}>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className={block("icon")}></div>
          <input type="text"
          aria-label={this.props.placeholder || this.translate("searchbox.placeholder")}
          data-qa="query"
          className={block("text")}
          placeholder={this.props.placeholder || this.translate("searchbox.placeholder")}
          value={this.getValue()}
          onFocus={this.setFocusState.bind(this, true)}
          onBlur={this.setFocusState.bind(this, false)}
          ref="queryField"
          autoFocus={this.props.autofocus}
          onInput={this.onChange.bind(this)}/>
          <input type="submit" value="search" aria-label="Submit" className={block("action")} data-qa="submit"/>
          <div data-qa="loader" className={block("loader").mix("sk-spinning-loader").state({hidden:!this.isLoading()})}></div>
        </form>
      </div>
    );
  }
}

export class TCGDeptSelect extends Select {

  render() {
    const { mod, className, items,
      disabled, showCount, translate, countFormatter } = this.props

    const bemBlocks = {
      container: block(mod)
    }
    let selVal = (this.getSelectedValue()||"")
    return (
      <div className={bemBlocks.container().mix(className).state({ disabled }) }>
        <select aria-label="Department" onChange={this.onChange} value={selVal}>
          {map(items, ({key, label, title, disabled, doc_count}, idx) => {
            var text = translate(label || title || key)
            if (showCount && doc_count !== undefined) text += ` (${countFormatter(doc_count)})`
            return <option key={key} value={key} disabled={disabled}>{text}</option>
          })}
          </select>
      </div>
    )
  }
}
