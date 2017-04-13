import React, { Component } from 'react'
import { extend, map, keys, defaults } from 'lodash'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  Hits, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters, FilterGroup, FilterGroupItem, ResetFiltersDisplay,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar, Select, CheckboxItemComponent, Toggle, ItemComponent, AbstractItemList } from 'searchkit'
let block = require("bem-cn")


export class TCGFilterGroup extends FilterGroup {
  renderFilter(filter, bemBlocks) {
    const { translate, removeFilter } = this.props

    return (
      <TCGFilterGroupItem key={filter.value}
                  itemKey={filter.value}
                  bemBlocks={bemBlocks}
                  filter={filter}
                  label={translate(filter.value)}
                  removeFilter={removeFilter} />
    )
  }

  renderRemove(bemBlocks, filters) {
    if (!this.props.removeFilters) return null
    const linkTitle = "Remove " + filters[0].name + " filter"
    return (
        <a href="#" title={linkTitle} className={bemBlocks.container("remove-action") } onClick={this.removeFilters}>X</a>
    )
  }

  render() {
    const { mod, className, title, filters, removeFilters, removeFilter } = this.props

    const bemBlocks = {
        container: block(mod),
        items: block (`${mod}-items`)
    }

    return (
      <div key={title} className={bemBlocks.container().mix(className)}>
        <div className={bemBlocks.items()}>
          <div className={bemBlocks.items("title")}>{title}</div>
          <div className={bemBlocks.items("list")}>
            {map(filters, filter => this.renderFilter(filter, bemBlocks))}
          </div>
        </div>
        {this.renderRemove(bemBlocks, filters)}
      </div>
    )
  }
}

export class TCGResetFiltersDisplay extends ResetFiltersDisplay{
	render(){
		const {bemBlock, hasFilters, translate, resetFilters, clearAllLabel} = this.props
    const linkClass = bemBlock().state({disabled:!hasFilters}) + " " + bemBlock("reset")
		return (
					<div className="filter-reset">
						<a href="#" onClick={resetFilters} className={linkClass}>{clearAllLabel}</a>
					</div>
		)
	}
}

export class TCGFilterGroupItem extends FilterGroupItem {
  render(){
    const { bemBlocks, label, itemKey, filter } = this.props
    const linkTitle = "Remove " + label + " " + filter.name + " filter"
    return (
        <a href="#" title={linkTitle} onClick={this.removeFilter}>
            <div className={bemBlocks.items("value") } data-key={itemKey}>{label}</div>
        </a>
    )
  }
}
/**
 * itemRender function that does not use the FastClick element
 */
function TCGitemRenderer(props: ItemComponentProps) {
  const {
    bemBlocks, onClick, active, disabled, style, itemKey,
    label, count, showCount, showCheckbox} = props
  const block = bemBlocks.option
  const className = block()
    .state({ active, disabled })
    .mix(bemBlocks.container("item"))
  const elmId = bemBlocks.container("text") + "_" + label.toLowerCase().replace(/\s+/g, "_")

  const hasCount = showCount && (count !== undefined) && (count != null)
  return (
    <label htmlFor={elmId}>
      <div className={className} style={style} data-qa="option" data-key={itemKey}>
        <input type="checkbox" aria-label={label} id={elmId} onChange={onClick} data-qa="checkbox" checked={active} className={block("checkbox").state({ active }) } ></input>
        <div data-qa="label" className={block("text") }>{label}</div>
        {hasCount ? < div data-qa="count" className={block("count") }>{count}</div> : undefined}
      </div>
    </label>
  )
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
          role="search"
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
    )
  }
}

export class TCGDeptSelect extends Select {
  onChange(e){
    const { setItems } = this.props
    const key = e.target.value
    const itemArr = (key.length) ? [key] : []
    setItems(itemArr)
  }

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
          <option value="">Select a Department</option>
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

class TCGPageItemComponent extends React.Component{
  render () {
    const {
    bemBlocks, onClick, active, disabled, style, itemKey,
    label} = this.props
    const block = bemBlocks.option
    const className = block()
      .state({ active, disabled })
      .mix(bemBlocks.container("item"))
    const titleAttr = (label.match(/^[0-9]+$/)) ? "page " + label : "go to " + label.toLowerCase() + " page"
    if (!disabled){
      return (
        <a href="#" title={titleAttr} onClick={onClick} className={className} style={style} data-qa="option" data-key={itemKey}>
          <div data-qa="label" className={block("text") }>{label}</div>
        </a>
      )
    } else {
      return (
        <div className={className} style={style} data-qa="option" data-key={itemKey}>
          <div data-qa="label" className={block("text") }>{label}</div>
        </div>
      )
    }
  }
}

export class TCGPageToggle extends AbstractItemList{
    static defaultProps = defaults({
        itemComponent: TCGPageItemComponent,
        mod: 'sk-toggle',
        showCount: false
    }, AbstractItemList.defaultProps)
}
