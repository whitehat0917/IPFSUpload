import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Container, Input, Row, Spinner } from 'reactstrap';
import Web3 from 'web3';
import { toast } from 'react-toastify';
import { NFTStorage } from 'nft.storage';
import ipfs from '../../utils/ipfsApi.js';
import axios from 'axios';
// import fs from'fs';

import { RealmABI, RealmAddr } from '../../constants/contract';
import { NFTStorageKey } from '../../constants/constants';
import { MintingStyle } from '../../style';

const { ethereum } = window;
const web3 = new Web3(ethereum);
const client = new NFTStorage({ token: NFTStorageKey });
// const ImageList = [GreenImage, PinkImage];

const Minting = () => {
    const realmContract = new web3.eth.Contract(
        RealmABI,
        RealmAddr
    );
    const [allName, setAllName] = useState('');

    const dispatch = useDispatch();
    const { userAddress } = useSelector((state) => {
        return {
            userAddress: state.userAddress
        }
    })
    const [processing, setProcessing] = useState(false)

    function importAll(r) {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
    }

    const mint = async () => {
        const images = importAll(require.context('../../assets/images', false, /\.(png|jpe?g|gif)$/));
        const imageList = Object.values(images);
        // console.log(imageList)
        // let datas = '';
        // let temp;
        // for (let i=0;i<imageList.length;i++){
        //     temp = imageList[i].default.split("/")[3]
        //     console.log(temp)
        //     datas = datas + ',' + temp.split(".")[0] + '.png';
        // }
        // for (let i=900;i<1200;i++){
        //     datas = datas +',' + 'https://ipfs.io/ipfs/QmUoUa5VPrdag7Uf5A6Mke74chCmwSzJGFbQRt4qFSaXgK/' + 'metadata' + i + '.json';
        // }
        // console.log(datas)
        // setAllName(datas)
        if (userAddress === '') {
            console.log("connect metamask")
            return toast.warning("please connect metamask")
        }

        // const random = Math.floor(Math.random() * imageList.length);
        // console.log(random)
        // let temp = '';
        for (let i = 0; i < imageList.length; i++) {
            setProcessing(true);
            // console.log(result)
            try{
                const response = await axios(imageList[i].default, { responseType: 'arraybuffer' });
                const result = await ipfs.files.add(Buffer.from(response.data));
                console.log(result, i)
                // const cid = await client.storeDirectory([
                //     new File(
                //         [
                //             JSON.stringify({
                //                 name: "Gangster NFT",
                //                 description: "Gangster NFTs",
                //                 assetType: "image",
                //                 image: `https://ipfs.io/ipfs/${result[0].hash}`,
                //             }),
                //         ],
                //         'metadata.json'
                //     ),
                // ]);
                // const tokenURI = `https://ipfs.io/ipfs/${cid}/metadata.json`;
                // // console.log(tokenURI)
                // datas.push(tokenURI)
                // temp = temp + cid + ",";
                // setAllName(temp)
                // console.log(i)
            }catch (e){
                console.log(e)
            }
        }
        setProcessing(false);

        // let datas = '0x45A255479d11AaC04f227e3f900021D0188B8814';
        // let list = [];
        // for (let i=0;i<datas.split(",").length;i++){
        //     list.push(datas.split(",")[i]);
        // }
        // console.log(list.length)
        // realmContract.methods
        //     .batchMintTeam(list).send({ from: userAddress })
        //     .then(res => {
        //         setProcessing(false);
        //         console.log("success")
        //     })
        //     .catch(err => {
        //         setProcessing(false);
        //         console.log(err);
        //     })
    }
    return (
        <MintingStyle>
            <Container className="text-center">
                <Row style={{ marginTop: '100px' }}>
                    <h2 style={{ marginBottom: '20px' }}>NFT Minting DEMO</h2>
                </Row>
                <Row style={{ marginTop: '30px' }}>
                    <Col md={12}>
                        {allName}
                    </Col>
                </Row>
                <Row style={{ marginTop: '10px' }}>
                    <Col md={4}>
                    </Col>
                    <Col md={4}>
                        <Row>
                            <Button onClick={mint} className="btn btn-primary full">{processing ? <Spinner size="sm" color="dark" /> : <>Mint</>}</Button>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ marginTop: '10px' }}>
                    <a href="https://testnets.opensea.io/collection/realm-mitaveg612" target="_blank" >Check On Opensea</a>
                </Row>
            </Container>
        </MintingStyle>
    )
}

export default Minting;