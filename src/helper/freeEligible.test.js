import { isFreeElegible } from "./freeEligible"

describe("check free eligibility", () => {
    it("should be eligible", () => {
        const eligibility = isFreeElegible(1622830033000, 1632220033000);
        expect(eligibility).toBe(true);
    })
    it("should not be eligible", () => {
        const eligibility = isFreeElegible(1622830033000, 1633420033000);
        expect(eligibility).toBe(false);
    })
})