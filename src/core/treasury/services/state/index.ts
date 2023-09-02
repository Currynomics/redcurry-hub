import { getTreasuryStats } from "../.."
import { EVENT_LEVELS, reportIssue } from "../../../util/reporting"
const ASSET_DENOM = 100
const TOKEN_DENOM = 100000000
const STATE_POSITION_VALUE_DIFF_THRESHOLD = 0.1
/**
 * Simple check to see if NAPT == position / supply
 */
const checkTreasuryStateCorrectness = async () => {
    try {
        const stats = await getTreasuryStats()
        // console.log("checkTreasuryStateCorrectness | stats: ", stats)
        const positionValueCalculated = ((stats.supply.value / TOKEN_DENOM) * (stats.napt.value / TOKEN_DENOM)) * ASSET_DENOM
        // console.log("checkTreasuryStateCorrectness | positionValueCalculated: ", positionValueCalculated)
        
        if (Math.abs(positionValueCalculated - stats.position.value) <=  STATE_POSITION_VALUE_DIFF_THRESHOLD) return true
        reportIssue({ msg: "On-chain NAPT is unbalanced to supply and position", level: EVENT_LEVELS.critical, code: "B_Treasury_napt_01", trace: "checkTreasuryStateCorrectness() | naptReal is unbalanced to position / supply." })
    } catch (error) {
        // console.error("checkTreasuryStateCorrectness > error [C_Treasury_state_01]: ", error)
        reportIssue({ msg: "Cannot check treasury state", level: EVENT_LEVELS.medium, code: "C_Treasury_state_01", trace: "checkTreasuryStateCorrectness() > error: " + error.message })
    }
    return false
}

export { checkTreasuryStateCorrectness }