import { pinJSONToIPFS } from './pinata.js'

require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json')
const contractAddress = "0x869cc9401f3dfcfa6b6934d36938f6722b5b377a";




export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};


export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};


export const mintNFT = async (url, name, description, count) => {

    window.contract = await new web3.eth.Contract(contractABI, contractAddress);

    if (count <= 0) {
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        }
    }
    //error handling
    // if (url.trim() == "" || (name.trim() == "" || description.trim() == "")) {
    //     return {
    //         success: false,
    //         status: "❗Please make sure all fields are completed before minting.",
    //     }
    // }

    // //make metadata
    // const metadata = new Object();
    // metadata.name = name;
    // metadata.image = url;
    // metadata.description = description;

    // //pinata pin request
    // const pinataResponse = await pinJSONToIPFS(metadata);
    // if (!pinataResponse.success) {
    //     return {
    //         success: false,
    //         status: "😢 Something went wrong while uploading your tokenURI.",
    //     }
    // }
    // const tokenURI = pinataResponse.pinataUrl;

    //load smart contract
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();

    // console.log( )

    // await window.contract.methods.tokenURI(4).call().then(data=>{
    //     console.log(data)
    // })

    count = parseInt(count)
    let amount = (count * 0.09)
    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        // sender: window.ethereum.selectedAddress, // must match user's active address.
        value: web3.utils.toHex(web3.utils.toWei(amount.toString())),
        // 'data': window.contract.methods.presaleMintItems(count).encodeABI(), //make call to NFT smart contract 
        'data': window.contract.methods.mintItems(count).encodeABI() //make call to NFT smart contract 
    };

    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}