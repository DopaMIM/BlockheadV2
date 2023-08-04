// SPDX-License-Identifier: UNLICENSED
// This code is proprietary and confidential. All rights reserved.
// Unauthorized copying of this file, via any medium is strictly prohibited.
// Proprietary code by Levi Webb

pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);
}

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function getAmountsOut(uint256 amountIn, address[] memory path)
        external
        view
        returns (uint256[] memory amounts);
}

interface automationLayer {
    function setAutomationFee(uint256 newAutomationFee) external;

    function createAccount(uint256 id) external;
}

contract duhOracle {
    address duh = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270 ;
    address stable = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    uint256 updateTimer = block.timestamp;
    uint256 updateIntervalSeconds = 3000;
    uint256 duhFeeUSD =100;
    address automationLayerAddress;
    address uniswapRouterAddress = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function."
        );
        _;
    }

    function getDuhPrice() public view returns (uint256) {
        address[] memory path;

        path = new address[](2);
        path[0] = duh;
        path[1] = stable;

        uint256[] memory getAmountsOut = IUniswapV2Router02(
            uniswapRouterAddress
        ).getAmountsOut(10**18, path);
        return (getAmountsOut[1]);
    }

    function checkSimpleAutomation() external view returns (bool) {
        return (updateTimer < block.timestamp);
    }

    function simpleAutomation(uint256 automationAccountNumber) public {
        require(updateTimer < block.timestamp, "it's not time sillypants");
        updateTimer += updateIntervalSeconds;
        uint256 duhPriceUSD = getDuhPrice();

        uint256 newDuhFee = duhFeeUSD / duhPriceUSD;

        automationLayer(automationLayerAddress).setAutomationFee(newDuhFee);
    }

    function setuniswapRouterAddress(address _uniswapRouterAddress) external onlyOwner {
        uniswapRouterAddress = _uniswapRouterAddress;
    }

       function setDuhAddress(address _duhAddress) external onlyOwner {
        duh = _duhAddress;
    }

    function setStableAddress(address _stableAddress) external onlyOwner {
        stable = _stableAddress;
    }

    function setUpdateTimer() external onlyOwner {
        updateTimer = block.timestamp;
    }

    function automateMe(uint256 id) external onlyOwner {
        automationLayer(automationLayerAddress).createAccount(id);
    }

    function setAutomationLayerAddress(address _automationLayerAddress)
        external
        onlyOwner
    {
        automationLayerAddress = _automationLayerAddress;
    }
}
