//ftm vaults
const ftm =
'0x1066b8FC999c1eE94241344818486D5f944331A0'
const WETHFTM = 
'0xD939c268C49c442F037E968F045ba02f499562D4'
const yvWFTM =
'0x7efB260662a6FA95c1CE1092c53Ca23733202798'
const yvDAI =
'0x682E473FcA490B0adFA7EfE94083C1E63f28F034'
const yvETH =
'0x7aE52477783c4E3e5c1476Bbb29A8D029c920676'
const yvBTC =
'0x571F42886C31f9b769ad243e81D06D0D144BE7B4'
const yvYFI =
'0x6d6029557a06961aCC5F81e1ffF5A474C54e32Fd'
const BTCftm =
'0xE5996a2cB60eA57F03bf332b5ADC517035d8d094'
const LINKftm =
'0xd6488d586E8Fcd53220e4804D767F19F5C846086'
const SUSHI =
'0x267bDD1C19C932CE03c7A62BBe5b95375F9160A6'
const AAVEftm =
'0xdB09908b82499CAdb9E6108444D5042f81569bD9'
const mooScreamFTM =
'0x3609A304c6A41d87E895b9c1fd18c02ba989Ba90'
const mooScreamETH =
'0xC1c7eF18ABC94013F6c58C6CdF9e829A48075b4e'
const mooScreamBTC =
'0x5563Cc1ee23c4b17C861418cFF16641D46E12436'
const mooScreamLINK =
'0x8e5e4D08485673770Ab372c05f95081BE0636Fa2'
const mooScreamDAI =
'0xBf0ff8ac03f3E0DD7d8faA9b571ebA999a854146'
const mooBooBTC =
'0xf34e271312e41bbd7c451b76af2af8339d6f16ed'
const mooBooETH =
'0x9ba01b1279b1f7152b42aca69faf756029a9abde'
const mooBIFI =
'0x75d4ab6843593c111eeb02ff07055009c836a1ef'


//Polygon Vaults
const MATIC = 
'0xa3fa99a148fa48d14ed51d610c367c61876997f1'
const WETH =
'0x3fd939B017b31eaADF9ae50C7fF7Fa5c0661d47C'
const LINK =
'0x61167073E31b1DAd85a3E531211c7B8F1E5cAE72'
const AAVE =
'0x87ee36f780ae843A78D5735867bc1c13792b7b11'
const CRV =
'0x98B5F32dd9670191568b661a3e847Ed764943875'
const BAL =
'0x701A1824e5574B0b6b1c8dA808B184a7AB7A2867'
const dQUICK =
'0x649Aa6E6b6194250C077DF4fB37c23EE6c098513'
const WBTC =
'0x37131aEDd3da288467B6EBe9A77C523A700E6Ca1'
const GHST =
'0xF086dEdf6a89e7B16145b03a6CB0C0a9979F1433'
const camWMATIC =
'0x88d84a85A87ED12B8f098e8953B322fF789fCD1a'
const camWETH =
'0x11A33631a5B5349AF3F165d2B7901A4d67e561ad'
const camAAVE =
'0x578375c3af7d61586c2C3A7BA87d2eEd640EFA40'
const camWBTC =
'0x7dda5e1a389e0c1892caf55940f5fce6588a9ae0'
const camDAI =
'0xD2FE44055b5C874feE029119f70336447c8e8827'
const StakeDAOUSDStrategy =
'0x57cbf36788113237d64e46f25a88855c3dff1691'
const FXS =
'0xff2c44fb819757225a176e825255a01b3b8bb051'
const cxdoge =
'0x7CbF49E4214C7200AF986bc4aACF7bc79dd9C19a'
const cxADA=
'0x506533B9C16eE2472A6BF37cc320aE45a0a24F11'
const cxWETH =
'0x7d36999a69f2b99bf3fb98866cbbe47af43696c8'
const vGHST =
'0x1f0aa72b980d65518e88841ba1da075bd43fa933'
const CEL =
'0x178f1c95c85fe7221c7a6a3d6f12b7da3253eeae'
const WMATIC =
'0x305f113ff78255d4f8524c8f50c7300b91b10f6a'
const SAND = 
"0x1dcc1f864a4bd0b8f4ad33594b758b68e9fa872c"

const contracts = [WBTC,GHST,WETH]



require('dotenv').config()
const { Contract, ethers } = require('ethers');
import { NonceManager, } from "@ethersproject/experimental";


const abi = [{"inputs":[{"internalType":"address","name":"ethPriceSourceAddress","type":"address"},{"internalType":"uint256","name":"minimumCollateralPercentage","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"address","name":"_mai","type":"address"},{"internalType":"address","name":"_collateral","type":"address"},{"internalType":"address","name":"meta","type":"address"},{"internalType":"string","name":"baseURI","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"vaultID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"BorrowToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"vaultID","type":"uint256"},{"indexed":false,"internalType":"address","name":"creator","type":"address"}],"name":"CreateVault","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"vaultID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DepositCollateral","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"vaultID","type":"uint256"}],"name":"DestroyVault","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"vaultID","type":"uint256"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"debtRepaid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"collateralLiquidated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"closingFee","type":"uint256"}],"name":"LiquidateVault","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"vaultID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"closingFee","type":"uint256"}],"name":"PayBackToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"vaultID","type":"uint256"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"}],"name":"TransferVault","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"vaultID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"WithdrawCollateral","type":"event"},{"constant":true,"inputs":[],"name":"_meta","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_minimumCollateralPercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"base","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"vaultID","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"borrowToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"ethPriceSourceAddress","type":"address"}],"name":"changeEthPriceSource","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"vaultID","type":"uint256"}],"name":"checkCollateralPercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"vaultID","type":"uint256"}],"name":"checkCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"vaultID","type":"uint256"}],"name":"checkExtract","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"vaultID","type":"uint256"}],"name":"checkLiquidation","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"closingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"collateral","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"collateralDecimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"createVault","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"debtRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"vaultID","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"depositCollateral","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"vaultID","type":"uint256"}],"name":"destroyVault","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ethPriceSource","outputs":[{"internalType":"contract shareOracle","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"vaultID","type":"uint256"}],"name":"exists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gainRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getClosingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getDebtCeiling","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getEthPriceSource","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOpeningFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getPaid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokenPriceSource","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"vaultID","type":"uint256"}],"name":"liquidateVault","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mai","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"maticDebt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"openingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"vaultID","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"payBackToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"baseURI","type":"string"}],"name":"setBaseURI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setClosingFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_debtRatio","type":"uint256"}],"name":"setDebtRatio","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_gainRatio","type":"uint256"}],"name":"setGainRatio","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"minimumCollateralPercentage","type":"uint256"}],"name":"setMinCollateralRatio","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setOpeningFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_pool","type":"address"}],"name":"setStabilityPool","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_tokenPeg","type":"uint256"}],"name":"setTokenPeg","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_treasury","type":"uint256"}],"name":"setTreasury","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"stabilityPool","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenPeg","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"}],"name":"transferToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountToken","type":"uint256"}],"name":"transferToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"treasury","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"vaultCollateral","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"vaultCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"vaultDebt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"vaultID","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawCollateral","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]



import { VoidSigner } from "ethers";
const Web3 = require ('web3');
var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('https://polygon-rpc.com/')

const publicPolygonRPC = 'https://polygon-rpc.com/'

const publicFantomRPC = 'https://rpc.ftm.tools/'


const init = async () => {
    
    
    
    const web3 = new Web3(publicFantomRPC);



    var contractAddress = mooBIFI
    var contract = new web3.eth.Contract(abi, contractAddress)
    

    const vaultCount = await contract.methods.vaultCount().call();
    console.log(vaultCount)
    let vaultID = 500;
    while (vaultID <= vaultCount) {
    vaultID = vaultID + 1;

    const exists = await contract.methods.exists(vaultID).call();
    
        if (exists == true) 
            {const checkLiquidation = await contract.methods.checkLiquidation(vaultID).call();
                console.log(vaultID)
                if (checkLiquidation == true)
                    {const checkCost = await contract.methods.checkCost(vaultID).call()
                    console.log(checkCost)
                    if (checkCost > 1000000000000000000) //10000000000000000000
                    {(async() => {
                        const provider = new ethers.providers.JsonRpcProvider (publicFantomRPC)
                        
                        const gasPrice = provider.getGasPrice()
                        const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
                        const signer = wallet.connect(provider);
                        const vaultContract = new ethers.Contract(contractAddress, abi, signer)
                        
                        
                        const tx = {
                            
                            gasPrice: 101000000000,
                            gasLimit: 3000000,
                            nonce: provider.getTransactionCount(wallet.address, 'pending')
                            
                        };
                       
                            
                            const transaction = await vaultContract.liquidateVault(vaultID, tx);

                        
                            
                       
                        
                        //const receipt = await connection.waitForTransaction()
                        console.log(transaction)
                        })()
                    }
                    { console.log(vaultID)}
                    
                
                    
                       }}
                                    

        if (exists == false) {console.log("Nothing To See Here!!!")}
        if (vaultID == vaultCount) {init()}

    }
        
}
init()

