pragma solidity ^0.5.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'DairyfactoryRole' to manage this role - add, remove, check
contract DairyfactoryRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event DairyfactoryAdded(address indexed account);
  event DairyfactoryRemoved(address indexed account);

  // Define a struct 'dairyfactories' by inheriting from 'Roles' library, struct Role
  Roles.Role private dairyfactorys;

  // In the constructor make the address that deploys this contract the 1st farmer
  constructor() public {
    _addDairyfactory(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyDairyfactory() {
    require(isDairyfactory(msg.sender),"ERROR Message: The address doesn´t match with any dairyfactory.");
    _;
  }

  // Define a function 'isDairyfactory' to check this role
  function isDairyfactory(address account) public view returns (bool) {
    return dairyfactorys.has(account);
  }

  // Define a function 'addDairyfactory' that adds this role
  function addDairyfactory(address account) public onlyDairyfactory() {
    _addDairyfactory(account);
  }

  // Define a function 'renounceDairyfactory' to renounce this role
  function renounceDairyfactory() public {
    _removeDairyfactory(msg.sender);
  }

  // Define an internal function '_addDairyfactory' to add this role, called by 'addDairyfactory'
  function _addDairyfactory(address account) internal {
    dairyfactorys.add(account);
    emit DairyfactoryAdded(account);
  }

  // Define an internal function '_removeDairyfactory' to remove this role, called by 'removeDairyfactory'
  function _removeDairyfactory(address account) internal {
    dairyfactorys.remove(account);
    emit DairyfactoryRemoved(account);
  }
}