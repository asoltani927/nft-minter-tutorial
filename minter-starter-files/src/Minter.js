import {useEffect, useState} from "react";
import {
    connectWallet,
    getCurrentWalletConnected //import here
} from "./utils/interact.js";
import {mintNFT} from "./utils/interact.js";

const Minter = (props) => {

    //State variables
    const [walletAddress, setWallet] = useState("0xB9DB1902083cFbeeC905937e8e21e1b701267A17");
    const [status, setStatus] = useState("");
    const [name, setName] = useState("Test");
    const [description, setDescription] = useState("test2");
    const [count, setCount] = useState("1");
    const [url, setURL] = useState("test3");

    useEffect(async () => { //TODO: implement
        const {address, status} = await getCurrentWalletConnected();
        setWallet(address)
        setStatus(status);

        addWalletListener();
    }, []);

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
    };

    const onMintPressed = async () => {
        const {status} = await mintNFT(url, name, description, count);
        setStatus(status);
    };

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    setStatus("");
                } else {
                    setWallet("");
                    setStatus("🦊 Connect to Metamask using the top right button.");
                }
            });
        } else {
            setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
                    </a>
                </p>
            );
        }
    }

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-12 col-lg-6">

                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-outline-light" id="walletButton" onClick={connectWalletPressed}>
                                {walletAddress.length > 0 ? (
                                    "Connected: " +
                                    String(walletAddress).substring(0, 6) +
                                    "..." +
                                    String(walletAddress).substring(38)
                                ) : (
                                    <span>Connect Wallet</span>
                                )}
                            </button>
                        </div>

                        <div className="col-12">
                            <div className="mt-5 text-center">
                                <img className="logo img-fluid" src={'/logo.png'} alt={'logo'}/>
                            </div>
                        </div>

                        <div className="col-12">


                            <div className="mt-5">
                                <form>
                                    <h2>Number of Mints:</h2>
                                    <input
                                        className="form-control"
                                        type="number"
                                        placeholder="1"
                                        onChange={(event) => setCount(event.target.value)}
                                    />

                                </form>
                            </div>
                            <button className="btn btn-primary w-100" id="mintButton" onClick={onMintPressed}>
                                Mint NFT
                            </button>
                            <p id="status">
                                {status}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Minter;
