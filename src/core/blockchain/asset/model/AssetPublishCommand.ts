interface AssetPublishCommand {
    asset: any;
    operation: string;
    user: any;
    eventId: string;
    expectedSupplyDelta: number
}

export{AssetPublishCommand};