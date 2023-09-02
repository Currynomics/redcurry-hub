import { expect } from 'chai';
import { calculateAssetPosition, calculateSharePositionValues } from "../../../../../src/core/assets/services/calculations/index";

// NAV = OAV + COA + OLTA + OSTA + REC - LIA - OAVi + OAVr

describe('calculateSharePositionValues', () => {
    it('should return an object with value, cashflow, and shares', () => {
        const shares = [
            { nrOfParts: 10, pricePerPart: 2 },
            { nrOfParts: -5, pricePerPart: 3 },
            { nrOfParts: 7, pricePerPart: 1 },
        ];

        const result = calculateSharePositionValues(shares);

        expect(result).to.be.an('object');
        expect(result).to.have.keys(['value', 'cashflow', 'shares']);
    });

    it('should return correct values for given shares input', () => {
        const shares = [
            { nrOfParts: 10, pricePerPart: 2 },
            { nrOfParts: -5, pricePerPart: 3 },
            { nrOfParts: 7, pricePerPart: 1 },
        ];

        const result = calculateSharePositionValues(shares);

        expect(result.value).to.equal(17);
        expect(result.cashflow).to.equal(-12);
        expect(result.shares).to.equal(12);
    });

    it('should handle empty shares input', () => {
        const result = calculateSharePositionValues(null);

        expect(result.value).to.equal(0);
        expect(result.cashflow).to.equal(0);
        expect(result.shares).to.equal(0);
    });
});


//
describe('calculateAssetPosition', function () {

    it('should return an object with correct keys', () => {
        const asset = { assetType: 'SHARE' };

        const result = calculateAssetPosition(asset);

        expect(result).to.be.an('object');
        expect(result).to.have.keys(['nav', 'recFromSale', 'oav', 'coa', 'olta', 'osta', 'rec', 'lia', 'oavi', 'oavr', 'cashflow']);
    });

    it('should handle share asset type correctly', () => {
        const asset = {
            assetType: 'shares',
            shares: [
                { nrOfParts: 10, pricePerPart: 2 },
                { nrOfParts: -5, pricePerPart: 3 },
                { nrOfParts: 7, pricePerPart: 1 },
            ],
        };

        const result = calculateAssetPosition(asset);

        expect(result.oav).to.equal(17);
        expect(result.recFromSale).to.equal(-12);
        expect(result.cashflow).to.equal(-12);
    });

    it('should return correct values for a non-share asset', () => {
        const asset = {
            assetType: 'property',
            oav: 1000,
            coa: 200,
            olta: 50,
            osta: 30,
            rec: 20,
            lia: 10,
            oavi: 5,
            oavr: 15,
            recFromSale: 300,
        };

        const result = calculateAssetPosition(asset);

        expect(result).to.deep.equal({
            nav: 1300,
            recFromSale: 300,
            oav: 1000,
            coa: 200,
            olta: 50,
            osta: 30,
            rec: 20,
            lia: 10,
            oavi: 5,
            oavr: 15,
            cashflow: -1000,
        });
    });

    describe('calculateAssetPosition(PROPERTY)', function () {
        it('should return correct numbers', function () {
            const testAsset_property = {
                assetType: "property",
                coa: 500000,
                oav: 5000000,
                oavr: 100000,
                oavi: 50000,
                olta: 150000,
                osta: 45000,
                lia: 15000
            }
            const position = calculateAssetPosition(testAsset_property)
            // console.log("test | position: ", position)
            expect(position.nav).to.equal(5730000);
            expect(position.cashflow).to.equal(-5730000);
            expect(position.coa).to.equal(500000);
            expect(position.oav).to.equal(5000000);
            expect(position.oavr).to.equal(100000);
            expect(position.oavi).to.equal(50000);
            expect(position.oa).to.equal(45000);
            expect(position.bd).to.equal(15000);
            expect(position.ral).to.equal(0);
            expect(position.recFromSale).to.equal(0);
        });
    });

    describe('calculateAssetPosition(PROPERTY_2)', function () {
        it('should return correct numbers', function () {
            const testAsset_property_2 = {
                assetType: "property",
                coa: 0,
                oav: 13000543.4322,
                oavr: 500,
                oavi: 1500,
                olta: 0,
                osta: 1.2432,
                lia: 0,
                rec: 0,
                recFromSale: 8000000
            }
            const position = calculateAssetPosition(testAsset_property_2)
            // console.log("test | position: ", position)
            expect(position.nav).to.equal(12999544.6754);
            expect(position.coa).to.equal(0);
            expect(position.oav).to.equal(13000543.4322);
            expect(position.oavr).to.equal(500);
            expect(position.oavi).to.equal(1500);
            expect(position.oa).to.equal(1.2432);
            expect(position.bd).to.equal(0);
            expect(position.ral).to.equal(0);
            expect(position.recFromSale).to.equal(8000000);
            expect(position.cashflow).to.equal(-4999544.6754);
        });
    });

    describe('calculateAssetPosition(CASH)', function () {
        it('should return correct numbers', function () {
            const testAsset_cash = {
                assetType: "cash",
                coa: 10000000
            }
            const position = calculateAssetPosition(testAsset_cash)
            expect(position.nav).to.equal(10000000);
            expect(position.coa).to.equal(10000000);
            expect(position.oav).to.equal(0);
            expect(position.oavr).to.equal(0);
            expect(position.oavi).to.equal(0);
            expect(position.oa).to.equal(0);
            expect(position.bd).to.equal(0);
            expect(position.ral).to.equal(0);
            expect(position.recFromSale).to.equal(0);
            expect(position.cashflow).to.equal(-10000000);
        });
    });

    describe('calculateAssetPosition(SHARE_0)', function () {
        it('should return correct numbers', function () {
            const testAsset_share_0 = {
                assetType: "share",
                shares: [
                ],
                oavr: 0,
                oavi: 0,
            }
            const position = calculateAssetPosition(testAsset_share_0)
            expect(position.nav).to.equal(0);
            expect(position.coa).to.equal(0);
            expect(position.oav).to.equal(0);
            expect(position.oavr).to.equal(0);
            expect(position.oavi).to.equal(0);
            expect(position.oa).to.equal(0);
            expect(position.bd).to.equal(0);
            expect(position.ral).to.equal(0);
            expect(position.recFromSale).to.equal(0);
            expect(position.cashflow).to.equal(0);
        });
    });


    describe('calculateAssetPosition(SHARE)', function () {
        it('should return correct numbers', function () {

            const testAsset_share = {
                assetType: "share",
                shares: [
                    { nrOfParts: 1000, pricePerPart: 120 },
                    { nrOfParts: 1000, pricePerPart: 125 },
                    { nrOfParts: 1000, pricePerPart: 130 },
                    { nrOfParts: -1000, pricePerPart: 135 },
                ],
                oavr: 0,
                oavi: 0,
            }
            const position = calculateAssetPosition(testAsset_share)
            expect(position.nav).to.equal(250000);
            expect(position.coa).to.equal(0);
            expect(position.oav).to.equal(250000);
            expect(position.oavr).to.equal(0);
            expect(position.oavi).to.equal(0);
            expect(position.oa).to.equal(0);
            expect(position.bd).to.equal(0);
            expect(position.ral).to.equal(0);
            expect(position.recFromSale).to.equal(-240000);
            expect(position.cashflow).to.equal(-240000);

        });
    });

    describe('calculateAssetPosition(SHARE_2)', function () {
        it('should return correct numbers', function () {
            const testAsset_share_2 = {
                assetType: "share",
                shares: [
                    { nrOfParts: 1000, pricePerPart: 120 },
                    { nrOfParts: 1000, pricePerPart: 125 },
                    { nrOfParts: 1000, pricePerPart: 130 },
                    { nrOfParts: -1000, pricePerPart: 135 },
                    { nrOfParts: -2000, pricePerPart: 140 }
                ],
                oavr: 0,
                oavi: 0,
            }
            const position = calculateAssetPosition(testAsset_share_2)
            expect(position.nav).to.equal(0);
            expect(position.coa).to.equal(0);
            expect(position.oav).to.equal(0);
            expect(position.oavr).to.equal(0);
            expect(position.oavi).to.equal(0);
            expect(position.oa).to.equal(0);
            expect(position.bd).to.equal(0);
            expect(position.ral).to.equal(0);
            expect(position.recFromSale).to.equal(40000);
            expect(position.cashflow).to.equal(40000);

        });
    });

    describe('calculateAssetPosition(SHARE_3)', function () {
        it('should return correct numbers', function () {
            const testAsset_share_3 = {
                assetType: "share",
                shares: [
                    { nrOfParts: 1000, pricePerPart: 120 },
                    { nrOfParts: 1000, pricePerPart: 125 },
                    { nrOfParts: 1000, pricePerPart: 130 },
                    { nrOfParts: -1000, pricePerPart: 135 },
                ],
                oavr: 50000,
                oavi: 10000,
            }
            const position = calculateAssetPosition(testAsset_share_3)
            expect(position.nav).to.equal(290000);
            expect(position.coa).to.equal(0);
            expect(position.oav).to.equal(250000);
            expect(position.oavr).to.equal(50000);
            expect(position.oavi).to.equal(10000);
            expect(position.oa).to.equal(0);
            expect(position.bd).to.equal(0);
            expect(position.ral).to.equal(0);
            expect(position.recFromSale).to.equal(-240000);
            expect(position.cashflow).to.equal(-240000);

        });
    });
});