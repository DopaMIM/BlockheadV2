pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "contracts/polygon/uniswap.sol";
import "contracts/polygon/liquidator.sol";
import "contracts/polygon/Stablecoin.sol";

interface ERC20Stablecoin {
  function liquidateVault(uint vaultID);
  function getPaid();
}

interface IUniswapV2Callee {
  function uniswapV2Call(
    address sender,
    uint amount0,
    uint amount1,
    bytes calldata data
  ) external;
}
contract liquitator {
  function liquidateVault(vaultID);
  function getPaid();
 }
contract flashswap is IUniswapV2Callee {
  // Uniswap V2 router
  // 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D

  // Quickswap V2 factory
  address private constant FACTORY = 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32;

  event Log(string message, uint val);

  function testFlashSwap(address _tokenBorrow, uint _amount0, address _tokenRepay, address _vault) external {
    address pair = IUniswapV2Factory(FACTORY).getPair(_tokenBorrow, _tokenRepay);
    require(pair != address(0), "!pair");

    address token0 = IUniswapV2Pair(pair).token0();
    address token1 = IUniswapV2Pair(pair).token1();
    uint amount0Out = _tokenBorrow == token0 ? _amount0 : 0;
    uint amount1Out = _tokenBorrow == token1 ? _amount0 : 0;

    // need to pass some data to trigger uniswapV2Call
    bytes memory data = abi.encode(_vault, _amount0);

    IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
  }

  // called by pair contract
  function uniswapV2Call(
    address _sender,
    uint _amount0,
    uint _amount1,
    bytes calldata _data
  ) external override {
    address token0 = IUniswapV2Pair(msg.sender).token0();
    address token1 = IUniswapV2Pair(msg.sender).token1();
    address pair = IUniswapV2Factory(FACTORY).getPair(token0, token1);
    require(msg.sender == pair, "!pair");
    require(_sender == address(this), "!sender");

    (address tokenRepay, uint amount) = abi.decode(_data, (address, uint));


    // about 0.3%
    uint fee = ((amount * 3) / 997) + 1;
    uint amountToRepay = amount + fee;

 
    token0.approve(vault, amount);
    
    vault.liquidateVault();

    // do stuff here
    emit Log("amount", amount);
    emit Log("amount0", _amount0);
    emit Log("amount1", _amount1);
    emit Log("fee", fee);
    emit Log("amount to repay", amountToRepay);

    IERC20(tokenRepay).transfer(pair, amountToRepay);
  }
}