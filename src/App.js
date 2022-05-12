import Web3Modal from "web3modal";
import { providers, Contract, utils } from "ethers";
import { useEffect, useRef, useState } from "react";
import { DEPLOYED_CONTRACT_ADDRESS, abi } from "./iindex";

import './App.css';

import { create } from 'ipfs-http-client'

const client = create('https://ipfs.infura.io:5001/api/v0')
export default function App() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [Balance, setBalance] = useState("0");
  const [sym, setSymbol] = useState();

  const [text, setText] = useState();
  const [buyNF, setBuyNF] = useState();
  const [URI, setURI] = useState();
  const [fileUrl, updateFileUrl] = useState();


  async function onChange(e) {

    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      console.log("added: ", added)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      updateFileUrl(url);
      console.log('file url is :', url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }
  // uploading image to IPFS programmaticaly---///

  //--------- Handle Submit ---END----------------//

  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const NFTname = async () => {
    try {

      const provider = await getProviderOrSigner();
      const myNftContract = new Contract(DEPLOYED_CONTRACT_ADDRESS, abi, provider);

      const value = await myNftContract.name();
      setText(value);
      // console.log(value);

    } catch (err) {
      console.error(err);
    }
  };

  const balanceOf = async () => {

    try {
      const signer = await getProviderOrSigner(true);
      const myNftContract = new Contract(DEPLOYED_CONTRACT_ADDRESS, abi, signer);
      const balance = await myNftContract.balanceOf("0xaF09B9535E239AaDcC2B96331341647F84a3537f");

      setBalance(balance.toString());
      // console.log(balance);

    } catch (err) {
      console.error(err);
    }
  };

  const NFTSymbol = async () => {

    try {
      const signer = await getProviderOrSigner(true);
      const myNftContract = new Contract(DEPLOYED_CONTRACT_ADDRESS, abi, signer);
      const symb = await myNftContract.symbol();

      setSymbol(symb);

    } catch (err) {
      console.error(err);
    }
  };

  const mintnft = async () => {

    try {

      const signer = await getProviderOrSigner(true);
      const myNftContract = new Contract(DEPLOYED_CONTRACT_ADDRESS, abi, signer);
      const nftminting = await myNftContract.mintNFT("0xaF09B9535E239AaDcC2B96331341647F84a3537f",
        fileUrl);
      alert("NFT Minted")

    } catch (err) {
      console.error(err);
    }
  };

  const showTokenURI = async () => {

    try {
      const signer = await getProviderOrSigner(true);
      const myNftContract = new Contract(DEPLOYED_CONTRACT_ADDRESS, abi, signer);
      const _tokenURI = await myNftContract.tokenURI(4);

      setURI(_tokenURI);
      console.log(_tokenURI);

    } catch (err) {
      console.error(err);
    }
  };

  const buyNFT = async () => {

    try {
      const signer = await getProviderOrSigner(true);
      const myNftContract = new Contract(DEPLOYED_CONTRACT_ADDRESS, abi, signer);
      const balance = await myNftContract.buyNFT(6, {
        gasPrice: utils.parseUnits("100", "gwei"),
        gasLimit: "99000",
        value: utils.parseEther(".1"),
      });

      setBuyNF(balance);
      // console.log(balance);

    } catch (err) {
      console.error(err);
    }
  };


  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);


    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();

      NFTname();

      balanceOf();
      NFTSymbol();

    }
  }, [walletConnected]);



  return (
    <div className="App">

      <h2> NFT: {text} </h2>
      <h2> Symbol: {sym} </h2>
      <h2>Number of minted NFT is {Balance} out of 20 </h2>

      <input
        type="file"
        onChange={onChange}
      />

      <button className="btn" onClick={mintnft} type="submit">Mint NFT</button>  <br />  <br />

      <button className="btn" onClick={buyNFT}>Buy NFT</button><br />  <br />
      <button className="btn" onClick={showTokenURI}>ShowTokenURI</button><br />  <br />

      <img src={fileUrl} width="600px" />
      <h3>Image url is :</h3> <span>{fileUrl}</span>

    </div>
  );

}

