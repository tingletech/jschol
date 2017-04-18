import React from 'react'
import { Subscriber } from 'react-broadcast'
import { Link } from 'react-router'
import Sidebar from 'react-sidebar'
import { sortable } from 'react-sortable'

class DrawerItem extends React.Component {
  state = {editing: false, type: this.props.navItem.slug ? 
    'page' : this.props.navItem.url ? 
    'url' : this.props.navItem.file ? 
    'file' : this.props.navItem.sub_nav ? 
    'sub_nav' : undefined
  }
  
  getNavItemJSX(navItem) {
    var link;
    if ('url' in navItem) {
      return (
        <a href={navItem.url} key={navItem.name}>
          {navItem.name}
        </a>
      )
    }
    if ('slug' in navItem) {
      return (
        <Link key={navItem.slug} to={"/unit/" + this.props.unit.id + "/" + navItem.slug }>{navItem.name}</Link>
      )
    }
    //TODO: if ('file' in navItem)...
    if ('file' in navItem) {
      return (
        <a>{navItem.name}</a>
      )
    }
    return undefined
  }

  editItem = () => {
    this.setState({editing: true});
  }
  
  onSave = () => {
    this.setState({editing: false});
  }
  
  cancel = () => {
    this.setState({editing: false});
  }

  render() {
    if (this.state.editing) {
      var buttons = (
        <div className="c-drawer__nav-buttons">
          <button onClick={e => this.onSave()}><img src="/images/check-square.svg"/></button>
          <button><img src="/images/eye.svg"/></button><br/>
          <button onClick={e => this.cancel()}><img src="/images/times.svg"/></button>
          <button><img src="/images/trash-o.svg"/></button>
        </div>
      )
      return (
        <div className="c-drawer__list-item">
          <label>Label:</label>
          <input id="navItemName" 
            name='navItemName' value={this.props.navItem.name} onChange={e => console.log(e)}/>
          {buttons}<br/>
          <label>
            <input id="navItemType" type="radio"
              name='navItemType' value="Page" onChange={e => console.log(e)} checked={this.props.navItem.slug ? true : false}/>
            Page
          </label>
          <label>
            <input id="navItemType" type="radio"
              name='navItemType' value="URL" onChange={e => console.log(e)} checked={this.props.navItem.url ? true: false}/>
            URL
          </label>
          <label>
            <input id="navItemType" type="radio"
              name='navItemType' value="File" onChange={e => console.log(e)} checked={this.props.navItem.file ? true: false}/>
            Upload File
          </label><br/>
          <label htmlFor="navItemData">{this.props.navItem.slug ? "Slug: " : this.props.navItem.url ? "URL: " : ""}</label>
          <input id="navItemData" onChange={e => console.log(e)}
            name='navItemData' value={this.props.navItem.slug ? this.props.navItem.slug : this.props.navItem.url ? this.props.navItem.url : ''}/>
        </div>
      )
    } else {
      var buttons = (
        <div className="c-drawer__nav-buttons">
          <button onClick={e => this.editItem()}><img src="/images/icon_pencil-black.svg"/></button>
          <button><img src="/images/eye.svg"/></button>
        </div>
      )
      if ('sub_nav' in this.props.navItem) {
        return (
          <div className="c-drawer__list-item-subnav">
            <div className="c-drawer__list-item-subnav-header">
              {this.props.navItem.name}
              {buttons}
            </div>
            <SortableList data={this.props.navItem.sub_nav} unit={this.props.unit}/>
          </div>
        )
      } else {
        return (
          <div className="c-drawer__list-item">
            {this.getNavItemJSX(this.props.navItem)}
            {buttons}
          </div>
        )
      }      
    }
  }
}

class ListItem extends React.Component {
  static displayName = 'SortableListItem';
  
  render() {
    return (
      <div {...this.props} className={this.props.className}>{this.props.children}</div>
    )
  }
}

const SortableListItem = sortable(ListItem);

class SortableList extends React.Component {
  state = {draggingIndex: null, data: this.props.data}
  
  updateState = (obj) => {
    this.setState(obj);
  }
  
  render() {
    var listItems = this.state.data.map((item, i) => {
      return (
        <SortableListItem
          key={i}
          updateState={this.updateState}
          items={this.state.data}
          draggingIndex={this.state.draggingIndex}
          sortId={i}
          outline="list"
          ><DrawerItem navItem={item} unit={this.props.unit}/></SortableListItem>
      );
    });
    
    return (
      <div className="list">{listItems}</div>
    )
  }
  
}

class DrawerComp extends React.Component {
  // state = {sidebarOpen: true};
  //
  onSetSideBarOpen(open) {
    this.setState({sidebarOpen: open});
  }
  
  addNavItem = () => {
    console.log('do stuff!');
  }
  
  addFolder = () => {
    console.log('add folder!');
  }
  
  render() {
    var data = 'header' in this.props.data && 'nav_bar' in this.props.data.header ? this.props.data.header.nav_bar : undefined;
    
    var sidebarContent = data ? (
      <div>
        <div className="c-drawer__heading">
          Navigation Items
        </div>
        <SortableList data={data} unit={this.props.data.unit}/>
        <div className="c-drawer__add-buttons">
          <div className="c-drawer__add-item">
            <button onClick={e => this.addNavItem()}><img src="/images/white/plus.svg"/></button>
          </div>
          <div className="c-drawer__add-folder">
            <button onClick={e => this.addFolder()}><img src="/images/white/folder.svg"/></button>
          </div>
        </div>
      </div>
    ) : (<div></div>);
    return (
      <Subscriber channel="cms">
        { cms =>  
          ('header' in this.props.data && 'nav_bar' in this.props.data.header) ?
            <Sidebar 
              sidebar={sidebarContent} 
              open={cms.isEditingPage}
              docked={cms.isEditingPage} 
              onSetOpen={this.onSetSidebarOpen}
              sidebarClassName="c-drawer">
        
              {this.props.children}
            </Sidebar> : <div>{this.props.children}</div>
        }
      </Subscriber>
    )
  }
}

module.exports = DrawerComp;