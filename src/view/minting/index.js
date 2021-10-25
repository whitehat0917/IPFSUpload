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
        const images = importAll(require.context('../../assets/images', false, /\.(png|jpe?g|svg)$/));
        const imageList = Object.values(images);
        let datas = [];
        // if (userAddress === '') {
        //     console.log("connect metamask")
        //     return toast.warning("please connect metamask")
        // }

        // const random = Math.floor(Math.random() * imageList.length);
        // console.log(random)
        let temp = '';
        for (let i = 0; i < imageList.length; i++) {
            setProcessing(true);
            const response = await axios(imageList[i].default, { responseType: 'arraybuffer' });
            const result = await ipfs.files.add(Buffer.from(response.data));
            // console.log(result)
            const cid = await client.storeDirectory([
                new File(
                    [
                        JSON.stringify({
                            name: "Ganster NFT",
                            description: "Ganster NFTs",
                            assetType: "image",
                            image: `https://ipfs.io/ipfs/${result[0].hash}`,
                        }),
                    ],
                    'metadata.json'
                ),
            ]);
            const tokenURI = `https://ipfs.io/ipfs/${cid}/metadata.json`;
            // console.log(tokenURI)
            datas.push(tokenURI)
            temp = temp + cid + ",";
            console.log(i)
        }
        setAllName(temp)
        setProcessing(false);

        // realmContract.methods
        // .setUri(datas).send({from: userAddress})
        // .then( res => {
        //   setProcessing(false);
        //   console.log("success")
        // })
        // .catch( err => {
        //   setProcessing(false);
        //   console.log(err);
        // })
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