pragma solidity ^0.5.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'PoultererRole' to manage this role - add, remove, check
contract PoultererRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event PoultererAdded(address indexed account);
  event PoultererRemoved(address indexed account);

  // Define a struct 'poulterers' by inheriting from 'Roles' library, struct Role
  Roles.Role private poulterers;

  // In the constructor make the address that deploys this contract the 1st farmer
  constructor() public {
    _addPoulterer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyPoulterer() {
    require(isPoulterer(msg.sender),"ERROR Message: The address doesn´t match with any poulterer.");
    _;
  }

  // Define a function 'isPoulterer' to check this role
  function isPoulterer(address account) public view returns (bool) {
    return poulterers.has(account);
  }

  // Define a function 'addPoulterer' that adds this role
  function addPoulterer(address account) public onlyPoulterer() {
    _addPoulterer(account);
  }

  // Define a function 'renouncePoulterer' to renounce this role
  function renouncePoulterer() public {
    _removePoulterer(msg.sender);
  }

  // Define an internal function '_addPoulterer' to add this role, called by 'addPoulterer'
  function _addPoulterer(address account) internal {
    poulterers.add(account);
    emit PoultererAdded(account);
  }

  // Define an internal function '_removePoulterer' to remove this role, called by 'removePoulterer'
  function _removePoulterer(address account) internal {
    poulterers.remove(account);
    emit PoultererRemoved(account);
  }
}