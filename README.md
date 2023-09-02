# Redcurry Asset Management

## Table of Contents
1. [Introduction](#introduction)
2. [How It Works](#how-it-works)
3. [Requirements](#requirements)
4. [PoC on XRPL](#proof-of-concept-proposal-for-xrpl)
5. [Technology](#technology)
6. [Data Management](#data-management)
7. [Additional Sections](#additional-sections)
8. [License](#license)

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

# Proof of Concept Proposal for XRPL

## Architecture Description
### Components
1. **Redcurry Hub**: The on-chain supply and its underlying reserve asset control and administration software.
2. **Governor Contract**: Smart contract on Polygon that controls the supply of Redcurry tokens.
3. **Assets Contract**: Smart contract on Polygon that manages the underlying assets for Redcurry.
3. **Token Contract**: Smart contract (ERC20) on Polygon that is the Redcurry currency.
4. **RedBridge**: A bridge smart contract on Polygon that locks Redcurry tokens and triggers an event for issuing IOUs on XRPL.
5. **Moralis Stream**: Captures the event triggered by RedBridge and triggers a webhook.
6. **Webhook Endpoint**: An endpoint in the Redcurry Hub that receives the Moralis webhook and issues IOUs on XRPL.
7. **XRPL Javascript Client**: Used by the Redcurry Hub to issue IOUs on the XRP Ledger.

### User Stories

#### 1) New Supply of Redcurry Needs to be Issued on XRPL

1. A user interacts with the Redcurry Hub to initiate the issuance of new Redcurry tokens on XRPL.
2. The Hub interacts with the Governor and Assets contracts on Polygon to validate and approve the issuance.

#### 2) New Asset Comes into Redcurry

1. An external event (e.g., cash payment) triggers the need for new assets to be added to the Redcurry reserve.
2. The Assets contract on Polygon is updated to reflect the new asset.

#### 3) New Asset is Created or Existing Asset is Updated

1. The user marks this Redcurry to be issued on XRPL by setting the recipient (mint direct) to the XRPL Bridge Smart Contract on Polygon (RedBridge).

#### 4) Governor Contract is Transacted With

1. The Governor contract on Polygon is transacted with, and the new supply of Redcurry tokens is sent to the RedBridge.

#### 5) Bridge Locks Redcurry on Polygon

1. RedBridge locks the Redcurry tokens on Polygon and publishes an event.

#### 6) Event is Captured by Moralis Stream

1. The Moralis stream captures the event published by RedBridge and triggers a webhook.

#### 7) Webhook Calls Redcurry Hub's Endpoint

1. The webhook calls the Redcurry Hub's endpoint (e.g., `/moralis/stream/bridge/p2x`).

#### 8) Issue New IOUs on XRPL

1. Using the XRPL Javascript Client, the Redcurry Hub issues new IOUs (Redcurry on XRPL) to the recipient wallet on XRPL.

### Constraints & Limitations

1. The supply of Redcurry tokens is only controlled by the Governor smart contract and indirectly via the Assets smart contract. No duplication of this business logic on XRPL is desired at this phase.
2. Redcurry will be issued on Polygon first, locked into RedBridge, and then issued as an IOU on XRPL when the bridge lock is confirmed via a contract event.
3. The bridge is one-way during the PoC phase; Redcurry can be moved to XRPL but not back.

### Future Considerations

1. Develop the bridge's second lane to enable movement from XRPL back to Polygon.
2. Become a stablecoin issuer on XRPL to gain several business advantages.

By following this architecture and these user stories, the PoC aims to demonstrate the feasibility of issuing Redcurry as an IOU on the XRP Ledger while maintaining the existing smart contract infrastructure on Polygon.


# Technology
## Asset Tracking Architecture
The primary purpose of on-chain asset tracking is to introduce transparency, decentralization, and immutability. All smart contracts are developed on an EVM-compatible blockchain using the ERC20 and ERC720 standards. Development of XRPL support has started. 

## Tech Stack
* Frameworks: PayloadCMS
* Services: Alchemy, Moralis
* Languages: Javascript: NodeJS, Typescript, ReactJS
* Orchestration: Docker
* Libraries: XRPL JS Client, Fireblocks.

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
