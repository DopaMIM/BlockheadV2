module.exports = {
    //liquidation settings
    wei: 1000000000000000000,
    polygonTotalGas: 5 * 1000000000000000000, // Matic * Wei = amount in matic
    fantomTotalGas: 5 * 1000000000000000000, // Fantom * Wei = amount in FTM
    optimismTotalGas: .005 * 1000000000000000000, // Ether * Wei = amount in ETH
    gasPriceMultiple : 10,
    gasLimit: 400000,
    minimumVaultSize : 10 * 1000000000000000000, //$ * Wei = amount in dollars (Mai)
    optimismMinimumVaultSize: 100 * 1000000000000000000, //$ * Wei = amount in dollars (Mai)
    ethereumGasPriceMultiple: 5,
    optimismDefaultGas : 40000001, //currently on optimismWETH, optimismWBTC, optimismOP
    fantomDefaultGas : 59000000000000,
    polygonDefaultGas : 2010000000000,
    
    
    getPaid: 0, //  1 = yes,   0 = no
    
    //Arbitrage Settings
    arbGas : 501511100000, //in wei
    arbAmount : 100000000000000000000, //100000000000000000000 = $100
    arbMargin : 1.0075,
    arbDelay : 6000,
    arbSlippage : 0.5,
    
    
    //AAVE SETTINGS
    aaveLiquidationMinimum: 10,
    aaveLiquidationMinimumEthereum: 0.0001,

    //trading bot settings
    greenPercentChange: 5,  // default is 5
    redPercentChange: 5,  // default is 5
    greenPercentProfit: 2,   // default is 2
    redPercentProfit: 2,  // default is 2
    timeInterval: 86400, //in seconds
    slippage: 1,   // percentage
    token1TradeAmount: .1,
    token2TradeAmount: .1,


    topRange: .90,
    bottomRange: .89
} 