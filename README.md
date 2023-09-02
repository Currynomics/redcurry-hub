# Redcurry Asset Management

## Table of Contents
1. [Introduction](#introduction)
2. [How It Works](#how-it-works)
3. [Requirements](#requirements)
4. [Technology](#technology)
5. [Data Management](#data-management)
6. [Additional Sections](#additional-sections)
7. [License](#license)

# Introduction
Redcurry's asset management and tokenization platform powers the Redcurry digital currency backed by commercial real estate assets. This README provides an overview of the Redcurry system, its smart contracts, and how it maintains a stable backing of Redcurry and the commercial real estate portfolio.

### What Redcurry system aims to solve?
Redcurry offers a stable store of value and its transfer a for the general public.
Redcurry together with this software aims to:
* Provide real world asset (RWA) inclusive asset tracking and oracle.
* Increase access to financial assets for underbanked users.
* Enable the tokenization of real world assets.
* Oracle and price discovery for the value of RWAs (e.g. commercial real estate)

# How It Works
## Concept
The fundamental concept behind Redcurry is to create a currency (or means of payment), which is appreciating in value but without making it a security. To disqualify as a security, the Redcurry token cannot provide Redcurry token holders with any rights to the assets backing its value. Read more on the legalities of Redcurry.

But if the Redcurry token does not represent any rights, how is the value of it backed by real estate? The solution is enabled by the legal structure below and the technology described in the later chapters.


The following diagram represent the high level architecture or Redcurry’s asset tracking and reporting system.
![image](https://docs.redcurry.co/media/img/redc_arch.png)
*Diagram 1: decentralized and distributed asset management architecture.*

## Supply Rules
* Tokens can only be issued (minted) or redeemed (bought back and burned) at the actual Net Asset Value (NAV) per token (NAPT).
* NAPT is determined by the on-chain asset and supply tracking smart contract. Learn more about [Governor Contract](https://github.com/Currynomics/red-contracts) 
* Redcurry can only be minted and burned by the [Governor Contract](https://github.com/Currynomics/red-contracts)
* The system has no expiration date.

# Requirements
## Non-Functional Requirements
This software has to successfully carry out the following requirements:
* Meet Currynomics cybersecurity principles.
* Allow secure and transparent reporting of Redcurry token and its reserve assets on Polygon and XRPL.
* Integrate with institutional grade digital asset management services (e.g. Fireblocks).
* Integrate with Redcurry [Governor Smart Contract](https://github.com/Currynomics/red-contracts)

## Functional Requirements
* Issue (mint) Redcurry on-chain membership badges (as NFTs)
* Report Redcurry reserve assets on-chain per asset basis.
* Support multi-agent activity inc roles and fine grained access control.
* Provide RESTful API for all admin dashboard activities.
* Provide admin dashboard UI.  

## Constraints
* Act as an interface between blockchain and user and not attempt to simulate any accounting software.

# Technology
## Asset Tracking Architecture
The primary purpose of on-chain asset tracking is to introduce transparency, decentralization, and immutability. All smart contracts are developed on an EVM-compatible blockchain using the ERC20 and ERC720 standards. Development of XRPL support has started. 

## Tech Stack
* Frameworks: PayloadCMS
* Services: Alchemy, Moralis
* Languages: Javascript: NodeJS, Typescript, React
* Orchestration: Docker

# Data Management

## Asset Tracking
Redcurry's accounting methods and principles adhere to local GAAP and International Financial Reporting Standards (IFRS) to track all assets under management (AUM). These assets can range from cash (liabilities, receivables, cash on account) to non-cash assets (shares in funds, securities, other long-term assets, etc.). The data is managed using off-chain tools such as Inveniam.io, MS Power BI, Excel, and other renowned accounting software.

## Essential Information
For calculating the NAV, which ultimately determines the real value of the Redcurry token, essential information is derived from the extensive set of accounting data. This information includes:

- Original acquisition value (OAV)
- OAV Impairment (OAV-I)
- Other long-term assets (OLTA)
- Other short-term assets (OSTA)
- Receivables (REC)
- Liabilities (LIA)
- Cash on accounts (COA)

## NAV Calculation
Using the essential information defined above, the net asset value of individual assets are calculated usign the following formula.
> NAV_asset= OAV - OAVI + OLTA + OSTA + REC - LIA + COA

Total NAV is made up of all the individual asset NAVs and is calculated using the formula below.
> NAV_total = NAV_asset1 + NAV_asset2 + … + NAV_assetN

Net asset per token is calculated by dividing the total NAV with the total supply. This is also the officially reported price of the token.
> NAPT = NAV_total / SUPPLY_token


## Essential Actors
Essential actors are individuals responsible for deriving essential information and publishing it on the blockchain. They include:

- Property Manager
- Asset Manager
- Accountant
- Redcurry Executive Member
- Auditors (Internal and External)

## Asset Reporting
Assets are reported on the public blockchain either weekly or monthly, depending on the asset type. Essential actors need to sign off on these transactions.

## Reporting Period
Asset updates are generally reported monthly. An end-of-the-year (EOY) report is also published, requiring additional sign-offs from an auditor and a Redcurry board member.

## Reporting Technology
Redcurry uses an EVM-compatible public blockchain for transparent and immutable reporting. The smart contracts used for this purpose are the Proof of Reserves (POR) Smart Contract and the Governor Smart Contract.

## Transaction Fee
A transaction fee of 0.02% is levied on all Redcurry transactions, which goes into the Currynomics treasury.


# Additional Sections
1. [About Payload](#about-payload)
1. [FAQ](#faq)
1. [Support](#support)
1. [Demo](#demo)
1. [Commands](#commands)
1. [Fireblocks](#fireblocks)


## About Payload
### Sources and links
Creating custom views   : https://github.com/payloadcms/payload/discussions/696

### API Documentation
*For API documentation, contact contact@redcurry.co*

## FAQ
*For FAQ, visit [Linktree](linktr.ee/redcurry) or [Docs](docs.redcurry.co)*

## Support
For any queries or support, please contact [Redcurry Support](contact@redcurry.co).



## Demo
Access latest demo at https://stage.admin.redcurry.co

## Commands
### Deployment
1. Run 

``` npm run generate:types ```

2. Run 

``` npm run build ```

3. Push code to /staging branch
4. Northflank CI/CD pipeline will take care of the rest.

### Installation
```
git clone https://github.com/Redcurry/asset-management.git
cd asset-management
npm install
``` 

## Fireblocks
### Documentation
API: https://docs.fireblocks.com/api/swagger-ui/

# License
UNLICENSED, all rights reserved.

*The creator of this work retains all the rights provided by copyright law, and no one else can use, modify, or distribute the work without explicit permission from the creator.*

---
This README aims to be a comprehensive guide to understanding the Redcurry system, its smart contracts, and its functionalities. For more details, you can refer to the official documentation.

For more information, please visit [Redcurry Official Website](#redcurry.co).
---
