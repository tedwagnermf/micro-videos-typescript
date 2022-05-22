import ValueObject from "../value-object"

class StubValueObject extends ValueObject {
}

describe("ValueObject Unit Testes", () => {
    it("should set value", () => {
        let vo = new StubValueObject("string value");
        expect(vo.value).toBe("string value");

        vo = new StubValueObject({ prop1: "value1" });
        expect(vo.value).toStrictEqual({ prop1: "value1" });
    });

    it("should convet to a string", () => {
        const date = new Date();
        let arrange = [
            {receveid: null, expected: "null"},
            {receveid: undefined, expected: "undefined"},
            {receveid: "", expected: ""},
            {receveid: "fake test", expected: "fake test"},
            {receveid: 0, expected: "0"},
            {receveid: 1, expected: "1"},
            {receveid: 5, expected: "5"},
            {receveid: true, expected: "true"},
            {receveid: false, expected: "false"},
            {receveid: date, expected: date.toString()},
            {
                receveid: { prop1: "value1" }, 
                expected: JSON.stringify({ prop1: "value1" })
            },
        ]

        arrange.forEach(value => {
            const vo = new StubValueObject(value.receveid);
            expect(vo + "").toBe(value.expected);
        });

        it("imutable", () => {
            const vo = new StubValueObject({prop1: "value1", nested: {prop2: new Date()}});
            vo["_value"].nested.prop2 = "mudou";
            console.log(vo);
        });
    });

}); 