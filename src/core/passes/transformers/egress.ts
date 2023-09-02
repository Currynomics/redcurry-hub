const LIMITED_EDITION_PASS_TITLES = ["RED EGG", "EARLY BIRD"]

const WHITELISTED = "WHITELISTED"
const REDLISTED = "REDLISTED"
const RED_EGG = "RED EGG"
const EARLY_BIRD = "EARLY BIRD"

const transformToTokenMetadata = (doc: any) => {
    try {

        var edition=""
        if(LIMITED_EDITION_PASS_TITLES.includes(doc.title)) edition ="Limited"
        else edition = "Early"

        var access = ""
        if(doc.title == REDLISTED || doc.title == WHITELISTED) access = "DAO Sale"
        else access = "Early"

        return {
            name: doc.title + " #" + doc.tokenId,
            external_url: "https://app.redcurry.co/api/passes/" + doc.id,
            description: doc.description,
            image: doc.imgUrl,
            attributes: [
                {
                    trait_type: "Badge type",
                    value: doc.title
                },
                {
                    trait_type: "Edition",
                    value: edition
                },
                {
                    trait_type: "Access",
                    value: access
                },
                {
                    trait_type: "Edition",
                    value: Number(doc.tokenId)
                },
            ]
        }
    } catch (error) {
        console.error(error.message);
        throw Error(error.message)
    }
}

export {transformToTokenMetadata}