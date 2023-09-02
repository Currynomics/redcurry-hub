"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("../../../../../src/core/assets/services/calculations/index");
// NAV = OAV + COA + OLTA + OSTA + REC - LIA - OAVi + OAVr
describe('calculateSharePositionValues', function () {
    it('should return an object with value, cashflow, and shares', function () {
        var shares = [
            { nrOfParts: 10, pricePerPart: 2 },
            { nrOfParts: -5, pricePerPart: 3 },
            { nrOfParts: 7, pricePerPart: 1 },
        ];
        var result = (0, index_1.calculateSharePositionValues)(shares);
        (0, chai_1.expect)(result).to.be.an('object');
        (0, chai_1.expect)(result).to.have.keys(['value', 'cashflow', 'shares']);
    });
    it('should return correct values for given shares input', function () {
        var shares = [
            { nrOfParts: 10, pricePerPart: 2 },
            { nrOfParts: -5, pricePerPart: 3 },
            { nrOfParts: 7, pricePerPart: 1 },
        ];
        var result = (0, index_1.calculateSharePositionValues)(shares);
        (0, chai_1.expect)(result.value).to.equal(17);
        (0, chai_1.expect)(result.cashflow).to.equal(-12);
        (0, chai_1.expect)(result.shares).to.equal(12);
    });
    it('should handle empty shares input', function () {
        var result = (0, index_1.calculateSharePositionValues)(null);
        (0, chai_1.expect)(result.value).to.equal(0);
        (0, chai_1.expect)(result.cashflow).to.equal(0);
        (0, chai_1.expect)(result.shares).to.equal(0);
    });
});
//
describe('calculateAssetPosition', function () {
    it('should return an object with correct keys', function () {
        var asset = { assetType: 'SHARE' };
        var result = (0, index_1.calculateAssetPosition)(asset);
        (0, chai_1.expect)(result).to.be.an('object');
        (0, chai_1.expect)(result).to.have.keys(['nav', 'recFromSale', 'oav', 'coa', 'olta', 'osta', 'rec', 'lia', 'oavi', 'oavr', 'cashflow']);
    });
    it('should handle share asset type correctly', function () {
        var asset = {
            assetType: 'shares',
            shares: [
                { nrOfParts: 10, pricePerPart: 2 },
                { nrOfParts: -5, pricePerPart: 3 },
                { nrOfParts: 7, pricePerPart: 1 },
            ],
        };
        var result = (0, index_1.calculateAssetPosition)(asset);
        (0, chai_1.expect)(result.oav).to.equal(17);
        (0, chai_1.expect)(result.recFromSale).to.equal(-12);
        (0, chai_1.expect)(result.cashflow).to.equal(-12);
    });
    it('should return correct values for a non-share asset', function () {
        var asset = {
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
        var result = (0, index_1.calculateAssetPosition)(asset);
        (0, chai_1.expect)(result).to.deep.equal({
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
            var testAsset_property = {
                assetType: "property",
                coa: 500000,
                oav: 5000000,
                oavr: 100000,
                oavi: 50000,
                olta: 150000,
                osta: 45000,
                lia: 15000
            };
            var position = (0, index_1.calculateAssetPosition)(testAsset_property);
            // console.log("test | position: ", position)
            (0, chai_1.expect)(position.nav).to.equal(5730000);
            (0, chai_1.expect)(position.cashflow).to.equal(-5730000);
            (0, chai_1.expect)(position.coa).to.equal(500000);
            (0, chai_1.expect)(position.oav).to.equal(5000000);
            (0, chai_1.expect)(position.oavr).to.equal(100000);
            (0, chai_1.expect)(position.oavi).to.equal(50000);
            (0, chai_1.expect)(position.oa).to.equal(45000);
            (0, chai_1.expect)(position.bd).to.equal(15000);
            (0, chai_1.expect)(position.ral).to.equal(0);
            (0, chai_1.expect)(position.recFromSale).to.equal(0);
        });
    });
    describe('calculateAssetPosition(PROPERTY_2)', function () {
        it('should return correct numbers', function () {
            var testAsset_property_2 = {
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
            };
            var position = (0, index_1.calculateAssetPosition)(testAsset_property_2);
            // console.log("test | position: ", position)
            (0, chai_1.expect)(position.nav).to.equal(12999544.6754);
            (0, chai_1.expect)(position.coa).to.equal(0);
            (0, chai_1.expect)(position.oav).to.equal(13000543.4322);
            (0, chai_1.expect)(position.oavr).to.equal(500);
            (0, chai_1.expect)(position.oavi).to.equal(1500);
            (0, chai_1.expect)(position.oa).to.equal(1.2432);
            (0, chai_1.expect)(position.bd).to.equal(0);
            (0, chai_1.expect)(position.ral).to.equal(0);
            (0, chai_1.expect)(position.recFromSale).to.equal(8000000);
            (0, chai_1.expect)(position.cashflow).to.equal(-4999544.6754);
        });
    });
    describe('calculateAssetPosition(CASH)', function () {
        it('should return correct numbers', function () {
            var testAsset_cash = {
                assetType: "cash",
                coa: 10000000
            };
            var position = (0, index_1.calculateAssetPosition)(testAsset_cash);
            (0, chai_1.expect)(position.nav).to.equal(10000000);
            (0, chai_1.expect)(position.coa).to.equal(10000000);
            (0, chai_1.expect)(position.oav).to.equal(0);
            (0, chai_1.expect)(position.oavr).to.equal(0);
            (0, chai_1.expect)(position.oavi).to.equal(0);
            (0, chai_1.expect)(position.oa).to.equal(0);
            (0, chai_1.expect)(position.bd).to.equal(0);
            (0, chai_1.expect)(position.ral).to.equal(0);
            (0, chai_1.expect)(position.recFromSale).to.equal(0);
            (0, chai_1.expect)(position.cashflow).to.equal(-10000000);
        });
    });
    describe('calculateAssetPosition(SHARE_0)', function () {
        it('should return correct numbers', function () {
            var testAsset_share_0 = {
                assetType: "share",
                shares: [],
                oavr: 0,
                oavi: 0,
            };
            var position = (0, index_1.calculateAssetPosition)(testAsset_share_0);
            (0, chai_1.expect)(position.nav).to.equal(0);
            (0, chai_1.expect)(position.coa).to.equal(0);
            (0, chai_1.expect)(position.oav).to.equal(0);
            (0, chai_1.expect)(position.oavr).to.equal(0);
            (0, chai_1.expect)(position.oavi).to.equal(0);
            (0, chai_1.expect)(position.oa).to.equal(0);
            (0, chai_1.expect)(position.bd).to.equal(0);
            (0, chai_1.expect)(position.ral).to.equal(0);
            (0, chai_1.expect)(position.recFromSale).to.equal(0);
            (0, chai_1.expect)(position.cashflow).to.equal(0);
        });
    });
    describe('calculateAssetPosition(SHARE)', function () {
        it('should return correct numbers', function () {
            var testAsset_share = {
                assetType: "share",
                shares: [
                    { nrOfParts: 1000, pricePerPart: 120 },
                    { nrOfParts: 1000, pricePerPart: 125 },
                    { nrOfParts: 1000, pricePerPart: 130 },
                    { nrOfParts: -1000, pricePerPart: 135 },
                ],
                oavr: 0,
                oavi: 0,
            };
            var position = (0, index_1.calculateAssetPosition)(testAsset_share);
            (0, chai_1.expect)(position.nav).to.equal(250000);
            (0, chai_1.expect)(position.coa).to.equal(0);
            (0, chai_1.expect)(position.oav).to.equal(250000);
            (0, chai_1.expect)(position.oavr).to.equal(0);
            (0, chai_1.expect)(position.oavi).to.equal(0);
            (0, chai_1.expect)(position.oa).to.equal(0);
            (0, chai_1.expect)(position.bd).to.equal(0);
            (0, chai_1.expect)(position.ral).to.equal(0);
            (0, chai_1.expect)(position.recFromSale).to.equal(-240000);
            (0, chai_1.expect)(position.cashflow).to.equal(-240000);
        });
    });
    describe('calculateAssetPosition(SHARE_2)', function () {
        it('should return correct numbers', function () {
            var testAsset_share_2 = {
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
            };
            var position = (0, index_1.calculateAssetPosition)(testAsset_share_2);
            (0, chai_1.expect)(position.nav).to.equal(0);
            (0, chai_1.expect)(position.coa).to.equal(0);
            (0, chai_1.expect)(position.oav).to.equal(0);
            (0, chai_1.expect)(position.oavr).to.equal(0);
            (0, chai_1.expect)(position.oavi).to.equal(0);
            (0, chai_1.expect)(position.oa).to.equal(0);
            (0, chai_1.expect)(position.bd).to.equal(0);
            (0, chai_1.expect)(position.ral).to.equal(0);
            (0, chai_1.expect)(position.recFromSale).to.equal(40000);
            (0, chai_1.expect)(position.cashflow).to.equal(40000);
        });
    });
    describe('calculateAssetPosition(SHARE_3)', function () {
        it('should return correct numbers', function () {
            var testAsset_share_3 = {
                assetType: "share",
                shares: [
                    { nrOfParts: 1000, pricePerPart: 120 },
                    { nrOfParts: 1000, pricePerPart: 125 },
                    { nrOfParts: 1000, pricePerPart: 130 },
                    { nrOfParts: -1000, pricePerPart: 135 },
                ],
                oavr: 50000,
                oavi: 10000,
            };
            var position = (0, index_1.calculateAssetPosition)(testAsset_share_3);
            (0, chai_1.expect)(position.nav).to.equal(290000);
            (0, chai_1.expect)(position.coa).to.equal(0);
            (0, chai_1.expect)(position.oav).to.equal(250000);
            (0, chai_1.expect)(position.oavr).to.equal(50000);
            (0, chai_1.expect)(position.oavi).to.equal(10000);
            (0, chai_1.expect)(position.oa).to.equal(0);
            (0, chai_1.expect)(position.bd).to.equal(0);
            (0, chai_1.expect)(position.ral).to.equal(0);
            (0, chai_1.expect)(position.recFromSale).to.equal(-240000);
            (0, chai_1.expect)(position.cashflow).to.equal(-240000);
        });
    });
});
