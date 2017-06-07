import React from 'react'
import { Link } from 'react-router'
import { Subscriber } from 'react-broadcast'

import MarqueeComp from '../components/MarqueeComp.jsx'
import ShareComp from '../components/ShareComp.jsx'
import ScholWorksComp from '../components/ScholWorksComp.jsx'

class SeriesComp extends React.Component {
  static propTypes = {
    data: React.PropTypes.shape({
      count: React.PropTypes.number.isRequired,
      items: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        
        abstract: React.PropTypes.string,
        authors: React.PropTypes.array,
        content_type: React.PropTypes.string,
        supp_files: React.PropTypes.array
      })).isRequired,
      name: React.PropTypes.string.isRequired,
      unit_id: React.PropTypes.string.isRequired
    })
  }
  
  render() {
    return (
      <div style={{marginBottom: '30px'}}>
      <h4>Series: <Link to={"/unit/"+this.props.data.unit_id}>{this.props.data.name}</Link></h4>
      <div style={{paddingLeft: '20px'}}>
        { this.props.data.items.map((item) =>
          <ScholWorksComp key={item.id} result={item}/>) }
        <p>{this.props.data.count-3} more works - <Link to={"/unit/"+this.props.data.unit_id}>show all</Link></p>
      </div>
      </div>
    )
  }
}

class DepartmentLayout extends React.Component {
  static propTypes = {
    unit: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      extent: React.PropTypes.object
    }).isRequired,
    data: React.PropTypes.shape({
      journals: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string,
        unit_id: React.PropTypes.string
      })),
      related_orus: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string,
        unit_id: React.PropTypes.string
      })),
      series: React.PropTypes.array.isRequired  //See SeriesComp directly above for Array element structure
    }).isRequired,
    marquee: React.PropTypes.shape({
      carousel: React.PropTypes.any,
      about: React.PropTypes.about
    })
  }
  
  render() {
    var data = this.props.data;

    var seriesList = [];
    for (var s in data.series) {
      if (data.series[s].items.length > 0) {
        seriesList.push(<SeriesComp key={data.series[s].unit_id} data={data.series[s]}/>);
      }
    }

    return (
      <div>
        <MarqueeComp marquee={this.props.marquee} unit={this.props.unit}/>
        <div className="c-columns">
          <main id="maincontent">
            <section className="o-columnbox1">
              <p>There are {this.props.unit.extent.count} publications in this collection, published between {this.props.unit.extent.pub_year.start} and {this.props.unit.extent.pub_year.end}.</p>
              {data.journals.length > 0 && 
                <div><h3>Journals by {this.props.unit.name}</h3>
                <ul>
                  { data.journals.map((child) =>
                    <li key={child.unit_id}><Link to={"/unit/"+child.unit_id}>{child.name}</Link></li>) }
                </ul></div>
              }
              <h3>Works by {this.props.unit.name}</h3>
              {seriesList}
              <hr/>
              <h3>Related Research Centers & Groups</h3>
              <ul>
                { data.related_orus.map((child) =>
                  <li key={child.unit_id}><Link to={"/unit/"+child.unit_id}>{child.name}</Link></li>) }
              </ul>
            </section>
          </main>
          <aside>
            <section className="o-columnbox1">
              <ShareComp type="unit" id={this.props.unit.id} />
            </section>
            {this.props.sidebar}
          </aside>
        </div>
      </div>
    )
  }
}

module.exports = DepartmentLayout
