pragma solidity ^0.5.0;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
  struct Role {
    mapping (address => bool) bearer;
  }

  /**
   * @dev give an account access to this role
   */
  function add(Role storage role, address account) internal {
    require(account != address(0),"ERROR Message: Address account is null in function add new role");
    require(!has(role, account),"ERROR Message: The adddress given has already the role in function add new role");

    role.bearer[account] = true;
  }

  /**
   * @dev remove an account's access to this role
   */
  function remove(Role storage role, address account) internal {
    require(account != address(0),"ERROR Message: Addresss account is null in function remove the rule");
    require(has(role, account),"ERROR Message: The address given does not has the role in function remove the role");

    role.bearer[account] = false;
  }

  /**
   * @dev check if an account has this role
   * @return bool
   */
  function has(Role storage role, address account)
    internal
    view
    returns (bool)
  {
    require(account != address(0),"ERROR Message: Address account null in function has the role.");
    return role.bearer[account];
  }
}