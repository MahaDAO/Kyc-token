// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IKyc {

  function isAllowed(address user) external view returns (bool, uint256); 

}