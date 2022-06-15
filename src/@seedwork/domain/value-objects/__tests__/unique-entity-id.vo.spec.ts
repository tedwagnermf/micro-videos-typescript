import InvalidUuidError from "../../errors/invalid-uuid.error";
import UniqueEntityId from "../unique-entity-id.vo";
import { validate as uuivalidate } from "uuid";

function spyValidateMethod() {
    return jest.spyOn(UniqueEntityId.prototype as any, "validate");
}

describe("UniqueEntityId Unit Tests", () => {
    // ficar de olho no clearMocks: true no jest.config.ts
    // beforeEach(() => {
    //     jest.clearAllMocks();
    // });

    it("should throw error when uuid is invalid", () => {
        const validateSpy = spyValidateMethod();
        expect(() => new UniqueEntityId("fake id")).toThrow(new InvalidUuidError());
        expect(validateSpy).toHaveBeenCalled();
    });

    it("should accept a uuid passed in constructor", () => {
        const validateSpy = spyValidateMethod();
        const uuid = "c6f9bab9-b5dd-42b5-a626-c7bf916a3c99";
        const vo = new UniqueEntityId(uuid);
        expect(vo.value).toBe(uuid);
        expect(validateSpy).toHaveBeenCalled();
    });

    it("should accept a uuid not passed in constructor", () => {
        const validateSpy = spyValidateMethod();
        const vo = new UniqueEntityId();
        expect(uuivalidate(vo.value)).toBeTruthy();
        expect(validateSpy).toHaveBeenCalled();
    });

});