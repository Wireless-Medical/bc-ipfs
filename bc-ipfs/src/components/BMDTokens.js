import React, { Component } from 'react';
import { BigNumber } from 'bignumber.js';
import { getBMDTokensByTokenCost } from '../utils/lib_BMDtoken';
var PropTypes = require('prop-types');

/*jshint ignore:start*/
const BMDTokens = ({ value }) => <span>{getBMDTokensByTokenCost(value)}</span>;
/*jshint ignore:end*/

BMDTokens.propTypes = {
  value: PropTypes.string.isRequired,
};

export default BMDTokens;
