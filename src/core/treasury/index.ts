const { BigNumber } = require("ethers");

import { AssetsContractInteractor } from "./contracts/assets/AssetsContractInteractor";
import { GovernorContractInteractor } from "./contracts/governor/GovernorContractInteractor";
import { TokenContractInteractor } from "./contracts/token/TokenContractInteractor";
const POSITION_DELIMITOR = 100
const NAPT_DELIMITOR = 100000000
const SUPPLT_DELIMITOR = 100000000

const getTreasuryStats = async () => {
    const [position, napt, supply, assets] = await Promise.all([
        getTotalTreasuryNav(),
        getNAPT(),
        getTotalSupply(),
        getTreasuryAssets()
    ]);
    return {
        nrOfAssets: assets.assets.length, 
        position: {
            value: position.nav,
            real: position.real,
        },
        napt: {
            value: napt.napt,
            real: napt.real
        },
        supply: {
            value: supply.supply,
            real: supply.real
        }
    }
};

const getTreasuryAssets = async () => {
    const interactor = await AssetsContractInteractor.createInstance()
    const assets = await interactor.getAssets()
    return { assets }
};

const getTreasuryAsset = async (tokenId: number) => {
    const interactor = await AssetsContractInteractor.createInstance()
    const asset = await interactor.getAsset(tokenId)
    return { asset }
};

const getTreasuryAssetCount = async () => {
    const interactor = await AssetsContractInteractor.createInstance()
    const count = await interactor.count()
    return { 
        count: Number(count)
     }
};


const getTotalTreasuryNav = async () => {
    const interactor = await GovernorContractInteractor.createInstance()
    const tx = await interactor.totalPosition()
    return {
        nav: Number(tx),
        real: Number(tx) / (POSITION_DELIMITOR)
    }
}

const getNoSupplyChangeNavThreshold = async () => {
    const interactor = await GovernorContractInteractor.createInstance()
    const tx = await interactor.getNoSupplyChangeNavThreshold()
    return {
        threshold: Number(tx),
        real: Number(tx) / (POSITION_DELIMITOR)
    }
}

const getNAPT = async () => {
    const interactor = await GovernorContractInteractor.createInstance()
    const tx = await interactor.getNAPT()
    return {
        napt: Number(tx),
        real: Number(tx) / (NAPT_DELIMITOR)
    }
}

const getTotalSupply = async () => {
    const interactor = await TokenContractInteractor.createInstance();
    const tx = await interactor.getSupply()
    return {
        supply: Number(tx),
        real: Number(tx) / (SUPPLT_DELIMITOR)
    }
}

const getTokenEscrow = async()=>{
    const interactor = await TokenContractInteractor.createInstance();
    const tx = await interactor.getEscrow()
    return {
        escrow: tx
    }
}
export { getNoSupplyChangeNavThreshold, getTreasuryAsset, getTreasuryAssetCount, getNAPT, getTotalTreasuryNav, getTotalSupply, getTreasuryStats, getTokenEscrow, getTreasuryAssets };
