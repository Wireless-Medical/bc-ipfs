import React, { Component } from 'react';
import 'whatwg-fetch';
import { Button, Form, FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap';
import FileListItem from './FileListItem';

var PropTypes = require('prop-types');

class FileList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      items: [
        // {
        //   _id: '001',
        //   hashId: 'hashId',
        //   description: 'Item 1',
        //   fileSize: 123,
        //   tokenCost: "100",
        //   noOfAccessed: 0
        // }
      ],
      keyword: props.keyword,
      category: props.category,
      pageIndex: props.pageIndex,
      pageSize: props.pageSize,
      sortedBy: props.sortedBy,
    };
    this.fetchItemsFromServer = this.fetchItemsFromServer.bind(this);
    this.search = this.search.bind(this);
    this.keywordChange = this.keywordChange.bind(this);
  }

  fetchItemsFromServer() {
    console.log('fetchItemsFromServer');
    var targetSearchTemplate = 'blockmed-ipfs';
    window
      .fetch('https://es.blcksync.info/blockmed-ipfs/_search/template', {
        method: 'POST',
        headers: {
          Authorization: 'Basic YWRtaW46YWRtaW4=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: targetSearchTemplate,
          params: {
            query_string: this.state.keyword,
            category: this.state.category,
            size: this.state.pageSize,
            from: this.state.pageIndex * this.state.pageSize, 
            sort_by_time: this.state.sortedBy == 'time' ? 'true' : '',
            sort_by_filesize: this.state.sortedBy == 'filesize' ? 'true' : '',
            sort_by_accessed: this.state.sortedBy == 'accessed' ? 'true' : '',
          },
        }),
      })
      .then(response => response.json())
      .then(esResponse => this.convertToItems(esResponse));
  }

  componentDidMount() {
    this.fetchItemsFromServer();
  }

  search(event) {
    console.log('search for keyword:' + this.state.keyword);
    event.preventDefault();
    this.fetchItemsFromServer();
  }

  keywordChange(event) {
    event.preventDefault();
    this.setState({ keyword: event.target.value });
  }

  convertToItems(esResponse) {
    const { pageIndex, pageSize, sortedBy, keyword } = this.props;
    var items = [];
    esResponse.hits.hits.map(hitItem => {
      items.push({
        _id: hitItem._id,
        hashId: hitItem._id,
        description: hitItem._source.metadata.description,
        category: hitItem._source.metadata.category,
        fileSize: hitItem._source.metadata.filesize,
        tokenCost: hitItem._source.tokenCost,
        metadataCaptureTime: new Date(hitItem._source.metadataCaptureTime),
        latestPurchaseTime: (typeof hitItem._source.latestPurchaseTime === 'undefined') ? undefined : new Date(hitItem._source.latestPurchaseTime),
        noOfAccessed: hitItem._source.purchaseTxRecords.length,
      });
    });
    this.setState({ items });
  }

  render() {
    const { pageIndex, pageSize, sortedBy, keyword } = this.props;
    const { items } = this.state;
    const rows = items.map(item => (
      /*jshint ignore:start*/
      <FileListItem
        hideFields={this.props.hideFields}
        key={item._id}
        hashId={item.hashId}
        description={item.description}
        category={item.category}
        fileSize={item.fileSize}
        tokenCost={item.tokenCost}
        metadataCaptureTime={item.metadataCaptureTime}
        latestPurchaseTime={item.latestPurchaseTime}
        noOfAccessed={item.noOfAccessed}
      />
      /*jshint ignore:end*/
    ));
    /*jshint ignore:start*/
    return (
      <div>
        <Form inline>
          <FormGroup controlId="formInlineSearch">
            <FormControl
              type="text"
              placeholder="keyword to search"
              value={this.state.keyword}
              onChange={this.keywordChange}
            />
            <Button type="submit" onClick={this.search}>
              Search
            </Button>
          </FormGroup>
        </Form>
        <Table responsive striped bordered condensed hover>
          <thead>
            <tr>
              {this.props.hideFields.includes('accessFile') ? null : <th style={{ width: '85px' }} />}
              {this.props.hideFields.includes('description') ? null : <th>Description</th>}
              {this.props.hideFields.includes('category') ? null : <th style={{ width: '100px' }}>Category</th>}
              {this.props.hideFields.includes('metadataCaptureTime') ? null : <th style={{ width: '150px' }}>Register Time</th>}
              {this.props.hideFields.includes('fileSize') ? null : <th style={{ width: '150px' }}>File Size</th>}
              {this.props.hideFields.includes('tokenCost') ? null : <th style={{ width: '150px' }}>BMD Token Cost</th>}
              {this.props.hideFields.includes('noOfAccessed') ? null : (
                <th style={{ width: '120px' }}>No. of Accessed</th>
              )}
              {this.props.hideFields.includes('latestPurchaseTime') ? null : <th style={{ width: '150px' }}>Last Access Time</th>}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    );
    /*jshint ignore:end*/
  }
}

FileList.propTypes = {
  hideFields: PropTypes.arrayOf(PropTypes.string),
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  sortedBy: PropTypes.string,
  keyword: PropTypes.string,
  category: PropTypes.string,
};

FileList.defaultProps = {
  hideFields: [],
  pageIndex: 0,
  pageSize: 10,
  sortedBy: 'time',
  keyword: '',
  category: '',
};
export default FileList;
